/**
 * Test for motion page on https
 */

'use strict';


const chai = require('chai'),
  chaiHttp = require('chai-http'),
  jsdom = require('jsdom'),
  request = require('supertest'),
  assert = chai.assert,
  expect = chai.expect,
  { JSDOM } = jsdom,
  serverDomain = 'https://localhost:8443',
  agent = request.agent(serverDomain);

chai.use(chaiHttp);

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

let document,
  res,
  err = null;

describe('motion/tests/server/motion.js', function () {
  describe('GET /motion/', () => {
    it('should have no error, head, header, headline and links', async () => {
      try {
        res = await agent.get('/motion/');
      } catch (error) {
        err = error;
      }
      document = checkResponse(res, err);
      checkPage(document, 'Motion', null, 'anmelden');
      testError();
      /*
      testElement('#header', { }, 'HomeOAuth 2 Serveranmelden');
      testElement('.header a.login-link', { 'href': '/oauth2/user/login/?redirect=/oauth2/' }, 'anmelden');
      */
      testElement('#headline', { }, 'Motion Headline');
      testElement('[data-emit=startMotion]', { }, 'start');
      testElement('[data-emit=stopMotion]', { }, 'stop');
      testElement('[data-emit=isRunning]', { }, 'is running?');
    });
  });
  describe('GET /motion/', function () {
    it('should have head', function (done) {
      chai.request('http://localhost:8080')
        .get('/motion/')
        .end(function (err, res) {
          // TODO should redirect to https
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res).to.be.html;
          const { document } = (new JSDOM(res.text)).window;
          assert.equal(document.title, 'Motion');
          assert.equal(document.head.getElementsByTagName('link').length, 1);
          assert.equal(
            document.head.getElementsByTagName('link')[0].attributes.href.nodeValue,
            '/css/app.css'
          );
          const startButton = document.querySelector('[data-emit=startMotion]');
          assert.equal(startButton.textContent, 'start');
          const stopButton = document.querySelector('[data-emit=stopMotion]');
          assert.equal(stopButton.textContent, 'stop');
          const isRunningButton = document.querySelector('[data-emit=isRunning]');
          assert.equal(isRunningButton.textContent, 'is running?');
          const footer = document.getElementById('footer');
          assert.equal(footer.textContent, '© 2019 Uwe Gerdes');
          assert.equal(
            document.body.getElementsByTagName('script')[0].attributes.src.nodeValue,
            '//localhost:8081/livereload.js'
          );
          done();
        });
    });
  });
});

/**
 * check the response and error
 *
 * @param {Object} res - result object
 * @param {Object} err - error object
 * @returns {Object} - document
 */
function checkResponse (res, err) {
  expect(err).to.be.null;
  assert.equal(res.status, 200, 'route ' + res.req.path);
  expect(res).to.be.html;
  return (new JSDOM(res.text)).window.document;
}

/**
 * test error message in document
 *
 * @param {Object} document - document tree
 * @param {String} title - page title
 * @param {String} breadcrumb - text for third breadcrumb
 * @param {String} loginStatusLabel - text to show in .login-status
 */
function checkPage (document, title, breadcrumb, loginStatusLabel) {
  assert.equal(document.title, title);
  assert.equal(breadcrumb, null);
  assert.equal('anmelden', loginStatusLabel);
  /*
  const breadcrumbs = document.querySelectorAll('.header-breadcrumb');
  assert.isAtLeast(breadcrumbs.length, 2);
  assert.equal(breadcrumbs[0].textContent, 'Home');
  assert.equal(breadcrumbs[1].textContent, 'OAuth 2 Server');
  const breadcrumbLinks = document.querySelectorAll('.header-breadcrumb a');
  assert.isAtLeast(breadcrumbLinks.length, 2);
  assert.equal(breadcrumbLinks[1].textContent, 'OAuth 2 Server');
  assert.equal(breadcrumbLinks[1].getAttribute('href'), '/oauth2/');
  // assert.equal(breadcrumbLinks[2].textContent, 'Client');
  // assert.equal(breadcrumbLinks[2].getAttribute('href'), '/oauth2/client');
  if (breadcrumb) {
    assert.equal(breadcrumbs[3].textContent, breadcrumb);
  }
  const loginStatus = document.querySelectorAll('.login-status');
  assert.equal(loginStatus.length, 1);
  assert.equal(loginStatus[0].textContent, loginStatusLabel);
  // const headline = document.getElementById('headline');
  // assert.equal(headline.textContent, 'OAuth 2 Server Client');
  */
}

/**
 * test error message in document
 *
 * @param {String} msg - error message or no error
 */
function testError(msg) {
  const errors = document.querySelectorAll('.error');
  if (msg) {
    assert.equal(errors.length, 1, 'errors');
    assert.equal(errors[0].textContent, msg, 'error');
  } else {
    assert.equal(errors.length, 0, errors.length > 0 ? 'error ' + errors[0].textContent : 'errors');
  }
}

/**
 * test DOM element properties
 *
 * @param {String} selector - to test
 * @param {Object} attr - element attributes to verify
 * @param {String} text - element.textContent
 */
function testElement(selector, attr, text) {
  const element = document.querySelectorAll(selector)[0];
  assert.exists(element, 'element ' + selector + ' found');
  for (const [name, value] of Object.entries(attr)) {
    assert.equal(element.getAttribute(name), value, 'element ' + selector + '.' + name);
  }
  assert.equal(element.textContent, text, 'element ' + selector + ' text');
}
