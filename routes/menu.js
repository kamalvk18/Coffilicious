var express = require("express");
var router  = express.Router({mergeParams: true});
var coffee = require("../models/coffee");
var middleware = require("../middleware");

router.get("/",function(req,res){
	coffee.find({},function(err,coffees){
		if(err){
			console.log("cannot load");
		}
		else{
			res.render("coffee/menu",{coffee : coffees});	
		}
	})	
})

router.post("/",function(req,res){
	var name = req.body.name;
	var image = req.body.image;
	var price = req.body.price;
	var desc = req.body.desc;
	var newCoffee = {name: name,image: image,price: price, desc: desc};
	coffee.create(newCoffee,function(err,newCoffee){
		if(err){
			console.log("Sorry cannot be added")
		}
		else{
			res.redirect("/menu")
		}
	})
})

router.put("/:id",async function(req,res){
	const {id} = req.params
	const editCoffee = await coffee.findByIdAndUpdate(id,req.body)
	console.log(editCoffee.name)
	res.redirect("/menu")
})

router.get("/new",function(req,res){
	res.render("coffee/new")
})


router.get("/:id",middlewareObj.isLoggedIn,function(req,res){
	coffee.findById(req.params.id).populate("reviews").exec(function(err,foundCoffee){
		if(err){
			cosnsole.log(err);
		}
		else{
			res.render("coffee/show", {coffee: foundCoffee});
		}
	})
})

router.get('/:id/edit',async function(req,res){
	const {id} = req.params
	const foundCoffee = await coffee.findById(id)
	res.render("coffee/edit",{coffee:foundCoffee})
})

module.exports = router;