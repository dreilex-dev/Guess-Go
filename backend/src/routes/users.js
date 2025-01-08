const express = require('express');
const User = require('../models/User');

const router = express.Router();

// Middleware - validate lobby creation
function validateCreateLobby(req, res, next) {
  const { name, question1, question2 } = req.body;
  if (!name || !question1 || !question2) {
    return res.status(400).json({ error: 'Missing required fields for creating a lobby' });
  }
  next();
}

// Middleware - validate join lobby
function validateJoinLobby(req, res, next) {
  const { name, question1, question2, lobbyCode } = req.body;
  if (!name || !question1 || !question2 || !lobbyCode) {
    return res.status(400).json({ error: 'Missing required fields for joining a lobby' });
  }
  next();
}

// Add user
router.post('/', async (req, res) => {
  try {
    const { name, question1, question2, avatar, lobbyCode } = req.body;

    if (!name || !question1 || !question2 || !lobbyCode) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const user = new User({ name, question1, question2, avatar, lobbyCode });
    await user.save();
    res.status(201).json({ message: 'User added successfully', user });
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ error: 'Error adding user' });
  }
});

// Create a lobby
router.post('/create-lobby', validateCreateLobby, async (req, res) => {
  try {
    const { name, question1, question2, avatar } = req.body;

    // Generate lobby code
    let lobbyCode;
    do {
      lobbyCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    } while (await User.findOne({ lobbyCode, isCreator: true }));

    const user = new User({
      name,
      question1,
      question2,
      avatar,
      lobbyCode,
      isCreator: true, // Set user as lobby creator
    });

    await user.save();

    res.status(201).json({
      message: 'Lobby created successfully',
      lobbyCode, //Send back the lobby code
      user,
    });
  } catch (error) {
    console.error('Error creating lobby:', error);
    res.status(500).json({ error: 'Error creating lobby' });
  }
});

// Join an existing lobby
router.post('/join-lobby', validateJoinLobby, async (req, res) => {
  try {
    const { name, question1, question2, avatar, lobbyCode } = req.body;

    // Check if lobby exists
    const lobby = await User.findOne({ lobbyCode, isCreator: true });
    if (!lobby) {
      return res.status(404).json({ error: 'Lobby not found' });
    }

    const user = new User({
      name,
      question1,
      question2,
      avatar,
      lobbyCode,
      isCreator: false,
    });

    await user.save();

    res.status(201).json({
      message: 'Joined lobby successfully',
      user,
    });
  } catch (error) {
    console.error('Error joining lobby:', error);
    res.status(500).json({ error: 'Error joining lobby' });
  }
});

// Leave a lobby
router.post('/leave-lobby', async (req, res) => {
  try {
    const { userId, lobbyCode } = req.body;

    if (!userId || !lobbyCode) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Search user in the database
    const user = await User.findOne({ _id: userId, lobbyCode });
    if (!user) {
      return res.status(404).json({ error: 'User not found in this lobby' });
    }

    // Delete user from lobby
    await User.deleteOne({ _id: userId });

    // Check if the user is the lobby creator
    if (user.isCreator) {
      // Delete all the users from the lobby.
      await User.deleteMany({ lobbyCode });
      return res.status(200).json({
        message: 'Lobby closed because the creator left',
      });
    }

    res.status(200).json({
      message: 'User left the lobby successfully',
    });
  } catch (error) {
    console.error('Error leaving lobby:', error);
    res.status(500).json({ error: 'Error leaving lobby' });
  }
});


// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Error fetching users' });
  }
});

module.exports = router;
