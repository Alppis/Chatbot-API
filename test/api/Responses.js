const request = require('request');
const assert  = require('assert');

const chatbotController = require('./../../api/controllers/chatbotController');

describe('Tests requests related to responses', function() {
    before( function(done) {
        done();
    });

    const appurl = "http://localhost:5000/api";

    it('Get all responses [GET]', function(done) {
        request.get(appurl + "/responses",
            function(err, res, body) {
                assert.equal(err, null);
                assert.equal(res.statusCode, 200);
                done();
        });
    });

    it('Get single response [GET]', function(done) {
        request.get(appurl + "/responses/2",
            function(err, res, body) {
                assert.equal(err, null);
                assert.equal(res.statusCode, 200);
                done();
        });
    });

    it('Get single response which does not exists [GET]', function(done) {
        request.get(appurl + "/responses/2019",
            function(err, res, body) {
                assert.equal(err, null);
                assert.equal(res.statusCode, 404);
                done();
        });
    });

    it('Create new response [POST]', function(done) {
        var options = {
            uri: appurl+"/responses",
            method: 'POST',
            json: {
                "response": "PWP2018",
                "keyword": "NodeJS",
                "header": "",
                "username": "Anonymous"
            } 
        };
        request(options,function(err, res, body) {
            assert.equal(err, null);
            assert.equal(res.statusCode, 201);
            done();
        });
    });

    it('Create new response that already exists [POST]', function(done) {
        var options = {
            uri: appurl+"/responses",
            method: 'POST',
            json: {
                "response": "Jolly Good!",
                "keyword": "MyWords",
                "header": "",
                "username": "Anonymous"
            } 
        };
        request(options,function(err, res, body) {
            assert.equal(err, null);
            assert.equal(res.statusCode, 201);
            done();
        });
    });

    it('Create new response with missing keyword [POST]', function(done) {
        var options = {
            uri: appurl+"/responses",
            method: 'POST',
            json: {
                "response": "Key missing!",
                "header": "",
                "username": "Anonymous"
            } 
        };
        request(options,function(err, res, body) {
            assert.equal(err, null);
            assert.equal(res.statusCode, 400);
            done();
        });
    });

    it('Create new response with missing response [POST]', function(done) {
        var options = {
            uri: appurl+"/responses",
            method: 'POST',
            json: {
                "keyword": "Whereisresponse?",
                "header": "",
                "username": "Anonymous"
            } 
        };
        request(options,function(err, res, body) {
            assert.equal(err, null);
            assert.equal(res.statusCode, 400);
            done();
        });
    });

    it('Create new response with malformed JSON [POST]', function(done) {
        var options = {
            uri: appurl+"/responses",
            method: 'POST',
            json: {
                "response19": "Mal",
                "keyword": "MJSON",
                "header": "",
                "username": "Anonymous"
            } 
        };
        request(options,function(err, res, body) {
            assert.equal(err, null);
            assert.equal(res.statusCode, 400);
            done();
        });
    });

    it('Modify single response [PATCH]', function(done) {
        var options = {
            uri: appurl+"/responses/2",
            method: 'PATCH',
            json: {
                "response": "Windows is best!",
                "keyword": "Window",
                "header": "10",
                "username": "Anonymous"
            } 
        };
        request(options,function(err, res, body) {
            assert.equal(err, null);
            assert.equal(res.statusCode, 204);
            done();
        });
    });

    it('Modify single non existing response [PATCH]', function(done) {
        var options = {
            uri: appurl+"/responses/2018",
            method: 'PATCH',
            json: {
                "response": "Am i missing",
                "keyword": "Missing",
                "header": "10",
                "username": "Anonymous"
            } 
        };
        request(options,function(err, res, body) {
            assert.equal(err, null);
            assert.equal(res.statusCode, 404);
            done();
        });
    });

    it('Modify single response with malformed JSON [PATCH]', function(done) {
        var options = {
            uri: appurl+"/responses/1",
            method: 'PATCH',
            json: {
                "response19": "WhyIamMalformed?",
                "keyword": "Mal",
                "header": "10",
                "username": "Anonymous"
            } 
        };
        request(options,function(err, res, body) {
            assert.equal(err, null);
            assert.equal(res.statusCode, 400);
            done();
        });
    });

    it('Modify single response to same as other response [PATCH]', function(done) {
        var options = {
            uri: appurl+"/responses/6",
            method: 'PATCH',
            json: {
                "response": "Ni!",
                "keyword": "Ni!",
                "header": "Monty",
                "username": "Anonymous"
            } 
        };
        request(options,function(err, res, body) {
            assert.equal(err, null);
            assert.equal(res.statusCode, 204);
            done();
        });
    });

    it('Delete single response [DELETE]', function(done) {
        request.delete(appurl + "/responses/5",
        function(err, res, body) {
            assert.equal(err, null);
            assert.equal(res.statusCode, 204);
            done();
        });
    });

    it('Delete single non existing response [DELETE]', function(done) {
        request.delete(appurl + "/responses/2019",
        function(err, res, body) {
            assert.equal(err, null);
            assert.equal(res.statusCode, 404);
            done();
        });
    });

    /*it('Returns last processed activity [POST]', function(done) {
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
    });*/


});