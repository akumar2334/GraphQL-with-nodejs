const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const bodyParser = require("body-parser");
const cors = require("cors");
const { default: axios } = require("axios");
const startServer = async () => {
	const app = express();
	const server = new ApolloServer({
		typeDefs: `
         type User{
            id:ID!
            username:String!
            name:String!
        }
        type Todo{
            id:ID!
            title:String!
            userId:ID!
            completed:Boolean
            user:User
        }
       

        type Query{
            getTodos:[Todo]
            getAllUser:[User]
            getUser(id:ID!):User
        }
    `,
		resolvers: {
			Todo: {
				user: async (todo) => await fetchUsersByID(todo?.id),
			},
			Query: {
				getTodos: async () => await fetch(),
				getAllUser: async () => await fetchUsers(),
				getUser: async (parent, { id }) => await fetchUsersByID(id),
			},
		},
	});
	app.use(bodyParser.json());
	app.use(cors());
	await server.start();
	app.use("/graphql", expressMiddleware(server));

	app.listen(8000, () => console.log("running at 8000"));
};

startServer();

async function fetch() {
	try {
		const res = await axios.get("https://jsonplaceholder.typicode.com/todos");
		return res.data;
	} catch (e) {
		console.log(e);
	}
}
async function fetchUsers() {
	try {
		const res = await axios.get("https://jsonplaceholder.typicode.com/users");
		return res.data;
	} catch (e) {
		console.log(e);
	}
}
async function fetchUsersByID(id) {
	try {
		const res = await axios.get(
			"https://jsonplaceholder.typicode.com/users/" + id
		);
		return res.data;
	} catch (e) {
		console.log(e);
	}
}
