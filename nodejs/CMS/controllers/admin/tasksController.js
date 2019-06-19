(function (departamentosController) {

    var callbackdata = require('./callbackdata');
    var expressJwt = require('express-jwt');
    var authenticate = expressJwt({ secret: 'server secret' });

    departamentosController.init = function (app) {

        app.post("/tasks/add", authenticate, async function (req, res) {
            await callbackdata.callBack(JSON.stringify(req.body), res, "tasksadd");
        });

        app.post("/tasks/update", authenticate, async function (req, res) {
            await callbackdata.callBack(JSON.stringify(req.body), res, "tasksupdate");
        });

    };
})(module.exports)