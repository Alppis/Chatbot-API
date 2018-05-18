const Model = require('objection').Model;

class Statistics extends Model {
    //Required properties
    static get tableName() {
        return 'statistics';
    }

    //JSON schema. Used for model instance validation.
    /*static get jsonSchema() {
        return {
            type: 'object',
            required: ['statisticid', 'keyword', 'latestuser'],

            properties: {
                statisticid: {type: 'integer'},
                keyword: {type: 'string', maxLength: 255},
                keywordused: {type: 'integer'},
                lastuse: {type: 'string', maxLength: 255},
                latestuser: {type: 'string', maxLength: 255}
            }
        };
    }*/

    //Relations to other models
    static get relationMappings() {
        const Keywords = require('../models/keywordsModel');
        const Users = require('../models/usersModel');
        return {
            keywordRelationStat2: {
                relation: Model.BelongsToOneRelation,
                modelClass: Keywords,
                join: {
                    from: 'statistics.keyword',
                    to: 'keywords.keyword'
                }
            },

            usernameRelationUser: {
                relation: Model.BelongsToOneRelation,
                modelClass: Users,
                join: {
                    from: 'statistics.latestuser',
                    to: 'users.username'
                }
            }
        };
    }
}

module.exports = Statistics;