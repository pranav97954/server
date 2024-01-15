const { register, login } = require("../controllers/authControllers");
const { checkUser,checkAdminUser } = require("../middlewares/authMiddleware");

const router = require("express").Router();

router.post("/query", checkUser); 
router.post("/register", register);
router.post("/login", login);
//router.post("/admin", checkUser); 
router.post("/admin", checkAdminUser); 
module.exports = router;
