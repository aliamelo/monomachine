const Discord = require("../dependencies/node_modules/discord.js");
const fs = require("fs");

const item_list = JSON.parse(fs.readFileSync("data/items.json"));

function get_item_list(bot_user, bot_guild_memb, page_nb)
{
    var items = new Discord.RichEmbed();

    var length = item_list.length;
    if (page_nb < 0)
        page_nb = Math.floor(length / 15);
    else if (page_nb > Math.floor(length / 15))
        page_nb = 0;

    var max_page = Math.floor(length / 15);
    if (max_page > 0)
        items.setFooter(`Page ${page_nb + 1} / ${max_page + 1}`);

    var items_str = "";
    for (var i = page_nb * 15; i < length && i < (page_nb + 1) * 15; i++)
        items_str += item_list[i] + '\n';

    items.addField("** **", items_str);

    items.setAuthor("Monomachine items", bot_user.avatarURL);
    items.setColor(bot_guild_memb.displayColor);

    return items;
}

function add_items(item, channel)
{
    if (item_list.includes(item))
        return 1;
    else
        item_list.push(item);

    item_list.sort();
    fs.writeFileSync("data/items.json", JSON.stringify(item_list));

    return 0;
}

function delete_items(argc, argv, channel)
{
    var nb_items = 0;
    for (var i = 2; i < argc; i++)
    {
        var index = item_list.indexOf(argv[i]);

        if (index < 0)
            channel.send(`**${argv[i]}** doesn't exist.`);
        else
        {
            item_list.splice(index, 1);
            nb_items++;
        }
    }

    fs.writeFileSync("data/items.json", JSON.stringify(item_list));

    channel.send(`Finished deleting **${nb_items}** items.`);
}

module.exports = {
    get_item_list: get_item_list,
    add_items: add_items,
    delete_items: delete_items
}
