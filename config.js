const config = {}

config.PORT = 3000
config.MONGO_URI = "mongodb://localhost:27017/quillhash"
config.JWT_KEY = "mySecret"
config.REDIS_HOST = "127.0.0.1"
config.REDIS_PORT = 6379
config.PAGE_LIMIT = 10

module.exports = config