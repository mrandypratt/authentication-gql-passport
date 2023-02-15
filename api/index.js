import express from 'express';
import session from 'express-session';
import { v4 as uuidv4 } from 'uuid';
import passport from 'passport';
import User from './User';
import { ApolloServer } from 'apollo-server-express';
import typeDefs from './typeDefs';
import resolvers from './resolvers';

const PORT = 4000;
const SESSION_SECRECT = 'bad secret';

// Save user's ID to the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Searches for matching users in database
passport.deserializeUser((id, done) => {
  const users = User.getUsers();
  const matchingUser = users.find(user => user.id === id);
  done(null, matchingUser);
});

const app = express();

// Makes express aware of Express Sessions and defines configuration
app.use(session({
  genid: (req) => uuidv4(),
  secret: SESSION_SECRECT,
  resave: false,
  saveUninitialized: false,
  /*
    For Production:
      1. Save Session Secret in environment variable
      2. Set cooke to secure for HTTPS only
      3. Use store option to store out of memory.  In-memory causes the session data to be lost on server restart.
  */
}));

app.use(passport.initialize());  // Makes 
app.use(passport.session());  // Authenticates the session

// Creates Apollo Server with Type Definitions and Resolvers for GraphQL
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({
    getUser: () => req.user,
    logout: () => req.logout(),
  }),
});

server.start().then(() => server.applyMiddleware({app}));

app.listen({ port: PORT }, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
});
