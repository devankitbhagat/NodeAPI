let staticInstance = null
const _config = require('./config')

class Server {
	constructor( port ){
		this.app = require('express')()
		this.http = require('http').Server(this.app)
		this.io = require('socket.io')(this.http)
		require('./util/eventHelper').getStaticInstance(this.io)
		let bodyParser = require('body-parser')
		this.app.use( bodyParser.json() )
		this.app.use( bodyParser.urlencoded({extended: true}) )
		this.app.set("io", this.io)
		this.port = port
	}

	static getStaticInstance( ){
		if( staticInstance === null ) {
			staticInstance = new Server( _config.PORT )
		}
		return staticInstance
	}

	async init(){
		try {
			const authController = require('./controllers/Auth/auth.controller')
			const userController = require('./controllers/User/user.controller')
			const actionController = require('./controllers/Action/action.controller')
			const validateParam = require('./util/validateParam')
			const redis = require('./db/Redis').getStaticInstance()

			this.http.listen(this.port)

			//Initialize all routes
			this.app.post(
				'/users',
				[userController.createValidator, validateParam],
				userController.create
			)

			this.app.post(
				'/login',
				[authController.loginValidator, validateParam],
				authController.login
			)

			this.app.post(
				'/block',
				[authController.validateToken, userController.blockValidator, validateParam ],
				userController.block
			)

			this.app.get(
				'/users',
				[authController.validateToken, userController.getListValidator, validateParam ],
				userController.getList
			)

			this.app.post(
				'/actions',
				[authController.validateToken, actionController.postValidator, validateParam ],
				actionController.post
			)

			this.app.get('/socket', (req, res) => {
				res.sendFile(__dirname + '/static/test.html');
			});

			//saving user socket id to redis
			this.io.on('connection', async (socket) => {
				const userId = await authController.verifyUser(socket.handshake.query)
				if( userId ) {
					redis.set( userId, socket.id )
				} else {
					socket.disconnect()
				}
			})
		
			//handle all errors
			this.app.use((err, req, res, next) => {
				console.log(err)
				if (res.headersSent) {
					next(err);
					return;
				}
				const message = ( err.message ) ? err.message : "Something went wrong"
				res.json({
					status: 500,
					data: {},
					message: message,
					errors: (err.errors) ? err.errors: err
				})
			})

			//handle invalid routes
			this.app.all("*", (req,res,next) => {
				res.json({
					status: 300,
					data: {},
					message: "Route not found",
				})
			})

		} catch ( error ) {
			throw error
		}
	}

	getApp() {
		return this.app
	}
}

module.exports = Server
