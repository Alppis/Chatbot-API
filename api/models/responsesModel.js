
const Model = require('objection').Model;
const Keywords = require('../models/keywordsModel');
const Users = require('../models/usersModel');
const Statistics = require('../models/statisticsModel');

class Responses extends Model {
    //Required properties
    static get tableName() {
        return 'responses';
    }

    //JSON schema. Used for model instance validation.
    static get jsonSchema() {
        return {
            type: 'object',
            required: ['responseid', 'response', 'keyword', 'username'],

            properties: {
                responseid: {type: 'integer'},
                response: {type: 'string', maxLength: 255},
                keyword: {type: 'string', maxLength: 255},
                header: {type: 'string', maxLength: 255},
                username: {type: 'string', maxLength: 255}
            }
        };
    }

    //Relations to other models
    static get relationMappings() {
        return {
            keyword: {
                relation: Model.BelongsToOneRelation,
                modelClass: __dirname + '/Keywords',
                join: {
                    from: 'responses.keyword',
                    to: 'keywords.keyword'
                }
            },

            username: {
                relation: Model.BelongsToOneRelation,
                modelClass: __dirname + '/Users',
                join: {
                    from: 'responses.username',
                    to: 'users.username'
                }
            }
        };
    }
}

module.exports = Responses;