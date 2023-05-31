"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv = __importStar(require("dotenv"));
const mongoose = require("mongoose");
const userRoute = require("./routes/user");
const bodyParser = require('body-parser');
let users = require('../MOCK_DATA.json');
const port = process.env.PORT || 3000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
dotenv.config();
mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("DB Connected successfuly"))
    .catch((error) => {
    console.log(error);
});
app.use("/api/user", userRoute);
app.get('/', (req, res) => {
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
app.get('/users', (req, res) => {
    res.json(users);
});
// UPDATE
app.put('/users', (req, res) => {
    const { id, first_name, last_name, email, gender, ip_address } = req.body;
    users = users.map((user) => {
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
    users = users.filter((user) => user.id !== id);
    res.json(users);
});
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
//# sourceMappingURL=index.js.map