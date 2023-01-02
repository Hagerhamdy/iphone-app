const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');

const factory = require('./handlerFactory');
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware');
const UserModel = require('../models/userModel');
const ApiError = require('../utils/ApiError');
const generateToken = require('../utils/generateToken');


//upload single image
exports.uploadUserImage = uploadSingleImage('profileImg');

//image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
    const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;
    //console.log(req.file);
    if (req.file) {
        await sharp(req.file.buffer)
            .resize(600, 600)
            .toFormat('jpeg')
            .jpeg({ quality: 95 })
            .toFile(`uploads/user/${filename}`);
        //save image into db
        req.body.profileImg = filename;
    }

    next();
})

//@desc Get all User
//@route Get /api/User
//@accsee Private
exports.getUsers = factory.getAll(UserModel);

//@desc Get User by id
//@route Get /api/User/:id
//@access Private
exports.getUserById = factory.getOne(UserModel);

//@desc Create User
//@route Post /api/User
//@accsee Private
exports.createUser = factory.createOne(UserModel);

//@desc Put User by id
//@route Put /api/User/:id
//@access Private
exports.updateUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await UserModel.findByIdAndUpdate(id, {
        name: req.body.name,
        slug: req.body.slug,
        email: req.body.email,
        phone: req.body.phone,
        profileImg: req.body.profileImg,
        role: req.body.role
    }, { new: true });
    if (!document) {
        return next(new ApiError(`No document with this ${id}`, 404));
    }
    res.status(200).json({ data: document });
});

//@desc Put UserPassword by id
//@route Put /api/UserPassword/:id
//@access Private
exports.changeUserPassword = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await UserModel.findByIdAndUpdate(id, {
        password: await bcrypt.hash(req.body.password, 12),
        passwordChangedAt: Date.now(),
    }, { new: true });
    if (!document) {
        return next(new ApiError(`No document with this ${id}`, 404));
    }
    res.status(200).json({ data: document });
});


//@desc Delete User by id
//@route Delete /api/User/:id
//@access Private/admin
exports.deleteUser = async (req, res, next) => {
    const user = await UserModel.findByIdAndUpdate(req.params.id, { active: false });
    if (user) {
        res.status(200).json(`User name : '${user.name}' is now deActive!`);
    }
    return next(new ApiError(`User : ${user.name} not found`, 404));
};

//@desc Get logged user data
//@route Get /api/User/getMe
//@access Private/Protect
exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
    req.params.id = req.user._id;
    next();
})

//@desc Update logged user password
//@route Put /api/User/changeMyPassword
//@access Private/Protect
exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
    //1- update user password based on user payload (req.user._id)
    const user = await UserModel.findByIdAndUpdate(
        req.user._id,
        {
            password: await bcrypt.hash(req.body.password, 12),
            passwordChangedAt: Date.now()
        }, { new: true }
    )
    //generate token
    const token = generateToken(user._id);
    res.status(200).json({ data: user, token })

})

//@desc Update logged user data
//@route Put /api/User/updateMe
//@access Private/Protect
exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
    const updatedUser = await UserModel.findByIdAndUpdate(
        req.user._id,
        {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone
        }, { new: true }
    )
    res.status(200).json({ data: updatedUser });
})

//@desc DeActive logged user data
//@route Delete /api/User/deleteMe
//@access Private/Protect
exports.deleteLoggedUserData = asyncHandler(async (req, res, next) => {
    await UserModel.findByIdAndUpdate(req.user._id, { active: false });
    res.status(204).json({ status: "success" });
})