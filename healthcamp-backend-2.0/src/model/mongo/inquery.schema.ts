import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { callReasonType, callType } from 'src/helper/types/index.type';

export type inqueryDocument = HydratedDocument<Inquery>;

@Schema()
export class Inquery {
    @Prop()
    name: string;

    @Prop()
    contact: number;

    @Prop()
    description: string;

    @Prop()
    callType: callType;

    @Prop()
    reason: callReasonType;

    @Prop({ default: () => new Date() })
    createdAt: Date;
}

export const inquerySchema = SchemaFactory.createForClass(Inquery);