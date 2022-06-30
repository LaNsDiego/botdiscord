import { joinVoiceChannel, VoiceConnection } from '@discordjs/voice';
import { Client, Intents } from 'discord.js'
import { createDiscordJSAdapter } from './source/Adapter';
import Command from './source/Command';
import commands from './source/commands';

const client = new Client({
	 intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES ] 
});
let commander : Command = null
const token = 'OTMxMDI1ODI1MjcxMjYzMjUy.GKL9MC.IfmhHnk6nPEi4a54IbPb4y5_RS9vg_PsyJp9os'
// const guildId = '932070539751743558'//TEST server
const guildId = '865772253803446292'//Monte Olimpo

client.on('ready', async (c) => {
	// console.log(client.guilds.cache)
	const guild =  client.guilds.cache.get(guildId)
	await guild.commands.set(commands)
	
	console.log("Bot Apolo ejecutando ")
});




client.on('interactionCreate', async (interaction) => {
	try {
		const guild =  client.guilds.cache.get(guildId)
		const member = await guild.members.cache.get(interaction.member.user.id)
		if(interaction.isCommand()){
			const voiceConnection : VoiceConnection = joinVoiceChannel({
				channelId: member.voice.channelId,
				guildId: interaction.guild.id,
				adapterCreator:  createDiscordJSAdapter(member.voice.channel)
			})
			commander =  commander || new Command(voiceConnection)
			commander.handle(interaction,guild,member)
		}
	} catch (error) {
		console.log("[Error] : Error en InteractionCreate")
	}
});


// export  function createDiscordJSAdapter(channel) {
// 	return (methods) => {
		
// 		return {
// 			sendPayload(data) {
// 				return false;
// 			},
// 			destroy() {
// 				return true
// 			},
// 		};
// 	};
// }


client.login(token);