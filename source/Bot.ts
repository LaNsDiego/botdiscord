import { AudioPlayer, joinVoiceChannel, VoiceConnection } from "@discordjs/voice";
import { CommandInteraction, Guild, GuildMember, MessageEmbed, TextChannel } from "discord.js";
import Logger from "../logger";
import BotOptions from "../types/interface.bot";
import { createDiscordJSAdapter } from "./Adapter";
import Player from "./Player";
import Queue from "./Queue";

export default class Bot{

    public textChannel : TextChannel
    public voiceConnection : VoiceConnection = null
    public guild : Guild
    public interactorMember : GuildMember
    public interaction : CommandInteraction
    public player : Player = null
    constructor(options : BotOptions){
        this.guild = options.guild
    }

    public async handle(interaction : CommandInteraction){
        this.interactorMember = await this.guild.members.cache.get(interaction.member.user.id)
        this.textChannel = interaction.channel as TextChannel
        this.interaction = interaction
        Logger.info(`Ejecutando Apolo#${interaction.commandName}`)
        const dispatcher = {
            play : async () => await this.play(interaction.options.get('song').value as string),
            showlist : () => this.showList(interaction),
            skip : () => this.skip(interaction),
            pause : () => this.pause(),
            resume : () => this.resume(),
        }
        dispatcher[interaction.commandName]()
    }

    public async play(query : string){
        this.voiceConnection = this.voiceConnection || joinVoiceChannel({
            channelId: this.interactorMember.voice.channelId,
            guildId: this.interaction.guild.id,
            adapterCreator:  createDiscordJSAdapter(this.interactorMember.voice.channel)
        })
        if(!this.voiceConnection) return this.interaction.reply({ content : `Debes unirte a un canal de voz por favor.`})
        this.player = this.player ||new Player(this.voiceConnection)
        const song = await Queue.findSong(query)
        this.interaction.reply(`Buscando ${query}`)
        if(song){
            this.player.trackList = [song , ...this.player.trackList]
            const resource = await song.makeResource()!
            this.player.play(resource);
        }
        return
    }
    
    public showList(interaction : CommandInteraction){
        const  messageEmbeded = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Lista de reproducción')
            .setDescription(this.player.trackList.map((s,i) => `[${++i}]  ${s.title}`).join("\n"))
            .setTimestamp()
            .setFooter({ text: 'Cachame papi :3 !!!' });
        return interaction.reply({embeds : [messageEmbeded]})
    }

    public skip(interaction : CommandInteraction){
        return interaction.reply(`Skip 1/2`)
    }

    public pause(){
        if(this.player && this.player.pause()){
            return this.interaction.reply(`Reproducción pausada.`)
        }
        return this.interaction.reply(`No se pudo pausar la reproducción.`)
    }

    public resume(){
        if(this.player && this.player.resume()){
            return this.interaction.reply(`Reproducción pausada.`)
        }
        return this.interaction.reply(`No se pudo reanudar la reproducción.`)
    }
}