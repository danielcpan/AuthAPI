const httpStatus = require('http-status');
const app = require('../app');
const { clearDatabase } = require('../utils/mongoose.utils');

after(async () => {
  await clearDatabase();
});

describe('## User APIs', () => {
  let user;
  let userAuthToken;

  before(async () => {
    const validUserCredentials = {
      email: 'foobar@gmail.com',
      password: 'foobar123',
    }

    const response = await request(app)
      .post('/api/auth/register')
      .send(validUserCredentials);

    user = response.body.user;
    userAuthToken = response.body.authToken
  });

  describe('# GET /api/users/me', () => {
    describe('with valid authToken', () => {
      it('should return current user', async () => {
        const response = await request(app)
          .get('/api/users/me')
          .set({ 'Authorization': `Bearer ${userAuthToken}`})

        expect(response.status).to.equal(httpStatus.OK);
        expect(response.body._id).to.equal(user._id);
        expect(response.body).to.not.have.property('password');
      });
    })

    describe('with invalid authToken', () => {
      it('should return authentication error', async () => {
        const response = await request(app)
          .get('/api/users/me')
          .set('Authorization', `Bearer wrongtoken`)

        expect(response.status).to.equal(httpStatus.UNAUTHORIZED);
      });
    })
  });

  describe('# GET /api/users/:userId', () => {
    describe('with valid authToken', () => {
      it('should return current user', async () => {
        const response = await request(app)
          .get(`/api/users/${user._id}`)
          .set('Authorization', `Bearer ${userAuthToken}`)

        expect(response.status).to.equal(httpStatus.OK);
        expect(response.body._id).to.equal(user._id);
        expect(response.body).to.not.have.property('password');
      });
    })

    describe('with invalid authToken', () => {
      it('should return authentication error', async () => {
        const response = await request(app)
          .get(`/api/users/${user._id}`)
          .set('Authorization', `Bearer wrongtoken`)

        expect(response.status).to.equal(httpStatus.UNAUTHORIZED);
      });
    })

    describe('with non-existing user', () => {
      it('should return not found error', async () => {
        const response = await request(app)
          .get('/api/users/nonExistingUserId')
          .set('Authorization', `Bearer ${userAuthToken}`)

        expect(response.status).to.equal(httpStatus.INTERNAL_SERVER_ERROR);
      });
    })    
  }); 
  
  describe('# GET /api/users/search', () => {
    describe('with valid authToken', () => {
      it('should return searched users', async () => {
        const response = await request(app)
          .get('/api/users/search')
          .query({ val: 'foo'})
          .set('Authorization', `Bearer ${userAuthToken}`)

        expect(response.status).to.equal(httpStatus.OK);
        expect(response.body.length).to.equal(1);
      });
    })

    describe('with invalid authToken', () => {
      it('should return authentication error', async () => {
        const response = await request(app)
          .get('/api/users/search')
          .query({ val: 'foo'})
          .set('Authorization', `Bearer wrongtoken`)

        expect(response.status).to.equal(httpStatus.UNAUTHORIZED);
      });
    })
  });   

  describe('# PUT /api/users/:userId', () => {
    describe('with valid authToken', () => {
      it('should update own user', async () => {
        const validUserCredentials = {
          email: 'validFooBar@gmail.com',
          password: 'foobar123',
        }
    
        const registerResponse = await request(app)
          .post('/api/auth/register')
          .send(validUserCredentials);

        const { user, authToken } = registerResponse.body

        const updatedUserData = {
          username: 'foobarz',
          firstName: 'Foo',
          lastName: 'Bar',
          email: 'foobar3@gmail.com'
        }

        const updateResponse = await request(app)
          .put(`/api/users/${user._id}`)
          .send(updatedUserData)
          .set('Authorization', `Bearer ${authToken}`)

        expect(updateResponse.status).to.equal(httpStatus.OK);
        expect(updateResponse.body.username).to.equal(updatedUserData.username);
        expect(updateResponse.body.firstName).to.equal(updatedUserData.firstName);
        expect(updateResponse.body.lastName).to.equal(updatedUserData.lastName);
        expect(updateResponse.body.email).to.equal(updatedUserData.email);
      });
    })

    describe('with invalid authToken', () => {
      it('should return authentication error', async () => {
        const validUserCredentials = {
          email: 'invalidToken@gmail.com',
          password: 'foobar123',
        }
    
        const registerResponse = await request(app)
          .post('/api/auth/register')
          .send(validUserCredentials);

        const { user, authToken } = registerResponse.body

        const updatedUserData = {
          username: 'foobarz',
          firstName: 'Foo',
          lastName: 'Bar',
          email: 'foobar2@gmail.com'
        }

        const updateResponse = await request(app)
          .put(`/api/users/${user._id}`)
          .send(updatedUserData)
          .set('Authorization', `Bearer wrongtoken`)

        expect(updateResponse.status).to.equal(httpStatus.UNAUTHORIZED);
      });
    })

    describe('with attempt to update password', () => {
      it('should return authentication error', async () => {
        const validUserCredentials = {
          email: 'updatePassword@gmail.com',
          password: 'foobar123',
        }
    
        const registerResponse = await request(app)
          .post('/api/auth/register')
          .send(validUserCredentials);

        const { user, authToken } = registerResponse.body

        const updatedUserData = {
          password: 'newPassword'
        }

        const updateResponse = await request(app)
          .put(`/api/users/${user._id}`)
          .send(updatedUserData)
          .set('Authorization', `Bearer ${authToken}`)

        expect(updateResponse.status).to.equal(httpStatus.UNAUTHORIZED);
      });
    })
    
    describe('with existing email', () => {
      it('should return authentication error', async () => {
        const validUserCredentials = {
          email: 'existingEmail@gmail.com',
          password: 'foobar123',
        }
    
        const registerResponse = await request(app)
          .post('/api/auth/register')
          .send(validUserCredentials);

        const { user, authToken } = registerResponse.body
        
        const updatedUserData = {
          email: 'updatedExistingEmail@gmail.com'
        }

        const updateResponse = await request(app)
          .put(`/api/users/${user._id}`)
          .send(updatedUserData)
          .set('Authorization', `Bearer ${userAuthToken}`)

        expect(updateResponse.status).to.equal(httpStatus.UNAUTHORIZED);
      });
    })

    describe('with existing username', () => {
      it('should return authentication error', async () => {
        const validUserCredentials = {
          email: 'existingUsername@gmail.com',
          password: 'foobar123',
        }
    
        const registerResponse = await request(app)
          .post('/api/auth/register')
          .send(validUserCredentials);

        const { user, authToken } = registerResponse.body
        
        const updatedUserData = {
          username: 'existingUsername'
        }

        const updateResponse = await request(app)
          .put(`/api/users/${user._id}`)
          .send(updatedUserData)
          .set('Authorization', `Bearer ${authToken}`)

        expect(updateResponse.status).to.equal(httpStatus.OK);

        const updatedUserData2 = {
          username: 'existingUsername'
        }

        const updateResponse2 = await request(app)
          .put(`/api/users/${user._id}`)
          .send(updatedUserData2)
          .set('Authorization', `Bearer ${authToken}`)

        expect(updateResponse2.status).to.equal(httpStatus.UNAUTHORIZED);
      });
    })    
  });  
});
