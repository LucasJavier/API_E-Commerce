// test-socket.ts
import { io } from 'socket.io-client';
import axios from 'axios';

// Configuración
const ADMIN_TOKEN = 'eyJraWQiOiJcL0Jsa3BQamMzd05ZVXBRTENZamkwTmhlQWloMFwvbzNCMU5wZ3d6T2tadEk9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiIyNDM4ZjQ3OC1hMDAxLTcwMWYtN2JkZC0wNzBmYzYzMmYzOGUiLCJjb2duaXRvOmdyb3VwcyI6WyJBZG1pbiJdLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfelRCZ3JTUThvIiwiY29nbml0bzp1c2VybmFtZSI6IjI0MzhmNDc4LWEwMDEtNzAxZi03YmRkLTA3MGZjNjMyZjM4ZSIsInByZWZlcnJlZF91c2VybmFtZSI6Ikx1Y2FzIiwib3JpZ2luX2p0aSI6IjBlODk5NmZkLTYxNWUtNDNkOS1iODYwLWFjMTQ0ODE0NTA0NCIsImF1ZCI6IjJ0M2k0OTlnMGE5dWo3amY1b2RlZGhwMWVsIiwiZXZlbnRfaWQiOiJjZjU5Y2E3NS1lNzQ2LTRhOTktYWU3NS02ZWIzMThhNmUxMzEiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTc0NDMyNTUxMSwiZXhwIjoxNzQ0MzI5MTExLCJpYXQiOjE3NDQzMjU1MTEsImp0aSI6IjVkOTZmMjhjLTYzYTEtNDc1Yy1iNTE3LTE2OTNmYjg5OTRjNiIsImVtYWlsIjoibHVjYXNqYXZpZXJAeW9wbWFpbC5jb20ifQ.h3fyTNx-DBAj6dp9wov8ZheqbwvkwZBXM0Kk4mWtm7qO-YQdVusFnArNec7K1IwujNu1-kDGon8vbMdwmLQLoLZJ2rNt8PI5_s6zt9y_EXP4e5znUg1sL1KFy5diNueYItPAVr9nbJCvn69KPCHLFzNexDnYPacA9rE1oJmuihmtCvcuCQ8PocXbE2u15I91q0LTztqwMNC_hkKoADVRSIVJ2kF2gQmKjGKIMhz8Va4WEk6gyEp7bt3WYBmbityVeLVBKjMAqwIZ9subfmvhSVmssosJdrWATTh15dgWFdhbsTadOFzqC01bPSJ3bqDjX08FLHxSTO9UhdGcTOIWRA';  // Reemplazar con token real
const USER1_TOKEN = 'eyJraWQiOiJcL0Jsa3BQamMzd05ZVXBRTENZamkwTmhlQWloMFwvbzNCMU5wZ3d6T2tadEk9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiJiNDQ4MTQ0OC05MDUxLTcwNTYtNzRmOC1mMmI1OTJhMWQzMTgiLCJjb2duaXRvOmdyb3VwcyI6WyJVc2VyIl0sImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV96VEJnclNROG8iLCJjb2duaXRvOnVzZXJuYW1lIjoiYjQ0ODE0NDgtOTA1MS03MDU2LTc0ZjgtZjJiNTkyYTFkMzE4IiwicHJlZmVycmVkX3VzZXJuYW1lIjoiTWFyaWFubyIsIm9yaWdpbl9qdGkiOiJlYWI1ZjNlZi0wMzEwLTRiOTAtOGM4Ni0yOWI5MDRhNzdmNDgiLCJhdWQiOiIydDNpNDk5ZzBhOXVqN2pmNW9kZWRocDFlbCIsImV2ZW50X2lkIjoiNmNkMjkyY2EtZDc3YS00Zjc2LWI4NzUtNjE4NzYyMWE5YmE3IiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE3NDQzMjU1MjgsImV4cCI6MTc0NDMyOTEyOCwiaWF0IjoxNzQ0MzI1NTI4LCJqdGkiOiIwZjVhOGI5OS1lYzI5LTRjNmItOWIwMS03NjA1NTRhODkyZTQiLCJlbWFpbCI6Im1hcmlhbm9AeW9wbWFpbC5jb20ifQ.twJrm795P0-eCOwp9hPhDv5901IEIAk0nBrEn9k25df7EPQNsqxKNK4Ly_u7alF9KGlnlYXU7GCYYq3LK2V7WQ9GdgQlYa8nALEA2DTa948iuS85CP455fgXPiOQdVuX8OXeaU9GdkHqO4i6Mv-SuJq3Z7AO9MJ0KUkrfOFaQvdXLCHryQKJ-yz8VmHhtsvOrCQi5oZW1tUkAzE5Bc3TglMIppdsB4tlM4qYOc6vE2F7KKTxO5IHYmIYc31gZm8q684HwyvVAx7GYgNmUr8ZVjgVmyrYnu7Q1rG4C5ZI-tfLw8Uzhnt-aS9sBp7AVzwOtnN1JYVcJJcsF0uzQpoAVQ'; // Reemplazar con token real
const USER2_TOKEN = 'eyJraWQiOiJcL0Jsa3BQamMzd05ZVXBRTENZamkwTmhlQWloMFwvbzNCMU5wZ3d6T2tadEk9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiI3NGQ4ODQxOC01MDgxLTcwYzgtMTQ0My0wNTYyNTQyNGI3NTkiLCJjb2duaXRvOmdyb3VwcyI6WyJVc2VyIl0sImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV96VEJnclNROG8iLCJjb2duaXRvOnVzZXJuYW1lIjoiNzRkODg0MTgtNTA4MS03MGM4LTE0NDMtMDU2MjU0MjRiNzU5IiwicHJlZmVycmVkX3VzZXJuYW1lIjoiTWF0ZW8iLCJvcmlnaW5fanRpIjoiZjExNWVjZjYtYjhjOS00ZjRkLWE0ZTUtNWI1NGQ0ZjJlMTMwIiwiYXVkIjoiMnQzaTQ5OWcwYTl1ajdqZjVvZGVkaHAxZWwiLCJldmVudF9pZCI6ImM5MDk3NTg0LWJiYzUtNGUxYi1hZjRkLWU2MDZhMjIzMTQxNSIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNzQ0MzI1NTM5LCJleHAiOjE3NDQzMjkxMzksImlhdCI6MTc0NDMyNTUzOSwianRpIjoiODhhZmI5ZTItNjI5ZS00NWNhLWFkMTYtYTBmYjk2ZjdmMWU2IiwiZW1haWwiOiJtYXRlb0B5b3BtYWlsLmNvbSJ9.cfNwa17KxWuotBXEZjbHYOE63Qy07h4QxT7m1ATdY2xzR1Ftv-LByXqzelHYgncoGLqpL9sWBrfku9I4Qm9CgYZ8ArPmIZeF98NzVeMwe_ZzbGVR9rncZdi6BY8EqiMLRWQ06f-RbwcwsADYj6dO66f2hcvyS-MZWns4yLeXt_DKoYb3YsFBLLY9QhVb56KwpK74sZwMCmUjjLdnKmMK5JVxwNx8DZ2-vI_AhCqcpckaSqi4hv7omxDGxUTvUQ71IM6CWxT6YNIXwapBX_m7rjVaTQnTz-ZXdHIBnW9LDWiDLplZUjUtTkFmDcRzot3_1Qcxnk50Y7tliNac73wsng';
const USER3_TOKEN = 'eyJraWQiOiJcL0Jsa3BQamMzd05ZVXBRTENZamkwTmhlQWloMFwvbzNCMU5wZ3d6T2tadEk9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiI5NDk4NDQyOC0zMDUxLTcwMzgtMzI1MS03MzQ4NDIxYWViMDUiLCJjb2duaXRvOmdyb3VwcyI6WyJVc2VyIl0sImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV96VEJnclNROG8iLCJjb2duaXRvOnVzZXJuYW1lIjoiOTQ5ODQ0MjgtMzA1MS03MDM4LTMyNTEtNzM0ODQyMWFlYjA1IiwicHJlZmVycmVkX3VzZXJuYW1lIjoiTG9yZW56byIsIm9yaWdpbl9qdGkiOiJkMzc1OTQxNC1iYWQ5LTRmZDYtYjk1YS1jMTczOTAzZjQ4ZDMiLCJhdWQiOiIydDNpNDk5ZzBhOXVqN2pmNW9kZWRocDFlbCIsImV2ZW50X2lkIjoiZTM0ZTBhYWYtMmFiOS00MWNiLTgyODQtMGIyZjQzNjIyMWYzIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE3NDQzMjU1NTAsImV4cCI6MTc0NDMyOTE1MCwiaWF0IjoxNzQ0MzI1NTUwLCJqdGkiOiI3NWZhNmI1YS02ZGE5LTQ1NzAtODA2Mi0xODQ1MGRkMzY5YWYiLCJlbWFpbCI6ImxvcmVuem9AeW9wbWFpbC5jb20ifQ.d3njerbBeqSfSt17LtWKiFiZu5VHkcSiaqJKbaYbZV1HQHBSaUdd5V5KismQCS3gK40iuasqkzUWyM7ewYYCE2JvbnWSjhuHk5wZKJeo50SAQzJi7wFGORO5oFGKBAam7M1g8DOSdSfAtSWCRupTUqzTA3FUGLlCoE2PZctu9is7tmVyYkGjr0mm0Z2rm9nD_U1HmSnTxCwbfHhPSN-S2FlCQZx5fI_ZvG3rclXnMWYWiegGAcWFl2cnGJC3WU_tvgruH_e8a_EDSR52mahaCREvvkyJ64gFTGNwbRqp_D_KcnxnBCAyWl8DO_eJyren9XtdoJIXSHDeJdo9skIYhQ';
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
async function simulateUserActivity(userSocket: any, index: number, token: string, cartId: number) {
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
    simulateUserActivity(userSocket, index, tokens[index], cartIds[index]);
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
  
  // Cerrar todos los sockets de usuarios
  userSockets.forEach(userSocket => userSocket.close())
  process.exit();
});

console.log('🚀 Iniciando prueba de WebSocket...');
console.log('Presiona Ctrl+C para detener la prueba\n');