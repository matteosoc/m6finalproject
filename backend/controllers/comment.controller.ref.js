import Comment from "../models/comment.ref.js";


// post
export const createOne = async (req, res) => {
    const blogPostId = req.params.blogPostId;
    const commentInfo = req.body;

    const newComment = new Comment ({
        ...commentInfo,
        blogPost: blogPostId
    })

    const createdComment = await newComment.save()

    return res.send({
        data: createdComment
    })
}