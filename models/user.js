const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const emailValidator = require('validator');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return emailValidator.isEmail(v);
      }
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(v) {
          const regex = /^https?:\/\/(www.)?[\w-]{1,63}\.[\w-]{1,256}[a-z-\._~:\/\?#\[\]@!\$&'\(\)\*+,;=]*#?/i;
          return regex.test(v);
      },
      message: 'Ссылка на картинку не соответствует формату :( Попробуйте ещё раз',
    }
  }
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }

          return user;
        });
    });
};


module.exports = mongoose.model('user', userSchema);