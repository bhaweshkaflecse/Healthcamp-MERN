import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type bannerDocument = HydratedDocument<Banner>;

@Schema()
export class Banner {
    @Prop()
    img: string;

    @Prop({ default: Date.now() })
    createdAt: Date;

    @Prop({ default: Date.now() })
    updatedAt: Date;
}

export const bannerSchema = SchemaFactory.createForClass(Banner);
