import { EmailModel } from '@/models/email';
import mongoose from 'mongoose';
import { NextApiRequest, NextApiResponse } from 'next';

mongoose.connect(
  'mongodb+srv://devkey:Sr11VP7K@emails.jho2epp.mongodb.net/?retryWrites=true&w=majority',
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { email } = req.body;

  if (!email) return res.status(400).send('Email not specified');

  EmailModel.create({ email }, (email) => {
    console.log(`Added email ${email}!`);
    mongoose.disconnect();
  });

  return res.send(200);
}
