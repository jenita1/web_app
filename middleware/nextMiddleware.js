module.exports = function(req, res, next) {
        if (req.headers.access == 'admin') {
            return next();
        }
            else {
                return next({
                    status: 403,
                    message: 'Forbidden'
                })
                res.end('restricted area');

            }
        }