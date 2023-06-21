const jwt = require('jsonwebtoken');

exports.genToken = (user) => {
  const secretKey = 'm9Xr2L7As3Yt0gJz6KvF1cB8Hn4QwXe5RdSpUoVxZyCfTbNl6MjI7OkP8uGh9iXqW3';
  const expiresIn = '1h';
  const token = jwt.sign(user, secretKey, { expiresIn });
  return token;
}


exports.verifyToken = (token, callback) => {
  const secretKey = 'm9Xr2L7As3Yt0gJz6KvF1cB8Hn4QwXe5RdSpUoVxZyCfTbNl6MjI7OkP8uGh9iXqW3';
  if (!token) {
    return callback(401);
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return callback(403);
    }

    callback(200, decoded);
  });
};