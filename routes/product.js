var express = require('express');
var router = express.Router();
var ProductModel = require('./../models/product');
var multer  = require('multer');
// var upload = multer({
//  dest: 'uploads/' })
var Storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/img')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now()+ '-' +file.filename)
  }
})
 

function fileFilterFn(req, file, cb) {

    if (file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/gif" || file.mimetype == "image/jpg") {
        cb(null, true);
    } else {
        req.fileValidationErr = 'hello';
        cb(null, false);
    }
};

var upload = multer({
    storage: Storage,
    fileFilter: fileFilterFn
});



//get all products

router.get('/',function(req, res, next) {
    var condition = {};
    condition.user = req.user._id;

    ProductModel.find(condition)
        .sort({
            _id: -1
        })
        
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

	//getting single product form id

router.get('/:id',function(req, res, next) {
    console.log('user in req', req.user);

    ProductModel.findById(req.params.id, function(err, product) {
        if (err) {
            return next(err);
        } else {
            res.status(200).json(product);
        }
    })
});

//insert product

router.post('/',upload.single('file'),function (req, res, next)
 {
    if (req.fileValidationErr){
        return next({
            message:'Not valid file format'
        });
    }
    console.log('user in req', req.user);
    var newProduct = new ProductModel();
    newProduct.name = req.body.name;
    newProduct.category = req.body.category;
    newProduct.price = req.body.price;
    newProduct.brand = req.body.brand;
    newProduct.quantity = req.body.quantity;
    newProduct.description = req.body.description;
    newProduct.color = req.body.color;
    newProduct.imageName = req.body.filename;
    
    newProduct.user = req.user._id

    newProduct.save(function(err, saved) {
        if (err) {
            return next(err);
        } else {
            res.status(200).json(saved);
        }
    });

});

	//update product from id

router.put('/:id',function(req, res, next) {
  var id =req.params.id
   
    ProductModel.findOne({
        _id:id
    }).exec(function(err,product){
        if(err){
            return next(err);
        }
    else {
        console.log('old product', product);
        product.name = req.params.name;
        product.category = req.params.category;
        product.price = req.body.price;
        product.brand = req.body.brand;
        product.quantity = req.body.quantity;
        product.description = req.body.description;
        product.color = req.body.color;
        product.imageName = req.body.imageName;
        product.user = req.user._id
        product.save(function(err,done){
            if(err){
                return next(err);
            }
            else{
                res.status(200).json(done);
            }
        })
    }
})

});


//delete product from id

router.delete('/:id',function(req, res, next) {

   
      var productId= req.params.id;
        var err = validate(req);
        console.log('here', err);


        if (err) {
            return next(err);
        }
        ProductModel.findByIdAndRemove(req.params.id,function(err, done) {
            if (err) {
                return next(err);
            } else {
                res.status(200).json(done);
            }
        });
});


module.exports = router;