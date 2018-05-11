const Model = require('objection').Model;

class Keywords extends Model {
    //required properties
    static get tableName() {
        return 'keywords';
    }

    //JSON schema. Used for model instance validation
    /*static get jsonSchema() {
        return {
            type: 'object',
            required: ['keyword'],

            properties: {
                keywordid: {type: 'integer'},
                keyword: {type: 'string', minLength: 1, maxLength: 255},
                cases: {type: 'integerer'}
            }
        };
    }*/

    //Relations to other models
    static get relationMappings() {
        const Responses = require('../models/responsesModel');
        const Statistics = require('../models/statisticsModel');
        return {
            keywordRelationResp: {
                relation: Model.HasOneRelation,
                modelClass: Responses,
                join: {
                    from: 'keywords.keyword',
                    to: 'responses.keyword'
                }
            },

            keywordRelationStat: {
                relation: Model.HasOneRelation,
                modelClass: Statistics,
                join: {
                    from: 'keywords.keyword',
                    to: 'statistics.keyword'
                }
            }
        };
    }
}

module.exports = Keywords;