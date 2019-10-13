const httpStatus = require('http-status');
const app = require('../app');
// const { getNextSequence, clearDatabase } = require('../utils/mongoose.utils');

describe('## Auth APIs', () => {
  // let recipe;

  before(async () => {
    // await clearDatabase();

    // const data = {
    //   index: await getNextSequence('recipeId'),
    //   originalUrl: 'https://iAmaReallyLongTestUrl.com/',
    // };
    // const response = await request(app).post('/api/auth').send(data);
    // recipe = response.body;
  });

  describe('# POST /api/auth/register', () => {
    it('should create new user', async () => {
      const response = await request(app).get('/api/auth/register');

      expect(response.status).to.equal(httpStatus.OK);
    });
  });

  describe('# POST /api/auth/login', () => {
    it('should get all auth', async () => {
      const response = await request(app).get('/api/auth/login');

      expect(response.status).to.equal(httpStatus.OK);
    });
  });
});
