const axios = require('axios');

async function testWebhook() {
  const webhookData = {
    email: 'aldair456.12358@gmail.com',
    first_name: 'Juan Aldair',
    last_name: 'Ramirez Mendez',
    registration_type: 'Usuario',
    user_id: '1', // Asumiendo un ID, ajusta si es necesario
  };

  try {
    console.log('🚀 Enviando webhook a:', 'https://n8n-7hcl.onrender.com/webhook/user-registration');
    console.log('📤 Datos:', webhookData);
    const response = await axios.post('https://n8n-7hcl.onrender.com/webhook/user-registration', webhookData);
    console.log('✅ Respuesta del webhook:', response.status, response.data);
  } catch (error) {
    console.error('❌ Error en webhook:', error.response ? error.response.status : error.message);
    console.error('Detalles:', error.response ? error.response.data : error);
  }
}

testWebhook();