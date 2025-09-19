// File: ACM-Backend/middleware/auth.middleware.js

import pkg from "jsonwebtoken";
import User from "../models/users.model.js";
import dotenv from "dotenv";
import { HttpException } from "../utils/HttpException.js";
import { isTokenBlocklisted } from "../utils/tokenBlocklist.js";
const { verify } = pkg;
dotenv.config();
const getAuthorization = (req) => {
  const header = req.header("Authorization");
  if (header) return header.split("Bearer ")[1];
  return null;
};
export const AuthMiddleware = async (req, res, next) => {
  try {
    const token = getAuthorization(req);

    if (token) {
      if (isTokenBlocklisted(token)) {
        return next(new HttpException(401, "Token is invalid (logged out)"));
      }
      const { id } = await verify(token, process.env.JWT_SECRET);
      const findUser = await User.findById(id);

      if (findUser) {
        req.user = findUser;
        next();
      } else {
        next(new HttpException(401, "Wrong authentication token"));
      }
    } else {
      next(new HttpException(404, "Authentication token missing"));
    }
  } catch (error) {
    next(new HttpException(401, "Wrong authentication token"));
  }
};
export const AdminMiddleware = async (req, res, next) => {
  try {
    const token = getAuthorization(req);
    if (token) {
      if (isTokenBlocklisted(token)) {
        return next(new HttpException(401, "Token is invalid (logged out)"));
      }
      const { id } = await verify(token, process.env.JWT_SECRET);
      const findUser = await User.findById(id);
      if (findUser && findUser.isAdmin === true) {
        req.user = findUser;
        next();
      } else {
        next(
          new HttpException(
            403,
            "You are not authorized to access this resource"
          )
        );
      }
    } else {
      next(new HttpException(404, "Authentication token missing"));
    }
  } catch (error) {
    next(new HttpException(401, "Wrong authentication token"));
  }
};
