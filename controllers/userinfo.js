const User = require("../models/user");
const Book = require("../models/book");

exports.fetchProfile = function (req, res, next) {
	const user = {
		email: req.user.email,
		firstName: req.user.firstName,
		lastName: req.user.lastName,
	};
	res.send({
		user: user,
	});
};
