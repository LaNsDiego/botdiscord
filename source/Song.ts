import { AudioResource, createAudioResource, StreamType } from "@discordjs/voice";
import ytdl from "ytdl-core";

export default class Song{

    public readonly title : string
    public readonly url : string

    constructor(title : string , url : string){
        this.title = title
        this.url = url
    }

    public async makeResource() : Promise<AudioResource<Song>> {
        let stream = await ytdl(this.url,
            {
                highWaterMark: 1 << 25 ,
                filter : "audioonly" ,
                quality : 'highestaudio'
            })
        return createAudioResource(stream, { metadata: this, inputType: StreamType.OggOpus , inlineVolume: true  });
    }
}