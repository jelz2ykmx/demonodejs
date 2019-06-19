(function (callbackdata) {

    var configData = require('../../services/configService');

    callbackdata.callBack = async function (data, res, sp) {
        let dbConfig = await configData.dbConnection();
        var mysql = require('mysql');
        var connection = mysql.createConnection(dbConfig);
        await connection.connect(async function (err) {
            if (err) {
                res.status(500).json({ message: 'error connecting: ' + err.stack });
                return;
            }
            else {
                await connection.query('call ' + sp + '(?)', [data], async function (error, resultsData, fields) {
                    if (error) {
                        res.status(500).json({ message: error });
                    }
                    else {
                        if (resultsData.length > 0 && resultsData[0][0].ERROR !== 0) {
                            var message = resultsData[0][0].MESSAGE;
                            if (message.includes('Duplicate') > 0) {
                                var key = message.indexOf('key');
                                var raya = message.indexOf('_');
                                message = message.substring(key + 5, raya) + " duplicado";
                            };

                            res.status(500).json({ message: message });
                        }
                        else {
                            res.status(200).json(resultsData);
                        }
                    }
                });
            }
        });
    };
})(module.exports)