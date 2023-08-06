const pool = require("../config/config.js");
const { verifyToken } = require("../lib/jwt.js");

const authentication = async (request, response, next) => {
  try {
    if (!request.headers.authorization) {
      throw { name: "AuthenticationError" };
    }

    const token = request.headers.authorization.split(" ")[1];

    const { id, email } = verifyToken(token);
    const query = `
    SELECT *
    FROM users
    WHERE id = $1
    AND email = $2
    `;

    const result = await pool.query(query, [id, email]);

    if (result.rows.length === 0) {
      throw { name: "AuthenticationError" };
    } else {
      const user = result.rows[0];

      request.authenticatedUser = {
        id: user.id,
        email: user.email,
        role: user.role,
      };

      next();
    }
  } catch (error) {
    next(error);
  }
};

const authorization = async (request, response, next) => {
  // executed after authentication
  try {
    const { role } = request.authenticatedUser;

    if (role === "Admin") {
      next();
    } else {
      throw { name: "AuthorizationError" };
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  authentication,
  authorization,
};
