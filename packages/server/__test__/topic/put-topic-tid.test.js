const { Types } = require('mongoose');
const app = require('../../app').listen();
const request = require('supertest')(app);
const should = require('should');
const support = require('../support');

describe('test put /topic/:uid', function() {
  let mockUser;
  let mockUser2;
  let mockTopic;

  before(async function() {
    mockUser = await support.createUser('123456@qq.com');
    mockUser2 = await support.createUser('123457@qq.com');
    mockTopic = await support.createTopic(mockUser._id);
  });

  after(async function() {
    await support.deleteTopic(mockUser._id);
    await support.deleteUser(mockUser.email);
    await support.deleteUser(mockUser2.email);
  });

  it('should / status 401 when the not signin', async function() {
    try {
      const res = await request
        .put(`/topic/${mockTopic.id}`)
        .send({
          tab: 'share',
          title: '改名为分享类',
          content: '# 随便改点内容',
        })
        .expect(401);

      res.text.should.equal('尚未登录');
    } catch (err) {
      should.ifError(err.message);
    }
  });

  it('should / status 404 when the topic does not exist', async function() {
    try {
      let res = await request
        .post('/signin')
        .send({
          email: mockUser.email,
          password: 'a123456',
        })
        .expect(200);

      res = await request
        .put(`/topic/${Types.ObjectId()}`)
        .send({
          tab: 'share',
          title: '改名为分享类',
          content: '# 随便改点内容',
        })
        .set('Authorization', res.text)
        .expect(404);

      res.text.should.equal('话题不存在');
    } catch (err) {
      should.ifError(err.message);
    }
  });

  it('should / status 403 when the topic not yours', async function() {
    try {
      let res = await request
        .post('/signin')
        .send({
          email: mockUser2.email,
          password: 'a123456',
        })
        .expect(200);

      res = await request
        .put(`/topic/${mockTopic._id}`)
        .send({
          tab: 'share',
          title: '改名为分享类',
          content: '# 随便改点内容',
        })
        .set('Authorization', res.text)
        .expect(403);

      res.text.should.equal('不能编辑别人的话题');
    } catch (err) {
      should.ifError(err.message);
    }
  });

  it('should / status 200', async function() {
    try {
      const res = await request
        .post('/signin')
        .send({
          email: mockUser.email,
          password: 'a123456',
        })
        .expect(200);

      await request
        .put(`/topic/${mockTopic._id}`)
        .send({
          tab: 'share',
          title: '改名为分享类',
          content: '# 随便改点内容',
        })
        .set('Authorization', res.text)
        .expect(200);
    } catch (err) {
      should.ifError(err.message);
    }
  });
});
