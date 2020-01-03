const Discord = require("./dependencies/node_modules/discord.js");
const client = new Discord.Client();

const fs = require("fs");
const ids = JSON.parse(fs.readFileSync("data/ids.json"));

const item_funcs = require("./src/items.js");
const tirage_funcs = require("./src/tirage.js");

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
    {
        tirage_funcs.tirage_command(msg);
    }
});

client.login(ids.token);
