import { Client, Intents } from 'discord.js'

import commands from './source/commands';
import 'dotenv/config'
import Logger from './logger';
import Bot from './source/Bot';

const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES ] })
let Apolo : Bot = null
const token = process.env.TOKEN_DISCORD
const guildId = process.env.GUILD_ID

client.on('ready', async (c) => {
	const guild =  client.guilds.cache.get(guildId)
	await guild.commands.set(commands)	
	Logger.info(`Bot ${process.env.BOT_NAME} esperando por solicitudes.`)
});

client.on('interactionCreate', async (interaction) => {
	try {
		if(interaction.isCommand()){
			const guild =  client.guilds.cache.get(guildId)
			Apolo = Apolo || new Bot({guild})
			Apolo.handle(interaction)
		}
	} catch (error) {
		Logger.error(error)
	}
});

client.login(token);