const Discord = require("./dependencies/node_modules/discord.js");
const client = new Discord.Client();

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

client.on("message", msg => {
    /*if (msg.channel.id != ids.draw_chan)
        return;*/

    if (msg.content.startsWith("-item"))
    {
        if (msg.author.id != ids.nim && msg.author.id != ids.admin)
        {
            msg.channel.send("Wait, that's illegal ! "
                + "(seule nimou peut utiliser cette commande)");

            return;
        }

        var argv = msg.content.split(' ');
        var argc = argv.length;

        if (argc == 1)
        {
            var items_embed = item_funcs.get_item_list(client.user,
                msg.channel.members.get(ids.bot), 0);
            var msg_promise = msg.channel.send(items_embed);

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
            if (argc <= 2)
            {
                msg.channel.send("`item: usage: -item"
                    + " [add|delete item-name...]`");

                return;
            }

            item_funcs.add_items(argc, argv, msg.channel);
        }

        else if (argv[1] == "delete")
        {
            if (argc <= 2)
            {
                msg.channel.send("`item: usage: -item"
                    + " [add|delete item-name...]`");

                return;
            }

            item_funcs.delete_items(argc, argv, msg.channel);
        }

        else
            msg.channel.send("`item: usage: -item [add|delete item-name...]`");
    }

    else if (msg.content == "-tirage")
        draw_funcs.draw_command(msg);

    else if (msg.content.startsWith("-set"))
    {
        if (msg.author.id != ids.nim && msg.author.id != ids.admin)
        {
            msg.channel.send("Wait, that's illegal."
                + "(seule nimou peut utiliser cette commande)");

            return;
        }

        var argv = msg.content.split(' ');
        var argc = argv.length;

        if (argc < 4 || isNaN(argv[3]) || !argv[1].startsWith("<@!"))
        {
            msg.channel.send("`set: usage: -set user item nb`");
            return;
        }

        else
        {
            draw_funcs.set_item(msg.mentions.users.first().id,
                argv[2], parseInt(argv[3]));
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
        var user;

        if (argc >= 2)
        {
            if (!argv[1].startsWith("<@!") || argc >= 3)
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
        var inv_promise = msg.channel.send(inv_embed);

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
                msg.channel.send("Wait, that's illegal."
                    + "(seule nimou peut utiliser cette commande)");

                return;
            }

            if (argc != 5 || isNaN(argv[3]) || isNaN(argv[4]))
            {
                msg.channel.send("`bday: usage: "
                    + "-bday / -bday name / -bday day month / "
                    + "-bday add name day month / -bday delete name`");
                return;
            }

            if (argv[1] == "add")
            {
                bday_funcs.add_birthday(argv[2], argv[3], argv[4]);
                msg.channel.send("Birthday added.");
            }
        }

        else if (argv[1] == "delete")
        {
            if (msg.author.id != ids.nim && msg.author.id != ids.admin)
            {
                msg.channel.send("Wait, that's illegal."
                    + "(seule nimou peut utiliser cette commande)");

                return;
            }

            if (argc == 2)
            {
                msg.channel.send("`bday: usage: "
                    + "-bday / -bday name / -bday day month / "
                    + "-bday add name day month / -bday delete name`");
                return;
            }

            if (argc == 3)
            {
                if (bday_funcs.del_birthday(argv[2]))
                    msg.channel.send(`**${argv[2]}**'s birthday deleted!`);
                else
                    msg.channel.send(`**${argv[2]}** not found.`);
            }

            else
            {
                msg.channel.send("`bday: usage: "
                    + "-bday / -bday name / -bday day month / "
                    + "-bday add name day month / -bday delete name`");
                return;
            }
        }

        else if (argc == 2)
            bday_funcs.get_birthday_name(argv[1], msg.channel, 0);

        else if (argc == 3)
        {
            if (isNaN(argv[1]) || isNaN(argv[2]))
            {
                msg.channel.send("`bday: usage: "
                    + "-bday / -bday name / -bday day month / "
                    + "-bday add name day month / -bday delete name`");
                return;
            }

            channel.send(bday_funcs.get_birthday_date(argv[1], argv[2],
                msg.channel));
        }

        else
        {
            msg.channel.send("`bday: usage: "
                + "-bday / -bday name / -bday day month / "
                + "-bday add name day month / -bday delete name`");
        }

    }

    else if (msg.content.startsWith("-quote"))
    {
        if (msg.author.id != ids.nim && msg.author.id != ids.admin)
        {
            msg.channel.send("Wait, that's illegal."
                + "(seule nimou peut utiliser cette commande)");

            return;
        }

        var argv = msg.content.split(' ');
        var argc = argv.length;

        //if (argc == 1)

        if (argv[1] == "add")
        {
            var str = msg.content.replace("-quote add", "");

            if (quote_funcs.add_quote(str))
                msg.channel.send("[item] not found");
            else
                msg.channel.send("Quote added!");
        }

    }
});

client.on("messageReactionAdd", (react, user) => {
    if (user.bot)
        return;

    var embed = react.message.embeds[0];
    var page_nb = parseInt(embed.footer.text.split(' ')[1]) - 1;

    if (embed.author.name == "Monomachine items")
    {
        if (react.emoji.identifier == "%E2%9E%A1%EF%B8%8F") // right arrow
        {
            var items_embed = item_funcs.get_item_list(client.user,
                react.message.channel.members.get(ids.bot), page_nb + 1);
            react.message.edit(items_embed);
        }

        else if (react.emoji.identifier == "%E2%AC%85%EF%B8%8F") // left arrow
        {
            var items_embed = item_funcs.get_item_list(client.user,
                react.message.channel.members.get(ids.bot), page_nb - 1);
            react.message.edit(items_embed);
        }
    }

    else if (embed.author.name.includes("'s inventory"))
    {
        if (react.emoji.identifier == "%E2%9E%A1%EF%B8%8F")
        {

            var inv_embed = draw_funcs.get_inventory(inv_user,
                react.message.channel.members.get(inv_user.id), page_nb + 1);
            react.message.edit(inv_embed);
        }

        else if (react.emoji.identifier == "%E2%AC%85%EF%B8%8F")
        {
            var inv_embed = draw_funcs.get_inventory(inv_user,
                react.message.channel.members.get(inv_user.id), page_nb - 1);
            react.message.edit(inv_embed);
        }
    }

    else if (embed.author.name.includes("Les anniversaires"))
    {
        if (react.emoji.identifier == "%E2%9E%A1%EF%B8%8F")
        {

            var bday_embed = bday_funcs.display_bdays(
                react.message.channel.members.get(ids.bot), page_nb + 1);
            react.message.edit(bday_embed);
        }

        else if (react.emoji.identifier == "%E2%AC%85%EF%B8%8F")
        {
            var bday_embed = bday_funcs.display_bdays(
                react.message.channel.members.get(ids.bot), page_nb - 1);
            react.message.edit(bday_embed);
        }
    }
});

setInterval(announce_birthday, 60000);

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
