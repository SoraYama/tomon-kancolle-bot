import fs from 'fs-extra';
import path from 'path';
import _ from 'lodash';

const run = async () => {
  const charTable = await fs.readJSON(
    path.resolve(__dirname, '../assets/ArknightsData/zh-CN/gamedata/excel/character_table.json'),
  );
  const list = _.map(charTable, (v, k) => {
    return {
      ...v,
      key: k,
    };
  });
  await fs.outputJSON(path.resolve(__dirname, './charList.json'), list, { spaces: 2 });
};

run();
