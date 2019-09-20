const crypto = require("crypto")
const jwt = require('jsonwebtoken');

const db = require('../../db/Mongoose').getInstance()
const UserModel = require('../../models/user.model')
const message = require('../../messages')
const _config = require('../../config')
const loginValidator = require('./Validators/login.validator')

const login = async ( req, res, next ) => {
	try {
		const {name:name, password:password} = req.body
		const providedPassword = crypto.createHash('sha256').update(password).digest('hex');

		const user = await db.findOne( UserModel, {
			name: name
		});

		if( !user ) {
			// no user found with that name
			return res.json({
				status: 400,
				data: {},
				message: message.USER_NOT_FOUND
			})
		}

		if( user.password != providedPassword ) {
			//incorrect password
			return res.json({
				status: 400,
				data: {},
				message: message.INCORRECT_PASSWORD
			})
		}

		//update the token for the user
		const token = jwt.sign({ userId: user._id }, _config.JWT_KEY, { expiresIn: '5h' });
		await db.update( UserModel, {_id: user._id}, {token: token})
		//success
		return res.json({
			status:200,
			data: {
				userId: user._id,
				token: token
			},
			message: "success"
		})

	} catch ( error ) {
		next(error)
	}
}

const validateToken = async ( req, res, next ) => {
	try {
		const {authorization:tokenArray} = req.headers
		//check if token was provided or not .//Remove Bearer from token 
		let token = tokenArray.split(" ")
		token = (token.length > 1 ) ? token[1] : null

		if( !token ) {
			return res.json({
				status: 400,
				data: {},
				message: message.AUTH_TOKEN_NEEDED
			})
		}

		//verify the token
		var decoded = jwt.verify(token, _config.JWT_KEY)

		if( !decoded.userId ) {
			//error in decoding
			return res.json({
				status: 400,
				data: {},
				message: message.INVALID_TOKEN
			})
		}

		const user = await db.findOne( UserModel, {
			_id: decoded.userId
		});

		if( !user ) {
			// no user found with that name
			return res.json({
				status: 400,
				data: {},
				message: message.USER_NOT_FOUND
			})
		}

		if( user.token !== token ) {
			// no user found with that name
			return res.json({
				status: 400,
				data: {},
				message: message.TOKEN_EXPIRED
			})
		}

		//appending user in request
		req.user = {
			_id: user._id
		}

		next();
	} catch( error ) {
		next( error )
	}
}

const verifyUser = async ( data ) => {
	try {
		const {token:token} = data
		//check if token was provided or not
		if( !token ) {
			return false
		}

		//verify the token
		var decoded = jwt.verify(token, _config.JWT_KEY)
		

		if( !decoded.userId ) {
			//error in decoding
			return false
		}
		
		const user = await db.findOne( UserModel, {
			_id: decoded.userId
		});

		if( !user ) {
			// no user found with that name
			return false
		}

		if( user.token != token ) {
			// no user found with that name
			return false
		}

		return decoded.userId
	} catch( error ) {
		return false
	}
}

module.exports = {
	login,
	validateToken,
	verifyUser,
	loginValidator
}
