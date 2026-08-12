import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/db";

async function main() {
  const email = "admin@physioconnect.com";
  const plainPassword = "ChangeThisPassword123!";

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log("An admin with this email already exists — nothing to do.");
    return;
  }

  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const admin = await prisma.user.create({
    data: {
      name: "Admin",
      email,
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("Admin account created:");
  console.log("  email:", admin.email);
  console.log("  password:", plainPassword, "(change this after first login)");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });