
import { VoiceConnection } from "@discordjs/voice";
import { CommandInteraction, Guild, GuildMember, MessageEmbed, VoiceChannel } from "discord.js";
import { createDiscordJSAdapter } from "./Adapter";
import Player from "./Player";
import Queue from "./Queue";

export default class Command{
    public voiceConnection : VoiceConnection = null
    public player : Player
    constructor(voiceConnection : VoiceConnection){
        this.player = new Player(voiceConnection)
    }

    public async play(interaction : CommandInteraction , guild : Guild , member : GuildMember){
        if(!member.voice.channel) return interaction.reply({ content : "Debes unirte a un canal de voz"})
        
        const query : string = interaction.options.get('song').value as string
        const song = await Queue.findSong(query)
        interaction.reply(`Buscando ${query}`)
        if(song){
            const resource = await song.makeResource()!
            this.player.play(resource);
        }
        return 
    }
    public showList(interaction : CommandInteraction){
        const  exampleEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Lista de reproducción')
            .setDescription('')
            .addFields(
                // ...this.player.trackList.map((s,i) => ({ name:`[${i}]`, value : ` ${s.title}`}))
            )
            .setTimestamp()
            .setFooter({ text: 'Cachame papi :3 !!!' });
        return interaction.reply({embeds : [exampleEmbed]})
    }

    public skip(interaction : CommandInteraction){
        return interaction.reply(`Opciones : ${interaction.command?.options.map(op => op.name).join(",")}`)
    }

    public handle(interaction : CommandInteraction , guild : Guild , member : GuildMember){
        const dispatcher = {
            play : async () => await this.play(interaction,guild , member),
            showlist : () => this.showList(interaction),
            skip : () => this.skip(interaction),
        }
        dispatcher[interaction.commandName]()
    }
}