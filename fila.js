const axios = require('axios');

axios.get('http://localhost:3000/send-messages')
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error(error);
  });
