const bcrypt = require('bcrypt');
const { create_user, select_user, unctivate_user, user_activate, user_delete } = require('../model/UsersModel');
const { genToken, verifyToken } = require('./GenerateJWT');
const { response } = require('express');
const {create_error} = require('../model/ErrorModel');

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
    create_error(error);
    res.status(500).json({
      statusCode: 500,
      message: 'Erro ao processar a solicitação',
    });
  }
};


exports.login = async (req, res) => {
    try {
        let response;

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
            const token = genToken({
                email: email,
                password: pass
            });
            response = {
                statusCode: 200,
                token: token
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
    } catch(error) {
        create_error(error);
        res.status(500).json({msg:"erro interno no sitema API"});
    }
};

exports.user_unactivate = async (req, res) => {
    try {
        const email = req.body.email;
        console.log(email);
        const del = await unctivate_user({email:email});

        if(del.statusCode === 200) {
            res.status(del.statusCode).json({msg:"ok!"});
        } else {
            res.status(del.statusCode).json({msg:del});
        }
    } catch(error) {
        create_error(error);
    }
}

exports.user_activate = async (req, res) => {
    try {
        const email = req.body.email;
        console.log(email);
        const del = await user_activate({email:email});
        console.log(del);
        if(del.statusCode === 200) {
            res.status(del.statusCode).json(del);
        } else {
            res.status(del.statusCode).json({del});
        }
    } catch(error) {
        create_error(error);
    }
}

exports.user_delete = async (req, res) => {
    try{
        const email = req.body.email;
        const del = await user_delete({email:email});
        if(del.statusCode === 200) {
            res.status(del.statusCode).json(del);
        } else {
            res.status(del.statusCode).json({del});
        }
    } catch(error) {
        create_error(error);
    }
}