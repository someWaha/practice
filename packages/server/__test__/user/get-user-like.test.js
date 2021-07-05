const app = require('../../app').listen();
const request = require('supertest')(app);
const should = require('should');
const support = require('../support');

describe('test /user/:uid/like', function() {
  let mockUser;
  let mockTopic;

  before(async function() {
    mockUser = await support.createUser('123456@qq.com');
    mockTopic = await support.createTopic(mockUser._id);
    await support.createAction({
      type: 'like',
      aid: mockUser._id,
      tid: mockTopic._id,
    });
  });

  after(async function() {
    await support.deleteAction(mockUser._id);
    await support.deleteTopic(mockUser._id);
    await support.deleteUser(mockUser.email);
  });

  it('should / status 200', async function() {
    try {
      const res = await request.get(`/user/${mockUser._id}/like`).expect(200);
      res.body.should.be.Array();
      res.body.length.should.equal(1);
    } catch (err) {
      should.ifError(err.message);
    }
  });
});
