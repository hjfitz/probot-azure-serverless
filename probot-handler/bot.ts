import {Octokit} from '@octokit/rest'
import {createAppAuth} from '@octokit/auth-app'
import {doSha, getPrivateKey} from './util'

import {LogMessage, Context, EventHandler} from './bot.d'

export class ProbotFaaS {
	private prevHash: string
	private eventHandlers: EventHandler
	constructor() {
		this.prevHash = '' // make sure we're not making duplicate events
		this.eventHandlers = {}
	}

	log(...msgs: LogMessage): void {
		console.log('[bot]', ...msgs)
	}

	warn(...msgs: LogMessage): void {
		console.warn('[! bot]', ...msgs)
	}

	error(...msgs: LogMessage): void {
		console.error('[!!! bot error]', ...msgs)
	}

	async getGithub(context: Context) {
		const auth = createAppAuth({
			id: parseInt(process.env.APP_ID, 10),
			privateKey: getPrivateKey()
		})

		const installationAuth = await auth({
			type: 'installation',
			installationId: context.payload.installation.id,
		})

		return new Octokit({
			auth: installationAuth.token
		})
	}

	async handle(context: Context): Promise<void> {
		// configure auth
		const github = await this.getGithub(context)

		context = {github, ...context}

		const { name } = context?.payload?.repository
		this.log(`Attempting to handle request for ${name}`)
		
		const { action } = context.payload
		const { event } = context
		const hash = doSha(JSON.stringify(context.payload))

		// stop the bot from triggering twice for the same message
		// you may want to disable this for debugging
		if (hash === this.prevHash) return
		this.prevHash = hash

		this.log(
			`Triggered for event "${event}" and action "${action}"` +
			`in ${context?.payload?.repository?.name ?? 'unable to get name'}`
		)

		const fullEvent: string = action ? `${event}.${action}` : event

		const callbacks: Function[] = this.eventHandlers[fullEvent]

		callbacks.forEach(cb => cb())
	}

	on(event: string, callback: Function): void {
		if (this.eventHandlers[event]) this.eventHandlers[event].push(callback)
		else this.eventHandlers[event] = [callback]
	}

}

const createApp = () => {
	const bot = new ProbotFaaS()
	return bot
}

export default createApp
