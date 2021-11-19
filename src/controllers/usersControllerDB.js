// Requiring file system handler and path for joining directories
const fs = require('fs');
const path = require('path');

// For express-validator
const { validationResult } = require('express-validator');

// Bring DB
const db = require('../database/models');
const sequelize = db.sequelize;
const { Op } = require("sequelize");
const Category = require('../database/models/Category');

// Call each model
const Videos = db.Video;
const Course = db.Course;
const Categories = db.Category;
const User = db.User;

// encrypt password
const bcrypt = require('bcryptjs');
const { off } = require('process');

// Methods
const usersController = {
	users: (req,res) =>{
        User.findAll()
			.then(users=>{
				return res.render('users/users.ejs', {users, userLogged:req.session.userToLog});
			})
			.catch((err) => {console.log(err)});
	},
    createUserForm: (req,res)=>{
        res.render('users/createUser.ejs');
    },
    createUser: (req,res)=>{
        const { first_name, last_name, email, password } = req.body;
        User.create({
            first_name,
            last_name,
            email,
            password: bcrypt.hashSync(password, 10)
        })
            .then(()=>{
                return res.redirect('/');
            })
            .catch((err)=> res.send(err));
    },
    loginForm: (req,res)=>{
        res.render('users/login.ejs');
    },
    login: (req,res)=>{
        let errors = validationResult(req);
        let userToLog = undefined;

        let users = User.findAll()
                        .then((users)=>{
                            if(errors.isEmpty()){
                                for(let i=0; i<users.length; i++){
                                    if(users[i].email == req.body.email){
                                        if(bcrypt.compareSync(req.body.password, users[i].password)){
                                            console.log('Password match');
                                            userToLog = users[i];
                                            break;
                                        }
                                    }
                                }
                    
                                if(userToLog == undefined){
                                    res.render('login.ejs', {errors: errors});
                                    console.log(errors.mapped());
                                }
                                else{
                                    req.session.userToLog = userToLog;
                    
                                    if(req.body.remember != undefined){
                                        res.cookie('rememberAccount', userToLog.email, {maxAge: 600000});
                                    }
                                    else{
                                        console.log('do not remember account');
                                    }
                                res.redirect('/');
                    
                                }
                            }
                            else{
                                console.log(errors.mapped());
                                console.log("WHWHW");
                                res.render('login', {errors: errors.mapped(), oldData : req.body})
                            }
                        })

        
    },
    logout: (req,res) =>{
        delete req.session.userToLog; //delete the user from the session
        if(req.cookies.rememberAccount){
            res.clearCookie('rememberAccount');
            // delete req.cookies.rememberAccount;
        }
        res.redirect('/');
    },
}

module.exports = usersController;