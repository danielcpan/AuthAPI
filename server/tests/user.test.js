const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const app = require('../app');
const User = require('../models/user.model');
const { clearDatabase } = require('../utils/mongoose.utils');
const { JWT_SECRET } = require('../config/config');

describe('## users APIs', () => {
  let user;
  let userToken;

  before(async () => {
    await clearDatabase();

    const validUserCredentials = {
      email: 'foobar@gmail.com',
      password: 'foobar123',
    }
    const response = await request(app)
      .post('/api/auth/register')
      .send(validUserCredentials);

    user = response.body.user;
    userToken = response.body.token
  });

  describe('# GET /api/users/me', () => {
    describe('with valid token', () => {
      it('should return current user', async () => {
        const response = await request(app)
          .post('/api/users/me')
          .set('Authorization', `Bearer ${userToken}`)

        expect(response.status).to.equal(httpStatus.OK);
        expect(response.body.user._id).to.equal(user._id);
      });
    })

    describe('with invalid token', () => {
      it('should return authentication error', async () => {
        const response = await request(app)
          .post('/api/users/me')
          .set('Authorization', `Bearer wrongtoken`)

        expect(response.status).to.equal(httpStatus.BAD_REQUEST);
      });
    })
  });

  describe('# GET /api/users/:userId', () => {
    describe('with valid token', () => {
      it('should return current user', async () => {
        const response = await request(app)
          .post(`/api/users/${user._id}`)
          .set('Authorization', `Bearer ${userToken}`)

        expect(response.status).to.equal(httpStatus.OK);
        expect(response.body.user._id).to.equal(user._id);
      });
    })

    describe('with invalid token', () => {
      it('should return authentication error', async () => {
        const response = await request(app)
          .post(`/api/users/${user_id}`)
          .set('Authorization', `Bearer wrongtoken`)

        expect(response.status).to.equal(httpStatus.BAD_REQUEST);
      });
    })
  });  
});
