import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Colaboradores da empresa
 */
export const colaboradores = mysqlTable("colaboradores", {
  id: int("id").autoincrement().primaryKey(),
  codigo: varchar("codigo", { length: 10 }).notNull().unique(),
  nome: varchar("nome", { length: 255 }).notNull(),
  loja: varchar("loja", { length: 255 }).notNull(),
  funcao: varchar("funcao", { length: 100 }).notNull(),
  empresa: varchar("empresa", { length: 255 }).notNull().default("Expressglass SA"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Colaborador = typeof colaboradores.$inferSelect;
export type InsertColaborador = typeof colaboradores.$inferInsert;

/**
 * Relatórios de despesas de KM
 */
export const relatorios = mysqlTable("relatorios", {
  id: int("id").autoincrement().primaryKey(),
  colaboradorId: int("colaboradorId").notNull(),
  data: varchar("data", { length: 10 }).notNull(), // YYYY-MM-DD
  matricula: varchar("matricula", { length: 20 }).notNull(),
  localidade: varchar("localidade", { length: 255 }).notNull(),
  motivo: text("motivo").notNull(),
  klm: int("klm").notNull(),
  valorPorKm: int("valorPorKm").notNull().default(36), // 0.36€ stored as 36 cents
  totalDespesas: int("totalDespesas").notNull(), // stored in cents
  pdfUrl: text("pdfUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Relatorio = typeof relatorios.$inferSelect;
export type InsertRelatorio = typeof relatorios.$inferInsert;

