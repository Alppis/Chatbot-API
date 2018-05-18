const request = require('request');
const assert  = require('assert');

const chatbotController = require('./../../api/controllers/chatbotController');

describe('Tests requests related to statistics', function() {
    const appurl = "http://localhost:5000/api";
    
    it('Get all statistics [GET]', function(done) {
        request.get(appurl + "/statistics",
            function(err, res, body) {
                assert.equal(err, null);
                assert.equal(res.statusCode, 200);
                done();
        });
    });

    it('Get single keyword statistics [GET]', function(done) {
        request.get(appurl + "/statistics/2",
            function(err, res, body) {
                assert.equal(err, null);
                assert.equal(res.statusCode, 200);
                done();
        });
    });

    it('Get single keyword statistics which does not exists [GET]', function(done) {
        request.get(appurl + "/statisticss/2019",
            function(err, res, body) {
                assert.equal(err, null);
                assert.equal(res.statusCode, 404);
                done();
        });
    });
});