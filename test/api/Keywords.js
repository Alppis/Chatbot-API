const request = require('request');
const assert  = require('assert');

const chatbotController = require('./../../api/controllers/chatbotController');

describe('Tests requests related to keywords', function() {
    const appurl = "http://localhost:5000/api";
    
    //Test get all keywords with correct path
    //Expected: response status 200
    it('Get all keywords [GET]', function(done) {
        request.get(appurl + "/keywords",
            function(err, res, body) {
                assert.equal(err, null);
                assert.equal(res.statusCode, 200);
                done();
        });
    });

    //Test get single keyword with correct path
    //Expected: response status 200
    it('Get single keyword [GET]', function(done) {
        request.get(appurl + "/keywords/2",
            function(err, res, body) {
                assert.equal(err, null);
                assert.equal(res.statusCode, 200);
                done();
        });
    });

    //Test get single keyword with keywordid that does not exist in database
    //Expected: response status 404
    it('Get single keyword which does not exists [GET]', function(done) {
        request.get(appurl + "/keywords/2019",
            function(err, res, body) {
                assert.equal(err, null);
                assert.equal(res.statusCode, 404);
                done();
        });
    });

    //Test create new keyword POST with valid JSON
    //Expected: response status 201
    it('Create new keyword [POST]', function(done) {
        var options = {
            uri: appurl+"/keywords",
            method: 'POST',
            json: {
                "keyword": "PWP2018",
                "cases": 2
            } 
        };
        request(options,function(err, res, body) {
            assert.equal(err, null);
            assert.equal(res.statusCode, 201);
            done();
        });
    });

     //Test creating new keyword POST which already exists in db
    //Expected: response status 409
    it('Create new keyword that already exists [POST]', function(done) {
        var options = {
            uri: appurl+"/keywords",
            method: 'POST',
            json: {
                "keyword": "MyWords",
                "cases": 0
            } 
        };
        request(options,function(err, res, body) {
            assert.equal(err, null);
            assert.equal(res.statusCode, 409);
            done();
        });
    });

    //Test creating new keyword POST with invalid json body format
    //Expected: response status 400
    it('Create new keyword with missing keyword [POST]', function(done) {
        var options = {
            uri: appurl+"/keywords",
            method: 'POST',
            json: {
                "cases": 0
            } 
        };
        request(options,function(err, res, body) {
            assert.equal(err, null);
            assert.equal(res.statusCode, 400);
            done();
        });
    });

    //Test creating new keyword POST with invalid json body format
    //Expected: response status 400
    it('Create new keyword with malformed JSON [POST]', function(done) {
        var malJson = "keyword MalJSON cases: 0";
        var options = {
            uri: appurl+"/keywords",
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

    //Testing modifying single keyword with valid JSON body format
    //Expected: response status 204
    it('Modify single keyword [PATCH]', function(done) {
        var options = {
            uri: appurl+"/keywords/1",
            method: 'PATCH',
            json: {
                "keyword": "Tex",
                "cases": 0
            } 
        };
        request(options,function(err, res, body) {
            assert.equal(err, null);
            assert.equal(res.statusCode, 204);
            done();
        });
    });

    //Test modifying non existing keyword details
    //Expected: response status 404
    it('Modify single non existing keyword [PATCH]', function(done) {
        var options = {
            uri: appurl+"/keywords/2018",
            method: 'PATCH',
            json: {
                "keyword": "Notfound",
                "cases": 0
            } 
        };
        request(options,function(err, res, body) {
            assert.equal(err, null);
            assert.equal(res.statusCode, 404);
            done();
        });
    });

    //Testing modifying keyword with non valid JSON body format
    //Expected: response status 400
    it('Modify single keyword with malformed JSON [PATCH]', function(done) {
        var malJson = "keyword MalJSON cases: 0";
        var options = {
            uri: appurl+"/keywords/1",
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

     //Test modifying keyword to same as other keyword in database
    //Expected: response status 409
    it('Modify single keyword to same as other keyword [PATCH]', function(done) {
        var options = {
            uri: appurl+"/keywords/3",
            method: 'PATCH',
            json: {
                "keyword": "MyWords",
                "cases": 0
            } 
        };
        request(options,function(err, res, body) {
            assert.equal(err, null);
            assert.equal(res.statusCode, 409);
            done();
        });
    });

    //Test removing single keyword
    //Expected: response status 204
    it('Delete single keyword [DELETE]', function(done) {
        request.delete(appurl + "/keywords/4",
        function(err, res, body) {
            assert.equal(err, null);
            assert.equal(res.statusCode, 204);
            done();
        });
    });

    //Test trying to delete keyword that does not exist in database
    //Expected: response status 404
    it('Delete single non existing keyword [DELETE]', function(done) {
        request.delete(appurl + "/keywords/2019",
        function(err, res, body) {
            assert.equal(err, null);
            assert.equal(res.statusCode, 404);
            done();
        });
    });
});