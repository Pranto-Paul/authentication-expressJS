import crypto from 'crypto';
import User from '../model/User.model.js';
import sendMail from '../utils/sendMail.js';
export const register = async (req, res) => {
  try {
    // get user input -> name,email,password
    const { name, email, password } = req.body;
    // validate user input
    if (!name.trim() || !email.trim() || !password.trim())
      return res.status(400).send('All fields are required');
    // check if user already exist
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).send('User already exists');
    // create new user
    const user = await User.create({
      name,
      email,
      password,
    });
    if (!user) return res.status(400).send('User not created');
    // create verification token & save in database
    const token = crypto.randomBytes(32).toString('hex');
    user.verificationToken = token;
    await user.save();
    // send verification email
    sendMail(user.email, token);

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
export const login = async (req, res) => {
  try {
    res.send('login');
  } catch (error) {}
};
