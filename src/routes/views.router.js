import productManager from "../productManager.js";
import {Router} from "express";

const router = Router()
const ProductManager = new productManager();

router.get("/",async(req,res)=>{
    const products = await ProductManager.getProducts();
    res.render("home", {products});
})

router.get("/realtimeproducts",async (req,res)=>{
    res.render("realTimeProducts",{});
})

export default router;