module.exports = (Joi, ctx) => ({
  // GET /api/v1/users/:id/favourites-offers
  list: {
    query: {
      ...ctx.DEFAULT_LIST_QUERY
    }
  },
});
