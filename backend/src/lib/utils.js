import jwt from "jsonwebtoken";

export const generateToken = (res, userId) => {
  try {
    const { JWT_SECRET } = process.env;
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }
    const token = jwt.sign({ userId }, JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true, // Prevent xss attacks
      sameSite: "strict", // Prevent CSRF attacks
      secure: process.env.NODE_ENV === "development" ? false : true, // Prevent cookie from being sent over http
    });

    return token;
  } catch (error) {
    console.log("Error in generateToken", error);
    return null;
  }
};
