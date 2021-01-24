const router = require('express').Router();
const {getUsers, getUserProfile, getCurrentUserProfile, updateUserProfile, updateUserAvatar}= require('../controllers/users');


router.get('/users', getUsers);
router.get('/users/me', getCurrentUserProfile);
router.get('/users/:id', getUserProfile);
router.patch('/users/me', updateUserProfile);
router.patch('/users/me/avatar', updateUserAvatar);


module.exports = router;
