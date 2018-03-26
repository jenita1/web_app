var express = require('express');
var router = express.Router();
var ProductModel = require('./../models/product');

/*
get all products
*/
router.get('/', function(req, res, next) {
	var condition = {};
	condition.user = req.user._id;

	ProductModel.find(condition)
		.sort({
			_id: -1
		})
		.limit(2)
		.skip(1)
		.populate('user')
		.exec(function(err, products) {
			if (err) {
				return next(err);
			} else {
				if (products.length) {
					res.status(200).json(products);

				} else {
					res.status(200).json({
						message: "products not inserted yet"
					});
				}
			}
		});
});
/*
	get single product form id
*/
router.get('/:id', function(req, res, next) {
	console.log('user in req', req.user);

	ProductModel.findById(req.params.id, function(err, product) {
		if (err) {
			return next(err);
		} else {
			res.status(200).json(product);
		}
	})
});
/*
insert product
*/
router.post('/', function(req, res, next) {
	console.log('user in req', req.user);
	var newProduct = new ProductModel();
	newProduct.name = req.body.name;
	newProduct.category = req.body.category;
	newProduct.price = req.body.price;
	newProduct.brand = req.body.brand;
	newProduct.quantity = req.body.quantity;
	newProduct.description = req.body.description;
	newProduct.color = req.body.color;
	newProduct.imageName = req.body.imageName;
	newProduct.tags = req.body.tags.split(',');
	newProduct.user = req.user._id

	newProduct.save(function(err, saved) {
		if (err) {
			return next(err);
		} else {
			res.status(200).json(saved);
		}
	});

	// ProductModel.save();
});
/*
	update product from id
*/
router.put('/:id', function(req, res, next) {

});
/*
delete product from id
*/
router.delete('/:id', function(req, res, next) {

});


module.exports = router;