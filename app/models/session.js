var mongoose = require('mongoose');

module.exports = mongoose.model('session', {
    userId: {
    	type: String,
    	default: ''
    },

    userName: {
    	type: String,
    	default: ''
    },

    userUserName: {
        type: String,
        default: ''
    }, 

    inTime: {
        type: String,
        default: new Date(Date.now()).toString()
    }
});