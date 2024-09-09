import express from 'express';
import 'dotenv/config';
import mongoose, { mongo } from 'mongoose';

import authorRouter from './router/author.router.js';
import blogPostRouter from './router/blogPost.router.js';
import authRouter from './router/auth.router.js';

import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors'

import googleStrategy from './config/passport.config.js';

import passport from 'passport';



const port = process.env.PORT || 4000

const server = express();

passport.use('google', googleStrategy)

// installazioni per fare upload immagini npm i multer morgan helmet cors
server.use(morgan('dev'))
server.use(helmet())

// postizionato prima della rotte
server.use(cors())

// permette di accedere al file da http://localhost:3000/uploads/nome_file
server.use('/uploads', express.static('./uploads'))

server.use(express.json());

server.use('/authors', authorRouter)
server.use('/blogPosts', blogPostRouter)

server.use('/', authRouter);

await mongoose
    .connect(process.env.MONGODB_CONNECTION_URI)
    .then(() => console.log('database connesso'))
    .catch((err) => console.log(err));

server.listen(port, () => {
    console.log(`server avviato su ${process.env.HOST}:${port}`);
})