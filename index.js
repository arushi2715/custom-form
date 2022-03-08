const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const form = require("./routes/formRoute");

require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());

const port = process.env.PORT || 8000;

const url = process.env.DATABASE;

mongoose.connect(url, { useNewUrlParser: true });

const connection = mongoose.connection;

connection.once("open", () => {
  console.log("Connected to database");
});

app.use("/form", form);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
