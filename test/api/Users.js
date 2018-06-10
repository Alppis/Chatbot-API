const request = require('request');
const assert  = require('assert');

const chatbotController = require('./../../api/controllers/chatbotController');

describe('Tests requests related to users', function() {
    const appurl = "http://localhost:5000/api";
    
    //Test get all users with correct path
    //Expected: response status 200
    it('Get all users [GET]', function(done) {
        request.get(appurl + "/users",
            function(err, res, body) {
                assert.equal(err, null);
                assert.equal(res.statusCode, 200);
                done();
        });
    });

    //Test get single user with correct path
    //Expected: response status 200
    it('Get single user [GET]', function(done) {
        request.get(appurl + "/users/2",
            function(err, res, body) {
                assert.equal(err, null);
                assert.equal(res.statusCode, 200);
                done();
        });
    });

    //Test get single user with user id that does not exist in database
    //Expected: response status 404
    it('Get single user which does not exists [GET]', function(done) {
        request.get(appurl + "/users/2019",
            function(err, res, body) {
                assert.equal(err, null);
                assert.equal(res.statusCode, 404);
                done();
        });
    });

    //Test create new user POST with valid JSON
    //Expected: response status 201
    it('Create new user [POST]', function(done) {
        var options = {
            uri: appurl+"/users",
            method: 'POST',
            json: {
                "username": "PWP2018"
            } 
        };
        request(options,function(err, res, body) {
            assert.equal(err, null);
            assert.equal(res.statusCode, 201);
            done();
        });
    });

    //Test creating new user POST with existing username
    //Expected: response status 409
    it('Create new user that already exists [POST]', function(done) {
        var options = {
            uri: appurl+"/users",
            method: 'POST',
            json: {
                "username": "GUTS"
            } 
        };
        request(options,function(err, res, body) {
            assert.equal(err, null);
            assert.equal(res.statusCode, 409);
            done();
        });
    });

    //Test creating new user POST with invalid json body format
    //Expected: response status 400
    it('Create new user with missing username [POST]', function(done) {
        var options = {
            uri: appurl+"/users",
            method: 'POST',
            json: {
                "": ""
            } 
        };
        request(options,function(err, res, body) {
            assert.equal(err, null);
            assert.equal(res.statusCode, 400);
            done();
        });
    });

    //Test creating new user POST with invalid json body format
    //Expected: response status 400
    it('Create new user with malformed JSON [POST]', function(done) {
        var malJson = "username Iammaljson";
        var options = {
            uri: appurl+"/users",
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

    //Testing modifying single user with valid JSON body format
    //Expected: response status 204
    it('Modify single user [PATCH]', function(done) {
        var options = {
            uri: appurl+"/users/2",
            method: 'PATCH',
            json: {
                "username": "Windows is best!"
            } 
        };
        request(options,function(err, res, body) {
            assert.equal(err, null);
            assert.equal(res.statusCode, 204);
            done();
        });
    });

    //Test modifying non existing user details
    //Expected: response status 404
    it('Modify single non existing user [PATCH]', function(done) {
        var options = {
            uri: appurl+"/users/2018",
            method: 'PATCH',
            json: {
                "username": "Iamlost"
            } 
        };
        request(options,function(err, res, body) {
            assert.equal(err, null);
            assert.equal(res.statusCode, 404);
            done();
        });
    });

    //Testing modifying user with non valid JSON body format
    //Expected: response status 400
    it('Modify single user with malformed JSON [PATCH]', function(done) {
        var malJson = "username Iammaljson";
        var options = {
            uri: appurl+"/users/1",
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

    //Test modifying user to same as other user in database
    //Expected: response status 409
    it('Modify single user to same as other user [PATCH]', function(done) {
        var options = {
            uri: appurl+"/users/3",
            method: 'PATCH',
            json: {
                "username": "Killian"
            } 
        };
        request(options,function(err, res, body) {
            assert.equal(err, null);
            assert.equal(res.statusCode, 409);
            done();
        });
    });

    //Test removing single user
    //Expected: response status 204
    it('Delete single user [DELETE]', function(done) {
        request.delete(appurl + "/users/5",
        function(err, res, body) {
            assert.equal(err, null);
            assert.equal(res.statusCode, 204);
            done();
        });
    });

    //Test trying to delete user that does not exist in database
    //Expected: response status 404
    it('Delete single non existing user [DELETE]', function(done) {
        request.delete(appurl + "/users/2019",
        function(err, res, body) {
            assert.equal(err, null);
            assert.equal(res.statusCode, 404);
            done();
        });
    });
});