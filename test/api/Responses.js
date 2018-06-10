const request = require('request');
const assert  = require('assert');

const chatbotController = require('./../../api/controllers/chatbotController');

describe('Tests requests related to responses', function() {
    before( function(done) {
        done();
    });

    const appurl = "http://localhost:5000/api";

    //Test get all responses with correct path
    //Expected: response status 200
    it('Get all responses [GET]', function(done) {
        request.get(appurl + "/responses",
            function(err, res, body) {
                assert.equal(err, null);
                assert.equal(res.statusCode, 200);
                done();
        });
    });

    //Test get single response with correct path
    //Expected: response status 200
    it('Get single response [GET]', function(done) {
        request.get(appurl + "/responses/1",
            function(err, res, body) {
                assert.equal(err, null);
                assert.equal(res.statusCode, 200);
                done();
        });
    });

    //Test get single response with responseid that does not exist in database
    //Expected: response status 404
    it('Get single response which does not exists [GET]', function(done) {
        request.get(appurl + "/responses/2019",
            function(err, res, body) {
                assert.equal(err, null);
                assert.equal(res.statusCode, 404);
                done();
        });
    });

    //Test create new response POST with valid JSON
    //Expected: response status 201
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

    //Test creating new response POST with existing response
    //Expected: response status 201
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

    //Test creating new response POST with invalid json body format
    //Expected: response status 400
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

    //Test creating new response POST with invalid json body format
    //Expected: response status 400
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

    //Test creating new response POST with invalid json body format
    //Expected: response status 400
    it('Create new response with malformed JSON [POST]', function(done) {
        var malJson = "response Mal, keyword: MJSON header '' username Anon";
        var options = {
            uri: appurl+"/responses",
            method: 'POST',
            json: {
                malJson
            } 
        };
        request(options,function(err, res, body) {
            assert.equal(err, null);
            assert.equal(res.statusCode, 400);
            done();
        });
    });

    //Testing modifying single response with valid JSON body format
    //Expected: response status 204
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

    //Test modifying non existing response details
    //Expected: response status 404
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

    //Testing modifying response with non valid JSON body format
    //Expected: response status 400
    it('Modify single response with malformed JSON [PATCH]', function(done) {
        var malJson = "response Mal, keyword: MJSON header '' username Anon";
        var options = {
            uri: appurl+"/responses/1",
            method: 'PATCH',
            json: {
                malJson
            } 
        };
        request(options,function(err, res, body) {
            assert.equal(err, null);
            assert.equal(res.statusCode, 400);
            done();
        });
    });

    //Test modifying response to same as other response in database
    //Expected: response status 204
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

    //Test removing single response
    //Expected: response status 204
    it('Delete single response [DELETE]', function(done) {
        request.delete(appurl + "/responses/5",
        function(err, res, body) {
            assert.equal(err, null);
            assert.equal(res.statusCode, 204);
            done();
        });
    });

    //Test trying to delete response that does not exist in database
    //Expected: response status 404
    it('Delete single non existing response [DELETE]', function(done) {
        request.delete(appurl + "/responses/2019",
        function(err, res, body) {
            assert.equal(err, null);
            assert.equal(res.statusCode, 404);
            done();
        });
    });
});