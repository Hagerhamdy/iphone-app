const router = require('express').Router();

const { getUsers, createUser, getUserById, updateUser, deleteUser, uploadUserImage, resizeImage,
    changeUserPassword, getLoggedUserData, updateLoggedUserPassword, updateLoggedUserData, deleteLoggedUserData } =
    require('../services/userService');
const { getUserByIdValidator, createUserValidator, updateUserValidator,
    deleteUserValidator, changeUserPasswordValidator, updateLoggedUserValidator } =
    require('../utils/validator/userValidator');
const authServive = require('../services/authService');


//Router for logged user data by himself
router.get('/getMe', authServive.protect, getLoggedUserData, getUserById);
router.put('/changeMyPassword', authServive.protect, updateLoggedUserPassword);
router.put('/updateMe', authServive.protect, updateLoggedUserValidator, updateLoggedUserData);
router.delete('/deleteMe', authServive.protect, deleteLoggedUserData);

//Router to put user password
router.put('/changePassword/:id', changeUserPasswordValidator, changeUserPassword);

router.route('/').get(authServive.protect, authServive.allowedTo('admin', 'manager'),
    getUsers)
    .post(authServive.protect, authServive.allowedTo('admin'),
        uploadUserImage, resizeImage, createUserValidator, createUser);
router.route('/:id').get(authServive.protect, authServive.allowedTo('admin'),
    getUserByIdValidator, getUserById)
    .put(authServive.protect, authServive.allowedTo('admin'),
        uploadUserImage, resizeImage, updateUserValidator, updateUser)
    .delete(authServive.protect, authServive.allowedTo('admin'),
        deleteUserValidator, deleteUser);


module.exports = router;  