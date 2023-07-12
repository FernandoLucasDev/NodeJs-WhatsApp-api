const { create_message, get_messages, get_history } = require('../model/MessagesModel');
const { genToken, verifyToken } = require('./GenerateJWT');
const {create_error} = require('../model/ErrorModel');

exports.CreateMessage = async (req, res, next) => {
    try {
      const token = req.headers['authorization'];
      const to = req.body.to;
      const content = req.body.content;
  
      verifyToken(token, async (statusCode) => {
        if (statusCode === 200) {
          const result = await create_message({
            to: to,
            content: content
          });
          res.status(result.statusCode).json(result);
          next();
        } else if (statusCode === 401) {
          return res.status(401).json({ message: 'Token não fornecido' });
        } else if (statusCode === 403) {
          return res.status(403).json({ message: 'Token inválido' });
        } else {
          return res.status(500).json({ message: 'Erro interno do servidor' });
        }
      });
    } catch (error) {
      create_error(error);
    }
};

exports.RowList = async (req, res) => {
    try{
      const response = await get_messages();
      return res.status(200).json({ data: response });
    } catch(error) {
      create_error(error);
    }
}

exports.HistoryList = async (req, res) => {
  try{
    const response = await get_history();
    return res.status(200).json({ data: response });
  } catch(error) {
    create_error(error);
  }
}