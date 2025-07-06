export const apiLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log({
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
      ...(res.statusCode >= 400 && { 
        body: req.body,
        params: req.params,
        user: req.user?.uid 
      })
    });
  });

  next();
};

