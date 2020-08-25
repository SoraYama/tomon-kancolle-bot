import { PREFIX, ACTIONS, MAX_HOME_LEVEL } from '../constants';
import User from '../store/user';

const upgrade = (params: string[], getMessage: (content: string) => string, user: User | null) => {
  if (!user) {
    return getMessage(`还未建立角色哦, 请输入 ${PREFIX} ${ACTIONS.start} 来开始`);
  }
  const { userLevelInfo } = user;
  if (!userLevelInfo) {
    return getMessage(`啊哦你的镇守府出问题了, 请联系空山`);
  }
  const userMaruyu = user.getShipById(1000);
  if (!userLevelInfo.upgradeRequirement) {
    return getMessage(`镇守府已到达最高等级啦`);
  }
  if (!userMaruyu || userMaruyu.amount < userLevelInfo.upgradeRequirement) {
    return getMessage(`马路油数量不足哦 (${userMaruyu?.amount || 0}/${userLevelInfo.upgradeRequirement})`);
  }
  if (userMaruyu.amount === userLevelInfo.upgradeRequirement && user.secretary === 1000) {
    return getMessage(`不能拆除作为秘书舰的まるゆ哦~ 请先将秘书舰换成别人`);
  }
  if (user.level >= MAX_HOME_LEVEL) {
    return getMessage(`镇守府已到达最高等级啦`);
  }
  try {
    user.dropShip(1000, userLevelInfo.upgradeRequirement);
    user.upgrade();
  } catch (e) {
    return getMessage(e.message);
  }
  return getMessage(`镇守府升级啦, 当前等级为 ${user.level}级`);
};

export default upgrade;
