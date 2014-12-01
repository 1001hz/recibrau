 // app/routes.js


// setup ==========================================

var crypto = require('crypto');
var express = require('express');
var router = express.Router();

router.use(function (req, res, next) {
    console.log(req.method, req.url);
    next();
});


// models ==========================================

var Grain = require('./models/grain');
var User = require('./models/user');
var Recipe = require('./models/recipe');


// error handling ==========================================

var domain = require('domain');
var d = domain.create();

d.on('error', function (err) {
    console.error(err);
});



/* User */

router.post('/api/user/create', function (req, res) {
    d.run(function () {
        var username = req.body.username;
        var password = crypto.createHash('sha256').update(req.body.password).digest('hex');

        //check for duplicate
        User.findOne({ username: username }, function (err, user) {
            if (err) {
                res.json({ errors: err });
            }
            else if (user) {
                res.json({ errors: "Username " + username + " already exists." });
            }
            else {

                // create a user a new user
                var newUser = new User({
                    username: username,
                    password: password,
                    account: 'user', //always 'user' type for frontend accounts
                });

                newUser.setToken(function (err) {
                    if (err) {
                        res.json({ errors: err });
                    }
                    else {
                        newUser.save(function (err) {
                            if (err) {
                                console.log(err);
                                res.json({ errors: err });
                            }
                            else {
                                res.json({ success: true, token: newUser.token });
                            }
                        });
                    }

                });
            }

        });

    });//domain
});



router.post('/api/user/login', function (req, res) {
    d.run(function () {
        var username = req.body.username;
        var password = req.body.password;
        /*
        var username = '1001hz@gmail.com';
        var password = 'qwerty123';
        */
        User.findOne({ username: username }, function (err, user) {
            if (err) {
                console.log(err);
                res.json({ errors: err });
            }
            else if (!user) {
                //User is null
                res.json({ errors: "User " + username + " doesn't exist." });
            }
            else {
                //Test password
                user.comparePassword(password, function (err, isMatch) {
                    if (err) {
                        console.log(err);
                        res.json({ errors: err });
                    }
                    else if (!isMatch) {
                        res.json({ errors: "Password is incorrect." });
                    }
                    else {
                        user.setToken(function (err) {
                            if (err) {
                                console.log(err);
                                res.json({ errors: err });
                            }
                            else {
                                user.save(function (err) {
                                    if (err) {
                                        console.log(err);
                                        res.json({ errors: err });
                                    }
                                    else {
                                        res.json({ result: true, token: user.token });
                                    }
                                });
                            }

                        });
                    }
                });
            }
        });
    }); //domain
});



router.post('/api/user/tokenlogin', function (req, res) {
    d.run(function () {
        var username = req.body.username;
        var token = req.body.token;

        User.findOne({ username: username }, function (err, user) {
            if (err) {
                console.log(err);
                res.json({ errors: err });
            }
            if (!user) {
                //User is null
                res.json({ errors: "User " + username + " doesn't exist." });
            }
            if (user.token !== token) {
                res.json({ errors: "Invalid token." });
            
            }
            else {
                res.json({ result: true });
            }
        });
    });
});









/* Recipes */


router.post('/api/user/recipes', function (req, res) {
    d.run(function () {
        var username = req.body.username;
        var token = req.body.token;

        User.findOne({ username: username }, function (err, user) {
            if (err) {
                console.log(err);
                res.json({ errors: err });
            }
            if (!user) {
                //User is null
                res.json({ errors: "User " + username + " doesn't exist." });
            }
            if (user.token !== token) {
                res.json({ errors: "Invalid token." });
            }
            else {
                Recipe.find({ 'username': username }, function (err, docs) {
                    // get id and update time into recipeData
                    var arrRecipes = [];
                    for (i = 0; i < docs.length; i++) {
                        recipeData = JSON.parse(docs[i].recipeData)
                        recipeData._id = docs[i]._id;
                        recipeData.updated = docs[i].updated;
                        arrRecipes.push(recipeData);
                    }
                    res.json({ recipes: arrRecipes });
                });
            }
        });
    });
});



router.post('/api/user/recipe/save', function (req, res) {
    d.run(function () {
        var username = req.body.username;
        var token = req.body.token;
        var recipeData = req.body.recipeData;
        var recipeName = req.body.recipeName;
 
        // get user
        User.findOne({ username: username }, function (err, user) {
            if (err) {
                console.log(err);
                res.json({ errors: err });
            }
            else if (!user) {
                // user is null
                res.json({ errors: "User " + username + " doesn't exist." });
            }
            else {
                // test token
                user.validateToken(token, function (err, isValid, message) {
                    if (err) {
                        console.log(err);
                        res.json({ errors: err });
                    }
                    else if (!isValid) {
                        res.json({ errors: message });
                    }
                    else {
                        // save recipe

                        // check if is update or new
                        if (recipeData.hasOwnProperty('_id')) {
                            Recipe.findOne({ _id: recipeData._id }, function (err, recipe) {
                                if (err) {
                                    console.log(err);
                                    res.json({ errors: err });
                                }
                                else {
                                    var d = new Date();

                                    recipe.recipeData = JSON.stringify(recipeData);
                                    recipe.Name = recipeName;
                                    recipe.updated = d.getTime();

                                    recipe.save(function (err, savedRecipe) {
                                        if (err) {
                                            console.log(err);
                                            res.json({ errors: err });
                                        }
                                        else {
                                            console.log("Recipe updated");
                                            recipeObj = JSON.parse(savedRecipe.recipeData);
                                            res.json({ recipe: recipeObj });
                                        }
                                    });
                                }
                            })
                        }
                        else {
                            var d = new Date();

                            var newRecipe = new Recipe({
                                username: username,
                                recipeName: recipeName,
                                recipeData: JSON.stringify(recipeData),
                                updated: d.getTime()
                            });

                            newRecipe.save(function (err, recipe) {
                                if (err) {
                                    console.log(err);
                                    res.json({ errors: err });
                                }
                                else {
                                    console.log("Recipe created");
                                    recipeObj = JSON.parse(recipe.recipeData);
                                    recipeObj._id = recipe._id;
                                    res.json({ recipe: recipeObj });
                                }
                            });
                        }
                        
                    }

                });
            }
        });
    });
});



