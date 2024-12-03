const express = require("express");
const router = express.Router();
const { login } = require("../controllers/loginController");
const {
  accountDeactivation,
} = require("../controllers/deactivationController");

router.get("/login", login);
router.post("/login", login);

router.get("/account-deactivation", accountDeactivation);
router.post("/account-deactivation", accountDeactivation);

module.exports = router;
