const Discord = require("../dependencies/node_modules/discord.js");

function get_items_embed(bot_user, bot_guild_memb, item_list, page_nb)
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

module.exports = {
    get_items_embed: get_items_embed
}
