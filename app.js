require('./db');

const express = require('express');
const session = require('express-session');
const bcrypt = requrie('bcrypt');

const app = express();
app.userSessions = {}

app.set('view engine','hbs');