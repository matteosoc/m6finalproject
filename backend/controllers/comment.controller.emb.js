import BlogPost from "../models/blogPost.js";

// recupera tutti i commenti
export const readAllComments = async (req, res) => {
    try {
        const blogPost = BlogPost.findById(req.params.id)

        return res.send(blogPost.comments)
    }
    catch {
        return res.status(500).send()
    }
}

//recupera un singolo commento dall'id del commento
export const readOneComment = async (req, res) => {
    try {
        const selectedBlogPost = await BlogPost.findById(req.params.id)
        // console.log(selectedBlogPost)

        const comment = selectedBlogPost.comments.id(req.params.commentId)

        return res.send(comment)
    }
    catch {
        return res.status(500).send()
    }
}

// post per creare un commento
export const createOneComment = async (req, res) => {
    try {
        //trova l'id
        const id = req.params.id
        console.log(id)

        // trova il blog post associato
        const selectedBlogPost = await BlogPost.findById(req.params.id)
        console.log(selectedBlogPost)

        // inserisce il commento nell'array tramite push
        selectedBlogPost.comments.push(req.body)

        // da importare altrimenti non salva la modifica nel db
        await selectedBlogPost.save()

        return res.status(201).send({
            data: selectedBlogPost
        })
    }
    catch {
        return res.status(500).send()
    }
}

// modifica un commento
export const editOneComment = async (req, res) => {
    try {
        // identifica il blog post
        const selectedBlogPost = await BlogPost.findById(req.params.id)
        // console.log(selectedBlogPost)

        const oldComment = await selectedBlogPost.comments.id(req.params.commentId)
        console.log(oldComment)

        oldComment.content = req.body.content

        const updatedComment = await selectedBlogPost.save()

        return res.send({
            data: updatedComment
        })
    }
    catch (error) {
        console.log(error)
        res.status(500).send({ message: 'errore nella modifica' })
    }
}

//elimina un commento
export const deleteOneComment = async (req, res) => {
    try {
        const selectedBlogPost = await BlogPost.findById(req.params.id);

        const commentToDelete = selectedBlogPost.comments.id(req.params.commentId);

        // elimina il commento
        commentToDelete.deleteOne();

        const updatedBlogPost= await selectedBlogPost.save();

        res.send({
            data: updatedBlogPost
        });
    }

    catch (error) {
        console.log(error)
        res.status(400).send({ message: 'errore nella modifica' })
    }
}