//Code from ObjectionJS documentation https://vincit.github.io/objection.js
//and ES6 example project https://github.com/Vincit/objection.js/tree/master/examples/express-es6
'use strict'

const {transaction} = require('objection');
const Keywords = require('./api/models/Keywords');
const Users = require('./api/models/Users');
const Responses = require('./api/models/Responses');
const Statistics = require('./api/models/Statistics');

module.exports = router => {
    //Get all keywords
    router.get('/keywords', async (req, res) => {
        const keyword = await Keywords.query();

        if (!keyword) {
            throw createStatusCodeError(404);
        }

        res.send(keyword);
    });

    //Get single keyword (may need changes to naming)
    router.get('/keywords', async (req, res) => {
        const keyword = await Keywords.query()
         .skipUndefined()
         .where('keyword', req.query.keyword)

         res.send(keyword);
    });

    //Modify single keyword //TODO\\

    //Remove single keyword (may need changes to naming)
    router.delete('/keywords/:keyword', async (req, res) => {
        await Keywords.query()
        .delete()
        .where('keyword', req.query.keyword)

        res.send({});
    });

    //Modify keywords and assiciated responses //TODO\\

    //Add new keyword
    router.post('/keywords', async (req, res) => {
        const keyword = await Keywords.query();

        const addKeyword = await keyword.insert(req.body);
        res.send(addKeyword);
    });

    //Get all responses
    router.get('/responses', async (req, res) => {
        const response = await Responses.query();

        if (!response) {
            throw createStatusCodeError(404);
        }

        res.send(response);
    });

    //Get single response (may need changes to naming)
    router.get('/responses/:id', async (req, res) => {
        const response = await Responses.query().findById(req.params.id);

        if (!response) {
            throw createStatusCodeError(404);
        }

        res.send(response);
    });

    //Add new response
    router.post('/responses', async (req, res) => {
        const response = await Responses.query();

        const addResponse = await response.insert(req.body);
        res.send(addResponse);
    });

    //Delete single response
    router.delete('/responses/:id', async (req, res) => {
        await Keywords.query().deleteById(req.params.id);

        res.send({});
    });

    //Modify single response
    router.patch('/responses/:id', async (req, res) => {
        const response = await Responses.query().patchAndFetchById(req.params.id, req.body);

        res.send(response);
    });

    //Get statistics
    router.get('/statistics', async (req, res) => {
        const statistic = await Statistics.query();

        if (!static) {
            throw createStatusCodeError(404);
        }

        res.send(statistic);
    });
}