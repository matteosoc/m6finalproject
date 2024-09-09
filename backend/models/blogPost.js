import { Schema, model } from "mongoose";

// commentSchema con embedding
const commentSchema = new Schema(
    {
        content: {
            type: String,
            minLength: 3,
            maxLength: 100,
            trim: true, //toglie spazi vuoti all'inizio e alla fine
        }
    }
);

const blogPostSchema = new Schema({
    category: String,
    title: String,
    cover: String,
    readTime: {
        value: Number,
        unit: String
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'Author'
    }
    , //email dell'autore
    
    /*     {
        type: Schema.Types.ObjectId,
        ref: 'Author'
    } */
    /*      
        versione 2 (però va eliminata la collection!)

        author: {
        type: authorSchema,
        required: true
        } 
    */
    content: String,
    comments: [commentSchema] // array di oggetti di commenti con i valori embeddati (cioè inseriti nello stesso documento)
}, {
    collection: 'blogPosts'
})

// costante da esportare
const BlogPost = model('BlogPost', blogPostSchema)

export default BlogPost;