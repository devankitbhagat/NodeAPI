const redis = require("redis"),
      _config = require("../config");

let staticInstance = null,
    MAX_RETRY_CONNECT = 3,
    connectionRetryCount = 0;

class Redis {
  constructor() {
    try {
      this.initialize()
    } catch( err ) {
      console.log( "REDIS :: COULD NOT CONNECT ", err);
    }
  }

  static getStaticInstance() {
    if( staticInstance == null ) {
      staticInstance = new Redis()
    }
    return staticInstance;
  }

  initialize() {
    return new Promise(( resolve, reject ) => {
      this.client = redis.createClient({
        host: _config.REDIS_HOST,
        port: _config.REDIS_PORT,
        retry_strategy: function (options) {
          if (options.error && options.error.code === 'ECONNREFUSED') {
              // End reconnecting is connection is refused
              console.log("REDIS :: COULD NOT CONNECT ", options.error);
              return new Error('Connection Refused');
          }
          if (options.total_retry_time > 1000 * 60 * 60) {
              // End reconnecting after a specific timeout and flush all commands
              // with a individual error
              console.log("REDIS :: Retry time exhausted");
              return new Error('Retry time exhausted');
          }
          if (options.attempt > MAX_RETRY_CONNECT) {
              // End reconnecting with built in error
              console.log("REDIS :: Stopped Reconnecting");
              return undefined;
          }
          // reconnect after
          return Math.min(options.attempt * 100, 3000);
        }
      });

      this.client.on('error', function (err) {
        console.log("REDIS :: error! ", err);
        console.log("REDIS :: Reconnect try remaining", MAX_RETRY_CONNECT - connectionRetryCount);
        if( connectionRetryCount < MAX_RETRY_CONNECT ) {
          try {
            this.initialize()
          } catch( err ) {
            console.log( "REDIS :: COULD NOT CONNECT ", err);
            reject()
          }
        }
      });

      this.client.on('ready', function (err) {
        console.log("REDIS :: connected!");
        resolve()
      });
    })
  }

  set( key, value ) {
    if( !this.client.connected ) {
      return false;
    }
    //set this key only for max 1 hour, 3600 seconds
    this.client.set( key, value, 'EX', 3600 );
    return true;
  }

  get( key ) {
    return new Promise( ( resolve, reject ) => {
      if( !this.client.connected ) {
        return reject("NOT CONNECTED")
      }

      this.client.get( key, function ( err, value ){
        if (err)  {
          return reject(err)
        }
        resolve(value);
      })
    })
  }

}

module.exports = Redis
