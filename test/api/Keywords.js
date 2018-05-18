const request = require('request');
const assert  = require('assert');

const chatbotController = require('./../../api/controllers/chatbotController');

describe('Tests requests related to keywords', function() {
    const appurl = "http://localhost:5000/api";
    
    it('Get all keywords [GET]', function(done) {
        request.get(appurl + "/keywords",
            function(err, res, body) {
                assert.equal(err, null);
                assert.equal(res.statusCode, 200);
                done();
        });
    });

    it('Get single keyword [GET]', function(done) {
        request.get(appurl + "/keywords/2",
            function(err, res, body) {
                assert.equal(err, null);
                assert.equal(res.statusCode, 200);
                done();
        });
    });

    it('Get single keyword which does not exists [GET]', function(done) {
        request.get(appurl + "/keywords/2019",
            function(err, res, body) {
                assert.equal(err, null);
                assert.equal(res.statusCode, 404);
                done();
        });
    });

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

    it('Create new keyword with malformed JSON [POST]', function(done) {
        var options = {
            uri: appurl+"/keywords",
            method: 'POST',
            json: {
                "keyword18": "MalJSON",
                "cases": 0
            } 
        };
        request(options,function(err, res, body) {
            assert.equal(err, null);
            assert.equal(res.statusCode, 400);
            done();
        });
    });

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

    it('Modify single keyword with malformed JSON [PATCH]', function(done) {
        var options = {
            uri: appurl+"/keywords/1",
            method: 'PATCH',
            json: {
                "keyword18": "NotvalidJSON",
                "cases": 0
            } 
        };
        request(options,function(err, res, body) {
            assert.equal(err, null);
            assert.equal(res.statusCode, 400);
            done();
        });
    });

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

    it('Delete single keyword [DELETE]', function(done) {
        request.delete(appurl + "/keywords/4",
        function(err, res, body) {
            assert.equal(err, null);
            assert.equal(res.statusCode, 204);
            done();
        });
    });

    it('Delete single non existing keyword [DELETE]', function(done) {
        request.delete(appurl + "/keywords/2019",
        function(err, res, body) {
            assert.equal(err, null);
            assert.equal(res.statusCode, 404);
            done();
        });
    });
});