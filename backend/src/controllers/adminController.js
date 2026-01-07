const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Monitor API usage (Mock)
// @route   GET /api/admin/usage
// @access  Private/Admin
const getUsage = async (req, res) => {
    res.json({
        totalRequests: 1250,
        apiCalls: {
            coinGecko: 450,
            internal: 800
        },
        activeUsers: 45
    });
};

module.exports = {
    getUsers,
    getUsage
};
