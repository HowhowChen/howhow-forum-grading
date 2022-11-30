const { Category } = require('../models')

const categoryController = {
  getCategories: async (req, res, next) => {
    try {
      const [categories, category] = await Promise.all([
        Category.findAll({ raw: true }),
        req.params.id ? Category.findByPk(req.params.id, { raw: true }) : null
      ])
      res.render('admin/categories', { categories, category })
    } catch (err) {
      next(err)
    }
  },
  postCategory: async (req, res, next) => {
    try {
      const { name } = req.body
      if (!name) throw new Error('Category name is required!')

      await Category.create({
        name
      })
      res.redirect('/admin/categories')
    } catch (err) {
      next(err)
    }
  },
  putCategory: async (req, res, next) => {
    try {
      const { name } = req.body
      const { id } = req.params
      const category = await Category.findByPk(id)
      if (!category) throw new Error("Category doesn't exist!")
      await category.update({ name })
      res.redirect('/admin/categories')
    } catch (err) {
      next(err)
    }
  }
}

module.exports = categoryController
