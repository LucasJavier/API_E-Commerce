// test-socket.ts
import { io } from 'socket.io-client';
import axios from 'axios';

// Configuración
const ADMIN_TOKEN = 'eyJraWQiOiJcL0Jsa3BQamMzd05ZVXBRTENZamkwTmhlQWloMFwvbzNCMU5wZ3d6T2tadEk9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiIyNDM4ZjQ3OC1hMDAxLTcwMWYtN2JkZC0wNzBmYzYzMmYzOGUiLCJjb2duaXRvOmdyb3VwcyI6WyJBZG1pbiJdLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfelRCZ3JTUThvIiwiY29nbml0bzp1c2VybmFtZSI6IjI0MzhmNDc4LWEwMDEtNzAxZi03YmRkLTA3MGZjNjMyZjM4ZSIsInByZWZlcnJlZF91c2VybmFtZSI6Ikx1Y2FzIiwib3JpZ2luX2p0aSI6ImZlZjU3YTZiLThhZWYtNDNhZS04ZjhhLTQ1YTc5OTFiNzAzZSIsImF1ZCI6IjJ0M2k0OTlnMGE5dWo3amY1b2RlZGhwMWVsIiwiZXZlbnRfaWQiOiI4Y2RlMThlYy1iMzIwLTQwZjItYWJjZS1hYmU0ODljZWQ0MDUiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTc0NDMxNzY0NCwiZXhwIjoxNzQ0MzIxMjQ0LCJpYXQiOjE3NDQzMTc2NDQsImp0aSI6IjY4YzU5ZWUyLTBhODItNDNhNC05NWMxLTI2Yzc4YmUyZTcyMiIsImVtYWlsIjoibHVjYXNqYXZpZXJAeW9wbWFpbC5jb20ifQ.VNuVuj0-fBLcgknJRTTOsrpXkFhQizU0OG_PZNunPzWpgoQ_e0UtJ3MaWK6RSQ3_IT3xGxzjdn5_PniNxxOR3y7lhaaKC6_UiKa5Jgtb3cfer-EoJglKnoL8kPSX1OH1hQf0wen6oPIQe-FlyQXaPY3vsnKYZvssBYsly7Q5-dj6M9ddN-1FGgyAjaZn2jcksbKh8_sHhJNxXYndTuSn6RTB_todrddJfL3M0jZwTrCG-jlnXrDG80DkQnwsi2WXPs-jCJuJWnbdpexq0V9lx965QzcTimmaUX8qQz6lvuNYFk4TZsbUk9kmQHTI2cQNuzd6p6GZMY4HqLQlM2Drgg';  // Reemplazar con token real
const USER1_TOKEN = 'eyJraWQiOiJcL0Jsa3BQamMzd05ZVXBRTENZamkwTmhlQWloMFwvbzNCMU5wZ3d6T2tadEk9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiJiNDQ4MTQ0OC05MDUxLTcwNTYtNzRmOC1mMmI1OTJhMWQzMTgiLCJjb2duaXRvOmdyb3VwcyI6WyJVc2VyIl0sImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV96VEJnclNROG8iLCJjb2duaXRvOnVzZXJuYW1lIjoiYjQ0ODE0NDgtOTA1MS03MDU2LTc0ZjgtZjJiNTkyYTFkMzE4IiwicHJlZmVycmVkX3VzZXJuYW1lIjoiTWFyaWFubyIsIm9yaWdpbl9qdGkiOiIxMTFkZGI0MS02ZTA4LTRhOTUtYmQyOC1jMTE1NGFlYWVmMDQiLCJhdWQiOiIydDNpNDk5ZzBhOXVqN2pmNW9kZWRocDFlbCIsImV2ZW50X2lkIjoiZjdmOGIwNmYtMjYzMS00MzA1LWFlZmQtMGY0YTNjMTQ0NDIwIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE3NDQzMTc2NTIsImV4cCI6MTc0NDMyMTI1MiwiaWF0IjoxNzQ0MzE3NjUyLCJqdGkiOiJkZGZiZDI4MS0zOGQ3LTQ0MjctOTEzOS03ZmIyODRlODVhYzkiLCJlbWFpbCI6Im1hcmlhbm9AeW9wbWFpbC5jb20ifQ.e_ng72_7TeV7B8CdCjEqTDXYqL7MwGy1mF6CK9PQArmfspW2-0PS5ITnMXBFaYybAOwVnLrlT-Uj4FGGmj-ALghP3HOfOyqt0VhNxxKk_k6xOmRVd6cSCGViz0ZUewwM5Hg9M2Z82YKDZx-ivO82sx33SiAntyJ7RTr2y3fJVZpa0rLMr3t2flYgTp22u1wbipJtfqx_LDEhf94d_Q8psmQwN1uw6gX_Z5-F-FBINoqE3nSFljTB8QwLeVbiu9FiT52M5LltUP04pi2vgG6j60WMKyxjSrHONF8Ai6lthVZZgK9kYh7lWHBuabMssTMS0dUxR75HIs0gVQ3Dax0gHw'; // Reemplazar con token real
const USER2_TOKEN = 'eyJraWQiOiJcL0Jsa3BQamMzd05ZVXBRTENZamkwTmhlQWloMFwvbzNCMU5wZ3d6T2tadEk9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiI3NGQ4ODQxOC01MDgxLTcwYzgtMTQ0My0wNTYyNTQyNGI3NTkiLCJjb2duaXRvOmdyb3VwcyI6WyJVc2VyIl0sImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV96VEJnclNROG8iLCJjb2duaXRvOnVzZXJuYW1lIjoiNzRkODg0MTgtNTA4MS03MGM4LTE0NDMtMDU2MjU0MjRiNzU5IiwicHJlZmVycmVkX3VzZXJuYW1lIjoiTWF0ZW8iLCJvcmlnaW5fanRpIjoiNmI1MGQ4MWMtMmQ5Yy00NjFlLWEwOTUtNTlmODk5Nzg5MjZjIiwiYXVkIjoiMnQzaTQ5OWcwYTl1ajdqZjVvZGVkaHAxZWwiLCJldmVudF9pZCI6IjRkODNhZTc5LTVmYTgtNGIwYi1iMDYyLWFlYzU2NzAwYzk3MyIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNzQ0MzE3NjcxLCJleHAiOjE3NDQzMjEyNzEsImlhdCI6MTc0NDMxNzY3MSwianRpIjoiYjAyZGYyN2QtYTQxZS00YTRjLTk2MDctYjk3Mzk0OTZmYTcxIiwiZW1haWwiOiJtYXRlb0B5b3BtYWlsLmNvbSJ9.BfMgNQzLpCdAbx1mKDs1RLjBD5h0-NN4j4QyIP34SkZA76KyhOFN2tLquVuw2knbwTf3-jOjmvUqt80TSiZDzXr9VMMGENsGr7UPlwJu7rAeN3514CUgdmSTgOLYYPm1T1UxOTTXW-hTpOTiDyzVEGp3REKt1xmQ8aPyRn_VlexrGcJE2FIJ2P3CY6cdMMOuR1w8InUdoMMxw-WFuh4SrMiOSQtPHQUA638N2wMPcPFz9Ds9vfzySCjA84jtJcuiAZAMAxr5VoHbnlZVar-9oTesmjwhu9zXOyxSCIf9lyyOVqN2Quggc8Oqw05tLe9LDINbnjkKxGQSNb9xYt1MVQ';
const USER3_TOKEN = 'eyJraWQiOiJcL0Jsa3BQamMzd05ZVXBRTENZamkwTmhlQWloMFwvbzNCMU5wZ3d6T2tadEk9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiI5NDk4NDQyOC0zMDUxLTcwMzgtMzI1MS03MzQ4NDIxYWViMDUiLCJjb2duaXRvOmdyb3VwcyI6WyJVc2VyIl0sImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV96VEJnclNROG8iLCJjb2duaXRvOnVzZXJuYW1lIjoiOTQ5ODQ0MjgtMzA1MS03MDM4LTMyNTEtNzM0ODQyMWFlYjA1IiwicHJlZmVycmVkX3VzZXJuYW1lIjoiTG9yZW56byIsIm9yaWdpbl9qdGkiOiIyNDU3YTMyYy1lZjBmLTQ2OGYtYWM4OS1iNDZhZTIzMmY4OTYiLCJhdWQiOiIydDNpNDk5ZzBhOXVqN2pmNW9kZWRocDFlbCIsImV2ZW50X2lkIjoiODliZDhmMDUtNGVkNi00YWM3LTg3ZDktYjYzOGNjMThiNGYwIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE3NDQzMTc2ODksImV4cCI6MTc0NDMyMTI4OSwiaWF0IjoxNzQ0MzE3Njg5LCJqdGkiOiI4OTFhMDllZC00MDcwLTRiNjQtYmIwZi0zM2Y5OGZkYzYwZjMiLCJlbWFpbCI6ImxvcmVuem9AeW9wbWFpbC5jb20ifQ.vuJtERHfNys1pH922Wqz8qPv9aw8IQq457AXwHFe130lCGpflpM1aCEnW1ylcN5sRCStFdvqxYzGzDf2aUR1gW2rR3K3WtwKZWC7TMG6kwVXamyb5QirOoAUrwwbTtsblAy-0OZ4cwWQSFMBl0-PiG8VCI7BDhtTveJr4-pKAbvLdsj8LpMAt7opyhB5L3WepTTv1ACuFCPpDracVZZ0wQNxof_RUFyNn9LcKsP7QrXNMka_lWc0ioI73n5Gj8YF7GyIGrh78JsIr6kYq3tU-lNHccKKSUpltO6WIV5wE40aQuiV1kOpLLTiMkkpGqbJC3gHpArTNOZY42tqMqCEzQ';
const PRODUCT_ID = 1; // ID del producto a monitorear

// Función para decodificar el token JWT (sin validar)
//function decodeJWT(token: string): any {
 // try {
 //   const payload = token.split('.')[1];
//    const decodedPayload = Buffer.from(payload, 'base64').toString('utf8');
//    return JSON.parse(decodedPayload);
//  } catch (error) {
///    console.error('Error decodificando token:', error);
//    return null;
//  }
//}

// Depuración: decodificar y mostrar el rol del token Admin
//const decodedAdmin = decodeJWT(ADMIN_TOKEN);
//console.log('Decoded Admin Token:', decodedAdmin);
//if (decodedAdmin && decodedAdmin['cognito:groups']) {
//  console.log('Rol del Admin:', decodedAdmin['cognito:groups']);
//} else {
//  console.log('No se encontró "cognito:groups" en el token Admin.');
//}

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

    /*let wishlistId: number;
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
  }*/

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
    simulateUserActivity(userSocket, index, tokens[index], wishlistIds[index], cartIds[index]);
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