module.exports = () => {
  return (req, res, next) => {
    if (req.app.locals.user && req.app.locals.user._id) {
      return next();
    }

    res.render('pages/exception', {
      title: '403',
      errorTitle: '抱歉！你无权访问该页面',
      errorMsg: [
        '尚未登录 - 请先登录用户。',
        '尚未成为管理员 - 请申请成为管理员。',
      ],
    });
  };
};
