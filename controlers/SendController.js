const { resolve } = require('path');
const { delete_message, create_history } = require('../model/MessagesModel');
const { create_session } = require('../model/SessionsModel');
const { Client, RemoteAuth, LocalAuth} = require('whatsapp-web.js');

let sessionOwner = "nando";

const client = new Client({
  authStrategy: new LocalAuth({
    clientId: sessionOwner
  })
});

let authenticated = false;
let sessionData = null;

exports.AuthWhastapp = async () => {
  client.initialize();
  return new Promise((resolve) => {
    client.on('qr', qr => {
      const response = { url: qr };
      resolve(response);
    });

    client.on('ready', () => {
      console.log('cliente pronto')
      authenticated = true;
      resolve();
    });

    client.on('authenticated', async (session) => {
      console.log('Authenticated!');
    });

  });
};

exports.consumeRow = async (messages_row) => {
  let count;

  if (authenticated == false) {
    client.initialize();
    count = await new Promise((resolve) => {
      client.on('ready', async () => {
        console.log('cliente pronto');
        authenticated = true;
        const totalCount = await sendMessageRow(messages_row);
        resolve(totalCount);
      });
    });
  } else {
    count = await sendMessageRow(messages_row);
  }

  return count;
};

const sendMessageRow = async (messages_row) => {
  let count = 0;

  if (messages_row.length !== 0) {
    const promises = [];

    for (const element of messages_row) {
      promises.push(
        (async () => {
          try {
            let phone = element.destino + '@c.us';
            console.log(phone);
            const exists = await client.isRegisteredUser(phone);
            if (exists) {
              var formattedPhone = await client.getNumberId(phone);
              console.log(formattedPhone);
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
        })()
      );
    }
    await Promise.all(promises);
  }
  
  return count;
};

exports.getStatus = async (req, res) => {
  client.initialize();
  
  const promise = new Promise((resolve) => {
    client.on('ready', () => {
      console.log('cliente pronto');
      resolve(true);
    });
  });

  const hasSession = await promise;

  if (hasSession) {
    return res.status(200).json({ message: 'Usuário logado: ' + sessionOwner });
  } else {
    return res.status(401).json({ message: 'Usuário não logado' });
  }
}


        