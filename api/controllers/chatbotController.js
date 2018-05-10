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
        const keywords = await Keywords.query();

        if (!keywords) {
            throw createStatusCodeError(404);
        }

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
    });

    //Get single keyword (may need changes to naming)
    router.get('/api/keywords/:keywordid', async (req, res) => {

        const keyword = await Keywords
         .query()
         .skipUndefined()
         .where('keywordid', '=', req.params.keywordid);

        if (!keyword) {
            throw createStatusCodeError(404);
        }

        res.send(keyword);
    });

    //Modify single keyword //TODO\\

    //Remove single keyword (may need changes to naming)
    router.delete('/api/keywords/:keywordid', async (req, res) => {
        await Keywords.query()
        .delete()
        .where('keywordid', '=', req.params.keyword)

        res.send({});
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

        if (!responses) {
            throw createStatusCodeError(404);
        }


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
    });

    //Get single response (may need changes to naming)
    router.get('/api/responses/:responseid', async (req, res) => {

        const response = await Responses
         .query()
         .skipUndefined()
         .where('responseid', '=', req.params.responseid);

        if (!response) {
            throw createStatusCodeError(404);
        }

        res.send(response);
    });

    //Add new response
    router.post('/api/responses', async (req, res) => {
        const response = await Responses.query();

        const addResponse = await response.insert(req.body);
        res.send(addResponse);
    });

    //Delete single response
    router.delete('/api/responses/:responseid', async (req, res) => {
        await Keywords.query().deleteById(req.params.id);

        res.send({});
    });

    //Modify single response
    router.patch('/api/responses/:responseid', async (req, res) => {
        const response = await Responses.query().patchAndFetchById(req.params.id, req.body);

        res.send(response);
    });

    //Get statistics
    router.get('/api/statistics', async (req, res) => {
        const statistics = await Statistics.query();

        if (!statistics) {
            throw createStatusCodeError(404);
        }

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
    });

    //Get all users
    router.get('/api/users', async (req, res) => {
        const users = await Users.query();

        if (!users) {
            throw createStatusCodeError(404);
        }

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
    });

    //Get single user (may need changes to naming)
    router.get('/api/users/:id', async (req, res) => {
        const user = await Users
         .query()
         .skipUndefined()
         .where('id', '=', req.params.id);

         if (!user) {
            throw createStatusCodeError(404);
        }

         res.send(user);
    });

    //Modify single user //TODO\\

    //Remove single user (may need changes to naming)
    router.delete('/api/users/:id', async (req, res) => {
        /*await Users.query()
        .delete()
        .where('id', req.params.id)*/

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