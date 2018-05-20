//Code from ObjectionJS documentation https://vincit.github.io/objection.js
//and ES6 example project https://github.com/Vincit/objection.js/tree/master/examples/express-es6

const {transaction} = require('objection');
const Keywords = require('../models/keywordsModel');
const Users = require('../models/usersModel');
const Responses = require('../models/responsesModel');
const Statistics = require('../models/statisticsModel');

//Requires for error handling
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

module.exports = router => {
    //Get all keywords//
    /* Sends GET requests to retrieve all keywords from database
    
    INPUT PARAMETERS:
       None
    
    OUTPUT FORMAT:
    {
        @namespaces: {
        name: "/chatbot/namespace/",
        items: [
            {keywordid0}, {keywordid1}, ..., {keywordidn}
        ]
    },
    @controls: {
        self: {
            href: "/chatbot/api/keywords/"
        },
        chatbot:add-keyword: {
            title: "Create keyword",
            href: "/chatbot/api/keywords/",
            encoding: "json",
            method: "POST",
            schemaurl: "/chatbot/schema/keyword"
        },
            chatbot:keywords-all: {
            href: "chatbot/api/keywords/",
            title: "All keywords"
            }
          }
        }

    SERIALIZATION FOR EACH KEYWORD:
    controls = {
                self: {
                    href: `/chatbot/api/keywords/${keyword.keywordid}`
                }
            }

    RESPONSES:
    Succes: returns status 200
    Failure: returns status 500
    */
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

            res.header('Accept', 'application/vnd.mason+json').status(200).send({payload});
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
    /* Sends GET requests to retrieve single keyword from database
    
    INPUT PARAMETERS:
    keywordid - ID of the keyword retrieved from database
    
    OUTPUT FORMAT:
    {
    @namespaces: {
        chatbot: {
            name: "/chatbot/namespace/"
        },
        atom-thread: {
            name: "https://tools.ietf.org/html/rfc4685"
        }
    },
    keyword: [
        {
            keywordid: <id of keyword>,
            keyword: <keyword>,
            cases: <cases for keyword>
        }
    ],
    @controls: {
        self: {
            href: "/chatbot/api/keywords/{keywordid}"
            }
        }
    }

    RESPONSES:
    Succes: returns status 200
    Failure, not found : returns status 404
    */
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

            updateStatistics(keyword, 'Anonymous');
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
    /* Sends PATCH requests to modify single keyword from database
    
    INPUT PARAMETERS:
    keywordid - ID of the keyword retrieved from database

    INPUT BODY FORMAT:
    {
        "keyword": "<newKeyword>",
        "cases": <numberOfCases>
    }

    RESPONSES:
    Succes: returns status 204
    Failure, wrong request format: returns status 400
    Failure, keyword not found: returns status 404
    Failure, same keyword already in database: returns status 409
    Failure, internal server error: returns status 500
    */
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

                modifyStatEntry(keywordid, req.body.keyword);
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
            } else if (err.errno == 19) {
                const payload = {
                    '@error': {
                        '@message': 'Keyword already exists in database',
                        '@messages': [
                            'Check that keyword you are trying to edit does not match with already existing keyword in database'
                        ]
                    },
                    'resource_url': '/chatbot' + req.originalUrl
                }
                res.header('Accept', 'application/vnd.mason+json').status(409).send({message: payload});
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
    /* Sends DELETE requests to remove single keyword from database
    
    INPUT PARAMETERS:
    keywordid - ID of the keyword to be removed from database

    RESPONSES:
    Succes: returns status 204
    Failure, keyword not found: returns status 404
    */
    router.delete('/api/keywords/:keywordid', async (req, res) => {
        
        try {
            const statKeywordRemoved = await Keywords
            .query()
            .where('keywordid', '=', req.params.keywordid);

            const deletedKeyword = await Keywords.query()
            .delete()
            .where('keywordid', '=', req.params.keywordid)
            .throwIfNotFound();

            removeStatEntry(statKeywordRemoved);
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
    /* Sends POST requests to add single keyword to database
    
    INPUT PARAMETERS:
     None

    INPUT BODY FORMAT:
    {
        "keyword": "<newKeyword>",
        "cases": <numberOfCases>
    }

    RESPONSES:
    Succes: returns status 201
    Failure, wrong request format: returns status 400
    Failure, same keyword already in database: returns status 409
    Failure, internal server error: returns status 500
    */
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
                    
                    createStatEntry(keywordLocation);
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
                    'resource_url': '/chatbot' + req.originalUrl
                }
                res.header('Accept', 'application/vnd.mason+json').status(400).send({message: payload});
            } else if (err.errno == 19) {
                const payload = {
                    '@error': {
                        '@message': 'Keyword already exists in database',
                        '@messages': [
                            'Check that keyword you are trying to add does not already exists in database'
                        ]
                    },
                    'resource_url': '/chatbot' + req.originalUrl
                }
                res.header('Accept', 'application/vnd.mason+json').status(409).send({message: payload});
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

    //Get all responses
    /* Sends GET requests to retrieve all responses from database
    
    INPUT PARAMETERS:
       None
    
    OUTPUT FORMAT:
    {
        @namespaces: {
        name: "/chatbot/namespace/",
        items: [
            {responseid0}, {responseid1}, ..., {responseidn}
        ]
    },
    @controls: {
        self: {
            href: "/chatbot/api/responses/"
        },
        chatbot:add-resonse: {
            title: "Create response",
            href: "/chatbot/api/responses/",
            encoding: "json",
            method: "POST",
            schemaurl: "/chatbot/schema/response"
        },
            chatbot:responses-all: {
            href: "chatbot/api/responses/",
            title: "All responses"
            }
          }
        }

    SERIALIZATION FOR EACH RESPONSE:
    controls = {
                self: {
                    href: `/chatbot/api/keywords/${response.responseid}`
                }
            }

    RESPONSES:
    Succes: returns status 200
    Failure: returns status 500
    */
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
    /* Sends GET requests to retrieve single response from database
    
    INPUT PARAMETERS:
    responseid - ID of the response retrieved from database
    
    OUTPUT FORMAT:
    {
    @namespaces: {
        chatbot: {
            name: "/chatbot/namespace/"
        },
        atom-thread: {
            name: "https://tools.ietf.org/html/rfc4685"
        }
    },
    response: [
        {
            responseid: <id of response>,
            response: <response>,
            keyword: <keyword for response>
            header: <header for response>
            username: <user related to response>
        }
    ],
    @controls: {
        self: {
            href: "/chatbot/api/responses/{responseid}"
            }
        }
    }

    RESPONSES:
    Succes: returns status 200
    Failure, not found : returns status 404
    */
    router.get('/api/responses/:responseid', async (req, res) => {

        try {
            const response = await Responses
            .query()
            .skipUndefined()
            .where('responseid', '=', req.params.responseid)
            .throwIfNotFound();

            const responseid = req.params.responseid;
            const keywordToSearch = response[0].keyword;
            console.log('keyword to search ' + keywordToSearch);

            
            const keyword = await Keywords
            .query()
            .skipUndefined()
            .where('keyword', '=', keywordToSearch);
            console.log(JSON.stringify(keyword));

            const keywordid = keyword[0].keywordid;

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
                        href: `/chatbot/api/keywords/${keywordid}`
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
    /* Sends POST requests to add single response to database
    
    INPUT PARAMETERS:
     None

    INPUT BODY FORMAT:
    {
        "response": "<newResponse>",
        "keyword": "<newAssociatedKeyword>",
        "header": "<newHeader>",
        "username": "<newUsername>"
    }

    RESPONSES:
    Succes: returns status 201
    Failure, wrong request format: returns status 400
    Failure, same keyword already in database: returns status 409
    Failure, internal server error: returns status 500
    */
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
                    'resource_url': '/chatbot' + req.originalUrl
                }
                res.header('Accept', 'application/vnd.mason+json').status(400).send({message: payload});
            } else if (err.errno == 19) {
                const payload = {
                    '@error': {
                        '@message': 'Response already exists in database',
                        '@messages': [
                            'Check that resonse you are trying to add does not already exists in database'
                        ]
                    },
                    'resource_url': '/chatbot' + req.originalUrl
                }
                res.header('Accept', 'application/vnd.mason+json').status(409).send({message: payload});
            } else {
                const payload = {
                    '@error': {
                        '@message': 'Something went wrong',
                        '@messages': [
                            'Something went wrong while processing request'
                        ]
                    },
                    'resourse_url': '/chatbot' + req.originalUrl
                }
                res.header('Accept', 'application/vnd.mason+json').status(500).send({message: payload});
            }
        }
    });

    //Delete single response
    /* Sends DELETE requests to remove single response from database
    
    INPUT PARAMETERS:
    responseid - ID of the response to be removed from database

    RESPONSES:
    Succes: returns status 204
    Failure, keyword not found: returns status 404
    */
    router.delete('/api/responses/:responseid', async (req, res) => {
        try {
            const deletedResponse = await Responses.query()
            .delete()
            .where('responseid', '=', req.params.responseid)
            .throwIfNotFound();

            res.header('Accept', 'application/vnd.mason+json').status(204).send({info: 'The respond was successfully deleted'});
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
    /* Sends PATCH requests to modify single response from database
    
    INPUT PARAMETERS:
    responseid - ID of the response to be modified from database

    INPUT BODY FORMAT:
    {
        "response": "<newResponse>",
        "keyword": "<newKeyword>",
        "header": "<newHeader>",
        "username": "<newUsername>"
    }

    RESPONSES:
    Succes: returns status 204
    Failure, wrong request format: returns status 400
    Failure, keyword not found: returns status 404
    Failure, same keyword already in database: returns status 409
    Failure, internal server error: returns status 500
    */
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
            } else if (err.errno == 19) {
                const payload = {
                    '@error': {
                        '@message': 'Response already exists in database',
                        '@messages': [
                            'Check that response you are trying to edit does not match already existing response in database'
                        ]
                    },
                    'resource_url': '/chatbot' + req.originalUrl
                }
                res.header('Accept', 'application/vnd.mason+json').status(409).send({message: payload});
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
    /* Sends GET requests to retrieve all statistics from database
    
    INPUT PARAMETERS:
       None
    
    OUTPUT FORMAT:
    {
        @namespaces: {
        name: "/chatbot/namespace/",
        items: [
            {statisticid0}, {statistiid1}, ..., {statistiidn}
        ]
    },
    @controls: {
        self: {
            href: "/chatbot/api/keywords/"
        },
            chatbot:statistics-all: {
            href: "chatbot/api/statistics/",
            title: "All statistics"
            }
          }
        }

    SERIALIZATION FOR EACH STATISTIC:
    controls = {
                self: {
                    href: `/chatbot/api/statistics/${statistic.statisticid}`
                }
            }

    RESPONSES:
    Succes: returns status 200
    Failure: returns status 500
    */
    router.get('/api/statistics', async (req, res) => {

        try {
            const statistics = await Statistics.query();

            statistics.forEach(statistic => {
                controls = {
                    self: {
                        href: `/chatbot/api/statistics/${statistic.statisticid}`
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
                    },
                    "chatbot:statistics-all":  {
                        href: `chatbot/api/statistics/`,
                        'title': 'All statistics'
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

    //Get single keyword statistics
    /* Sends GET requests to retrieve single statistic for keyword from database
    
    INPUT PARAMETERS:
    statisticid - ID of the statistic retrieved from database
    
    OUTPUT FORMAT:
    {
    @namespaces: {
        chatbot: {
            name: "/chatbot/namespace/"
        },
        atom-thread: {
            name: "https://tools.ietf.org/html/rfc4685"
        }
    },
    response: [
        {
            statisticid: <id of statistic>,
            keyword: <keyword for statistic>,
            keywordused: <times keyword is accessed>,
            lastuse: <time when keyword was last used>,
            latestuser: <latest user of keyword>
        }
    ],
    @controls: {
        self: {
            href: "/chatbot/api/statistics/{statisticid}"
            }
        }
    }

    RESPONSES:
    Succes: returns status 200
    Failure, not found : returns status 404
    */
    router.get('/api/statistics/:statisticid', async (req, res) => {

        try {
            const statistic = await Statistics
            .query()
            .skipUndefined()
            .where('statisticid', '=', req.params.statisticid)
            .throwIfNotFound();

            const statisticid = req.params.statisticid;

            const payload = {
                '@namespaces': {
                    'chatbot': {
                        'name': '/chatbot/namespace'
                    },
                    'atom-thread': {
                        'name': 'https://tools.ietf.org/html/rfc4685'
                    }
                },

                'statistic': statistic,
                'statisticid': statisticid,
                'keyword': statisticid.keyword,
                'keywordused': statisticid.keywordused,
                'lastuse': statisticid.lastuse,
                'latestuser': statisticid.latestuser,

                '@controls': {
                    self: {
                        href: `/chatbot/api/statistics/${statisticid}`
                    }
                }
            }

            res.header('Accept', 'application/vnd.mason+json').status(200).send(payload);
        } catch (err) {
            console.log("Error catched: " + err);
            const payload = {
                '@error': {
                    '@message': 'Statistic does not exists',
                    '@messages': [
                        'There is no a statistic with statisticid ' + req.params.statisticid,
                    ]
                },
                'resourse_url': '/chatbot/api/statistics/' + req.params.statisticid
            }
            res.header('Accept', 'application/vnd.mason+json').status(404).send({message: payload});
        }
    });

    //Get all users
    /* Sends GET requests to retrieve all users from database
    
    INPUT PARAMETERS:
       None
    
    OUTPUT FORMAT:
    {
        @namespaces: {
        name: "/chatbot/namespace/",
        items: [
            {id0}, {id1}, ..., {idn}
        ]
    },
    @controls: {
        self: {
            href: "/chatbot/api/users/"
        },
        chatbot:add-user: {
            title: "Create user",
            href: "/chatbot/api/users/",
            encoding: "json",
            method: "POST",
            schemaurl: "/chatbot/schema/user"
        },
            chatbot:users-all: {
            href: "chatbot/api/users/",
            title: "All users"
            }
          }
        }

    SERIALIZATION FOR EACH USER:
    controls = {
                self: {
                    href: `/chatbot/api/users/${user.id}`
                }
            }

    RESPONSES:
    Succes: returns status 200
    Failure: returns status 500
    */
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
    /* Sends GET requests to retrieve single user from database
    
    INPUT PARAMETERS:
    id - ID of the user retrieved from database
    
    OUTPUT FORMAT:
    {
    @namespaces: {
        chatbot: {
            name: "/chatbot/namespace/"
        },
        atom-thread: {
            name: "https://tools.ietf.org/html/rfc4685"
        }
    },
    user: [
        {
            id: <id of user>,
            username: <username of user>,
            lastlogin: <when user login last time>,
            replies: <replies sent by user>,
            latestreply: <latest replý by user>
        }
    ],
    @controls: {
        self: {
            href: "/chatbot/api/users/{id}"
            }
        }
    }

    RESPONSES:
    Succes: returns status 200
    Failure, not found : returns status 404
    */
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
    /* Sends PATCH requests to modify single user from database
    
    INPUT PARAMETERS:
    id - ID of the user to be modified from database

    INPUT BODY FORMAT:
    {
        "username": "<newUsername>"
    }

    RESPONSES:
    Succes: returns status 204
    Failure, wrong request format: returns status 400
    Failure, keyword not found: returns status 404
    Failure, same keyword already in database: returns status 409
    Failure, internal server error: returns status 500
    */
    router.patch('/api/users/:id', async (req, res) => {
        const userid = req.params.id;
        try {
            if(!req.body.username) {
                throw new ValidationError({statusCode: 400, type: 'ModelValidation', message: {}, data: {}});
            } else {
                const user = await Users
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
            } else if (err.errno == 19) {
                const payload = {
                    '@error': {
                        '@message': 'User already exists in database',
                        '@messages': [
                            'Check that user you are trying to edit does not match with already existing user in database'
                        ]
                    },
                    'resource_url': '/chatbot' + req.originalUrl
                }
                res.header('Accept', 'application/vnd.mason+json').status(409).send({message: payload});
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
    /* Sends DELETE requests to remove single user from database
    
    INPUT PARAMETERS:
    id - ID of the user to be removed from database

    RESPONSES:
    Succes: returns status 204
    Failure, keyword not found: returns status 404
    */
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
    /* Sends POST requests to add single user to database
    
    INPUT PARAMETERS:
     None

    INPUT BODY FORMAT:
    {
        "username": "<newUsername>"
    }

    RESPONSES:
    Succes: returns status 201
    Failure, wrong request format: returns status 400
    Failure, same keyword already in database: returns status 409
    Failure, internal server error: returns status 500
    */
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
                    'resource_url': '/chatbot' + req.originalUrl
                }
                res.header('Accept', 'application/vnd.mason+json').status(400).send({message: payload});
            } else if (err.errno == 19) {
                const payload = {
                    '@error': {
                        '@message': 'User already exists in database',
                        '@messages': [
                            'Check that user you are trying to add does not already exists in database'
                        ]
                    },
                    'resource_url': '/chatbot' + req.originalUrl
                }
                res.header('Accept', 'application/vnd.mason+json').status(409).send({message: payload});
            } else {
                const payload = {
                    '@error': {
                        '@message': 'Something went wrong',
                        '@messages': [
                            'Something went wrong while processing request'
                        ]
                    },
                    'resourse_url': '/chatbot' + req.originalUrl
                }
                res.header('Accept', 'application/vnd.mason+json').status(500).send({message: payload});
            }
        }
    });

    //GET all channels
    /*
    *THIS FEATURE HAS NOT BEEN IMPLEMENTED
    */
    router.get('/api/channels', async (req, res) => {
        try {
            const payload = {
                '@error': {
                    '@message': 'This feature has not been implemented yet'
                },
                'resource_url': '/chatbot' + req.originalUrl
                }
            res.header('Accept', 'application/vnd.mason+json').status(501).send({message: payload});
        } catch (err) {
            console.log(err);
            const payload = {
                '@error': {
                    '@message': 'Something went wrong',
                    '@messages': [
                        'Something went wrong while processing request'
                    ]
                },
                'resourse_url': '/chatbot' + req.originalUrl
            }
            res.header('Accept', 'application/vnd.mason+json').status(500).send({message: payload});
        }
    });

    //GET single channel
    /*
    *THIS FEATURE HAS NOT BEEN IMPLEMENTED
    */
    router.get('/api/channels/:channelid', async (req, res) => {
        try {
            const payload = {
                '@error': {
                    '@message': 'This feature has not been implemented yet'
                },
                'resource_url': '/chatbot' + req.originalUrl
                }
            res.header('Accept', 'application/vnd.mason+json').status(501).send({message: payload});
        } catch (err) {
            console.log(err);
            const payload = {
                '@error': {
                    '@message': 'Something went wrong',
                    '@messages': [
                        'Something went wrong while processing request'
                    ]
                },
                'resourse_url': '/chatbot' + req.originalUrl
            }
            res.header('Accept', 'application/vnd.mason+json').status(500).send({message: payload});
        }
    });

    //GET search results
    /*
    *THIS FEATURE HAS NOT BEEN IMPLEMENTED
    */
    router.get('/api/search', async (req, res) => {
        try {
            const payload = {
                '@error': {
                    '@message': 'This feature has not been implemented yet'
                },
                'resource_url': '/chatbot' + req.originalUrl
                }
            res.header('Accept', 'application/vnd.mason+json').status(501).send({message: payload});
        } catch (err) {
            console.log(err);
            const payload = {
                '@error': {
                    '@message': 'Something went wrong',
                    '@messages': [
                        'Something went wrong while processing request'
                    ]
                },
                'resourse_url': '/chatbot' + req.originalUrl
            }
            res.header('Accept', 'application/vnd.mason+json').status(500).send({message: payload});
        }
    });

    //Function to update statistics
    const updateStatistics = async (keyword, user) => {
        var timeStamp = new Date();
        var dateTime = timeStamp.getFullYear() + '-'
                        + timeStamp.getMonth() + '-'
                        + timeStamp.getDate() + ' @ '
                        + timeStamp.getHours() + ':'
                        + timeStamp.getMinutes() + ':'
                        + timeStamp.getSeconds();
        try {
            const keywordStats = await Statistics
            .query()
            .where('keyword', '=', keyword[0].keyword);

            var timesUsed = keywordStats[0].keywordused + 1;
            
            const updatedStats = await Statistics
            .query()
            .patch({keywordused: timesUsed, lastuse: timeStamp})
            .where('keyword', '=', keyword[0].keyword);
        } catch (err) {
            console.log(err);
        }
    };

    //Function to add statistics table entry for new keyword
    const createStatEntry = async (keyword) => {
        try {
            const newStatEntry = await Statistics
            .query()
            .insert({keyword: keyword[0].keyword});
        } catch (err) {
            console.log(err);
        }
    };

    //Function to modify statistics table entry for modified keyword
     const modifyStatEntry = async (oldKeywordid, newKeyword) => {
        try {
            const keywordToPatch = await Keywords
            .query()
            .skipUndefined()
            .where('keywordid', '=', oldKeywordid)

            const patchStatEntry = await Statistics
            .query()
            .patch({keyword: newKeyword})
            .where('keyword', '=', keywordToPatch[0].keyword);
        } catch (err) {
            console.log(err);
        }
     };

    //Function to remove statistics table entry when keyword is removed
    const removeStatEntry = async (keyword) => {
        try {
            const statEntryRemove = await Statistics
            .query()
            .delete()
            .where('keyword', '=', keyword[0].keyword);
        } catch (err) {
            console.log(err);
        }
    };
};