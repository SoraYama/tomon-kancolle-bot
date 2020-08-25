export const ADMIN_ID = '156645563872436224';

// 迷你砍口垒频道们
export const MINI_KANCOLLE_CHANNELS = ['160707041353355264', '163716381127876608' /* 空空空 */];

export const isDev = process.env.NODE_ENV === 'development';

export const getVoiceAPI = (id: number) => `http://revise.kcwiki.moe/v3/data/${id}.json`;
