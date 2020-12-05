import { PublicPage } from "./PublicPage";

export class NotFoundError extends Error {

}

export abstract class AdminPage<TProps> extends PublicPage<TProps> {
  
  
}