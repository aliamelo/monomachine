const Discord = require("./dependencies/node_modules/discord.js");
const client = new Discord.Client();

const fs = require("fs");
const ids = JSON.parse(fs.readFileSync("data/ids.json"));

const items = require("./src/items.js");

client.on("ready", () => {
    console.log("Monomachine started");
});

client.on("message", msg => {
    if (msg.content == "bip")
        items.display(msg.channel);
});

client.login(ids.token);
