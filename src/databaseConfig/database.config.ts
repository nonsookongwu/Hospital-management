import { Sequelize } from "sequelize";


//the arguments are The name of your app, username and password. Sequelise allows you to leave the empty
//but postGress and MySQL would not allow you to leave the arguments empty
const db = new Sequelize('app', '', '', {
    storage: './hospitalDB.sqlite',
    dialect: 'sqlite',
    logging: false,
})

export default db;

/**Notes on sequelize
 * ORM: Object relational Model eg SQL, SQLite, PostGres, MySQL
 * ODM: Object Document Model: MongoDB, DynamoDB
 * sequelize is an ORM that works with most relational Databases eg Postgress, mySQL etc
 * sqlite detabases is a file generatd database
 * storage: specifiy file path for the database
 * dialect: the type of database you are working with
 * logging: whether we want to be having the progress logiin on our terminal
 * 
 * on import in the app.ts, if you are exporting below, you do not need to wrap the variable name in a 
 * curly brace
 */