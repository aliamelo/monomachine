const fs = require("fs");
const item_list = JSON.parse(fs.readFileSync("data/items.json"));
const inventory = JSON.parse(fs.readFileSync("data/inventory.json"));

function add_item(id, item)
{
    if (inventory.hasOwnProperty(id))
    {
        if (inventory[id].hasOwnProperty(item))
            inventory[id][item]++;
        else
            inventory[id][item] = 1;
    }

    else
    {
        var new_obj = { [item]: 1 };
        inventory[id] = new_obj;
    }

    fs.writeFileSync("data/inventory.json", JSON.stringify(inventory));
}

function draw_command(msg)
{
    var nb_items = item_list.length;
    var index = Math.floor(Math.random() * nb_items);

    msg.channel.send(`**${msg.member.displayName}**, `
        + `you got **${item_list[index]}**!`);

    add_item(msg.member.id, item_list[index]);
}

function set_item(id, item, nb)
{
    if (nb <= 0)
        delete(inventory[id][item]);
    else
    {
        if (inventory.hasOwnProperty(id))
            inventory[id][item] = nb;
        else
        {
            var new_obj = { [item]: nb };
            inventory[id] = new_obj;
        }
    }

    fs.writeFileSync("data/inventory.json", JSON.stringify(inventory));
}

module.exports = {
    draw_command: draw_command,
    set_item: set_item
}
