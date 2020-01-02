const fs = require("fs");
const item_list = JSON.parse(fs.readFileSync("data/items.json"));

function display(channel)
{
    var items_str = "";

    for (var item in item_list)
    {
        if (item != 0)
            items_str += ", ";

        items_str += item_list[item];
    }

    channel.send(items_str);
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
    display: display,
    add_items: add_items,
    delete_items: delete_items
}
