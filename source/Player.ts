import { AudioPlayer, entersState, createAudioPlayer, AudioResource, VoiceConnection   } from "@discordjs/voice"
import Logger from "../logger"
import Song from "./Song"
export default class Player {
    
    private audioPlayer : AudioPlayer
    public trackList : Song[]
    public voiceConnection : VoiceConnection
    constructor(voiceConnection : VoiceConnection){
        this.audioPlayer = createAudioPlayer()
        this.voiceConnection = voiceConnection
        this.voiceConnection.subscribe(this.audioPlayer)
        this.trackList = []
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

}