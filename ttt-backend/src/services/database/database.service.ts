// import { Injectable } from '@nestjs/common';
// import Database from 'better-sqlite3';
// import * as path from "path";
// import fs from 'fs';
//
// const dbPath = './database.db'
// const dbInitPath = path.join(__dirname, 'init.sql')

// @Injectable()
// export class DatabaseService {
  // constructor() {
  //   const db = new Database(dbPath, { verbose: console.log });
  //   if (!fs.existsSync(dbPath)) {
  //
  //     const initSql = fs.readFileSync(dbInitPath, { encoding: 'utf-8' });
  //
  //     db.exec(initSql);
  //     db.close();
  //     console.log('Database initialized from init.sql');
  //   } else {
  //     console.log('Database already exists. Skipping initialization.');
  //   }
  // }
// }