router.post('/api/user/recipe/delete', function (req, res) {
    d.run(function () {
        var username = req.body.username;
        var token = req.body.token;
        var recipeId = req.body.recipeId;

        // get user
        User.findOne({ username: username }, function (err, user) {
            if (err) {
                console.log(err);
                res.json({ errors: err });
            }
            else if (!user) {
                // user is null
                res.json({ errors: "User " + username + " doesn't exist." });
            }
            else {
                // test token
                user.validateToken(token, function (err, isValid, message) {
                    if (err) {
                        console.log(err);
                        res.json({ errors: err });
                    }
                    else if (!isValid) {
                        res.json({ errors: message });
                    }
                    else {
                        // delete recipe

                        Recipe.remove({ _id: recipeId }, function (err) {
                            if (err) {
                                console.log(err);
                                res.json({ errors: err });
                            }
                            else {
                                res.json({ success: true });
                            }
                        });

                    }

                });
            }
        });
    });
});






/* Grain */

router.get('/api/grains', function (req, res) {
    d.run(function () {
        // use mongoose to get all grains in the database
        Grain.find(function (err, grains) {
            if (err) {
                res.send(err);
            }

            res.json(grains); // return all grains in JSON format
        });
    });
});

router.post('/api/add/grain', function (req, res) {
    d.run(function () {
        var name = req.body.name;
        var extractPotential = req.body.extractPotential;
        var colour = req.body.colour;
        var maxYield = req.body.maxYield;

        var grain = new Grain({
            name: name,
            extractPotential: extractPotential,
            colour: colour,
            maxYield: maxYield
        });

        grain.save(function (err, data) {
            if (err) {
                console.log(err);
                res.json(err);
            }
            else {
                res.json({ message: "Saved: " + data });
            }
        });
    });
});

router.post('/api/remove/grain', function (req, res) {
    d.run(function () {
        var id = req.body.id;

        Grain.remove({ _id: id }, function (err) {
            if (err) {
                console.log(err);
                res.json(err);
            }
            else {
                res.json({ message: "Deleted: " + id });
            }
        });
    });
});


