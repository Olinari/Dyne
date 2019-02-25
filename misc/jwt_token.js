const jwt = require('jsonwebtoken');

class JwtToken {
  static genJWTToken(user) {
    let payload = {
      iss: 'DishIn',
      sub: user._id,
      user_id: user._id,
      role: user.role,
      roleId: user.roleId,
      // roleName: user.roleName,
      email: user.email,
      status: user.status,
      exp: new Date().getTime() + 31536000,
    };
    let token = jwt.sign(payload, '--DishIn--');
    return token;
  }

  static verifyJWTToken(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, '--DishIn--', (err, decodedToken) => {
        if (err || !decodedToken) {
          return reject(err);
        }
        resolve(decodedToken);
      });
    });
  }
}

module.exports = JwtToken;
