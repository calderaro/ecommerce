
export const list = (req, res, next) => 
  req.models.user.find({}).select("-password").exec()
  .then((user) => res.json(user))
  .catch((err) => next(err))

export const create = (req, res, next) =>
  req.models.user.create(req.body)
  .then((user) => res.json(user))
  .catch((err) => next(err))

export const auth = (req, res, next) => 
  req.models.user.auth(req.body)
  .then((jwt) => res.json(jwt))
  .catch((err) => next(err))
