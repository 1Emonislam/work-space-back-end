const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
/**
 * Returns x raised to the n-th power.
 * @param  {*} req
 * @param  {*} res
 * @param  {*} next
 * @param {String} 
 * @param  {String} Bearer token
 * @return  {*} atuhenticate
 */
const protect = async (req, res, next) => {
    let token;
    // console.log(token)
    if (req.headers.authorization && req.headers.authorization?.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            if (!token) {
                return res.status(401).json({ error: { token: "no token!" } });
            }
            // console.log(token)
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findOne({ _id: decoded.id }).select("-password");
            if (!user) {
                return res.status(400).json({ error: { user: 'Please Login Before access this page!' } })
            }
            if (user?.action === 'block') {
                return res.status(400).json({ error: { user: 'Permission Denied Blocked User' } })
            }
            // console.log(user)
            req.user = user;

            next();
        } catch (error) {
            return res.status(401).json({ error: { token: `Not authorized token failed!` } });
        }
    } else {
        return res.status(401).json({ error: { token: "No token!" } });
    }
};
module.exports = { protect };