
const Model = require('objection').Model;
const Keywords = require('../models/keywordsModel');
const Responses = require('../models/responsesModel');
const Statistics = require('../models/statisticsModel');

class Users extends Model {
    //Required properties
    static get tableName() {
        return 'users';
    }

    //JSON schema. Used for model instance validation.
    static get jsonSchema() {
        return {
            type: 'object',
            required: ['id'],

            properties: {
                id: {type: 'integer'},
                username: {type: 'string', maxLength: 255},
                lastlogin: {type: 'string', maxLength: 255},
                replies: {type: 'integer'},
                latestreply: {type: 'string', maxLength: 255}
            }
        };
    }

    //Relations to other models
    static get relationMappings() {
        return {
            username: {
                relation: Model.HasOneRelation,
                modelClass: __dirname + '/Responses',
                join: {
                    from: 'users.username',
                    to: 'responses.username'
                }
            },

            username: {
                relation: Model.BelongsToOneRelation,
                modelClass: __dirname + '/Statistics',
                join: {
                    from: 'users.username',
                    to: 'statistics.latestsuser'
                }
            }
        };
    }
}

module.exports = Users;