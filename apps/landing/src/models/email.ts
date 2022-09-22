import mongoose from 'mongoose';

const EmailSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please provide an email.'],
    maxlength: [60, 'Email must not be longer than 60 characters'],
  },
});

export default mongoose.models.Email || mongoose.model('Email', EmailSchema);
