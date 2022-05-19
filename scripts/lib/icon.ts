export interface Icon {
  baseUrl: string;
  sizes: string[];
}

/**
 * @description Nunjucks context to render icons.
 */
export const defaultIcon: Icon = {
  baseUrl: 'https://www.ftacademy.cn/images/favicons',
  sizes: ['180x180', '152x152', '120x120', '76x76']
};
