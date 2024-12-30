const config = {
    "title": "fmq的主页",
    "keywords": "",
    "description": "",
    "author": "Asfmq",
    "favicon": "./img/fmq.ico",
    "backgroundImage": "https://ts1.cn.mm.bing.net/th/id/R-C.5245729f06d893bb71f1ef22d1701e99?rik=UUiU5%2f9nqV5QWA&riu=http%3a%2f%2f5b0988e595225.cdn.sohucs.com%2fimages%2f20181109%2fa6fcad52457646ef8b3d3c3b3b12e8ab.jpeg&ehk=UIlATT2VKn8IqNzCFFGKXvl11vSYf%2flqCueyxilmefg%3d&risl=&pid=ImgRaw&r=0",
    "links": {
        "navItems": [
            {
                "name": "主页",
                "url": "https://home.asfmq.com/",
                "id": "home-link"
            },
            {
                "name": "博客",
                "url": "https://blog.asfmq.com/",
                "id": "blog-link"
            },
            {
                "name": "Github",
                "url": "https://github.com/Asfmq",
                "id": "github-link"
            }
        ],
        "searchEngines": [
            {
                "name": "Bing",
                "url": "https://cn.bing.com/search?q=",
                "placeholder": "微软必应搜索",
                "icon": "#icon-bing",
                "color": "#696a6d"
            },
            {
                "name": "百度",
                "url": "https://www.baidu.com/s?word=",
                "placeholder": "百度一下，你就知道",
                "icon": "#icon-icon_baidulogo",
                "color": "#0c498c"
            },
            {
                "name": "搜狗",
                "url": "https://www.sogou.com/web?query=",
                "placeholder": "上网从搜狗开始",
                "icon": "#icon-sougou",
                "color": "#696a6d"
            },
            {
                "name": "知乎",
                "url": "https://www.zhihu.com/search?q=",
                "placeholder": "有问题，上知乎",
                "icon": "#icon-zhihu",
                "color": "#0084fe"
            },
            {
                "name": "Blibili",
                "url": "https://search.bilibili.com/all?keyword=",
                "icon": "#icon-bili",
                "placeholder": "(゜-゜)つロ 干杯~"
            },
            {
                "name": "微博",
                "url": "https://s.weibo.com/weibo/",
                "placeholder": "随时随地发现新鲜事",
                "icon": "#icon-weibo",
                "color": "#ff5722"
            },
            {
                "name": "谷歌",
                "url": "https://search.njau.cf/extdomains/www.google.com.hk/search?q=",
                "icon": "#icon-google00",
                "placeholder": "值得信任的搜索引擎"
            },
            {
                "name": "翻译",
                "url": "https://translate.google.cn/?hl=zh-CN&sl=auto&tl=zh-CN&text=",
                "placeholder": "输入翻译内容（自动检测语言）",
                "icon": "#icon-fanyi",
                "color": "#0084fe"
            }
        ],
        "categories": [
            {
                "title": "我的服务",
                "icon": "#icon-home",
                "links": [
                    {
                        "name": "本地服务",
                        "url": "/local",
                        "icon": "./img/fmq.ico"
                    },
                    {
                        "name": "transmission",
                        "url": "https://transmission.asfmq.cn",
                        "icon": "./img/Transmission.png"
                    },
                    {
                        "name": "immich",
                        "url": "https://immich.asfmq.cn",
                        "icon": "./img/immich.ico"
                    },
                    {
                        "name": "jellyfin",
                        "url": "https://jellyfin.asfmq.cn",
                        "icon": "./img/jellyfin.jpg"
                    },
                    {
                        "name": "calibre",
                        "url": "https://calibre.asfmq.cn",
                        "icon": "./img/calibre.png"
                    },
                    {
                        "name": "alist",
                        "url": "https://alist.asfmq.cn",
                        "icon": "./img/alist.png"
                    },
                    {
                        "name": "xiaoya",
                        "url": "https://xiaoya.asfmq.cn",
                        "icon": "./img/xiaoya.jpg"
                    },
                    {
                        "name": "ollama",
                        "url": "https://llm.asfmq.cn",
                        "icon": "./img/ollama.jpg"
                    },
                    {
                        "name": "1panel",
                        "url": "https://1panel.asfmq.cn/",
                        "icon": "#icon-1panel"
                    },
                    {
                        "name": "frp",
                        "url": "https://frp.asfmq.cn",
                        "icon": "./img/frps.svg"
                    }
                ]
            },
            {
                "title": "科研",
                "icon": "#icon-search",
                "links": [
                    {
                        "name": "GitHub",
                        "url": "https://github.com/",
                        "icon": "./img/img_66ff58e4c794c.png"
                    },
                    {
                        "name": "Gitee",
                        "url": "https://gitee.com/",
                        "icon": "./img/img_66ff590389ea3.ico"
                    },
                    {
                        "name": "科研废物导航",
                        "url": "https://www.yanweb.top/",
                        "icon": "./img/img_66ff5fa92663b.png"
                    },
                    {
                        "name": "DeepL",
                        "url": "https://www.deepl.com/zh/translator",
                        "icon": "./img/deepl-logo-blue.svg"
                    },
                    {
                        "name": "小绿鲸",
                        "url": "https://www.xljsci.com/editor/",
                        "icon": "./img/img_66ff54da46c79.ico"
                    },
                    {
                        "name": "overleaf",
                        "url": "https://www.overleaf.com/",
                        "icon": "./img/img_66ff551b97ece.ico"
                    }
                ]
            },
            {
                "title": "AI",
                "icon": "#icon-ai",
                "links": [
                    {
                        "name": "ArXiv",
                        "url": "https://arxiv.org/",
                        "icon": "./img/img_66ff54aa5775c.ico"
                    },
                    {
                        "name": "ChatGPT",
                        "url": "https://chat.openai.com/",
                        "icon": "./img/chatgpt.jpg"
                    },
                    {
                        "name": "txyz",
                        "url": "https://app.txyz.ai/",
                        "icon": "./img/img_674c653aa6f60.png"
                    },
                    {
                        "name": "storm",
                        "url": "https://storm.genie.stanford.edu/",
                        "icon": "./img/img_674c65a506906.ico"
                    },
                    {
                        "name": "huggingface",
                        "url": "https://huggingface.co/",
                        "icon": "./img/img_6755ab0e9a949.png"
                    }
                ]
            },
            {
                "title": "天文",
                "icon": "#icon-astro",
                "links": [
                    {
                        "name": "ADS/NASA",
                        "url": "https://ui.adsabs.harvard.edu/",
                        "icon": "./img/img_66ff59385530f.ico"
                    },
                    {
                        "name": "CDS",
                        "url": "https://cds.u-strasbg.fr/",
                        "icon": "./img/img_66ff5a4793f4b.ico"
                    },
                    {
                        "name": "NADC",
                        "url": "https://nadc.china-vo.org/?&locale=zh_CN",
                        "icon": "./img/img_66ff5cdae29f2.ico"
                    },
                    {
                        "name": "svo",
                        "url": "http://svo2.cab.inta-csic.es/theory/main/",
                        "icon": "./img/svo.png"
                    },
                    {
                        "name": "MESA",
                        "url": "https://docs.mesastar.org/",
                        "icon": "./img/MESA.png"
                    },
                    {
                        "name": "MIST",
                        "url": "https://waps.cfa.harvard.edu/MIST/model_grids.html",
                        "icon": "https://waps.cfa.harvard.edu/favicon.ico"
                    }
                ]
            },
            {
                "title": "娱乐",
                "icon": "#icon-vedio",
                "links": [
                    {
                        "name": "哔哩哔哩",
                        "url": "https://www.bilibili.com/",
                        "icon": "./img/img_66ff5f7e2c597.png"
                    },
                    {
                        "name": "知乎",
                        "url": "https://www.zhihu.com/",
                        "icon": "./img/img_66ff5e925416b.ico"
                    },
                    {
                        "name": "抖音",
                        "url": "https://www.douyin.com/",
                        "icon": "./img/img_66ff651a39877.ico"
                    },
                    {
                        "name": "youtube",
                        "url": "https://www.youtube.com/",
                        "icon": "./img/youtube.jpg"
                    }
                ]
            },
            {
                "title": "游戏",
                "icon": "#icon-game",
                "links": [
                    {
                        "name": "云·原神",
                        "url": "https://ys.mihoyo.com/cloud/?utm_source=default#/",
                        "icon": "./img/img_66ff6012160c3.ico"
                    },
                    {
                        "name": "云·星穹铁道",
                        "url": "https://sr.mihoyo.com/cloud/?from_channel=adbdpz#/",
                        "icon": "./img/img_66ff6024a45bd.ico"
                    },
                    {
                        "name": "3DM",
                        "url": "https://www.3dmgame.com/",
                        "icon": "https://www.3dmgame.com/favicon.ico"
                    }
                ]
            },
            {
                "title": "world",
                "icon": "#icon-world",
                "links": [
                    {
                        "name": "Cloudflare",
                        "url": "https://dash.cloudflare.com/",
                        "icon": "./img/img_671e1295a09de.ico"
                    }
                ]
            }
        ]
    },
    "copyright": {
        "show": true,
        "text": "2024",
        "target": "asfmq.cn",
        "showRecord": true,
        "record": "湘ICP备2024096819号",
        "recordUrl": "https://beian.miit.gov.cn"
    }
};

module.exports = config;