require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./docs/swagger.json");
const router = require("./routes/index.js");
const errorHandler = require("./middlewares/errorhandler.js");

const app = express();

app.use(morgan("tiny"));

// resource sharing
app.use(cors());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json());
app.use(router);
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Server is running and listening on port ${process.env.PORT}`);
});
