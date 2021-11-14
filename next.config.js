module.exports = {
  reactStrictMode: true,
  eslint: {
    dirs: ['pages/', 'components/', 'lib/', 'graphql/']
  },
  env: {
    COOKIE_KEY_USER_ID: "ap21uid",
    CSRF_SECRET: "secret1234",
    MY_SITE_ID: "123",
    MY_API_KEY: "123",
    API_URL: "http://localhost:3001",
    BASE_URL: "http://localhost:3002",
  },  
}
