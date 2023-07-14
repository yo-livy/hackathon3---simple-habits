import dotenv from 'dotenv';
dotenv.config();
import got from 'got';
import crypto from 'crypto';
import OAuth from 'oauth-1.0a';
import * as qs from 'querystring';
import { createInterface } from 'readline';


// Now you can use the 'createInterface' function
// Example usage:
const readline = createInterface({
  input: process.stdin,
  output: process.stdout
});

// The code below sets the consumer key and consumer secret from your environment variables
// To set environment variables on macOS or Linux, run the export commands below from the terminal:
// export CONSUMER_KEY='YOUR-KEY'
// export CONSUMER_SECRET='YOUR-SECRET'

const consumer_key = process.env.CONSUMER_KEY;
const consumer_secret = process.env.CONSUMER_SECRET;

const access_token = '1677055347985448962-NmfELt4FdKAjdlF0lClMVRaK6rghXo';
const access_token_secret = '8cqftil6V81nfNw9DTBbu4JQeaFH3WAHmhCJ1Xoziwkkl';

const tweet = "Hello Ziv!"

// Be sure to add replace the text of the with the text you wish to Tweet.
// You can also add parameters to post polls, quote Tweets, Tweet with reply settings, and Tweet to Super Followers in addition to other features.
const data = {
  "text": tweet
};

const endpointURL = `https://api.twitter.com/2/tweets`;

// this example uses PIN-based OAuth to authorize the user
const requestTokenURL = 'https://api.twitter.com/oauth/request_token?oauth_callback=oob&x_auth_access_type=write';
const authorizeURL = new URL('https://api.twitter.com/oauth/authorize');
const accessTokenURL = 'https://api.twitter.com/oauth/access_token';
const oauth = OAuth({
  consumer: {
    key: consumer_key,
    secret: consumer_secret
  },
  signature_method: 'HMAC-SHA1',
  hash_function: (baseString, key) => crypto.createHmac('sha1', key).update(baseString).digest('base64')
});

// async function input(prompt) {
//   return new Promise(async (resolve, reject) => {
//     readline.question(prompt, (out) => {
//       readline.close();
//       resolve(out);
//     });
//   });
// }

async function requestToken() {
  const authHeader = oauth.toHeader(oauth.authorize({
    url: requestTokenURL,
    method: 'POST'
  }));

  const req = await got.post(requestTokenURL, {
    headers: {
      Authorization: authHeader["Authorization"]
    }
  });
  if (req.body) {
    return qs.parse(req.body);
  } else {
    throw new Error('Cannot get an OAuth request token');
  }
}


async function accessToken({
  oauth_token,
  oauth_token_secret
}, verifier) {
  const authHeader = oauth.toHeader(oauth.authorize({
    url: accessTokenURL,
    method: 'POST'
  }));
  const path = `https://api.twitter.com/oauth/access_token?oauth_verifier=${verifier}&oauth_token=${oauth_token}`
  const req = await got.post(path, {
    headers: {
      Authorization: authHeader["Authorization"]
    }
  });
  if (req.body) {
    return qs.parse(req.body);
  } else {
    throw new Error('Cannot get an OAuth request token');
  }
}


async function getRequest({
  oauth_token,
  oauth_token_secret
}) {

  const token = {
    key: oauth_token,
    secret: oauth_token_secret
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


(async () => {
    try {
      // Get request token
      const oAuthRequestToken = await requestToken();
      // Get the access token
      const oAuthAccessToken = {
        oauth_token: access_token,
        oauth_token_secret: access_token_secret
      };
      // Make the request
      const response = await getRequest(oAuthAccessToken);
      console.dir(response, {
        depth: null
      });
    } catch (e) {
      console.log(e);
      process.exit(-1);
    }
    process.exit();
  })();



  