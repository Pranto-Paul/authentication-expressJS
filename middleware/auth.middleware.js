import jwt from 'jsonwebtoken';
export const isLoggedIn = async (req, res, next) => {
  try {
    //check token
    const token = req.cookies?.token;
    if (!token)
      return res
        .status(401)
        .json({ success: false, message: 'Authentication failed' });

    //verifying token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res
      .status(400)
      .json({ success: 'false', message: 'login credentials invalid' });
  }
  next();
};
