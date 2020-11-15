import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import createApp from './bot'
import dotenv from 'dotenv'

import {Context as BotContext} from './bot.d'

dotenv.config()


const app = createApp()

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
	const name  = req.headers['x-github-event'] || req.headers['X-GitHub-Event']
	const id = req.headers['x-github-delivery'] || req.headers['X-GitHub-Delivery']
	const {body: payload} = req

	// console.log({payload})
	// const event = req.headers['x-github-event']

	// todo: create github client and add to context
	const repo =  () => {
		const {repository: repo} = payload
	
	
		return {
			owner: repo.owner.login || repo.owner.name,
			repo: repo.name
		}
	}

	const botContext: BotContext = {name, id, payload, repo, event: name}

	await app.handle(botContext) 

	context.res = {
		status: 200, 
		body: 'handled' 
	}

}

export default httpTrigger