/*
router.get('/setGrains', function (req, res) {
    d.run(function () {

        var jsonObj = [{ "name": "Acid Malt", "Origin": " Germany", "Color": " 3", "Supplier": " ", "MustMash": " Yes", "Type": " Grain", "AddAfterBoil": " No", "Potential": " 1.027", "DiastaticPower": " 0.0", "DryYield": " 58.7", "MaxinBatch": " 10.0", "Coarse\/FineDiff": " 1.5", "Protein": " 6.0", "Moisture": " 4.0" }, { "name": "Amber Dry Extract", "Origin": " US", "Color": " 13", "Supplier": " ", "MustMash": " No", "Type": " Dry Extract", "AddAfterBoil": " No", "Potential": " 1.044", "DiastaticPower": " -", "DryYield": " 95.0", "MaxinBatch": " 100.0", "Coarse\/FineDiff": " -", "Protein": " -", "Moisture": " -" }, { "name": "Amber Liquid Extract", "Origin": " US", "Color": " 13", "Supplier": " ", "MustMash": " No", "Type": " Extract", "AddAfterBoil": " No", "Potential": " 1.036", "DiastaticPower": " -", "DryYield": " 78.0", "MaxinBatch": " 100.0", "Coarse\/FineDiff": " -", "Protein": " -", "Moisture": " -" }, { "name": "Amber Malt", "Origin": " United Kingdom", "Color": " 22", "Supplier": " ", "MustMash": " Yes", "Type": " Grain", "AddAfterBoil": " No", "Potential": " 1.035", "DiastaticPower": " 20.0", "DryYield": " 75.0", "MaxinBatch": " 20.0", "Coarse\/FineDiff": " 1.5", "Protein": " 10.0", "Moisture": " 2.8" }, { "name": "Aromatic Malt", "Origin": " Belgium", "Color": " 26", "Supplier": " ", "MustMash": " Yes", "Type": " Grain", "AddAfterBoil": " No", "Potential": " 1.036", "DiastaticPower": " 29.0", "DryYield": " 78.0", "MaxinBatch": " 10.0", "Coarse\/FineDiff": " 1.5", "Protein": " 11.8", "Moisture": " 4.0" }, { "name": "Barley Hulls", "Origin": " US", "Color": " 0", "Supplier": " ", "MustMash": " No", "Type": " Adjunct", "AddAfterBoil": " No", "Potential": " 1.000", "DiastaticPower": " -", "DryYield": " 0.0", "MaxinBatch": " 5.0", "Coarse\/FineDiff": " -", "Protein": " -", "Moisture": " -" }, { "name": "Barley, Flaked", "Origin": " US", "Color": " 2", "Supplier": " ", "MustMash": " Yes", "Type": " Grain", "AddAfterBoil": " No", "Potential": " 1.032", "DiastaticPower": " 0.0", "DryYield": " 70.0", "MaxinBatch": " 20.0", "Coarse\/FineDiff": " 1.5", "Protein": " 13.5", "Moisture": " 9.0" }, { "name": "Barley, Raw", "Origin": " US", "Color": " 2", "Supplier": " ", "MustMash": " Yes", "Type": " Grain", "AddAfterBoil": " No", "Potential": " 1.028", "DiastaticPower": " 0.0", "DryYield": " 60.9", "MaxinBatch": " 15.0", "Coarse\/FineDiff": " 1.5", "Protein": " 11.7", "Moisture": " 4.0" }, { "name": "Barley, Torrefied", "Origin": " US", "Color": " 2", "Supplier": " ", "MustMash": " Yes", "Type": " Grain", "AddAfterBoil": " No", "Potential": " 1.036", "DiastaticPower": " 0.0", "DryYield": " 79.0", "MaxinBatch": " 40.0", "Coarse\/FineDiff": " 1.5", "Protein": " 16.0", "Moisture": " 4.0" }, { "name": "Biscuit Malt", "Origin": " Belgium", "Color": " 23", "Supplier": " ", "MustMash": " No", "Type": " Grain", "AddAfterBoil": " No", "Potential": " 1.036", "DiastaticPower": " 6.0", "DryYield": " 79.0", "MaxinBatch": " 10.0", "Coarse\/FineDiff": " 1.5", "Protein": " 10.5", "Moisture": " 4.0" }, { "name": "Black (Patent) Malt", "Origin": " US", "Color": " 500", "Supplier": " ", "MustMash": " No", "Type": " Grain", "AddAfterBoil": " No", "Potential": " 1.025", "DiastaticPower": " 0.0", "DryYield": " 55.0", "MaxinBatch": " 10.0", "Coarse\/FineDiff": " 1.5", "Protein": " 13.2", "Moisture": " 6.0" }, { "name": "Black Barley (Stout)", "Origin": " US", "Color": " 500", "Supplier": " ", "MustMash": " No", "Type": " Grain", "AddAfterBoil": " No", "Potential": " 1.025", "DiastaticPower": " 0.0", "DryYield": " 55.0", "MaxinBatch": " 10.0", "Coarse\/FineDiff": " 1.5", "Protein": " 13.2", "Moisture": " 5.0" }, { "name": "Brown Malt", "Origin": " United Kingdom", "Color": " 65", "Supplier": " ", "MustMash": " Yes", "Type": " Grain", "AddAfterBoil": " No", "Potential": " 1.032", "DiastaticPower": " 0.0", "DryYield": " 70.0", "MaxinBatch": " 10.0", "Coarse\/FineDiff": " 1.5", "Protein": " 0.0", "Moisture": " 4.0" }, { "name": "Brown Sugar, Dark", "Origin": " US", "Color": " 50", "Supplier": " ", "MustMash": " No", "Type": " Sugar", "AddAfterBoil": " No", "Potential": " 1.046", "DiastaticPower": " -", "DryYield": " 100.0", "MaxinBatch": " 10.0", "Coarse\/FineDiff": " -", "Protein": " -", "Moisture": " -" }, { "name": "Brown Sugar, Light", "Origin": " US", "Color": " 8", "Supplier": " ", "MustMash": " No", "Type": " Sugar", "AddAfterBoil": " No", "Potential": " 1.046", "DiastaticPower": " -", "DryYield": " 100.0", "MaxinBatch": " 10.0", "Coarse\/FineDiff": " -", "Protein": " -", "Moisture": " -" }, { "name": "Brumalt", "Origin": " Germany", "Color": " 23", "Supplier": " ", "MustMash": " Yes", "Type": " Grain", "AddAfterBoil": " No", "Potential": " 1.033", "DiastaticPower": " 0.0", "DryYield": " 71.7", "MaxinBatch": " 10.0", "Coarse\/FineDiff": " 1.5", "Protein": " 7.0", "Moisture": " 4.0" }, { "name": "Candi Sugar, Amber", "Origin": " Belgium", "Color": " 75", "Supplier": " ", "MustMash": " No", "Type": " Sugar", "AddAfterBoil": " No", "Potential": " 1.036", "DiastaticPower": " -", "DryYield": " 78.3", "MaxinBatch": " 20.0", "Coarse\/FineDiff": " -", "Protein": " -", "Moisture": " -" }, { "name": "Candi Sugar, Clear", "Origin": " Belgium", "Color": " 1", "Supplier": " ", "MustMash": " No", "Type": " Sugar", "AddAfterBoil": " No", "Potential": " 1.036", "DiastaticPower": " -", "DryYield": " 78.3", "MaxinBatch": " 20.0", "Coarse\/FineDiff": " -", "Protein": " -", "Moisture": " -" }, { "name": "Candi Sugar, Dark", "Origin": " Belgium", "Color": " 275", "Supplier": " ", "MustMash": " No", "Type": " Sugar", "AddAfterBoil": " No", "Potential": " 1.036", "DiastaticPower": " -", "DryYield": " 78.3", "MaxinBatch": " 20.0", "Coarse\/FineDiff": " -", "Protein": " -", "Moisture": " -" }, { "name": "Cane (Beet) Sugar", "Origin": " US", "Color": " 0", "Supplier": " ", "MustMash": " No", "Type": " Sugar", "AddAfterBoil": " No", "Potential": " 1.046", "DiastaticPower": " -", "DryYield": " 100.0", "MaxinBatch": " 7.0", "Coarse\/FineDiff": " -", "Protein": " -", "Moisture": " -" }, { "name": "Cara-Pils\/Dextrine", "Origin": " US", "Color": " 2", "Supplier": " ", "MustMash": " No", "Type": " Grain", "AddAfterBoil": " No", "Potential": " 1.033", "DiastaticPower": " 0.0", "DryYield": " 72.0", "MaxinBatch": " 20.0", "Coarse\/FineDiff": " 1.5", "Protein": " 13.2", "Moisture": " 4.0" }, { "name": "Caraamber", "Origin": " US", "Color": " 30", "Supplier": " ", "MustMash": " No", "Type": " Grain", "AddAfterBoil": " No", "Potential": " 1.035", "DiastaticPower": " 0.0", "DryYield": " 75.0", "MaxinBatch": " 20.0", "Coarse\/FineDiff": " 1.5", "Protein": " 13.2", "Moisture": " 4.0" }, { "name": "Carafoam", "Origin": " US", "Color": " 2", "Supplier": " ", "MustMash": " No", "Type": " Grain", "AddAfterBoil": " No", "Potential": " 1.033", "DiastaticPower": " 0.0", "DryYield": " 72.0", "MaxinBatch": " 20.0", "Coarse\/FineDiff": " 1.5", "Protein": " 13.2", "Moisture": " 4.0" }, { "name": "Caramel\/Crystal Malt - 10L", "Origin": " US", "Color": " 10", "Supplier": " ", "MustMash": " No", "Type": " Grain", "AddAfterBoil": " No", "Potential": " 1.035", "DiastaticPower": " 0.0", "DryYield": " 75.0", "MaxinBatch": " 20.0", "Coarse\/FineDiff": " 1.5", "Protein": " 13.2", "Moisture": " 4.0" }, { "name": "Caramel\/Crystal Malt - 20L", "Origin": " US", "Color": " 20", "Supplier": " ", "MustMash": " No", "Type": " Grain", "AddAfterBoil": " No", "Potential": " 1.035", "DiastaticPower": " 0.0", "DryYield": " 75.0", "MaxinBatch": " 20.0", "Coarse\/FineDiff": " 1.5", "Protein": " 13.2", "Moisture": " 4.0" }, { "name": "Caramel\/Crystal Malt - 30L", "Origin": " US", "Color": " 30", "Supplier": " ", "MustMash": " No", "Type": " Grain", "AddAfterBoil": " No", "Potential": " 1.035", "DiastaticPower": " 0.0", "DryYield": " 75.0", "MaxinBatch": " 20.0", "Coarse\/FineDiff": " 1.5", "Protein": " 13.2", "Moisture": " 4.0" }, { "name": "Caramel\/Crystal Malt - 40L", "Origin": " US", "Color": " 40", "Supplier": " ", "MustMash": " No", "Type": " Grain", "AddAfterBoil": " No", "Potential": " 1.034", "DiastaticPower": " 0.0", "DryYield": " 74.0", "MaxinBatch": " 20.0", "Coarse\/FineDiff": " 1.5", "Protein": " 13.2", "Moisture": " 4.0" }, { "name": "Caramel\/Crystal Malt - 60L", "Origin": " US", "Color": " 60", "Supplier": " ", "MustMash": " No", "Type": " Grain", "AddAfterBoil": " No", "Potential": " 1.034", "DiastaticPower": " 0.0", "DryYield": " 74.0", "MaxinBatch": " 20.0", "Coarse\/FineDiff": " 1.5", "Protein": " 13.2", "Moisture": " 4.0" }, { "name": "Caramel\/Crystal Malt - 80L", "Origin": " US", "Color": " 80", "Supplier": " ", "MustMash": " No", "Type": " Grain", "AddAfterBoil": " No", "Potential": " 1.034", "DiastaticPower": " 0.0", "DryYield": " 74.0", "MaxinBatch": " 20.0", "Coarse\/FineDiff": " 1.5", "Protein": " 13.2", "Moisture": " 4.0" }, { "name": "Caramel\/Crystal Malt -120L", "Origin": " US", "Color": " 120", "Supplier": " ", "MustMash": " No", "Type": " Grain", "AddAfterBoil": " No", "Potential": " 1.033", "DiastaticPower": " 0.0", "DryYield": " 72.0", "MaxinBatch": " 20.0", "Coarse\/FineDiff": " 1.5", "Protein": " 10.2", "Moisture": " 4.0" }, { "name": "Caramunich Malt", "Origin": " Belgium", "Color": " 56", "Supplier": " ", "MustMash": " No", "Type": " Grain", "AddAfterBoil": " No", "Potential": " 1.033", "DiastaticPower": " 0.0", "DryYield": " 71.7", "MaxinBatch": " 10.0", "Coarse\/FineDiff": " 1.5", "Protein": " 0.0", "Moisture": " 4.0" }, { "name": "Carared", "Origin": " US", "Color": " 20", "Supplier": " ", "MustMash": " No", "Type": " Grain", "AddAfterBoil": " No", "Potential": " 1.035", "DiastaticPower": " 0.0", "DryYield": " 75.0", "MaxinBatch": " 20.0", "Coarse\/FineDiff": " 1.5", "Protein": " 13.2", "Moisture": " 4.0" }, { "name": "Caravienne Malt", "Origin": " Belgium", "Color": " 22", "Supplier": " ", "MustMash": " No", "Type": " Grain", "AddAfterBoil": " No", "Potential": " 1.034", "DiastaticPower": " 0.0", "DryYield": " 73.9", "MaxinBatch": " 10.0", "Coarse\/FineDiff": " 1.5", "Protein": " 0.0", "Moisture": " 4.0" }, { "name": "Chocolate Malt", "Origin": " US", "Color": " 350", "Supplier": " ", "MustMash": " No", "Type": " Grain", "AddAfterBoil": " No", "Potential": " 1.028", "DiastaticPower": " 0.0", "DryYield": " 60.0", "MaxinBatch": " 10.0", "Coarse\/FineDiff": " 1.5", "Protein": " 13.2", "Moisture": " 4.0" }, { "name": "Chocolate Malt", "Origin": " United Kingdom", "Color": " 450", "Supplier": " ", "MustMash": " No", "Type": " Grain", "AddAfterBoil": " No", "Potential": " 1.034", "DiastaticPower": " 0.0", "DryYield": " 73.0", "MaxinBatch": " 10.0", "Coarse\/FineDiff": " 1.5", "Protein": " 10.5", "Moisture": " 4.0" }, { "name": "Corn Sugar (Dextrose)", "Origin": " US", "Color": " 0", "Supplier": " ", "MustMash": " No", "Type": " Sugar", "AddAfterBoil": " No", "Potential": " 1.046", "DiastaticPower": " -", "DryYield": " 100.0", "MaxinBatch": " 5.0", "Coarse\/FineDiff": " -", "Protein": " -", "Moisture": " -" }, { "name": "Corn Syrup", "Origin": " US", "Color": " 1", "Supplier": " ", "MustMash": " No", "Type": " Sugar", "AddAfterBoil": " No", "Potential": " 1.036", "DiastaticPower": " -", "DryYield": " 78.3", "MaxinBatch": " 10.0", "Coarse\/FineDiff": " -", "Protein": " -", "Moisture": " -" }, { "name": "Corn, Flaked", "Origin": " US", "Color": " 1", "Supplier": " ", "MustMash": " Yes", "Type": " Grain", "AddAfterBoil": " No", "Potential": " 1.037", "DiastaticPower": " 0.0", "DryYield": " 80.0", "MaxinBatch": " 40.0", "Coarse\/FineDiff": " 1.5", "Protein": " 10.0", "Moisture": " 9.0" }, { "name": "Dark Dry Extract", "Origin": " US", "Color": " 18", "Supplier": " ", "MustMash": " No", "Type": " Dry Extract", "AddAfterBoil": " No", "Potential": " 1.044", "DiastaticPower": " -", "DryYield": " 95.0", "MaxinBatch": " 100.0", "Coarse\/FineDiff": " -", "Protein": " -", "Moisture": " -" }, { "name": "Dark Liquid Extract", "Origin": " US", "Color": " 18", "Supplier": " ", "MustMash": " No", "Type": " Extract", "AddAfterBoil": " No", "Potential": " 1.036", "DiastaticPower": " -", "DryYield": " 78.0", "MaxinBatch": " 100.0", "Coarse\/FineDiff": " -", "Protein": " -", "Moisture": " -" }, { "name": "Dememera Sugar", "Origin": " United Kingdom", "Color": " 2", "Supplier": " ", "MustMash": " No", "Type": " Sugar", "AddAfterBoil": " No", "Potential": " 1.046", "DiastaticPower": " -", "DryYield": " 100.0", "MaxinBatch": " 10.0", "Coarse\/FineDiff": " -", "Protein": " -", "Moisture": " -" }, { "name": "Extra Light Dry Extract", "Origin": " US", "Color": " 3", "Supplier": " ", "MustMash": " No", "Type": " Dry Extract", "AddAfterBoil": " No", "Potential": " 1.044", "DiastaticPower": " -", "DryYield": " 95.0", "MaxinBatch": " 100.0", "Coarse\/FineDiff": " -", "Protein": " -", "Moisture": " -" }, { "name": "Grits", "Origin": " US", "Color": " 1", "Supplier": " ", "MustMash": " No", "Type": " Adjunct", "AddAfterBoil": " No", "Potential": " 1.037", "DiastaticPower": " -", "DryYield": " 80.0", "MaxinBatch": " 10.0", "Coarse\/FineDiff": " -", "Protein": " -", "Moisture": " -" }, { "name": "Honey", "Origin": " US", "Color": " 1", "Supplier": " ", "MustMash": " No", "Type": " Extract", "AddAfterBoil": " Yes", "Potential": " 1.035", "DiastaticPower": " -", "DryYield": " 75.0", "MaxinBatch": " 100.0", "Coarse\/FineDiff": " -", "Protein": " -", "Moisture": " -" }, { "name": "Invert Sugar", "Origin": " United Kingdom", "Color": " 0", "Supplier": " ", "MustMash": " No", "Type": " Sugar", "AddAfterBoil": " No", "Potential": " 1.046", "DiastaticPower": " -", "DryYield": " 100.0", "MaxinBatch": " 10.0", "Coarse\/FineDiff": " -", "Protein": " -", "Moisture": " -" }, { "name": "Light Dry Extract", "Origin": " US", "Color": " 8", "Supplier": " ", "MustMash": " No", "Type": " Dry Extract", "AddAfterBoil": " No", "Potential": " 1.044", "DiastaticPower": " -", "DryYield": " 95.0", "MaxinBatch": " 100.0", "Coarse\/FineDiff": " -", "Protein": " -", "Moisture": " -" }, { "name": "Maple Syrup", "Origin": " US", "Color": " 35", "Supplier": " ", "MustMash": " No", "Type": " Sugar", "AddAfterBoil": " No", "Potential": " 1.030", "DiastaticPower": " -", "DryYield": " 65.2", "MaxinBatch": " 10.0", "Coarse\/FineDiff": " -", "Protein": " -", "Moisture": " -" }, { "name": "Melanoiden Malt", "Origin": " Germany", "Color": " 20", "Supplier": " ", "MustMash": " Yes", "Type": " Grain", "AddAfterBoil": " No", "Potential": " 1.037", "DiastaticPower": " 10.0", "DryYield": " 80.0", "MaxinBatch": " 15.0", "Coarse\/FineDiff": " 1.3", "Protein": " 11.0", "Moisture": " 3.5" }, { "name": "Mild Malt", "Origin": " United Kingdom", "Color": " 4", "Supplier": " ", "MustMash": " Yes", "Type": " Grain", "AddAfterBoil": " No", "Potential": " 1.037", "DiastaticPower": " 53.0", "DryYield": " 80.0", "MaxinBatch": " 100.0", "Coarse\/FineDiff": " 1.5", "Protein": " 10.6", "Moisture": " 4.0" }, { "name": "Milk Sugar (Lactose)", "Origin": " US", "Color": " 0", "Supplier": " ", "MustMash": " No", "Type": " Sugar", "AddAfterBoil": " No", "Potential": " 1.035", "DiastaticPower": " -", "DryYield": " 76.1", "MaxinBatch": " 10.0", "Coarse\/FineDiff": " -", "Protein": " -", "Moisture": " -" }, { "name": "Molasses", "Origin": " US", "Color": " 80", "Supplier": " ", "MustMash": " No", "Type": " Sugar", "AddAfterBoil": " No", "Potential": " 1.036", "DiastaticPower": " -", "DryYield": " 78.3", "MaxinBatch": " 5.0", "Coarse\/FineDiff": " -", "Protein": " -", "Moisture": " -" }, { "name": "Munich Malt", "Origin": " Germany", "Color": " 9", "Supplier": " ", "MustMash": " Yes", "Type": " Grain", "AddAfterBoil": " No", "Potential": " 1.037", "DiastaticPower": " 72.0", "DryYield": " 80.0", "MaxinBatch": " 80.0", "Coarse\/FineDiff": " 1.3", "Protein": " 11.5", "Moisture": " 5.0" }, { "name": "Munich Malt - 10L", "Origin": " US", "Color": " 10", "Supplier": " ", "MustMash": " Yes", "Type": " Grain", "AddAfterBoil": " No", "Potential": " 1.035", "DiastaticPower": " 50.0", "DryYield": " 77.0", "MaxinBatch": " 80.0", "Coarse\/FineDiff": " 2.8", "Protein": " 13.5", "Moisture": " 5.0" }, { "name": "Munich Malt - 20L", "Origin": " US", "Color": " 20", "Supplier": " ", "MustMash": " Yes", "Type": " Grain", "AddAfterBoil": " No", "Potential": " 1.035", "DiastaticPower": " 25.0", "DryYield": " 75.0", "MaxinBatch": " 80.0", "Coarse\/FineDiff": " 2.8", "Protein": " 13.5", "Moisture": " 5.0" }, { "name": "Oats, Flaked", "Origin": " US", "Color": " 1", "Supplier": " ", "MustMash": " Yes", "Type": " Grain", "AddAfterBoil": " No", "Potential": " 1.037", "DiastaticPower": " 0.0", "DryYield": " 80.0", "MaxinBatch": " 30.0", "Coarse\/FineDiff": " 1.5", "Protein": " 9.0", "Moisture": " 9.0" }, { "name": "Oats, Malted", "Origin": " US", "Color": " 1", "Supplier": " ", "MustMash": " Yes", "Type": " Grain", "AddAfterBoil": " No", "Potential": " 1.037", "DiastaticPower": " 0.0", "DryYield": " 80.0", "MaxinBatch": " 10.0", "Coarse\/FineDiff": " 1.5", "Protein": " 9.0", "Moisture": " 9.0" }, { "name": "Pale Liquid Extract", "Origin": " US", "Color": " 8", "Supplier": " ", "MustMash": " No", "Type": " Extract", "AddAfterBoil": " No", "Potential": " 1.036", "DiastaticPower": " -", "DryYield": " 78.0", "MaxinBatch": " 100.0", "Coarse\/FineDiff": " -", "Protein": " -", "Moisture": " -" }, { "name": "Pale Malt (2 Row) Bel", "Origin": " Belgium", "Color": " 3", "Supplier": " ", "MustMash": " Yes", "Type": " Grain", "AddAfterBoil": " No", "Potential": " 1.037", "DiastaticPower": " 60.0", "DryYield": " 80.0", "MaxinBatch": " 100.0", "Coarse\/FineDiff": " 1.5", "Protein": " 10.5", "Moisture": " 4.0" }, { "name": "Pale Malt (2 Row) UK", "Origin": " United Kingdom", "Color": " 3", "Supplier": " ", "MustMash": " Yes", "Type": " Grain", "AddAfterBoil": " No", "Potential": " 1.036", "DiastaticPower": " 45.0", "DryYield": " 78.0", "MaxinBatch": " 100.0", "Coarse\/FineDiff": " 1.5", "Protein": " 10.1", "Moisture": " 4.0" }, { "name": "Pale Malt (2 Row) US", "Origin": " US", "Color": " 2", "Supplier": " ", "MustMash": " Yes", "Type": " Grain", "AddAfterBoil": " No", "Potential": " 1.036", "DiastaticPower": " 140.0", "DryYield": " 79.0", "MaxinBatch": " 100.0", "Coarse\/FineDiff": " 1.5", "Protein": " 12.3", "Moisture": " 4.0" }, { "name": "Pale Malt (6 Row) US", "Origin": " US", "Color": " 2", "Supplier": " ", "MustMash": " Yes", "Type": " Grain", "AddAfterBoil": " No", "Potential": " 1.035", "DiastaticPower": " 150.0", "DryYield": " 76.0", "MaxinBatch": " 100.0", "Coarse\/FineDiff": " 1.5", "Protein": " 13.0", "Moisture": " 4.0" }, { "name": "Peat Smoked Malt", "Origin": " United Kingdom", "Color": " 3", "Supplier": " ", "MustMash": " Yes", "Type": " Grain", "AddAfterBoil": " No", "Potential": " 1.034", "DiastaticPower": " 0.0", "DryYield": " 74.0", "MaxinBatch": " 20.0", "Coarse\/FineDiff": " 1.5", "Protein": " 0.0", "Moisture": " 4.0" }, { "name": "Pilsner (2 Row) Bel", "Origin": " Belgium", "Color": " 2", "Supplier": " ", "MustMash": " Yes", "Type": " Grain", "AddAfterBoil": " No", "Potential": " 1.036", "DiastaticPower": " 105.0", "DryYield": " 79.0", "MaxinBatch": " 100.0", "Coarse\/FineDiff": " 1.5", "Protein": " 10.5", "Moisture": " 4.0" }, { "name": "Pilsner (2 Row) Ger", "Origin": " Germany", "Color": " 2", "Supplier": " ", "MustMash": " Yes", "Type": " Grain", "AddAfterBoil": " No", "Potential": " 1.037", "DiastaticPower": " 110.0", "DryYield": " 81.0", "MaxinBatch": " 100.0", "Coarse\/FineDiff": " 1.5", "Protein": " 11.0", "Moisture": " 4.0" }, { "name": "Pilsner (2 Row) UK", "Origin": " United Kingdom", "Color": " 1", "Supplier": " ", "MustMash": " Yes", "Type": " Grain", "AddAfterBoil": " No", "Potential": " 1.036", "DiastaticPower": " 60.0", "DryYield": " 78.0", "MaxinBatch": " 100.0", "Coarse\/FineDiff": " 1.5", "Protein": " 10.0", "Moisture": " 4.0" }, { "name": "Pilsner Liquid Extract", "Origin": " US", "Color": " 4", "Supplier": " ", "MustMash": " No", "Type": " Extract", "AddAfterBoil": " No", "Potential": " 1.036", "DiastaticPower": " -", "DryYield": " 78.0", "MaxinBatch": " 100.0", "Coarse\/FineDiff": " -", "Protein": " -", "Moisture": " -" }, { "name": "Rice Extract Syrup", "Origin": " US", "Color": " 7", "Supplier": " ", "MustMash": " No", "Type": " Extract", "AddAfterBoil": " No", "Potential": " 1.032", "DiastaticPower": " -", "DryYield": " 69.6", "MaxinBatch": " 15.0", "Coarse\/FineDiff": " -", "Protein": " -", "Moisture": " -" }, { "name": "Rice Hulls", "Origin": " US", "Color": " 0", "Supplier": " ", "MustMash": " No", "Type": " Adjunct", "AddAfterBoil": " No", "Potential": " 1.000", "DiastaticPower": " -", "DryYield": " 0.0", "MaxinBatch": " 5.0", "Coarse\/FineDiff": " -", "Protein": " -", "Moisture": " -" }, { "name": "Rice, Flaked", "Origin": " US", "Color": " 1", "Supplier": " ", "MustMash": " Yes", "Type": " Grain", "AddAfterBoil": " No", "Potential": " 1.032", "DiastaticPower": " 0.0", "DryYield": " 70.0", "MaxinBatch": " 25.0", "Coarse\/FineDiff": " 1.5", "Protein": " 10.0", "Moisture": " 9.0" }, { "name": "Roasted Barley", "Origin": " US", "Color": " 300", "Supplier": " ", "MustMash": " No", "Type": " Grain", "AddAfterBoil": " No", "Potential": " 1.025", "DiastaticPower": " 0.0", "DryYield": " 55.0", "MaxinBatch": " 10.0", "Coarse\/FineDiff": " 1.5", "Protein": " 13.2", "Moisture": " 5.0" }, { "name": "Rye Malt", "Origin": " US", "Color": " 5", "Supplier": " ", "MustMash": " Yes", "Type": " Grain", "AddAfterBoil": " No", "Potential": " 1.029", "DiastaticPower": " 75.0", "DryYield": " 63.0", "MaxinBatch": " 15.0", "Coarse\/FineDiff": " 1.5", "Protein": " 10.3", "Moisture": " 4.0" }, { "name": "Rye, Flaked", "Origin": " US", "Color": " 2", "Supplier": " ", "MustMash": " Yes", "Type": " Grain", "AddAfterBoil": " No", "Potential": " 1.036", "DiastaticPower": " 0.0", "DryYield": " 78.3", "MaxinBatch": " 10.0", "Coarse\/FineDiff": " 1.5", "Protein": " 0.0", "Moisture": " 4.0" }, { "name": "Smoked Malt", "Origin": " Germany", "Color": " 9", "Supplier": " ", "MustMash": " Yes", "Type": " Grain", "AddAfterBoil": " No", "Potential": " 1.037", "DiastaticPower": " 0.0", "DryYield": " 80.0", "MaxinBatch": " 100.0", "Coarse\/FineDiff": " 1.5", "Protein": " 11.5", "Moisture": " 4.0" }, { "name": "Special B Malt", "Origin": " Belgium", "Color": " 180", "Supplier": " ", "MustMash": " Yes", "Type": " Grain", "AddAfterBoil": " No", "Potential": " 1.030", "DiastaticPower": " 0.0", "DryYield": " 65.2", "MaxinBatch": " 10.0", "Coarse\/FineDiff": " 1.5", "Protein": " 0.0", "Moisture": " 4.0" }, { "name": "Special Roast", "Origin": " US", "Color": " 50", "Supplier": " ", "MustMash": " Yes", "Type": " Grain", "AddAfterBoil": " No", "Potential": " 1.033", "DiastaticPower": " 6.0", "DryYield": " 72.0", "MaxinBatch": " 10.0", "Coarse\/FineDiff": " 1.5", "Protein": " 10.5", "Moisture": " 2.5" }, { "name": "Sugar, Table (Sucrose)", "Origin": " US", "Color": " 1", "Supplier": " ", "MustMash": " No", "Type": " Sugar", "AddAfterBoil": " No", "Potential": " 1.046", "DiastaticPower": " -", "DryYield": " 100.0", "MaxinBatch": " 10.0", "Coarse\/FineDiff": " -", "Protein": " -", "Moisture": " -" }, { "name": "Toasted Malt", "Origin": " United Kingdom", "Color": " 27", "Supplier": " ", "MustMash": " Yes", "Type": " Grain", "AddAfterBoil": " No", "Potential": " 1.033", "DiastaticPower": " 0.0", "DryYield": " 71.7", "MaxinBatch": " 10.0", "Coarse\/FineDiff": " 1.5", "Protein": " 11.7", "Moisture": " 4.0" }, { "name": "Turbinado", "Origin": " United Kingdom", "Color": " 10", "Supplier": " ", "MustMash": " No", "Type": " Sugar", "AddAfterBoil": " No", "Potential": " 1.044", "DiastaticPower": " -", "DryYield": " 95.7", "MaxinBatch": " 10.0", "Coarse\/FineDiff": " -", "Protein": " -", "Moisture": " -" }, { "name": "Victory Malt", "Origin": " US", "Color": " 25", "Supplier": " ", "MustMash": " Yes", "Type": " Grain", "AddAfterBoil": " No", "Potential": " 1.034", "DiastaticPower": " 50.0", "DryYield": " 73.0", "MaxinBatch": " 15.0", "Coarse\/FineDiff": " 1.5", "Protein": " 13.2", "Moisture": " 4.0" }, { "name": "Vienna Malt", "Origin": " Germany", "Color": " 4", "Supplier": " ", "MustMash": " Yes", "Type": " Grain", "AddAfterBoil": " No", "Potential": " 1.036", "DiastaticPower": " 50.0", "DryYield": " 78.0", "MaxinBatch": " 90.0", "Coarse\/FineDiff": " 1.5", "Protein": " 11.0", "Moisture": " 4.0" }, { "name": "Wheat Dry Extract", "Origin": " US", "Color": " 8", "Supplier": " ", "MustMash": " No", "Type": " Dry Extract", "AddAfterBoil": " No", "Potential": " 1.044", "DiastaticPower": " -", "DryYield": " 95.0", "MaxinBatch": " 100.0", "Coarse\/FineDiff": " -", "Protein": " -", "Moisture": " -" }, { "name": "Wheat Liquid Extract", "Origin": " US", "Color": " 8", "Supplier": " ", "MustMash": " No", "Type": " Extract", "AddAfterBoil": " No", "Potential": " 1.036", "DiastaticPower": " -", "DryYield": " 78.0", "MaxinBatch": " 100.0", "Coarse\/FineDiff": " -", "Protein": " -", "Moisture": " -" }, { "name": "Wheat Malt, Bel", "Origin": " Belgium", "Color": " 2", "Supplier": " ", "MustMash": " Yes", "Type": " Grain", "AddAfterBoil": " No", "Potential": " 1.037", "DiastaticPower": " 74.0", "DryYield": " 81.0", "MaxinBatch": " 60.0", "Coarse\/FineDiff": " 1.5", "Protein": " 11.5", "Moisture": " 4.0" }, { "name": "Wheat Malt, Dark", "Origin": " Germany", "Color": " 9", "Supplier": " ", "MustMash": " Yes", "Type": " Grain", "AddAfterBoil": " No", "Potential": " 1.039", "DiastaticPower": " 10.0", "DryYield": " 84.0", "MaxinBatch": " 20.0", "Coarse\/FineDiff": " 1.5", "Protein": " 11.5", "Moisture": " 3.5" }, { "name": "Wheat Malt, Ger", "Origin": " Germany", "Color": " 2", "Supplier": " ", "MustMash": " Yes", "Type": " Grain", "AddAfterBoil": " No", "Potential": " 1.039", "DiastaticPower": " 95.0", "DryYield": " 84.0", "MaxinBatch": " 60.0", "Coarse\/FineDiff": " 1.5", "Protein": " 12.5", "Moisture": " 4.0" }, { "name": "Wheat, Flaked", "Origin": " US", "Color": " 2", "Supplier": " ", "MustMash": " Yes", "Type": " Grain", "AddAfterBoil": " No", "Potential": " 1.035", "DiastaticPower": " 0.0", "DryYield": " 77.0", "MaxinBatch": " 40.0", "Coarse\/FineDiff": " 1.5", "Protein": " 16.0", "Moisture": " 9.0" }, { "name": "Wheat, Roasted", "Origin": " Germany", "Color": " 425", "Supplier": " ", "MustMash": " Yes", "Type": " Grain", "AddAfterBoil": " No", "Potential": " 1.025", "DiastaticPower": " 0.0", "DryYield": " 54.3", "MaxinBatch": " 10.0", "Coarse\/FineDiff": " 1.5", "Protein": " 13.0", "Moisture": " 4.0" }, { "name": "Wheat, Torrified", "Origin": " US", "Color": " 2", "Supplier": " ", "MustMash": " Yes", "Type": " Grain", "AddAfterBoil": " No", "Potential": " 1.036", "DiastaticPower": " 0.0", "DryYield": " 79.0", "MaxinBatch": " 40.0", "Coarse\/FineDiff": " 1.5", "Protein": " 16.0", "Moisture": " 9.0" }, { "name": "White Wheat Malt", "Origin": " US", "Color": " 2", "Supplier": " ", "MustMash": " Yes", "Type": " Grain", "AddAfterBoil": " No", "Potential": " 1.040", "DiastaticPower": " 130.0", "DryYield": " 86.0", "MaxinBatch": " 60.0", "Coarse\/FineDiff": " 2.2", "Protein": " 14.5", "Moisture": " 4.0" }];

        var grainNames = Object.keys(jsonObj);
        
        for (i = 0; i < jsonObj.length; i++) {
            
            var grain = new Grain({
                name: jsonObj[i].name.trim(),
                origin: jsonObj[i].Origin.trim(),
                supplier: jsonObj[i].Supplier.trim(),
                mash: jsonObj[i].MustMash.trim(),
                type: jsonObj[i].Type.trim(),
                addAfterBoil: jsonObj[i].AddAfterBoil.trim(),
                potential: parseInt(jsonObj[i].Potential.replace("-", "0").trim()),
                diastaticPower: parseInt(jsonObj[i].DiastaticPower.replace("-", "0").trim()),
                colour: parseInt(jsonObj[i].Color.replace("-", "0").trim()),
                dryYield: parseInt(jsonObj[i].DryYield.replace("-", "0").trim()),
                maxInBatch: parseInt(jsonObj[i].MaxinBatch.replace("-", "0").trim()),
                protein: parseInt(jsonObj[i].Protein.replace("-", "0").trim()),
                moisture: parseInt(jsonObj[i].Moisture.replace("-", "0").trim())
            });
            
            
            grain.save(function (err, data) {
                if (err) {
                    console.log(err);
                    res.json(err);
                }
                else {
                    res.json({ message: "Saved: " + data });
                }
            });
            
        }
        
        res.json({ message: "Saved: "});
    });
});

*/


router.get('/', function (req, res) {
    d.run(function () {
        res.sendfile('./public/index.html'); // load our public/index.html file
    });
});


module.exports.router = router;
/*

    module.exports = function(app) {

        // server routes ===========================================================
        // handle things like api calls
        // authentication routes


        
        // sample api route
        app.get('/api/grains', function(req, res) {
            // use mongoose to get all grains in the database
            Grain.find(function(err, grains) {
                if (err){
                    res.send(err);
                }

                res.json(grains); // return all grains in JSON format
            });
        });

        // initial setup of sys data
        app.get('/api/loadski', function (req, res) {
            // use mongoose to get all nerds in the database
            var grain = new Grain({
                name: 'Crystal 40',
                extractPotential: 70,
                colour: 40,
                maxYield: 30
            });

            grain.save(function (err, data) {
                if (err) console.log(err);
                else console.log('Saved : ', data);
                res.json(data);
            });

        });

        // route to handle creating goes here (app.post)
        // route to handle delete goes here (app.delete)

        // frontend routes =========================================================
        // route to handle all angular requests
        app.get('*', function(req, res) {
            res.sendfile('./public/index.html'); // load our public/index.html file
        });
        
    };

*/
