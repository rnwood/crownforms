import { ConnectionOptions } from "typeorm";
import dbconfig from "./db/dbconfig";
import { InitialCreate1605452440327 } from "./db/migration/1605452440327-InitialCreate";
import { AddService1605525995105 } from "./db/migration/1605525995105-AddService";


export default {
  ...dbconfig,
   "migrations": [
      InitialCreate1605452440327,
      AddService1605525995105
   ]
} as ConnectionOptions