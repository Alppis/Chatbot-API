'use strict';

const Model = require('objection').Model;

class Keywords extends Model {
    //required properties
    static get tableName() {
        return 'keywords';
    }

    //JSON schema. Used for model instance validation
    static get jsonSchema() {
        return {
            type: 'object',
            required: ['keyword'],

            properties: {
                keyword: {type: 'string', minLength: 1, maxLength: 255},
                cases: {type: 'integerer'}
            }
        };
    }
}

module.exports = Keywords;