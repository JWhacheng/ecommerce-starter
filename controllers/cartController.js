exports.getCart = (req, res) => {
  res.render('cart/index', {
    title: 'My cart'
  })
}