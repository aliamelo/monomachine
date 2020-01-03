const Discord = require("./dependencies/node_modules/discord.js");
const client = new Discord.Client();

const fs = require("fs");
const ids = JSON.parse(fs.readFileSync("data/ids.json"));

const item_funcs = require("./src/items.js");
const draw_funcs = require("./src/draw.js");

client.on("ready", () => {
    console.log("Monomachine started");
});

client.on("message", msg => {
    if (msg.content.startsWith("-item"))
    {
        var argv = msg.content.split(' ');
        var argc = argv.length;

        if (argc == 1)
            item_funcs.display(msg.channel);

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

        if (argc < 3 || isNaN(argv[2]))
        {
            msg.channel.send("`set: usage: -set item nb`");
            return;
        }

        else
            draw_funcs.set_item(msg.member.id, argv[1], parseInt(argv[2]));
    }
});

client.login(ids.token);
