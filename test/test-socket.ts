// test-socket.ts
import { io } from 'socket.io-client';
import axios from 'axios';

// Configuración
const ADMIN_TOKEN = 'eyJraWQiOiJcL0Jsa3BQamMzd05ZVXBRTENZamkwTmhlQWloMFwvbzNCMU5wZ3d6T2tadEk9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiIyNDM4ZjQ3OC1hMDAxLTcwMWYtN2JkZC0wNzBmYzYzMmYzOGUiLCJjb2duaXRvOmdyb3VwcyI6WyJBZG1pbiJdLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfelRCZ3JTUThvIiwiY29nbml0bzp1c2VybmFtZSI6IjI0MzhmNDc4LWEwMDEtNzAxZi03YmRkLTA3MGZjNjMyZjM4ZSIsInByZWZlcnJlZF91c2VybmFtZSI6Ikx1Y2FzIiwib3JpZ2luX2p0aSI6IjczNDEyZmNkLTkzZTAtNGZlNC05ZDJhLTFkNTBiNTBjMjg1ZiIsImF1ZCI6IjJ0M2k0OTlnMGE5dWo3amY1b2RlZGhwMWVsIiwiZXZlbnRfaWQiOiIyNTY1YTk2YS0xNDVlLTRhMGQtOWJjNy0zNTdiNzEwYTc4NmUiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTc0NDIyMDQ4MywiZXhwIjoxNzQ0MjI0MDgzLCJpYXQiOjE3NDQyMjA0ODMsImp0aSI6IjJmNzY5Y2I2LTRjODktNGFiNy1hZDJiLTVkYWY2OTE2NjIyMiIsImVtYWlsIjoibHVjYXNqYXZpZXJAeW9wbWFpbC5jb20ifQ.Rhl6lQSnfTznT6ZlQcbg0pOQfzxlB54vbqdf-EjDYQi2_p4j3CEfM_Jv-KuuPO2ekznjLxC0bjQBrOX51zW1cpft0WYqk2hwuFMN4gjUzs-7rSLespCFIbIeJ6L9v3EPhnO0NnY8UfUb03gNwbK2Kx2joCg2fKyJnInoMiBJxc9kOrOgEHs6X9_b180nLeGiXEIwRQ26ZT7_A5jSnBBxe1th-S1xDS901BWrx5Pf_WhuihHU6aQjSU-v4-ove1rlMSGtfOJew-8EaZGvfH89P0VIY9pB5I4_JECCuaaizRPXcSfDXDaOhyVW2iVVlXkoeYhBgmHevYclz4oINYvJaA';  // Reemplazar con token real
const USER1_TOKEN = 'eyJraWQiOiJcL0Jsa3BQamMzd05ZVXBRTENZamkwTmhlQWloMFwvbzNCMU5wZ3d6T2tadEk9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiJiNDQ4MTQ0OC05MDUxLTcwNTYtNzRmOC1mMmI1OTJhMWQzMTgiLCJjb2duaXRvOmdyb3VwcyI6WyJVc2VyIl0sImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV96VEJnclNROG8iLCJjb2duaXRvOnVzZXJuYW1lIjoiYjQ0ODE0NDgtOTA1MS03MDU2LTc0ZjgtZjJiNTkyYTFkMzE4IiwicHJlZmVycmVkX3VzZXJuYW1lIjoiTWFyaWFubyIsIm9yaWdpbl9qdGkiOiIyMDY3OGY0NC02MmEyLTQyYTktOGFkMC02YWQxNzAyZjA2ODciLCJhdWQiOiIydDNpNDk5ZzBhOXVqN2pmNW9kZWRocDFlbCIsImV2ZW50X2lkIjoiZDMyOTI1ZGQtZDdkOS00MTRiLWI4NzEtODNiNjFjY2YwMzU4IiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE3NDQyMjA0OTYsImV4cCI6MTc0NDIyNDA5NiwiaWF0IjoxNzQ0MjIwNDk2LCJqdGkiOiJlNmQ1MDA3NS1mOWJkLTRiYTYtOThhNi02ZTZkNDNlMjdmY2MiLCJlbWFpbCI6Im1hcmlhbm9AeW9wbWFpbC5jb20ifQ.l2YUghnmkRQDvtUIO6HXQN3rgO9m0SZ3a9hB-JduehOmEarqZmCSgG0nPba5MGzN-Qf2SGtRtXKfgynqKBr1ASw1b91Wy_vP_WebJaNdtNEmWT7-5xugJM0k1MgTLsbsNpPsRu1jRg0AQ_Dlkmm0ZY2iQcRRlRYrX2uWi11det1VAu0N_1JmAK9LHXQe2aY0H6CKvmVB7t5L-_0JcR5MkBBSZKZ4UVjYeqpsyPbI3dBElKsw2rtXe53XuRPld0Yu16cjLYVpX4t6F-GPQZjthsLsrBEytF6q68HoOrpysGbVQ_eidP4d8Y0iTwYwGFJnSJX3feIVkMq0-mPqmm2wuQ'; // Reemplazar con token real
const USER2_TOKEN = 'eyJraWQiOiJcL0Jsa3BQamMzd05ZVXBRTENZamkwTmhlQWloMFwvbzNCMU5wZ3d6T2tadEk9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiI3NGQ4ODQxOC01MDgxLTcwYzgtMTQ0My0wNTYyNTQyNGI3NTkiLCJjb2duaXRvOmdyb3VwcyI6WyJVc2VyIl0sImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV96VEJnclNROG8iLCJjb2duaXRvOnVzZXJuYW1lIjoiNzRkODg0MTgtNTA4MS03MGM4LTE0NDMtMDU2MjU0MjRiNzU5IiwicHJlZmVycmVkX3VzZXJuYW1lIjoiTWF0ZW8iLCJvcmlnaW5fanRpIjoiZTM3ZjA0YWYtNTEyNS00MjVmLTg5M2MtZWE2YTQyYTg5MGNkIiwiYXVkIjoiMnQzaTQ5OWcwYTl1ajdqZjVvZGVkaHAxZWwiLCJldmVudF9pZCI6IjA2ZDhiMjQ4LWFjZjktNGQxZC05NWI1LWVkZWQxNGE5ZGUzYyIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNzQ0MjIxMzYyLCJleHAiOjE3NDQyMjQ5NjIsImlhdCI6MTc0NDIyMTM2MiwianRpIjoiN2E2YWU2ZDEtYzA2YS00MDBjLWE1NjItN2M4MzlkNDJhMWZmIiwiZW1haWwiOiJtYXRlb0B5b3BtYWlsLmNvbSJ9.XxHGnNGSvByn6STyCZ9Z5jYBzQgVGCq-FXdetNt5aoG1uGysrO1WMQdyhBWyMx3eyJSFy8jppft3B8Zdd1JQ9cAxxNxhq1dJk2ERLDQKYGDkqe6lsonAwWsCKdSYsByIMiapOsrr9Y7AnDqpe2NSn1jem_QqOhV5O5vYHUa1KrilmwFj_YslpDMt4rPB2mJHoNpdpo1aOWW_ue_sji_HIHrHrWCTt2OPaGKCK64PZ6puUMwGPip0tglz92B_p--5qoC-YjnChvGuZsVA0SJ1QKqiYb38qOwWUNHTywnKaYIuJVZQT2kKUa6hB1nysBzItAV3QjA-_kMNwX7sGso7EQ';
const USER3_TOKEN = 'eyJraWQiOiJcL0Jsa3BQamMzd05ZVXBRTENZamkwTmhlQWloMFwvbzNCMU5wZ3d6T2tadEk9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiI5NDk4NDQyOC0zMDUxLTcwMzgtMzI1MS03MzQ4NDIxYWViMDUiLCJjb2duaXRvOmdyb3VwcyI6WyJVc2VyIl0sImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV96VEJnclNROG8iLCJjb2duaXRvOnVzZXJuYW1lIjoiOTQ5ODQ0MjgtMzA1MS03MDM4LTMyNTEtNzM0ODQyMWFlYjA1IiwicHJlZmVycmVkX3VzZXJuYW1lIjoiTG9yZW56byIsIm9yaWdpbl9qdGkiOiJkYTRjODcyOS0xNDk0LTQ5MGUtOGY0NS1lMWI5YmVjZmNkZTMiLCJhdWQiOiIydDNpNDk5ZzBhOXVqN2pmNW9kZWRocDFlbCIsImV2ZW50X2lkIjoiZGMzYWEyNDUtODA5Ny00MDYxLWI5N2UtOWE1NWNkYWUwZWQ4IiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE3NDQyMjE0ODcsImV4cCI6MTc0NDIyNTA4NywiaWF0IjoxNzQ0MjIxNDg3LCJqdGkiOiJhZGFhNjE2YS1iMTI1LTQ0OTAtYThiNy1jODA5YTg4YzJkNWUiLCJlbWFpbCI6ImxvcmVuem9AeW9wbWFpbC5jb20ifQ.Iwe1LKQg17_qA_HWOee9E7Zt6NsVyWIp50-hRftrSWBOK9UkTPBtd9lKnPhrvwjWPYUaQq57WvBzp_Q8we-Yhk8beygO-YPy8ARaCbjtBpEpjHYctjLQNamjjWs-COP6AaE_Igr4QksYhwng1EvUbk0z8naBR9SSipVdzf4veDCFDSGmpEEZ_M3FrmPUL3nWL3CcBPi3DrH6Bm46ay8YI_DFNByIr9g82TJeAMkxtkY50r_tKE9Id2vudI7e8qwV_fiuO5fLNNM8PeJc4fDAWplspqmnvfSbS46lOJW6Ihd_hgDWAI3oYFPb2T-V4PZKXiZg1r0fgdV9ToTGulUiaw';
const PRODUCT_ID = 1; // ID del producto a monitorear

