var domainUrl

if (process.env.LOCAL) {
  domainUrl= "https://localhost:3000"
} else {
  domainUrl = "https://www.feezify.me"
}

module.exports = domainUrl