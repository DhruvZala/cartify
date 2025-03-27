/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, KeyRound, Eye, EyeOff } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import "../../styles/login.css";
import {
  createAuthToken,
  passwordRegex,
  emailRegex,
  setCookie,
} from "../../utils/constants/constants";

const validationSchema = Yup.object({
  email: Yup.string()
    .matches(emailRegex, "Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .matches(
      passwordRegex,
      "Password must contain at least" +
        "- 1 uppercase letter" +
        "- 1 lowercase letter" +
        "- 1 number" +
        "- 1 special character (@$!%*?&)"
    )
    .required("Password is required"),
});

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loginError, setLoginError] = useState("");

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: (values: any) => {
      const existingUsers = JSON.parse(
        localStorage.getItem("userDetails") || "[]"
      );

      const userExists = existingUsers.some(
        (user: any) => user.email === values.email
      );

      if (!userExists) {
        setLoginError("No user found with this email. Please register first.");
        return;
      }

      const user = existingUsers.find(
        (user: any) => user.email === values.email
      );
      if (user && user.password !== values.password) {
        setLoginError("Incorrect password");
        return;
      }

      console.log("Form Submitted", values);

      const payload = {
        email: values.email,
        password: values.password,
      };

      const secret = "mysecretkey";

      const generatedToken = createAuthToken(payload, secret);

      localStorage.setItem("jwtToken", generatedToken);
      setCookie("jwtToken", generatedToken, 1);

      localStorage.setItem("email", values.email);
      localStorage.setItem("password", values.password);

      console.log("Generated JWT Is : ", generatedToken);

      navigate("/ProductPage");
    },  
  });

  const { handleSubmit, values, errors, touched, handleChange, handleBlur } =
    formik;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
      <div className="flex items-center justify-center  px-4 py-12 min-h-screen">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
            <p className="mt-2 text-gray-600">Sign in to your account</p>
          </div>

          {loginError && (
            <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg animate-fade-in">
              {loginError}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="flex items-center text-sm font-medium text-gray-700"
              >
                <Mail className="w-5 h-5 mr-2 text-indigo-500" />
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-3 mt-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-200 ${
                  touched.email && errors.email
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="your@email.com"
              />
              {touched.email && errors.email && (
                <p className="mt-1 text-sm text-red-600 animate-fade-in">
                  {String(errors.email)}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="flex items-center text-sm font-medium text-gray-700"
              >
                <KeyRound className="w-5 h-5 mr-2 text-indigo-500" />
                Password
              </label>
              <div className="relative mt-2">
                <input
                  type={passwordVisible ? "text" : "password"}
                  id="password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-200 ${
                    touched.password && errors.password
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-indigo-600 transition-colors duration-200"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                >
                  {passwordVisible ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {touched.password && errors.password && (
                <p className="mt-1 text-sm text-red-600 animate-fade-in">
                  {String(errors.password)}
                </p>
              )}
            </div>

            <div className="flex items-center justify-end">
              <Link
                to="/changePassword"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full px-4 py-3 text-lg font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Sign in
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/registerPage"
                className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline"
              >
                Sign up
              </Link>
            </p>
            <p className="mt-2 text-sm text-gray-600">
              Just browsing?{" "}
              <Link
                to="/ProductPage"
                className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline"
              >
                Continue as guest
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
