const express = require("express");
const router = express.Router();
const pool = require("../config/config.js");
const { authorization } = require("../middlewares/auth.js");

// display list of movies
router.get("/", async (request, response, next) => {
  try {
    const DEFAULT_PAGE = 1;
    const DEFAULT_LIMIT = 10;

    // get paginated results
    const page = +request.query.page || DEFAULT_PAGE;
    const limit = +request.query.limit || DEFAULT_LIMIT;
    const offset = (page - 1) * limit;

    const query = `
    SELECT *
    FROM movies
    ORDER BY id
    LIMIT $1
    OFFSET $2
    `;

    const result = await pool.query(query, [limit, offset]);

    // query to count rows length
    const countQuery = `
    SELECT COUNT(*)
    FROM movies;
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

// display specific movie based on id
router.get("/:id", async (request, response, next) => {
  try {
    const { id } = request.params;
    const query = `
      SELECT *
      FROM movies
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

// routes below are only accessible by users with the "Admin" role
// add a new movie
router.post("/", authorization, async (request, response, next) => {
  try {
    const { title, genres, year } = request.body;

    const query = `
    INSERT INTO movies (title, genres, year) VALUES
      ($1, $2, $3)
    `;

    const result = await pool.query(query, [title, genres, year]);

    response
      .status(201)
      .json({ message: "Movie record created successfully." });
  } catch (error) {
    next(error);
  }
});

// update specific movie based on id
router.put("/:id", authorization, async (request, response, next) => {
  try {
    const { title, genres, year } = request.body;
    const { id } = request.params;

    const query = ` 
    UPDATE movies
    SET title = $1,
        genres = $2,
        year = $3
    WHERE id = $4
    RETURNING *
    `;

    const result = await pool.query(query, [title, genres, year, id]);

    if (result.rows.length === 0) {
      throw { name: "ErrorNotFound" };
    } else {
      response.status(200).json({ message: "Data updated successfully." });
    }
  } catch (error) {
    next(error);
  }
});

// delete specific movie based on id
router.delete("/:id", authorization, async (request, response, next) => {
  try {
    const { id } = request.params;

    const query = ` 
    DELETE FROM movies
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
