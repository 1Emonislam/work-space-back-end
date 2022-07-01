const Billing = require("../../models/BillingModel");
const User = require("../../models/UserModel");
const { billing_UID_GEN, validateEmail, validation_number } = require("../../utils/func");

/**
 * Billing Data Insert
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @async
 * @function Billing
 * @return {Promise<object>} The data from communicate server.
 */
module.exports.billingCreate = async (req, res, next) => {
    try {
        /**
          * Billing Create Property
          * @typedef {Object} req.body 
          * @property {full_name} full_name - Billing Full Name
          * @property {email} email - Billing Email
          * @property {phone} phone - Billing Phone
          * @property {paid_amount} paid_amount - Billing Paid Amount
          * @property {action} action - Billing Action
          * @property {String} billing_id - Billing ID Gen UID
          * @property {*} author - Billing Owner Author
          * @property {Number} page - query page
          * @property {Number} limit - query limit
          * @property {String} search - query Search
        */
        let { full_name, email, phone, paid_amount, billing_id, action } = req.body;
        billing_id = billing_id ? billing_id : await billing_UID_GEN(10, req?.user?._id);
        if (!(validateEmail(email))) {
            return res.status(400).json({ error: { email: 'Email Invalid! Please provide a valid Email!' } })
        }
        let number = phone && await validation_number(phone);
        if (number?.isValid === false) {
            return res.status(400).json({ error: { phone: 'Invalid Number! Phone Number should be 11 digit' } })
        }
        let { page = 1, limit = 10, status } = req.query;
        page = parseInt(page)
        limit = parseInt(limit)
        const billingCreated = await Billing.create({
            full_name, email, phone, paid_amount, action, billing_id, author: req.user?._id,
        })
        if (billingCreated) {
            const keyword = req.query.search ? {
                action: status || 'pending',
            } : { action: status || 'pending' };
            const billingData = await Billing.aggregate([
                { '$match': keyword },
                { '$sort': { 'updatedAt': -1 } },
                {
                    $facet: {
                        metadata: [
                            {
                                $group: {
                                    _id: await billing_UID_GEN(24, req?.user?._id),
                                    total: { $sum: 1 },
                                    totalAmount: { $sum: "$paid_amount" }
                                }
                            },
                            {
                                $project: {
                                    total: 1,
                                    totalAmount: 1,
                                    page: page,
                                    limit: limit,
                                    hasMore: { $gt: [{ $ceil: { $divide: ["$total", limit] } }, page] }
                                }
                            }
                        ],
                        data: [{ $skip: (page - 1) * limit }, { $limit: 11 }]
                    }
                }
            ])
            return res.status(200).json({ message: 'Billing added Successfully!', billing: billingData?.length && billingData[0] })
        }
        return res.status(400).json({ message: 'Billing created failed!' })
    }
    catch (error) {
        next(error)
    }
}
/**
 * Billing Data Update
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @async
 * @function Billing
 * @return {Promise<object>} The data from communicate server.
 */

