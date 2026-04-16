import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI!;

declare global {
  var _mongoClient: MongoClient | undefined; // eslint-disable-line no-var
}

let client: MongoClient;
let db: Db;

export async function getDb(): Promise<Db> {
  if (db) return db;

  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClient) {
      global._mongoClient = new MongoClient(uri);
      await global._mongoClient.connect();
    }
    client = global._mongoClient;
  } else {
    client = new MongoClient(uri);
    await client.connect();
  }

  db = client.db('portfolio');
  return db;
}
