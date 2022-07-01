/**
 * @param  {Object} "../../models/UserModel"
 */
const User = require("../../models/UserModel");
const { validation_number, generateUniqueAccountName, validateEmail, checkPassword } = require("../../utils/func");
const { genToken } = require("../../utils/genToken");

/**
 * void function express
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @async
 * @function userLogin
 * @return {Promise<object>} The data from communicate server.
 */
module.exports.userLogin = async (req, res, next) => {
  /**
  * User Login Property 
  * @property {String} email - User Email
  * @property {String} username - User username
  * @property {String} phone - User Phone
  */
  const email = req?.body?.email?.toLowerCase();
  const phone = req?.body?.phone;
  const username = req?.body?.username?.toLowerCase();
  const password = req?.body?.password;
  //console.log(req.body)
  if (!(email || phone || username)) {
    return res.status(400).json({ error: { "user": "Could not find user Please provide Email or Phone Number or UserName" } })
  }
  let user = await User.findOne({ username: username }) ? await User.findOne({ username: username }) : await User.findOne({ email: email })
  if (!user) {
    user = await User.findOne({ phone: phone })
  }
  // console.log(user)
  try {
    if (!user) {
      return res.status(400).json({ error: { "email": "Could not find user" } })
    }
    if (!(user && (await user.matchPassword(password)))) {
      return res.status(400).json({ error: { "password": "Password invalid! please provide valid password!" } });
    } else if (user && (await user.matchPassword(password))) {
      const resData = await User.findOne({ _id: user?._id }).select("-password");
      const userData = resData?.toObject()
      userData.jwtToken = genToken(resData?._id);
      return res.status(200).json({
        message: 'Login Successfully',
        loggedUser: userData
      });
    }
  }
  catch (error) {
    next(error)
  }
}

/**
 * User Register
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @async
 * @function userRegister
 * @return {Promise<object>} The data from communicate server.
 */

module.exports.userRegister = async (req, res, next) => {
  /**
  * User Register Property
  * @typedef {Object} req.body 
  * @property {String} email - User Email
  * @property {String} firstName - User First Name
  * @property {String} lastName - User Last Name
  * @property {String} phone - User Phone
  * @property {String} birthDate - User Birth Date
  * @property {String} nickName - User Nick Name
  * @property {String} about - User About
  * @property {String} gender - User Gender
  * @property {String} password - User Password
  * @property {String} address - User Address
  * @property {String} information - User information
  * @property {String} username - User username
  * @property {Object} issue - User all issues
  * @function 
   */
  try {
    let { email, firstName, lastName, phone, birthDate, nickName, pic, about, gender, password } = req.body;
    const latitude = req?.body?.location?.latitude || 0;
    const longitude = req?.body?.location?.longitude || 0;
    const address = req?.body?.location?.address;
    const information = req?.body?.location?.information;
    const username = (firstName + lastName)?.toString();
    const issue = {}
    let number = phone && await validation_number(phone);
    if (number?.isValid === false) {
      issue.phone = 'Invalid Number! Phone Number should be 11 digit'
    }
    const userExist = await User.findOne({ email });
    const phoneExist = await User.findOne({ phone: number?.phone });

    if (!(checkPassword(password))) {
      issue.password = 'Password should contain min 8 letter password, with at least a symbol, upper and lower case'
    }
    if (password !== password) {
      issue.password2 = 'Password Do Not Matched!'
    }
    if (userExist) {
      issue.email = 'user Already exists!'
    }
    if (!(validateEmail(email))) {
      issue.email = 'Email Invalid! Please provide a valid Email!'
    }
    if (phoneExist) {
      issue.phone = 'This phone number is linked to another account, please enter another number.'
    }
    if (Object.keys(issue)?.length) {
      return res.status(400).json({ error: issue })
    }
    const userName = await generateUniqueAccountName(username);
    if (!(phoneExist || userExist)) {
      const user = await User.create({
        username: userName,
        password,
        firstName, lastName, email, phone: number?.phone, nickName, gender, birthDate, about, pic, location: { latitude, longitude, address, information }, geometry: { type: "Point", "coordinates": [Number(longitude), Number(latitude)] }
      });
      const resData = await User.findOne({ _id: user._id }).select("-password");
      const userData = resData?.toObject()
      userData.jwtToken = genToken(resData?._id);
      return res.status(201).json({
        message: 'Registration Successfully',
        loggedUser: userData,
      });
    }
  } catch (error) {
    next(error);
  }
};