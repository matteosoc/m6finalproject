import { Schema, model } from "mongoose";

const authorSchema = new Schema({
    nome: String,
    cognome: String,
    email: {
        type: String,
        required: true, // obbligatorio
        unique: true, // non può esistere lo stesso valore nel database
        lowercase: true, // converte in minuscolo
        trim: true // toglie spazi vuoti
    },
    password: {
        type: String,
        // required: true,
        select: false // non viene mai selezionata o mostrata
    },
    data: Date,
    avatar: String,
    googleId: String
}, {
    collection: 'authors'
})

// costante da esportare
const Author = model('Author', authorSchema)

export default Author;