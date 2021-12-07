// ************ Require's ************
const express = require('express');
const router = express.Router();
const path = require('path');

// ************ Controller Require ************
const mainController = require('../controllers/mainController');
const projectsController = require('../controllers/projectsController');
const usersController = require('../controllers/usersController');
const coursesController = require('../controllers/coursesController');
const coursesControllerDB = require('../controllers/coursesControllerDB');
const usersControllerDB = require('../controllers/usersControllerDB');

// Multer
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        let folder = ('./public/images');
        cb(null, folder);
    },
    filename: function(req, file, cb){
        const productImageFile = 'product-' + Date.now() + path.extname(file.originalname);
        cb(null, productImageFile);
    }
})

const uploadFile = multer({storage: storage});

// Validators
const { body, check } = require('express-validator');
const guestMiddleware = require('../middlewares/guestMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');
const { userCourses } = require('../controllers/coursesController');
const userLoggedMiddleware = require('../middlewares/userLoggedMiddleware');


const validateLogin = [
    check('email').notEmpty().withMessage("Can't be empty"),
    check('password').notEmpty().withMessage("Can't be empty")
];

const validateNewUser = [
    check('first_name').notEmpty().withMessage("Can't be empty"),
    check('email').notEmpty().withMessage("Can't be empty"),
    check('password')
        .notEmpty().withMessage("Choose a password").bail()
        .isLength({min:5}).withMessage("Password must have at least 5 characters ")
];

const validateNewproject = [
    check('project_picture').custom((value, { req }) => {
        let file = req.file;
        if(!file) {
            throw new Error ('Image')
        }
    })
]

// INDEX
router.get('/', mainController.index);

router.get('/create', mainController.create);

router.get('/projects/', mainController.projects);
router.get('/project/:id', mainController.project);
router.get('/dashboard', mainController.dashboard);

// COURSES
router.get('/gallery', coursesController.gallery);

router.get('/start-here', authMiddleware, coursesControllerDB.startHere);

module.exports = router;