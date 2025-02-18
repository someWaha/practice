const app = require('../../app').listen();
const request = require('supertest')(app);
const should = require('should');
const support = require('../support');

describe('test /reset_pass', function() {
  let mockUser;

  before(async function() {
    mockUser = await support.createUser('123456@qq.com');
  });

  after(async function() {
    await support.deleteUser(mockUser.email);
  });

  it('should / status 400 when the token is invalid', async function() {
    try {
      const res = await request
        .post('/reset-pass?token=balabalabalabala&email=123456@qq.com')
        .send({
          newPass: 'a123456789',
        })
        .expect(400);

      res.text.should.equal('链接不正确');
    } catch (err) {
      should.ifError(err.message);
    }
  });

  it('should / status 400 when the password is invalid', async function() {
    try {
      let res;

      res = await request
        .post('/forget-pass')
        .send({
          email: '123456@qq.com',
        })
        .expect(200);

      res = await request
        .post('/reset-pass')
        .send({
          email: '123456@qq.com',
          token: res.text,
          new_pass: '1234567',
        })
        .expect(400);

      res.text.should.equal(
        '新密码必须为数字、字母和特殊字符其中两种组成并且在6-18位之间',
      );
    } catch (err) {
      should.ifError(err.message);
    }
  });

  it('should / status 200', async function() {
    try {
      const res = await request
        .post('/forget-pass')
        .send({
          email: '123456@qq.com',
        })
        .expect(200);

      await request
        .post('/reset-pass')
        .send({
          email: '123456@qq.com',
          token: res.text,
          new_pass: 'a1234567',
        })
        .expect(200);
    } catch (err) {
      should.ifError(err.message);
    }
  });
});
