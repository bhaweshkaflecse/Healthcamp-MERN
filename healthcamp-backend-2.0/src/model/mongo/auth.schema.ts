import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type authDocument = HydratedDocument<Auth>;

@Schema()
export class Auth {
  @Prop({ required: true, })
  userID: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: ""})
  rToken: string;

  @Prop({ default: Date.now() })
  createdAt: Date;

  @Prop({ default: Date.now() })
  updatedAt: Date;
}

export const authSchema = SchemaFactory.createForClass(Auth);
