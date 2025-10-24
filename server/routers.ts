import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  colaboradores: router({
    list: publicProcedure.query(async () => {
      const { getAllColaboradores } = await import("./db");
      return getAllColaboradores();
    }),
    create: protectedProcedure
      .input(z.object({
        codigo: z.string(),
        nome: z.string(),
        loja: z.string(),
        funcao: z.string(),
        empresa: z.string().default("Expressglass SA"),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        const { createColaborador } = await import("./db");
        return createColaborador(input);
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        codigo: z.string().optional(),
        nome: z.string().optional(),
        loja: z.string().optional(),
        funcao: z.string().optional(),
        empresa: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        const { id, ...data } = input;
        const { updateColaborador } = await import("./db");
        await updateColaborador(id, data);
        return { success: true };
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        const { deleteColaborador } = await import("./db");
        await deleteColaborador(input.id);
        return { success: true };
      }),
  }),

  relatorios: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      const { getAllRelatorios } = await import("./db");
      return getAllRelatorios();
    }),
    create: publicProcedure
      .input(z.object({
        colaboradorId: z.number(),
        data: z.string(), // YYYY-MM-DD
        matricula: z.string(),
        localidade: z.string(),
        motivo: z.string(),
        klm: z.number(),
      }))
      .mutation(async ({ input }) => {
        const valorPorKm = 36; // 0.36€ in cents
        const totalDespesas = input.klm * valorPorKm;
        
        const { createRelatorio, getColaboradorById } = await import("./db");
        const { generateRelatorioPDF } = await import("./pdfGenerator");
        const { sendRelatorioEmail } = await import("./emailSender");
        
        // Get colaborador data
        const colaborador = await getColaboradorById(input.colaboradorId);
        if (!colaborador) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Colaborador não encontrado" });
        }

        // Generate PDF
        const pdfBuffer = await generateRelatorioPDF({
          colaborador,
          data: input.data,
          matricula: input.matricula,
          localidade: input.localidade,
          motivo: input.motivo,
          klm: input.klm,
          totalDespesas,
        });

        // Save to database
        const relatorio = await createRelatorio({
          ...input,
          valorPorKm,
          totalDespesas,
        });

        // Send email with PDF
        const adminEmail = process.env.ADMIN_EMAIL || "mamorim@expressglass.pt";
        await sendRelatorioEmail(
          adminEmail,
          colaborador.nome,
          input.data,
          pdfBuffer
        );
        
        return relatorio;
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        const { deleteRelatorio } = await import("./db");
        await deleteRelatorio(input.id);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
