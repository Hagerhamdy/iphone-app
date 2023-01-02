const router = require('express').Router();

const authService = require('../services/authService');
const { addAddressToUseraddresses, removeAddressFromAddresses, getLoggedUserAddresses } = require('../services/addressService');

router.use(authService.protect, authService.allowedTo('user'));

router.route('/').post(addAddressToUseraddresses)
    .get(getLoggedUserAddresses);

router.delete('/:addressId', removeAddressFromAddresses)

module.exports = router;