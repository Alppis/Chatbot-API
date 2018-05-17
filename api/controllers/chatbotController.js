//Code from ObjectionJS documentation https://vincit.github.io/objection.js
//and ES6 example project https://github.com/Vincit/objection.js/tree/master/examples/express-es6

const {transaction} = require('objection');
const Keywords = require('../models/keywordsModel');
const Users = require('../models/usersModel');
const Responses = require('../models/responsesModel');
const Statistics = require('../models/statisticsModel');

module.exports = router => {
    //Get all keywords
    router.get('/api/keywords', async (req, res) => {
        try {
            const keywords = await Keywords.query();

            keywords.forEach(keyword => {
                controls = {
                    self: {
                        href: `/chatbot/api/keywords/${keyword.keywordid}`
                    }
                }

                keyword['@controls'] = controls;
            })

            const payload = {
                '@namespaces': {
                    'name': '/chatbot/namespace/',
                    'items': keywords
                },

                '@controls': {
                    self: {
                        href: `/chatbot/api/keywords/`
                    },
                    "chatbot:add-keyword": {
                        'title': 'Create keyword',
                        href: `/chatbot/api/keywords/`,
                        'encoding': 'json',
                        'method': 'POST',
                        'schemaurl': '/chatbot/schema/keyword'
                    },
                    "chatbot:keywords-all":  {
                        href: `chatbot/api/keywords/`,
                        'title': 'All keywords'
                    }
                }
            }

            res.header('Accept', 'application/vnd.mason+json').status(200).send(payload);
        } catch (err) {
            console.log(err);
            const payload = {
                '@error': {
                    '@message': 'Something went wrong',
                    '@messages': [
                        'Something went wrong while processing request'
                    ]
                },
                'resourse_url': '/chatbot/api/keywords/'
            }
            res.header('Accept', 'application/vnd.mason+json').status(500).send({message: payload});
        }
    });

    //Get single keyword
    router.get('/api/keywords/:keywordid', async (req, res) => {
        
        try {
            const keyword = await Keywords
            .query()
            .skipUndefined()
            .where('keywordid', '=', req.params.keywordid)
            .throwIfNotFound();

            const keywordid = req.params.keywordid;

            const payload = {
                '@namespaces': {
                    'chatbot': {
                        'name': '/chatbot/namespace/'
                    },
                    'atom-thread': {
                        'name': 'https://tools.ietf.org/html/rfc4685'
                    }
                },

                'keyword': keyword,
                'cases': keyword.cases,

                '@controls': {
                    self: {
                        href: `/chatbot/api/keywords/${keywordid}`
                    }
                }
            }

            res.header('Accept', 'application/vnd.mason+json').status(200).send(payload);
        } catch (err) {
            console.log("Error catched: " + err);
            const payload = {
                '@error': {
                    '@message': 'Keyword does not exists',
                    '@messages': [
                        'There is no a keyword with keywordid ' + req.params.keywordid,
                    ]
                },
                'resourse_url': '/chatbot/api/keywords/' + req.params.keywordid
            }
            res.header('Accept', 'application/vnd.mason+json').status(404).send({message: payload});
        }
    });

    //Modify single keyword
    router.patch('/api/keywords/:keywordid', async (req, res) => {
        const keywordid = req.params.keywordid;
        try {
            if(!req.body.keyword || req.body.cases == null) {
                throw new ValidationError({statusCode: 400, type: 'ModelValidation', message: {}, data: {}});
            } else {
                const keyword = await Keywords
                .query()
                .patch({keyword: req.body.keyword, cases: req.body.cases})
                .where('keywordid', req.params.keywordid)
                .throwIfNotFound();

                res.header('Accept', 'application/vnd.mason+json').status(204).send({info: 'The keyword is modified correctly.'});
            }
        } catch (err) {
            console.log("Error catched: " + err);

            if (err instanceof ValidationError) {
                const payload = {
                    '@error': {
                        '@message': 'Wrong request format',
                        '@messages': [
                            'Check that your parameters are correctly written and dont contain any special characters'
                        ]
                    },
                    'resource_url': '/chatbot/api/keywords/' + req.params.keywordid
                }
                res.header('Accept', 'application/vnd.mason+json').status(400).send({message: payload});
            } else if (err instanceof NotFoundError){
                const payload = {
                    '@error': {
                        '@message': 'Keyword does not exists',
                        '@messages': [
                            'There is no a keyword with keywordid ' + req.params.keywordid,
                        ]
                    },
                    'resourse_url': '/chatbot/api/keywords/' + req.params.keywordid
                }
                res.header('Accept', 'application/vnd.mason+json').status(404).send({message: payload});
            } else {
                const payload = {
                    '@error': {
                        '@message': 'Something went wrong',
                        '@messages': [
                            'Something went wrong while processing request'
                        ]
                    },
                    'resourse_url': '/chatbot/api/keywords/'
                }
                res.header('Accept', 'application/vnd.mason+json').status(500).send({message: payload});
            }
        }
    });

    //Remove single keyword
    router.delete('/api/keywords/:keywordid', async (req, res) => {
        
        try {
            const deletedKeyword = await Keywords.query()
            .delete()
            .where('keywordid', '=', req.params.keywordid)
            .throwIfNotFound();

            res.header('Accept', 'application/vnd.mason+json').status(204).send({info: 'The keyword was successfully deleted'});
        } catch (err) {
            console.log("Error catched: " + err);
            const payload = {
                '@error': {
                    '@message': 'Keyword does not exists',
                    '@messages': [
                        'There is no a keyword with keywordid ' + req.params.keywordid,
                    ]
                },
                'resourse_url': '/chatbot/api/keywords/' + req.params.keywordid
            }
            res.header('Accept', 'application/vnd.mason+json').status(404).send({message: payload});
        }
    });

    //Modify keywords and assiciated responses //TODO\\

    //Add new keyword
    router.post('/api/keywords/', async (req, res) => {
        
        try {
            if(!req.body.keyword || req.body.cases == null) {
                throw new ValidationError({statusCode: 400, type: 'ModelValidation', message: {}, data: {}});
            } else {
                const keywordAdd = await Keywords
                .query()
                .insert({keyword: req.body.keyword, cases: req.body.cases});

                const keywordLocation = await Keywords
                .query()
                .skipUndefined()
                .where('keyword', '=', req.body.keyword)
                .throwIfNotFound();
                
                res.header('Location', '/chatbot/api/keywords/' + keywordLocation[0].keywordid).status(201).send({info: 'The keyword is created correctly.'}); //TO BE FIXED
            }
        } catch (err){
            console.log("Error catched: " + err);

            if (err instanceof ValidationError) {
                const payload = {
                    '@error': {
                        '@message': 'Wrong request format',
                        '@messages': [
                            'Check that your parameters are correctly written and dont contain any special characters'
                        ]
                    },
                    'resource_url': '/chatbot/api/keywords/' + req.params.keywordid
                }
                res.header('Accept', 'application/vnd.mason+json').status(400).send({message: payload});
            }
        }
});

    //Get all responses
    router.get('/api/responses', async (req, res) => {
        const responses = await Responses.query();

        try {
            responses.forEach(response => {
                controls = {
                    self: {
                        href: `/chatbot/api/responses/${response.responseid}`
                    }
                }

                response['@controls'] = controls;
            })

            const payload = {
                '@namespaces': {
                    'name' : "/chatbot/namespace/",
                    'items': responses
                },

                '@controls': {
                    self: {
                        href: `/chatbot/api/responses/`
                    },
                    "chatbot:add-response": {
                        'title': 'Create response',
                        href: `/chatbot/api/responses/`,
                        'encoding': 'json',
                        'method': 'POST',
                        'schemaurl': '/chatbot/schema/response'
                    },
                    "chatbot:responses-all":  {
                        href: `chatbot/api/responses/`,
                        'title': 'All responses'
                    }
                }
            }

            res.header('Accept', 'application/vnd.mason+json').status(200).send(payload);
        } catch (err) {
            console.log(err);
            const payload = {
                '@error': {
                    '@message': 'Something went wrong',
                    '@messages': [
                        'Something went wrong while processing request'
                    ]
                },
                'resourse_url': '/chatbot/api/responses/'
            }
            res.header('Accept', 'application/vnd.mason+json').status(500).send({message: payload});
        }
    });

    //Get single response
    router.get('/api/responses/:responseid', async (req, res) => {

        try {
            const response = await Responses
            .query()
            .skipUndefined()
            .where('responseid', '=', req.params.responseid)
            .throwIfNotFound();

            const responseid = req.params.responseid;
            const keywordToSearch = response.keyword;
            console.log('keyword to search ' + keywordToSearch);

            const keyword = await Keywords
            .query()
            .skipUndefined()
            .where('keyword', '=', keywordToSearch);

            console.log('keyword is ' + JSON.stringify(keyword));

            const keywordid = keyword.keywordid;

            const payload = {
                '@namespaces': {
                    'chatbot': {
                        'name': '/chatbot/namespace/'
                    },
                    'atom-thread': {
                        'name': 'https://tools.ietf.org/html/rfc4685'
                    }
                },

                'response': response,
                'keyword': response.keyword,
                'header': response.header,
                'username': response.username,

                '@controls': {
                    self: {
                        href: `/chatbot/api/responses/${responseid}`
                    },
                    'keyword': {
                        href: `/chatbot/api/responses/${keyword.keywordid}`//needs to be fixed
                    }
                }
            }

            res.header('Accept', 'application/vnd.mason+json').status(200).send(payload);
        } catch (err) {
            console.log("Error catched: " + err);
            const payload = {
                '@error': {
                    '@message': 'Response does not exists',
                    '@messages': [
                        'There is no a response with responseid ' + req.params.responsedid,
                    ]
                },
                'resourse_url': '/chatbot/api/responses/' + req.params.responsedid
            }
            res.header('Accept', 'application/vnd.mason+json').status(404).send({message: payload});
        }
    });

    //Add new response
    router.post('/api/responses/', async (req, res) => {

        try {
            if(!req.body.response || !req.body.keyword || req.body.header == null || !req.body.username) {
                throw new ValidationError({statusCode: 400, type: 'ModelValidation', message: {}, data: {}});
            } else {
                const responseAdd = await Responses
                .query()
                .insert({response: req.body.response, keyword: req.body.keyword, header: req.body.header, username: req.body.username});

                const responseLocation = await Responses
                .query()
                .skipUndefined()
                .where('response', '=', req.body.response)
                .throwIfNotFound();
                
                res.header('Location', '/chatbot/api/responses/' + responseLocation[0].responseid).status(201).send({info: 'The response is created correctly.'});
            }
        } catch (err){
            console.log("Error catched: " + err);

            if (err instanceof ValidationError) {
                const payload = {
                    '@error': {
                        '@message': 'Wrong request format',
                        '@messages': [
                            'Check that your parameters are correctly written and dont contain any special characters'
                        ]
                    },
                    'resource_url': '/chatbot/api/responses/' + req.params.responseid
                }
                res.header('Accept', 'application/vnd.mason+json').status(400).send({message: payload});
            }
        }
    });

    //Delete single response
    router.delete('/api/responses/:responseid', async (req, res) => {
        try {
            const deletedResponse = await Responses.query()
            .delete()
            .where('responseid', '=', req.params.responseid)
            .throwIfNotFound();

            res.header('Accept', 'application/vnd.mason+json').send({status: 204, info: `The respond was successfully deleted`});
        } catch (err) {
            console.log("Error catched: " + err);
            const payload = {
                '@error': {
                    '@message': 'Response does not exists',
                    '@messages': [
                        'There is no a response with responseid ' + req.params.responseid,
                    ]
                },
                'resourse_url': '/chatbot/api/responses/' + req.params.responseid
            }
            res.header('Accept', 'application/vnd.mason+json').status(404).send({message: payload});
        }
    });

    //Modify single response
    router.patch('/api/responses/:responseid', async (req, res) => {
        const responseid = req.params.responseid;
        try {
            if(!req.body.response || !req.body.keyword || req.body.header == null || !req.body.username) {
                throw new ValidationError({statusCode: 400, type: 'ModelValidation', message: {}, data: {}});
            } else {
                const response = await Responses
                .query()
                .patch({response: req.body.response, keyword: req.body.keyword, header: req.body.header, username: req.body.username})
                .where('responseid', req.params.responseid)
                .throwIfNotFound();

                res.header('Accept', 'application/vnd.mason+json').status(204).send({info: 'The response is modified correctly.'});
            }
        } catch (err) {
            console.log("Error catched: " + err);

            if (err instanceof ValidationError) {
                const payload = {
                    '@error': {
                        '@message': 'Wrong request format',
                        '@messages': [
                            'Check that your parameters are correctly written and dont contain any special characters'
                        ]
                    },
                    'resource_url': '/chatbot/api/responses/' + req.params.responseid
                }
                res.header('Accept', 'application/vnd.mason+json').status(400).send({message: payload});
            } else if (err instanceof NotFoundError){
                const payload = {
                    '@error': {
                        '@message': 'Response does not exists',
                        '@messages': [
                            'There is no a response with responseid ' + req.params.responseid,
                        ]
                    },
                    'resourse_url': '/chatbot/api/responses/' + req.params.responseid
                }
                res.header('Accept', 'application/vnd.mason+json').status(404).send({message: payload});
            } else {
                const payload = {
                    '@error': {
                        '@message': 'Something went wrong',
                        '@messages': [
                            'Something went wrong while processing request'
                        ]
                    },
                    'resourse_url': '/chatbot/api/responses/'
                }
                res.header('Accept', 'application/vnd.mason+json').status(500).send({message: payload});
            }
        }
    });

    //Get statistics
    router.get('/api/statistics', async (req, res) => {

        try {
            const statistics = await Statistics.query();

            statistics.forEach(statistic => {
                controls = {
                    self: {
                        href: `/chatbot/api/statistics/${statistic.id}`
                    }
                }

                statistic['@controls'] = controls;
            })

            const payload = {
                '@namespaces': {
                    'name': '/chatbot/namespace/',
                    'items': statistics
                },

                '@controls': {
                    self: {
                        href: `/chatbot/api/statistics/`
                    }
                }
            }

            res.header('Accept', 'application/vnd.mason+json').status(200).send(payload);
        } catch (err) {
            console.log(err);
            const payload = {
                '@error': {
                    '@message': 'Something went wrong',
                    '@messages': [
                        'Something went wrong while processing request'
                    ]
                },
                'resourse_url': '/chatbot/api/statistics/'
            }
            res.header('Accept', 'application/vnd.mason+json').status(500).send({message: payload});
        }
    });

    //Get all users
    router.get('/api/users/', async (req, res) => {

        try {
            const users = await Users.query();

            users.forEach(user => {
                controls = {
                    self: {
                        href: `/chatbot/api/users/${user.id}`
                    }
                }

                user['@controls'] = controls;
            })

            const payload = {
                '@namespaces': {
                    'name': '/chatbot/namespace/',
                    'items': users
                },

                '@controls': {
                    self: {
                        href: `/chatbot/api/users/`
                    },
                    "chatbot:add-user": {
                        'title': 'Create user',
                        href: `/chatbot/api/users/`,
                        'encoding': 'json',
                        'method': 'POST',
                        'schemaurl': '/chatbot/schema/user'
                    },
                    "chatbot:users-all":  {
                        href: `chatbot/api/users/`,
                        'title': 'All users'
                    }
                }
            }

            res.header('Accept', 'application/vnd.mason+json').status(200).send(payload);
        } catch (err) {
            console.log(err);
            const payload = {
                '@error': {
                    '@message': 'Something went wrong',
                    '@messages': [
                        'Something went wrong while processing request'
                    ]
                },
                'resourse_url': '/chatbot/api/users/'
            }
            res.header('Accept', 'application/vnd.mason+json').status(500).send({message: payload});
        }
    });

    //Get single user
    router.get('/api/users/:id', async (req, res) => {

        try {
            const user = await Users
            .query()
            .skipUndefined()
            .where('id', '=', req.params.id)
            .throwIfNotFound();

            const userid = req.params.id;

            const payload = {
                '@namespaces': {
                    'chatbot': {
                        'name': '/chatbot/namespace'
                    },
                    'atom-thread': {
                        'name': 'https://tools.ietf.org/html/rfc4685'
                    }
                },

                'user': user,
                'username': user.username,
                'lastlogin': user.lastlogin,
                'replies': user.replies,
                'latesreply': user.latesreply,

                '@controls': {
                    self: {
                        href: `/chatbot/api/users/${userid}`
                    }
                }
            }

            res.header('Accept', 'application/vnd.mason+json').status(200).send(payload);
        } catch (err) {
            console.log("Error catched: " + err);
            const payload = {
                '@error': {
                    '@message': 'User does not exists',
                    '@messages': [
                        'There is no a user with id ' + req.params.id,
                    ]
                },
                'resourse_url': '/chatbot/api/users/' + req.params.id
            }
            res.header('Accept', 'application/vnd.mason+json').status(404).send({message: payload});
        }
    });

    //Modify single user
    router.patch('/api/users/:id', async (req, res) => {
        const userid = req.params.id;
        try {
            if(!req.body.keyword || req.body.cases == null) {
                throw new ValidationError({statusCode: 400, type: 'ModelValidation', message: {}, data: {}});
            } else {
                const user = await Keywords
                .query()
                .patch({username: req.body.username})
                .where('id', req.params.id)
                .throwIfNotFound();

                res.header('Accept', 'application/vnd.mason+json').status(204).send({info: 'The user is modified correctly.'});
            }
        } catch (err) {
            console.log("Error catched: " + err);

            if (err instanceof ValidationError) {
                const payload = {
                    '@error': {
                        '@message': 'Wrong request format',
                        '@messages': [
                            'Check that your parameters are correctly written and dont contain any special characters'
                        ]
                    },
                    'resource_url': '/chatbot/api/users/' + req.params.id
                }
                res.header('Accept', 'application/vnd.mason+json').status(400).send({message: payload});
            } else if (err instanceof NotFoundError){
                const payload = {
                    '@error': {
                        '@message': 'User does not exists',
                        '@messages': [
                            'There is no a user with id ' + req.params.id,
                        ]
                    },
                    'resourse_url': '/chatbot/api/users/' + req.params.id
                }
                res.header('Accept', 'application/vnd.mason+json').status(404).send({message: payload});
            } else {
                const payload = {
                    '@error': {
                        '@message': 'Something went wrong',
                        '@messages': [
                            'Something went wrong while processing request'
                        ]
                    },
                    'resourse_url': '/chatbot/api/users/'
                }
                res.header('Accept', 'application/vnd.mason+json').status(500).send({message: payload});
            }
        }
    });
    

    //Remove single user
    router.delete('/api/users/:id', async (req, res) => {

        try {
            const deletedUser = await Users.query()
            .deleteById(req.params.id)
            .throwIfNotFound();

            res.header('Accept', 'application/vnd.mason+json').status(204).send({info: 'User was successfully deleted'});
        } catch (err) {
            console.log("Error catched: " + err);
            const payload = {
                '@error': {
                    '@message': 'User does not exists',
                    '@messages': [
                        'There is no a user with id ' + req.params.id,
                    ]
                },
                'resourse_url': '/chatbot/api/users/' + req.params.id
            }
            res.header('Accept', 'application/vnd.mason+json').status(404).send({message: payload});
        }
    });

    //Modify users //TODO\\

    //Add new user
    router.post('/api/users/', async (req, res) => {
        try {
            if(!req.body.username) {
                throw new ValidationError({statusCode: 400, type: 'ModelValidation', message: {}, data: {}});
            } else {
                const userAdd = await Users
                .query()
                .insert({username: req.body.username});

                const userLocation = await Users
                .query()
                .skipUndefined()
                .where('username', '=', req.body.username)
                .throwIfNotFound();

                res.header('Location', '/chatbot/api/users/' + userLocation[0].id).status(201).send({info: 'The user is created correctly.'});
            }
        } catch (err){
            console.log("Error catched: " + err);

            if (err instanceof ValidationError) {
                const payload = {
                    '@error': {
                        '@message': 'Wrong request format',
                        '@messages': [
                            'Check that your parameters are correctly written and dont contain any special characters'
                        ]
                    },
                    'resource_url': '/chatbot/api/users/' + req.params.id
                }
                res.header('Accept', 'application/vnd.mason+json').status(400).send({message: payload});
            }
        }
    });

    //Error handling
    const {
        ValidationError,
        NotFoundError
    } = require('objection');
  
    const {
        DBError,
        ConstraintViolationError,
        UniqueViolationError,
        NotNullViolationError,
        ForeignKeyViolationError,
        CheckViolationError,
        DataError
    } = require('objection-db-errors');
  
    //`res` is an express response object.
    function errorHandler(err, res) {
        if (err instanceof ValidationError) {
        switch (err.type) {
            case 'ModelValidation':
            res.status(400).send({
                message: err.message,
                type: 'ModelValidation',
                data: err.data
            });
            break;
            case 'RelationExpression':
            res.status(400).send({
                message: err.message,
                type: 'InvalidRelationExpression',
                data: {}
            });
            break;
            case 'UnallowedRelation':
            res.status(400).send({
                message: err.message,
                type: 'UnallowedRelation',
                data: {}
            });
            break;
            case 'InvalidGraph':
            res.status(400).send({
                message: err.message,
                type: 'InvalidGraph',
                data: {}
            });
            break;
            default:
            res.status(400).send({
                message: err.message,
                type: 'UnknownValidationError',
                data: {}
            });
            break;
        }
        } else if (err instanceof NotFoundError) {
        res.status(404).send({
            message: err.message,
            type: 'NotFound',
            data: {}
        });
        } else if (err instanceof UniqueViolationError) {
        res.status(409).send({
            message: err.message,
            type: 'UniqueViolation',
            data: {
            columns: err.columns,
            table: err.table,
            constraint: err.constraint
            }
        });
        } else if (err instanceof NotNullViolationError) {
        res.status(400).send({
            message: err.message,
            type: 'NotNullViolation',
            data: {
            column: err.column,
            table: err.table,
            }
        });
        } else if (err instanceof ForeignKeyViolationError) {
        res.status(409).send({
            message: err.message,
            type: 'ForeignKeyViolation',
            data: {
            table: err.table,
            constraint: err.constraint
            }
        });
        } else if (err instanceof CheckViolationError) {
        res.status(400).send({
            message: err.message,
            type: 'CheckViolation',
            data: {
            table: err.table,
            constraint: err.constraint
            }
        });
        } else if (err instanceof DataError) {
        res.status(400).send({
            message: err.message,
            type: 'InvalidData',
            data: {}
        });
        } else if (err instanceof DBError) {
        res.status(500).send({
            message: err.message,
            type: 'UnknownDatabaseError',
            data: {}
        });
        } else {
        res.status(500).send({
            message: err.message,
            type: 'UnknownError',
            data: {}
        });
        }
    }
};