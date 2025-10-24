import { drizzle } from "drizzle-orm/mysql2";
import { users } from "../drizzle/schema";
import { eq } from "drizzle-orm";

async function createAdmin() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL not set");
    process.exit(1);
  }

  const db = drizzle(process.env.DATABASE_URL);

  const adminEmail = "mamorim@expressglass.pt";
  const adminOpenId = "admin-mapa-klm-expressglass"; // Fake OpenID for manual admin

  console.log("Creating admin user...");

  try {
    // Check if admin already exists
    const existing = await db.select().from(users).where(eq(users.email, adminEmail)).limit(1);
    
    if (existing.length > 0) {
      console.log("Admin user already exists, updating role...");
      await db.update(users)
        .set({ role: "admin" })
        .where(eq(users.email, adminEmail));
    } else {
      console.log("Creating new admin user...");
      await db.insert(users).values({
        openId: adminOpenId,
        email: adminEmail,
        name: "Miguel Amorim",
        role: "admin",
        loginMethod: "manual",
      });
    }

    console.log("✓ Admin user created/updated successfully");
    console.log(`Email: ${adminEmail}`);
    console.log("Role: admin");
    process.exit(0);
  } catch (error) {
    console.error("Failed to create admin:", error);
    process.exit(1);
  }
}

createAdmin();

