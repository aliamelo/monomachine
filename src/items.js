const Discord = require("../dependencies/node_modules/discord.js");
const fs = require("fs");

function get_item_list(bot_user, bot_guild_memb, page_nb)
{
    var item_list = JSON.parse(fs.readFileSync("data/items.json"));

    var items = new Discord.MessageEmbed();

    var length = item_list.length;
    if (page_nb < 0)
        page_nb = Math.floor(length / 15);
    else if (page_nb > Math.floor(length / 15))
        page_nb = 0;

    var max_page = Math.floor(length / 15);
    if (length % 15 == 0)
        max_page -= 1;
    if (max_page > 0)
        items.setFooter({text: `Page ${page_nb + 1} / ${max_page + 1}`});

    var items_str = "";
    for (var i = page_nb * 15; i < length && i < (page_nb + 1) * 15; i++)
        items_str += item_list[i] + '\n';

    if (items_str !== "") {
        items.addField("** **", items_str);
    }

    items.setAuthor({name: "Monomachine items",
                    iconURL: bot_user.avatarURL({})});
    items.setColor(bot_guild_memb.displayColor);

    return items;
}

function add_items(item)
{
    var item_list = JSON.parse(fs.readFileSync("data/items.json"));

    if (item_list.includes(item))
        return 1;
    else
        item_list.push(item);

    item_list.sort(function (a, b) {
        var stra = a.replace(/^(la|le|une|l'|un|des|du) /, "");
        var strb = b.replace(/^(la|le|une|l'|un|des|du) /, "");

        if (stra > strb)
            return 1;
        return -1;
    });
    fs.writeFileSync("data/items.json", JSON.stringify(item_list));

    return 0;
}

function delete_items(item, channel)
{
    var item_list = JSON.parse(fs.readFileSync("data/items.json"));

    var index = item_list.indexOf(item);

    if (index < 0)
        return 1;
    else
        item_list.splice(index, 1);

    fs.writeFileSync("data/items.json", JSON.stringify(item_list));

    return 0;
}

module.exports = {
    get_item_list: get_item_list,
    add_items: add_items,
    delete_items: delete_items
}
