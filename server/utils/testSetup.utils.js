require('dotenv').config();
const { expect } = require('chai');
const request = require('supertest');

before(async () => {
  global.expect = expect;
  global.request = request;
});
