// test-socket.ts
import { io } from 'socket.io-client';
import axios from 'axios';

// Configuración
const ADMIN_TOKEN = 'eyJraWQiOiJcL0Jsa3BQamMzd05ZVXBRTENZamkwTmhlQWloMFwvbzNCMU5wZ3d6T2tadEk9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiJkNDQ4NTRjOC04MDcxLTcwNGItNGI4OS02OWY5Yjg0ZDA0MzIiLCJjb2duaXRvOmdyb3VwcyI6WyJBZG1pbiJdLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfelRCZ3JTUThvIiwiY29nbml0bzp1c2VybmFtZSI6ImQ0NDg1NGM4LTgwNzEtNzA0Yi00Yjg5LTY5ZjliODRkMDQzMiIsInByZWZlcnJlZF91c2VybmFtZSI6Ikx1Y2FzMiIsIm9yaWdpbl9qdGkiOiJiY2E3NzdhNi1kNDhhLTQwNzctOTZjMC0wYzEwNzcxYThkNjUiLCJhdWQiOiIydDNpNDk5ZzBhOXVqN2pmNW9kZWRocDFlbCIsImV2ZW50X2lkIjoiMDg1NmMzYjUtYjhhYy00NmQ4LWIyNDMtMzc1ZmY0YmI4ZWQzIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE3NDQzODQ5NjcsImV4cCI6MTc0NDM4ODU2NywiaWF0IjoxNzQ0Mzg0OTY3LCJqdGkiOiIwZDgyNGY5OS1mNjM2LTRhM2UtYThjMy01OGNlMjYxZjAzMGIiLCJlbWFpbCI6Imx1Y2FzamF2aWVyMkB5b3BtYWlsLmNvbSJ9.lqqjtKBu-pocf4L90n2Ii37v2vL55vYgFY-Pr3qrZlSE5YkCeFUhtyiM3UTz56AQbKUDsrWWhSE4S-mAp73wfVo5KJ-XfilsgMls4duc974mlOBsIhsRqKlfGFGsh_WPFcGtGcupIzn17wmrsG7xJugChcLcwfw19_0-R93m6IODnVz1YjFtwMsP9_wp9ON-ZQKq3dyZ6gMbrr4E5S47IDFh0gflXYMvOL7oGOEledMWvBl6Niniy3y6P9dMhwH9DvVMbQpvLlt12JLDZtalMXeAQYZo8c-kyPl9U3CnU6rnHv9BxevlWIUiozGeXq8SkSBrCRaontcnhCsEE0J9ig';  // Reemplazar con token real
const USER1_TOKEN = 'eyJraWQiOiJcL0Jsa3BQamMzd05ZVXBRTENZamkwTmhlQWloMFwvbzNCMU5wZ3d6T2tadEk9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiJjNDc4MjRlOC0xMDkxLTcwZWMtMmJjNS00Yzg4ZGQ1YWE1MDIiLCJjb2duaXRvOmdyb3VwcyI6WyJVc2VyIl0sImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV96VEJnclNROG8iLCJjb2duaXRvOnVzZXJuYW1lIjoiYzQ3ODI0ZTgtMTA5MS03MGVjLTJiYzUtNGM4OGRkNWFhNTAyIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiTWFyaWFubzIiLCJvcmlnaW5fanRpIjoiOTVhM2FkMGEtNGJiMy00NzJmLTllYTgtMmI2ZmMwYTExMDIwIiwiYXVkIjoiMnQzaTQ5OWcwYTl1ajdqZjVvZGVkaHAxZWwiLCJldmVudF9pZCI6IjhkOWFmNzkzLTBiNGMtNDE5OS04ODlhLTg0NDg2OTNhNzBlZSIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNzQ0Mzg0OTg1LCJleHAiOjE3NDQzODg1ODUsImlhdCI6MTc0NDM4NDk4NSwianRpIjoiMDk1ZDAwM2UtMTA2Zi00NjI0LWIzMDUtZjU4NzJhOTY4NGFkIiwiZW1haWwiOiJtYXJpYW5vMkB5b3BtYWlsLmNvbSJ9.wMuf07x6ExU3HVngyPKcWnNvhAR-zxmVUJ3kuGjIkwJ8d02L7ziBrNvd11C2XW8616bcKklU0ZqXfnYNPA6Pmo2oVtlxjlMGUjLmcK3Zkw94gCXtgb2-MZwVTBUL2cP7Rd-K6phAqZRvwkAy8sNCzfqha-Ge5ip1MyH4Obc_QDjYHEdRZCZeIUp0xUx09NcICkkj_ywnbEyDr9_Si4u_6BjVE1xXiCzp6PA7ItzGPovF-hXkg1hHeVpDzM9ewvl6SHh6zMRtOo2iGMU5X68Om6lD3dhepPWCwe4dh6vAi1Z0fKpkFPEP8vLS9eopJ9HecFNTcq-SO-dNh25Ydpwd_g'; 
const USER2_TOKEN = 'eyJraWQiOiJcL0Jsa3BQamMzd05ZVXBRTENZamkwTmhlQWloMFwvbzNCMU5wZ3d6T2tadEk9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiJkNDQ4ZDRmOC1iMDcxLTcwMTMtNGMyNC1jYzU5ZTUwZDQxMzYiLCJjb2duaXRvOmdyb3VwcyI6WyJVc2VyIl0sImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV96VEJnclNROG8iLCJjb2duaXRvOnVzZXJuYW1lIjoiZDQ0OGQ0ZjgtYjA3MS03MDEzLTRjMjQtY2M1OWU1MGQ0MTM2IiwicHJlZmVycmVkX3VzZXJuYW1lIjoiTWF0ZW8yIiwib3JpZ2luX2p0aSI6Ijc0N2QyNjY3LWIzOTUtNDIzOS04Y2ZlLTYzN2M0MjhiOWYwNCIsImF1ZCI6IjJ0M2k0OTlnMGE5dWo3amY1b2RlZGhwMWVsIiwiZXZlbnRfaWQiOiIzOWI2MWNiZC0wMzY4LTQ5MDUtODI3ZC1jOWY0YTUwZGYyMmUiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTc0NDM4NTAwNiwiZXhwIjoxNzQ0Mzg4NjA2LCJpYXQiOjE3NDQzODUwMDYsImp0aSI6ImY4MzkzODczLTlkYjAtNDcxMC1iN2ZkLTNiM2RiNWJhYjQ2NCIsImVtYWlsIjoibWF0ZW8yQHlvcG1haWwuY29tIn0.QvO9xDv_vA67kDd2v4KQFrg3dhnKhku091l-2M1__-aXab3jpwH5660lQI68xJAqZo4XCJOallHuNOlT93SYQyZmH1-T8U4GINMlqz62n5toyJaeMQY1aSy2KaftrqVzcdS5EDZUA_zs8ew_AfEPvAAy9iKuQxAnhuOGPf7aEGFpTj7pYbRzwuEC2HyqiI5P-BNJxGHQDvwHT92c3l6F0BWRS1Qb_Mf3iuPC5mTHqUvxSAhsr5CZMUGJd2WX1kpaTUG1bKhJ3QdgDPkwnm8F0siVK4TDUI1Mk2QBnJeBeBNcHY7JAecIZTkyezbvPw3-GNRYMmEH3VAe9ihe7I0AtQ';
const USER3_TOKEN = 'eyJraWQiOiJcL0Jsa3BQamMzd05ZVXBRTENZamkwTmhlQWloMFwvbzNCMU5wZ3d6T2tadEk9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiIzNDA4YjRiOC03MDQxLTcwNGMtNTk2Ny1mMjhiODNjYjg5NGIiLCJjb2duaXRvOmdyb3VwcyI6WyJVc2VyIl0sImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV96VEJnclNROG8iLCJjb2duaXRvOnVzZXJuYW1lIjoiMzQwOGI0YjgtNzA0MS03MDRjLTU5NjctZjI4YjgzY2I4OTRiIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiTG9yZW56bzIiLCJvcmlnaW5fanRpIjoiY2ExMDg0ODUtMDU0Yi00YjE1LWFhMGYtMWU3YjQ4YTM4ZTYwIiwiYXVkIjoiMnQzaTQ5OWcwYTl1ajdqZjVvZGVkaHAxZWwiLCJldmVudF9pZCI6IjE1ZWM3ZWZkLThmNzgtNDlhYi1iODI3LTJhYzNhOTFmOTRmMSIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNzQ0Mzg1MDIwLCJleHAiOjE3NDQzODg2MjAsImlhdCI6MTc0NDM4NTAyMCwianRpIjoiNjllNDA0ZWEtOTI0ZC00NzBhLTkzYjAtMDBkYzgxMzZlNDU4IiwiZW1haWwiOiJsb3JlbnpvMkB5b3BtYWlsLmNvbSJ9.yNnDMmgDr6-4MPyNnPdRpKfYeo4mK8bsxwtnJ7klcb79V5UwyiyuL6hTOZoaoBNtzOhwMiOejjpMv8GzBFBOmQE9lWBNSOMhEXHR_io6JRn7aoHgNsAvNrlmpaS0x2v0sr42-YEQFcoYo881XEBDGS2jVni0gcekFPoSTLbc3fJFGJwwek9nUADgZ4Cxk8X1kZQTdTESUorAw9SgtyFuXCvGI0rs8-wW24KCl66F6saCnKeg4DK0T0fQ_R91VLQnr5tNb5KQOxQMkdo9cAsE88hE-Gbh2ClLwqXyWJgI3a4UZJfmgMLEXy_u5iLVocCmpWObYVm1GkGcdtuCTso2EA';
const PRODUCT_ID = 1; // ID del producto a monitorear

