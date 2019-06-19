(function (controllers) {
    var usersController = require('./usersController');
    var departamentosController = require('./departamentosController');
    var tasksController = require('./tasksController');

    controllers.init = function (app) {
        usersController.init(app);
        departamentosController.init(app);
        tasksController.init(app);
    };
})(module.exports)