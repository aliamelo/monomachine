const Discord = require("./dependencies/node_modules/discord.js");
const client = new Discord.Client();

const fs = require("fs");
const ids = JSON.parse(fs.readFileSync("data/ids.json"));


client.on("ready", () => {
    console.log("Monomachine started");
});

client.login(ids.token);
