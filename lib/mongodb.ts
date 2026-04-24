import { MongoClient } from 'mongodb';

const uri = process.env.DATABASE_URL || 'mongodb://localhost:27017/motoke';

let client: MongoClient;
let db: any;

export async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db('motoke');
  }
  return db;
}

let dbConnection: any = null;

export async function connectToDatabase() {
  if (!dbConnection) {
    const uri = process.env.DATABASE_URL || 'mongodb+srv://wallaceralak_db_user:qm6UcAUGe2MKTMUr@cluster0.tubrxkb.mongodb.net/?appName=Cluster0';
    const { MongoClient } = require('mongodb');
    const client = new MongoClient(uri);
    await client.connect();
    dbConnection = client.db('motoke');
  }
  return dbConnection;
}

export default {
  // Direct database access
  collection: async (name: string) => {
    const db = await connectToDatabase();
    return db.collection(name);
  },
  
  vehicles: {
    findById: async (id: string) => {
      const db = await connectToDatabase();
      return await db.collection('vehicles').findOne({ _id: id });
    },
    findMany: async (filters: any) => {
      const db = await connectToDatabase();
      return await db.collection('vehicles').find(filters).toArray();
    },
    create: async (data: any) => {
      const db = await connectToDatabase();
      const result = await db.collection('vehicles').insertOne(data);
      return { ...data, _id: result.insertedId };
    },
    update: async (id: string, data: any) => {
      const db = await connectToDatabase();
      await db.collection('vehicles').updateOne({ _id: id }, { $set: data });
      return { _id: id, ...data };
    },
    delete: async (id: string) => {
      const db = await connectToDatabase();
      await db.collection('vehicles').deleteOne({ _id: id });
    },
    search: async (query: string) => {
      const db = await connectToDatabase();
      return await db.collection('vehicles').find({
        $or: [
          { make: { $regex: query, $options: 'i' } },
          { model: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { county: { $regex: query, $options: 'i' } }
        ]
      }).toArray();
    }
  },
  dealers: {
    findById: async (id: string) => {
      const db = await connectToDatabase();
      return await db.collection('dealers').findOne({ _id: id });
    },
    findMany: async (filters: any) => {
      const db = await connectToDatabase();
      return await db.collection('dealers').find(filters).toArray();
    },
    create: async (data: any) => {
      const db = await connectToDatabase();
      const result = await db.collection('dealers').insertOne(data);
      return { ...data, _id: result.insertedId };
    },
    update: async (id: string, data: any) => {
      const db = await connectToDatabase();
      await db.collection('dealers').updateOne({ _id: id }, { $set: data });
      return { _id: id, ...data };
    },
    delete: async (id: string) => {
      const db = await connectToDatabase();
      await db.collection('dealers').deleteOne({ _id: id });
    }
  },
  listings: {
    findById: async (id: string) => {
      const db = await connectToDatabase();
      return await db.collection('listings').findOne({ _id: id });
    },
    findMany: async (filters: any) => {
      const db = await connectToDatabase();
      return await db.collection('listings').find(filters).toArray();
    },
    create: async (data: any) => {
      const db = await connectToDatabase();
      const result = await db.collection('listings').insertOne(data);
      return { ...data, _id: result.insertedId };
    },
    update: async (id: string, data: any) => {
      const db = await connectToDatabase();
      await db.collection('listings').updateOne({ _id: id }, { $set: data });
      return { _id: id, ...data };
    },
    delete: async (id: string) => {
      const db = await connectToDatabase();
      await db.collection('listings').deleteOne({ _id: id });
    }
  },
  bids: {
    findById: async (id: string) => {
      const db = await connectToDatabase();
      return await db.collection('bids').findOne({ _id: id });
    },
    findMany: async (filters: any) => {
      const db = await connectToDatabase();
      return await db.collection('bids').find(filters).toArray();
    },
    create: async (data: any) => {
      const db = await connectToDatabase();
      const result = await db.collection('bids').insertOne(data);
      return { ...data, _id: result.insertedId };
    },
    update: async (id: string, data: any) => {
      const db = await connectToDatabase();
      await db.collection('bids').updateOne({ _id: id }, { $set: data });
      return { _id: id, ...data };
    },
    delete: async (id: string) => {
      const db = await connectToDatabase();
      await db.collection('bids').deleteOne({ _id: id });
    }
  },
  messages: {
    findById: async (id: string) => {
      const db = await connectToDatabase();
      return await db.collection('messages').findOne({ _id: id });
    },
    findMany: async (filters: any) => {
      const db = await connectToDatabase();
      return await db.collection('messages').find(filters).toArray();
    },
    create: async (data: any) => {
      const db = await connectToDatabase();
      const result = await db.collection('messages').insertOne(data);
      return { ...data, _id: result.insertedId };
    },
    update: async (id: string, data: any) => {
      const db = await connectToDatabase();
      await db.collection('messages').updateOne({ _id: id }, { $set: data });
      return { _id: id, ...data };
    },
    delete: async (id: string) => {
      const db = await connectToDatabase();
      await db.collection('messages').deleteOne({ _id: id });
    }
  },
  notifications: {
    findById: async (id: string) => {
      const db = await connectToDatabase();
      return await db.collection('notifications').findOne({ _id: id });
    },
    findMany: async (filters: any) => {
      const db = await connectToDatabase();
      return await db.collection('notifications').find(filters).toArray();
    },
    create: async (data: any) => {
      const db = await connectToDatabase();
      const result = await db.collection('notifications').insertOne(data);
      return { ...data, _id: result.insertedId };
    },
    update: async (id: string, data: any) => {
      const db = await connectToDatabase();
      await db.collection('notifications').updateOne({ _id: id }, { $set: data });
      return { _id: id, ...data };
    },
    delete: async (id: string) => {
      const db = await connectToDatabase();
      await db.collection('notifications').deleteOne({ _id: id });
    }
  }
};
