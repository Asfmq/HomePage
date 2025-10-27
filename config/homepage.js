export const homepageConfig = {
  title: "fmq的主页",
  keywords: "",
  description: "",
  author: "Asfmq",
  favicon: "./img/ico/fmq.ico",
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
        icon: "#icon-bili",
        placeholder: "(゜-゜)つロ 干杯~"
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
        icon: "#icon-google00",
        placeholder: "值得信任的搜索引擎"
      },
      {
        name: "翻译",
        url: "https://translate.google.cn/?hl=zh-CN&sl=auto&tl=zh-CN&text=",
        placeholder: "输入翻译内容（自动检测语言）",
        icon: "#icon-fanyi",
        color: "#0084fe"
      }
    ],

    categories: [
      {
        title: "我的服务",
        icon: "fa-solid fa-home",
        links: [
          {
            name: "本地服务",
            url: "/local",
            icon: "fa-solid fa-server"
          },
          {
            name: "transmission",
            url: "https://transmission.asfmq.cn",
            icon: "fa-solid fa-download"
          },
          {
            name: "immich",
            url: "https://immich.asfmq.cn",
            icon: "fa-solid fa-images"
          },
          {
            name: "jellyfin",
            url: "https://jellyfin.asfmq.cn",
            icon: "fa-solid fa-play"
          },
          {
            name: "calibre",
            url: "https://calibre.asfmq.cn",
            icon: "fa-solid fa-book"
          },
          {
            name: "alist",
            url: "https://alist.asfmq.cn",
            icon: "fa-solid fa-folder"
          },
          {
            name: "xiaoya",
            url: "https://xiaoya.asfmq.cn",
            icon: "fa-solid fa-cloud"
          },
          {
            name: "ollama",
            url: "https://llm.asfmq.cn",
            icon: "fa-solid fa-brain"
          },
          {
            name: "1panel",
            url: "https://1panel.asfmq.cn/",
            icon: "fa-solid fa-cog"
          },
          {
            name: "frp",
            url: "https://frp.asfmq.cn",
            icon: "fa-solid fa-network-wired"
          },
          {
            name: "思源笔记",
            url: "https://note.asfmq.cn/",
            icon: "fa-solid fa-sticky-note"
          }
        ]
      },
      {
        title: "科研",
        icon: "fa-solid fa-search",
        links: [
          {
            name: "ArXiv",
            url: "https://arxiv.org/",
            icon: "fa-solid fa-file-alt"
          },
          {
            name: "GitHub",
            url: "https://github.com/",
            icon: "fa-brands fa-github"
          },
          {
            name: "Gitee",
            url: "https://gitee.com/",
            icon: "fa-brands fa-git-alt"
          },
          {
            name: "科研废物导航",
            url: "https://www.yanweb.top/",
            icon: "fa-solid fa-compass"
          },
          {
            name: "DeepL",
            url: "https://www.deepl.com/zh/translator",
            icon: "fa-solid fa-language"
          },
          {
            name: "小绿鲸",
            url: "https://www.xljsci.com/editor/",
            icon: "fa-solid fa-whale"
          },
          {
            name: "overleaf",
            url: "https://www.overleaf.com/",
            icon: "fa-solid fa-file-code"
          }
        ]
      },
      {
        title: "AI",
        icon: "fa-solid fa-robot",
        links: [
          {
            name: "ChatGPT",
            url: "https://chat.openai.com/",
            icon: "fa-solid fa-comments"
          },
          {
            name: "DeepSeek",
            url: "https://chat.deepseek.com/",
            icon: "fa-solid fa-search"
          },
          {
            name: "智谱清言",
            url: "https://chatglm.cn/",
            icon: "fa-solid fa-brain"
          },
          {
            name: "Google Gemini",
            url: "https://gemini.google.com/",
            icon: "fa-solid fa-star"
          },
          {
            name: "文心一言",
            url: "https://yiyan.baidu.com/",
            icon: "fa-solid fa-pen"
          },
          {
            name: "txyz",
            url: "https://app.txyz.ai/",
            icon: "fa-solid fa-cube"
          },
          {
            name: "storm",
            url: "https://storm.genie.stanford.edu/",
            icon: "fa-solid fa-bolt"
          },
          {
            name: "huggingface",
            url: "https://huggingface.co/",
            icon: "fa-solid fa-face-smile"
          }
        ]
      },
      {
        title: "天文",
        icon: "fa-solid fa-star",
        links: [
          {
            name: "ADS/NASA",
            url: "https://ui.adsabs.harvard.edu/",
            icon: "fa-solid fa-satellite"
          },
          {
            name: "CDS",
            url: "https://cds.u-strasbg.fr/",
            icon: "fa-solid fa-database"
          },
          {
            name: "NADC",
            url: "https://nadc.china-vo.org/?&locale=zh_CN",
            icon: "fa-solid fa-globe-asia"
          },
          {
            name: "svo",
            url: "http://svo2.cab.inta-csic.es/theory/main/",
            icon: "fa-solid fa-chart-line"
          },
          {
            name: "MESA",
            url: "https://docs.mesastar.org/",
            icon: "fa-solid fa-sun"
          },
          {
            name: "MIST",
            url: "https://waps.cfa.harvard.edu/MIST/",
            icon: "fa-solid fa-cloud-moon"
          }
        ]
      },
      {
        title: "娱乐",
        icon: "fa-solid fa-video",
        links: [
          {
            name: "哔哩哔哩",
            url: "https://www.bilibili.com/",
            icon: "fa-brands fa-bilibili"
          },
          {
            name: "知乎",
            url: "https://www.zhihu.com/",
            icon: "fa-brands fa-zhihu"
          },
          {
            name: "抖音",
            url: "https://www.douyin.com/",
            icon: "fa-brands fa-tiktok"
          },
          {
            name: "youtube",
            url: "https://www.youtube.com/",
            icon: "fa-brands fa-youtube"
          }
        ]
      },
      {
        title: "游戏",
        icon: "fa-solid fa-gamepad",
        links: [
          {
            name: "云·原神",
            url: "https://ys.mihoyo.com/cloud/?utm_source=default#/",
            icon: "fa-solid fa-cloud"
          },
          {
            name: "云·星穹铁道",
            url: "https://sr.mihoyo.com/cloud/?from_channel=adbdpz#/",
            icon: "fa-solid fa-train"
          },
          {
            name: "3DM",
            url: "https://www.3dmgame.com/",
            icon: "fa-solid fa-gamepad"
          }
        ]
      },
      {
        title: "world",
        icon: "fa-solid fa-globe",
        links: [
          {
            name: "Cloudflare",
            url: "https://dash.cloudflare.com/",
            icon: "fa-solid fa-cloud"
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