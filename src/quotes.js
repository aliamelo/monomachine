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

function del_quote(quote)
{
    if (!quotes.includes(quote))
        return 1;

    var index = quotes.indexOf(quote);
    quotes.splice(index, 1);
    fs.writeFileSync("data/quotes.json", JSON.stringify(quotes));

    return 0;
}

module.exports = {
    add_quote: add_quote,
    del_quote: del_quote
}
