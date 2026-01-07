const mongoose = require('mongoose');

const apiKeySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    key: {
        type: String,
        required: true,
        unique: true
    },
    permissions: [{
        type: String,
        enum: ['read', 'write', 'delete', 'admin']
    }],
    rateLimit: {
        requestsPerHour: {
            type: Number,
            default: 100
        },
        currentRequests: {
            type: Number,
            default: 0
        },
        lastReset: {
            type: Date,
            default: Date.now
        }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastUsed: Date,
    usageStats: [{
        date: Date,
        requests: Number,
        endpoint: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ApiKey', apiKeySchema);
