const Model = require('objection').Model;
const Users = require('../models/usersModel');
const Responses = require('../models/responsesModel');

class Keywords extends Model {
    //required properties
    static get tableName() {
        return 'keywords';
    }

    //JSON schema. Used for model instance validation
    static get jsonSchema() {
        return {
            type: 'object',
            required: ['keywordid'],

            properties: {
                keywordid: {type: 'integer'},
                keyword: {type: 'string', minLength: 1, maxLength: 255},
                cases: {type: 'integerer'}
            }
        };
    }
}

module.exports = Keywords;