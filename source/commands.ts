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
		description : 'Play list',
	},
	{
		name : 'skip',
		description : 'Pasa a la siguiente canción.',
	}
]; 

export default commands