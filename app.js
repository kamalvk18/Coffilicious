var express 	  		  = require("express"),
    mongoose 	  		  = require("mongoose"),
	bodyParser    		  = require("body-parser"),
	passport	  		  = require("passport"),
	localStrategy 		  = require("passport-local"),
	passportLocalMongoose = require("passport-local-mongoose")

var app = express();
var coffee = require("./models/coffee");
var Review = require("./models/review")
var User   = require("./models/user")

var menuRoutes    = require("./routes/menu"),
	reviewRoutes  = require("./routes/reviews"),
	indexRoutes   = require("./routes/index")

var url = process.env.DATABASEURL||"mongodb://localhost/coffilicous"

mongoose.connect(url,{
	useNewUrlParser: true, 
	useUnifiedTopology: true,
	useCreateIndex: true
 })//.then(() => {
// 	console.log('Connected to DB!');
// }).catch(err => {
// 	console.log('ERROR:', err.message);
// });
//mongodb+srv://kamalvk18:kamal@123@cluster0-qdusk.mongodb.net/kamalvk18?retryWrites=true&w=majority
	

 
app.locals.moment = require("moment");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname+"/public"));
app.set("view engine","ejs");

app.use(require("express-session")({
	secret :"Mustang is one of my dream car",
	resave :false,
	saveUninitialized :false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	next();
});

app.use("/",indexRoutes)
app.use("/menu/:id/review",reviewRoutes)
app.use("/menu",menuRoutes)

app.use(function(err, req, res, next) {
    console.log(err);
});

app.listen(process.env.PORT||3000,function(){
	console.log("Server Started...");
})