import { PREFIX, ACTIONS } from '../constants';
import User from '../store/user';
import { showShip } from '../utils';

const setSecretary = (params: string[], getMessage: (content: string) => string, user: User | null) => {
  if (!user) {
    return getMessage(`还未建立角色哦, 请输入 ${PREFIX} ${ACTIONS.start} 来开始`);
  }
  const [inputSeceretary] = params;
  if (!inputSeceretary) {
    if (!user.secretary) {
      return getMessage(`你现在还没有设置秘书舰`);
    }
    return getMessage(`你现在的秘书舰为: ${showShip(user.secretary)}`);
  }
  if (inputSeceretary === 'null') {
    user.setSecretary(null);
    return getMessage(`秘书舰已置空`);
  }
  try {
    user.setSecretary(+inputSeceretary);
    return getMessage(`设置成功, 你现在的秘书舰为${showShip(+inputSeceretary)}`);
  } catch (e) {
    return getMessage(e.message);
  }
};

export default setSecretary;
