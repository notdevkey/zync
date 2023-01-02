import dbConnect from '@/lib/db-connect';
import Email from '@/models/email';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const {
    body: { email },
    method,
  } = req;

  await dbConnect();

  switch (method) {
    case 'POST':
      try {
        if (!email) return res.status(400).send('Email not specified');

        // Create new email entry and save it in MongoDB
        const emailEntry = await Email.create({ email });

        res.status(200).json({ success: true, data: emailEntry });
      } catch {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false, message: 'Method not supported' });
      break;
  }
}
