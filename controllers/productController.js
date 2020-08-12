exports.getAllProducts = (req, res) => {
  res.render('product/list', {
    title: 'All products',
  });
};
exports.getProductDetail = (req, res) => {
  res.render('product/detail', {
    title: 'Product name',
  });
};
