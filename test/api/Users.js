const request = require('request');
const assert  = require('assert');

const chatbotController = require('./../../api/controllers/chatbotController');

describe('Tests requests related to users', function() {
    const appurl = "http://localhost:5000/api";
    
    it('Get all users [GET]', function(done) {
        request.get(appurl + "/users",
            function(err, res, body) {
                assert.equal(err, null);
                assert.equal(res.statusCode, 200);
                done();
        });
    });

    it('Get single user [GET]', function(done) {
        request.get(appurl + "/users/2",
            function(err, res, body) {
                assert.equal(err, null);
                assert.equal(res.statusCode, 200);
                done();
        });
    });

    it('Get single user which does not exists [GET]', function(done) {
        request.get(appurl + "/users/2019",
            function(err, res, body) {
                assert.equal(err, null);
                assert.equal(res.statusCode, 404);
                done();
        });
    });

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

    it('Create new user with malformed JSON [POST]', function(done) {
        var options = {
            uri: appurl+"/users",
            method: 'POST',
            json: {
                "username18": "Iamnotgood"
            } 
        };
        request(options,function(err, res, body) {
            assert.equal(err, null);
            assert.equal(res.statusCode, 400);
            done();
        });
    });

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

    it('Modify single user with malformed JSON [PATCH]', function(done) {
        var options = {
            uri: appurl+"/users/1",
            method: 'PATCH',
            json: {
                "user18": "Iammal"
            } 
        };
        request(options,function(err, res, body) {
            assert.equal(err, null);
            assert.equal(res.statusCode, 400);
            done();
        });
    });

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

    it('Delete single user [DELETE]', function(done) {
        request.delete(appurl + "/users/5",
        function(err, res, body) {
            assert.equal(err, null);
            assert.equal(res.statusCode, 204);
            done();
        });
    });

    it('Delete single non existing user [DELETE]', function(done) {
        request.delete(appurl + "/users/2019",
        function(err, res, body) {
            assert.equal(err, null);
            assert.equal(res.statusCode, 404);
            done();
        });
    });
});