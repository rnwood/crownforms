import { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from '@prisma/client'

export default async function handler(req :NextApiRequest, res: NextApiResponse) {
  const {
    query: {url },
    method,
  } = req;

  switch (method) {
    case 'GET':
      
      const db = new PrismaClient();
      const service = await db.service.findFirst({where: {url: url as string}, include: {form: true}})

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