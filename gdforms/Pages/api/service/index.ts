import { NextApiRequest, NextApiResponse } from "next"
import {Db, ServiceRecord} from '../../../db';
export default async function handler(req :NextApiRequest, res: NextApiResponse) {
  const {
    method,
  } = req;

  switch (method) {
    case 'GET':
      

      const db = await Db.get();

      const services = await db.find(ServiceRecord);

      res.status(200).json(services)
      break
    
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}