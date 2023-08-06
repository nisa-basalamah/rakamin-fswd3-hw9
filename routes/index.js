const express = require("express");
const router = express.Router();

// importing middleware functions from other files
const { authentication } = require("../middlewares/auth.js");

// importing route handlers from other files
const authRoutes = require("./auth.js");
const moviesRoutes = require("./movies.js");
const usersRoutes = require("./users.js");

router.use("/auth", authRoutes);
router.use(authentication);
router.use("/movies", moviesRoutes);
router.use("/users", usersRoutes);

module.exports = router;
