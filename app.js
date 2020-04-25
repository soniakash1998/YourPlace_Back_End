const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");

const app = express();

app.use(bodyParser.json());

app.use("/api/places", placesRoutes); //all place related routes are handled by this
app.use("/api/users", usersRoutes); //all users related routes are handled by this

app.use((req, res, next) => {
  const error = new HttpError("Could not foind this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occured!" });
});

mongoose
  .connect(
    "mongodb+srv://akash:akash@cluster0-rdkho.mongodb.net/places?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected to databse.")
    app.listen(5000);
  })
  .catch((error) => {
    console.log(error);
  });
