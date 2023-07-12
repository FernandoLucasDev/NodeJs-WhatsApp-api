const {create_error} = require('../model/ErrorModel');

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
      const sql = 'INSERT INTO users (nome, email, pass, active_user) VALUES (?, ?, ?, ?)';
      const values = [user.name, user.email, user.pass, false];
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
      console.log('caiu no erro');
      create_error(error);
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
        const id = user.id
        return {
            user: true,
            statusCode: 200,
            message: "User encontrado!",
            user: email,
            pass: pass,
            id: id
        };
      } else {
        return {
            user: false,
            statusCode: 500,
            message: "User não encontrado!",
            user: null,
            pass: null,
            id: null
        };
      }
    } catch (error) {
      create_error(error); 
    }
  };

  const unctivate_user = async (user) => {
    try {
      const con = await connect();
      const sql = 'UPDATE users set active_user = false where email = (?) limit 1';
      const values = [user.email];
      const [result] = await con.query(sql, values);
      console.log(result);
       if(result.length === 1) {
        return {
          statusCode: 200,
          msg: "atualizado!"
        }
       } else {
        return {
          statusCode: 500,
          msg: "Não atualizado - desativar"
        }
       }
    } catch(error) {
      create_error(error);
    }
  }

  const user_activate = async (user) => {
    try {
      const con = await connect();
      const sql = 'UPDATE users set active_user = true where email = (?) limit 1';
      const values = [user.email];
      console.log("--->" + user.email);
      const [result] = await con.query(sql, values);
      console.log(result);
       if(result.length === 1) {
        return {
          statusCode: 200,
          msg: "atualizado 2!"
        }
       } else {
        return {
          statusCode: 500,
          msg: "não atualizado! - ativar"
        }
       }
    } catch(error) {
      create_error(error);
    }
  };

  const user_delete = async (user) => {
    try {
      const con = await connect();
      const sql = 'DELETE FROM users WHERE email = (?) LIMIT 1';
      const values = [user.email];
      const [result] = await con.query(sql, values);
  
      if (result.length === 1) {
        const user = result[0];
        const pass = user.pass
        const email = user.email
        const id = user.id
        return {
            user: true,
            statusCode: 200,
            message: "User deletado!",
            user: email,
            pass: pass,
            id: id
        };
      } else {
        return {
            user: false,
            statusCode: 500,
            message: "User não encontrado!",
            user: null,
            pass: null,
            id: null
        };
      }
    } catch (error) {
      create_error(error); 
    }
  };
  
  module.exports = { create_user, select_user, unctivate_user, user_activate, user_delete };