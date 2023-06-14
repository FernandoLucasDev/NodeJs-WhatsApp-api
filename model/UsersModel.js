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
  
  const create_user = async (user) => {
    try {
      const con = await connect();
      const sql = 'INSERT INTO users (nome, email, pass) VALUES (?, ?, ?)';
      const values = [user.name, user.email, user.pass];
      const [result] = await con.query(sql, values);
  
      if (result.affectedRows === 1) {
        return {
          statusCode: 201,
          message: 'Usuário criado com sucesso!',
        };
      } else {
        return {
          statusCode: 500,
          message: 'Falha na criação de usuário',
        };
      }
    } catch (error) {
      console.log('Erro: ' + error);
      throw error; // Rethrow the error to be caught in the controller
    }
  };

  const select_user = async (user) => {
    try {
      const con = await connect();
      const sql = 'SELECT * FROM users WHERE email = (?)';
      const values = [user.email];
      const [result] = await con.query(sql, values);
  
      if (result.length === 1) {
        const user = result[0];
        const pass = user.pass
        const email = user.email
        return {
            user: true,
            statusCode: 200,
            message: "User encontrado!",
            user: email,
            pass: pass
        };
      } else {
        return {
            user: false,
            statusCode: 500,
            message: "User não encontrado!",
            user: null,
            pass: null
        };;
      }
    } catch (error) {
      console.log('Erro: ' + error);
      throw error; 
    }
  };
  
  module.exports = { create_user, select_user };
  