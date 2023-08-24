const connect = async () => {
    if (global.connection && global.connection.state !== 'disconnected') {
      return global.connection;
    }
  
    const mysql = require('mysql2/promise');
    const con = await mysql.createConnection('mysql://root:@localhost:3306/whatsapp_api');
    console.log('Connected to database');
    global.connection = con;
    return con;
};

const create_session = async (session) => {
    console.log(session);
    try {
        const con = await connect();

        await con.execute(
            'INSERT INTO sessions (session_id, session_data) VALUES (?, ?)',
            [session.WID.user, JSON.stringify(session)]
        );

        console.log('Sessão salva no banco de dados.');
        connection.close();
    } catch (error) {
        console.error('Erro ao salvar a sessão no banco de dados:', error);
    }
  };

module.exports = {create_session}