const Send = require('./SendController');
const { get_messages } = require('../model/MessagesModel');
const { create_error } = require('../model/ErrorModel');

exports.Auth = async (req, res) => {
  try {
    const response = await Send.AuthWhastapp();
    res.status(200).json(response);
  } catch (error) {
    create_error(error);
    res.status(500).json({ error: 'Erro ao autenticar no WhatsApp' });
  }
};

exports.SendRow = async (req, res) => {
  const hora = new Date().toLocaleTimeString('pt-BR', { hour12: false });
 try {
    const response = await get_messages();
    const qnt = await Send.consumeRow(response); // erro aqui
    //res.status(200).send(qnt);
    if(qnt === 0 || qnt == null){
      res.status(201).json({
        mensagem: 'Sem mensagens na fila!',
        hora: hora
      });
    } else {
      res.status(201).json({
        mensagem: 'Mensagens de Whatsapp criadas no histórico e deletadas da fila. Envio com sucesso!',
        quantidade: qnt,
        hora: hora
      });
    } 
  } catch (error) {
    create_error(error);
  } 
}; 