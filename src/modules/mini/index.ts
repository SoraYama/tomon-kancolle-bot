import _ from 'lodash';

import store from './store';
import { ADMIN_ID } from '../../configs';

import { PREFIX, ACTIONS, RESOURCE_NAMES } from './constants';
import build from './handlers/build';
import drop from './handlers/drop';
import trade from './handlers/trade';
import upgrade from './handlers/upgrade';
import setSecretary from './handlers/secretary';
import help from './handlers/help';
import me from './handlers/me';
import order from './handlers/order';
import PowerfulBot from '../PowerfulBot';

function miniKancolleModule(bot: PowerfulBot) {
  bot.replyMessage(PREFIX, (e, action, ...params) => {
    const senderId = e.d.author?.id;
    const atSenderStr = `<@${senderId}> `;
    const getMessage = (str: string) => `${atSenderStr}\n${str}`;
    const user = store.getUserById(senderId);
    switch (action) {
      case 'add-r':
      case 'add-s': {
        try {
          if (senderId === ADMIN_ID) {
            if (action === 'add-r') {
              const [id, ...toAddResource] = params.map((r: string) => +r);
              if (id === 1551) {
                _(store.users).forIn((v) => v.addResource(toAddResource));
                return getMessage(`资源已全部添加`);
              }
              const user = store.getUserById(id.toString());
              if (!user) {
                return getMessage(`没有这个用户: ${id}`);
              }
              user.addResource(toAddResource);
              return getMessage('资源添加成功');
            }
            const [id, toAddShipId] = params.map((r: string) => +r);
            const targetUser = store.getUserById(id.toString());
            if (!targetUser) {
              return getMessage('没有这个用户');
            }
            targetUser.addShip(toAddShipId);
            return getMessage('舰船添加成功');
          } else {
            return getMessage('只有空山才能做到');
          }
        } catch (e) {
          return getMessage(e.message);
        }
      }

      case ACTIONS.build: {
        if (!user) {
          return getMessage(`还未建立角色哦, 请输入 ${PREFIX} ${ACTIONS.start} 来开始`);
        }
        if (params.length < 4) {
          return getMessage(
            '投入资源输入错误, 请按照 "油, 弹, 钢, 铝, 次数" 的顺序输入并用空格分开',
          );
        }
        const resource = params.slice(0, 4);
        if (params[4] === 'nyk') {
          const msg = build(resource, user, true);
          return getMessage(msg);
        }
        const repeatTimes = +params[4] || 1;
        const nyk = params[5] === 'nyk';
        const msgs: string[] = [];
        for (let i = 0; i < repeatTimes; i++) {
          const msg = build(resource, user, nyk);
          msgs.push(msg);
          if (msg.startsWith('资源不足')) {
            break;
          }
        }
        return getMessage(msgs.join('\n'));
      }

      case ACTIONS.start: {
        if (user) {
          return getMessage('角色已存在');
        }
        store.addNewUser(senderId);
        return getMessage('已经建立角色, 开始建造吧~');
      }

      case ACTIONS.drop: {
        if (!user) {
          return getMessage(`还未建立角色哦, 请输入 ${PREFIX} ${ACTIONS.start} 来开始`);
        }
        const [...shipIds] = params;

        if (shipIds[0] === 'all') {
          const exceptIds = _(shipIds)
            .tail()
            .map((id) => +id)
            .concat(user.config.dropExceptIds)
            .push(1000);
          const ids = _(user.ships)
            .filter((s) => !exceptIds.includes(s.id) && s.amount > 1)
            .map((s) => new Array(s.amount - 1).fill('').map(() => s.id))
            .flatten()
            .value();
          user.setDropShipIds(_.tail(shipIds).map((id) => +id));
          if (_.isEmpty(ids)) {
            return getMessage('没有可以拆除的舰娘了哦');
          }
          const msg = drop(ids, user!);
          return getMessage(msg);
        }

        if (_(shipIds).some((id) => !_.isInteger(+id))) {
          return getMessage('输入错误, 需要输入舰娘ID用空格分开哦');
        }

        const msg = drop(
          _.map(shipIds, (id) => +id),
          user!,
        );
        return getMessage(msg);
      }

      case ACTIONS.me: {
        return me(getMessage, user);
      }

      case ACTIONS.sec: {
        return setSecretary(params, getMessage, user);
      }

      case ACTIONS.help: {
        return help(params, getMessage);
      }

      case ACTIONS.upgrade: {
        return upgrade(params, getMessage, user);
      }

      case ACTIONS.trade: {
        return trade(params, getMessage, user);
      }

      case ACTIONS.tradeRate: {
        const [sourceType] = params.map((r: string) => +r);
        if (!_.inRange(sourceType, 0, 5)) {
          return getMessage(`资源类型输入错误: 1, 2, 3, 4 分别对应 油, 弹, 钢, 铝`);
        }
        const rate = store.getTradeRate(sourceType);
        return getMessage(
          `目前${RESOURCE_NAMES[sourceType - 1]}对其他资源的交换比率为[${rate.join(', ')}]`,
        );
      }

      case ACTIONS.order: {
        return order(params, getMessage, user);
      }

      default: {
        const actions = _.map(ACTIONS, (v) => v).join(' | ');
        return getMessage(`欢迎来玩迷你砍口垒模拟大建\n可用的指令为:\n${PREFIX} ${actions}`);
      }
    }
  });
}

export default miniKancolleModule;
