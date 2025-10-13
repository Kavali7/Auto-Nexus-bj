require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
async function main() {
  const vehicles = await prisma.vehicle.findMany({ take: 3 });
  console.log("rows", vehicles.length);
  await prisma.$disconnect();
}
main().catch(async (e) => {
  console.error("test error", e);
  await prisma.$disconnect();
  process.exit(1);
});
