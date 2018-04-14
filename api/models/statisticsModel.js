'use strict';

const Model = require('objection').Model;
const Keywords = require('./keywords');
const Users = require('./users');

class Statistics extends Model {
    //Required properties
    static get tableName() {
        return 'statistics';
    }

    //JSON schema. Used for model instance validation.
    static get jsonSchema() {
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
    }

    //Relations to other models
    static get relationMappings() {
        return {
            keyword: {
                relation: Model.ManyToManyRelation,
                modelClass: __dirname + '/Keywords',
                join: {
                    from: 'statistics.keyword',
                    to: 'keywords.keyword'
                }
            },

            username: {
                relation: Model.ManyToManyRelation,
                modelClass: __dirname + '/Users',
                join: {
                    from: 'statistics.latestuser',
                    to: 'users.username'
                }
            }
        };
    }
}

module.exports = Statistics;