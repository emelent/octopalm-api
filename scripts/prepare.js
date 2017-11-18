import fs from 'fs'
import path from 'path'

const devEnvPath = path.resolve('.env.development')
const prodEnvPath = path.resolve('.env.production')
const testEnvPath = path.resolve('.env.test')
const dbPath = path.resolve('data')


// Generate .env files
const dev_env = `
PORT = '5000'
DB_URL = 'mongodb://localhost/mydb'
HOST = '0.0.0.0'
`
const prod_env = `
DB_URL = 'mongodb://localhost/mydb'
`

const test_local = `
	DB_URL = 'mongodb://localhost/mydb'
`
const test_ci = `
DB_URL = 'mongodb://<dbuser>:<dbpassword>@ds113636.mlab.com:13636/ranga'
`
const isCI = process.env.NODE_ENV === 'ci'
fs.writeFileSync(devEnvPath, dev_env)
fs.writeFileSync(prodEnvPath, prod_env)
fs.writeFileSync(testEnvPath, (isCI)? test_ci:test_local)

try {
	fs.mkdirSync(dbPath)
} catch (error) {}
