import Author from '../models/author.js';
import 'dotenv/config';
import transport from '../services/mail.service.js';
import bcrypt from 'bcrypt';

// visualizza tutti autori
export const readMultiple = async (req, res) => {
    const page = req.query.page || 1
    const perPage = req.query.perPage || 3

    const authors = await Author.find({})
        .sort({ data: -1 })
        .skip((page - 1) * perPage)
        .limit(perPage)

    // const totalPages = await Author.aggregate([])
    const totalResults = await Author.countDocuments() // sintassi semplificata di mongoose
    const totalPages = Math.ceil(totalResults / perPage)

    // risultato visualizzato
    res.send({
        dati: authors, // JSON autori
        totalPages, // numero totale di pagine
        totalResults // numero totale di risultati
    })
};

// visualizza un autore
export const readOne = async (req, res) => {
    const id = req.params.id
    try {
        const author = await Author.findById(id)
        res.send(author)
    }
    catch (error) {
        console.log(error)
        res.status(404).send({ message: 'Non trovato' })
    }
};


/*
    export const createOne = async (req, res) => {
        const authorData = req.body
        authorData.avatar = `${process.env.HOST}:${process.env.PORT}/uploads/${req.filename}`
        const newAuthor = new Author(authorData)
        try {
            const createdAuthor = await newAuthor.save()

            res.status(201).send(createdAuthor)
        }
        catch (error) {
            console.log(error)
            res.status(400).send({ message: 'qualcosa non va' })
        }
    } 
*/

// crea un nuovo autore
export const createOne = async (req, res) => {
    const authorData = req.body


    // verificare che la mail non sia già utilizzata
    const author = await Author.findOne({ email: req.body.email });

    // se non c'è avatar prende imposta un immagine random
    author.avatar = author.avatar ? author.avatar : "https://picsum.photos/40"

    if (author) return res.status(500).send('Mail già in uso');

    // modifica il campo avatar e crea la password criptata dell'utente
    const newAuthor = new Author({
        ...authorData,
        avatar: req.file.path,
        password: await bcrypt.hash(req.body.password, 10)
    });
    
    // salva il nuovo utente creato
    const createdAuthor = await newAuthor.save()

    try {
        res.status(201).send(createdAuthor)

        await transport.sendMail(
            {
                from: 'noreply@striveblog.com', // mittente
                to: createdAuthor.email, // destinatario
                subject: 'Benvenuto su Strive Blog', // oggetto
                text: `Benvenuto ${createdAuthor.nome}`, // testo visualizzato se non ha supporto html
                html: `<b>Benvenuto ${createdAuthor.cognome}</b>`, // html body
            }
        )
    }
    catch (error) {
        console.log(error)
        res.status(400).send({ message: 'qualcosa non va' })
    }
};


// test con upload locale di immagine
/* export const createOne = async (req, res) => {
    return res.send(req.file)
} */


// modifica di un autore
export const editOne = async (req, res) => {
    const id = req.params.id
    const authorData = req.body
    try {
        await Author.findByIdAndUpdate(id, authorData)
        const author = await Author.findById(id)

        await author.save()

        res.send(author)
    }
    catch (error) {
        console.log(error)
        res.status(400).send({ message: 'errore nella modifica' })
    }
};

// elimina autore
export const deleteOne = async (req, res) => {
    const id = req.params.id
    try {
        await Author.findByIdAndDelete(id)
        res.send({ message: 'eliminato correttamente' })
    }
    catch (error) {
        console.log(error)
        res.status(400).send({ message: 'errore nella modifica' })
    }
};

// patch avatar di un autore
export const patchAvatar = async (req, res) => {
    const id = req.params.authorId

    try {
        const author = await Author.findByIdAndUpdate(id, { avatar: req.file.path })
        await author.save()
        res.status(200).send(author)
    }
    catch (error) {
        console.log(error)
        res.status(400).send({ message: 'errore sulla patch avatar' })
    }
};


// test inviare email
/* export const sendMailMiddleware = async (req, res) => {
    await transport.sendMail(
        {
            from: 'noreply@epicoders.com', // mittente
            to: req.body.email, // destinatario
            subject: 'Benvenuto', // oggetto
            text: `Benvenuto ${req.body.fullName}`, // testo visualizzato se non ha supporto html
            html: `<b>Benvenuto ${req.body.fullName}</b>`, // html body
        }
    )
    return res.send({ success: true })
}; */