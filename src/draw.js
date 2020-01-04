const Discord = require("../dependencies/node_modules/discord.js");
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

function get_inventory(user, guild_memb, page_nb)
{
    var inv = new Discord.RichEmbed();

    var user_inv = inventory[user.id];
    var length = Object.keys(user_inv).length;

    if (page_nb < 0)
        page_nb = Math.floor(length / 15);
    else if (page_nb > Math.floor(length / 15))
        page_nb = 0;

    var max_page = Math.floor(length / 15);
    if (max_page > 0)
        inv.setFooter(`Page ${page_nb + 1} / ${max_page + 1}`);

    if (inventory.hasOwnProperty(user.id))
    {
        var inv_array = Object.entries(user_inv);
        var inv_str = "";
        for (var i = page_nb * 15; i < length && i < (page_nb + 1) * 15; i++)
            inv_str += `${inv_array[i][1]}x **${inv_array[i][0]}**\n`;

        inv.addField("** **", inv_str);
    }

    inv.setAuthor(`${user.username}'s inventory`, user.avatarURL);
    inv.setColor(guild_memb.displayColor);

    return inv;
}

module.exports = {
    draw_command: draw_command,
    set_item: set_item,
    get_inventory: get_inventory
}
