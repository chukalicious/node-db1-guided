const express = require("express");
const Post = require("./post-model");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const data = await Post.get();
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", checkId, async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await Post.getById(id);
    res.status(200).json(post);
  } catch (err) {
    next(err);
  }
});

router.post("/", checkPayload, async (req, res, next) => {
  const body = req.body;
  try {
    const data = await Post.create(body);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", checkId, checkPayload, async (req, res, next) => {
  const { id } = req.params;
  const changes = req.body;
  try {
    const data = await Post.update(id, changes);
    // I still don't understand this return. Why is it a count?
    res.json({ count: data });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", checkId, async (req, res, next) => {
  const { id } = req.params;
  try {
    const data = await Post.remove(id);
    res.json({ count: data });
  } catch (err) {
    next(err);
  }
});

router.use((err, req, res, next) => {
  err.statusCode = err.statusCode ? err.statusCode : 500;
  res.status(err.statusCode).json({ message: err.message, stack: err.stack });
});

async function checkId(req, res, next) {
  const { id } = req.params;
  try {
    const post = await Post.getById(id);
    if (post) {
      req.post = post;
      next();
    } else {
      const err = new Error("invalid ID");
      err.statusCode = 404;
      next(err);
    }
  } catch (err) {
    err.statusCode = 500;
    err.message = "error retrieving post";
    next(err);
  }
}

function checkPayload(req, res, next) {
  const body = req.body;
  if (!body.title || !body.contents) {
    const err = new Error("body must include 'title' and 'contents'");
    err.statusCode = 400;
    next(err);
  } else {
    next();
  }
}

module.exports = router;
