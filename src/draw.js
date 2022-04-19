const Discord = require("../dependencies/node_modules/discord.js");
const fs = require("fs");

const ids = JSON.parse(fs.readFileSync("data/ids.json"));

function is_next_day(date)
{
    var d = new Date();
    var saved = new Date(date);

    return (d.getDate() > saved.getDate()) || (d.getMonth() > saved.getMonth())
        || (d.getYear() > saved.getYear());
}

function add_item(id, item)
{
    var inventory = JSON.parse(fs.readFileSync("data/inventory.json"));

    if (inventory.hasOwnProperty(id))
    {
        if (inventory[id].items.hasOwnProperty(item))
            inventory[id].items[item]++;
        else
            inventory[id].items[item] = 1;
    }

    else
    {
        var new_obj = {"items":{ [item]: 1 }};
        inventory[id] = new_obj;
    }

    var ordered = {};
    Object.keys(inventory[id].items).sort(function (a, b) {
        var a = a.replace(/^(la|le|une|l'|un|des|du) /, "");
        var b = b.replace(/^(la|le|une|l'|un|des|du) /, "");

        if (a > b)
            return 1;
        return -1;
    }).forEach(function(key) {
        ordered[key] = inventory[id].items[key];
    });

    inventory[id].items = ordered;
    inventory[id].date = Date.now();
    fs.writeFileSync("data/inventory.json", JSON.stringify(inventory));
}

function send_tirage(msg, index, q_index)
{
    var item_list = JSON.parse(fs.readFileSync("data/items.json"));
    var quotes = JSON.parse(fs.readFileSync("data/quotes.json"));

    var to_send = quotes[q_index].replace("[item]", `**${item_list[index]}**`);
    to_send = to_send.replace("[user]", `**${msg.member.displayName}**`);

    msg.channel.send(to_send);
}

function draw_command(msg)
{
    var item_list = JSON.parse(fs.readFileSync("data/items.json"));
    var inventory = JSON.parse(fs.readFileSync("data/inventory.json"));
    var quotes = JSON.parse(fs.readFileSync("data/quotes.json"));

    var index = Math.floor(Math.random() * item_list.length);
    var q_index = Math.floor(Math.random() * quotes.length);

    if (msg.channel.id != ids.draw_chan)
    {
        send_tirage(msg, index, q_index);
        return;
    }

    if (inventory.hasOwnProperty(msg.author.id)
        && !is_next_day(inventory[msg.author.id].date))
    {
        msg.channel.send("Reviens demain !");
        return;
    }

    send_tirage(msg, index, q_index);

    add_item(msg.author.id, item_list[index]);
}

function set_item(id, item, nb)
{
    var inventory = JSON.parse(fs.readFileSync("data/inventory.json"));

    if (nb <= 0)
        delete(inventory[id].items[item]);
    else
    {
        if (inventory.hasOwnProperty(id))
            inventory[id].items[item] = nb;
        else
        {
            var new_obj = {"items":{ [item]: nb }};
            inventory[id] = new_obj;
        }
    }

    var ordered = {};
    Object.keys(inventory[id].items).sort(function (a, b) {
        var a = a.replace(/^(la|le|une|l'|un|des|du) /, "");
        var b = b.replace(/^(la|le|une|l'|un|des|du) /, "");
        if (a > b)
            return 1;
        return -1;
    }).forEach(function(key) {
        ordered[key] = inventory[id].items[key];
    });

    inventory[id].items = ordered;
    fs.writeFileSync("data/inventory.json", JSON.stringify(inventory));
}

function get_inventory(user, guild_memb, page_nb)
{
    var inventory = JSON.parse(fs.readFileSync("data/inventory.json"));
    var inv = new Discord.MessageEmbed();

    if (inventory.hasOwnProperty(user.id))
    {
        var user_inv = inventory[user.id].items;
        var length = Object.keys(user_inv).length;

        if (page_nb < 0)
            page_nb = Math.floor(length / 15);
        else if (page_nb > Math.floor(length / 15))
            page_nb = 0;

        var footer = "";
        var max_page = Math.floor(length / 15);
        if (length % 15 == 0)
            max_page -= 1;
        if (max_page > 0)
            inv.setFooter({text: `Page ${page_nb + 1} / ${max_page + 1}`});

        var inv_array = Object.entries(user_inv);
        var inv_str = "";
        for (var i = page_nb * 15; i < length && i < (page_nb + 1) * 15; i++)
            inv_str += `${inv_array[i][1]}x **${inv_array[i][0]}**\n`;

        if (inv_str !== "") {
            inv.addField("** **", inv_str);
        }
    }

    inv.setAuthor({name: `${user.username}'s inventory`,
                  iconURL: user.avatarURL({})});
    inv.setColor(guild_memb.displayColor);

    return inv;
}

module.exports = {
    draw_command: draw_command,
    set_item: set_item,
    get_inventory: get_inventory
}
