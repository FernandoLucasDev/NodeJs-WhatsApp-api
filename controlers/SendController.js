const { get } = require('mongoose');
const { Client, LocalAuth } = require('whatsapp-web.js');
const { delete_message, create_history } = require('../model/MessagesModel');

let sessionOwner = "krona";
let authenticated = false;

const client = new Client({
  puppeteer: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  },
  authStrategy: new LocalAuth({
    clientId: sessionOwner
  })
});


// Função para autenticar o cliente
exports.AuthWhastapp = async () => {

  try {
    if(authenticated){
      return { message: 'Cliente já autenticado!', status: 1 };
    }
    client.initialize();
    return new Promise((resolve, reject) => {
      
      client.on('qr', (qr) => {
        resolve({ url: qr, status: 0 });
      });
  
      client.on('authenticated', () => {
        authenticated = true;
        resolve({ message: 'Cliente autenticado com sucesso!', status: 1 });
      });
  
      client.on('auth_failure', (msg) => {
        reject({ message: 'Falha na autenticação', status: 2 });
      });
  
      client.on('disconnected', (reason) => {
        reject({ message: 'Cliente desconectado: ' + reason, status: 2 });
      });
    });
  } catch (error) {
    return Promise.reject({ message: 'Erro ao inicializar o cliente', error, status: 500 });
  }

   
};

// Função para consumir mensagens e enviá-las
exports.consumeRow = async (messages_row) => {
  try {
    if (!authenticated) {
      console.log('Cliente não autenticado. Inicializando...');
      await client.initialize();
    }

    const count = await sendMessageRow(messages_row);
    return count;
  } catch (error) {
    console.error('Erro no consumeRow:', error);
    throw error;
  }
};

// Função para enviar mensagens
const sendMessageRow = async (messages_row) => {
  let count = 0;

  if (messages_row.length > 0) {
    await Promise.all(messages_row.map(async (element) => {
      try {
        const phone = element.destino + '@c.us';
        const exists = await client.isRegisteredUser(phone);
        if (exists) {
          const formattedPhone = await client.getNumberId(phone);
          await client.sendMessage(formattedPhone.user + '@c.us', element.texto);
          await create_history({ to: element.destino, content: element.texto, accepted: true });
        } else {
          await create_history({ to: element.destino, content: element.texto, accepted: false });
        }
        await delete_message({ id: element.id });
        count++;
      } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
      }
    }));
  }

  return count;
};

