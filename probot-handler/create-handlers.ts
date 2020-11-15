import {app} from './index'

app.on('repository.installed', async (context) => {
	console.log('repo installed!')
})
