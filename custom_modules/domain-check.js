var domainUrl

if (process.env.LOCAL) {
  domainUrl = 'https://localhost:3000'
} else {
  domainUrl = 'https://feezify-dev.herokuapp.com'
}

module.exports = domainUrl
