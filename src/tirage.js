const fs = require("fs");
const item_list = JSON.parse(fs.readFileSync("data/items.json"));

function tirage_command(msg)
{
    var nb_items = item_list.length;
    var index = Math.floor(Math.random() * nb_items);

    msg.channel.send(`**${msg.member.displayName}**, `
        + `you got **${item_list[index]}**!`);
}

module.exports = {
    tirage_command: tirage_command
}
