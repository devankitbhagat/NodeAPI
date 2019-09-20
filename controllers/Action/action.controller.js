const db = require('../../db/Mongoose').getInstance()
const redis = require('../../db/Redis').getStaticInstance()
const socketHelper = require('../../util/eventHelper').getStaticInstance()
const postValidator = require('./Validators/post.validator')

const UserModel = require('../../models/user.model')
const ActionModel = require('../../models/action.model')

const post = async ( req, res, next ) => {
	try{
		const {user:user} = req
		const {actionType:actionType, userId:userId} = req.body

		//saving the action, for matching/blocking
		await db.save( ActionModel, {
			userId: user._id,
			onUserId: userId,
			actionType: actionType
		})

		const socketId = await redis.get(userId)
		//If user is connected than only socket id will be present
		if( socketId ) {
			//getting user info, user info will be broadcasted to other user
			const userInfo = await db.findOne( UserModel, {
				_id: user._id
			})
			//always name will be sent
			let data = { name: userInfo.name }
			//If super like than image will also be sent
			if ( actionType === 'super_like' ) 
				data['profileImage'] = (userInfo.profileImage) ? userInfo.profileImage : ""

			socketHelper.brodcastToSocket( "new_like", socketId, data )
		}

		return res.json({
			status:200,
			data: {},
			message: "success"
		})

	} catch( error ) {
		next(error)
	}
}

module.exports = {
	post,
	postValidator
}
