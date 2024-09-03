import jwt from 'jsonwebtoken';
import { errorHandlar } from './error.js';


export const verifyToken = (req, _, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(errorHandlar(401, 'Unauthorized!'));
  }
  jwt.verify(token, process.env.JWT_TOKEN, (err, user) => {
    if (err) {
      return next(errorHandlar(401, 'Forbidden!'));
    }
    req.user = user;
    next();
  });
};

