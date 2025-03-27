// import React, { useEffect } from "react";
import Login from "./components/auth/Login";
import ProductPage from "./components/product/ProductPage";
import {
  BrowserRouter as Router,
  // useNavigate,
  useRoutes,
} from "react-router-dom";
// import { getCookie } from "./utils/constants/constants";
import Cart from "./components/product/Cart";
import ProductDetailPage from "./components/product/ProductDetailPage";
import Register from "./components/auth/Register";
import ChangePassword from "./components/auth/ChangePassword";

const AppRoutes: React.FC = () => {
  // const navigate = useNavigate();

  const routes = [
    { path: "/login", element: <Login /> },
    { path: "/", element: <Login /> },
    { path: "/productPage", element: <ProductPage /> },
    { path: "/cart", element: <Cart /> },
    { path: "/product/:id", element: <ProductDetailPage /> },
    { path: "/registerPage", element: <Register /> },
    { path: "/changePassword", element: <ChangePassword /> }
  ];

  // useEffect(() => {
  //   const tokenFromLocalStorage = localStorage.getItem("jwtToken");
  //   const tokenFromCookie = getCookie("jwtToken");

  //   if (tokenFromLocalStorage !== tokenFromCookie) {
  //     navigate("/");
  //   }
  // }, [navigate]);

  return useRoutes(routes);
};

const Root: React.FC = () => (
  <Router>
    <AppRoutes />
  </Router>
);

export default Root;
