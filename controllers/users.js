const User = require('../models/user');
const { ERROR_NOT_FOUND } = require('../utils/constants');const {
  serverErrorNotification,
  invalidDataNotification,
  nonExistentDataNotification,
  createNotFoundError
} = require('../helpers/errors');


function getUsers(req, res) {
  User.find({})
    .then(users => res.send(users))
    .catch(err => serverErrorNotification(res, err, 'Серверная ошибка'));
}

function getUserProfile(req, res) {
  User.findById(req.params.id)
    .orFail(() => {
      createNotFoundError();
    })
    .then(user => res.send({ data: user }))
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        invalidDataNotification(res, err, 'Невалидный id пользователя');
        return;
      }
      if (err.statusCode === ERROR_NOT_FOUND) {
        nonExistentDataNotification(res, err, 'Пользователя с таким id не существует');
        return;
      }
      serverErrorNotification(res, err, 'Серверная ошибка');
    });
}

function createUser(req, res) {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then(user => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        invalidDataNotification(res, err, 'Введённые данные невалидны');
        return;
      }
      serverErrorNotification(res, err, 'Серверная ошибка');
    });
}

function updateUserProfile(req, res) {
  User.findByIdAndUpdate(req.user._id,
    {
    name: req.body.name,
    about: req.body.about
    }, {
    new: true,
    runValidators: true,
    upsert: true
    }
  )
    .orFail(() => {
      createNotFoundError();
    })
    .then(user => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        invalidDataNotification(res, err, 'Введённые данные невалидны');
        return;
      }
      if (err.kind === 'ObjectId') {
        invalidDataNotification(res, err, 'Невалидный id пользователя');
        return;
      }
      if (err.statusCode === ERROR_NOT_FOUND) {
        nonExistentDataNotification(res, err, 'Пользователя с таким id не существует');
        return;
      }
      serverErrorNotification(res, err, 'Серверная ошибка');
    });
}

function updateUserAvatar(req, res) {
  User.findByIdAndUpdate(req.user._id,
    {avatar: req.body.avatar},
    {
    new: true,
    runValidators: true,
    upsert: true
    }
  )
    .orFail(() => {
      createNotFoundError();
    })
    .then(user => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        invalidDataNotification(res,err, 'Введённые данные невалидны');
        return;
      }
      if (err.kind === 'ObjectId') {
        invalidDataNotification(res, err, 'Невалидный id пользователя');
        return;
      }
      if (err.statusCode === ERROR_NOT_FOUND) {
        nonExistentDataNotification(res, err, 'Пользователя с таким id не существует');
        return;
      }
      serverErrorNotification(res, err, 'Серверная ошибка');
    });
}


module.exports = {
  getUsers,
  getUserProfile,
  createUser,
  updateUserProfile,
  updateUserAvatar
}