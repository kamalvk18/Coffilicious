var express = require("express");
var router  = express.Router({mergeParams: true});
var Review = require("../models/review");
var coffee = require("../models/coffee")

router.get("/new",isLoggedIn,function(req,res){
	coffee.findById(req.params.id,function(err,foundCoffee){
		if(err){
			console.log(err);
		}
		else{
			res.render("reviews/new", {coffee: foundCoffee});
		}
	})
})

router.post("/",isLoggedIn,function(req,res){
	coffee.findById(req.params.id,function(err,coffee){
		if(err){
			console.log(err);
			res.redirect("/menu")
		}
		else{
			Review.create(req.body.review, function(err,review){
				if(err){
					console.log(err)
				}
				else{
					review.author.id=req.user._id;
					review.author.username=req.user.username;
					review.save();
					coffee.reviews.push(review);
					coffee.save();
					res.redirect("/menu/"+ coffee._id)
				}
			});
		}
	});
});

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
	   return next()
	   }
	res.redirect("/login")
}

module.exports = router;