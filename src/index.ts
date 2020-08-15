import dotenv from 'dotenv'
// import Bot from 'tomon-sdk';
import Bot from 'tomon-sdk/lib';
import SocksProxyAgent from 'socks-proxy-agent'

const agent = SocksProxyAgent('socks://127.0.0.1') as any;

const botOptions = {
  axiosConfig: {
    httpAgent: agent,
    httpsAgent: agent,
  },
  wsOptions: {
    agent,
  }
}

const bot = new Bot(botOptions);

const { parsed } = dotenv.config()

if (!parsed) {
  throw new Error('dot env not found');
}

const { BOT_USERNAME, BOT_PASSWORD } = parsed

console.log(BOT_USERNAME, BOT_PASSWORD);
// replace your fullname & password
bot.startWithPassword(BOT_USERNAME, 'hyq77766177');

bot.on('MESSAGE_CREATE', async (data) => {
  console.log(data);
  if (data.d.author?.id === bot.id) {
    return;
  }
  const channelId = data.d.channel_id;
  // let reply: string | undefined;
  // let files: string[] | undefined;
  // switch (data.d.content) {
  //   case '/hello': {
  //     reply = `Hello ${data.d.author?.name}`;
  //     break;
  //   }
  //   case '/ping': {
  //     const ping = new Date().getTime() - new Date(data.d.timestamp).getTime();
  //     reply = `<@${data.d.author.id}> ${ping}ms`;
  //     break;
  //   }
  //   case '/photo': {
  //     files = ['./resources/image.png'];
  //     break;
  //   }
  // }
  // if (!reply && !files) {
  //   return;
  // }
  try {
    await bot.api.route(`/channels/${channelId}/messages`).post({ data: { content: `${data.d.author?.name} 是坏菜` } });
  } catch (e) {
    console.log(e);
  }
});
