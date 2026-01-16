import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken'

//I'm facing a typescript issue it is saying 3rd parameter should be a type callback but sign expect first 
// value as payload, second string, third as object therefore when setting the expireIn type as string is 
//throwing error therefore to skip that typescript issue i have given any type for now
//it's just a typescript issue no relation with the jwt.sign
export const createToken=(id: string, email: string, expiresIn: any)=>{
    const payload={id, email};
    const token=jwt.sign(payload,process.env.JWT_SECRET,{
        expiresIn,
    });
    return token;
}

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.signedCookies['auth_token'];

  if (!token) {
    return res.status(401).json({ message: "Token not found" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.locals.jwtData = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

//decode contains email and id of user because they were passed as payload while creating the token
//res.locals this is the way to pass data locally from one middleware to other express provide it
//req.signedCookies contain the signedcookies which are set in the brower while they signedIn or
//logined in for the first time

export function optionalAuth(
  req: Request,
  res: Response,
  next: NextFunction) {
  const token = req.signedCookies.auth_token;

  if (!token) {
    res.locals.jwtData = null; // 👈 important
    return next();
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.locals.jwtData = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

//TO DO: create a seprate verfiy token because it's repeared code in verifyToken and optionalAuth middleware
