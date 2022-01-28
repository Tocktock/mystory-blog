const fs = require('fs')

const robotTXT =
  'User-agent: Googlebot-news\n' + 'Allow: / \n\n' + 'User-agent: *\n' + 'Disallow: / \n'

fs.writeFileSync('public/robot.txt', robotTXT)