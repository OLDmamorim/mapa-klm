import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';

async function runMigrations() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL not set");
    process.exit(1);
  }

  console.log("Connecting to database...");
  const sql = postgres(process.env.DATABASE_URL, { 
    max: 1, 
    ssl: { rejectUnauthorized: false },
    connection: {
      application_name: 'mapa-klm'
    }
  });
  const db = drizzle(sql);

  console.log("Running migrations...");
  await migrate(db, { migrationsFolder: './drizzle' });
  
  await sql.end();
  console.log("✓ Migrations applied successfully");
  process.exit(0);
}

runMigrations().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});

