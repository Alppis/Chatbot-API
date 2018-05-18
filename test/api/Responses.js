const request = require('request');
const assert  = require('assert');

const chatbotController = require('./../../api/controllers/chatbotController');

describe('Responses', function() {
    before( function(done) {
        done();
    });

    const appurl = "http://localhost:5000/api";

    it('Receives response information [GET]', function(done) {
        request.get(appurl + "/responses",
            function(err, res, body) {
                assert.equal(err, null);
                assert.equal(res.statusCode, 200);
                done();
        });
    });

    it('Receives individual responses  [GET]', function(done) {
        request.get(appurl + "/responses/2",
            function(err, res, body) {
                assert.equal(err, null);
                assert.equal(res.statusCode, 200);
                done();
        });
    });

    it('Returns last processed activity [POST]', function(done) {
        var options = {
            uri: appurl+"/keywords",
            method: 'POST',
            json: {
                "response": "Jolly Good!",
                "keyword": "MyWords",
                "header": "",
                "username": "Anonymous"
            }
        }
        request(options,function(err, res, body) {
                assert.equal(err, null);
                assert.equal(res.statusCode, 200);
                done();
        });
    });


});