const Model = require('objection').Model;

class Users extends Model {
    //Required properties
    static get tableName() {
        return 'users';
    }

    //JSON schema. Used for model instance validation.
    /*static get jsonSchema() {
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
    }*/

    //Relations to other models
    static get relationMappings() {
        const Responses = require('../models/responsesModel');
        const Statistics = require('../models/statisticsModel');
        return {
            usernameRelationResp: {
                relation: Model.HasOneRelation,
                modelClass: Responses,
                join: {
                    from: 'users.username',
                    to: 'responses.username'
                }
            },

            usernameRelationStat: {
                relation: Model.BelongsToOneRelation,
                modelClass: Statistics,
                join: {
                    from: 'users.username',
                    to: 'statistics.latestuser'
                }
            }
        };
    }
}

module.exports = Users;