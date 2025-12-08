const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkUsers() {
  try {
    const users = await prisma.auth.findMany({
      select: {
        referCode: true,
        email: true,
        area: true,
        status: true,
      },
      take: 10
    });
    
    console.log('Usuarios encontrados:');
    console.table(users);
    
    // Encontrar un usuario de área institución para hacer login
    const institutionUser = users.find(user => user.area === 'institution');
    if (institutionUser) {
      console.log('\nUsuario de institución encontrado:');
      console.log(institutionUser);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();