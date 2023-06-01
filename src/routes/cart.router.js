import { Router } from "express";
import { getCartItems, addProductToCart, deleteCart, deleteCartItem, updateCartItem, getCart } from "../controllers/cart.controller.js"; 
import { authenticateToken } from "../middleware/authenticationJWT.js";

const cartRouter = Router();

cartRouter.get("/carrito/actual", getCart)
cartRouter.get("/carrito", authenticateToken, getCartItems);
cartRouter.post("/carrito", authenticateToken, addProductToCart);
cartRouter.delete("/carrito", authenticateToken, deleteCart);
cartRouter.delete("/carrito:id", authenticateToken, deleteCartItem)
cartRouter.post("/carrito:id", authenticateToken, updateCartItem )

export default cartRouter