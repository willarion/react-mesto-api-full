const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ERROR_NOT_FOUND } = require('../utils/constants');
const { NODE_ENV, JWT_SECRET } = process.env;
const {
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

function getCurrentUserProfile(req, res) {

  User.findById(req.user._id)
    .then(user => res.send({ data: user }))
    .catch((err) => {
      console.log(err);
      if (err.kind === 'ObjectId') {
        invalidDataNotification(res, err, 'Невалидный id пользователяz');
        return;
      }
      if (err.statusCode === ERROR_NOT_FOUND) {
        nonExistentDataNotification(res, err, 'Пользователя с таким id не существует');
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

function createUser(req, res) {
  const { email, password, name, about, avatar } = req.body;

  bcrypt.hash(password, 10)
    .then(hash => User.create({
      email,
      password: hash,
      name,
      about,
      avatar
    }))
    .then(user => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        invalidDataNotification(res, err, 'Введённые данные невалидны');
        return;
      }
      serverErrorNotification(res, err, 'Серверная ошибка');
    });
}

function login (req, res) {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'shhhh-it-is-secret', { expiresIn: '7d' });

      res.send({ token });
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};


module.exports = {
  getUsers,
  getUserProfile,
  getCurrentUserProfile,
  updateUserProfile,
  updateUserAvatar,
  createUser,
  login
}