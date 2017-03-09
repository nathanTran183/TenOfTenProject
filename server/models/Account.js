const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const utils = require('../helpers/utils');
var uniqueValidator = require('mongoose-unique-validator');
/**
 * User Schema
 */
const AccountSchema = new mongoose.Schema({
    _id: {
        type: String,
        index: {unique: true},
        required: true,
        default: utils.getUUID
    },
    username: {
        type: String,
        required: [true,'username is required'],
        unique: [true,'username cannot be duplicated']
    },
    email: {
        type: String,
        required: [true,'email is required'],
        unique: [true,'email cannot be duplicated']
    },
    password: {
        type: String,
        required: [true,'password is required'],
    },
    e_verified: {
        type: Boolean,
        default: false
    },
    phone: {
        type: String,
        unique: [true,'phone number cannot be duplicated'],
        required: [true,'phone number is required'],
    },
    role: {
        type: String,
        required: false
    },
    created_at: {
        type: Date,
        required: [true,'created date is required'],
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
        utils.saltAndHash(this.password, function(err, password){
            if(err) return next(err);
            me.password = password;
            next();
        });
    }
    else
    next();
});

/**
 * Methods
 */
AccountSchema.method({
    validatePassword(password) {
        return bcrypt.compare(password, this.password);
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
                console.log(err);
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

                const err = new APIError('No such user exists with this username!', httpStatus.NOT_FOUND);
                return Promise.reject(err.message);
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
AccountSchema.plugin(uniqueValidator);
/**
 * @typedef User
 */
module.exports = mongoose.model('Account', AccountSchema);
