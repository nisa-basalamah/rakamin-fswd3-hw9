const express = require("express");
const router = express.Router();
const pool = require("../config/config.js");
const { authorization } = require("../middlewares/auth.js");

// display list of users
router.get("/", authorization, async (request, response, next) => {
  try {
    const DEFAULT_PAGE = 1;
    const DEFAULT_LIMIT = 10;

    // get paginated results
    const page = +request.query.page || DEFAULT_PAGE;
    const limit = +request.query.limit || DEFAULT_LIMIT;
    const offset = (page - 1) * limit;

    const query = `
    SELECT *
    FROM users
    ORDER BY id
    LIMIT $1
    OFFSET $2
    `;

    const result = await pool.query(query, [limit, offset]);

    // query to count rows length
    const countQuery = `
    SELECT COUNT(*)
    FROM users;
    `;

    let totalData = await pool.query(countQuery);
    totalData = +totalData.rows[0].count;

    const totalPages = Math.ceil(totalData / limit);

    const next = page < totalPages ? page + 1 : null;
    const previous = page > 1 ? page - 1 : null;

    response.status(200).json({
      data: result.rows,
      totalData,
      totalPages,
      next,
      previous,
    });
  } catch (error) {
    next(error);
  }
});

// display specific user based on id
router.get("/:id", authorization, async (request, response, next) => {
  try {
    const { id } = request.params;
    const query = `
    SELECT *
    FROM users
    WHERE id = $1;
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      throw { name: "ErrorNotFound" };
    } else {
      response.status(200).json(result.rows[0]);
    }
  } catch (error) {
    next(error);
  }
});

// update specific user based on id
router.put("/:id", authorization, async (request, response, next) => {
  try {
    const { email } = request.body;
    const { id } = request.params;

    const query = ` 
      UPDATE users
      SET email = $1
      WHERE id = $2
      RETURNING *
      `;

    const result = await pool.query(query, [email, id]);

    if (result.rows.length === 0) {
      throw { name: "ErrorNotFound" };
    } else {
      response.status(200).json({ message: "Data updated successfully." });
    }
  } catch (error) {
    next(error);
  }
});

// delete specific user based on id
router.delete("/:id", authorization, async (request, response, next) => {
  try {
    const { id } = request.params;

    const query = ` 
      DELETE FROM users
      WHERE id = $1
      RETURNING *
      `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      throw { name: "ErrorNotFound" };
    } else {
      response.status(200).json({ message: "Data deleted successfully." });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
