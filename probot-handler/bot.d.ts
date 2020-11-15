import {Octokit} from '@octokit/rest'

export * from './bot'

export type LogMessage = (string | number | object)[]


export interface Context {
	name: string
	id: string
	payload: any
	repo: () => RepoInfo
	event: string
	github?: Octokit
}

// module.event.action
export interface ModuleActions {
	[action: string]: Function[]
}

export interface ModuleList {
	[event: string]: ModuleActions
}

export interface RepoInfo {
	owner: string
	repo: string
}

export interface EventHandler {
	[eventName: string]: Function[]
}

