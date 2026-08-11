// 404 handler
function notFound(req, res, next) {
  res.status(404).json({ message: `ไม่พบ endpoint: ${req.originalUrl}` });
}

// Central error handler
function errorHandler(err, req, res, next) {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
    ...(process.env.NODE_ENV === "development" ? { stack: err.stack } : {}),
  });
}

module.exports = { notFound, errorHandler };
