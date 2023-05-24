// packages
const mongoose = require('mongoose');

const chinpokomonSchema = new mongoose.Schema({
    name: {
        type: String
    },
    ability1: {
        type: String
    },
    ability2: {
        type: String
    },
    ability3: {
        type: String
    },
    picture: {
        type: String
    },
    authorName: {
        type: String
    },
    createdAt: {
        type: Number
    }
});

const Chinpokomon = mongoose.model('Chinpokomon', chinpokomonSchema);

module.exports = Chinpokomon;