const fs = require("fs");

const quotes = JSON.parse(fs.readFileSync("data/quotes.json"));

function add_quote(quote)
{
    if (!quote.includes("[item]"))
        return 1;

    if (quotes.includes(quote))
        return 2;

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

function display_quotes()
{
    var str = "";

    for (var i in quotes)
    {
        if (i != 0)
            str += "\n";
        str += quotes[i];
    }

    return str;
}

module.exports = {
    add_quote: add_quote,
    del_quote: del_quote,
    display_quotes: display_quotes
}
