module.exports = (Joi, ctx) => ({
  // GET/api/v1/categories
  list: {
    query: {
      ...ctx.DEFAULT_LIST_QUERY,
      all: Joi.boolean()
    }
  },
  // POST/api/v1/categories
  create: {
    body: {
      name: ctx.Category.required(),
    }
  },
  // PUT/api/v1/categories/:id
  update: {
    body: {
      name: ctx.Category
    }
  }
});
