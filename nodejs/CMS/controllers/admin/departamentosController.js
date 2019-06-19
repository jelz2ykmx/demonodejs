(function (departamentosController) {

    var callbackdata = require('./callbackdata');
    var expressJwt = require('express-jwt');
    var authenticate = expressJwt({ secret: 'server secret' });

    departamentosController.init = function (app) {

        app.post("/departamentos/add", authenticate, async function (req, res) {
            await callbackdata.callBack(JSON.stringify(req.body), res, "departamentosadd");
        });

        
    };
})(module.exports)