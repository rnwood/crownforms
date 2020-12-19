import { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from '@prisma/client'
export default async function handler(req :NextApiRequest, res: NextApiResponse) {
  const {
    method,
  } = req;

  switch (method) {
    case 'GET':
      

      const db = new PrismaClient();
      const services = await db.service.findMany();

      res.status(200).json(services)
      break
    
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}