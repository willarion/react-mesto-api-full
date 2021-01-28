const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getUsers, getUserProfile, getCurrentUserProfile, updateUserProfile, updateUserAvatar }= require('../controllers/users');


router.get('/users', getUsers);
router.get('/users/me', getCurrentUserProfile);

router.get('/users/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24),
  }),
}), getUserProfile);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  })
}), updateUserProfile);

router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().uri(),
  })
}), updateUserAvatar);


module.exports = router;
