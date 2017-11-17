import fs from 'fs'
import path from 'path'

const devEnvPath = path.resolve('.env.development')
const prodEnvPath = path.resolve('.env.production')
const dbPath = path.resolve('data')


// Generate .env files
const dev_env = `
PORT = '5000'
DB_URL = 'mongodb://localhost/mydb'
HOST = '0.0.0.0'
`
// Generate .env files
const prod_env = `
DB_URL = 'mongodb://localhost/mydb'
`

fs.writeFileSync(devEnvPath, dev_env)
fs.writeFileSync(prodEnvPath, prod_env)

try {
	fs.mkdirSync(dbPath)	
} catch (error) {}
