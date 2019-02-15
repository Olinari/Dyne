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
}
module.exports = Common;
