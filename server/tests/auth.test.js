const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const app = require('../app');
const User = require('../models/user.model');
const { clearDatabase } = require('../utils/mongoose.utils');
const { JWT_SECRET } = require('../config/config');

after(async () => {
  await clearDatabase();
});

describe('## Auth APIs', () => {

  afterEach(async () => {
    await User.deleteMany({});
  });

  describe('# POST /api/auth/register', () => {
    describe('with valid user credentials', () => {
      it('should create new user valid token', async () => {
        const validUserCredentials = {
          email: 'foobar@gmail.com',
          password: 'foobar123',
        }
        const response = await request(app)
          .post('/api/auth/register')
          .send(validUserCredentials);
        
        const { user, token } = response.body;
        const decoded = jwt.verify(token, JWT_SECRET);
  
        expect(response.status).to.equal(httpStatus.CREATED);
        expect(user.email).to.equal(validUserCredentials.email)
        expect(user).to.not.have.property('password')
        expect(decoded.email).to.equal(validUserCredentials.email)
        expect(decoded).to.not.have.property('password')
      });
    })

    describe('with no email', () => {
      it('should return authentication error', async () => {
        const invalidUserCredentials = {
          email: '',
          password: 'foobar123',
        }
        const response = await request(app)
          .post('/api/auth/register')
          .send(invalidUserCredentials);
  
        expect(response.status).to.equal(httpStatus.BAD_REQUEST);
      });
    })

    describe('with invalid email', () => {
      it('should return authentication error', async () => {
        const invalidUserCredentials = {
          email: 'foo',
          password: 'foobar123',
        }
        const response = await request(app)
          .post('/api/auth/register')
          .send(invalidUserCredentials);

        expect(response.status).to.equal(httpStatus.BAD_REQUEST);
      });
    });

    describe('with no password', () => {
      it('should return authentication error', async () => {
        const invalidUserCredentials = {
          email: 'foobar@gmail.com',
          password: '',
        }
        const response = await request(app)
          .post('/api/auth/register')
          .send(invalidUserCredentials);

        expect(response.status).to.equal(httpStatus.BAD_REQUEST);
      });
    });
    
    describe('with too short password', () => {
      it('should return authentication error', async () => {
        const invalidUserCredentials = {
          email: 'foobar@gmail.com',
          password: 'foo',
        }
        const response = await request(app)
          .post('/api/auth/register')
          .send(invalidUserCredentials);

        expect(response.status).to.equal(httpStatus.BAD_REQUEST);
      });
    });

    describe('with existing email', () => {
      it('should return authentication error', async () => {
        const validUserCredentials = {
          email: 'foobar@gmail.com',
          password: 'foobar123',
        }
        const firstRegisterResponse = await request(app)
          .post('/api/auth/register')
          .send(validUserCredentials);

        expect(firstRegisterResponse.status).to.equal(httpStatus.CREATED);

        const invalidUserCredentials = {
          email: 'foobar@gmail.com',
          password: 'foobar123',
        }
        const secondRegisterResponse = await request(app)
          .post('/api/auth/register')
          .send(invalidUserCredentials);

        expect(secondRegisterResponse.status).to.equal(httpStatus.UNAUTHORIZED);
      });
    });    
  });

  describe('# POST /api/auth/login', () => {
    describe('with valid user credentials', () => {
      it('should create new user valid token', async () => {
        const validUserCredentials = {
          email: 'foobar@gmail.com',
          password: 'foobar123',
        }
        const registerResponse = await request(app)
          .post('/api/auth/register')
          .send(validUserCredentials);
  
        expect(registerResponse.status).to.equal(httpStatus.CREATED);

        const loginResponse = await request(app)
          .post('/api/auth/login')
          .send(validUserCredentials);

        const { token } = loginResponse.body;
        const decoded = jwt.verify(token, JWT_SECRET);

        expect(loginResponse.status).to.equal(httpStatus.OK);
        expect(decoded.email).to.equal(validUserCredentials.email)
        expect(decoded).to.not.have.property('password')
      });
    })

    describe('with non-existing email', () => {
      it('should return authentication error', async () => {
        const invalidUserCredentials = {
          email: 'doesnt@exist.com',
          password: 'foobar123',
        }
        const response = await request(app)
          .post('/api/auth/login')
          .send(invalidUserCredentials);
  
        expect(response.status).to.equal(httpStatus.NOT_FOUND);
      });
    })

    describe('with incorrect password', () => {
      it('should return authentication error', async () => {
        const validUserCredentials = {
          email: 'foobar@gmail.com',
          password: 'foobar123',
        }
        const registerResponse = await request(app)
          .post('/api/auth/register')
          .send(validUserCredentials);
  
        expect(registerResponse.status).to.equal(httpStatus.CREATED);

        const invalidUserCredentials = {
          email: 'foobar@gmail.com',
          password: 'wrongpassword',
        }        

        const loginResponse = await request(app)
          .post('/api/auth/login')
          .send(invalidUserCredentials);

        expect(loginResponse.status).to.equal(httpStatus.UNAUTHORIZED);
      });
    })
  });  
});
