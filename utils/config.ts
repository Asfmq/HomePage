import type { SiteConfig } from '~/types/config'

/**
 * 内置默认站点配置。
 *
 * 用途：仅当配置存储（七牛云 / 本地文件）读取失败时的兜底，
 * 保证首页仍可渲染而不是白屏。
 *
 * 注意：内容由 site-config.json 同步而来，请勿手工维护。
 * 真正的数据源始终是后台保存的配置（生产环境为七牛云）。
 */
export const defaultConfig: SiteConfig = {
  title: "fmq的主页",
  keywords: "",
  description: "",
  author: "Asfmq",
  favicon: "/img/ico/fmq.ico",
  backgroundImage: "https://ts1.cn.mm.bing.net/th/id/R-C.5245729f06d893bb71f1ef22d1701e99?rik=UUiU5%2f9nqV5QWA&riu=http%3a%2f%2f5b0988e595225.cdn.sohucs.com%2fimages%2f20181109%2fa6fcad52457646ef8b3d3c3b3b12e8ab.jpeg&ehk=UIlATT2VKn8IqNzCFFGKXvl11vSYf%2flqCueyxilmefg%3d&risl=&pid=ImgRaw&r=0",
  links: {
    navItems: [
      {
        name: "主页",
        url: "https://home.asfmq.cn/",
        id: "home-link"
      },
      {
        name: "博客",
        url: "https://blog.asfmq.cn/",
        id: "blog-link"
      },
      {
        name: "Github",
        url: "https://github.com/Asfmq",
        id: "github-link"
      }
    ],
    searchEngines: [
      {
        name: "Bing",
        url: "https://cn.bing.com/search?q=",
        placeholder: "微软必应搜索",
        icon: "#icon-bing",
        color: "#696a6d"
      },
      {
        name: "百度",
        url: "https://www.baidu.com/s?word=",
        placeholder: "百度一下，你就知道",
        icon: "#icon-icon_baidulogo",
        color: "#0c498c"
      },
      {
        name: "搜狗",
        url: "https://www.sogou.com/web?query=",
        placeholder: "上网从搜狗开始",
        icon: "#icon-sougou",
        color: "#696a6d"
      },
      {
        name: "知乎",
        url: "https://www.zhihu.com/search?q=",
        placeholder: "有问题，上知乎",
        icon: "#icon-zhihu",
        color: "#0084fe"
      },
      {
        name: "Blibili",
        url: "https://search.bilibili.com/all?keyword=",
        icon: "#icon-bilibili",
        placeholder: "(゜-゜)つロ 干杯~",
        color: "#00a1d6"
      },
      {
        name: "微博",
        url: "https://s.weibo.com/weibo/",
        placeholder: "随时随地发现新鲜事",
        icon: "#icon-weibo",
        color: "#ff5722"
      },
      {
        name: "谷歌",
        url: "https://search.njau.cf/extdomains/www.google.com.hk/search?q=",
        icon: "#icon-google",
        placeholder: "值得信任的搜索引擎"
      },
      {
        name: "翻译",
        url: "https://translate.google.cn/?hl=zh-CN&sl=auto&tl=zh-CN&text=",
        placeholder: "输入翻译内容（自动检测语言）",
        icon: "#icon-search",
        color: "#0084fe"
      }
    ],
    categories: [
      {
        title: "我的服务",
        icon: "#icon-home",
        links: [
          {
            name: "本地服务",
            url: "/local",
            icon: "/img/ico/fmq.ico"
          },
          {
            name: "transmission",
            url: "https://transmission.asfmq.cn",
            icon: "/img/ico/Transmission.png"
          },
          {
            name: "alist",
            url: "https://alist.asfmq.cn",
            icon: "/img/ico/alist.png"
          },
          {
            name: "calibre",
            url: "https://calibre.asfmq.cn",
            icon: "/img/ico/calibre.png"
          },
          {
            name: "xiaoya",
            url: "https://xiaoya.asfmq.cn",
            icon: "/img/ico/xiaoya.jpg"
          },
          {
            name: "ollama",
            url: "https://ollama.asfmq.cn/",
            icon: "/img/ico/ollama.jpg"
          },
          {
            name: "1panel",
            url: "https://1panel.asfmq.cn/",
            icon: "#icon-1panel"
          },
          {
            name: "frp",
            url: "https://frp.asfmq.cn",
            icon: "/img/ico/frps.svg"
          },
          {
            name: "Astro科研",
            url: "https://asr.asfmq.cn/",
            icon: "https://asr.asfmq.cn/favicon.svg"
          },
          {
            name: "DCTS — 分布式恒星大气网格计算控制台",
            url: "https://dcts.asfmq.cn/",
            icon: "https://dcts.asfmq.cn/favicon.ico"
          },
          {
            name: "Gitea",
            url: "https://git.asfmq.cn/",
            icon: "https://git.asfmq.cn/assets/img/favicon.svg"
          },
          {
            name: "飞牛 fnOS",
            url: "https://fn.asfmq.cn/",
            icon: "https://fn.asfmq.cn/favicon.ico"
          },
          {
            name: "Vaultwarden Web",
            url: "https://pwd.asfmq.cn/",
            icon: "https://pwd.asfmq.cn/images/favicon-32x32.png"
          },
          {
            name: "dsh",
            url: "dsh.asfmq.cn",
            icon: "https://ts2.tc.mm.bing.net/th/id/ODF.KzCeWNStUCs8vICyeYlCqA?w=32&h=32&qlt=91&pcl=fffffa&o=6&pid=1.2"
          }
        ]
      },
      {
        title: "科研",
        icon: "#icon-search",
        links: [
          {
            name: "ArXiv",
            url: "https://arxiv.org/",
            icon: "/img/ico/img_66ff54aa5775c.ico"
          },
          {
            name: "GitHub",
            url: "https://github.com/",
            icon: "/img/ico/img_66ff58e4c794c.png"
          },
          {
            name: "Gitee",
            url: "https://gitee.com/",
            icon: "/img/ico/img_66ff590389ea3.ico"
          },
          {
            name: "科研废物导航",
            url: "https://www.yanweb.top/",
            icon: "/img/ico/img_66ff5fa92663b.png"
          },
          {
            name: "DeepL",
            url: "https://www.deepl.com/zh/translator",
            icon: "/img/ico/deepl-logo-blue.svg"
          },
          {
            name: "小绿鲸",
            url: "https://www.xljsci.com/editor/",
            icon: "/img/ico/img_66ff54da46c79.ico"
          },
          {
            name: "overleaf",
            url: "https://cn.overleaf.com/",
            icon: "/img/ico/img_66ff551b97ece.ico"
          }
        ]
      },
      {
        title: "AI",
        icon: "#icon-ai",
        links: [
          {
            name: "ChatGPT",
            url: "https://chat.openai.com/",
            icon: "/img/ico/chatgpt.jpg"
          },
          {
            name: "DeepSeek",
            url: "https://chat.deepseek.com/",
            icon: "https://ts4.tc.mm.bing.net/th/id/ODF.YxK1MUJaRoBfBG4UGNrXAA?w=32&h=32&qlt=90&pcl=fffffa&o=6&pid=1.2"
          },
          {
            name: "千问",
            url: "https://www.qianwen.com/",
            icon: "https://img.alicdn.com/imgextra/i2/O1CN01FPcQDy1WTPjPX6IH9_!!6000000002789-2-tps-96-96.png"
          },
          {
            name: "智谱清言",
            url: "https://chatglm.cn/",
            icon: "https://chatglm.cn/img/icons/favicon.ico"
          },
          {
            name: "智谱清言",
            url: "https://chatglm.cn/",
            icon: "https://chatglm.cn/favicon.ico"
          },
          {
            name: "txyz",
            url: "https://app.txyz.ai/",
            icon: "/img/ico/img_674c653aa6f60.png"
          },
          {
            name: "storm",
            url: "https://storm.genie.stanford.edu/",
            icon: "/img/ico/img_674c65a506906.ico"
          },
          {
            name: "huggingface",
            url: "https://huggingface.co/",
            icon: "/img/ico/img_6755ab0e9a949.png"
          },
          {
            name: "豆包",
            url: "https://www.doubao.com/",
            icon: "https://lf-flow-web-cdn.doubao.com/obj/flow-doubao/doubao/chat/favicon.png"
          },
          {
            name: "Kimi - K2 长思考上线",
            url: "https://www.kimi.com/zh/",
            icon: "https://www.kimi.com/favicon.ico"
          },
          {
            name: "\u200eGoogle Gemini",
            url: "https://gemini.google.com/",
            icon: "https://www.gstatic.com/lamda/images/gemini_sparkle_aurora_33f86dc0c0257da337c63.svg"
          },
          {
            name: "Grok",
            url: "https://grok.com/",
            icon: "https://grok.com/images/favicon.svg"
          }
        ]
      },
      {
        title: "天文",
        icon: "#icon-astro",
        links: [
          {
            name: "ADS/NASA",
            url: "https://ui.adsabs.harvard.edu/",
            icon: "/img/ico/img_66ff59385530f.ico"
          },
          {
            name: "CDS",
            url: "https://cds.u-strasbg.fr/",
            icon: "/img/ico/img_66ff5a4793f4b.ico"
          },
          {
            name: "NADC",
            url: "https://nadc.china-vo.org/?&locale=zh_CN",
            icon: "/img/ico/img_66ff5cdae29f2.ico"
          },
          {
            name: "svo",
            url: "http://svo2.cab.inta-csic.es/theory/main/",
            icon: "/img/ico/svo.png"
          },
          {
            name: "MESA",
            url: "https://docs.mesastar.org/",
            icon: "/img/ico/MESA.png"
          },
          {
            name: "MIST",
            url: "https://waps.cfa.harvard.edu/MIST/",
            icon: "https://waps.cfa.harvard.edu/favicon.ico"
          },
          {
            name: "Gaia Archive",
            url: "https://gea.esac.esa.int/archive/",
            icon: "https://gea.esac.esa.int/archive/images/favicon.ico"
          }
        ]
      },
      {
        title: "娱乐",
        icon: "#icon-vedio",
        links: [
          {
            name: "哔哩哔哩",
            url: "https://www.bilibili.com/",
            icon: "/img/ico/img_66ff5f7e2c597.png"
          },
          {
            name: "知乎",
            url: "https://www.zhihu.com/",
            icon: "/img/ico/img_66ff5e925416b.ico"
          },
          {
            name: "抖音",
            url: "https://www.douyin.com/",
            icon: "/img/ico/img_66ff651a39877.ico"
          },
          {
            name: "youtube",
            url: "https://www.youtube.com/",
            icon: "/img/ico/youtube.jpg"
          }
        ]
      },
      {
        title: "游戏",
        icon: "#icon-game",
        links: [
          {
            name: "云·原神",
            url: "https://ys.mihoyo.com/cloud/?utm_source=default#/",
            icon: "/img/ico/img_66ff6012160c3.ico"
          },
          {
            name: "云·星穹铁道",
            url: "https://sr.mihoyo.com/cloud/?from_channel=adbdpz#/",
            icon: "/img/ico/img_66ff6024a45bd.ico"
          },
          {
            name: "3DM",
            url: "https://www.3dmgame.com/",
            icon: "https://www.3dmgame.com/favicon.ico"
          }
        ]
      },
      {
        title: "world",
        icon: "#icon-world",
        links: [
          {
            name: "Cloudflare",
            url: "https://dash.cloudflare.com/",
            icon: "/img/ico/img_671e1295a09de.ico"
          },
          {
            name: "FMHY",
            url: "https://fmhy.net/",
            icon: "https://fmhy.net/test.png"
          }
        ]
      }
    ]
  },
  copyright: {
    show: true,
    text: "2024",
    target: "asfmq.cn",
    showRecord: true,
    record: "湘ICP备2024096819号",
    recordUrl: "https://beian.miit.gov.cn"
  }
}
