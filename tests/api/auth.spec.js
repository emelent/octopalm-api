import test from 'tape'
import request from 'supertest'
import app from '../../src/routers'

test('Dummy test for dummy route', function (t) {
	request(app)
		.get('/hello')
		.expect(200)
		.expect('Content-Type', /json/)
		.expect('"Well, hello there in Tibet."')
		.end((err, res) => {
			t.error(err, 'No error')
			t.end()
		})
});