const Discord = require("discord.js");
const YTDL = require("ytdl-core");

const TOKEN = "";
const PREFIX = "UwU ";

function generateHex() {
    return "#" + Math.floor(Math.random()* 16777215).toString(16);
}

function play(connection, message) {
    var server =  servers[message.guild.id];

    server.dispatcher = connection.playStream(YTDL(server.queue[0], {filter: "audioonly"}));

    server.queue.shift();

    server.dispatcher.on("end", function() {
        if (server.queue[0]) play(connection, message);
        else connection.disconnect();
    });
}

var fortunes = [
    "Yes",
    "No",
    "Maybe",
    "fudge you"
];

var bot = new Discord.Client();

var servers = {};

bot.on("ready", function() {
    console.log("Ready");   
});

bot.on("guildMemberAdd", function(member) {
    member.guild.channels.find("name", "general").sendMessage(member.toString() + " Welcome new captured human person");

    member.addRole(member.guild.roles.find("name", "booth"));

    member.guild.createRole({
        name: member.user.username,
        color: generateHex(),
        permissions: []
    }).then(function(role) {
        member.addRole(role);
    })
});

bot.on("message", function(message) {
    if (message.author.equals(bot.user)) return;

    if (!message.content.startsWith(PREFIX)) return;

    var args = message.content.substring(PREFIX.length).split(" ");

    switch (args[0].toLowerCase()) {
        case "Ping":
            message.channel.sendMessage("Pong!");
            break;
        case "info":
            message.channel.sendMessage("I'm a cool bot ya hear");
            break;
        case "8ball":
            if (args[1]) message.channel.sendMessage(fortunes[Math.floor(Math.random() * fortunes.length)]);
            else message.channel.sendMessage("Food machine broke");
            break;
        case "calculator":
            message.channel.sendMessage("I can do calculations really fast, Try me ^-^.");

            break;
        case "embed":
            var embed = new Discord.RichEmbed()
                .addField("Username", "UwU", true)
                .addField("Meme", "HMM i Dunno", true)
                .addField("Description", "This is UwU she is nice go on she wont bite!", true)
                .addField("Owner Description", "This is a bot that can do many things want to see?",)
                .addField("abilities", "I can do many things want to see?")
                .addField("Your thumbnail", "I have taken your user photo i hope you dont mind")
                .setColor(0xda88d7)
                .setFooter("Do you like my embed")
                .setThumbnail(message.author.avatarURL)
            message.channel.sendEmbed(embed);
            break;
        case "noticeme":
                message.channel.sendMessage(message.author.toString() + "You wanted to be mentioned!");
            break;
        case "removerole":
                message.member.removeRole(message.member.guild.roles.find("name", "bitch"));
                break;
        case "deleterole":
                message.guild.roles.find("name", "bitch").delete();
                break;
        case "play":
                if (!args[1]) {
                    message.channel.sendMessage("Please provide a link!");
                    return;
                0}
                
                if (!message.member.voiceChannel) {
                    message.channel.sendMessage("You must be in a voice channel");
                    return;
                }
                if(!servers[message.guild.id]) servers[message.guild.id] = {
                    queue: []
                };
                var server = servers[message.guild.id];

                server.queue.push(args[1]);

                if (!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection) {
                    play(connection, message);
                });
                break;
        case "skip":
                var server = servers[message.guild.id];

                if (server.dispatcher) server.dispatcher.end();
                break;
        case "stop": 
                var server = servers[message.guild.id];
                
                if (message.guild.voiceConnection) message.guild.voiceConnection.disconnect();
                break;
        default:
            message.channel.sendMessage("Invalid command");
    }
}); 

bot.login(TOKEN);