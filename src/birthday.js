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

function del_birthday(name)
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

function get_birthday_name(name, channel)
{
    for (var date in bdays)
    {
        if (bdays[date].includes(name))
        {
            var date_arr = date.split(' ');
            channel.send(`L'anniversaire de **${name}** est le `
                + `**${date_arr[0]}/${date_arr[1]}**`);

            return;
        }
    }

    channel.send(`**${name}** n'a pas d'anniversaire enregistré !`);
}

function get_birthday_date(day, month, channel)
{
    var date_str = `${day} ${month}`;

    if (!bdays.hasOwnProperty(date_str))
        channel.send("Personne ne fête son anniversaire ce jour.");
    else
    {
        var to_send = "";
        for (var i = 0; i < bdays[date_str].length; i++)
        {
            if (i && i == bdays[date_str].length - 1)
                to_send += " et ";
            else if (i)
                to_send += ", ";

            to_send += `**${bdays[date_str][i]}**`;
        }

        channel.send(`Le **${day}/${month}** c'est l'anniversaire de `
            + to_send);
    }
}

module.exports = {
    add_birthday: add_birthday,
    del_birthday: del_birthday,
    get_birthday_name: get_birthday_name,
    get_birthday_date: get_birthday_date
}
