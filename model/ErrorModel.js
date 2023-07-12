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

const create_error = async (error) => {
    try {
      const con = await connect();
      const datahora = new Date().toISOString().slice(0, 19).replace('T', ' ');
      const truncatedError = JSON.stringify(error);
      const sql = 'INSERT INTO logerror (erro, data_hora) VALUES (?, ?)';
      const values = [truncatedError, datahora];
      const [result] = await con.query(sql, values);
    } catch (error) {
      create_error(error);
    }
  };

module.exports = {create_error}