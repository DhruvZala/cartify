import { ReactNode } from "react";

export interface Product {
  description: ReactNode;
  id: number;
  title: string;
  price: number;
  image: string;
  rating: {
    count: ReactNode; rate: number 
};
  category: string;
  quantity: number;
}

export const getCartFromStorage = (): Product[] => {
  const cart = sessionStorage.getItem("cart");
  return cart ? JSON.parse(cart) : [];
};

export const saveCartToStorage = (cart: Product[]): void => {
  sessionStorage.setItem("cart", JSON.stringify(cart));
};

export const calculateCartCount = (cart: Product[]): number => {
  return cart.reduce(
    (acc: number, item: Product) => acc + (item.quantity || 0),
    0
  );
};

export const updateCartItem = (
  cart: Product[],
  product: Product,
  newQuantity: number
): Product[] => {
  const updatedCart = [...cart];
  const existingProductIndex = updatedCart.findIndex(
    (item: Product) => item.id === product.id
  );

  if (existingProductIndex !== -1) {
    if (newQuantity === 0) {
      updatedCart.splice(existingProductIndex, 1);
    } else {
      updatedCart[existingProductIndex].quantity = newQuantity;
    }
  } else if (newQuantity > 0) {
    updatedCart.push({ ...product, quantity: newQuantity });
  }

  return updatedCart;
};

export const addProductToCart = (
  cart: Product[],
  product: Product
): { updatedCart: Product[]; message: string } => {
  const existingProductIndex = cart.findIndex(
    (item: Product) => item.id === product.id
  );

  if (existingProductIndex !== -1) {
    if (cart[existingProductIndex].quantity! < 5) {
      cart[existingProductIndex].quantity! += 1;
      return {
        updatedCart: [...cart],
        message: "",
      };
    } else {
      return {
        updatedCart: [...cart],
        message: "Maximum quantity reached for this item.",
      };
    }
  } else {
    return {
      updatedCart: [...cart, { ...product, quantity: 1 }],
      message: "",
    };
  }
};
