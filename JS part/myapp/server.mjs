import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import got from 'got';
import crypto from 'crypto';
import OAuth from 'oauth-1.0a';
import * as qs from 'querystring';
import cors from 'cors';
dotenv.config();


const app = express();
app.use(cors());
app.use(express.json());

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));


const oauth = OAuth({
  consumer: {
    key: process.env.CONSUMER_KEY,
    secret: process.env.CONSUMER_SECRET
  },
  signature_method: 'HMAC-SHA1',
  hash_function: (baseString, key) => crypto.createHmac('sha1', key).update(baseString).digest('base64')
});

// Here we define the function to make a request to Twitter API
async function postTweet(text) {
  const endpointURL = `https://api.twitter.com/2/tweets`;
  const token = {
    key: process.env.ACCESS_TOKEN,
    secret: process.env.ACCESS_TOKEN_SECRET
  };
  const data = {
    "text": text
  };
  const authHeader = oauth.toHeader(oauth.authorize({
    url: endpointURL,
    method: 'POST'
  }, token));
  const req = await got.post(endpointURL, {
    json: data,
    responseType: 'json',
    headers: {
      Authorization: authHeader["Authorization"],
      'user-agent': "v2CreateTweetJS",
      'content-type': "application/json",
      'accept': "application/json"
    }
  });
  if (req.body) {
    return req.body;
  } else {
    throw new Error('Unsuccessful request');
  }
}

// Here we define the route that the front-end will call
app.post('/approvePost', async (req, res) => {
  try {
    const post = req.body;
    // Add your own code to update the post status in your database
    // If the database update is successful, post the content to Twitter
    await postTweet(post.content);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
