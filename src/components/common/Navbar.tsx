import React from "react";
import { CircleUserRound, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

interface NavbarProps {
  cartCount: number;
}

const Navbar: React.FC<NavbarProps> = ({ cartCount }) => {
  const isLoggedIn = localStorage.getItem("jwtToken");
  

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("email");
    localStorage.removeItem("password");
    document.cookie = "jwtToken=; expires= 1 path=/;";
    window.location.reload();
  };

  return (
    <div className="navBar flex justify-between items-center px-6 py-4 shadow-md sticky top-0 bg-white z-50 border-b border-gray-100 backdrop-blur-sm bg-opacity-90">
      <div className="navLeft flex flex-col justify-center w-1/3">
        <Link to="/ProductPage" className="group">
          <h2 className="text-3xl font-bold pl-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 group-hover:from-purple-600 group-hover:to-blue-600 transition-all duration-500">
            Cartify.com
          </h2>
        </Link>
        <h4 className="text-l text-gray-500 pl-2 font-medium tracking-wide">
          Discover amazing products at unbeatable prices!
        </h4>
      </div>

      <div className="navRight flex items-center justify-end gap-6 w-1/3">
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-1.5">
            <CircleUserRound
              size={20}
              className="text-gray-600 hidden sm:block"
            />
            <div className="flex gap-1 text-sm sm:text-base">
              {isLoggedIn ? (
                <>
                  <span className="font-medium text-gray-700  hover:text-blue-600 transition-colors duration-200 px-2 py-1 rounded-md hover:bg-blue-50">
                    {localStorage.getItem("email")}
                  </span>
                  <span className="text-gray-300">|</span>
                  <button
                    onClick={handleLogout}
                    className="font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200 px-2 py-1 rounded-md hover:bg-blue-50"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/Login"
                    className="font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200 px-2 py-1 rounded-md hover:bg-blue-50"
                  >
                    LogIn
                  </Link>
                  <span className="text-gray-300">|</span>
                  <Link
                    to="/registerPage"
                    className="font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200 px-2 py-1 rounded-md hover:bg-blue-50"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="relative group">
          <Link
            to="/Cart"
            className="p-2 rounded-full hover:bg-blue-50 transition-colors duration-200 flex items-center justify-center"
          >
            <ShoppingCart
              size={22}
              className="text-gray-700 group-hover:text-blue-600 transition-colors duration-200"
            />
            {cartCount > 0 && (
              <div className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-200 shadow-sm">
                {cartCount}
              </div>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
