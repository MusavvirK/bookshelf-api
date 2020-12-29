const Authentication = require("./controllers/authentication");
const Profile = require("./controllers/userinfo");
const Book_app = require("./controllers/book_app");

// service
const passport = require("passport");
const passportService = require("./services/passport");

const requireAuth = passport.authenticate("jwt", { session: false });
const requireSignin = passport.authenticate("local", { session: false });

module.exports = function (app) {
	app.get("/api/", requireAuth, function (req, res) {
		res.send({ message: "Super secret code is ABC123" });
	});

	app.post("/api/signup", Authentication.signup);

	app.post("/api/signin", requireSignin, Authentication.signin);

	app.get("/api/verify_jwt", requireAuth, Authentication.verifyJwt);

	app.get("/api/profile", requireAuth, Profile.fetchProfile);

	app.get("/api/posts", Book_app.fetchBooks);

	app.post("/api/posts", requireAuth, Book_app.createBook);

	app.get("/api/posts/:id", Book_app.fetchBook);

	app.get(
		"/api/allow_edit_or_delete/:id",
		requireAuth,
		Book_app.allowUpdateOrDelete
	);

	app.put("/api/posts/:id", requireAuth, Book_app.updateBook);

	app.delete("/api/posts/:id", requireAuth, Book_app.deleteBook);

	app.get("/api/my_posts", requireAuth, Book_app.fetchBooksByAuthorId);
};
