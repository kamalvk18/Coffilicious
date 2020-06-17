var express = require("express");
var router  = express.Router();
var passport = require("passport")
var User   = require("../models/user");

router.get("/",function(req,res){
	res.render("home");
})

//SignUp

router.get("/signup",function(req,res){
	res.render("signup");
})

router.post("/signup",function(req,res){
	User.register(new User({username: req.body.username}),req.body.password,function(err,user){
		if(err){
			console.log(err);
			return res.render("signup");
		}
		passport.authenticate("local")(req,res,function(){
			req.flash("success","Welcome to Coffilicous "+req.user.username);
			res.redirect("/menu")
		})
		
	})
	
})

// Login & Logout

router.get("/login",function(req,res){
	res.render("login");
})

router.post("/login",passport.authenticate("local",
{
	successRedirect: "/menu",
	failureRedirect: "/login",
	failureFlash: true,
    successFlash: "Welcome back!"
}),function(req,res){
	
});

router.get("/logout",function(req,res){
	req.logout();
	req.flash("success","See you again!")
	res.redirect("/menu");
})

router.get("/about",function(req,res){
	res.render("about");
})

module.exports = router;