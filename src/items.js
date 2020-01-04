const Discord = require("../dependencies/node_modules/discord.js");
const fs = require("fs");
const item_list = JSON.parse(fs.readFileSync("data/items.json"));

function get_items_embed(bot_user, bot_guild_memb, page_nb)
{
    var inv = new Discord.RichEmbed();

    var length = item_list.length;
    if (page_nb < 0)
        page_nb = Math.floor(length / 15);
    else if (page_nb > Math.floor(length / 15))
        page_nb = 0;

    var max_page = Math.floor(length / 15);
    if (max_page > 0)
        inv.setFooter(`Page ${page_nb + 1} / ${max_page + 1}`);

    var items = "";
    for (var i = page_nb * 15; i < length && i < (page_nb + 1) * 15; i++)
        items += item_list[i] + '\n';

    inv.addField("** **", items);
    inv.setAuthor("Monomachine items", bot_user.avatarURL);
    inv.setColor(bot_guild_memb.displayColor);

    return inv;
}

function add_items(argc, argv, channel)
{
    var nb_items = 0;
    for (var i = 2; i < argc; i++)
    {
        if (item_list.includes(argv[i]))
            channel.send(`**${argv[i]}** exists already!`);
        else
        {
            item_list.push(argv[i]);
            nb_items++;
        }
    }

    item_list.sort();
    fs.writeFileSync("data/items.json", JSON.stringify(item_list));

    channel.send(`Finished adding **${nb_items}** items.`)
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
    get_items_embed: get_items_embed,
    add_items: add_items,
    delete_items: delete_items
}
