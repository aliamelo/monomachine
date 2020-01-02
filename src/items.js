const fs = require("fs");
const item_list = JSON.parse(fs.readFileSync("data/items.json"));

function display(channel)
{
    var items_str = "";

    for (var item in item_list)
    {
        if (item)
            items_str += ", ";

        items_str += item_list[item];
    }

    channel.send(items_str);
}

function add_items(argc, argv)
{
    console.log("boup");
}

module.exports = {
    display: display
    add_items: add_items
}
