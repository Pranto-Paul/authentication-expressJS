import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../model/User.model.js';
import sendMail from '../utils/sendMail.js';
export const register = async (req, res) => {
  try {
    // get user input -> name,email,password
    const { name, email, password } = req.body;
    // validate user input
    if (!name || !email || !password)
      return res.status(400).send('All fields are required');
    // check if user already exist
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res
        .status(400)
        .json({ success: false, message: 'user already exists' });
    // create new user
    const user = await User.create({
      name,
      email,
      password,
    });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: 'user not found' });
    // create verification token & save in database
    const token = crypto.randomBytes(32).toString('hex');
    user.verificationToken = token;
    await user.save();
    // send verification email
    await sendMail(user.email, token);

    res
      .status(201)
      .json({ message: 'User created successfully', success: true });
  } catch (error) {
    res.status(400).json({
      message: 'Something went wrong',
      error: error.message,
      success: false,
    });
  }
};

export const verifyUser = async (req, res) => {
  try {
    //get token from url
    const { token } = req.params;
    //validate
    if (!token)
      return res.status(400).json({ message: 'Invalid token', success: false });
    //find user based on token
    const user = await User.findOne({ verificationToken: token });
    //if not
    if (!user)
      return res.status(400).json({ message: 'Invalid token', success: false });
    //set isVarified field->true
    user.isVerified = true;
    //remove verification token
    user.verificationToken = undefined;
    //save
    await user.save();
    //return response
    res.status(200).json({ message: 'Verification successful', success: true });
  } catch (error) {
    res.status(400).json({
      message: 'Something went wrong',
      error: error.message,
      success: false,
    });
  }
};
export const login = async (req, res) => {
  try {
    // get user input -> email,password & validate
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ message: 'all fields are required', success: 'false' });
    // match email from database
    const user = await User.findOne({ email });
    // if user does not exists
    if (!user)
      return res
        .status(400)
        .json({ message: 'User not found', success: false });
    // match password of user with database
    const isMatched = await bcrypt.compare(password, user.password);
    // if password does not match
    if (!isMatched)
      return res
        .status(400)
        .json({ message: 'all fields are required', success: 'false' });
    //check user verified or not
    if (!user.isVerified) {
      return res.status(400).json({ message: 'user does not verified' });
    }
    // create a jwt token
    const jwtToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    //set cookie
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 3600 * 1000,
    };
    res.cookie('token', jwtToken, cookieOptions);
    res.status(200).json({
      success: true,
      message: 'user login successfully',
      token: jwtToken,
      user: {
        id: user._id,
        role: user.role,
        email: user.email,
        name: user.name,
      },
    });

    // return response
  } catch (error) {
    return res
      .status(400)
      .json({ message: 'Something went wrong while login', success: 'false' });
  }
};

export const getMe = async (req, res) => {
  try {
    const data = req.user;
    const user = await User.findById(req.user.id).select('-password');
    if (!user)
      return res.status(400).json({
        success: false,
        message: 'user not found',
      });
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(400).json({
      message: 'Something went wrong while getting user profile',
      success: false,
    });
  }
};
export const logOut = async (req, res) => {
  try {
    res.cookie('token', '', {});
    res.status(200).json({
      success: true,
      message: 'Loggedout successfully',
    });
  } catch (error) {
    return res
      .status(400)
      .json({ message: 'Something went wrong while logout', success: false });
  }
};
export const forgotPassword = async (req, res) => {
  try {
    // get email
    const { email } = req.body;
    // find user based on email
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: 'user not found' });
    // reset token + reset expiry => Date.now() + 10 * 60 * 1000 ==> user.save()
    const token = crypto.randomBytes(32).toString('hex');
    const expiry = Date.now() + 10 * 60 * 1000;
    user.resetPasswordToken = token;
    user.resetPasswordExpire = expiry;
    await user.save();
    // send mail
    await sendMail(user.email, token);
    return res
      .status(200)
      .json({ success: true, message: 'email with token sent' });
  } catch (error) {
    return res.status(400).json({
      message: 'Something went wrong while forgot-password',
      success: false,
    });
  }
};
export const resetPassword = async (req, res) => {
  try {
    // collect token from params
    const { token } = req.params;
    // password from req.body
    const { password } = req.body;
    // find user
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });
    //set password in user
    user.password = password;
    //resetToken, resetExpiry ==> reset
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    //save
    await user.save();
    res
      .status(200)
      .json({ success: true, message: 'password reset successfull' });
  } catch (error) {
    return res.status(400).json({
      message: 'Something went wrong while reset-password',
      success: false,
    });
  }
};
