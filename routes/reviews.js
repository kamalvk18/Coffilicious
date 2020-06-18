var express = require("express");
var router  = express.Router({mergeParams: true});
var Review = require("../models/review");
var coffee = require("../models/coffee")
var middleware = require("../middleware");

router.get("/new",middlewareObj.isLoggedIn,function(req,res){
	coffee.findById(req.params.id,function(err,foundCoffee){
		if(err){
			console.log(err);
		}
		else{
			res.render("reviews/new", {coffee: foundCoffee});
		}
	})
})

router.post("/",middlewareObj.isLoggedIn,function(req,res){
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

router.get("/:reviewId/edit",middlewareObj.reviewOwnership,function(req,res){
	coffee.findById(req.params.id,function(err,foundCoffee){
		if(err){
			res.redirect("back")
		}
		else{
			Review.findById(req.params.reviewId,function(err,foundReview){
			if(err){
				res.redirect("back")
			}	
			else{
				res.render("reviews/edit",{review:foundReview, coffee:foundCoffee})
			}
		})		
	}
})
})

router.put("/:reviewId",middlewareObj.reviewOwnership,function(req,res){
	Review.findByIdAndUpdate(req.params.reviewId,req.body.review,function(err,foundReview){
		if(err){
			console.log(err);
		}
		else{
			res.redirect("/menu/"+req.params.id)
		}
	})
})

router.delete("/:reviewId",middlewareObj.reviewOwnership,function(req,res){
	Review.findByIdAndRemove(req.params.reviewId,function(err){
		if(err){
			res.redirect("back")
		}else{
			res.redirect("/menu/"+req.params.id);
		}
	})
})

module.exports = router;