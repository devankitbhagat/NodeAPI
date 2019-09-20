const crypto = require("crypto")

const _config = require("../../config")
const db = require('../../db/Mongoose').getInstance()
const UserModel = require('../../models/user.model')
const blockValidator = require('./Validators/block.validator')
const createValidator = require('./Validators/create.validator')
const getListValidator = require('./Validators/getList.validator')

const create = async ( req, res, next ) => {
	try{
		const {name:name, password:password} = req.body
		const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
		//save user
		const user = await db.save( UserModel, {
			name: name,
			password: hashedPassword
		})

		return res.json({
			status:200,
			data: {
				userId: user._id,
			},
			message: "success"
		})
	} catch( error ) {
		next(error)
	}
}

const block = async ( req, res, next ) => {
	try{
		const {user:user} = req
		const {userId:userId} = req.body

		//add to blocked list
		const updatedUser = await db.rawUpdate( UserModel, {_id: userId}, {$push: {blockedBy: user._id}})

		return res.json({
			status:200,
			data: {},
			message: "success"
		})

	} catch( error ) {
		next(error)
	}
}

const getList = async ( req, res, next ) => {
	try{
		const {user:user} = req
		const {page: page, limit: limit} = req.body
		let userInfo = await db.findOne( UserModel, { _id: user._id })

		const blockedBy = ( userInfo.blockedBy ) ? userInfo.blockedBy : []
		//avoid getting own record
		blockedBy.push(user._id)
		// get users as paginated docs
		let userList = await db.getPaginated( UserModel, {
			_id: {$nin: blockedBy}
		}, 
		{
			page: (page) ? page : 1,
			limit: (limit)? limit : _config.PAGE_LIMIT,
			select: { 
				name: true, _id: true, profileImage: true 
			}
		})

		return res.json({
			status:200,
			data: {
				users: userList
			},
			message: "success"
		})

	} catch( error ) {
		next(error)
	}
}

module.exports = {
	create,
	block,
	getList,
	blockValidator,
	createValidator,
	getListValidator
}