module.exports.billingUpdate = async (req, res, next) => {
    try {
        /**
          * Billing Create Property
          * @typedef {Object} req.body 
          * @property {full_name} full_name - Billing Full Name
          * @property {email} email - Billing Email
          * @property {phone} phone - Billing Phone
          * @property {paid_amount} paid_amount - Billing Paid Amount
          * @property {action} action - Billing Action
          * @property {String} billing_id - Billing ID Gen UID
          * @property {*} author - Billing Owner Author
          * @property {Number} page - query page
          * @property {Number} limit - query limit
          * @property {String} search - query Search
        */
        let { page = 1, limit = 10, status } = req.query;
        page = parseInt(page)
        limit = parseInt(limit)
        const exist = await Billing.exists({ _id: req.params?.id?.trim() })
        if (!exist) {
            return res.status(400).json({ error: { billing: 'Billing Not Exists!' } })
        }
        let { full_name, email, phone, paid_amount, action } = req.body;
        paid_amount = Number(paid_amount)
        if (!(validateEmail(email))) {
            return res.status(400).json({ error: { email: 'Email Invalid! Please provide a valid Email!' } })
        }
        let number = phone && await validation_number(phone);
        if (number?.isValid === false) {
            return res.status(400).json({ error: { phone: 'Invalid Number! Phone Number should be 11 digit' } })
        }
        const billing_id = await billing_UID_GEN(10, req?.user?._id);
        const billingUpdate = await Billing.findOneAndUpdate({ _id: req.params?.id?.trim() }, {
            full_name, email, phone, paid_amount, action, billing_id
        }, { new: true })
        if (!billingUpdate) {
            return res.status(400).json({ message: 'Billing Update Failed!', billing_id: billingUpdate?._id })
        } else {
            const keyword = req.query.search ? {
                action: status || 'pending',
            } : { action: status || 'pending' };
            const billingData = await Billing.aggregate([
                { '$match': keyword },
                { '$sort': { 'updatedAt': -1 } },
                {
                    $facet: {
                        metadata: [
                            {
                                $group: {
                                    _id: await billing_UID_GEN(24, req?.user?._id),
                                    total: { $sum: 1 },
                                    totalAmount: { $sum: "$paid_amount" }
                                }
                            },
                            {
                                $project: {
                                    total: 1,
                                    totalAmount: 1,
                                    page: page,
                                    limit: limit,
                                    hasMore: { $gt: [{ $ceil: { $divide: ["$total", limit] } }, page] }
                                }
                            }
                        ],
                        data: [{ $skip: (page - 1) * limit }, { $limit: limit }]
                    }
                }
            ])
            return res.status(200).json({ message: 'Billing Update Successfully!', billing: billingData?.length && billingData[0] })
        }
    }
    catch (error) {
        next(error)
    }
}
module.exports.billingSearching = async (req, res, next) => {
    try {
        /**
          * Billing Create Property
          * @typedef {Object} req.body 
          * @property {full_name} full_name - Billing Full Name field Searching
          * @property {email} email - Billing Email field Searching
          * @property {phone} phone - Billing Phone field Searching
          * @property {action} action - Billing Action field Searching
          * @property {String} billing_id - Billing ID Gen UID field Searching
          * @property {*} author - Billing Owner Author field Searching
          * @property {Number} page - query page field Searching
          * @property {Number} limit - query limit field Searching
          * @property {String} search - query Search field Searching
        */
        let { page = 1, limit = 10, status } = req.query;
        page = parseInt(page)
        limit = parseInt(limit)
        const keyword = req.query.search ? {
            $or: [
                { full_name: { $regex: req.query.search, $options: "i" } },
                { email: { $regex: req.query.search, $options: "i" } },
                { phone: { $regex: req.query.search, $options: "i" } },
                { billing_id: { $regex: req.query.search, $options: "i" } },
                { action: { $regex: status || req.query.search, $options: "i" } },
            ],
        } : { action: status || 'pending' };
        const billingData = await Billing.aggregate([
            { '$match': keyword },
            { '$sort': { 'updatedAt': -1 } },
            {
                $facet: {
                    metadata: [
                        {
                            $group: {
                                _id: await billing_UID_GEN(24, req?.user?._id),
                                total: { $sum: 1 },
                                totalAmount: { $sum: "$paid_amount" }
                            }
                        },
                        {
                            $project: {
                                total: 1,
                                totalAmount: 1,
                                page: page,
                                limit: limit,
                                hasMore: { $gt: [{ $ceil: { $divide: ["$total", limit] } }, page] }
                            }
                        }
                    ],
                    data: [{ $skip: (page - 1) * limit }, { $limit: limit }]
                }
            }
        ])
        return res.status(200).json({ message: 'Billing Getting Successfully!', billing: billingData?.length && billingData[0] })
    }
    catch (error) {
        next(error)
    }
}

module.exports.billingDelete = async (req, res, next) => {
    try {
        let { page = 1, limit = 10, status } = req.query;
        page = parseInt(page)
        limit = parseInt(limit)
        const exist = await Billing.exists({ _id: req.params?.id?.trim() })
        if (!exist) {
            return res.status(400).json({ error: { billing: 'Billing not exists!' } })
        }
        if (exist) {
            const removed = await Billing.findOneAndRemove({ _id: req.params?.id?.trim() })
            if (!removed) {
                return res.status(400).json({ error: { billing: 'Billing Remove Failed!' } })
            }
            const keyword = req.query.search ? {
                action: status || 'pending',
            } : { action: status || 'pending' };
            const billingData = await Billing.aggregate([
                { '$match': keyword },
                { '$sort': { 'updatedAt': -1 } },
                {
                    $facet: {
                        metadata: [
                            {
                                $group: {
                                    _id: await billing_UID_GEN(24, req?.user?._id),
                                    total: { $sum: 1 },
                                    totalAmount: { $sum: "$paid_amount" }
                                }
                            },
                            {
                                $project: {
                                    total: 1,
                                    totalAmount: 1,
                                    page: page,
                                    limit: limit,
                                    hasMore: { $gt: [{ $ceil: { $divide: ["$total", limit] } }, page] }
                                }
                            }
                        ],
                        data: [{ $skip: (page - 1) * limit }, { $limit: limit }]
                    }
                }
            ])
            return res.status(200).json({ message: 'Billing Update Successfully!', billing: billingData?.length && billingData[0] })
        }
    }
    catch (error) {
        next(error)
    }
}
