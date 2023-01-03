var usersModel = require(rootDir+'/app/models/usersModel.js');
// var usersStatusArr = {0:'Disabled', 1:'Active', 2:'Pending'};

/*
 * Function to validate username and password for ret op sign in
 * Manoj Patil
 */
exports.signin = function (req, res) {
	commonFunctions.trimBody(req);
	req.checkBody('uname', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	var errors = req.validationErrors();
	if (errors) {
		// console.log('if here>>');
		res.status(401).json(commonFunctions.refineErrorMessages(401, 'Unauthorized Access', 'Invalid Username or Password'));
		return false; // break the flow
	} else {
		var promise = usersModel.signinModel(req, res);
		promise.then((result)=>{
			res.status(200).json(result);
		});
	}
};

