const errorHandler = (error, request, response, next) => {
  if (error.name === "UserNotFound") {
    response.status(404).json({
      message: "User with the provided email not found.",
    });
  } else if (error.name === "InvalidCredentials") {
    response.status(401).json({
      message: "Invalid email or password.",
    });
  } else if (error.name === "AuthenticationError") {
    response.status(401).json({
      message: "Authentication failed. Please check your credentials.",
    });
  } else if (error.name === "ErrorNotFound") {
    response.status(404).json({
      message: "The requested data could not be found.",
    });
  } else if (error.name === "AuthorizationError") {
    response.status(403).json({
      message: "You are not allowed to perform this action.",
    });
  } else {
    response.status(500).json({
      message: "Internal server error.",
    });
  }
};

module.exports = errorHandler;
