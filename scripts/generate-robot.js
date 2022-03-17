const fs = require('fs')

const robotTXT =
  'User-agent: Googlebot-news\n' +
  'Allow: / \n\n' +
  'User-agent: *\n' +
  'Disallow: / \n\n ' +
  'Sitemap: https://mystory-blog.vercel.app/sitemap.xml \n'

fs.writeFileSync('public/robots.txt', robotTXT)
