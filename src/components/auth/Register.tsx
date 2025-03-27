import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FolderPen,
  Mail,
  KeyRound,
  CalendarCheck,
  Eye,
  EyeOff,
} from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { passwordRegex, emailRegex } from "../../utils/constants/constants";
import "../../styles/register.css";

interface User {
  name: string;
  email: string;
  password: string;
}

const validationSchema = Yup.object({
  name: Yup.string()
    .required("Please enter your name")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters"),

  email: Yup.string()
    .matches(emailRegex, "Please enter valid email address")
    .required("Please enter your email")
    .max(100, "Email cannot exceed 100 characters"),

  password: Yup.string()
    .required("Please create a password")
    .min(8, "Password must be at least 8 characters long")
    .matches(
      passwordRegex,
      "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (@$!%*?&)"
    ),

  confirmPassword: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref("password")], "Passwords do not match"),
});

const MAX_USERS = 5;

const Register: React.FC = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [registrationError, setRegistrationError] = useState("");
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: (values) => {
      try {
        const existingUsers: User[] = JSON.parse(
          localStorage.getItem("userDetails") || "[]"
        );

        if (!Array.isArray(existingUsers)) {
          throw new Error("Invalid user data format");
        }

        const emailExists = existingUsers.some(
          (user) => user.email === values.email
        );

        if (emailExists) {
          setRegistrationError(
            "Email already registered. Please login to continue."
          );
          return;
        }

        if (existingUsers.length >= MAX_USERS) {
          setRegistrationError(
            `Maximum ${MAX_USERS} users reached. Please try later.`
          );
          return;
        }

        const newUser = {
          name: values.name,
          email: values.email,
          password: values.password,
        };

        const updatedUsers = [...existingUsers, newUser];
        localStorage.setItem("userDetails", JSON.stringify(updatedUsers));

        localStorage.setItem("email", values.email);

        navigate("/ProductPage");
      } catch (error) {
        console.error("Registration error:", error);
        setRegistrationError(
          "An error occurred during registration. Please try again."
        );
      }
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
      <div className="flex items-center justify-center px-4 py-12 min-h-screen">
        <form
          onSubmit={formik.handleSubmit}
          className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
            <p className="mt-2 text-gray-600">Join us to start shopping</p>
          </div>

          {registrationError && (
            <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg animate-fade-in">
              {registrationError}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="flex items-center text-sm font-medium text-gray-700"
              >
                <FolderPen className="w-5 h-5 mr-2 text-indigo-500" />
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-4 py-3 mt-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-200 ${
                  formik.touched.name && formik.errors.name
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="John Doe"
              />
              {formik.touched.name && formik.errors.name && (
                <p className="mt-1 text-sm text-red-600 animate-fade-in">
                  {formik.errors.name}
                </p>
              )}
            </div>

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
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-4 py-3 mt-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-200 ${
                  formik.touched.email && formik.errors.email
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="your@email.com"
              />
              {formik.touched.email && formik.errors.email && (
                <p className="mt-1 text-sm text-red-600 animate-fade-in">
                  {formik.errors.email}
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
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-200 ${
                    formik.touched.password && formik.errors.password
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
              {formik.touched.password && formik.errors.password && (
                <p className="mt-1 text-sm text-red-600 animate-fade-in">
                  {formik.errors.password}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="flex items-center text-sm font-medium text-gray-700"
              >
                <CalendarCheck className="w-5 h-5 mr-2 text-indigo-500" />
                Confirm Password
              </label>
              <div className="relative mt-2">
                <input
                  type={confirmPasswordVisible ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-200 ${
                    formik.touched.confirmPassword &&
                    formik.errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-indigo-600 transition-colors duration-200"
                  onClick={() =>
                    setConfirmPasswordVisible(!confirmPasswordVisible)
                  }
                >
                  {confirmPasswordVisible ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {formik.touched.confirmPassword &&
                formik.errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600 animate-fade-in">
                    {formik.errors.confirmPassword}
                  </p>
                )}
            </div>

            <button
              type="submit"
              className="w-full px-4 py-3 text-lg font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Create Account
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline"
              >
                Sign in
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

export default Register;
