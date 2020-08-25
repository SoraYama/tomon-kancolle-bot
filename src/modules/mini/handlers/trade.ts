import _ from 'lodash';

import User from '../store/user';
import { PREFIX, ACTIONS, ResourceType, RESOURCE_NAMES, logger } from '../constants';
import { showShip } from '../utils';
import store from '../store';
import strip from '../../../utils/strip';

const trade = (params: string[], getMessage: (content: string) => string, user: User | null) => {
  if (!user) {
    return getMessage(`还未建立角色哦, 请输入 ${PREFIX} ${ACTIONS.start} 来开始`);
  }
  if (user.secretary !== 1034) {
    return getMessage(`需要${showShip(1034)}作为旗舰哦`);
  }
  if (params.length < 3) {
    return getMessage(
      `参数输入错误, 应该为 "${PREFIX} ${ACTIONS.trade} <要交换的资源类型> <目标资源类型> <要交换的数量>"`,
    );
  }
  const [sourceType, targetType, sourceAmount] = params.map((p: string) => +p);
  if (_.some([sourceType, targetType], (t) => !_.inRange(t, ResourceType.oil - 1, ResourceType.al + 1))) {
    return getMessage(`资源类型输入错误: 1, 2, 3, 4 分别对应 油, 弹, 钢, 铝`);
  }
  if (!_.isInteger(sourceAmount)) {
    return getMessage(`请输入整数作为要交换的资源量`);
  }
  const userSourceAmount = user.resource[sourceType - 1];
  if (sourceAmount > userSourceAmount) {
    return getMessage(`抱歉你没有那么多的${RESOURCE_NAMES[sourceType - 1]}(${userSourceAmount})`);
  }

  const tradeRate = store.getTradeRate(sourceType);
  const { userLevelInfo } = user;
  const targetAmount = Math.round(
    strip(sourceAmount * tradeRate[targetType - 1] * (1 - userLevelInfo.tradeTaxRate), 2),
  );
  const toCalcResource = [0, 0, 0, 0];
  toCalcResource[targetType - 1] = targetAmount;
  toCalcResource[sourceType - 1] = -sourceAmount;
  user.addResource(toCalcResource);
  logger.info(
    `交易结果 - ${user.id} ${sourceType} ${targetType} [${tradeRate.join(', ')}] ${sourceAmount} ${targetAmount}`,
  );
  return getMessage(
    `明老板很开心, 收下了你的${sourceAmount}${RESOURCE_NAMES[sourceType - 1]} 并给你了 ${targetAmount}${
      RESOURCE_NAMES[targetType - 1]
    }${
      userLevelInfo.tradeTaxRate === 0
        ? ''
        : `\n(顺便一提明老板收取了${sourceAmount * userLevelInfo.tradeTaxRate}${
            RESOURCE_NAMES[sourceType - 1]
          } 作为手续费~)`
    }`,
  );
};

export default trade;
