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

            res.send(payload);
        } catch (e) {
            console.log(e);
            throw createStatusCodeError(404);
        }
    });

    //Get single keyword
    router.get('/api/keywords/:keywordid', async (req, res) => {
        
        try {
            const keyword = await Keywords
            .query()
            .skipUndefined()
            .where('keywordid', '=', req.params.keywordid);

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

            res.send(payload);
        } catch (e) {
            console.log(e);
            throw createStatusCodeError(404);
        }
    });

    //Modify single keyword //TODO\\
    router.patch('/api/keywords/:keywordid', async (req, res) => {
        const keywordid = req.params.keywordid;
        try {
            const keyword = await Keywords
            .query()
            .patch({keyword: req.body.keyword, cases: req.body.cases})
            .where('keywordid', req.params.keywordid);
        } catch (e) {
            console.log(e);
            throw createStatusCodeError(404);
            /*const payload = {
                '@error': {
                    '@message': 'Keyword does not exists',
                    '@messages': [
                        'There is no a keyword with id ${keywordid}'
                    ]
                },
                'resourse_url': '/chatbot/api/keywords/${keywordid}'
            }*/
        }

        res.send({});
    });

    //Remove single keyword (may need changes to naming)
    router.delete('/api/keywords/:keywordid', async (req, res) => {
        
        try {
            const deletedKeyword = await Keywords.query()
            .delete()
            .where('keywordid', '=', req.params.keywordid);
            res.send({status: 200, info: `Deleted ${deletedKeyword} row(s)`});
        } catch (e) {
            console.log(e);
            throw createStatusCodeError(404);
        }
    });

    //Modify keywords and assiciated responses //TODO\\

    //Add new keyword
    router.post('/api/keywords', async (req, res) => {
        /*const keyword = await Keywords.query();

        const addKeyword = await keyword.insert(keywords, null ,req.body);
        res.send(addKeyword);
        let keywordToAdd = req.body.keyword;
        let casesToAdd = req.body.cases;

        console.log("keyword to add is: " + keywordToAdd);
        console.log(casesToAdd);

        const keyword = await Keywords
        .query()
        .insert({keyword: keywordToAdd, cases: casesToAdd});*/
        const graph = req.body;
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

            res.send(payload);
        } catch (e) {
            console.log (e);
            throw createStatusCodeError(404);
        }
    });

    //Get single response
    router.get('/api/responses/:responseid', async (req, res) => {

        try {
            const response = await Responses
            .query()
            .skipUndefined()
            .where('responseid', '=', req.params.responseid);

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

            res.send(payload);
        } catch (e) {
            console.log(e);
            throw createStatusCodeError(404);
        }
    });

    //Add new response
    router.post('/api/responses', async (req, res) => {
        const response = await Responses.query();

        const addResponse = await response.insert(req.body);
        res.send(addResponse);
    });

    //Delete single response
    router.delete('/api/responses/:responseid', async (req, res) => {
        try {
            const deletedResponse = await Responses.query()
            .delete()
            .where('responseid', '=', req.params.responseid);
            res.send({status: 200, info: `Deleted ${deletedResponse} row(s)`});
        } catch (e) {
            console.log(e);
            throw createStatusCodeError(404);
        }
    });

    //Modify single response
    router.patch('/api/responses/:responseid', async (req, res) => {
        /*const responseid = req.params.responseid;
        try {
            const response = await Responses
            .query()
            .patch({response: req.body.response, keyword: req.body.keyword, header: req.body.header, username: req.body.username})
            .where('responseid', req.params.responseid);
        } catch (e) {
            console.log(e);
            throw createStatusCodeError(404);
            const payload = {
                '@error': {
                    '@message': 'Response does not exists',
                    '@messages': [
                        'There is no a response with id ${responseid}'
                    ]
                },
                'resourse_url': '/chatbot/api/responses/${responseid}'
            }
        }

        res.send({});*/
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

            res.send(payload);
        } catch (e) {
            console.log(e);
            throw createStatusCodeError(404);
        }
    });

    //Get all users
    router.get('/api/users', async (req, res) => {

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

            res.send(payload);
        } catch (e) {
            console.log(e);
            throw createStatusCodeError(404);
        }
    });

    //Get single user (may need changes to naming)
    router.get('/api/users/:id', async (req, res) => {

        try {
            const user = await Users
            .query()
            .skipUndefined()
            .where('id', '=', req.params.id);

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

            res.send(payload);
        } catch (e) {
            console.log(e);
            throw createStatusCodeError(404);
        }
    });

    //Modify single user
    router.patch('/api/users/:id', async (req, res) => {
        const userid = req.params.id;
        try {
            const user = await Keywords
            .query()
            .patch({username: req.body.username})
            .where('id', req.params.id);
        } catch (e) {
            console.log(e);
            throw createStatusCodeError(404);
            /*const payload = {
                '@error': {
                    '@message': 'Keyword does not exists',
                    '@messages': [
                        'There is no a keyword with id ${keywordid}'
                    ]
                },
                'resourse_url': '/chatbot/api/keywords/${keywordid}'
            }*/
        }

        res.send({});
    });
    

    //Remove single user (may need changes to naming)
    router.delete('/api/users/:id', async (req, res) => {

        try {
            const deletedUser = await Users.query().deleteById(req.params.id);
            res.send({status: 200, info: `Deleted ${deletedUser} row(s)`});
        } catch (e) {
            console.log(e);
            throw createStatusCodeError(404);
        }
    });

    //Modify users //TODO\\

    //Add new user
    router.post('/api/users', async (req, res) => {
        const user = await Users.query();

        const addUser = await user.insert(req.body);
        res.send(addUser);
    });

    //Error handling. Handled in server.js
    function createStatusCodeError(statusCode) {
        return Object.assign(new Error(), {
            statusCode
        });
    }
};