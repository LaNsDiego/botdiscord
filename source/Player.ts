import { AudioPlayer, entersState, createAudioPlayer, AudioResource, VoiceConnection, AudioPlayerStatus   } from "@discordjs/voice"
import Logger from "../logger"
import Bot from "./Bot"
import Song from "./Song"
export default class Player {
    
    private audioPlayer : AudioPlayer
    public trackList : Song[]
    public voiceConnection : VoiceConnection
    public isPlaying : boolean
    public bot : Bot
    constructor(voiceConnection : VoiceConnection , bot: Bot){
        this.audioPlayer = createAudioPlayer()
        this.voiceConnection = voiceConnection
        this.voiceConnection.subscribe(this.audioPlayer)
        this.trackList = []
        this.isPlaying = false
        this.bot = bot
        this.audioPlayer.on(AudioPlayerStatus.Playing,()=>{
            this.isPlaying = true
        })

        this.audioPlayer.on(AudioPlayerStatus.Idle,async ()=>{
            if(!(await this.next())){//Si no hay next song
                this.isPlaying = false
            }
        })
    }

    async play (resource : AudioResource) {
        resource.volume?.setVolumeLogarithmic(1);
        this.audioPlayer.play(resource)
    }

    pause(){
        try {
            if(this.audioPlayer.pause()){
                return true
            }
            Logger.warn(`No se pudo pausar la reproducción.`)
        } catch (error) {
            Logger.error(error)
        }
        return false
    }

    public resume() : boolean {
        try {
            if(this.audioPlayer.unpause()){
                return true
            }
            Logger.warn(`No se pudo reanudar la reproducción`)
        } catch (error) {
            Logger.error(error)
        }
        return false
    }

    public async next() : Promise<boolean>{
        if(this.trackList.length == 0 )
            return new Promise((resolve) => resolve(false))
        const song = this.trackList.shift()
        this.audioPlayer.play(await song.makeResource())
        Logger.info(`Reproduciendo : ${song.title}`)
        this.bot.onNext(song)
        return new Promise((resolve) => resolve(true))
    }

}