import fzdm from './fzdm.js';

const OPTIONS = [{
  by: 'online',
  switchType: 'video',
  site: keywords => '日剧tv',
},
{
  by: 'download',
  switchType: 'video',
  site: keywords => '91日剧',
},
{
  by: 'online',
  switchType: 'comic',
  site: (keywords) => {
    for (const [k, v] of fzdm.entries()) {
      if (keywords === v.title) {
        console.log(v.href);
        return {
          site: '风之动漫',
          url: v.href,
        };
      }
    }
    return '漫画人';
  },
},
{
  by: 'online',
  switchType: 'anime',
  site: keywords => '风车动漫',
},
];


const WEBSITE = {
  '日剧tv': {
    url: 'https://www.rijutv.com/index.php?c=so&module=video&keyword=',
    keywords: true,
    jsFilter: () => '',
    cssFilter: () => {
      const els = ['.mian-sidebar', '.header-wrap', '.mod-search-head', '.widget-weixin', '.widget-qianhuiji',
        '.footer-wrap', '.mod-inner', '.breadcrumb', '#cs_DIV_cscpvrich8990B', '#widget-weixin', '.widget-qianhuiji',
      ];
      return getCss(els);
    },
  },
  '91日剧': {
    url: 'http://www.91riju.com/?s=',
    keywords: true,
    jsFilter: () => '',
    cssFilter: () => {
      const els = ['.header', '.search-header', '.footer', '.widget_recent-comments'];
      return getCss(els);
    },
  },
  '漫画人': {
    url: 'http://www.dm5.com/search?language=1&title=',
    keywords: true,
    jsFilter: () => '',
    cssFilter: () => {
      const els = ['.header', '.footer','.yddiv','.view-comment'];
      return getCss(els);
    },
  },
  '风之动漫': {
    url: '',
    keywords: false,
    jsFilter: () => '',
    cssFilter: () => {
      const els = ['#header', '#sogo', '.newsfeed', '#footer', '#xuanfu_news_id'];
      return getCss(els);
    },
  },
  '风车动漫': {
    url: 'http://www.fengchedm.com/common/search.aspx?key=',
    keywords: true,
    jsFilter: () => '',
    cssFilter: () => {
      const els = ['#HMcoupletDivleft', '#HMcoupletDivright', '.head', '.menu', '#cs_DIV_cscpvrich7960B', '.bg', '.foot'];
      return getCss(els) + 'body{background-color:#fff !important}';
    },
  },
};

let getCss = function (els) {
  const str = '{display:none !important} ';
  els[0] += str;
  const res = els.reduce((res, val, i) => res + val + str);
  return res;
};

export { OPTIONS, WEBSITE };
