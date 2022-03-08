const Form = require("../models/formModel");

check = (count, obj) => {
  for (let i of count) {
    const p = typeof obj[i].value;
    const q = obj[i].datatype;
    console.log(p, q);
    if (p != q) {
      return false;
    }
    return true;
  }
};

exports.addcustomer = async (req, res) => {
  const name = req.body.name;
  const account = req.body.account;
  const email = req.body.email;
  const phone = req.body.phoneNumber;
  const obj = req.body.CustomField;
  if (
    name.length === 0 ||
    email.length === 0 ||
    phone.length === 0 ||
    account.length === 0
  )
    return res.json("Please fill all the fields");
  const phonenumber = /^\d{10}$/;
  if (!phonenumber.test(phone))
    return res.status(400).json({
      status: 400,
      message: "Please enter the phone number in correct format",
    });
  const mail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!mail.test(email))
    return res.json("Please enter the email in correct format");
  if (
    !(
      account.toLowerCase() == "Electronics".toLowerCase() ||
      account.toLowerCase() == "Toys".toLowerCase()
    )
  )
    return res.json("Please select a valid account type");
  const findemail = await Form.find({ email: email });
  const key = Object.keys(findemail);
  for (i of key)
    if (findemail[i].account === req.body.account) {
      return res.status(400).json({
        status: 400,
        message: `Customer with this email already exists in ${findemail[i].account} account`,
      });
    }
  if (obj === undefined) {
    const formdata = new Form({
      name: name,
      account: account,
      email: email,
      phoneNumber: phone,
    });
    try {
      console.log(formdata);
      formdata.save((err, result) => {
        if (err) {
          return res.status(500).json({ status: 500, message: err.message });
        }
        return res.status(200).json({
          status: 200,
          message: "Information Added",
          formdata: result,
        });
      });
    } catch (err) {
      return res.status(404).json({ status: 404, message: err.message });
    }
  } else {
    const count = Object.keys(obj);
    if (check(count, obj) == false)
      return res.status(400).json({
        status: 400,
        message: "Please enter data in correct datatype",
      });
    console.log(count);
    for (let i in count) {
      if (
        count[i] == "name" ||
        count[i] == "account" ||
        count[i] == "email" ||
        count[i] == "phone"
      )
        return res.status(400).json({
          status: 400,
          message: "Custom field can't be a default field",
        });
    }
    const formdata = new Form({
      name: name,
      account: account,
      email: email,
      phoneNumber: phone,
      CustomField: obj,
    });
    try {
      formdata.save((err, result) => {
        if (err) {
          return res.json({ status: 500, message: err.message });
        }
        return res.status(200).json({
          status: 200,
          message: "Information Added",
          formdata: result,
        });
      });
    } catch (err) {
      return res.status(404).json({ status: 404, message: err.message });
    }
  }
};

exports.getallcustomer = async (req, res) => {
  const data = await Form.find();
  if (!data.length) {
    try {
      return res.json({ status: 400, message: "Nothing is available in db" });
    } catch (err) {
      return res.json({ status: 500, message: err.message });
    }
  }
  try {
    return res.json({
      status: 200,
      message: "This is the list of customers",
      data: data,
    });
  } catch (err) {
    return res.json({ status: 500, message: err.message });
  }
};

exports.deletecustomer = async (req, res) => {
  const exists = await Form.find();
  if (!exists.length)
    return res.json({ status: 200, message: "There is no customer" });
  if (!req.params.id)
    return res.json({ status: 400, message: "Customer id is required" });
  const customer = await Form.findOne({ _id: req.params.id });
  if (!customer)
    return res.json({
      status: 400,
      message: "Customer with provided id not found",
    });
  const result = await Form.findOne({ _id: req.params.id });
  await Form.deleteOne({ _id: req.params.id });
  return res.json({ status: 200, message: "Customer deleted", result: result });
};

exports.addcustomfield = async (req, res) => {
  const customer = await Form.find();
  if (!customer.length)
    return res.json({ status: 400, message: "No customer exists" });
  if (!req.params.id)
    return res.json({ status: 400, message: "Customer id is required" });
  const id = await Form.findOne({ _id: req.params.id });
  if (!id)
    return res.json({
      status: 400,
      message: "Customer with provided id not found",
    });

  const obj = req.body.CustomField;
  if (obj === undefined)
    return res.json({ status: 400, message: "Please add a custom field" });
  const count = Object.keys(obj);
  for (let i in count) {
    if (
      count[i] == "name" ||
      count[i] == "account" ||
      count[i] == "email" ||
      count[i] == "phone"
    )
      return res.status(400).json({
        status: 400,
        message: "Custom field can't be a default field",
      });
  }
  if (check(count, obj) == false)
    return res.json({
      status: false,
      message: "Please enter data in correct datatype",
    });
  const x = await Form.findOne({ _id: req.params.id });
  const field = Object.keys(req.body.CustomField);
  for (let i of field) {
    if (Object.keys(x.CustomField).includes(i))
      return res.json(
        "This custom field already exists. Please add a new field"
      );
  }
  x.CustomField = { ...x.CustomField, ...obj };
  await x.save();
  const data = await Form.findOne({ _id: req.params.id });
  return res.json({
    status: 200,
    message: "Custom field was added",
    data: data,
  });
};

exports.getcustomerbyaccount = async (req, res) => {
  const customer = await Form.find();
  if (!customer)
    return res.json({ status: 400, message: "No customer exists" });
  if (!req.params.account)
    return res.json({
      status: 400,
      message: "Please specify the account type",
    });
  const store = await Form.findOne({ account: req.params.account });
  if (!store)
    return res.json({
      status: 400,
      message: "No customer of this account exists",
    });
  const result = await Form.find({ account: req.params.account });
  return res.json({
    status: 200,
    message: "This is the list of customers for that account",
    result: result,
  });
};

exports.updatecustomfield = async (req, res) => {
  const customer = await Form.find();
  if (!customer.length)
    return res.json({ status: 400, message: "No customer exists" });
  if (!req.params.id)
    res.json({ status: 400, message: "Customer id is required" });
  const id = await Form.findOne({ _id: req.params.id });
  if (!id)
    return res.json({
      status: 400,
      message: "Customer with provided id not found",
    });
  const obj = req.body.CustomField;
  const count = Object.keys(obj);
  if (check(count, obj) == false)
    return res.json({
      status: false,
      message: "Please enter data in correct datatype",
    });
  const x = await Form.findOne({ _id: req.params.id });
  const field = Object.keys(req.body.CustomField);
  for (let i of field) {
    if (!Object.keys(x.CustomField).includes(i)) {
      return res.json(
        "This custom field doesn't exists. Please update an existing field"
      );
    } else {
      console.log(i);
      x.CustomField[i] = { ...x.CustomField[i], ...req.body.CustomField[i] };
      await x.save();
    }
  }
  console.log(x);
  return res.json({
    status: 200,
    message: "Custom field was updated",
    x: x,
  });
};

exports.getindividualcustomers = async (req, res) => {
  const customer = await Form.find();
  if (!customer) res.json("No customer exists");
  if (!req.params.id) res.json("Please pass an id");
  const data = await Form.findOne({ _id: req.params.id });
  if (!data) res.json("No one of this id exists");
  const details = await Form.findOne({ _id: req.params.id });
  if (details)
    return res.json({
      status: 200,
      message: "This is the detail of customer",
      details: details,
    });
  return res.json({ status: 400, message: "Some error occurred" });
};
