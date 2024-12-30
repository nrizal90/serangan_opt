import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Insert Dummy Data for Roles
  const roles = [
    { id: uuidv4(), name: 'Admin' },
    { id: uuidv4(), name: 'User' },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { id: role.id }, // Gunakan 'id' sebagai unique identifier
      update: {},
      create: {
        id: role.id,
        name: role.name,
      },
    });
  }

  console.log('Inserted roles.');

  // Insert Dummy Data for Users
  const hashedPassword = await bcrypt.hash('P@ssw0rd', 10);

  const users = [
    {
      id: uuidv4(),
      nama: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      roleId: roles[0].id, // Menggunakan ID dari role 'Admin'
    },
    {
      id: uuidv4(),
      nama: 'Regular User',
      email: 'user@example.com',
      password: hashedPassword,
      roleId: roles[1].id, // Menggunakan ID dari role 'User'
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email }, // Gunakan 'email' sebagai unique identifier
      update: {},
      create: {
        id: user.id,
        nama: user.nama,
        email: user.email,
        password: user.password,
        roleId: user.roleId,
      },
    });
  }

  console.log('Inserted users.');

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
