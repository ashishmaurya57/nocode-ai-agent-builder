import User from '../models/User.js';

export const registerUser = async (req, res) => {
  try {
    const { uid, email } = req.user;
    
    const existingUser = await User.findOne({ uid });
    if (existingUser) {
      return res.status(200).json(existingUser);
    }

    const newUser = new User({
      uid,
      email
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
};