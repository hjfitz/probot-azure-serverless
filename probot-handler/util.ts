import fs from 'fs'
import path from 'path'
import axios from 'axios'
import { exec } from 'child_process'
import jwt from 'jsonwebtoken'
import {createHash} from 'crypto'

export const doSha = (data: string): string => createHash('sha1').update(data).digest('base64')

export const getPrivateKey = (): string => Buffer.from(process.env.PRIVATE_KEY, 'base64').toString()

interface Context {
	[key: string]: any
}

type ATParam = Context | number

export async function getAccessToken(context: ATParam) {
	let id: number 
	if (typeof context === 'number') id = context
	else id = context.payload.installation
	const appId: number = parseInt(process.env.APP_ID, 10)
	const privateKey: string = getPrivateKey()
	const now = Math.floor(Date.now() / 1000)
	const payload = {
		iat: now, // Issued at time
		exp: now + 60, // JWT expiration time
		iss: appId
	}
	const token = jwt.sign(payload, privateKey, {algorithm: 'RS256'})
	const { data } = await axios.post(`https://api.github.com/app/installations/${id}/access_tokens`, {}, {
		headers: {
			'Authorization': `Bearer ${token}`,
			'Accept': 'application/vnd.github.machine-man-preview+json'
		}
	})
	return data.token
}

export const sh = (cmd: string) => new Promise((res, rej) => exec(cmd, (err, stdout) => err ? rej(err) : res(stdout)))

export function walk(dirOrFile: string, cb: Function, ignored: string[] = []): void {
	if (!fs.existsSync(dirOrFile)) return
	// check to see if we are in the ignored list
	for (const subPath of ignored)
		if (dirOrFile.includes(subPath)) return

	const info = fs.statSync(dirOrFile)
	if (info.isDirectory()) {
		const contents = fs.readdirSync(dirOrFile)
		// use map as to not fuck with the callback stack
		contents.map((block) => walk(path.join(dirOrFile, block), cb, ignored))
	} else if (info.isFile()) {
		cb(dirOrFile)
	}
}

