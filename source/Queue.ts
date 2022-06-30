import { createAudioResource, AudioPlayerStatus, entersState } from "@discordjs/voice";
import ytSearch from "yt-search";
import ytdl from "ytdl-core";
import Song from "./Song";

export default class Queue {

    
    public static async findSong(query : string) : Promise<Song | null > {
        if(ytdl.validateURL(query)){
            let info : ytdl.videoInfo = await ytdl.getInfo(query)
            return new Song(
                info.videoDetails.title,
                info.videoDetails.video_url
            )
        }else{
            const result = await ytSearch(query)
            if(result.videos.length > 0){
                const video = result.videos[0]
                return new Song(
                    video.title,
                    video.url
                )
            }
        }
        return null
    }
    
}
