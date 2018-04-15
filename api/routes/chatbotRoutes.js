module.exports = function (app) {
    const chatbot = require('../controllers/chatbotController');

    //Defines simple route
    app.get('/', (req, res) => res.send('Chatbot API v0.0.1'));
    //todo: add routes to all endpoints

    //Get all keywords
    //app.get('/keywords', (req, res) => res.send('Chatbot API v0.0.2'));
};