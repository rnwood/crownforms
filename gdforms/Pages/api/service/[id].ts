import { NextApiRequest, NextApiResponse } from "next"
import {Db, ServiceRecord} from '../../../db';
export default async function handler(req :NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    method,
  } = req;

  switch (method) {
    case 'GET':
      
      const db = await Db.get();
      const service = await db.findOne(ServiceRecord, {where: {url: id}, relations: ["form"]});

      if (!service) {
        res.status(404).json({error: "Not found"});
        break;
      } 

      res.status(200).json(service)
      break
    
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}