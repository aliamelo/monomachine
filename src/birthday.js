const Discord = require("../dependencies/node_modules/discord.js");
const fs = require("fs");

const bdays = JSON.parse(fs.readFileSync("data/birthday.json"));

function add_birthday(name, day, month)
{
    var bday_str = `${day} ${month}`;

    if (bdays.hasOwnProperty(bday_str))
        bdays[bday_str].push(name);
    else
        bdays[bday_str] = [name];

    fs.writeFileSync("data/birthday.json", JSON.stringify(bdays));
}


function get_birthday(day, month)
{
    var bday_str = `${day} ${month}`;
    console.log(bdays[bday_str]);
}

module.exports = {
    get_birthday: get_birthday,
    add_birthday: add_birthday
}
