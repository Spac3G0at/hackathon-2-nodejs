var fs = require('fs');
const { google } = require('googleapis');
var googleAuth = require('google-auth-library');
const app = require('express')();
const bodyParser = require('body-parser');
const mailer = require('./mailer');

app.use(bodyParser.json());

var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
	process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'calendar-nodejs-quickstart.json';

const googleSecrets = JSON.parse(fs.readFileSync('client_secret.json')).installed;
var oauth2Client = new googleAuth.OAuth2Client(
	googleSecrets.client_id,
	googleSecrets.client_secret,
	googleSecrets.redirect_uris[0]
);

const token = fs.readFileSync(TOKEN_PATH);
oauth2Client.setCredentials(JSON.parse(token));

var calendar = google.calendar('v3');

// Get all events
app.get('/api/events', (req, res) => {
	calendar.events.list({
		auth: oauth2Client,
		calendarId: "hackathon3wildtours@gmail.com",
		// timeMin: "2018-02-11T00:00:00.000Z",
		// timeMax: "2019-01-11T23:59:59.000Z"
	}, function (err, response) {
		if (err) {
			console.log('The API returned an error: ' + err);
			res.sendStatus(500);
			return;
		}
		var events = response.data.items;
		res.json(events);
	});
});

// Create a new event
app.post('/api/events', (req, res) => {
	calendar.events.insert({
		auth: oauth2Client,
		calendarId: 'primary',
		resource: req.body,
	}, function (err, event) {
		if (err) {
			console.log('There was an error contacting the Calendar service: ' + err);
			res.sendStatus(500);
			return;
		}
		console.log('Event created');
		res.sendStatus(200);
	});
});

// Update an event
app.put('/api/events/:id', (req, res) => {
	calendar.events.update({
		auth: oauth2Client,
		calendarId: 'primary',
		resource: req.body,
		eventId: req.params.id
	}, (err, event) => {
		if (err) {
			console.log('There was an error contacting the Calendar service: ' + err);
			res.sendStatus(500);
			return;
		}
		console.log('Event updated');
		const message = '<p>Votre demande rendez vous a bien été prise en compte</p>';
		// Envoie un mail
		mailer(req.body, message);
		res.sendStatus(200);
	});
});

// Delete an event
app.delete('/api/events/:id', (req, res) => {
	calendar.events.delete({
		auth: oauth2Client,
		calendarId: 'primary',
		eventId: req.params.id
	}, (err, event) => {
		if (err) {
			console.log('There was an error contacting the Calendar service: ' + err);
			res.sendStatus(500);
			return;
		}
		console.log('Event deleted');
		res.sendStatus(200);
	});
});

// Confirm an event
app.put('/api/events/confirm/:id', (req, res) => {
	calendar.events.update({
		auth: oauth2Client,
		calendarId: 'primary',
		resource: req.body,
		eventId: req.params.id
	}, (err, event) => {
		if (err) {
			console.log('There was an error contacting the Calendar service: ' + err);
			res.sendStatus(500);
			return;
		}
		console.log('Event confirmed');
		const message = '<p>Votre rendez vous a bien été confirmé</p>';
		// Envoie un mail
		mailer(req.body, message);
		res.sendStatus(200);
	});
});


app.listen(3000, () => console.log('Running on port 3000'));