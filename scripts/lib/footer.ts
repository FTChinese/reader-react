interface Link {
  href: string;
  name: string;
}

interface FooterColumn {
  title: string;
  items: Link[];
}

export interface Footer {
  matrix: FooterColumn[];
  year: string;
  clientVersion: string;
  serverVersion: string;
}

const footerMatrix: FooterColumn[] = [
  {
    title: '支持',
    items: [
      {
        name: '关于我们',
        href: 'https://www.ftchinese.com/m/corp/aboutus.html',
      },
      {
        name: '职业机会',
        href: 'https://www.ftchinese.com/jobs/?from=ft',
      },
      {
        name: '问题回馈',
        href: 'https://www.ftchinese.com/m/corp/faq.html',
      },
      {
        name: '联系方式',
        href: 'https://www.ftchinese.com/m/corp/contact.html',
      },
    ],
  },
  {
    title: '法律事务',
    items: [
      {
        name: '服务条款',
        href: 'https://www.ftchinese.com/m/corp/service.html',
      },
      {
        name: '版权声明',
        href: 'https://www.ftchinese.com/m/corp/copyright.html',
      },
    ],
  },
  {
    title: '服务',
    items: [
      {
        name: '企业订阅',
        href: 'https://next.ftacademy.cn/corporate/login'
      },
      {
        name: '广告业务',
        href: 'https://www.ftchinese.com/m/corp/sales.html',
      },
      {
        name: '会议活动',
        href: 'https://www.ftchinese.com/m/events/event.html',
      },
      {
        name: '会员信息中心',
        href: 'https://www.ftchinese.com/m/marketing/home.html',
      },
      {
        name: '最新动态',
        href: 'http://www.ftchinese.com/m/marketing/ftc.html',
      },
      {
        name: '合作伙伴',
        href: 'https://www.ftchinese.com/m/corp/partner.html',
      },
    ],
  },
  {
    title: '关注我们',
    items: [
      {
        name: '微信',
        href: 'https://www.ftchinese.com/m/corp/follow.html',
      },
      {
        name: '微博',
        href: 'https://weibo.com/ftchinese',
      },
      {
        name: 'Linkedin',
        href:
          'https://www.linkedin.com/company/4865254?trk=hp-feed-company-name',
      },
      {
        name: 'Facebook',
        href: 'https://www.facebook.com/financialtimeschinese',
      },
      {
        name: 'Twitter',
        href: 'https://twitter.com/FTChinese',
      },
    ],
  },
  {
    title: 'FT产品',
    items: [
      {
        name: 'FT研究院',
        href: 'https://www.ftchinese.com/m/marketing/intelligence.html',
      },
      {
        name: 'FT商学院',
        href: 'https://www.ftchinese.com/channel/mba.html',
      },
      {
        name: 'FT电子书',
        href: 'https://www.ftchinese.com/m/marketing/ebook.html',
      },
      {
        name: '数据新闻',
        href: 'https://www.ftchinese.com/channel/datanews.html',
      },
      {
        name: 'FT英文版',
        href: 'https://www.ft.com/',
      },
    ],
  },
  {
    title: '移动应用',
    items: [
      {
        name: '安卓',
        href: 'https://next.ftchinese.com/android/latest',
      },
    ],
  },
];

/**
 * @description Nunjucks context to render footer section.
 */
export function buildFooter(): Footer {
  return {
    matrix: footerMatrix,
    year: '{{footer.Year}}',
    clientVersion: '{{footer.ClientVersion}}',
    serverVersion: '{{footer.ServerVersion}}',
  }
}