// 1. Cliente Admin (Monitorea el producto)
const adminSocket = io('ws://localhost:3000/admin', {
  auth: {
    token: ADMIN_TOKEN
  },
  transports: ["websocket"],
});

// 2. Clientes Usuarios (Simulan actividad)
const userSockets1 = io('ws://localhost:3000/user', {
    auth: {
      token: USER1_TOKEN
    },
    transports: ["websocket"],
});


const userSockets2 = io('ws://localhost:3000/user', {
  auth: {
    token: USER2_TOKEN
  },
  transports: ["websocket"],
});


const userSockets3 = io('ws://localhost:3000/user', {
  auth: {
    token: USER3_TOKEN
  },
  transports: ["websocket"],
});

const userSockets = [userSockets1, userSockets2, userSockets3];
const tokens = [USER1_TOKEN, USER2_TOKEN, USER3_TOKEN];
const wishlistIds = [2,3,4];
const cartIds = [2,3,4];


// Función para simular actividad de usuarios
async function simulateUserActivity(userSocket: any, index: number, token: string, wishlistId: number, cartId: number) {
    console.log(`👤 Usuario ${index + 1} simulando`);

    // Usuario comienza a ver el producto
    userSocket.emit('view-product', PRODUCT_ID);
  
    // Simular agregar a carrito (vía HTTP)
    setTimeout(async () => {
        try {
            await axios.post('http://localhost:3000/item-cart/add', { 
                cartId: cartId,
                productId: PRODUCT_ID,
                quantity: 1 
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log(`🛒 Usuario ${index + 1} agregó al carrito`);
        } catch (error) {
            console.error(`❌ Error en carrito (Usuario ${index + 1}):`, error.message);
        }
    }, 3000 + (index * 1000));

    // Simular agregar a wishlist (vía HTTP)
    setTimeout(async () => {
        try {
            await axios.post('http://localhost:3000/wishlist/add-product', {
                productId: PRODUCT_ID,
                wishlistId: wishlistId,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log(`❤️ Usuario ${index + 1} agregó a wishlist`);
        } catch (error) {
            console.error(`❌ Error en wishlist (Usuario ${index + 1}):`, error.message);
        }
    }, 5000 + (index * 1000));
}

async function cleanupTestData() {
  console.log('\n🧹 Limpiando datos de prueba...');
  
   try {
    for (const [index, token] of tokens.entries()) {
      try {
        const response = await axios.post('http://localhost:3000/wishlist/remove-product', {
            productId: PRODUCT_ID,
            wishlistId: wishlistIds[index],
          }, {
          headers: { 
            Authorization: `Bearer ${token}` 
          }
        });
        console.log(`✅ Wishlist ${wishlistIds[index]} limpiada`);
      } catch (error) {
        console.error(`❌ Error limpiando wishlist ${wishlistIds[index]}:`, error.response?.data?.message || error.message);
      }
    }
  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

// Configurar handlers para el Admin
adminSocket.on('connect', () => {
  console.log('Estado del socket admin:', adminSocket.connected);
  console.log('🛡️ Admin conectado. Suscribiendo al producto:', PRODUCT_ID);
  adminSocket.emit('subscribe-product', PRODUCT_ID);
});

adminSocket.on('product-stats', (stats) => {
  console.log('📊 Estadísticas en tiempo real:', {
    productId: stats.productId,
    viewers: stats.viewers,
    carritos: stats.cartCount,
    wishlists: stats.wishlistCount
  });
});

adminSocket.on('connect_error', (error) => {
  console.error('❌ Error de conexión en admin:', error.message);
});

adminSocket.on('error', (error) => {
  console.error('❌ Error en admin:', error);
});

// Configurar handlers para los Usuarios
userSockets.forEach((userSocket, index) => {
  userSocket.on('connect', () => {
    console.log(`👤 Usuario ${index + 1} conectado`);
    simulateUserActivity(userSocket, index, tokens[index], wishlistIds[index], cartIds[index]);
  });

  userSocket.on('disconnect', () => {
    console.log(`👤 Usuario ${index + 1} desconectado`);
  });
});

// Manejar cierre del script
process.on('SIGINT', async () => {
  console.log('\n🔌 Desconectando todos los clientes...');

  // Ciero el socket admin
  adminSocket.close();

  // Limpiar datos 
  await cleanupTestData(); 
  
  // Cerrar todos los sockets de usuarios
  userSockets.forEach(userSocket => userSocket.close())
  process.exit();
});

console.log('🚀 Iniciando prueba de WebSocket...');
console.log('Presiona Ctrl+C para detener la prueba\n');