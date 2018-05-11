const Model = require('objection').Model;
const Users = require('../models/usersModel');
const Responses = require('../models/responsesModel');
const Statistics = require('../models/statisticsModel');

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

    //Relations to other models
    static get relationMappings() {
        return {
            keyword: {
                relation: Model.HasOneRelation,
                modelClass: __dirname + '/Responses',
                join: {
                    from: 'keywords.keyword',
                    to: 'responses.keyword'
                }
            },

            keyword: {
                relation: Model.HasOneRelation,
                modelClass: __dirname + '/Statistics',
                join: {
                    from: 'keywords.keyword',
                    to: 'statistics.keyword'
                }
            }
        };
    }
}

module.exports = Keywords;