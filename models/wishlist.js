// packages
const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
    items: {
        type: Array
    },
    createdBy: {
        type: String
    },
    createdAt: {
        type: Number
    }
});

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

module.exports = Wishlist;