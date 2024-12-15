import 'dotenv/config'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { config } from './config/app.config'
import express, { NextFunction, Request, Response } from 'express'

import { HTTPSTATUS } from './config/http.config'
import connectDatabase from './database/database'
import passport from './middlewares/passport'
import { errorHandler } from './middlewares/errorHandler'
import { asyncHandler } from './middlewares/asyncHandler'
import mfaRoutes from './modules/mfa/mfa.routes'
import authRoutes from './modules/auth/auth.routes'
import sessionRoutes from './modules/session/session.routes'
import { authenticateJWT } from './common/strategies/jwt.strategy'

const app = express()
const BASE_PATH = config.BASE_PATH

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
	cors({
		origin: config.APP_ORIGIN,
		credentials: true,
	})
)

app.use(cookieParser())
app.use(passport.initialize())

app.get(
	'/',
	asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
		res.status(HTTPSTATUS.OK).json({
			message: 'Hello Subscribers!!!',
		})
	})
)

app.use(`${BASE_PATH}/auth`, authRoutes)
app.use(`${BASE_PATH}/mfa`, mfaRoutes)
app.use(`${BASE_PATH}/session`, authenticateJWT, sessionRoutes)

app.use(errorHandler)

app.listen(config.PORT, async () => {
	await connectDatabase()
	console.log(`Server listening on port ${config.PORT} in ${config.NODE_ENV}`)
})
