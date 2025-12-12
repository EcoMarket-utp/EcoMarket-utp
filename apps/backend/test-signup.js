const axios = require('axios');

async function testSignup() {
  const signupData = {
    firstName: 'Usuario',
    lastName: 'Prueba',
    email: 'test-' + Date.now() + '@example.com', // Email único
    password: 'password123',
  };

  try {
    console.log('🚀 Registrando usuario de prueba...');
    const response = await axios.post('https://ecomarket-utp-backend.onrender.com/api/auth/signup', signupData);
    console.log('✅ Registro exitoso:', response.data);

    // Verificar webhook en n8n (esperar un poco)
    console.log('⏳ Esperando webhook... (5 segundos)');
    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log('📧 Revisa n8n y el email para confirmar el webhook.');
  } catch (error) {
    console.error('❌ Error en registro:', error.response?.data || error.message);
  }
}

testSignup();