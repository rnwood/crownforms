import {getConnectionManager, createConnection, EntityManager} from 'typeorm';
import connectionOptions from '../ormconfig'

export class Db {

  static async get() :Promise<EntityManager> {

    if (process.env.NODE_ENV !== "production") {
      //Use new connection every request to avoid issues with HMR module identity.
      if (getConnectionManager().has("default")) {
        await getConnectionManager().get().close();
      }

      return (await createConnection(connectionOptions)).manager;
    } else {
      if (!getConnectionManager().has("default")) {
        return await (await createConnection(connectionOptions)).manager;
      }

      return getConnectionManager().get().manager;
    }
  }

}