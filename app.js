var express = require("express")
var app = express();

var coffee = require("./models/coffee");
var Review = require("./models/review")

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/coffilicous",{
	useNewUrlParser: true, 
	useUnifiedTopology: true 
})
// mongo "mongodb+srv://cluster0-qdusk.mongodb.net/<dbname>" --username kamalvk18

app.use(express.static(__dirname+"/public"));

app.set("view engine","ejs");

app.get("/",function(req,res){
	res.render("home");
})

app.get("/menu",function(req,res){
	coffee.find({},function(err,coffees){
		if(err){
			console.log("cannot load");
		}
		else{
			res.render("coffee/menu",{coffee : coffees});	
		}
	})	
})

app.post("/menu",function(req,res){
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
app.get("/menu/new",function(req,res){
	res.render("coffee/new")
})

app.get("/menu/:id",function(req,res){
	coffee.findById(req.params.id).populate("reviews").exec(function(err,foundCoffee){
		if(err){
			console.log(err);
		}
		else{
			res.render("coffee/show", {coffee: foundCoffee});
		}
	})
})

// ================================
// REVIEW ROUTES
// ================================

app.get("/menu/:id/review/new",function(req,res){
	coffee.findById(req.params.id,function(err,foundCoffee){
		if(err){
			console.log(err);
		}
		else{
			res.render("reviews/new", {coffee: foundCoffee});
		}
	})
})

app.post("/menu/:id/review",function(req,res){
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
					coffee.reviews.push(review);
					coffee.save();
					res.redirect("/menu/"+ coffee._id)
				}
			});
		}
	});
});

app.get("/about",function(req,res){
	res.render("about");
})

app.listen(process.env.PORT||3000,function(){
	console.log("Server Started...");
})