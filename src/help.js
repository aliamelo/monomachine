const Discord = require("../dependencies/node_modules/discord.js");

function help_message(bot_user, bot_guild_memb, channel)
{
    var help = new Discord.RichEmbed();

    help.setAuthor("Monomachine help", bot_user.avatarURL);
    help.setColor(bot_guild_memb.displayColor);
    help.setFooter("monomachine - written in js by alia");
    help.addField("-tirage", "Draw an item and add it to user's inventory");
    help.addField("-help", "Display this window");
    help.addField("-inventory, -inv", "Display inventory of a user "
        + "(message sender by default)\n`usage: -inv|inventory [@user]`");
    help.addField("-item (admin)", "Display list of items or add/delete items "
        + "from item list.\n`usage: -item [add|delete item-name...]`");
    help.addField("-set (admin)", "Set `nb` `item` for `user`. A zero or "
        + "negative value for `nb` deletes `item` from `user`'s inventory. "
        + "`user` must be a mention.\n`usage: -set user item nb`");
    channel.send(help);
}

module.exports = {
    help_message: help_message
}
