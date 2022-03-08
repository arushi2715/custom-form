const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const form = new Schema({
  name: {
    type: String,
    required: true,
  },
  account: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  CustomField: {
    type: Object,
    required: false,
  },
});

const Form = mongoose.model("form", form);

module.exports = Form;
