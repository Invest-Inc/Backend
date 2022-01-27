const Database = require("../database");

const BalanceSheet = {
    ...Database.update_Balance_Sheet
}

const CashFlow = {
    ...Database.update_Cash_Flow
}

const IncomeStatement = {
    ...Database.update_Income_Statement
}

const News = {
    ...Database.update_News
}

const Operations = {
    ...Database.update_Operations
}

/**
 * 
 * @param {*} param0 
 * @returns {Promise<Array<{update_id: Number, startup_id: Number, date: Date, resource_url: String}>>}
 */
const getAllUpdatesReferences = async ({ startup_id }) => {
    const result = []
    // Balancesheet
    let balanceSheetData = await BalanceSheet.findMany({
        where: {startup_id}
    });
    result.push(
        ...balanceSheetData.map(r => ({
            update_id: r.update_balance_sheet_id, 
            startup_id: r.startup_id, 
            date: r.date, 
            resource_url: r.resource_url, 
            type: "balancesheet"
        }))
    );
    // Cash flow
    let cashFlowData = await CashFlow.findMany({
        where: {startup_id}
    });
    result.push(
        ...cashFlowData.map(r => ({
            update_id: r.update_cash_flow_id, 
            startup_id: r.startup_id, 
            date: r.date, 
            resource_url: r.resource_url, 
            type: "cashflow"
        }))
    )
    // Income statement
    let incomeStatementData = await IncomeStatement.findMany({
        where: {startup_id}
    });
    result.push(
        ...incomeStatementData.map(r => ({
            update_id: r.update_income_statement, 
            startup_id: r.startup_id, 
            date: r.date, 
            resource_url: r.resource_url, 
            type: "incomestatement"
        }))
    );
    // News
    let newsData = await News.findMany({
        where: {startup_id}
    });
    result.push(
        ...newsData.map(r => ({
            update_id: r.update_news_id, 
            startup_id: r.startup_id, 
            date: r.date, 
            resource_url: r.resource_url, 
            type: "news"
        }))
    );
    // Operations
    let operationsData = await Operations.findMany({
        where: {startup_id}
    });
    result.push(
        ...operationsData.map(r => ({
            update_id: r.update_operations_id, 
            startup_id: r.startup_id, 
            date: r.date, 
            resource_url: r.resource_url, 
            type: "operations"
        }))
    );
    return result;
}

const StartupUpdateService = {
    BalanceSheet, 
    CashFlow, 
    IncomeStatement, 
    News, 
    Operations,
    getAllUpdatesReferences
}

module.exports = StartupUpdateService;