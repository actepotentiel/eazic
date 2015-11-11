'use strict';

module.exports = {
  secure: {
    ssl: true,
    privateKey: './config/sslcerts/key.pem',
    certificate: './config/sslcerts/cert.pem'
  },
  port: process.env.PORT || 3000,
  db: {
    uri: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/mean',
    options: {
      user: '',
      pass: ''
    },
    // Enable mongoose debug mode
    debug: process.env.MONGODB_DEBUG || false
  },
  log: {
    // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
    format: 'combined',
    // Stream defaults to process.stdout
    // Uncomment to enable logging to a log on the file system
    options: {
      stream: 'access.log'
    }
  },
  facebook: {
    clientID: process.env.FACEBOOK_ID || '887089854717600',
    clientSecret: process.env.FACEBOOK_SECRET || '0704868e586eb7101071ba882a99520e',
    callbackURL: '/api/auth/facebook/callback'
  },
  twitter: {
    clientID: process.env.TWITTER_KEY || '3GdhYHWifn7DI2dym636Kp9O5',
    clientSecret: process.env.TWITTER_SECRET || 'hptITV1EiSHcHutnew2K1GJLQx1iHDkYwY9vtm09Eb1CdAKQ38',
    callbackURL: '/api/auth/twitter/callback'
  },
  google: {
    clientID: process.env.GOOGLE_ID || '449461207196-baebvukrecjv26v5bjiiq01g2qm718nm.apps.googleusercontent.com',
    clientSecret: process.env.GOOGLE_SECRET || '0qvB66l4tyyAsqKyFFfSjbor',
    callbackURL: '/api/auth/google/callback'
  },
  linkedin: {
    clientID: process.env.LINKEDIN_ID || '771iljxjoiaar0',
    clientSecret: process.env.LINKEDIN_SECRET || 'mPJ7VGla715iqAza',
    callbackURL: '/api/auth/linkedin/callback'
  },
  github: {
    clientID: process.env.GITHUB_ID || 'af91a0d1923f67e129de',
    clientSecret: process.env.GITHUB_SECRET || '06c28eaafda9683241ed886b0d8cf57ff28737ba',
    callbackURL: '/api/auth/github/callback'
  },
  paypal: {
    clientID: process.env.PAYPAL_ID || 'CLIENT_ID',
    clientSecret: process.env.PAYPAL_SECRET || 'CLIENT_SECRET',
    callbackURL: '/api/auth/paypal/callback',
    sandbox: false
  },
  dailymotion: {
      clientID: '9131c9633e005c22345e',
      clientSecret: '2f7e0ebbf01e3dc96609918e26a8a90426540de7',
      callbackURL: '/api/auth/dailymotion/callback'
  },
  mailer: {
    from: process.env.MAILER_FROM || 'MAILER_FROM',
    options: {
      service: process.env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
      auth: {
        user: process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
        pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD'
      }
    }
  },
  seedDB: process.env.MONGO_SEED || false
};
