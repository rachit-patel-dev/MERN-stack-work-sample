import mongoose, { Schema, Document } from 'mongoose';

interface BureauAttributes extends Document {
  ID: number;
  UsersID: number;
  FederalID?: number | null;
  PrimaryContact: string;
  PrimaryContactPhoneNumber?: string | null;
  PrimaryContactMobile?: string | null;
  Address?: string | null;
  City?: string | null;
  State?: string | null;
  Country?: string | null;
  Zip?: string | null;
  Status?: string | null;
  PayrollSoftware?: string | null;
  EmployerCount: number;
  IsActive?: number;
  createdAt: Date;
  updatedAt: Date;
}

const bureauSchema = new Schema<BureauAttributes>({
  ID: { type: Number, required: true },
  UsersID: { type: Number, required: true },
  FederalID: { type: Number },
  PrimaryContact: { type: String, required: true },
  PrimaryContactPhoneNumber: { type: String },
  PrimaryContactMobile: { type: String },
  Address: { type: String },
  City: { type: String },
  State: { type: String },
  Country: { type: String },
  Zip: { type: String },
  Status: { type: String, default: 'Pending' },
  PayrollSoftware: { type: String },
  EmployerCount: { type: Number, required: true, default: 0 },
  IsActive: { type: Number, default: 1 },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true }
});

const Bureau = mongoose.model<BureauAttributes>('Bureaus', bureauSchema);

export default Bureau;
