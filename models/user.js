const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(v) {
          const regex = /^https?:\/\/(www.)?[\w-]{1,63}\.[\w-]{1,256}[a-z-\._~:\/\?#\[\]@!\$&'\(\)\*+,;=]*#?/i;
          return regex.test(v);
      },
      message: 'Ссылка на картинку не соответствует формату :( Попробуйте ещё раз',
    }
  }
});

module.exports = mongoose.model('user', userSchema);