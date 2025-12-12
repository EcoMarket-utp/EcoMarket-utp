const axios = require('axios');

async function testSignup() {
  const signupData = {
    firstName: 'Usuario',
    lastName: 'Prueba',
    email: 'test-' + Date.now() + '@example.com',
    password: 'password123',
  };

  try {
    console.log('🚀 Enviando petición a:', 'https://ecomarket-utp-backend.onrender.com/api/auth/signup');
    console.log('📤 Datos:', signupData);
    const response = await axios.post('https://ecomarket-utp-backend.onrender.com/api/auth/signup', signupData);
    console.log('✅ Respuesta:', response.status, response.data);
  } catch (error) {
    console.error('❌ Error:', error.response ? error.response.status : error.message);
    console.error('Detalles:', error.response ? error.response.data : error);
  }
}

testSignup();