import { AudioPlayer, entersState, createAudioPlayer, AudioResource, VoiceConnection   } from "@discordjs/voice"
export default class Player {
    
    private audioPlayer : AudioPlayer
    private trackList : any[]
    public voiceConnection : VoiceConnection
    constructor(voiceConnection : VoiceConnection){
        this.audioPlayer = createAudioPlayer()
        this.voiceConnection = voiceConnection
        this.voiceConnection.subscribe(this.audioPlayer)
    }

    async play (resource : AudioResource) {
        resource.volume?.setVolumeLogarithmic(1);
        this.audioPlayer.play(resource)
    }

}