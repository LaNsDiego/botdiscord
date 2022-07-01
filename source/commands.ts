import { ApplicationCommandDataResolvable } from "discord.js";
import { ApplicationCommandOptionTypes } from "discord.js/typings/enums";

const commands : ApplicationCommandDataResolvable [] = [
	{
		name: 'play',
		description: 'Reproduce una canción.',
		options : [
			{
				name : 'song',
				description : 'URL o nombre de la canción',
				required : true,
				type : ApplicationCommandOptionTypes.STRING
			},
		]
	},
	{
		name : 'showlist',
		description : 'Muestra la cola de reproducción.',
	},
	{
		name : 'skip',
		description : 'Saltar la reproducción actual.',
	},
	{
		name : 'pause',
		description : 'Pausar la reproducción.',
	},
	{
		name : 'resume',
		description : 'Reanudar la reproducción.',
	}
]; 

export default commands