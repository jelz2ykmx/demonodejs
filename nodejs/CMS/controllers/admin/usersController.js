(function (usersController) {

    var hasher = require('../../auth/hasher');
    var callbackdata = require('./callbackdata');
    var configData = require('../../services/configService');
    var expressJwt = require('express-jwt');
    var authenticate = expressJwt({ secret: 'server secret' });

    usersController.init = function (app) {

        app.post("/users/add", authenticate, async function (req, res) {
            var salt = hasher.createSalt();
            var hash = hasher.computeHash(req.body.clave, salt);
            req.body.hash = hash;
            req.body.salt = salt;
            await callbackdata.callBack(JSON.stringify(req.body), res, "usersadd");
        });

        app.post("/users/getuser", authenticate, async function (req, res) {
            await callbackdata.callBack(JSON.stringify(req.body), res, "getuser");
        });

        app.post("/users/update", authenticate, async function (req, res) {
            await callbackdata.callBack(JSON.stringify(req.body), res, "usersupdate");
        });

        app.post("/users/getsalt", authenticate, async function (req, res) {
            await callbackdata.callBack(JSON.stringify(req.body), res, "getsalt");
        });

        app.post("/users/changepassword", authenticate, async function (req, res) {
            await callbackdata.callBack(JSON.stringify(req.body), res, "changepassword");
        });


        app.post("/users", authenticate, async function (req, res) {

            var body = req.body;

            let result = await configData.dbConnection();
                
            var mysql = require('mysql');
            
            var connection = mysql.createConnection(result);

            await connection.connect(async function (err) {
                if (err) {
                    res.json({ statuscode: 500, error: 'error connecting: ' + err.stack });
                    return;
                }
                else {
                    await connection.query('SELECT username from users', function (error, results, fields) {
                        if (error) {
                            res.json({ statuscode: 500, error: error });
                        }
                        else {
                            res.json({ statuscode: 200, result: results });
                        }
                    });
                }
            });
            
        });


    };
})(module.exports)