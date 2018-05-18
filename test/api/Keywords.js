const request = require('request');
const assert  = require('assert');

const chatbotController = require('./../../api/controllers/chatbotController');

describe('Database search functions', function() {
    const appurl = "http://localhost:5000/api";
    
    it('Gets the keywords [GET]', function(done) {
        request.get(appurl + "/keywords",
            function(err, res, body) {
                assert.equal(err, null);
                assert.equal(res.statusCode, 200);
                done();
        });
    });

    it('Creates new keywords [POST]', function(done) {
        var options = {
            uri: appurl+"/keywords",
            method: 'POST',
            json: {
                "keyword": "Mocha",
                "cases": 0
            } 
        };
        request(options,function(err, res, body) {
            assert.equal(err, null);
            assert.equal(res.statusCode, 200);
            done();
        });
    });

    it('Modifies the keywords [PATCH]', function(done) {
        var options = {
            uri: appurl+"/keywords",
            method: 'PATCH',
            json: {
                "keyword": "MyWords",
                "cases": 0
            } 
        };
        request(options,function(err, res, body) {
            assert.equal(err, null);
            assert.equal(res.statusCode, 200);
            done();
        });
    });


});