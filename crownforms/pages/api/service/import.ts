import { FFFormConverter, IFFFormModel } from "crownforms-components/dist/cjs/all"
import { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient, InputJsonValue } from '@prisma/client'
export default async function handler(req :NextApiRequest, res: NextApiResponse) {
  
  switch (req.method) {
    case 'POST':

      try {
        let source = req.body as IFFFormModel;
        let target = FFFormConverter.convertFormOptions(source);

        let db = new PrismaClient();

        const service = await db.service.create({data: {form: {create:{ definition: target as InputJsonValue, title: target.name}}, name: target.name, url: target.name.replace(/ /g, "_")  }})

        res.redirect(201, `/api/service/${encodeURIComponent(service.id)}`);
        
      } catch (e) {
        let message = e instanceof Error ? e.message : String(e);
        res.status(500).json({error: message});
      }

      break
    
    default:
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}