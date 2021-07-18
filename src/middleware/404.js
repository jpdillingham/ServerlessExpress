module.exports = (req, res, next) => {
  return res.status(404).json({
    error: `Not Found`,
  });
}