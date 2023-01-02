const crypto = require('crypto');

const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');

const ApiError = require('../utils/ApiError');
const sendEmail = require('../utils/sendEmail');
const generateToken = require('../utils/generateToken');
const UserModel = require('../models/userModel');


//@desc Create signup
//@route Post /api/auth/signup
//@accsee Public
exports.signup = asyncHandler(async (req, res, next) => {
    // 1- create user
    const user = await UserModel.create({
        name: req.body.name,
        password: req.body.password,
        email: req.body.email
    })
    //2- generate token
    const token = generateToken(user._id);

    res.status(201).json({ data: user, token });
});

//@desc Create login
//@route Post /api/auth/login
//@accsee Public
exports.login = asyncHandler(async (req, res, next) => {
    //1-check if password and email in body (validation)
    //2-check if user exist && password is correct
    const user = await UserModel.findOne({ email: req.body.email });
    const checkedPass = await bcrypt.compare(req.body.password, user.password);
    if (!user || !checkedPass) {
        return next(new ApiError(`Incorrect email or password`, 401));
    }
    //3- generate token
    const token = generateToken(user._id);
    //4-send res to client side
    res.status(200).json({ data: user, token });
})

//@desc User logged in
exports.protect = asyncHandler(async (req, res, next) => {
    //1- check if token exist, if exist get it
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } if (!token) {
        return next(new ApiError('You are not login, please login first', 401));
    }

    //2-verify token (change happens in token, expired token)
    const decoded = jwt.verify(token, process.env.JWT_SECTET_KEY);
    // console.log(decoded);
   // console.log(token)

    //3- check if user exists
    const currentUser = await UserModel.findById(decoded.userId);
    if (!currentUser) {
        return next(new ApiError('The user that belong to this token does no longer exist', 401));
    }

    //4- check if user changed his password after token created
    if (currentUser.passwordChangedAt) {
        const passChangedTimestamp = parseInt(currentUser.passwordChangedAt / 1000, 10);
        // console.log(passChangedTimestamp, decoded.iat) 
        if (passChangedTimestamp > decoded.iat) {
            return next(new ApiError('User recently changed his password, please login again', 401));
        }
    }
    req.user = currentUser;
    next();

})

//@desc Authorization (user permission)
//...roles => ['admin', 'manager']
exports.allowedTo = (...roles) => asyncHandler(async (req, res, next) => {
    //1- access roles    2- access registerd user (req.user.role)
    if (await !roles.includes(req.user.role)) {
        return next(new ApiError('You are not allowed to access this route', 403));
    }
    next();
})


//@desc Forgot Password
//@route Post /api/auth/forgotPassword
//@access Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
    //1- get user by email
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
        return next(new ApiError(`There is no user with email ${req.body.email}`));
    }
    //2- if user exists, Generate hash reset random 6 digits and save it in db
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedResetCode = crypto.createHash('sha256')
        .update(resetCode).digest('hex');
    //save hashed pass reset code into db
    user.passwordResetCode = hashedResetCode;
    //add expiration time for pass reset code (10 min)
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    user.passwordResetVerified = false;

    await user.save();

    //3- send reset code via email
    const message = `Hi ${user.name}, \n we received a request to reset your password \n ${resetCode} \n Enter code, \n E-iPhone Team.`

    await sendEmail({
        email: user.email,
        subject: 'Your reset password valid fron 10 min',
        message
    })
    res.status(200).json({ status: 'success', message: 'Your reset password sent to email' });
})

//@desc Verify password reset code
//@route Post /api/auth/verifyResetCode
//@access Public
exports.verifyPassResetCode = asyncHandler(async (req, res, next) => {
    //1- Get user based on reset code
    const hashedResetCode = crypto.createHash('sha256')
        .update(req.body.resetCode).digest('hex');

    const user = await UserModel.findOne({
        passwordResetCode: hashedResetCode,
        passwordResetExpires: { $gt: Date.now() }
    })
    if (!user) {
        return next(new ApiError('Reset code invalid or expired'));
    }
    //2- Reset code invalid
    user.passwordResetVerified = true;
    await user.save();

    res.status(200).json({ status: 'success' });
})

//@desc Reset password 
//@route Post /api/auth/ResetPassword
//@access Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
    //1- Get user based on email
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user)
        return next(new ApiError(`There is no user with email ${req.body.email}`, 404));

    //2- check if user verified
    if (!user.passwordResetVerified) {
        return next(new ApiError(`Reset code not verified`, 400));
    }

    user.password = req.body.newPassword;
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;

    await user.save();

    //3- Generate token because password forgotten
    const token = generateToken(user._id);

    res.status(200).json({ token });

})

