const express = require("express");
const router = express.Router();

const {
  addcustomer,
  getallcustomer,
  deletecustomer,
  getindividualcustomers,
  addcustomfield,
  getcustomerbyaccount,
  updatecustomfield,
} = require("../controllers/formController");

router.post("/create", addcustomer);
router.get("/get", getallcustomer);
router.delete("/delete/:id", deletecustomer);
router.post("/addfield/:id", addcustomfield);
router.get("/list/:account", getcustomerbyaccount);
router.put("/value/:id", updatecustomfield);
router.get("/data/:id", getindividualcustomers);

module.exports = router;
