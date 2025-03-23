require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const axios = require('axios');
const port = process.env.port || 7547;

const app = express();
app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

let User;
let obj = {};

app.get('/backend/send/user/:username', async (req, res) => {
    try {
        const { username } = req.params;
        User = username;
        res.json({ "user": User });
    } catch (error) {
        res.status(500).json({ error: "error fetching data" });
    }
});

app.get('/backend/user', async (req, res) => {
    try {
        res.json({ "user": User });
    } catch (error) {
        res.status(500).json({ error: "error fetching data" });
    }
});

app.get('/user/of/git/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const apiUrl = `${process.env.user_of_git}${username}`;
        const reponse = await axios.get(apiUrl);
        res.json(reponse.data);
    } catch (error) {
        res.status(500).json({ error: "error fetching data" });
    }
});

app.get('/api/git/users/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const apiUrl = `${process.env.search_users}${username}`;
        const reponse = await axios.get(apiUrl);
        res.json(reponse.data);
    } catch (error) {
        res.status(500).json({ error: "error fetching data" });
    }
});

app.get('/api/requests_limit', async (req, res) => {
    try {
        const apiUrl = process.env.requests_limit;
        const reponse = await axios.get(apiUrl);
        res.json(reponse.data);
    } catch (error) {
        res.status(500).json({ error: "error fetching data" });
    }
});

app.post('/user/cache', (req, res) => {
    try {
        const { user, obj_ } = req.body;
        obj = { user, obj_ };
        res.status(200).json({ message: "succceful saved", obj_ });
    } catch (error) {
        res.status(500).json({ message: "Internal error" });
    }
});

app.get('/user/cache/take', (req, res) => {
    try {
        res.status(200).json({ obj });
    } catch (error) {
        res.status(500).json({ message: "Internal error" });
    }
});

app.listen(port, () => {
    console.log(`app running on ${port}`)
});