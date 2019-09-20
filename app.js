const _config = require('./config')

class App{
	constructor(){}

	async init(){
		try {
			console.log("Initializing Database...")
			await require('./db/Mongoose').getInstance().connect()
			console.log("Initializing Redis...")
			await require('./db/Redis').getStaticInstance().initialize()
			console.log("Starting server...")
			await require('./server').getStaticInstance().init()
			console.log("Setup Complete!")
		} catch (error) {
			console.error( error )
		}
	}
}

const app = new App()
app.init()