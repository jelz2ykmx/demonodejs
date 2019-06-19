(function (config) {

    config.dbConnection = function () {
        return {
            host: "localhost",
            port: 3306,
            user : "root",
            password: "Demo2019?",
            database : "host"
        };
    };

})(module.exports);