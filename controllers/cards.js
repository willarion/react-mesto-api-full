const Card = require('../models/card');
const { ERROR_NOT_FOUND } = require('../utils/constants');
const {
  serverErrorNotification,
  invalidDataNotification,
  nonExistentDataNotification,
  createNotFoundError
} = require('../helpers/errors');


function getCards(req, res) {
  Card.find({})
    .then(cards => res.send(cards))
    .catch(err => serverErrorNotification(res, err, 'Серверная ошибка'));
}

function createCard(req, res) {
  const { name, link } = req.body;

  Card.create({name, link, owner: req.user._id })
    .then(card => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        invalidDataNotification(res, err, 'Введённые данные невалидны');
        return;
      }
      serverErrorNotification(res, err, 'Серверная ошибка');
    });
}

function deleteCard(req, res) {
  const cardId = req.params.cardId;
  const userId = req.user._id;

  Card.findOne({_id: cardId})
    .orFail(() => {
      createNotFoundError();
    })
    .then((card) => {
      if((card.owner).toString() !== userId) {
        const err = new Error();
        err.statusCode = 403;
        err.message = 'Нельзя удалять карточки других пользователей'
        throw err;
      } else {
        Card.findByIdAndRemove(cardId)
          .then(card => res.send({ data: card, message: "карточка удалена" }))
          .catch(err => err);
      }
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        invalidDataNotification(res, err, 'Невалидный id карточки');
        return;
      }
      if (err.statusCode === ERROR_NOT_FOUND) {
        nonExistentDataNotification(res, err, 'Карточки с таким id не существует');
        return;
      }
      if (err.statusCode === 403) {
        res.status(403).send(err.message);
        console.log('одна ошибка и ты ошибся')
        return;
      }
      serverErrorNotification(res, err, 'Серверная ошибка');
    });
}

function likeCard(req, res) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      createNotFoundError();
    })
    .then(card => res.send({ data: card, message: "лайк поставлен" }))
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        invalidDataNotification(res, err, 'Невалидный id карточки');
        return;
      }
      if (err.statusCode === ERROR_NOT_FOUND) {
        nonExistentDataNotification(res, err, 'Карточки с таким id не существует');
        return;
      }
      serverErrorNotification(res, err, 'Серверная ошибка');
    });
}

function dislikeCard(req, res) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      createNotFoundError();
    })
    .then(card => res.send({ data: card, message: "лайк удалён" }))
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        invalidDataNotification(res, err, 'Невалидный id карточки');
      }
      if (err.statusCode === ERROR_NOT_FOUND) {
        nonExistentDataNotification(res, err, 'Карточки с таким id не существует');
        return;
      }
      serverErrorNotification(res, err, 'Серверная ошибка');
    });
}


module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard
};
