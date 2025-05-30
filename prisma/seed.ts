import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = [
    {
      name: '홍길동'
    },
    {
      name: '김영희'
    },
    {
      name: '박철수'
    },
    {
      name: '이은정'
    },
    {
      name: '최민수'
    },
    {
      name: '김서웅'
    },
    {
      name: '현진영'
    },
    {
      name: '진유민'
    },
    {
      name: '이종현'
    },
  ];

  for (const user of users) {
    await prisma.users.create({
      data: {
        ...user,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });