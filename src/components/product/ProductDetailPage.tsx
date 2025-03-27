import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../common/Navbar";
import Footer from "../common/Footer";
import {
  Product,
  getCartFromStorage,
  saveCartToStorage,
  calculateCartCount,
  updateCartItem,
} from "../../utils/cartUtils";

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(0);
  const [cart, setCart] = useState<Product[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [messages, setMessages] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    axios
      .get(`https://fakestoreapi.com/products/${id}`)
      .then((response) => {
        setProduct(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching product details:", error);
        setLoading(false);
      });

    const storedCart = getCartFromStorage();
    setCart(storedCart);
    setCartCount(calculateCartCount(storedCart));
  }, [id]);

  const increaseQuantity = () => {
    if (product) {
      setQuantity((prev) => {
        const newQuantity = Math.min(prev + 1, 5);
        handleUpdateCart(newQuantity);
        return newQuantity;
      });
    }
  };

  const decreaseQuantity = () => {
    if (product && quantity > 0) {
      setQuantity((prev) => {
        const newQuantity = Math.max(prev - 1, 0);
        handleUpdateCart(newQuantity);
        return newQuantity;
      });
    }
  };

  const handleUpdateCart = (newQuantity: number) => {
    if (product) {
      const updatedCart = updateCartItem(cart, product, newQuantity);
      setCart(updatedCart);
      setCartCount(calculateCartCount(updatedCart));
      saveCartToStorage(updatedCart);

      setMessages((prevMessages) => ({
        ...prevMessages,
        [product.id]:
          newQuantity === 5 ? "Maximum quantity reached for this item." : "",
      }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar cartCount={0} />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar cartCount={0} />
        <div className="flex-grow flex flex-col items-center justify-center text-center p-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The product you're looking for doesn't exist or may have been
            removed.
          </p>
          <Link
            to="/ProductPage"
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium"
          >
            Browse Products
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar cartCount={cartCount} />

      <main className="flex-grow">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="md:flex">
              {/* Product Image */}
              <div className="md:w-1/2 p-8 flex items-center justify-center bg-gray-50">
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-80 w-80 object-contain transition-transform duration-300 hover:scale-105"
                />
              </div>

              {/* Product Details */}
              <div className="md:w-1/2 p-8">
                <div className="flex flex-col h-full">
                  {/* Category */}
                  <span className="text-sm font-medium text-indigo-600 uppercase tracking-wider">
                    {product.category}
                  </span>

                  {/* Title */}
                  <h1 className="mt-2 text-2xl font-extrabold text-gray-900 sm:text-3xl">
                    {product.title}
                  </h1>

                  {/* Rating */}
                  <div className="mt-3 flex items-center">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(product.rating?.rate || 0)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                      {product.rating?.rate} ({product.rating?.count} reviews)
                    </span>
                  </div>

                  {/* Price */}
                  <div className="mt-4">
                    <p className="text-3xl font-bold text-gray-900">
                      ${product.price.toFixed(2)}
                    </p>
                  </div>

                  {/* Description */}
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-900">
                      Description
                    </h3>
                    <p className="mt-2 text-base text-gray-600">
                      {product.description}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="mt-8">
                    <div className="flex items-center space-x-4">
                      <h3 className="text-sm font-medium text-gray-900">
                        Quantity
                      </h3>
                      <div className="flex items-center border border-gray-300 rounded-md">
                        <button
                          onClick={decreaseQuantity}
                          disabled={quantity === 0}
                          className={`px-3 py-1 text-lg ${
                            quantity === 0
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          -
                        </button>
                        <span className="px-4 py-1 text-center w-12 border-x border-gray-300">
                          {quantity}
                        </span>
                        <button
                          onClick={increaseQuantity}
                          disabled={quantity === 5}
                          className={`px-3 py-1 text-lg ${
                            quantity === 5
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {messages[product.id] && (
                      <p className="mt-2 text-sm text-red-500">
                        {messages[product.id]}
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-auto pt-8 space-y-4">
                    <button
                      onClick={() => increaseQuantity()}
                      disabled={quantity === 5}
                      className={`w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${
                        quantity === 5
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-indigo-600 hover:bg-indigo-700"
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200`}
                    >
                      {quantity > 0 ? "Update Cart" : "Add to Cart"}
                    </button>

                    <Link
                      to="/ProductPage"
                      className="w-full flex justify-center items-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                    >
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetailPage;
