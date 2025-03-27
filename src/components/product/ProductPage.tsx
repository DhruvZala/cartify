import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../common/Navbar";
import Footer from "../common/Footer";
import { Link, useNavigate } from "react-router-dom";
import {
  Product,
  getCartFromStorage,
  saveCartToStorage,
  calculateCartCount,
  addProductToCart,
} from "../../utils/cartUtils";

const ProductPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [cartCount, setCartCount] = useState<number>(0);
  const [cart, setCart] = useState<Product[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const productsPerPage = 9;

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    setIsLoggedIn(!!token);

    const fetchProducts = async () => {
      try {
        const response = await axios.get("https://fakestoreapiserver.reactbd.com/amazonproducts");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    const storedCart = getCartFromStorage();
    setCart(storedCart);
    setCartCount(calculateCartCount(storedCart));
  }, []);

  const handleProductClick = (e: React.MouseEvent) => {
    if (!isLoggedIn) {
      e.preventDefault();
      alert("Please login / register to view product details.");
      navigate('/login');
    }
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const updateQuantity = (productId: number, change: number) => {
    if (!isLoggedIn) {
      alert("Please login to modify your cart.");
      navigate('/login');
      return;
    }

    const updatedCart = cart
      .map((item) => {
        if (item.id === productId) {
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
    setCartCount(calculateCartCount(updatedCart));
    saveCartToStorage(updatedCart);
  };

  const addToCart = (product: Product) => {
    if (!isLoggedIn) {
      alert("Please login to add items to your cart.");
      navigate('/login');
      return;
    }
    
    const { updatedCart } = addProductToCart(cart, product);
    setCart(updatedCart);
    setCartCount(calculateCartCount(updatedCart));
    saveCartToStorage(updatedCart);
  };

  const isInCart = (productId: number) => {
    return cart.some((item) => item.id === productId);
  };

  const getQuantity = (productId: number) => {
    const item = cart.find((item) => item.id === productId);
    return item ? item.quantity : 0;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="sticky top-0 z-50 shadow-md bg-white">
        <Navbar cartCount={cartCount}  />
      </div>

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <>
            {!isLoggedIn && (
              <div className="mb-4 p-4 bg-yellow-50 border-l-4 border-yellow-400">
                <p className="text-yellow-700">
                  Please <Link to="/login" className="text-indigo-600 hover:underline">login</Link> to view product details and add items to your cart.
                </p>
              </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col h-full border border-gray-100"
                >
                  <Link
                    to={`/product/${product.id}`}
                    className="flex-grow flex flex-col"
                    onClick={handleProductClick}
                  >
                    <div className="p-4 flex justify-center h-56">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="h-full object-contain transition-transform duration-200 hover:scale-105"
                      />
                    </div>
                    <div className="px-4 pb-3 flex-grow">
                      <h3 className="text-base font-medium text-gray-800 line-clamp-2">
                        {product.title}
                      </h3>
                      <p className="mt-2 text-lg font-bold text-indigo-600">
                        ${product.price.toFixed(2)}
                      </p>
                    </div>
                  </Link>

                  <div className="px-4 pb-4 flex flex-col items-center">
                    {!isInCart(product.id) ? (
                      <button
                        onClick={() => addToCart(product)}
                        disabled={!isLoggedIn}
                        className={`w-[200px] h-[40px] font-medium rounded-md transition-colors duration-200 text-base flex items-center justify-center ${
                          isLoggedIn 
                            ? "bg-indigo-600 hover:bg-indigo-700 text-white" 
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        {isLoggedIn ? "Add to Cart" : "Login to Add"}
                      </button>
                    ) : (
                      <div className="flex flex-col items-center space-y-2 w-[200px]">
                        {getQuantity(product.id) === 5 && (
                          <p className="text-sm text-red-500">
                            Maximum quantity reached
                          </p>
                        )}
                        <div className="flex items-center border border-gray-300 rounded-md w-full h-[40px]">
                          <button
                            onClick={() => updateQuantity(product.id, -1)}
                            className="w-1/3 h-full text-lg hover:bg-gray-100 rounded-l-md transition-colors flex items-center justify-center"
                          >
                            -
                          </button>
                          <span className="w-1/3 text-center text-base font-medium flex items-center justify-center">
                            {getQuantity(product.id)}
                          </span>
                          <button
                            onClick={() => updateQuantity(product.id, 1)}
                            disabled={getQuantity(product.id) === 5 || !isLoggedIn}
                            className={`w-1/3 h-full text-lg rounded-r-md transition-colors flex items-center justify-center ${
                              getQuantity(product.id) === 5 || !isLoggedIn
                                ? "text-gray-400 cursor-not-allowed"
                                : "hover:bg-gray-100"
                            }`}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-8 space-x-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 text-base rounded-md ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => paginate(index + 1)}
                  className={`px-4 py-2 text-base rounded-md ${
                    currentPage === index + 1
                      ? "bg-indigo-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 text-base rounded-md ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                Next
              </button>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProductPage;