import { Comment } from "@/models/comment";
import express from "express";

export const commentRouter = express.Router();

commentRouter.post("/:postId",
  async (req, res, next) => {
  const currentUserId = req.authentication?.currentUserId;
  if (currentUserId === undefined) {
    return next(new Error("Invalid error: currentUserId is undefined."));
  }
  const { postId } = req.params;
  const { content } = req.body;
  const comment = new Comment(currentUserId, Number(postId), content);
  comment.save();

    req.dialogMessage?.setMessage("Comment successfully created");
  res.redirect(`/posts/${postId}`);
});
