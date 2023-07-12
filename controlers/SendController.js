// const { response } = require('express');
// const { Client } = require('whatsapp-web.js');
// const client = new Client();

// let authenticated = false;

// exports.AuthWhastapp = async () => {
//   client.initialize();
//   return new Promise((resolve) => {
//     client.on('qr', qr => {
//       const response = { url: qr };
//       resolve(response);
//     });
//   });
// };


// exports.consumeRow = async (messages_row) => {
//   client.removeAllListeners('ready');

//   client.on('ready', async () => {
//     console.log("ativo");
//     if (messages_row.length !== 0) {
//       console.log("caiu no if");
//       for (const element of messages_row) {
//         try {
//           const phone = element.phoneNumber + "@c.us";
//           console.log(phone);
//           await client.sendMessage(phone, element.messageText);
//           await delete_message({ id: element.id });
//           console.log("aqui");
//         } catch (error) {
//           console.error('Erro ao enviar mensagem:', error);
//         }
//       }
//     }
//   });
// };



// const { resolve } = require('path');
// const { delete_message, create_history } = require('../model/MessagesModel');
// const { Client } = require('whatsapp-web.js');
// const { create_error } = require('../model/ErrorModel');
// const client = new Client();

// let authenticated = false;

// exports.AuthWhastapp = async () => {
//   client.initialize();
//   return new Promise((resolve) => {
//     client.on('qr', qr => {
//       const response = { url: qr };
//       resolve(response);
//     });

//     client.on('ready', () => {
//       authenticated = true;
//     });
//   });
// };

// exports.consumeRow = async (messages_row) => {
//   let count = 0;

//   if (!authenticated) {
//     throw new Error('Autenticação no WhatsApp não concluída');
//   }

//   if (messages_row.length !== 0) {
//     size = Object.keys(messages_row).length;
//     for (const element of messages_row) {
//       try {
//         const phone = element.destino.slice(0,4) + element.destino.slice(5) + '@c.us';
//         console.log(phone)
//         await client.sendMessage(phone, element.texto);
//         await create_history({
//           to: element.destino,
//           content: element.texto
//         });
//         await delete_message({ id: element.id });
//       } catch (error) {
//         create_error(error);
//       }
//       count++;
//     }
//   }
//   return count;
// };

const { resolve } = require('path');
const { delete_message, create_history } = require('../model/MessagesModel');
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
        const phone = element.destino + '@c.us';
        await client.sendMessage(phone, element.texto);
        await create_history({
          to: element.destino,
          content: element.texto
        });
        await delete_message({ id: element.id });
      } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
      }
      count++;
    }
  }
  return count;
};