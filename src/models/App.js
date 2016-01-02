import { Schema, model } from 'mongoose';
import winston from 'winston';

export const schema = new Schema({

  // The owner of the slack bot:
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'Contestant',
  },

  username: {
    type: 'String',
    default: 'jeopardybot',
  },
  icon_emoji: {
    type: 'String',
    default: ':jbot:',
  },
  // TODO: Figure this out:
  // icon_url: {
  //   type: String
  // },

  platform: {
    type: 'String',
    enum: ['slack'],
    required: true,
    default: 'slack',
  },

  imageMode: {
    type: 'String',
    enum: ['local', 'imgur'/* , 's3' */],
    required: true,
    default: 'imgur',
  },
  apiToken: {
    type: 'String',
  },

  aws: {
    key: {
      type: 'String',
    },
    secret: {
      type: 'String',
    },
  },
});

schema.statics.findOrCreate = async function() {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create({});
  }
  return doc;
};

let appConfig;
schema.statics.get = async function() {
  if (!appConfig) {
    appConfig = await this.findOrCreate();
  }
  return appConfig;
};

// Force the cached reference to get updated:
export function invalidate() {
  appConfig = null;
}

export default model('App', schema);
