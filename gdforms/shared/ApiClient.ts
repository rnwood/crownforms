import { IncomingMessage } from "http";

export class NotFoundError extends Error {
  
}


export class ApiClient {

  static async get<T>(apiUrl: string, context: HTMLDocument|IncomingMessage) : Promise<T> {
    let absoluteUrl = ApiClient.getAbsoluteUrl(context, apiUrl);
    const response = await fetch(absoluteUrl.toString());

    ApiClient.throwIfResponseError(response);

    return await response.json() as T;
  }

  private static throwIfResponseError(response: Response) {
    if (!response.ok) {
      switch (response.status) {
        case 404:
          throw new NotFoundError();
        default:
         throw new Error(`HTTP request failed with status ${response.status} - ${response.statusText}`);
      }
    }
  }

  static async create<T>(apiUrl: string, body: T, context: HTMLDocument|IncomingMessage) : Promise<string> {
    let absoluteUrl = ApiClient.getAbsoluteUrl(context, apiUrl);

    const response = await fetch(absoluteUrl.toString(), 
    {
      method: "POST", 
      body: JSON.stringify(body),
      headers:{'Content-Type': 'application/json'},
      redirect: "manual"
    });

    ApiClient.throwIfResponseError(response);
    const resourceLocation = response.headers.get("Location")!.split("/");
    return resourceLocation[resourceLocation.length-1];
  }
  
  private static getAbsoluteUrl(context: HTMLDocument | IncomingMessage, apiUrl: string) {
    let baseUrl: string;
    if ("location" in context) {
      baseUrl = context.location.href;
    } else {
      baseUrl = `http://${context.headers.host}/`;
    }

    let absoluteUrl = new URL(apiUrl, baseUrl);
    return absoluteUrl;
  }
}