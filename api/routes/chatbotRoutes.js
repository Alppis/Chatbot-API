'use strict';
export default function (app) {
    var chatbot = require('../controllers/chatbotController');

    //routes
    app.route('/responses') //to be changed
        .get(chatbot.get_responses)
        .post(chatbot.add_respnse);

    //todo: add routes to all endpoints
};