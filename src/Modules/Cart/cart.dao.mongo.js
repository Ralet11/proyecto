import  mongoose  from "mongoose";
import { ProductRepository } from "../Products/productsRepository.js";

const Schema = mongoose.Schema;
const ProductRep = new ProductRepository

const CartsSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  dateTime: {
    type: Date,
    required: true
  },
  items: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        required: true
      }
    }
  ],
  deliveryAddress: {
    type: String,
    required: true
  }
});

const CartModel = mongoose.model('CartModel', CartsSchema);

export class CartDAOMongo {

  async getCartItems() {
    const cart = await CartModel.findOne();
    if (!cart) {
      throw new Error('Cart not found');
    }
  
    const cartItems = [];
  
    for (const item of cart.items) {
      const product = await ProductRep.findOne(item.product);
      if (product) {
        cartItems.push({
          product,
          quantity: item.quantity
        });
      }
    }
  
    return cartItems;
  }
  

    async addProductToCart(productId, email, dateTime, deliveryAddress) {
      let cart = await CartModel.findOne();
  
      if (!cart) {
        const cartId = new mongoose.Types.ObjectId();
        cart = new CartModel({
          _id: cartId,
          email,
          dateTime,
          items: [{ product: productId, quantity: 1 }],
          deliveryAddress
        });
      } else {
        const existingItem = cart.items.find(item => item.product.toString() === productId.toString());
        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          cart.items.push({ product: productId, quantity: 1 });
        }
      }
  
      await cart.save();
      return cart;
    }
  
    async deleteCart() {
      const result = await CartModel.findOneAndDelete()
      return result;
    }

    
    async deleteCartItem(itemId) {
      try {
        const cart = await CartModel.findOneAndUpdate(
          {},
          { $pull: { items: { product: new mongoose.Types.ObjectId(itemId) } } },
          { new: true }
        );
    
        if (!cart) {
          throw new Error('Cart not found');
        }
    
        if (cart.items.length === 0) {
          await CartModel.findByIdAndDelete(cart._id);
        }
    
        return true;
      } catch (error) {
        throw new Error(error.message);
      }
    }
    
    
    async updateCartItem(itemId, updatedItemData) {
      try {
        const cart = await CartModel.findOneAndUpdate(
          {},
          { $set: { "items.$[item].quantity": updatedItemData.quantity } },
          { new: true, arrayFilters: [{ "item.product": itemId }] }
        );
    
        if (!cart) {
          throw new Error('Cart not found');
        }
    
        const updatedItem = cart.items.find(item => item.product.toString() === itemId);
    
        if (!updatedItem) {
          throw new Error('CartItem not found');
        }
    
        return updatedItem;
      } catch (error) {
        throw new Error(error.message);
      }
    }
    
    
  }