// test-socket.ts
import { io } from 'socket.io-client';
import axios from 'axios';

// Configuración
const ADMIN_TOKEN = 'eyJraWQiOiJcL0Jsa3BQamMzd05ZVXBRTENZamkwTmhlQWloMFwvbzNCMU5wZ3d6T2tadEk9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiJjNDI4ODRiOC1kMDQxLTcwNDUtMWEzMS0wOTRiMWNiMzg5NzMiLCJjb2duaXRvOmdyb3VwcyI6WyJBZG1pbiJdLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfelRCZ3JTUThvIiwiY29nbml0bzp1c2VybmFtZSI6ImM0Mjg4NGI4LWQwNDEtNzA0NS0xYTMxLTA5NGIxY2IzODk3MyIsInByZWZlcnJlZF91c2VybmFtZSI6Ik5pc3NhbiIsIm9yaWdpbl9qdGkiOiI0MWU1ZDgxOC0wNDFlLTQ4ZTgtYWIwMC02ZGJjMGMyNmQ2NTIiLCJhdWQiOiIydDNpNDk5ZzBhOXVqN2pmNW9kZWRocDFlbCIsImV2ZW50X2lkIjoiMzkwMzFkMmItY2NlYy00MTUyLTgzNDUtMTUyODhlYWUxYmE3IiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE3NDQ2NjI3NzcsImV4cCI6MTc0NDY2NjM3NywiaWF0IjoxNzQ0NjYyNzc3LCJqdGkiOiJiYWI3M2M4MS05ZTUxLTQ4ZjEtODQyZC1jZjlhMTlmNGQ2ZDEiLCJlbWFpbCI6Im5pc3NhbkB5b3BtYWlsLmNvbSJ9.g1nqNmevqQioErLxOZznr-gI05iSeSJOEVnUT9xNRYCW46hQGfXWHmbaj9RHYH3SgHgc86jWhP-R-2B-tqWCV7ufJIJalTqWGbsdolXE5fCzXxVMW3S_effqAVjYrBZNK1rN9mPtlUA0gZ644FbD83_zBU0_59bylew-UAqLHMxeJJII0pznWqw5TI6x61ktm30o5gfIXCCuoQ-AmFXdhGWH232sZwb6xirvxHDqNeEbYhg1z6ElDt0naAMUsKSbSLTJ8-ZeTwqc8KaTts8_7IXFmvK-ZaF03RD2npe0fX1lPEUv9n7xk1Tjrujg0GP-6VPDaMvkDKK-E4b93-ZubA';  // Reemplazar con token real
const USER1_TOKEN = 'eyJraWQiOiJcL0Jsa3BQamMzd05ZVXBRTENZamkwTmhlQWloMFwvbzNCMU5wZ3d6T2tadEk9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiI5NDg4YzQxOC05MDIxLTcwYjAtOGFmNi04NDJhMDc3NGIwZjYiLCJjb2duaXRvOmdyb3VwcyI6WyJVc2VyIl0sImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV96VEJnclNROG8iLCJjb2duaXRvOnVzZXJuYW1lIjoiOTQ4OGM0MTgtOTAyMS03MGIwLThhZjYtODQyYTA3NzRiMGY2IiwicHJlZmVycmVkX3VzZXJuYW1lIjoiRmlhdCIsIm9yaWdpbl9qdGkiOiI3ZGE1ZTM0Mi05NDk3LTQ5NDItYmFiYi03MTgzNWUyYTEzMWUiLCJhdWQiOiIydDNpNDk5ZzBhOXVqN2pmNW9kZWRocDFlbCIsImV2ZW50X2lkIjoiYTlmNDlkOTMtYWExMC00M2NjLWFhZjctNDc0Y2ZlZDVhMjA5IiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE3NDQ2NjI4MDUsImV4cCI6MTc0NDY2NjQwNSwiaWF0IjoxNzQ0NjYyODA1LCJqdGkiOiJmODYyYzRkYi01M2Q3LTQwMDEtYWFiYS02MDYxNDIwY2ExODIiLCJlbWFpbCI6ImZpYXRAeW9wbWFpbC5jb20ifQ.R4n62FnJOIKy-Fl8L408gcehAmrXL8aKoJdQslK_i51bCMT1qJc2VKMZ14fOIcDWlvmqlSQXlZQoQxLdJlq1CwtmA4GSoCBiZz8CaAGXxbmpMpxfDEvwn1n2EikmQn--z_3rNArOP0XyqkT8yp86B8yskRiwkSz_V3rn1FwcM5a-uUR4jS3yRC-3x2vb9NSxzNQD2M0X4R5t2LlxyhRaRFffAbbVhv2P9B-6dCsQNQw2Tvy1HnbmzRJ4CUmIwr_lvQlLNSUtpmi6WfNjUrH75vz6EqAN8s2RcnLMLcTk2J3XANfah2YyjQEl8uUsclRGpSD0xvK6APDMzmAWGTJKXA'; 
const USER2_TOKEN = 'eyJraWQiOiJcL0Jsa3BQamMzd05ZVXBRTENZamkwTmhlQWloMFwvbzNCMU5wZ3d6T2tadEk9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiJjNDM4ZjQ4OC05MGExLTcwYzEtNWE0Yi01MTVmMTM2MzAxZGEiLCJjb2duaXRvOmdyb3VwcyI6WyJVc2VyIl0sImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV96VEJnclNROG8iLCJjb2duaXRvOnVzZXJuYW1lIjoiYzQzOGY0ODgtOTBhMS03MGMxLTVhNGItNTE1ZjEzNjMwMWRhIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiUmVubyIsIm9yaWdpbl9qdGkiOiI1ODIyNjkzNS0xYjlkLTQyNjEtYTRiYy1kMjZkZmQ5OGIwMjYiLCJhdWQiOiIydDNpNDk5ZzBhOXVqN2pmNW9kZWRocDFlbCIsImV2ZW50X2lkIjoiY2E4M2MyMzItNGQ1OS00NzljLWI0N2MtMjQzNTU2OTM0ZmI3IiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE3NDQ2NjI4MzYsImV4cCI6MTc0NDY2NjQzNiwiaWF0IjoxNzQ0NjYyODM2LCJqdGkiOiI0OTk1NWZjYS02YTk2LTQ0OGYtOTAxNC0zNzg3ZDIzNjFjMmIiLCJlbWFpbCI6InJlbm9AeW9wbWFpbC5jb20ifQ.do1nORhNl9wVLw3bgy8y2KRR2_dTrMKHUxdJdcZrubLVbgvIsTTPTvLRYSNihT3Fkxg2F2P_eQCjzcbryJynHuJvOX9ckFXPdCHF5QssxheG_vsmSNwIjiUF8uUWLxRva7te-iSzo4i_7pPOghHdLcYjaFq5ZMdgtJD8QlglAbETHjn2UflVaVirwuN57XNXNwZJ3LsK5rMLbeVa4RXl2ANsIDpGMjfzcbZ85H8kslaBUJ7pPcQ402oVwMsPZ4qjh9Y-2c7BlzlHWLSPp1FVX8Rl2AMPILwicFUz6lSdtNywo0MdZUf2zxdW6kLhQRLkTMr7veWfulTE-fq4c11WPw';
const USER3_TOKEN = 'eyJraWQiOiJcL0Jsa3BQamMzd05ZVXBRTENZamkwTmhlQWloMFwvbzNCMU5wZ3d6T2tadEk9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiI5NGM4MDQxOC1lMDMxLTcwMjQtZWE2OC1iYjhhNTg3NGExNmMiLCJjb2duaXRvOmdyb3VwcyI6WyJVc2VyIl0sImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV96VEJnclNROG8iLCJjb2duaXRvOnVzZXJuYW1lIjoiOTRjODA0MTgtZTAzMS03MDI0LWVhNjgtYmI4YTU4NzRhMTZjIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiQ2hldnJvbGV0Iiwib3JpZ2luX2p0aSI6IjVhOTY1ZTIzLTEzNDctNDQ5OS1iYzZkLWI5Y2Q3ZDBjOGMwOCIsImF1ZCI6IjJ0M2k0OTlnMGE5dWo3amY1b2RlZGhwMWVsIiwiZXZlbnRfaWQiOiJiMDFmOTJkMy0yZmRiLTQ2MGEtYTQwZS1iNmY3MjdjOWY2OGMiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTc0NDY2Mjg2MSwiZXhwIjoxNzQ0NjY2NDYxLCJpYXQiOjE3NDQ2NjI4NjEsImp0aSI6IjVlMzVhMDM1LWUxMjUtNDcwMy04ZDUyLWZjZjMwNmY4ZWQ0YSIsImVtYWlsIjoiY2hldnJvbGV0QHlvcG1haWwuY29tIn0.WedfjlaAIbi6uqxwaoLwqWymRC67iHbeNtZSPejh9Gr9N4PjJZ6UGEZj7DCs1gWWuCnusMIHh_t2YHVJtj9SWZxt61OnHIbPi_qpeuu6v1hS8rcvZzi4A4B6mMqgK3tJfFQ10Eeox2sOMT4M8NBdE_7THQgGFhxDKydCOtn1qWCpfS7ULRh8-MktiXe75AT88QURgr83qPuLOpsGXXp9vrYoLQydGlrurgwLDzz8tb3-etnfh_OsVquNL7rNzeBFbTPtgnplZusaicdJsAjU0ZlD50AdpRG3dT11uzWrV8u7vow2FR9_buo1gzdgZXbOdErH0b_pyPhSsXSfuGY8YA';
const PRODUCT_ID = 1; // ID del producto a monitorear

// 1. Cliente Admin (Monitorea el producto)
const adminSocket = io('ws://18.209.112.64:3000/admin', {
  auth: {
    token: ADMIN_TOKEN
  },
  transports: ["websocket"],
});

// 2. Clientes Usuarios (Simulan actividad)
const userSockets1 = io('ws://18.209.112.64:3000/user', {
    auth: {
      token: USER1_TOKEN
    },
    transports: ["websocket"],
});


const userSockets2 = io('ws://18.209.112.64:3000/user', {
  auth: {
    token: USER2_TOKEN
  },
  transports: ["websocket"],
});


const userSockets3 = io('ws://18.209.112.64:3000/user', {
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
            await axios.post('http://18.209.112.64:3000/item-cart/add', { 
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
            await axios.post('http://18.209.112.64:3000/wishlist/add-product', {
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
        const response = await axios.post('http://18.209.112.64:3000/wishlist/remove-product', {
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
  
  // Cerrar todos los sockets de usuariosx`x`
  userSockets.forEach(userSocket => userSocket.close())
  process.exit();
});

console.log('🚀 Iniciando prueba de WebSocket...');
console.log('Presiona Ctrl+C para detener la prueba\n');