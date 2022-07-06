import { AudioPlayer, joinVoiceChannel, VoiceConnection } from "@discordjs/voice";
import { CommandInteraction, Guild, GuildBasedChannel, GuildChannelManager, GuildMember, MessageEmbed, TextChannel } from "discord.js";
import { ChannelTypes } from "discord.js/typings/enums";
import Logger from "../logger";
import BotOptions from "../types/interface.bot";
import { createDiscordJSAdapter } from "./Adapter";
import Player from "./Player";
import Queue from "./Queue";
import Song from "./Song";

export default class Bot{

    public textChannel : TextChannel
    public voiceConnection : VoiceConnection = null
    public guild : Guild
    public interactorMember : GuildMember
    public interaction : CommandInteraction
    public player : Player = null
    public votes : string[] = []
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
        this.player = this.player ||new Player(this.voiceConnection , this)
        const song = await Queue.findSong(query)
        this.interaction.reply(`Buscando ${query}`)
        if(song){
            this.player.trackList = [song , ...this.player.trackList]
            if(this.player.isPlaying){
                return this.textChannel.send(`Se agrego a la cola de reproducción : ${song.title}`)
            }
            await this.player.next()
            return this.textChannel.send(`Se agrego a la cola de reproducción : ${song.title}`)
        }
        Logger.info(`Intentando #play con ${query}`)
        this.play(query)
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

    public async skip(interaction : CommandInteraction){
        if(!this.voiceConnection) return this.interaction.reply({ content : `Debes unirte a un canal de voz por favor.`})
        if(this.votes.find(idMember => idMember === this.interactorMember.id)){
            return interaction.reply(`${this.interactorMember.nickname} ejecutó el comando SKIP`)
        }
        const quantityMembers = this.interactorMember.voice.channel.members.size;
        const fiftyPercent = Math.ceil(quantityMembers / 2)
        this.votes.push(this.interactorMember.id)
        interaction.reply(`${this.interactorMember.nickname} a votado ${this.votes.length}/${quantityMembers}`)
        if(quantityMembers >= fiftyPercent){
            this.player.next()
            return this.textChannel.send(`Aplicando SKIP a la reproducción`)
        }
        return 
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

    public onNext(song : Song){
        const messageEmbeded  = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Reproduciendo...')
        .setDescription(`Song : ${song.title}`)
        .setTimestamp()
        .setFooter({ text: 'Cachame papi :3 !!!' });
        
        this.textChannel.send({embeds : [messageEmbeded]})
    }
}