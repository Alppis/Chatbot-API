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
        const keyword = await Keywords.query();

        if (!keyword) {
            throw createStatusCodeError(404);
        }

        res.send(keyword);
    });

    //Get single keyword (may need changes to naming)
    router.get('/api/keywords/:keywordid', async (req, res) => {
        const keyword = await Keywords
         .query()
         .skipUndefined()
         .where('keywordid', '=', req.params.keyword);

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

    // It's a good idea to wrap `insertGraph` call in a transaction since it
    // may create multiple queries.
    const insertedGraph = await transaction(Keywords.knex(), trx => {
      return (
        Keywords.query(trx)
          // For security reasons, limit the relations that can be inserted.
          //.allowInsert('[pets, children.[pets, movies], movies, parent]')
          .insertGraph(graph)
      );
    });
});

    //Get all responses
    router.get('/api/responses', async (req, res) => {
        const response = await Responses.query();

        if (!response) {
            throw createStatusCodeError(404);
        }

        res.send(response);
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
        const statistic = await Statistics.query();

        if (!static) {
            throw createStatusCodeError(404);
        }

        res.send(statistic);
    });

    //Get all users
    router.get('/api/users', async (req, res) => {
        const user = await Users.query();

        if (!user) {
            throw createStatusCodeError(404);
        }

        res.send(user);
    });

    //Get single user (may need changes to naming)
    router.get('/api/users/:id', async (req, res) => {
        const user = await Users.query()
         .skipUndefined()
         .where('id', '=', req.params.user)

         res.send(user);
    });

    //Modify single user //TODO\\

    //Remove single user (may need changes to naming)
    router.delete('/api/users/:id', async (req, res) => {
        await Users.query()
        .delete()
        .where('id', req.query.keyword)

        res.send({});
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