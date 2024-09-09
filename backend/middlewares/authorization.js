import jwt from 'jsonwebtoken';
import Author from '../models/author.js';

export default (req, res, next) => {
    // verificare se c'è l'header Authorization e se è di tipo Bearer
    // Authorization: Bearer asdhklasdre.bkjdskdfhkshksdfjsdbf.ddsfsdfsdfsdfsddf

    if (!req.headers.authorization) return res.status(401).send();

    const parts = req.headers.authorization.split(' ');

    if (parts.length != 2) return res.status(401).send();
    
    if (parts[0] != 'Bearer') return res.status(401).send();

    const jwtToken = parts[1];

    // verificare la firma del token
    jwt.verify(jwtToken, process.env.JWT_SECRET, async (err, payload) => {
        // errore: probabilmente il token è stato manomesso
        if (err) return res.status(401).send();

        // recuperiamo i dati dell'utente dal database escludendo il campo password
        const author = await Author.findById(payload.authorId)// .select('-password'); perché abbiamo aggiunto select al model

        // l'utente potrebbe aver eliminato l'account nel frattempo e quindi non esistere più nel database
        if (!author) return res.status(401).send();

        // aggiungiamo i dati dell'utente loggato all'oggetto req in maniera
        // da essere utilizzabili dai middlawares successivi in caso
        // ne avessero bisogno
        req.loggedAuthor = author;
        console.log(author);

        // chiamiamo il prossimo middlaware
        next();
    });
};