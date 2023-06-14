const { create_user, login } = require('./controlers/AuthController');
const bodyParser = require('body-parser');

const express = require('express');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/register', create_user);
app.post('/login', login);

app.listen(3000, () => {
  console.log('Servidor iniciado na porta 3000');
});