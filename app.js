var express          = require("express"),
    app              = express(),
    bodyParser       = require("body-parser"),
    mongoose         = require("mongoose"),
    flash            = require("connect-flash"),
    Campground       = require("./models/campground"),
    passport         = require("passport"),
    methodOverride   = require("method-override"),
    LocalStrategy    = require ("passport-local"),
    FacebookStrategy = require ("passport-facebook"),
    User             =require("./models/user"),
    Comment          = require("./models/comment"),
    seedDB           = require("./seeds");
    
// seedDB(); // seed the databse

var commentRoutes       = require("./routes/comments"),
    camgroundRoutes     = require("./routes/campgrounds"),
    indexRoutes          = require("./routes/index")
    
mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true});

app.use(bodyParser.urlencoded({extended:true}));

app.set("view engine", "ejs");

app.use(flash());
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(require("express-session")({
    secret : "Dreamcatcher",
    resave:  false,
     saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/",indexRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds",camgroundRoutes);


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started");
});