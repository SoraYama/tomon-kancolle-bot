import PowerfulBot from '../PowerfulBot';
import {
  selectCharByName,
  getProfessionTag,
  getTeamNameById,
  getCharHandbookInfoById,
  CharID,
} from './data';
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
        const charHandbookInfo = getCharHandbookInfoById(char.key as CharID);
        const initialIndex = char.phases[0]?.attributesKeyFrames[0]?.data;

        return [
          `=========== 基础资料 ===========
【干员】${char.name}（${char.appellation}）${new Array(char.rarity + 1).fill('⭐').join('')}
【代号】${char.displayNumber}
【职业】${getProfessionTag(char.profession)}
【标签】${(char.tagList ?? []).map((tag) => `\`${tag}\` `).join('')}
【特性】${handleDesc(char.description)}
【阵营】${getTeamNameById(char.team)}
【简介】${char.itemUsage}
【描述】${char.itemDesc}
【画师】${charHandbookInfo.drawName}
【声优】${charHandbookInfo.infoName}
【获取途径】${char.itemObtainApproach}`,
          `=========== 初始数据 ===========
【生命值】${initialIndex.maxHp}
【攻击力】${initialIndex.atk}
【物防】${initialIndex.def}
【魔抗】${initialIndex.magicResistance}
【费用】${initialIndex.cost}
【阻挡数】${initialIndex.blockCnt}
【攻速】${initialIndex.attackSpeed}
【再部署时间】${initialIndex.respawnTime}
`,
          ...charHandbookInfo.storyTextAudio.map(
            (item) => `=========== ${item.storyTitle} ===========
${item.stories.map((story) => story.storyText).join('\n')}
`,
          ),
        ];
      }
      default: {
        return '指令错误';
      }
    }
  });
}

export default arkModule;
