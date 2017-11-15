import jwt from 'jsonwebtoken'
import fs from 'fs'
import hash from 'jshashes'
const {ObjectId} = require('mongoose').Types


const alg = new hash.SHA256
const tokenDuration = '2d'

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
export const createToken = (payload, options) => 
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
export const validateToken = (token, options) => {
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
export const hashPassword = password => alg.hex(password)

/**
 * Creates a mongoose ObjectId from hex string.
 * @param {String} id 	- 24 character hex string.
 * 
 * @return ObjectId
 */
export const inflateId = id => ObjectId.createFromHexString(id)

/**
 * Checks if given value is a 24 character hex.
 * @param {String} val 	- Value to check.
 * 
 * @return {bool}
 */
export const isHex = val => {
	const reg = new RegExp(/^[0-9a-f]{24}$/i)
	return reg.test(val)
}


/**
 * Creates a new json webt token with the expiray date set to the value
 * in the expiresIn constant.
 *  
 * @param {String} _id 		- User Id string
 * @param {String} ua		- User agent string
 * 
 * @return {Object}
 */
export const createApiToken = (_id, ua, expiresIn=tokenDuration) => ({token: createToken({_id, ua}, {expiresIn})})
