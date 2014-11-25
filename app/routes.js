 // app/routes.js

// grab the nerd model we just created
var Grain = require('./models/grain');

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


