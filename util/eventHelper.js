'use strict'
let staticInstance = null;

class EventHelper {
	constructor(io) {
		this.io = io
	}

	static getStaticInstance(io = null ) {
		if( staticInstance === null ) {
			staticInstance = new EventHelper(io)
		}
		return staticInstance
	}

	brodcastToSocket( eventName, socketId, data ) {
		this.io.to( socketId ).emit( eventName, data );
	}
}

module.exports = EventHelper