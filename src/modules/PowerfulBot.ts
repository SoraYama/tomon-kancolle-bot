import Bot from 'tomon-sdk';
import _ from 'lodash';
import debug from 'debug';
import { WSPayload } from 'tomon-sdk/lib/types';

interface SendMessageOptions {
  channelId: string;
  message: string;
  files?: any[];
}

const log = debug('bot:1');

type MessageGetter = (e: WSPayload<'MESSAGE_CREATE'>) => string;

class PowerfulBot extends Bot {
  private _registeredMessageMap: Record<string, MessageGetter> = {};

  private _bypassChannels: string[] = [];

  public addBypassChannelIds(...channelIds: string[]) {
    this._bypassChannels = _.uniq([...this._bypassChannels, ...channelIds]);
  }

  public setBypassChannelIds(...channelIds: string[]) {
    this._bypassChannels = channelIds;
  }

  public replyMessage(
    key: string,
    getMessage: (e: WSPayload<'MESSAGE_CREATE'>, action: string, ...params: string[]) => string,
    prefix = '/',
  ) {
    const mapKey = `${prefix}${key}`;

    if (this._registeredMessageMap[mapKey]) {
      log('已经注册过该关键字了');
      return;
    }

    this._registeredMessageMap[mapKey] = (e: WSPayload<'MESSAGE_CREATE'>) => {
      const messageContent = e.d.content;
      const [, action, ...params] = messageContent.trim().split(/\s+/g);
      return getMessage(e, action, ...params);
    };

    if (!_.isEmpty(this._registeredMessageMap)) {
      return;
    }

    this.on('MESSAGE_CREATE', (e) => {
      const channelId = e.d.channel_id;
      if (this._bypassChannels.length && !this._bypassChannels.includes(channelId)) {
        return;
      }
      const messageContent = e.d.content;
      const [command] = messageContent.trim().split(/\s+/g);
      const messageGetter = this._registeredMessageMap[command];
      const message = messageGetter(e);

      if (!messageGetter || !message) {
        return;
      }

      this.sendMessageToChannel({
        channelId,
        message,
      });
    });
  }

  public sendMessageToChannel(options: SendMessageOptions) {
    const { channelId, message, files } = options;
    this.api.route(`/channels/${channelId}/messages`).post({
      data: {
        content: message,
      },
      files,
    });
  }
}

export default PowerfulBot;
