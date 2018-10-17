/**
 * Test for motion page elements
 */
'use strict';

/* jshint expr: true, mocha: true, browser: true */

const serverDomain = 'http://localhost:8082';

const chai = require('chai'),
  chaiHttp = require('chai-http'),
  jsdom = require('jsdom'),
  assert = chai.assert,
  expect = chai.expect,
  { JSDOM } = jsdom
  ;

chai.use(chaiHttp);

describe('motion page', function () {
  describe('GET /motion/', function () {
    it('should have head', function (done) {
      chai.request(serverDomain)
        .get('/motion')
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res).to.be.html;
          const { document } = (new JSDOM(res.text)).window;
          assert.equal(document.title, 'Webserver - Motion');
          assert.equal(document.head.getElementsByTagName('link').length, 1);
          assert.equal(
            document.head.getElementsByTagName('link')[0].attributes.href.nodeValue,
            '/css/app.css');
          done();
        });
    });
    it('should have some buttons', function (done) {
      chai.request(serverDomain)
        .get('/motion/')
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res).to.be.html;
          const { document } = (new JSDOM(res.text)).window;
          const searchButton = document.getElementById('motion-start');
          assert.equal(searchButton.textContent, 'start');
          //assert.equal(searchButton.getAttribute('data-modal'), '#searchLayer');
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
          assert.equal(footer.textContent, '© 2018 Uwe Gerdes');
          assert.equal(
            document.body.getElementsByTagName('script')[0].attributes.src.nodeValue,
            'http://localhost:8083/livereload.js');
          done();
        });
    });
  });
});