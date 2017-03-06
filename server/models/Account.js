const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const bcrypt = require('bcrypt');

/**
 * User Schema
 */
const AccountSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    e_verified: {
        type: Boolean,
        default: false
    },
    phone: {
        type: String,
        unique: true,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now
    },

});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
AccountSchema.pre('save', function (next) {
    var me = this,
        error;
    if (me.isModified('password')) {
        me.password = me.generateHash(me.password);
    }
    next();
});

/**
 * Methods
 */
AccountSchema.method({
    validatePassword(password) {
        return bcrypt.compare(password, this.password);
    },

    generateHash(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    }
});

/**
 * Statics
 */
AccountSchema.statics = {
    /**
     * Get user
     * @param {ObjectId} id - The objectId of user.
     * @returns {Promise<User, APIError>}
     */
    getById(id) {
        return this.findById(id)
            .exec()
            .then((account) => {
                if (account) {
                    return account;
                }
                const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
                return Promise.reject(err);
            });
    },

    getByUsername(username) {
        return this.findOne({'username': username})
            .exec()
            .then((account) => {
                if (account) {
                    return account;
                }
                const err = new APIError('No such user exists with this username!', httpStatus.NOT_FOUND, true);
                return Promise.reject(err);
            });
    },

    /**
     * List users in descending order of 'createdAt' timestamp.
     * @param {number} skip - Number of users to be skipped.
     * @param {number} limit - Limit number of users to be returned.
     * @returns {Promise<User[]>}
     */
    list({skip = 0, limit = 50} = {}) {
        return this.find()
            .sort({createdAt: -1})
            .skip(skip)
            .limit(limit)
            .exec();
    },


};

/**
 * @typedef User
 */
module.exports = mongoose.model('Account', AccountSchema);
