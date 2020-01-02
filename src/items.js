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

function add_items(argc, argv)
{
    var nb_items = 0;
    for (var i = 2; i < argc; i++)
    {
        if (!item_list.includes(argv[i]))
        {
            item_list.push(argv[i]);
            nb_items++;
        }
    }

    fs.writeFileSync("data/items.json", JSON.stringify(item_list));

    return nb_items;
}

module.exports = {
    display: display,
    add_items: add_items
}
