// $ npm install passport passport-google-oauth20
// aggiunto googleId allo schema di Author

import Author from "../models/author.js";

import GoogleStrategy from 'passport-google-oauth20'
// import { callbackGoogle } from '../controllers/authentication.controller'
import jwt from 'jsonwebtoken'
import "dotenv/config";

const googleStrategy = new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // callbackUrl:`${process.env.HOST}:${process.env.PORT}${process.env.GOOGLE_CALLBACK}`
    callbackURL: process.env.GOOGLE_CALLBACK
  },

async function(accessToken, refreshToken, profile, passportNext) {//i primi due non ci servono, il profile ci serve e poi passportNext lo chiamiamo noi così, sarebbe la callback
  // oggetto profile: 
  //  {_json:{
  //   given_name:Pinco ,
  //   family_name: Pallino,
  //   email: email@email,
  //   sub: 12345678 //è un id di google
  // }}
  console.log(profile)//nel profile ci viene passato quello che ho scritto sopra nell'oggetto
    
  //nel db cherchiamo l'utente
    const {given_name: name, family_name: surname ,email, sub: googleId, picture: avatar}= profile._json
    let author = await Author.findOne({ googleId })
    //se non c'è lo creiamo
    if (!author){
      const newAuthor = new Author({
        googleId,
        name,
        surname,
        email,
        avatar,
      })
      author = await newAuthor.save()
    }
    //TODO: ora sarebbe il momento di scrivere la funzione per il jwt, noi facciamo copia incolla da quella usata dal controller
    //creiamo il jwt per l'utente

    jwt.sign(
      {authorId: author.id},
      process.env.JWT_SECRET,
      {
          expiresIn: '1h'
      },
      (err, jwtToken) =>{
          if (err) return res.status(500).send();

          //chiamiamo il prossimo middlewere di passport
          return passportNext(null ,{jwtToken})//passportNext ha 2 argomenti il primo per la gestione degli errori e il secondo è 'user' ovvero l'oggetto che ci da google e usiamo nel redirect del controller
      }
    )
  }
)

export default googleStrategy;