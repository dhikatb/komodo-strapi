module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '630315e385b30eefce5751f5f5f79d08'),
  },
});
