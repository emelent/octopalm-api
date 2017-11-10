const jwt = require('jsonwebtoken')
const fs = require('fs')
const hash = require('jshashes')
const {ObjectId} = require('mongoose').Types

//hashing algorithm
const alg = new hash.SHA256

//private and public key streams
const privateCert = fs.readFileSync('key.pem')
const publicCert = fs.readFileSync('cert.pem')


/**
 * Creates a signed jwt token with the given payload and options
 * @param {Object} payload 	- Token payload.
 * @param {Object} options 	- Token options.
 * 
 * @return {String}
 */
const createToken = (payload, options) => 
	jwt.sign(payload, privateCert, { algorithm: 'RS256'}, options)

/**
 * Validates the token, returns the decoded payload if the token is
 * valid or null if invalid.
 * 
 * @param {String} token  	- Jwt token.
 * @param {Object} options 	- Validation options.
 * 
 * @return {Object | null}
 */
const validateToken = (token, options) => {
	try{
		return jwt.verify(token, publicCert, options)
	}catch(e){
		//do something with this maybe?
	}
	return null
}

/**
 * Hash a password.
 * @param {String} password 	- Raw password to be hashed.
 */
const hashPassword = password => alg.hex(password)

/**
 * Creates a mongoose ObjectId from hex string.
 * @param {String} id 	- 24 character hex string.
 * 
 * @return ObjectId
 */
const inflateId = id => ObjectId.createFromHexString(id)

/**
 * Checks if given value is a 24 character hex.
 * @param {String} val 	- Value to check.
 * 
 * @return {bool}
 */
const isHex = val => {
	const reg = new RegExp(/^[0-9a-f]{24}$/i)
	return reg.test(val)
}


module.exports = {
	createToken,
	validateToken,
	hashPassword,
	inflateId,
	isHex
}