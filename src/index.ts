global.APP_PATH = __dirname;

import dotenv from 'dotenv';
import { argv } from 'process';
import SocksProxyAgent from 'socks-proxy-agent';

import Bot from './modules/PowerfulBot';
import { MINI_KANCOLLE_CHANNELS } from './configs';
import miniKancolleModule from './modules/mini';

const agent = SocksProxyAgent('socks://127.0.0.1') as any;

const botOptions = argv.includes('--proxy')
  ? {
      axiosConfig: {
        httpAgent: agent,
        httpsAgent: agent,
      },
      wsOptions: {
        agent,
      },
    }
  : void 0;

const bot = new Bot(botOptions);

bot.setBypassChannelIds(...MINI_KANCOLLE_CHANNELS);

const { parsed } = dotenv.config();

if (!parsed) {
  throw new Error('dot env not found');
}

const { BOT_TOKEN } = parsed;

bot.start(BOT_TOKEN);

const loadModules = () => {
  miniKancolleModule(bot);
};

bot.on('READY', () => {
  loadModules();
});
