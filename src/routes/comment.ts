import { Comment } from "@/models/comment";
import { Post } from "@/models/post";
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
    if (postId === undefined || Post.find(Number(postId)) === undefined) {
      res.redirect("/404");
      return;
    }

    const { content } = req.body;
    const comment = new Comment(currentUserId, Number(postId), content);
    comment.save();

    req.dialogMessage?.setMessage("Comment successfully created");
    res.redirect(`/posts/${postId}`);
  });

commentRouter.get("/:commentId/edit", async (req, res, next) => {
  const currentUserId = req.authentication?.currentUserId;

  if (currentUserId === undefined) {
    res.redirect("/401");
    return;
  }

  const { commentId } = req.params;
  if (commentId === undefined || Comment.find(Number(commentId)) === undefined) {
    res.redirect("/404");
    return;
  }

  const comment = await Comment.find(Number(commentId));
  if (comment === undefined || comment.userId !== currentUserId) {
    res.redirect("/404");
    return;
  }

  if (comment.userId !== currentUserId) {
    res.redirect("/403");
    return;
  }

  res.render("comments/edit", {
    comment,
    errors: [],
  });
});

commentRouter.patch("/:commentId", async (req, res, next) => {
  const currentUserId = req.authentication?.currentUserId;

  if (currentUserId === undefined) {
    res.redirect("/401");
    return;
  }

  const { commentId } = req.params;
  if (commentId === undefined || Comment.find(Number(commentId)) === undefined) {
    res.redirect("/404");
    return;
  }

  const comment = await Comment.find(Number(commentId));
  if (comment === undefined || comment.userId !== currentUserId) {
    res.redirect("/404");
    return;
  }

  if (comment.userId !== currentUserId) {
    res.redirect("/403");
    return;
  }

  const { content } = req.body;
  comment.content = content;
  comment.update();

  req.dialogMessage?.setMessage("Comment successfully updated");
  res.redirect(`/posts/${comment.postId}`);
});
