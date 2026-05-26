require('dotenv').config();

const MONGODB_URI = process.env.MONGO_CONNECTION_STRING;

export class mongoConfig {
    public URI = MONGODB_URI
}