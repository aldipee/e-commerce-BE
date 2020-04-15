const CategoryModel = require('../models/Categories')
function message (value, message) {
  const data = {
    true: value,
    msg: message
  }
  return data
}

module.exports = {
  createCategory: async function (req, res) {
    if (req.user.roleId === 1) {
      const picture = (req.file && req.file.filename) || null
      const { name } = req.body
      if (name && picture) {
        const result = await CategoryModel.createCategory(name, picture)
        if (result) {
          res.send(message(true, 'Category created'))
        } else {
          res.send(message(false, 'Cant create category'))
        }
        res.send(message(true, req.user))
      } else {
        res.send(message(false, 'Please fill the form input'))
      }
    } else {
      res.send(message(false, 'U cant access this feature'))
    }
  }
}
