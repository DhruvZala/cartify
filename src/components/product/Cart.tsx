import React, { useState, useEffect } from "react";
import Navbar from "../common/Navbar";
import Footer from "../common/Footer";
import { RazorpayPayment } from "../../utils/RazorpayService";

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

const CartPage: React.FC = () => {
  const [cart, setCart] = useState<Product[]>([]);
  const [giftCardCode, setGiftCardCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [discountApplied, setDiscountApplied] = useState(false);
  const [invalidCode, setInvalidCode] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  useEffect(() => {
    const cartData = JSON.parse(sessionStorage.getItem("cart") || "[]");
    setCart(cartData);
  }, []);

  const updateQuantity = (id: number, change: number) => {
    const updatedCart = cart
      .map((item) => {
        if (item.id === id) {
          const newQuantity = item.quantity + change;
          if (newQuantity >= 0 && newQuantity <= 5) {
            return { ...item, quantity: newQuantity };
          }
          return item;
        }
        return item;
      })
      .filter((item) => item.quantity > 0);
    setCart(updatedCart);
    sessionStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const applyGiftCard = () => {
    const validCodes: Record<string, number> = {
      DHRUV: 10,
      DEV: 5,
      CARTIFYECOMMERCE: 15,
      NEWUSER: 10,
    };

    if (validCodes[giftCardCode]) {
      setDiscount(validCodes[giftCardCode]);
      setDiscountApplied(true);
      setInvalidCode(false);
    } else {
      setInvalidCode(true);
      setDiscount(0);
      setDiscountApplied(false);
    }
  };

  const removeGiftCard = () => {
    setGiftCardCode("");
    setDiscount(0);
    setDiscountApplied(false);
    setInvalidCode(false);
  };

  const subtotal = cart
    .reduce((acc, item) => acc + item.price * item.quantity, 0)
    .toFixed(2);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const grandTotal = parseFloat(subtotal);
  const deliveryCharge = cart.length === 0 || grandTotal >= 100 ? 0 : 5;
  const discountAmount = (grandTotal * discount) / 100;
  const totalWithDeliveryAndDiscount = (
    grandTotal +
    deliveryCharge -
    discountAmount
  ).toFixed(2);

  const handleCheckout = async () => {
    setPaymentError(null);

    await RazorpayPayment(
      parseFloat(totalWithDeliveryAndDiscount),
      "INR",
      (paymentId: unknown) => {
        alert(`Payment successful! ID: ${paymentId}`);
        // Cart Itms remove after payment sucess
        sessionStorage.removeItem("cart");
        setCart([]);
      },
      (error: React.SetStateAction<string | null>) => {
        setPaymentError(error);
      }
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar cartCount={cartCount} />

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 sm:p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">
                Your Shopping Cart
                <span className="text-indigo-600 ml-2">
                  ({cart.length} {cart.length === 1 ? "item" : "items"})
                </span>
              </h1>

              {paymentError && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                  <div className="flex">
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{paymentError}</p>
                    </div>
                  </div>
                </div>
              )}

              {cart.length === 0 ? (
                <div className="text-center py-12 bg-gray-50">
                  <div className="mx-auto h-24 w-24 text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">
                    Your cart is empty
                  </h3>
                  <p className="mt-1 text-gray-500">
                    Start adding some amazing products!
                  </p>
                  <div className="mt-6">
                    <a
                      href="/ProductPage"
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Continue Shopping
                    </a>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="divide-y divide-gray-200">
                    {cart.map(({ id, title, price, image, quantity }) => (
                      <div key={id} className="py-6 flex flex-col sm:flex-row">
                        <div className="flex-shrink-0 mb-4 sm:mb-0">
                          <img
                            src={image}
                            alt={title}
                            className="w-32 h-32 object-contain rounded-lg p-4"
                          />
                        </div>

                        <div className="ml-0 sm:ml-6 flex-1 flex flex-col">
                          <div className="flex-1">
                            <h2 className="text-lg font-semibold text-gray-900">
                              {title}
                            </h2>
                            <p className="mt-1 text-lg font-medium text-indigo-600">
                              ${price.toFixed(2)}
                            </p>
                          </div>

                          <div className="mt-4 flex items-center justify-between">
                            {quantity === 5 && (
                              <p className="text-l text-red-500">
                                Maximum quantity reached
                              </p>
                            )}

                            <div className="flex items-center space-x-4">
                              <div className="inline-flex items-center border border-gray-300 rounded-md">
                                <button
                                  onClick={() => updateQuantity(id, -1)}
                                  className="px-3 py-1 text-lg text-gray-600 hover:bg-gray-100 rounded-l-md transition-colors"
                                >
                                  -
                                </button>
                                <span className="px-4 py-1 border-x border-gray-300 text-center w-12">
                                  {quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(id, 1)}
                                  className={`px-3 py-1 text-lg rounded-r-md transition-colors ${
                                    quantity === 5
                                      ? "text-gray-400 cursor-not-allowed"
                                      : "text-gray-600 hover:bg-gray-100"
                                  }`}
                                  disabled={quantity === 5}
                                >
                                  +
                                </button>
                              </div>

                              <button
                                onClick={() => updateQuantity(id, -quantity)}
                                className="text-l cursor-pointer font-medium text-red-600 hover:text-red-500"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <div className="space-y-4">
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <p className="text-xl">Subtotal</p>
                        <p className="text-xl">${subtotal}</p>
                      </div>

                      <div className="flex justify-between">
                        <p className="text-gray-600 text-xl">Delivery</p>
                        <p
                          className={`text-sm ${
                            deliveryCharge === 0
                              ? "text-green-600 text-xl"
                              : "text-gray-900 text-xl"
                          }`}
                        >
                          {deliveryCharge === 0 ? "FREE" : `$${deliveryCharge}`}
                        </p>
                      </div>

                      {discountApplied && (
                        <div className="flex justify-between">
                          <p className="text-xl text-gray-600">
                            Discount ({discount}%)
                          </p>
                          <p className="text-xl text-green-600">
                            -${discountAmount.toFixed(2)}
                          </p>
                        </div>
                      )}

                      <div className="mt-4">
                        {discountApplied ? (
                          <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                            <div className="flex items-center">
                              <svg
                                className="h-5 w-5 text-green-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              <p className="ml-2 text-l font-medium text-green-800">
                                Gift card applied ({discount}% off)
                              </p>
                            </div>
                            <button
                              onClick={removeGiftCard}
                              className="text-l cursor-pointer font-medium text-red-600 hover:text-red-500"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <div>
                            <label
                              htmlFor="gift-card"
                              className="block text-l font-medium text-gray-700 mb-1"
                            >
                              Gift card or discount code
                            </label>
                            <div className="flex">
                              <input
                                type="text"
                                id="gift-card"
                                placeholder="Enter Code"
                                value={giftCardCode}
                                onChange={(e) =>
                                  setGiftCardCode(e.target.value)
                                }
                                className="block text-xl p-2 rounded-l-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                              <button
                                onClick={applyGiftCard}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              >
                                Apply
                              </button>
                            </div>
                            {invalidCode && (
                              <p className="mt-1 text-l text-red-600">
                                Invalid gift card code
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex justify-between text-lg font-bold text-gray-900 pt-4 border-t border-gray-200 mt-4">
                        <p className="text-xl">Total</p>
                        <p className="text-xl">
                          ${totalWithDeliveryAndDiscount}
                        </p>
                      </div>

                      <div className="mt-6">
                        <button
                          onClick={handleCheckout}
                          className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          disabled={cart.length === 0}
                        >
                          Checkout
                        </button>
                      </div>

                      <div className="mt-4 flex justify-center text-sm text-gray-500">
                        <p className="text-xl">
                          Or{" "}
                          <a
                            href="/ProductPage"
                            className="font-medium text-indigo-600 hover:text-indigo-500 text-xl"
                          >
                            Continue Shopping
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CartPage;
