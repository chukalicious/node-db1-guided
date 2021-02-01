const db = require("../../data/db-config");

module.exports = {
  get,
  getById,
  create,
  update,
  remove,
};

async function get() {
  const posts = await db("posts");
  // db.select("*").from("posts");
  return posts;
}

async function getById(id) {
  // the square brakets below is to make sure that if we receive an array, which we will from this type of function, post will get the first item that matches that's not undifined
  const [post] = await db("posts").where({ id });
  return post;
}

// posting and returning the posted object
async function create(data) {
  const [postId] = await db("posts").insert(data);
  const post = await getById(postId);
  return post;
}

async function update(id, changes) {
  const count = await db("posts").where({ id }).update(changes);
  return count;
}

async function remove(id) {
  const count = await db("posts").where({ id }).del();
  return count;
}
