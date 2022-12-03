'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Restaurant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      Restaurant.belongsTo(models.Category, { foreignKey: 'categoryId' }) //  建立多對一關係
      Restaurant.hasMany(models.Comment, { foreignKey: 'restaurantId' }) //  建立一對多關係
      //  建立多對多關係
      Restaurant.belongsToMany(models.User, {
        through: models.Favorite, // 透過Favorite table 做紀錄
        foreignKey: 'restaurantId',
        as: 'FavoritedUsers' // 以restaurantId 去找，找出使用者
      })
    }
  };
  Restaurant.init({
    name: DataTypes.STRING,
    tel: DataTypes.STRING,
    address: DataTypes.STRING,
    openingHours: DataTypes.STRING,
    description: DataTypes.TEXT,
    image: DataTypes.STRING,
    viewCounts: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Restaurant',
    tableName: 'Restaurants',
    underscored: true
  })
  return Restaurant
}
