import mongoose, { Model } from 'mongoose';

interface IEmail extends Document {
  email: string;
}

const EmailSchema = new mongoose.Schema<IEmail>({
  email: {
    type: String,
    required: [true, 'Please provide an email.'],
    maxlength: [60, 'Email must not be longer than 60 characters'],
  },
});

export default (mongoose.models.Email as Model<IEmail>) ||
  mongoose.model<IEmail>('Email', EmailSchema);
