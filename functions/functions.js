var config = require(rootDir+'/config/config.json');

exports.getConfigFilesData = function (fileNameToRead) {
    return new Promise(function (resolve, reject) {
        
        fileNameToRead = fileNameToRead.substring(fileNameToRead.lastIndexOf('/')+1); // extracting file name from file path
        var tmpFileName = rootDir + '/config/' + fileNameToRead;

        if (fs.existsSync(tmpFileName)) {
            var fileData = fs.readFileSync(rootDir + '/config/' + fileNameToRead, "utf8");
            if (fileData) {
                if (exports.isJson(fileData) == true) {
                    return resolve(JSON.parse(fileData));
                } else {
                    return resolve(fileData);
                }
            }
        }

    });
};

exports.isJson = function (str) {
    try {
        var o = JSON.parse(str);
        // Handle non-exception-throwing cases:
        // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
        // but... JSON.parse(null) returns null, and typeof null === "object", 
        // so we must check for that, too. Thankfully, null is falsey, so this suffices:
        if (o && typeof o === "object") {
            return true;
        }
    } catch (e) {
        return false;
    }

    return false;
};


// connects to mysql
exports.makeMysqlConnection = function(module) {
	// console.log("makeMysqlConnection");
	var connection = mysql.createConnection({
        host: config[module].dbHostname,
        user: config[module].dbUsername,
        password: config[module].dbPassword,
        database: config[module].dbName 
    });
    connection.connect();
	return connection;
};

// ends mysql connection
exports.endMysqlConnection = function(connection) {
	if (connection) {
		connection.end((err) => {
		  	if (err) throw err;
		});
	}
};

// show first error if there are multiple
exports.refineErrorMessages = function(statusCode, reason, errors) {
	
	var returnData = [];
	var errorType = typeof errors;

	if(errorType == 'string') {
		returnData.push({'message':errors});
	} else if (errorType == 'object') {
		for (var key in errors) {
			returnData.push({'message':errors[key].msg});
		}
	}
	var errorResponse = {
		'status_code':statusCode,
		'reason_phrase':reason,
		'errors':returnData
	};
	return errorResponse;
};

/* Function to trim data from body or query params
Remove whitespace from both sides of a string( from start and from end of string)
Input: pass req object to this function
Manoj Patil */
exports.trimBody = function (req,res) {
	/* trim body data */
	if(req.hasOwnProperty('body')){
		for (const key in req.body) {
			if(typeof req.body[key] == 'string'){
				req.sanitize(key).trim(); // Remove whitespace from both sides of a string only if typeof value of key is string
				// trim() not applicable on number it will throw error like TypeError: Expected string but received a number.
			} 
		}
	} 
	/* trim query params */
	if(req.hasOwnProperty('query')){
		for (const key in req.query) {
			if(typeof req.query[key] == 'string'){
				req.sanitize(key).trim(); // Remove whitespace from both sides of a string only if typeof value of key is string
				// trim() not applicable on number it will throw error like TypeError: Expected string but received a number.
			} 
		}
	} 
};

/* 
* Function to check req.checkBody and req.checkQuery validations
* Manoj Patil 
*/
exports.validationChecks = function(errors) {
	return errors.map(x => x.msg);
}


/* 
* how to call following function - 
  commonFunctions.fetchData(connection, ['id', 'name'], 'users', {"id":1, "first_name":"Manoj"}, ' ORDER BY id DESC', 'LIMIT 20');
* Manoj Patil 
*/
exports.fetchDbData = function (res, connection, columnNames, tableNameStr, where, orderBy, limit, groupBy) {
	return new Promise((resolve, reject) => {

		res = res ? res : '';

		if(!tableNameStr) {
			return false;
		}

		var endConnection = '';
		if(connection) {
			var connType = typeof connection;

			if(connType == 'object') {
				// do nothing coz that's what we needed - an object
			} else if (connType == 'string') {
				// create connection object for given module
				connection = commonFunctions.makeMysqlConnection(connection);
				endConnection = true;
			}
		} else {
			connection = commonFunctions.makeMysqlConnection();
			endConnection = true;
		}

		var columnNameStr = '';
		if(!columnNames || (typeof columnNames == 'string' && columnNames.trim() == '*')) {
			columnNameStr = ' * ';
		} else if (typeof columnNames == 'object') {
			columnNameStr = columnNames.join(', ');
		}

		var params = [];
		var whereStr = '';
		
		if(where) {
			if(typeof where == 'object') {
				whereStr = ' WHERE 1 = ? ';
				params.push(1);
				for(var key in where) {
					whereStr += ' AND ' + key +' = ? ';
				  	params.push(where[key]);
				}
			} else if (typeof where == 'string') {
				whereStr += ' WHERE ' + where;
			}
		}

		var sql = 'SELECT ' + columnNameStr + ' FROM ' + tableNameStr +  whereStr;
		if(orderBy) {
			sql += ' ' + orderBy;
		}
		if(limit) {
			sql += ' ' + limit;
		}
		if(groupBy) {
			sql += ' ' + groupBy;
		}

		// console.log(sql, 'sql in fetchData');
		// console.log(params, 'params in fetchData');

        if (sql && params) {
			connection.query(sql, params, function(error, result, fields) {
				if(endConnection) {
	    			commonFunctions.endMysqlConnection(connection);
				}
				if (error) {
		      		return resolve('');
				} else {
					return resolve(result);
		    	}
			});
		} else {
            if (endConnection) {
                commonFunctions.endMysqlConnection(connection);
            }
            return resolve('');
        }
	});
};