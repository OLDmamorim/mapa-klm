import { integer, pgEnum, pgTable, text, timestamp, varchar, serial } from "drizzle-orm/pg-core";

/**
 * Core user table backing auth flow.
 */
export const roleEnum = pgEnum("role", ["user", "admin"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Colaboradores da empresa
 */
export const colaboradores = pgTable("colaboradores", {
  id: serial("id").primaryKey(),
  codigo: varchar("codigo", { length: 10 }).notNull().unique(),
  nome: varchar("nome", { length: 255 }).notNull(),
  loja: varchar("loja", { length: 255 }).notNull(),
  funcao: varchar("funcao", { length: 100 }).notNull(),
  empresa: varchar("empresa", { length: 255 }).notNull().default("Expressglass SA"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Colaborador = typeof colaboradores.$inferSelect;
export type InsertColaborador = typeof colaboradores.$inferInsert;

/**
 * Relatórios de despesas de KM
 */
export const relatorios = pgTable("relatorios", {
  id: serial("id").primaryKey(),
  colaboradorId: integer("colaboradorId").notNull(),
  data: varchar("data", { length: 10 }).notNull(),
  matricula: varchar("matricula", { length: 20 }).notNull(),
  localidade: varchar("localidade", { length: 255 }).notNull(),
  motivo: text("motivo").notNull(),
  klm: integer("klm").notNull(),
  valorPorKm: integer("valorPorKm").notNull().default(36),
  totalDespesas: integer("totalDespesas").notNull(),
  pdfUrl: text("pdfUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Relatorio = typeof relatorios.$inferSelect;
export type InsertRelatorio = typeof relatorios.$inferInsert;

