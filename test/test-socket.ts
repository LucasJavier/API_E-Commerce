// test-socket.ts
import { io } from 'socket.io-client';
import axios from 'axios';

// Configuración
const ADMIN_TOKEN = 'eyJraWQiOiJcL0Jsa3BQamMzd05ZVXBRTENZamkwTmhlQWloMFwvbzNCMU5wZ3d6T2tadEk9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiJkNDQ4NTRjOC04MDcxLTcwNGItNGI4OS02OWY5Yjg0ZDA0MzIiLCJjb2duaXRvOmdyb3VwcyI6WyJBZG1pbiJdLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfelRCZ3JTUThvIiwiY29nbml0bzp1c2VybmFtZSI6ImQ0NDg1NGM4LTgwNzEtNzA0Yi00Yjg5LTY5ZjliODRkMDQzMiIsInByZWZlcnJlZF91c2VybmFtZSI6Ikx1Y2FzMiIsIm9yaWdpbl9qdGkiOiI0NTI0NDk1NC0yMjM1LTRmNGQtYjI5Ny1mYzk5YjVhMTIzNzAiLCJhdWQiOiIydDNpNDk5ZzBhOXVqN2pmNW9kZWRocDFlbCIsImV2ZW50X2lkIjoiN2QwMWM3YzgtOWE4Zi00ODMzLWFkY2ItMDhmNzgxNzZkZDU3IiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE3NDQzODM2ODEsImV4cCI6MTc0NDM4NzI4MSwiaWF0IjoxNzQ0MzgzNjgxLCJqdGkiOiJiZTNkMDc0NS1lOTI0LTQ2MDAtYTI1MC05NWExZGZlZTEyOGIiLCJlbWFpbCI6Imx1Y2FzamF2aWVyMkB5b3BtYWlsLmNvbSJ9.s1IChY_WhBqOj1PNaklH3GoMWHIKV2yAl_zR_qWLeXUQJIT9hQUfVR_SobIcgCSMCT3MtWyyNZ0m7QJCXumB3ny3A68w5wck7LE3u--g7EJc7og93QfE3cbR4Zm32cbGl1AgulrxCsd1ZPKj4exGlNXPUgbLrGL2ZKc2FLYsv0UD44wZQgsMyUnxnHvvpAFkhCAoP_qz8HMlrR87k2J9xH2AzZqJzA2Tw_jXb8oB-7ULlMStZ88A-A8201eiOy7-q2enPwXxyG4H01vzOPBNikGoekdYaga_Aeqd-GRldQ_zOUr3kxCdiAb7cDwpIWpjLEb2KR5PDTA7KGRrCvYbug';  // Reemplazar con token real
const USER1_TOKEN = 'eyJraWQiOiJcL0Jsa3BQamMzd05ZVXBRTENZamkwTmhlQWloMFwvbzNCMU5wZ3d6T2tadEk9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiJjNDc4MjRlOC0xMDkxLTcwZWMtMmJjNS00Yzg4ZGQ1YWE1MDIiLCJjb2duaXRvOmdyb3VwcyI6WyJVc2VyIl0sImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV96VEJnclNROG8iLCJjb2duaXRvOnVzZXJuYW1lIjoiYzQ3ODI0ZTgtMTA5MS03MGVjLTJiYzUtNGM4OGRkNWFhNTAyIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiTWFyaWFubzIiLCJvcmlnaW5fanRpIjoiNDk4NjBhMDItOTIxNC00MWJlLTg4YjktM2RjMzBiMzVkYzk3IiwiYXVkIjoiMnQzaTQ5OWcwYTl1ajdqZjVvZGVkaHAxZWwiLCJldmVudF9pZCI6IjRiMGU1ZWUxLWY0NjktNDVlYS05NjZiLTQ2MGY0MGQwYTQxNCIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNzQ0MzgzNzkzLCJleHAiOjE3NDQzODczOTMsImlhdCI6MTc0NDM4Mzc5MywianRpIjoiM2E5NDFiZTMtNjYwZS00OTY3LWFhMWQtMWE0Zjk4ZmZhNmE4IiwiZW1haWwiOiJtYXJpYW5vMkB5b3BtYWlsLmNvbSJ9.TxwDbGqUGtfc8_tpZif1On6Vm2CU7w5uYG3kZLHB1Ti5Tk7m4sfuull_UHMM1q8TPa3ixJ0u5FErHpkXjAmDyc23o1ILlhXwwgX2a3LVniQJv-YWKCrogMP0-dSaQgftwvyeQ6LGHYv3VXI-YfjHq0ZJb04ExEaI5aVJTcw5pvSfW_pMDUbiOoC3AInXjEWGab1a_knjCn2DTDKn7Qa9rNpKkCuXNFkhddoZjLLcSzV1R-yxwgMBtNCe-V7IBqClobO6enND9WH4hRGqOeGFOXuUBuYRLeVLl9N9fV_wxSVg8uOY6RePt53UoGpwcXyQ32DD7ItIckE-7bnLrDXHjA'; 
const USER2_TOKEN = 'eyJraWQiOiJcL0Jsa3BQamMzd05ZVXBRTENZamkwTmhlQWloMFwvbzNCMU5wZ3d6T2tadEk9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiJkNDQ4ZDRmOC1iMDcxLTcwMTMtNGMyNC1jYzU5ZTUwZDQxMzYiLCJjb2duaXRvOmdyb3VwcyI6WyJVc2VyIl0sImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV96VEJnclNROG8iLCJjb2duaXRvOnVzZXJuYW1lIjoiZDQ0OGQ0ZjgtYjA3MS03MDEzLTRjMjQtY2M1OWU1MGQ0MTM2IiwicHJlZmVycmVkX3VzZXJuYW1lIjoiTWF0ZW8yIiwib3JpZ2luX2p0aSI6IjliYjk2ZGU0LTQ5NjgtNGQxYy05ZTJlLTIyOWZhYjQyMTgyOSIsImF1ZCI6IjJ0M2k0OTlnMGE5dWo3amY1b2RlZGhwMWVsIiwiZXZlbnRfaWQiOiJlMjQyMjcwNS02MTAwLTQ3ZWYtODA1Yy03ZTQ5OTBiMDJkMTMiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTc0NDM4Mzg4MCwiZXhwIjoxNzQ0Mzg3NDgwLCJpYXQiOjE3NDQzODM4ODAsImp0aSI6IjE2MTEyM2RhLTM0ODUtNGJhNC1iYTI2LTU1ZWRkZmRhOTEzZSIsImVtYWlsIjoibWF0ZW8yQHlvcG1haWwuY29tIn0.azfD6zzpQFsomZIOYty--rkkeCIVGXtnMFS6w25K6yDGe4OK6tpgKlIdN7DnYfcr_l3XzCC1jCAfuew5FTPP2DE6YPtk5WwYOFu8_osAaFWIATLlJsHALLV2kHGfcZHWw3zpRcmIueBvigdXyx2M0_orgM-Fa0eftgAd10d4vPMRUH_yIYB9DSBux6GpvZ8Fk6prG6UG9qP3Q7HYPOjP8-VeSjonWSbwVjfvNZ7c1tQeHDufb3nhjfIYmaKqQU2u7yLLewEztB4yYiKCSiBasu9Xs44iWEKusazLeAyvIiSJMKTk2uLCZSWyyzqWggae6WeSesaJleY1eKxoKIBC8Q';
const USER3_TOKEN = 'eyJraWQiOiJcL0Jsa3BQamMzd05ZVXBRTENZamkwTmhlQWloMFwvbzNCMU5wZ3d6T2tadEk9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiIzNDA4YjRiOC03MDQxLTcwNGMtNTk2Ny1mMjhiODNjYjg5NGIiLCJjb2duaXRvOmdyb3VwcyI6WyJVc2VyIl0sImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV96VEJnclNROG8iLCJjb2duaXRvOnVzZXJuYW1lIjoiMzQwOGI0YjgtNzA0MS03MDRjLTU5NjctZjI4YjgzY2I4OTRiIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiTG9yZW56bzIiLCJvcmlnaW5fanRpIjoiNGNiODczMWQtZWIyYi00OTk2LTliZDgtZDRiOTg4Y2M3MWZiIiwiYXVkIjoiMnQzaTQ5OWcwYTl1ajdqZjVvZGVkaHAxZWwiLCJldmVudF9pZCI6IjNlMzhmY2FmLTcyNTctNGZlMS1hNTM0LWE3NWJkOTU0NWUxYiIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNzQ0MzgzOTgwLCJleHAiOjE3NDQzODc1ODAsImlhdCI6MTc0NDM4Mzk4MCwianRpIjoiODEwOGJjYmEtYzU3OS00NmM4LWE2NmEtMjI5NGY5OWZlYTBkIiwiZW1haWwiOiJsb3JlbnpvMkB5b3BtYWlsLmNvbSJ9.A0svCpGrhc9JUHOti70R6k9DdJeYezv3resvMt0GuS78ELlhB_gd3zsVnmB_oDBY6D5Ei0MibiqWCqHQfmB9zma6ejTBb-7VzWAkI727Aw3liVn2XvM7ygaXoOor6i_hWmTl-nIxqAS29fO41ROySh__mfssxfJvwrwQRUFn0b6YXC49pbucQ94FBn5iJ4bhD0HjNUfWoYRND4SX17gYaNTHqROPlJHj9EskDzn2UNNw8AgATb68ZEcLnGgqagwzKnTiNSC2GvSJhH4H_IQFuyauZ5ErvF4eIXrTksCNC-v85UFltlMCXgzIx_s2aI1ynrAkYn8DDB394tIgVcjXlA';
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