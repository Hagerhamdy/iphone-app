const router = require('express').Router();

const { signup, login, forgotPassword, verifyPassResetCode, resetPassword } = require('../services/authService');
const { signUpValidator, loginValidator } = require('../utils/validator/authValidator');


router.route('/signup').post(signUpValidator, signup);
router.route('/login').post(loginValidator, login);
router.route('/forgotPassword').post(forgotPassword);
router.route('/verifyResetCode').post(verifyPassResetCode);
router.route('/resetPassword').put(resetPassword);



module.exports = router;  