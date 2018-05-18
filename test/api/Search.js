const request = require('request');
const assert  = require('assert');

const chatbotController = require('./../../api/controllers/chatbotController');

describe('Database search functions', function() {
    before( function(done) {
        done();
    });

    const appurl = "http://localhost:5000/api";

    it('Gets the wanted responses with statistics [GET]', function(done) {
        request.get(appurl + "/statistics",
            function(err, res, body) {
                assert.equal(err, null);
                assert.equal(res.statusCode, 200);
                done();
        });
    });

    it('Returns latest responses [GET]', function(done) {
        request.get(appurl + "/search",
            function(err, res, body) {
                assert.equal(err, null);
                assert.equal(res.statusCode, 200);
                done();
        });
    });

});