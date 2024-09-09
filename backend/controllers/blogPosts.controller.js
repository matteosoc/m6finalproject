import BlogPost from '../models/blogPost.js';
import 'dotenv/config';
import transport from '../services/mail.service.js'
import Author from '../models/author.js'
import * as path from 'path';

// legge tutti gli articoli del blog
export const readAll = async (req, res) => {
    const page = req.query.page || 1
    const perPage = req.query.perPage || 12

    const blogPosts = await BlogPost.find({})
        .sort({ data: -1 })
        .skip((page - 1) * perPage)
        .limit(perPage)
        // da aggiungere per associare l'autore al post
        .populate('author')

    // const totalPages = await BlogPost.aggregate([])

    const totalResults = await BlogPost.countDocuments() // sintassi semplificata di mongoose
    const totalPages = Math.ceil(totalResults / perPage)

    res.send({
        dati: blogPosts,
        totalPages,
        totalResults
    })
}

// legge un articolo del blog
export const readOne = async (req, res) => {
    const id = req.params.id

    try {
        const blogPost = await BlogPost
            .findById(id)
            .populate('author')

        res.send(blogPost)
    }

    catch (error) {
        console.log(error)
        res.status(404).send({ message: 'Non trovato' })
    }

}

// inserisce nuovo articolo
export const createOne = async (req, res) => {
    const blogPostData = req.body

    console.log('prima il path')


    // authorData.avatar = authorData.avatar ? authorData.avatar : 'data:image/png;base64,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'

    const newBlogPost = new BlogPost({ ...blogPostData, cover: req.file.path, readTime: JSON.parse(req.body.readTime) })

    console.log('dopo il path')

    try {
        const createdBlogPost = await newBlogPost.save()

        res.status(201).send(createdBlogPost)

        const author = await Author.findById(createdBlogPost.author)

        // invia email alla creazione di un post
        await transport.sendMail(
            {
                from: 'noreply@striveblog.com', // mittente
                to: author.email, // destinatario
                subject: 'Benvenuto su Strive Blog', // oggetto
                text: `Benvenuto ${createdBlogPost.author}`, // testo visualizzato se non ha supporto html
                html: `<b>Benvenuto ${createdBlogPost.author}</b>`, // html body
            }
        )
    }

    catch (error) {
        console.log(error)
        res.status(400).send({ message: 'qualcosa non va' })
    }

}

// modifica un articolo
export const editOne = async (req, res) => {
    const id = req.params.id
    const blogPostData = req.body

    try {
        await BlogPost.findByIdAndUpdate(id, blogPostData)
        const blogPost = await BlogPost.findById(id)
        res.send(blogPost)
    }

    catch (error) {
        console.log(error)
        res.status(400).send({ message: 'errore nella modifica' })
    }
}

//elimina un articolo
export const deleteOne = async (req, res) => {
    const id = req.params.id

    try {
        console.log(BlogPost.findById(id))
        await BlogPost.findByIdAndDelete(id)

        res.send({ message: 'eliminato correttamente' })
    }

    catch (error) {
        console.log(error)
        res.status(400).send({ message: 'errore nella modifica' })
    }
}

// caricare immagine articolo
export const patchCover = async (req, res) => {
    const id = req.params.blogPostId

    try {
        const blogPost = await BlogPost.findByIdAndUpdate(id, { cover: req.file.path })
        // await blogPost.save()

        res.status(200).send(blogPost)
    }
    catch (error) {
        console.log(error)
        res.status(400).send({ message: 'errore sulla patch avatar' })
    }
};
