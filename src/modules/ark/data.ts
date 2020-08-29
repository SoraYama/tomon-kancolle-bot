import fs from 'fs-extra';
import path from 'path';
import _ from 'lodash';

import { CharacterTable, Profession } from './types';
import teamTable from '../../assets/ArknightsData/zh-CN/gamedata/excel/handbook_team_table.json';
import handbookInfoTable from '../../assets/ArknightsData/zh-CN/gamedata/excel/handbook_info_table.json';

const characterTable: CharacterTable = fs.readJsonSync(
  path.resolve(global.APP_PATH, 'assets/ArknightsData/zh-CN/gamedata/excel/character_table.json'),
);

export type CharID = keyof typeof handbookInfoTable.handbookDict;

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

export const getTeamNameById = _.memoize((id: string | number) => {
  return teamTable[id as keyof typeof teamTable]?.teamName || '未知';
});

export const getCharHandbookInfoById = (id: CharID) => handbookInfoTable.handbookDict[id];
