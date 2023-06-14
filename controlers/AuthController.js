const bcrypt = require('bcrypt');
const { create_user, select_user } = require('../model/UsersModel');

exports.create_user = async (req, res) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const pass = req.body.password;
    
    const hash_pass = await new Promise(
        (resolve, reject) => {
        bcrypt.hash(pass, 10, (err, hash) => {
          if (err) {
            console.error(err);
            reject(err);
          }
          resolve(hash);
        });
      });

    const user = {
        name: name,
        email: email,
        pass: hash_pass,
    };

    const result = await create_user(user);
    res.status(result.statusCode).json(result);
  } catch (error) {
    console.log('Erro: ' + error);
    res.status(500).json({
      statusCode: 500,
      message: 'Erro ao processar a solicitação',
    });
  }
};


exports.login = async (req, res) => {

    const email = req.body.email;
    const pass = req.body.password;

    const login = await select_user({ email: email });

    if (login.user === null) {
        response = {
            statusCode: 400,
            message: 'User não encontrado'
        };
        res.status(response.statusCode).json(response);
        return response;
    }

    if (!pass || !login.pass) {
        response = {
            statusCode: 400,
            message: 'Senha ou hash ausentes'
        };
        res.status(response.statusCode).json(response);
        return response;
    }

    const correctPass = await new Promise((resolve, reject) => {
        bcrypt.compare(pass, login.pass, (err, result) => {
            if (err) {
                console.error(err);
                reject(err);
            }
            if (result) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    });

    if(correctPass){
        response = {
            statusCode: 200,
            message: 'Usuário existente e senha correta'
        };
        res.status(response.statusCode).json(response);
        return response;
    } else {
        response = {
            statusCode: 400,
            message: 'Senha incorreta'
        };
        res.status(response.statusCode).json(response);
        return response;
    }
};