import { Comment } from "@/models/comment";
import express from "express";

export const commentRouter = express.Router();

commentRouter.post("/:postId",
  async (req, res, next) => {
    const currentUserId = req.authentication?.currentUserId;

    if (currentUserId === undefined) {
      res.redirect("/401");
      return;
    }

    const { postId } = req.params;
    if (postId === undefined || Comment.find(Number(postId)) === undefined) {
      res.redirect("/404");
      return;
    }

    const { content } = req.body;
    const comment = new Comment(currentUserId, Number(postId), content);
    comment.save();

    req.dialogMessage?.setMessage("Comment successfully created");
    res.redirect(`/posts/${postId}`);
  });
