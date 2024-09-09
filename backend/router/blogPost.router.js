import express from 'express';
import BlogPost from '../models/blogPost.js';
import * as blogPostsController from '../controllers/blogPosts.controller.js';
import { uploadCloudinaryCover } from '../middlewares/uploadCloudinary.js';
import * as commentController from '../controllers/comment.controller.emb.js'
//import * as commentController from '../controllers/comment.controller.ref.js';


const blogPostRouter = express.Router();

/////////////////////////// BLOG POSTS //////////////////////////////////

// restituisce la lista degli articoli
blogPostRouter.get("/", blogPostsController.readAll);

// restituisce il singolo articolo
blogPostRouter.get("/:id", blogPostsController.readOne);

// inserire un blogPost nel database
blogPostRouter.post("/", uploadCloudinaryCover.single('cover'), blogPostsController.createOne);

//modificare un articolo blog
blogPostRouter.put("/:id", blogPostsController.editOne);

//eliminare un articolo del blog
blogPostRouter.delete("/:id", blogPostsController.deleteOne)

// carica immagine articolo
blogPostRouter.patch('/:blogPostId/cover/', uploadCloudinaryCover.single('cover'), blogPostsController.patchCover )


/////////////////////////// COMMENTS //////////////////////////////////

// restituisce la lista dei commenti di un singolo post
blogPostRouter.get("/:id/comments", commentController.readAllComments);

// restituisce il singolo commento di un post
blogPostRouter.get("/:id/comments/:commentId", commentController.readOneComment);

// aggiunge un commento
blogPostRouter.post("/:id", commentController.createOneComment);

// modificare un commento dell'articolo
blogPostRouter.put("/:id/comments/:commentId", commentController.editOneComment);

// eliminare un commento 
blogPostRouter.delete("/:id/comments/:commentId", commentController.deleteOneComment)


export default blogPostRouter;