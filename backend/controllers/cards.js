const Card = require('../models/card');
const {
  NotFoundError,
  ForbiddenError,
  InvalidRequestError,
} = require('../errors/errors');

function getCards(req, res, next) {
  Card.find({})
    .then((cards) => {
      if (!cards) {
        throw new Error();
      }
      res.send(cards);
    })
    .catch((err) => next(err));
}

function createCard(req, res, next) {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new InvalidRequestError('Введённые данные невалидны');
      }
      throw err;
    })
    .catch((err) => next(err));
}

function deleteCard(req, res, next) {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findOne({ _id: cardId })
    .orFail(() => {
      throw new NotFoundError('Карточки с таким id не существует');
    })
    .then((card) => {
      if ((card.owner).toString() !== userId) {
        throw new ForbiddenError('Нельзя удалять карточки других пользователей');
      } else {
        Card.findByIdAndRemove(cardId)
          // eslint-disable-next-line no-shadow
          .then((card) => res.send({ data: card, message: 'карточка удалена' }))
          .catch((err) => next(err));
      }
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        throw new InvalidRequestError('Невалидный id карточки');
      }
      next(err);
    })
    .catch((err) => next(err));
}

function likeCard(req, res, next) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError('Карточки с таким id не существует');
    })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        throw new InvalidRequestError('Невалидный id карточки');
      }
      next(err);
    })
    .catch((err) => next(err));
}

function dislikeCard(req, res, next) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError('Карточки с таким id не существует');
    })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        throw new InvalidRequestError('Невалидный id карточки');
      }
      next(err);
    })
    .catch((err) => next(err));
}

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
