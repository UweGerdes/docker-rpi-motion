/**
 * Test for motion page elements
 */

'use strict';

/* jshint expr: true, mocha: true, browser: true */

const serverDomain = 'http://0.0.0.0:8080';

const chai = require('chai'),
  chaiHttp = require('chai-http'),
  jsdom = require('jsdom'),
  assert = chai.assert,
  expect = chai.expect,
  { JSDOM } = jsdom;

chai.use(chaiHttp);

describe('motion/tests/server/page.js', function () {
  describe('GET /motion/', function () {
    it('should have head', function (done) {
      chai.request(serverDomain)
        .get('/motion/')
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res).to.be.html;
          const { document } = (new JSDOM(res.text)).window;
          assert.equal(document.title, 'Motion');
          assert.equal(document.head.getElementsByTagName('link').length, 2);
          assert.equal(
            document.head.getElementsByTagName('link')[0].attributes.href.nodeValue,
            '/app.css'
          );
          done();
        });
    });
    it('should have footer', function (done) {
      chai.request(serverDomain)
        .get('/motion/')
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res).to.be.html;
          const { document } = (new JSDOM(res.text)).window;
          const footer = document.getElementById('footer');
          assert.equal(footer.textContent, '© 2019 Uwe Gerdes');
          assert.equal(
            document.body.getElementsByTagName('script')[0].attributes.src.nodeValue,
            'https://0.0.0.0:' + process.env.LIVERELOAD_PORT + '/livereload.js'
          );
          done();
        });
    });
  });
});
