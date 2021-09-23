const Discord = require('discord.js');
const client = new Discord.Client();
const DisTube = require('distube');
const distube = new DisTube(client,{ searchSongs: false, emitNewSongOnly: true });
const prefix = "+";
client.once('ready', () => {
    console.log('Sikeresen Csatlakozot belépet a Discord Szerver-re');
});
client.on('message', async (message) => {
  
    var natural_pictures=["https://bit.ly/36d2AvY","https://bit.ly/37gfMPR","https://bit.ly/2VcHJT9"];
    var cats_pictures=["https://bit.ly/3AkyKSJ","https://bit.ly/3kmaGcR","https://bit.ly/2VOdB4n"];
    function randomIntInc(low, high) {
        return Math.floor(Math.random() * (high - low + 1) + low)
    }
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift();

    // Queue status template
    const status = (queue) => `Volume: \`${queue.volume}%\` | Filter: \`${queue.filter || "Off"}\` | Loop: \`${queue.repeatMode ? queue.repeatMode == 2 ? "All Queue" : "This Song" : "Off"}\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``;

    // DisTube event listeners, more in the documentation page
    distube
        .on("playSong", (message, queue, song) => message.channel.send(
            `Playing \`${song.name}\` - \`${song.formattedDuration}\`\nRequested by: ${song.user.tag}\n${status(queue)}`
        ))
        .on("addSong", (message, queue, song) => message.channel.send(
            `Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user.tag}`
        ))
        .on("playList", (message, queue, playlist, song) => message.channel.send(
            `Play \`${playlist.name}\` playlist (${playlist.songs.length} songs).\nRequested by: ${song.user.tag}\nNow playing \`${song.name}\` - \`${song.formattedDuration}\`\n${status(queue)}`
        ))
        .on("addList", (message, queue, playlist) => message.channel.send(
            `Added \`${playlist.name}\` playlist (${playlist.songs.length} songs) to queue\n${status(queue)}`
        ))
        // DisTubeOptions.searchSongs = true
        .on("searchResult", (message, result) => {
            let i = 0;
            message.channel.send(`**Choose an option from below**\n${result.map(song => `**${++i}**. ${song.name} - \`${song.formattedDuration}\``).join("\n")}\n*Enter anything else or wait 60 seconds to cancel*`);
        })
        // DisTubeOptions.searchSongs = true
        .on("searchCancel", (message) => message.channel.send(`Searching canceled`))
        .on("error", (message, e) => {
            console.error(e)
            message.channel.send("An error encountered: " + e);
        });
    if (command=="play"){
        if(!message.member.voice.channel)return message.channel.send('you are not in a voice channel');
        if(!args[0])return message.channel.send('Meg kell mondania valamit a lejátszáshoz.');
        distube.play(message, args.join(" "));
            
    }
    if (command=="stop"){
        const bot = message.guild.members.cache.get(client.user.id);
        if(!message.member.voice.channel)return message.channel.send('you are not in a voice channel');
        if(bot.voice.channel != message.member.voice.channel)return message.channel.send('you are not in the same voice chanel as the bot')
        distube.stop(message);
        message.channel.send('Leállítottad a zenét.');
            
    }

    if (command=="skip"){
        distube.skip(message);
        message.channel.send('Átugrotam!');
    }
    if (message.content === `${prefix}help`) {
        message.channel.send(`\n*Parancsok:*\n ${prefix}dev-info: A Fejlesztőmről írok ki információkat.\n${prefix}user-info : felhasználók-ról írok ki információt\n${prefix}ping:kiírom hogy mennyi idő alatt ért el az üzenet.\n ${prefix}szerver-info : A szerver-ről írok ki információt\n\n ${prefix}t_kep : küldök egy random természeti képet\n${prefix} c_kep: küldök egy random cicás képet\n \n${prefix}play <youtube link/előadó név/zene cím> : lejátszás \n ${prefix}skip átugrok egy számot\n ${prefix}stop:zene megálítás\n${prefix}clean: megtisztítom az üzenőfalat`);
    }
    if(message.content===`${prefix}ping`){
        const timeTaken = Date.now() - message.createdTimestamp;
        message.reply(`Ping! Ennek az üzenetnek késleltetési ideje volt ${timeTaken}ms.`);
    }
    if (message.content === `${prefix}szerver-info`) {
        message.channel.send(`Szerver név: ${message.guild.name}\nA Jelenlegi Tagok Száma: ${message.guild.memberCount}`);
    }
    if (message.content === `${prefix}user-info`) {
        message.channel.send(`Felhasználóneved: ${message.author.username}\nAzonosítód: ${message.author.id}`);
    }
    if (message.content === `${prefix}t_kep`) {
        message.channel.send(`ez egy természetes kép `);
        message.channel.send(`${natural_pictures[randomIntInc(0,2)]}`);
    }
    if (message.content === `${prefix}c_kep`) {
        message.channel.send(`ez egy cuki cica`);
        message.channel.send(`${cats_pictures[randomIntInc(0,2)]}`);
    }
    if(message.content === `${prefix}clean`) {
        message.channel.bulkDelete(50)
        .then(messages => console.log(`Bulk deleted ${messages.size} messages`))
        .catch(console.error);
     message.channel.send("Chat tisztítva");}
     //----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------
    client.on("guildMemberAdd", (member) => {
        newUsers.set(member.id, member.user);
    });
    client.on("guildMemberRemove", (member) => {
        if(newUsers.has(member.id)) newUsers.delete(member.id);
    });
    client.on("guildMemberAdd", (member) => {
        const guild = member.guild;
        newUsers.set(member.id, member.user);

        if (newUsers.size = 1) {
          const defaultChannel = guild.channels.cache.find(channel => channel.permissionsFor(guild.me).has("SEND_MESSAGES"));
          const userlist = newUsers.map(u => u.toString()).join(" ");
          defaultChannel.send("Welcome !\n" + userlist);
          newUsers.clear();
        }
      }); 
      if(message.content === `${prefix}dev-info`) {
        message.channel.send(`Ezt a Bot-ot programozta/tesztelte/debugolta/üzemelteti:\n Tóth Tibor 2021.09.17`);
    }
})

client.login(process.env.BOT_TOKEN);
