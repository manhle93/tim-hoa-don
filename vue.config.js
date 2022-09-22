
module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/tim-hoa-don/' // Thay tên repository của các bạn vào đây nhé
    : '/'
}
//git init
//git add -A
//git commit -m "deploy"
//git push -f https://github.com/manhle93/tim-hoa-don.git master:gh-pages
