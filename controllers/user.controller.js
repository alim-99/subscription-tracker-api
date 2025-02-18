import User from "../models/user.modal.js";
import bcrypt from 'bcryptjs';

export const getUsers = async (req,res, next) => {
  try {
    const users = await User.find();

    res.status(200).json({success: true, data: users});
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if(!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({success: true, data: user});
  } catch (error) {
    next(error);
  }
};


export const createNewUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Input validation
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'User with this email already exists' });
    }

    // Hash the password
    const saltRounds = 10; // Number of salt rounds for bcrypt
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create the new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Respond with the created user (excluding the password for security)
    const userResponse = { ...newUser.toObject() };
    delete userResponse.password;

    res.status(201).json({ success: true, data: userResponse });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const user = await User.findById(id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if(!updates || Object.keys(updates).length === 0) {
      res.status(400).json({
        success: false,
        message: 'No data for the updates'
      });
    }

    Object.keys(updates).forEach((key) => {
      user[key] = updates[key];
    });

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser,
    });

  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const existingUser = await User.findById(req.params.id);
    if (!existingUser) {
      return res.status(404).json({ success: false, message: 'User not exist' });
    }

    const deletedUser = await existingUser.deleteOne();

    res.status(200).json({success: true, message: 'User deleted successfully'});
  } catch(error) {
    next(error);
  }
};