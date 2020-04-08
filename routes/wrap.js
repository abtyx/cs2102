// Helper function to help us throw async errors to express's error handling
module.exports = function wrap(fn) {
  return function(req, res, next) {
    fn(req, res, next).catch(e => {
      console.error(e);
      next(e);
    });
  };
};
