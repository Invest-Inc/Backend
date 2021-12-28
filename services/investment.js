const { Prisma } = require("@prisma/client");
const CurrencyService = require("./currency");
const Database = require("./database");
const PaymentsService = require("./payments");

const InvestmentService = {
    ...Database.investment
}

/**
 * Creates a new investment
 * @param {Prisma.InvestmentCreateManyInput} data 
 */
InvestmentService.create = async data => {
    // Convert
    const valueUSD = await CurrencyService.convert({
        to: "USD", 
        from: data.currency,
        amount: data.value
    })
    // Transfer from user to business
    await PaymentsService.transfer({
        from: data.investor_id, 
        to: data.business_id,
        amount: data.valueUSD,
        concept: "Investment"
    });
    // Create record
    await Database.investment.create({
        data: {
            date: new Date(), 
            business_id: data.business_id,
            investor_id: data.investor_id,
            currency: data.currency, 
            value: data.value, 
            valueUSD: valueUSD.result
        }
    })
}

module.exports = InvestmentService;