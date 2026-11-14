import { MongoClient, Db } from 'mongodb';

declare global {
  var _mongoDb: Promise<Db> | undefined;
}

// Cache the connection *promise* (not the resolved client) so concurrent first
// requests share one connection instead of each opening their own. Kept on
// globalThis so it also survives dev hot-reloads.
export function getDb(): Promise<Db> {
  if (!globalThis._mongoDb) {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI is not set');
    globalThis._mongoDb = new MongoClient(uri)
      .connect()
      .then(client => client.db('portfolio'))
      .catch(err => {
        globalThis._mongoDb = undefined; // allow a retry on the next request
        throw err;
      });
  }
  return globalThis._mongoDb;
}
