const express = require("express");
const router = express.Router();
const pool = require("../config/config.js");
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);
const { generateToken } = require("../lib/jwt.js");

// register a new user
router.post("/register", async (request, response, next) => {
  try {
    const { email, gender, password, role } = request.body;
    const hashPassword = bcrypt.hashSync(password, salt);

    const query = `
    INSERT INTO users (email, gender, password, role) VALUES
      ($1, $2, $3, $4)
    `;

    const result = await pool.query(query, [email, gender, hashPassword, role]);

    response.status(201).json({
      message: "User registration successful.",
      user: { email, gender, role },
    });
  } catch (error) {
    next(error);
  }
});

// authenticate a user
router.post("/login", async (request, response, next) => {
  try {
    const { email, password } = request.body;
    const query = `
    SELECT *
    FROM users
    WHERE email = $1
    `;

    const result = await pool.query(query, [email]);

    if (result.rows.length === 0) {
      throw { name: "UserNotFound" };
    } else {
      const user = result.rows[0];

      // compare the entered user password with the hashed password in the database
      const isValid = bcrypt.compareSync(password, user.password);

      if (isValid) {
        const token = generateToken({
          id: user.id,
          email: user.email,
          role: user.role,
        });

        response.status(200).json({
          message: "Login successful.",
          token,
        });
      } else {
        throw { name: "InvalidCredentials" };
      }
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
