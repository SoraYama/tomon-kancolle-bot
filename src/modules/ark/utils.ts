export const handleDesc = (str: string | null) =>
  str?.replace(/<.*?>(.*?)<\/>/g, '**$1**') || '暂无';
