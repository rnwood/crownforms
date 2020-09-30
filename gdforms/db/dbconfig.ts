import { ConnectionOptions } from "typeorm";
import { FormRecord, ServiceRecord } from "./entity";
if (!process.env.GDFORMS_DATABASEURL) {
   throw new Error("Please set GDFORMS_DATABASEURL with the database URL")
}

export default {
   "type": "postgres",
   "url": process.env.GDFORMS_DATABASEURL,
   "synchronize": false,
   "logging": true,
   "migrationsTransactionMode": "all",
   "connectTimeoutMS": 10000,
   "logNotifications": true,
   "entities": [
      FormRecord,
      ServiceRecord
   ],
   "migrations": [
   ],
   "subscribers": [
   ],
   "cli": {
      "entitiesDir": "db/entity",
      "migrationsDir": "db/migration",
      "subscribersDir": "db/subscriber"
   }
} as ConnectionOptions