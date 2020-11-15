import dotenv from 'dotenv'
import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import {getAccessToken} from '../probot-handler/util'

dotenv.config()


const installationId = parseInt(process.env.APP_INSTALLATION_ID, 10)

const httpTrigger: AzureFunction = async function (context: Context): Promise<void> {
	try {
		const token = await getAccessToken(installationId)
	
		context.res = {
			status: 200, /* Defaults to 200 */
			body: token
		}
	} catch (err) {
		context.res = {
			status: 500,
			body: err
		}
	}

}

export default httpTrigger
