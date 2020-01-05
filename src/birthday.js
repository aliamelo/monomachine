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

function del_birthday_name(name)
{
    for (var date in bdays)
    {
        var index = bdays[date].indexOf(name);

        if (index >= 0)
        {
            bdays[date].splice(index, 1);
            fs.writeFileSync("data/birthday.json", JSON.stringify(bdays));
            return 1;
        }
    }

    return 0;
}

module.exports = {
    add_birthday: add_birthday,
    del_birthday_name: del_birthday_name
}
