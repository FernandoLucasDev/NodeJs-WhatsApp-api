const connect = async () => {
    if (global.connection && global.connection.state !== 'disconnected') {
      return global.connection;
    }
  
    const mysql = require('mysql2/promise');
    const con = await mysql.createConnection('mysql://root:root@localhost:3306/whatsapp_api');
    console.log('Connected to database');
    global.connection = con;
    return con;
};

const create_message = async (msg) => {
    try {
      const con = await connect();
      const sql = 'INSERT INTO message_row (destino, texto) VALUES (?, ?)';
      const values = [msg.to, msg.content];
      const [result] = await con.query(sql, values);
  
      if (result.affectedRows === 1) {
        return {
          statusCode: 201,
          message: 'Mensagem criada com sucesso!',
        };
      } else {
        return {
          statusCode: 500,
          message: 'Falha na criação de mensagem!',
        };
      }
    } catch (error) {
      console.log('Erro: ' + error);
      throw error;
    }
};

const get_messages = async () => {
    try{
        const con = await connect();
        const [linha] = await con.query('SELECT * FROM message_row ORDER BY id DESC');
        return await linha;
    } catch(error) {
        console.log('Erro: ' + error);
        throw error;
    }
};

const delete_message = async (msg) => {
  try {
    const con = await connect();
    const sql = 'DELETE FROM message_row WHERE id = ?';
    const values = [msg.id];
    await con.query(sql, values);
  } catch (error) {
    console.log('Erro: ' + error);
    throw error;
  }
};

const create_history = async (info) => {
  try {
    const datahora = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const con = await connect();
    const sql = 'INSERT INTO message_history (destino, texto, data_hora) VALUES (?, ?, ?)';
    const values = [info.to, info.content, datahora];
    await con.query(sql, values);
  } catch (error) {
    console.log('Erro: ' + error);
    throw error;
  }
};

const get_history = async () => {
  try{
      const con = await connect();
      const [linha] = await con.query('SELECT * FROM message_history ORDER BY data_hora DESC');
      return await linha;
  } catch(error) {
      console.log('Erro: ' + error);
      throw error;
  }
};

module.exports = {create_message, get_messages, delete_message, create_history, get_history}