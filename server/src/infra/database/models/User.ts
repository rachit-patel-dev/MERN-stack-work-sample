import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

interface UserAttributes extends Document {
  ID: number;
  Email: string;
  Password: string;
  LegalName: string | null;
  Type: string;
  IsActive: number;
}

const userSchema = new Schema<UserAttributes>({
  ID: { type: Number, required: true },
  Email: { type: String, required: true, unique: true },
  Password: { type: String, required: true },
  LegalName: { type: String },
  Type: { type: String, required: true },
  IsActive: { type: Number, default: 1 },
}, { timestamps: true });

// Hash password before saving
userSchema.pre<UserAttributes>('save', async function (next) {
  if (!this.isModified('Password')) return next();

  const saltRounds = 10;
  try {
    const hashedPassword = await bcrypt.hash(this.Password, saltRounds);
    this.Password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

const UserModel = mongoose.model<UserAttributes>('User', userSchema);

export default UserModel;