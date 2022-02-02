const Database = require("../database");
const newsJSONSchema = require('../schemas/news.schema.json');
const incomeStatementJSONSchema = require('../schemas/incomestatement.schema.json');
const balanceSheetJSONSchema = require('../schemas/balancesheet.schema.json');
const operationsJSONSchema = require('../schemas/operations.schema.json');
const { default: Ajv } = require("ajv");

const validateJSON = (data, schema) => {
    const ajv = new Ajv();
    const validate = ajv.compile(schema);
    const valid = validate(data);
    if(!valid) console.log(validate.errors);
    return valid;
}

const validateDataField = ({type, data}) => {
    switch(type){
        case 'news':
            return validateJSON(data, newsJSONSchema);
        case 'incomestatement':
        case 'incomeStatement':
        case 'income_statement':
            return validateJSON(data, incomeStatementJSONSchema);
        case 'balancesheet':
        case 'balanceSheet':
        case 'balance_sheet':
            return validateJSON(data, balanceSheetJSONSchema);
        case 'operations':
            return validateJSON(data, operationsJSONSchema);
        default:
            return false;
    }
}

const StartupUpdateService = {
    ...Database.startup_Update, 
    validateDataField
};

module.exports = StartupUpdateService;