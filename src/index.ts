import express from 'express';
import * as dotenv from 'dotenv';
const mongoose = require("mongoose")
const userRoute = require("./routes/user")

const bodyParser = require('body-parser');
let users = require('../MOCK_DATA.json');

const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


dotenv.config();

mongoose
	.connect(process.env.MONGO_URL)
	.then(() => console.log("DB Connected successfuly"))
	.catch((error: any) => {
		console.log(error);
	});

app.use("/api/user", userRoute);



app.get('/', (req: any, res: { send: (arg0: string) => void; }) => {
	res.send('Hello from my API!');
});


  // CREATE
app.post('/users', (req, res) => {
	const newUser = {
		id: req.body.id,
		first_name: req.body.first_name,
    	last_name: req.body.last_name,
    	email: req.body.email,
    	gender: req.body.gender,
    	ip_address: req.body.ip_address,
	};
	users.push(newUser);
	res.json(newUser);
});

// READ

app.get('/users', (req: any, res: { json: (arg0: any) => void; }) => {
	res.json(users);
});

// UPDATE
app.put('/users', (req, res) => {
	const { id, first_name, last_name, email, gender, ip_address  } = req.body;
	users = users.map((user: { id: any; first_name: string; last_name: string; email: string; gender: string; ip_address: any; }) => {
		if (user.id === id) {
			user.first_name = first_name;
			user.last_name = last_name;
			user.email = email;
			user.gender = gender;
			user.ip_address = ip_address;
		}
		return user;
	});
	res.json(users);
});

// DELETE
app.delete('/users', (req, res) => {
	const { id } = req.body;
	users = users.filter((user: { id: any; }) => user.id !== id);
	res.json(users);
});


app.listen(port, () => {
	console.log(`App listening on port ${port}`);
});





