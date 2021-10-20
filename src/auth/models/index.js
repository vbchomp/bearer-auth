'use strict';

require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');
const userModel = require('./userModel.js');

const DATABASE_URL = process.env.NODE_ENV === 'test' 
? 'sqlite:memory' : process.env.DATABASE_URL;

const sequelizeOptions = process.env.NODE_ENV === 'production' 
? {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    }
  }
} : {};

// turn schema into sequelize model
// instantiate sequelize
const sequelize = new Sequelize(DATABASE_URL, sequelizeOptions);
  
// export
module.exports = {
  db: sequelize,
  users: userModel(sequelize, DataTypes),
          
};