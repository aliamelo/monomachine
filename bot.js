const Discord = require("./dependencies/node_modules/discord.js");
const client = new Discord.Client();

const fs = require("fs");
const ids = JSON.parse(fs.readFileSync("data/ids.json"));

const item_funcs = require("./src/items.js");
const draw_funcs = require("./src/draw.js");
const help_funcs = require("./src/help.js");

client.on("ready", () => {

    client.user.setActivity("souhaite votre mort.");

    console.log("Monomachine started");
});

client.on("message", msg => {
    if (msg.content.startsWith("-item"))
    {
        var argv = msg.content.split(' ');
        var argc = argv.length;

        if (argc == 1)
            msg.channel.send(item_funcs.get_items_embed(client.user, 0));

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
        var argv = msg.content.split(' ');
        var argc = argv.length;

        if (argc < 4 || isNaN(argv[3]) || !argv[1].startsWith("<@!"))
        {
            msg.channel.send("`set: usage: -set item nb user`");
            return;
        }

        else
        {
            draw_funcs.set_item(msg.mentions.users.first().id,
                argv[2], parseInt(argv[3]));
        }
    }

    else if (msg.content == "-help")
        help_funcs.help_message(client.user, msg.channel);
});

client.on("messageReactionAdd", (react, user) => {
    if (user.bot)
        return;

    var embed = react.message.embeds[0];
    var page_nb = embed.footer.text.split(' ')[1];

    if (embed.author.name == "Monomachine items")
    {
        if (react.emoji.identifier == "%E2%9E%A1%EF%B8%8F")
        {
            var items_embed = item_funcs.get_items_embed(client.user,
                parseInt(page_nb));
            react.message.channel.send(items_embed);
        }
    }
});

client.login(ids.token);
