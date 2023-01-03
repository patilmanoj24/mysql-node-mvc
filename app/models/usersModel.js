
var dbName = 'myDb'; // change with your database name
/*
 * Function to check user name & password details & send user details once user is login successfully
 * Manoj Patil
 */
exports.signinModel = function(req, res) {
	return new Promise((resolve, reject) => {
		var body = req.body;
		var connection = commonFunctions.makeMysqlConnection(dbName);
		var whereClause = {"user_name":body.uname, 'password': body.password};
        var usersData = commonFunctions.fetchDbData(res,connection, ['id', 'name','user_name', 'access_level'], 'users', whereClause);
		usersData.then(function (usersDetails){
			commonFunctions.endMysqlConnection(connection);
			var usersDataLength = usersDetails.length;
			// console.log('usersDetails======', usersDetails);
			if(usersDataLength){
				return resolve(usersData);
			}else {
				return resolve('failure');
			}			
		});		
   	});
};