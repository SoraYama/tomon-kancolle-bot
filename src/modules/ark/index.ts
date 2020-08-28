import PowerfulBot from '../PowerfulBot';
import { selectCharByName, getProfessionTag } from './data';
import { handleDesc } from './utils';

function arkModule(bot: PowerfulBot) {
  bot.replyMessage('/ark', (e, action, ...params) => {
    switch (action) {
      case 'char': {
        const [charName] = params;
        const char = selectCharByName(charName);
        if (!char) {
          return '没有查询到该干员信息';
        }
        return `【干员】${char.name} ${new Array(char.rarity + 1).fill('⭐').join('')}
【职业】${getProfessionTag(char.profession)}
【介绍】${handleDesc(char.description)}
【标签】${(char.tagList ?? []).map((tag) => `\`${tag}\` `).join('')}`;
      }
      default: {
        return '指令错误';
      }
    }
  });
}

export default arkModule;
