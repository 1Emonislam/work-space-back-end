const { mongoose, Schema } = require('mongoose');
/**
* Billing Model
* @typedef {Object} billingSchema billing Schema
* @property {*} author -  Billing Owner Author
* @property {String} firstName - Billing First Name
* @property {String} billing_id - Billing Trans UID
* @property {String} full_name - Billing Owner Name
* @property {String} email - Billing Owner Email
* @property {String} phone - Billing Owner Phone
* @property {String} paid_amount - Billing Owner Paid Amount
* @property {String} action - Author Action Trigger
* @property {Date} timestamps - Date of Time Capcher
* @function 
 */
const billingSchema = mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, 'Must Assign Ref']
    },
    billing_id: {
        type: String,
        required: [true, 'Please Provide Billing ID']
    },
    full_name: {
        type: String,
        required: [true, 'Please Provide Full Name']
    },
    email: {
        type: String,
        required: [true, 'Please Provide Email']
    },
    phone: {
        type: String,
        required: [true, 'Please Provide Phone Number']
    },
    paid_amount: {
        type: Number,
        required: [true, 'Please Provide Paid Amounts']
    },
    action: {
        type: String,
        enum: ['pending', 'active', 'block'],
        default: 'pending'
    }
}, {
    timestamps: true,
});
const Billing = mongoose.model("Billing", billingSchema);
module.exports = Billing;