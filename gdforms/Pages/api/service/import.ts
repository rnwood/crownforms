import { FFFormConverter, IFFFormModel } from "gdforms-components/dist/cjs/all"
import { NextApiRequest, NextApiResponse } from "next"
import {Db, FormRecord, ServiceRecord} from '../../../db';
export default async function handler(req :NextApiRequest, res: NextApiResponse) {
  
  switch (req.method) {
    case 'POST':

      const db = await Db.get();

      try {
        let source = req.body as IFFFormModel;
        let target = FFFormConverter.convertFormOptions(source);

        let service: ServiceRecord;

        await db.transaction(async (em) => {
      
          let form = em.create(FormRecord, {definition: target, name: target.name})
          await em.save(form);
           
          service = em.create(ServiceRecord);
          service.form = form;
          service.name =target.name;
          service.url = target.name.replace(/ /g, "_");
      
          await em.save(service);
        });

        res.redirect(201, `/api/service/${encodeURIComponent(service!.id)}`);
        
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