// Función para decodificar el token JWT (sin validar)
function decodeJWT(token: string): any {
  try {
    const payload = token.split('.')[1];
    const decodedPayload = Buffer.from(payload, 'base64').toString('utf8');
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error('Error decodificando token:', error);
    return null;
  }
}

// Depuración: decodificar y mostrar el rol del token Admin
const decodedAdmin = decodeJWT(ADMIN_TOKEN);
console.log('Decoded Admin Token:', decodedAdmin);
if (decodedAdmin && decodedAdmin['cognito:groups']) {
  console.log('Rol del Admin:', decodedAdmin['cognito:groups']);
} else {
  console.log('No se encontró "cognito:groups" en el token Admin.');
}

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


// Función para simular actividad de usuarios
async function simulateUserActivity(userSocket: any, index: number, token: string) {
    console.log(`👤 Usuario ${index + 1} simulando`);

    let wishlistId: number;
    try {
        const response = await axios.post('http://localhost:3000/wishlist',
            { name: `Wishlist Usuario ${index + 1}` },
            { headers: { Authorization: `Bearer ${token}` } }
        );
    wishlistId = response.data.id;
    console.log(`📝 Usuario ${index + 1} creó wishlist ID: ${wishlistId}`);
  } catch (error) {
    console.error(`❌ Error creando wishlist (Usuario ${index + 1}):`, error.response?.data?.message || error.message);
    return;
  }

    // Usuario comienza a ver el producto
    userSocket.emit('view-product', PRODUCT_ID);
  
    setTimeout(async () => {
        try {
            await axios.post('http://localhost:3000/item-cart/add', { 
                cartId: 1,
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
    simulateUserActivity(userSocket, index, tokens[index]);
  });

  userSocket.on('disconnect', () => {
    console.log(`👤 Usuario ${index + 1} desconectado`);
  });
});

// Manejar cierre del script
process.on('SIGINT', () => {
  console.log('\n🔌 Desconectando todos los clientes...');
  adminSocket.close();
  userSockets.forEach(userSocket => userSocket.close());
  process.exit();
});

console.log('🚀 Iniciando prueba de WebSocket...');
console.log('Presiona Ctrl+C para detener la prueba\n');