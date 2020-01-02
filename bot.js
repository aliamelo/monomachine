const Discord = require("./dependencies/node_modules/discord.js");
const client = new Discord.Client();

var token = "NjYyMjgxNDM4ODEyNzAwNjky.Xg316A.y_d5Xuqzv1uYo8NhLpy23PtbpSE";

client.on("ready", () => {
    console.log("Logged in as ${client.user.tag}!");
});

client.login(token);
