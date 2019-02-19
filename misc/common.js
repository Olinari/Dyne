const bcrypt = require('bcrypt');

class Common {
  static async hashPassword(password) {
    console.log('password', password);
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  static async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  static async checkPassword(password, confirmPassword) {
    let passwordError = null;
    if (password != confirmPassword) {
      passwordError = 'Password and Confirm password must be the same';
    } else if (password.length < 7) {
      passwordError = 'Password must be 8 character long';
    }
    return passwordError;
  }
}
module.exports = Common;
