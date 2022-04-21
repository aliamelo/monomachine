const Discord = require("../dependencies/node_modules/discord.js");

function help_message(bot_user, bot_guild_memb, channel)
{
    var help = new Discord.MessageEmbed();

    help.setAuthor({name: "Monomachine help", iconURL: bot_user.avatarURL({})});
    help.setColor(bot_guild_memb.displayColor);
    help.setFooter({text: "monomachine - written in js by alia"});
    help.addField("+tirage", "Draw an item and add it to user's inventory");
    help.addField("+help", "Display this window");
    help.addField("+inventory, +inv", "Display inventory of a user "
        + "(message sender by default)\n`usage: +inv|inventory [@user]`");
    help.addField("+items (admin)", "Display list of items or add/delete items "
        + "from item list.\n`usage: +items [add|delete item-name]`");
    help.addField("+set (admin)", "Set `nb` `item` for `user`. A zero or "
        + "negative value for `nb` deletes `item` from `user`'s inventory. "
        + "`user` must be a mention.\n`usage: +set user nb item`");
    help.addField("+bday", "Usages:\n+bday displays bdays of all registered "
        + "chars.\n+bday name / +bday day month. Shows bday of a "
        + "specific character or for a specific day.\n +bday add day "
        + "month name(admin command). Add a birthday to the list.\n"
        + "+bday delete name (admin command). Deletes the birthday of a "
        + "character");
    help.addField("+quote (admin)", "+quote add message / +quote delete "
        + "message\nMessage must contain at least [item] and if "
        + "needed, [user]");
    channel.send({embeds: [help]});
}

module.exports = {
    help_message: help_message
}
