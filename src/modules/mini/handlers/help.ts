import _ from 'lodash';

import { ACTIONS, PREFIX } from '../constants';
import helpText from '../assets/help';

const help = (params: string[], getMessage: (content: string) => string) => {
  const [command] = params;
  if (!command) {
    const actions = _.map(ACTIONS, (v) => v).join(' | ');
    return getMessage(`请加上指令名${actions}, 比如说 "${PREFIX} ${ACTIONS.help} ${ACTIONS.build}"`);
  }
  if (
    _(ACTIONS)
      .map((v) => v)
      .includes(command)
  ) {
    return getMessage(helpText[command as keyof typeof helpText]);
  }
  return getMessage('暂时没有这个指令');
};

export default help;
