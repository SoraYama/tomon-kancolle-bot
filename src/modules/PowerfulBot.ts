import Bot from 'tomon-sdk';
import _ from 'lodash';
import debug from 'debug';
import { WSPayload } from 'tomon-sdk/lib/types';

interface SendMessageOptions {
  channelId: string;
  message: string;
  files?: string[];
}

const log = debug('index');

type MessageGetter = (e: WSPayload<'MESSAGE_CREATE'>) => string | string[];

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
    getMessage: (
      e: WSPayload<'MESSAGE_CREATE'>,
      action: string,
      ...params: string[]
    ) => string | string[],
  ) {
    log('✅已注册的key', key);

    if (this._registeredMessageMap[key]) {
      log('已经注册过该关键字了');
      return;
    }

    if (_.isEmpty(this._registeredMessageMap)) {
      this.on('MESSAGE_CREATE', async (e) => {
        if (e.d.author.id === this.id) {
          return;
        }

        log('e', e);

        log('_bypassChannels', this._bypassChannels);

        const channelId = e.d.channel_id;

        if (this._bypassChannels.length && !this._bypassChannels.includes(channelId)) {
          return;
        }

        const messageContent = e.d.content;
        const [command] = messageContent.trim().split(/\s+/g);

        log('command', command, key, key === command);

        const messageGetter = this._registeredMessageMap[command];

        if (!messageGetter) {
          return;
        }

        const message = messageGetter(e);

        if (!message) {
          return;
        }

        if (Array.isArray(message)) {
          for (let i = 0; i < message.length; i++) {
            await this.sendMessageToChannel({
              channelId,
              message: message[i],
            });
          }
        } else {
          this.sendMessageToChannel({
            channelId,
            message,
          });
        }
      });
    }

    this._registeredMessageMap[key] = (e: WSPayload<'MESSAGE_CREATE'>) => {
      const messageContent = e.d.content;
      const [, action, ...params] = messageContent.trim().split(/\s+/g);
      log('🚢收到消息', action, ...params);
      return getMessage(e, action, ...params);
    };
  }

  public async sendMessageToChannel(options: SendMessageOptions) {
    const { channelId, message, files } = options;
    await this.api.route(`/channels/${channelId}/messages`).post({
      data: {
        content: message,
      },
      files,
    });
  }
}

export default PowerfulBot;
