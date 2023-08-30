const { resolve } = require('path');
const { delete_message, create_history } = require('../model/MessagesModel');
const { create_session } = require('../model/SessionsModel');
const { Client } = require('whatsapp-web.js');

const client = new Client();

let authenticated = false;

exports.AuthWhastapp = async () => {
  client.initialize();
  return new Promise((resolve) => {
    client.on('qr', qr => {
      const response = { url: qr };
      resolve(response);
    });

    client.on('ready', () => {
      authenticated = true;
    });

    
  client.on('authenticated', (session) => {
    console.log('Sessão autenticada!');
  });
  });
};

exports.consumeRow = async (messages_row) => {
  let count = 0;

  if (!authenticated) {
    throw new Error('Autenticação no WhatsApp não concluída');
  }

  if (messages_row.length !== 0) {
    size = Object.keys(messages_row).length;
    for (const element of messages_row) {
      try {
        let phone = element.destino + '@c.us';
        const exists = await client.isRegisteredUser(phone);
        if(exists){
          var formattedPhone = await client.getNumberId(phone);
          await client.sendMessage(formattedPhone.user + '@c.us', element.texto);
          await create_history({
            to: element.destino,
            content: element.texto,
            accepted: true
          });
          await delete_message({ id: element.id });
        } else {
          await create_history({
            to: element.destino,
            content: element.texto,
            accepted: false
          });
          await delete_message({ id: element.id });
        }
        
      } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
      }
      count++;
    }
  }
  return count;
};