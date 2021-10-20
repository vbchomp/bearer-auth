'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// we need this to "sign" we create with the DataType.Virtual attribute
// then verify with verify method
const SECRET = 'secretSauce';

const userModel = (sequelize, DataTypes) => {
    const users = sequelize.define('User', {
      username: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        unique: true },
      password: { 
        type: DataTypes.STRING, 
        allowNull: false },
      token: {
        type: DataTypes.VIRTUAL,
        get() {
          return jwt.sign({ username: this.username }, SECRET);
        },
        set(tokenObj) {
          let token = jwt.sign(tokenObj, SECRET);
          return token;
        }
      }
    });
  
    users.beforeCreate(async (user) => {
      let hashedPassword = await bcrypt.hash(user.password, 10);
      user.password = hashedPassword;
    });
  
    users.authenticateToken = async function (token) {
      try {
        const parsedToken = jwt.verify(token, SECRET);
        const user = this.findOne({ username: parsedToken.username })
        if (user) { return user; }
        throw new Error("User Not Found");
      } catch (e) {
        throw new Error(e.message)
      }
    };
  
    users.authenticateBasic = async function (username, password) {
        console.log('User model', username, password);
      const user = await this.findOne({ where: { username } });
      const valid = await bcrypt.compare(password, user.password);
      if (valid) { return user; }
      throw new Error('Invalid User');
    }
  
    return users;
  }



// const userModel = (sequelize, DataTypes) => {
//     const users = sequelize.define('User', {
//         username: {
//             type: DataTypes.STRING,
//             allowNull: false,
//             unique: true,
//         },
//         password: {
//             type: DataTypes.STRING,
//             allowNull: false,
//         },
//         token: {
//             type: DataTypes.VIRTUAL,
//             get() {
//                 return jwt.sign({ username: this.username , SECRET });
//             }
//         },
//         set(tokenObj) {
//             let token = jwt.sign(tokenObj, SECRET);
//             return token;
//         }
//     });
    
//     users.beforeCreate(async (user) => {
//         let hashedPassword = await bcrypt.hash(user.password, 5);
//         user.password = hashedPassword;
//     });

//     users.authenticateBasic = async function (username, password) {
//         const user = await this.findOne({ where: { username } });
//         const valid = await bcrypt.compare(password, user.password);
//         if (valid) { return user; }
//         throw new Error(e.message)
//     }

//     users.authenticateToken = async function (token) {
//         try {
//             // verify token
//             const parsedToken = jwt.verify(token, SECRET);
//             // create user
//             const user = this.findOne({ username: parsedToken.username });
//             // T -> return user
//             if (user) { return user; }
//             // F -> error msg
//             throw new Error('User not found');
        
//         } catch(e) {
//             throw new Error(e.message)
//         }
//     }
//     return users;
// };

module.exports = userModel;