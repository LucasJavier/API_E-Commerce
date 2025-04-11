// test-socket.ts
import { io } from 'socket.io-client';
import axios from 'axios';

// Configuración
const ADMIN_TOKEN = 'eyJraWQiOiJcL0Jsa3BQamMzd05ZVXBRTENZamkwTmhlQWloMFwvbzNCMU5wZ3d6T2tadEk9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiIyNDM4ZjQ3OC1hMDAxLTcwMWYtN2JkZC0wNzBmYzYzMmYzOGUiLCJjb2duaXRvOmdyb3VwcyI6WyJBZG1pbiJdLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfelRCZ3JTUThvIiwiY29nbml0bzp1c2VybmFtZSI6IjI0MzhmNDc4LWEwMDEtNzAxZi03YmRkLTA3MGZjNjMyZjM4ZSIsInByZWZlcnJlZF91c2VybmFtZSI6Ikx1Y2FzIiwib3JpZ2luX2p0aSI6ImVmNzQxMjVhLWRiZDUtNGRmZC05OTU4LThlNGZjZDc2MjFhZiIsImF1ZCI6IjJ0M2k0OTlnMGE5dWo3amY1b2RlZGhwMWVsIiwiZXZlbnRfaWQiOiJlOWRlMDZiNS1lNjAxLTQ0M2UtODRjYS1hM2JlNWFlMjQ4MmQiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTc0NDM3MjI5MywiZXhwIjoxNzQ0Mzc1ODkzLCJpYXQiOjE3NDQzNzIyOTMsImp0aSI6IjhkMGU0ODFhLWNkMDItNDhlYS1hNGFmLWFkZjU2ZTJmYmNkZSIsImVtYWlsIjoibHVjYXNqYXZpZXJAeW9wbWFpbC5jb20ifQ.HXrwk9J-kZhrrNWP7Grvu2xXKtJnFwxhF-MR9bq_4dx0HTTltiSQKCIwTVeMuBZ_D0V5VweGMZZRS3muvu4swskocOll2MKPg8YEOdcQmTmgAuqYO9pXTtq7PBpNPr28_MXNX-cjvUbahRXXlD4tqhmXB7eauH2n6Dz5yDqq4gS6x-1V58vcRhUGOIPWT_fxP6Op47FiphxEcYBmy5eg8TsWO76BufTrl3kR8A_IRrxDA7J4_aCfRXOzZTyjMDAZiFH4Af1RYYeXWQ8ro_hiKLsJDrKRPGwok2NXioCCif9Hk2kFxIp0WCFtjr1LP68KMfCtp7mK6VOOutPgUbqnKg';  // Reemplazar con token real
const USER1_TOKEN = 'eyJraWQiOiJcL0Jsa3BQamMzd05ZVXBRTENZamkwTmhlQWloMFwvbzNCMU5wZ3d6T2tadEk9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiJiNDQ4MTQ0OC05MDUxLTcwNTYtNzRmOC1mMmI1OTJhMWQzMTgiLCJjb2duaXRvOmdyb3VwcyI6WyJVc2VyIl0sImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV96VEJnclNROG8iLCJjb2duaXRvOnVzZXJuYW1lIjoiYjQ0ODE0NDgtOTA1MS03MDU2LTc0ZjgtZjJiNTkyYTFkMzE4IiwicHJlZmVycmVkX3VzZXJuYW1lIjoiTWFyaWFubyIsIm9yaWdpbl9qdGkiOiJhZmJkNmVlZi02ZDk3LTQzOTctOWFjMi1lZWQwOTE3NmY5NWMiLCJhdWQiOiIydDNpNDk5ZzBhOXVqN2pmNW9kZWRocDFlbCIsImV2ZW50X2lkIjoiOWZiNzE2MDctMjY5MC00MDU3LTkxNTQtNjgwNjI4OTQ4Nzc4IiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE3NDQzNzIzMjMsImV4cCI6MTc0NDM3NTkyMywiaWF0IjoxNzQ0MzcyMzIzLCJqdGkiOiI1MDVkMmFmYS05NjlhLTQzZDAtODU4My1mNzc3Y2E0ZjcxYjgiLCJlbWFpbCI6Im1hcmlhbm9AeW9wbWFpbC5jb20ifQ.Wz7wZJAfCmGxaD8o2ao4q-BDRvxhop5oBdCvTePQGJB33nW0VlRcghL-cdD39BiPqnrKxpIPQqtuJhktLWdOtZwK20NcyEtiv4wLOL59d-Ms0ktOSnymz72Zh4vkIJ6C144JhvswRAY7YnIZ4vIB1gi6t_ktaRsASTXD75DVZ71nep8H1Tn09mhHrw0i-4rcnpNldF7QPvXEzBFVO58qa69t-LiQeAW8jKr9uxkTccCx_S2uL4sYrcMuPRUdksglv7oTwV_Ibde5QnJORBm_Qg6LaUFin4nD8Qw-RCWCdGSXmiZB1SGgPtK5NtpxaQtvlfGKwOudJ0QpU8qGhX-kCg'; 
const USER2_TOKEN = 'eyJraWQiOiJcL0Jsa3BQamMzd05ZVXBRTENZamkwTmhlQWloMFwvbzNCMU5wZ3d6T2tadEk9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiI3NGQ4ODQxOC01MDgxLTcwYzgtMTQ0My0wNTYyNTQyNGI3NTkiLCJjb2duaXRvOmdyb3VwcyI6WyJVc2VyIl0sImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV96VEJnclNROG8iLCJjb2duaXRvOnVzZXJuYW1lIjoiNzRkODg0MTgtNTA4MS03MGM4LTE0NDMtMDU2MjU0MjRiNzU5IiwicHJlZmVycmVkX3VzZXJuYW1lIjoiTWF0ZW8iLCJvcmlnaW5fanRpIjoiYWNkODdiZjEtYTQ2OS00MDk0LWJiYTEtNjZmNTY4MTBkOWYzIiwiYXVkIjoiMnQzaTQ5OWcwYTl1ajdqZjVvZGVkaHAxZWwiLCJldmVudF9pZCI6Ijg1ZWZjNzI0LTIyZGItNGNjOC1iZGQ1LTNiYThkYjViYmExZCIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNzQ0MzcyMzM2LCJleHAiOjE3NDQzNzU5MzYsImlhdCI6MTc0NDM3MjMzNiwianRpIjoiMjBjMjI1NTItNjc2ZS00NTE2LWFjMmUtMTY5NGFhNzZlZmY5IiwiZW1haWwiOiJtYXRlb0B5b3BtYWlsLmNvbSJ9.NpLWGH8P6h1X_nRg6IaojvG7ecj0rI0NzRhxrAQiMns-JpFSnx31KhfX674aT6Qg4KpllQM5uVDRKeg5hhj_14couzqVYg_Jcy_NhKnxcoCnjbdUwwuiajZsk4RT7yyxye0sNdawF67HtKrHN2YtrBcm9sJym3VQyIcpq5HrVfbhcBbdb6RzK6RF6rhA36EupJW5xpXWCd2fGLJkx-4cxVV4nO4dwo2pgV3MP7WvGt0MigPek-cCeBAylIrkCezMGJABDxmyaQtfpamXQ9uzPZNTrgsTFfk99XzU6b6dKcDRxv2riK2zxr9B64TXeKiqOXWdDmqxgyugwgelJfZxzA';
const USER3_TOKEN = 'eyJraWQiOiJcL0Jsa3BQamMzd05ZVXBRTENZamkwTmhlQWloMFwvbzNCMU5wZ3d6T2tadEk9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiI5NDk4NDQyOC0zMDUxLTcwMzgtMzI1MS03MzQ4NDIxYWViMDUiLCJjb2duaXRvOmdyb3VwcyI6WyJVc2VyIl0sImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV96VEJnclNROG8iLCJjb2duaXRvOnVzZXJuYW1lIjoiOTQ5ODQ0MjgtMzA1MS03MDM4LTMyNTEtNzM0ODQyMWFlYjA1IiwicHJlZmVycmVkX3VzZXJuYW1lIjoiTG9yZW56byIsIm9yaWdpbl9qdGkiOiI2MzcyMDgxOC1lZDQyLTRhYjUtOTllNC0xNTU3NmVlNGJmMmEiLCJhdWQiOiIydDNpNDk5ZzBhOXVqN2pmNW9kZWRocDFlbCIsImV2ZW50X2lkIjoiNjYwY2Q5ZjYtNTJjZS00YzRkLTg4ZTItM2E3MjQ3NDVkYzdkIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE3NDQzNzIzNTEsImV4cCI6MTc0NDM3NTk1MSwiaWF0IjoxNzQ0MzcyMzUxLCJqdGkiOiI3OWY4YjkzOS0yODRmLTQwMTEtOGFjYS1mMjNjNzY0ZGM0ZjIiLCJlbWFpbCI6ImxvcmVuem9AeW9wbWFpbC5jb20ifQ.mwy_-NrO3mLG6rvn_U630d9fuI-qEVBdQo23Ll-XT9tiOaAmbHl91dxfuxOG91aokzC7cmD7dRmQ-zpUFVjWFl_cjH4lSj6Q2yVt1gChKLGzrTU8YELVCNfmajMPnYNHGjnAQC_B5evb-RyV4O1aRIgi-NRb3MrQ1p7Uhi6M1aVzzgJ-yqRCCZNhU2uixg-znQ2hx8pLWjckuV57kUi4jqS0H7AEeCIwBjFWl2zRpR6wq1Q-wg3qQFBSXFIIRJ-I6t4-6GfPngm0Ax7AzGt6NCU9ubZ2YaDY00c3ix7MJC4QL0BkJpfC8gwYFD_N27l4BbZa6dSWFyD71xfMugjSJw';
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
const wishlistIds = [1,2,3];
const cartIds = [1,2,3];


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