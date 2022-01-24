const { default: fetch } = require("cross-fetch");

const CurrencyService = {};

/**
 * Converts a value from one currency to another
 * @param {{from: String, to: String, amount: Number}} param0 
 * @returns {{from: String, to: String, amount: Number, convertionRate: Number, lastUpdateUTC: Date, result: Number}}
 */
CurrencyService.convert = async ({from, to, amount}) => {
    // Call API
    const  res = await fetch(`https://open.er-api.com/v6/latest/${from}`);
    const data = await res.json();
    // Get data
    const convertionRate = Number.parseFloat(data.rates[to]);
    const lastUpdateUTC = data.time_last_update_utc;
    // Make conversion
    const result = amount * convertionRate;
    return {from, to, amount, convertionRate, lastUpdateUTC, result}
}

module.exports = CurrencyService;