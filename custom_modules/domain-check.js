var domainUrl

if (process.env.LOCAL) {
  domainUrl = 'https://localhost:3000'
} else {
  domainUrl = 'https://app.feezify.me'
}

module.exports = domainUrl
