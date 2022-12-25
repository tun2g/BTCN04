const router=require("express").Router()
const shopController=require("../controllers/shop")
const authenToken=require("../models/auth")
router.get("/",authenToken,shopController.render)
router.get("/chat",authenToken,shopController.renderChat)
router.get("/cart",authenToken,shopController.renderCart)
router.get("/:id",authenToken,shopController.renderCate)
router.post("/add/:id",authenToken,shopController.addCart)
module.exports=router