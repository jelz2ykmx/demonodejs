(function (auth) {

    var hasher = require('./hasher');
    var configData = require('../services/configService');

    var passport = require('passport');
    var Strategy = require('passport-local');
    var jwt = require('jsonwebtoken');
    var expressJwt = require('express-jwt');
    var authenticate = expressJwt({ secret: 'server secret' });

    async function userVefify(username, password, done) {
        let result = await configData.dbConnection();
        var mysql = require('mysql');
        var connection = mysql.createConnection(result);
        await connection.connect(async function (err) {
            if (err) {
                done({ status: 500, message: 'error connecting: ' + err.stack }, false );
            }
            else {
                var users = await connection.query('SELECT hash, salt from users where username = ?', [username], async function (error, results, fields) {
                    if (error) {
                        done({ status: 500, message: error }, false);
                    }
                    else {
                        var testhash = hasher.computeHash(password, results[0].salt);
                        if (testhash === results[0].hash) {
                            done(null, { username: username });
                        }
                        else {
                            done({ status: 401, message: 'Invalid credentials' }, false);
                        }
                    }
                });
            }
        });
    }
   
    auth.init = function (app) {
        
        passport.use(new Strategy(userVefify));
        app.use(passport.initialize());
       
        app.post('/auth', passport.authenticate('local', {
                session: false
        }), serialize, generateToken, respond);

        function serialize(req, res, next) {

            db.updateOrCreate(req.user, function (err, user) {
                if (err) {
                    return next(err);
                }
                // we store the updated information in req.user again
                req.user = {
                    username: user.username
                };
                next();
            });
        }

        const db = {
            updateOrCreate: function (user, cb) {
                // db dummy, we just cb the user
                cb(null, user);
            }
        };

        function generateToken(req, res, next) {
            req.token = jwt.sign({
                username: req.user.username,
            }, 'server secret', {
                    expiresIn: "1 days"
                });
            next();
        };

        function respond(req, res) {
            res.status(200).json({
                user: req.user,
                token: req.token
            });
        };

        /*
        app.get('/me', authenticate, async function (req, res) {
            res.status(200).json(req.user);
        });
        */

        app.post("/changepasswords", authenticate, async function (req, res) {

            let result = await configData.dbConnection();

            var mysql = require('mysql');

            var connection = mysql.createConnection(result);

            await connection.connect(async function (err) {
                if (err) {
                    res.json({ status: 500, message: 'error connecting: ' + err.stack });
                    return;
                }
                else {
                    var users = await connection.query('SELECT nombre, clave from usuario', async function (error, results, fields) {
                        if (error) {
                            res.json({ status: 500, message: error });
                            return;
                        }
                        else {
                            connection.beginTransaction(function (err) {
                                if (err) {
                                    res.json({ status: 500, message: err.stack });
                                    return;
                                }
                                var values = '[';
                                results.forEach(function (element) {
                                    var salt = hasher.createSalt();
                                    var hash = hasher.computeHash(element.clave, salt);
                                    values += '{ "hash" : \"' + hash + '\", "salt": \"' + salt + '\", "nombre": \"' + element.nombre + '\"},';
                                });
                                values = values.slice(0, -1);
                                values += "]";
                              
                                connection.query('call changepasswords(?)', [values], function (error, resultsData, fields) {
                                    if (error) {
                                        return connection.rollback(function () {
                                            res.json({ status: 500, message: error });
                                        });
                                    }
                                    else {
                                        connection.commit(function (err) {
                                            if (err) {
                                                return connection.rollback(function () {
                                                    res.json({ status: 500, message: err.stack });
                                                });
                                            }
                                            else {
                                                res.json({ status: 200 });
                                            }
                                        });
                                    }
                                });
                               
                            });
                           
                        }
                    });
                }
            });
          
        });
    };
  
})(module.exports)