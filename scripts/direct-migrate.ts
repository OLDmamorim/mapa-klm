import postgres from 'postgres';
import { readFileSync } from 'fs';

async function runDirectMigration() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL not set");
    process.exit(1);
  }

  console.log("Connecting to database...");
  
  // Remove channel_binding if present and configure SSL properly
  let connectionString = process.env.DATABASE_URL;
  connectionString = connectionString.replace(/&?channel_binding=require/g, '');
  
  const sql = postgres(connectionString, { 
    max: 1,
    ssl: 'prefer', // Use 'prefer' instead of 'require'
    connect_timeout: 10,
  });

  try {
    console.log("Reading migration file...");
    const migrationSQL = readFileSync('./drizzle/0000_bouncy_purifiers.sql', 'utf-8');
    
    console.log("Executing migration...");
    await sql.unsafe(migrationSQL);
    
    console.log("✓ Migration applied successfully");
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  } finally {
    await sql.end();
  }
  
  process.exit(0);
}

runDirectMigration().catch((error) => {
  console.error("Failed:", error);
  process.exit(1);
});

