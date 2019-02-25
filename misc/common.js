const bcrypt = require('bcrypt');

class Common {
  static async hashPassword(password) {
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

  static async emailValidate(email) {
    let emailError = null;
    if (!email) {
      emailError = 'Email is required';
    } else {
      /*eslint no-useless-escape: 0*/
      let matchFormat = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!matchFormat.test(email)) {
        emailError = 'invalid Email';
      } else {
        emailError = null;
      }
    }
    return emailError;
  }
}
module.exports = Common;
