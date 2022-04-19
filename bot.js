const Discord = require("./dependencies/node_modules/discord.js");
const client = new Discord.Client({
        intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS"]})

const fs = require("fs");
const ids = JSON.parse(fs.readFileSync("data/ids.json"));

const item_funcs = require("./src/items.js");
const draw_funcs = require("./src/draw.js");
const help_funcs = require("./src/help.js");
const bday_funcs = require("./src/birthday.js");
const quote_funcs = require("./src/quotes.js");

client.on("ready", () => {
    console.log("Monomachine started");
});

var inv_user;

client.on("messageCreate", msg => {
    /*if (msg.channel.id != ids.draw_chan)
        return;*/

    if (msg.content.startsWith("-items"))
    {
        var argv = msg.content.split(' ');
        var argc = argv.length;

        if (argv[0] != "-items")
            return;

        if (argc == 1)
        {
            var items_embed = item_funcs.get_item_list(client.user,
                msg.channel.members.get(ids.bot), 0);
            var msg_promise = msg.channel.send({embeds: [items_embed]});

            if (items_embed.footer)
            {
                msg_promise.then(async function(sent) {
                    await sent.react("%E2%AC%85%EF%B8%8F");
                    await sent.react("%E2%9E%A1%EF%B8%8F");
                });
            }
        }

        else if (argv[1] == "add")
        {

            if (msg.author.id != ids.nim && msg.author.id != ids.admin)
            {
                msg.channel.send("You can't use this.");

                return;
            }
            if (argc <= 2)
            {
                msg.channel.send("`items: usage: -items"
                    + " [add|delete item-name]`");

                return;
            }

            var str = msg.content.replace("-items add ", "");
            if (item_funcs.add_items(str))
                msg.channel.send(`**${str}** already exists.`);
            else
                msg.channel.send("Done.");
        }

        else if (argv[1] == "delete")
        {

            if (msg.author.id != ids.nim && msg.author.id != ids.admin)
            {
                msg.channel.send("You can't use this");

                return;
            }
            if (argc <= 2)
            {
                msg.channel.send("`items: usage: -items"
                    + " [add|delete item-name]`");

                return;
            }

            var str = msg.content.replace("-items delete ", "");
            if (item_funcs.delete_items(str))
                msg.channel.send(`**${str}** not found.`);
            else
                msg.channel.send("Done.");
        }

        else
            msg.channel.send("`items: usage: -items [add|delete item-name]`");
    }

    else if (msg.content == "-tirage")
        draw_funcs.draw_command(msg);

    else if (msg.content.startsWith("-set"))
    {
        var argv = msg.content.split(' ');
        var argc = argv.length;

        if (argv[0] != "-set")
            return;

        if (msg.author.id != ids.nim && msg.author.id != ids.admin)
        {
            msg.channel.send("You can't use this.");

            return;
        }

        if (argc < 4 || isNaN(argv[2]) || !argv[1].startsWith("<@!"))
        {
            msg.channel.send("`set: usage: -set user nb item`");
            return;
        }

        else
        {
            var str = msg.content.replace(/[a-zA-Z<@! \-0-9]*> [\-0-9]* /, "");
            draw_funcs.set_item(msg.mentions.users.first().id, str,
                parseInt(argv[2]));
            msg.channel.send("Done.");
        }
    }

    else if (msg.content == "-help")
        help_funcs.help_message(client.user, msg.channel.members.get(ids.bot),
            msg.channel);

    else if (msg.content.startsWith("-inventory")
        || msg.content.startsWith("-inv"))
    {
        var argv = msg.content.split(' ');
        var argc = argv.length;

        if (argv[0] != "-inventory" && argv[0] != "-inv")
            return;

        var user;

        if (argc >= 2)
        {
            if (!argv[1].startsWith("<@") || argc >= 3)
            {
                msg.channel.send("`inv: usage: -inv|inventory [@user]`");
                return;
            }

            user = msg.mentions.users.first();
        }

        else
            user = msg.author;

        var inv_embed = draw_funcs.get_inventory(user,
            msg.channel.members.get(user.id), 0);
        var inv_promise = msg.channel.send({embeds: [inv_embed]});

        inv_user = msg.author;

        if (inv_embed.footer)
        {
            inv_promise.then(async function(sent) {
                await sent.react("%E2%AC%85%EF%B8%8F");
                await sent.react("%E2%9E%A1%EF%B8%8F");
            });
        }
    }

    else if (msg.content.startsWith("-bday"))
    {
        var argv = msg.content.split(' ');
        var argc = argv.length;

        if (argv[0] != "-bday")
            return;

        if (argc == 1)
        {
            var bdays_list =
                bday_funcs.display_bdays(msg.channel.members.get(ids.bot), 0);

            var bday_promise = msg.channel.send(bdays_list);

            if (bdays_list.footer)
            {
                bday_promise.then(async function(sent) {
                    await sent.react("%E2%AC%85%EF%B8%8F");
                    await sent.react("%E2%9E%A1%EF%B8%8F");
                });
            }
        }

        else if (argv[1] == "add")
        {
            if (msg.author.id != ids.nim && msg.author.id != ids.admin)
            {
                msg.channel.send("You can't use this.");

                return;
            }

            if (isNaN(argv[2]) || isNaN(argv[3]))
            {
                msg.channel.send("`bday: usage: "
                    + "-bday / -bday name / -bday day month / "
                    + "-bday add day month name / -bday delete name`");
                return;
            }

            if (argv[1] == "add")
            {
                var name = msg.content.replace(/[a-z\-\ ]* [0-9\ ]*/, "");
                bday_funcs.add_birthday(name, argv[2], argv[3]);
                msg.channel.send("Birthday added.");
            }
        }

        else if (argv[1] == "delete")
        {
            if (msg.author.id != ids.nim && msg.author.id != ids.admin)
            {
                msg.channel.send("You can't use this.");

                return;
            }

            if (argc == 2)
            {
                msg.channel.send("`bday: usage: "
                    + "-bday / -bday name / -bday day month / "
                    + "-bday add name day month / -bday delete name`");
                return;
            }

            else
            {
                var name = msg.content.replace("-bday delete ", "");
                if (bday_funcs.del_birthday(name))
                    msg.channel.send(`**${name}**'s birthday deleted!`);
                else
                    msg.channel.send(`**${name}** not found.`);
            }
        }

        else if (argc == 3 && !isNaN(argv[1]) && !isNaN(argv[2]))
        {
            msg.channel.send(bday_funcs.get_birthday_date(argv[1], argv[2], 0));
        }

        else
        {
            var name = msg.content.replace("-bday ", "");
            bday_funcs.get_birthday_name(name, msg.channel);
        }
    }

    else if (msg.content.startsWith("-quote"))
    {
        var argv = msg.content.split(' ');
        var argc = argv.length;

        if (argv[0] != "-quote")
            return;

        if (msg.author.id != ids.nim && msg.author.id != ids.admin)
        {
            msg.channel.send("You can't use this.");

            return;
        }

        if (argc == 1)
            msg.channel.send(quote_funcs.display_quotes());

        else if (argv[1] == "add")
        {
            var str = msg.content.replace("-quote add ", "");

            var ret = quote_funcs.add_quote(str);
            if (ret == 1)
                msg.channel.send("[item] not found");
            else if (ret == 2)
                msg.channel.send("This quote exists already.");
            else
                msg.channel.send("Quote added!");
        }

        else if (argv[1] == "delete")
        {
            var str = msg.content.replace("-quote delete ", "");

            if (quote_funcs.del_quote(str))
                msg.channel.send("Quote not found.");
            else
                msg.channel.send("Quote deleted.");
        }

        else
            msg.channel.send("`quote: usage: -quote [add|delete msg]`");
    }
});

function reaction_callback(react, user) {
    if (user.bot || react.message.author.id != ids.bot)
        return;
    
    var embed = react.message.embeds[0];
    var page_nb = parseInt(embed.footer.text.split(' ')[1]) - 1;

    if (embed.author.name == "Monomachine items")
    {
        if (react.emoji.identifier == "%E2%9E%A1%EF%B8%8F") // right arrow
        {
            var items_embed = item_funcs.get_item_list(client.user,
                react.message.channel.members.get(ids.bot), page_nb + 1);
            react.message.edit({embeds: [items_embed]});
        }

        else if (react.emoji.identifier == "%E2%AC%85%EF%B8%8F") // left arrow
        {
            var items_embed = item_funcs.get_item_list(client.user,
                react.message.channel.members.get(ids.bot), page_nb - 1);
            react.message.edit({embeds: [items_embed]});
        }
    }

    else if (embed.author.name.includes("'s inventory"))
    {
        if (react.emoji.identifier == "%E2%9E%A1%EF%B8%8F")
        {

            var inv_embed = draw_funcs.get_inventory(inv_user,
                react.message.channel.members.get(inv_user.id), page_nb + 1);
            react.message.edit({embeds: [inv_embed]});
        }

        else if (react.emoji.identifier == "%E2%AC%85%EF%B8%8F")
        {
            var inv_embed = draw_funcs.get_inventory(inv_user,
                react.message.channel.members.get(inv_user.id), page_nb - 1);
            react.message.edit({embeds: [inv_embed]});
        }
    }

    else if (embed.author.name.includes("Les anniversaires"))
    {
        if (react.emoji.identifier == "%E2%9E%A1%EF%B8%8F")
        {

            var bday_embed = bday_funcs.display_bdays(
                react.message.channel.members.get(ids.bot), page_nb + 1);
            react.message.edit({embeds: [bday_embed]});
        }

        else if (react.emoji.identifier == "%E2%AC%85%EF%B8%8F")
        {
            var bday_embed = bday_funcs.display_bdays(
                react.message.channel.members.get(ids.bot), page_nb - 1);
            react.message.edit({embeds: [bday_embed]});
        }
    }
}

client.on("messageReactionAdd", reaction_callback);
client.on("messageReactionRemove", reaction_callback);

//setInterval(announce_birthday, 60000);

function announce_birthday()
{
    var date = new Date();
    var day = date.getDate().toString().padStart(2, '0');
    var month = (date.getMonth() + 1).toString().padStart(2, '0');

    var channel = client.channels.get(ids.bday_chan);

    if (date.getHours() == 0 && date.getMinutes() == 0)
        channel.send(bday_funcs.get_birthday_date(day, month, 1));
}

client.login(ids.token);
