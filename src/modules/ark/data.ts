import fs from 'fs-extra';
import path from 'path';
import _ from 'lodash';

import { CharacterTable, Profession } from './types';

const characterTable: CharacterTable = fs.readJsonSync(
  path.resolve(
    global.APP_PATH,
    '../assets/ArknightsData/zh-CN/gamedata/excel/character_table.json',
  ),
);

export const getProfessionTag = (profession: Profession) => {
  return {
    [Profession.Caster]: '术士',
    [Profession.Medic]: '医疗',
    [Profession.Pioneer]: '先锋',
    [Profession.Sniper]: '狙击',
    [Profession.Special]: '特种',
    [Profession.Support]: '辅助',
    [Profession.Tank]: '重装',
    [Profession.Token]: '召唤物',
    [Profession.Warrior]: '近战',
    [Profession.Trap]: '陷阱',
  }[profession];
};

export const charList = _.map(characterTable, (v, k) => ({
  ...v,
  key: k,
}));

export const selectCharByName = _.memoize((name: string) => {
  return _.find(charList, (item) => item.name === name);
});
