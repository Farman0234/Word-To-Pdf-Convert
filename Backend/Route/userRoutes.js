const express = require('express'); // Importing the Express module
const router = express.Router(); // Initializing the router object

const userController = require('../App/Apis/Controller/UserController'); // Importing the controller

router.post('/Signup', userController.register);   
router.post('/authenticate',userController.authenticate)

module.exports = router;



