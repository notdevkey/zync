import mongoose, { Schema } from 'mongoose';

const EmailSchema = new Schema({
  email: { type: String, min: 8 },
});

export const EmailModel = mongoose.model('User', EmailSchema);
