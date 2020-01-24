var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Campground = require("../models/campgrounds");
var Trips = require("../models/trips");

router.get("/", function(req, res) {
    res.redirect("/campgrounds");
});

//=============
//AUTH ROUTES
//=============
router.get("/register", function(req,res) {
    res.render("register");
});

router.post("/register", function(req, res) {
    var newUser = new User({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        avatar: req.body.avatar,
        description: req.body.description
    });

    if(req.body.adminCode === 'admin123') {
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function(err, user) {
        if(err) {
            console.log(err);
            return res.render("register");
        } 
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds");
        });
    });
});

//show login form
router.get("/login", function(req, res) {
    res.render("login");
});
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req,res) {
});

//logic route
router.get("/logout", function(req,res) {
    req.logout();
    res.redirect("/campgrounds");
});

//USERS PROFILE
router.get("/users/:id", function(req, res) {
    User.findById(req.params.id).populate("listOfTrips").exec( function(err, foundUser) {
      if(err) {
        console.log(err);
        return res.redirect("/");
      }
      Campground.find().where('author.id').equals(foundUser._id).exec(function(err, campgrounds) {
        if(err) {
          console.log(err);
          return res.redirect("/");
        }
        
        res.render("users/show", {user: foundUser, campgrounds: campgrounds});
      })
    });
  });

  //USERS PROFILE UPDATE LIST OF TRIPS
  router.post("/users/:id", function(req, res) {

      
    User.findById(req.params.id,  function(err, updatedUser) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            Trips.create(req.body.listOfTrips, function(err, list) {
                if(err) {
                    console.log(err);
                } else {
                    console.log(list)
                    updatedUser.listOfTrips.push(list);
                    updatedUser.save(); 
                    
                    res.redirect('/users/' + updatedUser._id);
                }
            });
        }
    });
  });

  //DESTROY RESERWATION 
router.delete("/users/:id/:trip_id", function(req, res) {
    Trips.findByIdAndRemove(req.params.trip_id, function(err) {
        if(err) {
            res.redirect("back");
        } else {
            res.redirect("/users/" + req.params.id);
        }
    });
});

//UPDATE UBEZPIECZENIE
router.put("/users/:id/:trip_id", function(req, res) {
    Trips.findByIdAndUpdate(req.params.trip_id, req.body.listOfTrips, function(err, updateTrip) {
        if(err) {
            console.log(err)
        } else {
            res.redirect("/users/" + req.params.id);
        }
    });
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;