import { Comment } from "@/models/comment";
import express from "express";

export const commentRouter = express.Router();

commentRouter.post("/", (req, res, next) => {
  const currentUserId = req.authentication?.currentUserId;
  if (currentUserId === undefined) {
    return next(new Error("Invalid error: currentUserId is undefined."));
  }
  const { postId, content } = req.body;
  const comment = new Comment(currentUserId, postId, content);
  comment.save();
  res.redirect(`/posts/${postId}`);
});
