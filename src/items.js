const fs = require("fs");

const utils_funcs = require("./utils.js")
const item_list = JSON.parse(fs.readFileSync("data/items.json"));

function get_item_list(bot_user, bot_guild_memb, pg)
{
    return utils_funcs.get_items_embed(bot_user, bot_guild_memb, item_list, pg);
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
    get_item_list: get_item_list,
    add_items: add_items,
    delete_items: delete_items
}
