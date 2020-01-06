const fs = require("fs");

const quotes = JSON.parse(fs.readFileSync("data/quotes.json"));

function add_quote(quote)
{
    if (!quote.includes("[item]"))
        return 1;

    quotes.push(quote);
    fs.writeFileSync("data/quotes.json", JSON.stringify(quotes));

    return 0;
}

module.exports = {
    add_quote: add_quote
}
