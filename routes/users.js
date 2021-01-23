const router = require('express').Router();
const {getUsers, getUserProfile, createUser, updateUserProfile, updateUserAvatar}= require('../controllers/users');


router.get('/users', getUsers);
router.post('/users', createUser);
router.get('/users/:id', getUserProfile);
router.patch('/users/me', updateUserProfile);
router.patch('/users/me/avatar', updateUserAvatar);


module.exports = router;
