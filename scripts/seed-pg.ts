import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { colaboradores } from "../drizzle/schema";

const colaboradoresData = [
  { codigo: "689", nome: "João Fonseca", loja: "PAREDES SM", funcao: "Técnico", empresa: "Expressglass SA" },
  { codigo: "1109", nome: "Nuno Oliveira", loja: "PAREDES SM", funcao: "Técnico", empresa: "Expressglass SA" },
  { codigo: "1179", nome: "Nuno Silva", loja: "PAREDES SM", funcao: "Técnico", empresa: "Expressglass SA" },
  { codigo: "1180", nome: "Rui Cunha", loja: "PAREDES SM", funcao: "Técnico", empresa: "Expressglass SA" },
  { codigo: "1181", nome: "Rui Pereira", loja: "PAREDES SM", funcao: "Técnico", empresa: "Expressglass SA" },
  { codigo: "1182", nome: "Sérgio Costa", loja: "PAREDES SM", funcao: "Técnico", empresa: "Expressglass SA" },
  { codigo: "1183", nome: "Tiago Martins", loja: "PAREDES SM", funcao: "Técnico", empresa: "Expressglass SA" },
  { codigo: "1184", nome: "Vitor Santos", loja: "PAREDES SM", funcao: "Técnico", empresa: "Expressglass SA" },
  { codigo: "1185", nome: "Alberto Ribeiro", loja: "PAREDES SM", funcao: "Técnico", empresa: "Expressglass SA" },
  { codigo: "1186", nome: "André Sousa", loja: "PAREDES SM", funcao: "Técnico", empresa: "Expressglass SA" },
];

async function seed() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL not set");
    process.exit(1);
  }

  console.log("Seeding colaboradores...");

  const client = postgres(process.env.DATABASE_URL, { ssl: 'prefer' });
  const db = drizzle(client);

  try {
    for (const colab of colaboradoresData) {
      await db.insert(colaboradores).values(colab).onConflictDoNothing();
    }

    console.log(\`✓ Seeded \${colaboradoresData.length} colaboradores successfully\`);
  } catch (error) {
    console.error("Seed failed:", error);
    throw error;
  } finally {
    await client.end();
  }

  process.exit(0);
}

seed().catch((error) => {
  console.error("Failed:", error);
  process.exit(1);
});
