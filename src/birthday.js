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

function display_bdays(bot_guild_memb, page_nb)
{
    var bday_list = new Discord.RichEmbed();

    var length = Object.keys(bdays).length;

    if (page_nb < 0)
        page_nb = Math.floor(length / 15);
    else if (page_nb > Math.floor(length / 15))
        page_nb = 0;

    var footer = "";
    var max_page = Math.floor(length / 15);
    if (max_page > 0)
        bday_list.setFooter(`Page ${page_nb + 1} / ${max_page + 1}`);

    for (var i = page_nb * 15; i < length && i < (page_nb + 1) * 15; i++)
    {
        var date = Object.keys(bdays)[i];
        var names_str = "";

        for (var j = 0; j < bdays[date].length; j++)
        {
            if (j)
                names_str += ", ";
            names_str += bdays[date][j];
        }

        var date_arr = date.split(' ');
        bday_list.addField(`${date_arr[0]}/${date_arr[1]}`, `${names_str}`);
    }

    bday_list.setAuthor("Les anniversaires", bot_guild_memb.user.avatarURL);
    bday_list.setColor(bot_guild_memb.displayColor);

    return bday_list;
}

module.exports = {
    add_birthday: add_birthday,
    del_birthday: del_birthday,
    get_birthday_name: get_birthday_name,
    get_birthday_date: get_birthday_date,
    display_bdays: display_bdays
}
