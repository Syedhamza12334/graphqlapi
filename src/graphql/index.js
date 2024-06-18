import { createSchema } from "graphql-yoga";
import { userdef as User } from "./models/usermodels.js";
import { typeDef as Comments, resolvers as commentResolvers } from "./models/comments.js";
import _ from "lodash";

const queries = `
  type Query {
    hello: String
  }
`;

const userResolvers = {
  Query: {
    users: async (obj, arg, { mongo }) => {
      return mongo.users.find().toArray();
    },
    user: async (obj, { id }, { mongo }) => {
      return mongo.users.findOne({ _id: new mongoose.Types.ObjectId(id) });
    },
  },
  Mutation: {
    createUser: async (_, { user }, { mongo }) => {
      const response = await mongo.users.insertOne(user);
      return {
        id: response.insertedId,
        ...user,
      };
    },
    deleteUser: async (_, { id }, { mongo }) => {
      const result = await mongo.users.deleteOne({ _id: new mongoose.Types.ObjectId(id) });
      return result.deletedCount > 0;
    },
    updateUser: async (_, { id, update }, { mongo }) => {
      await mongo.users.updateOne(
        { _id: new mongoose.Types.ObjectId(id) },
        { $set: update }
      );
      return mongo.users.findOne({ _id: new mongoose.Types.ObjectId(id) });
    }
  },
  User: {
    id: (obj) => obj._id || obj.id,
    name: (obj) => obj.name.trim().toUpperCase(),
    email: (obj) => obj.email,
    comments: ({ email }, args, { mongo }) => {
      return mongo.comments.find({ email }).limit(20).toArray();
    }
  }
};

const resolvers = {
  Query: {
    hello: () => 'hello from yoga!',
  },
};

export const schema = createSchema({
  typeDefs: [queries, User, Comments],
  resolvers: _.merge(resolvers, userResolvers, commentResolvers),
});
