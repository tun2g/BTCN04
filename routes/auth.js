const router = require("express").Router();

const authController = require("../controllers/auth");

router.get("/all", authController.findAll);
router.get("/register", authController.renderRegister);
router.get("/login", authController.render);

// router.get("/chat",authController.renderChat)

router.post("/login", authController.handleLogin);
router.get("/logout", authController.handleLogout);
router.post("/register", authController.handleRegister);

module.exports = router;