const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { NODE_ENV, JWT_SECRET } = process.env;
const {
  NotFoundError,
  UnathorizedError,
  InvalidRequestError
} = require('../errors/errors');


function getUsers(req, res, next) {
  User.find({})
    .then((users) => {
      if(!users) {
        throw new Error();
      }
      res.send(users)
    })
    .catch(err => next(err));
}

function getUserProfile(req, res, next) {

  User.findById(req.params.id)
    .orFail(() => {
      throw new NotFoundError('Пользователя с таким id не существует');
    })
    .then(user => res.send({ data: user }))
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        throw new InvalidRequestError('Невалидный id пользователя');
      }
      next(err);
    })
    .catch(err => next(err));
}

function getCurrentUserProfile(req, res, next) {

  User.findById(req.user._id)
    .then((user) => {
      if(!user) {
        throw new NotFoundError('Пользователя с таким id не существует');
      }
      res.send({ data: user })
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        throw new InvalidRequestError('Невалидный id пользователя');
      }
      next(err);
    })
    .catch(err => next(err));
}

function updateUserProfile(req, res, next) {
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
      throw new NotFoundError('Пользователя с таким id не существует');
    })
    .then(user => res.send( user ))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new InvalidRequestError('Введённые данные невалидны');
      }
      if (err.kind === 'ObjectId') {
        throw new InvalidRequestError('Невалидный id пользователя');
      }
      next(err);
    })
    .catch(err => next(err));
}

function updateUserAvatar(req, res, next) {
  User.findByIdAndUpdate(req.user._id,
    {avatar: req.body.avatar},
    {
    new: true,
    runValidators: true,
    upsert: true
    }
  )
    .orFail(() => {
      throw new NotFoundError('Пользователя с таким id не существует');
    })
    .then(user => res.send( user ))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new InvalidRequestError('Введённые данные невалидны');
      }
      if (err.kind === 'ObjectId') {
        throw new InvalidRequestError('Невалидный id пользователя');
      }
      next(err);
    })
    .catch(err => next(err));
}

function createUser(req, res, next) {
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
        throw new InvalidRequestError('Введённые данные невалидны');
      }
      next(err);
    })
    .catch(err => next(err));
}

function login (req, res, next) {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'shhhh-it-is-secret', { expiresIn: '7d' });

      res.send({ token });
    })
    .catch((err) => {
      throw new UnathorizedError('Необходима авторизация')
    })
    .catch(err => next(err));
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