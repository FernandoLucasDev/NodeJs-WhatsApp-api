const { create_user, login, user_unactivate, user_activate, user_delete } = require('./controlers/AuthController');
const { CreateMessage, RowList, HistoryList } = require('./controlers/MessageContolller');
const { SendRow, Auth } = require('./controlers/SendRow');
const { getStatus } = require('./controlers/SendController')
const bodyParser = require('body-parser');
const path = require('path');

const express = require('express');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use('Qr/', express.static(path.join(__dirname, 'Qr/')));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.post('/register', create_user);
app.post('/login', login);
app.post('/user-unactivate', user_unactivate);
app.post('/user-activate', user_activate);
app.post('/whatsapp-create', CreateMessage);
app.post('/delete-user', user_delete);
app.get('/whatsapp-login', Auth)
app.get('/send-messages', SendRow);
app.get('/row-list', RowList);
app.get('/history-list', HistoryList);

app.listen(3610, () => {
  console.log('Servidor iniciado na porta 3610');
});