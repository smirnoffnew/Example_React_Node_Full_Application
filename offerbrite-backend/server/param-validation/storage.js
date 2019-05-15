module.exports = (Joi, ctx) => ({
  // DELETE/api/v1/storage/image
  delete: {
    body: {
      url: Joi.url()
        .isUrlOfFileAtStore()
        .required()
    }
  },
  // GET /api/v1/storage/image
  list: {
    query: { ...ctx.DEFAULT_LIST_QUERY }
  },
});
