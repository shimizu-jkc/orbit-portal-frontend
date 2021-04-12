module.exports = {
  title: "OrBITポータル",
  description: "OrBITは、クラウドを利用した開発や運用を支援するために作られた「クラウド基盤」です。",
  dest: "release",
  head: [
    ['link', { rel: 'icon', href: '/img/favicon.ico' }]
  ],
  markdown: {
    toc: {
      includeLevel: [2, 3]
    },
    extendMarkdown: md => {
      md.set({ breaks: true });
    }
  },
  plugins: [
    "@vuepress/back-to-top",
    "@vuepress/medium-zoom",
    'tabs' 
  ],
  themeConfig: {
    logo: "/img/logo.png",
    //lastUpdated: "Last Updated",
    //Navigator Setting
    activeHeaderLinks: false,
    nav: [
      { text: "おしらせ", link: "/information/summary" },
      { 
        text: "ユーザーガイド", 
        items: [
          { 
            text: "OrBITについて",
            items: [ 
              { text: "はじめに", link: "/guide/common/introduction" },
              { text: "ロードマップ", link: "/guide/common/roadmap" },
              { text: "用語集", link: "/guide/common/glossary" }
            ]
          },
          { 
            text: "AWS利用者向け", 
            items: [
              { text: "利用開始にあたって", link: "/guide/aws/introduction" },
              { text: "セットアップ", link: "/guide/aws/setup" },
              { text: "各種サービス", link: "/guide/aws/service" },
              { text: "チュートリアル", link: "/guide/aws/tutorial" },
              { text: "リファレンス", link: "/guide/aws/reference" }
            ]
          },
          { 
            text: "GCP利用者向け",
            items: [
              { text: "利用開始にあたって", link: "/guide/gcp/introduction" },  
            ]
          }
        ]
      },
      { 
        text: "各種申請", 
        items: [
          { 
            text: "プロジェクト関連", 
            items: [            
              { text: "新規登録", link: "/request/create-project" },
              { text: "プロジェクト情報の確認", link: "/request/get-project" },
              { text: "登録解除", link: "/request/delete-project" }
            ],
          },
          {
            text: "クラウド環境関連", 
            items: [
              { text: "利用申請", link: "/request/create-account" },
              { text: "クラウド環境情報の確認", link: "/request/get-account" },
              { text: "削除申請", link: "/request/delete-account" }
            ]
          },
          {
            text: "管理者作業関連", 
            items: [
              { text: "作業の依頼", link: "/request/create-ticket" },
              { text: "作業状況の確認", link: "/request/get-tickets" }
            ]
          }
        ]
      },
      { 
        text: "ナレッジ", 
        items: [
          { text: "はじめに", link: "/knowledge/introduction" },
          { text: "ナレッジ一覧", link: "/knowledge/search" }
        ]
      },
      { 
        text: "サポート", 
        items: [
          { text: "利用規約", link: "/support/agreement" },
          { text: "リリースノート", link: "/support/release" },
          { text: "お問い合わせ", link: "/support/contact" }
        ]
      },
    ],
    //Sidebar Setting
    sidebarDepth: 1,
    sidebar: {
      "/guide/common/": [
        "introduction",
        "roadmap",
        "glossary"
      ],
      "/guide/aws/": [
        {
          title: "ユーザーガイド(AWS)",
          collapsable: false,
          children: [
            "introduction",
            "support-region"
          ]
        },
        {
          title: "セットアップ",
          collapsable: true,
          children: [
            "setup/setup-initial",
            "setup/setup-bp",
            "setup/setup-continuous"
          ]
        },
        {
          title: "各種サービス",
          collapsable: true,
          children: [  
            "service/account-management",
            "service/billing",
            "service/id-management",
            "service/security",
            "service/threat-detection",
            "service/monitoring",
            "service/audit",
          ]
        },
        {
          title: "チュートリアル",
          collapsable: true,
          children: [
            "tutorial/project-budget-alert",
            "tutorial/chatbot2slack"
          ]
        },
        {
          title: "リファレンス",
          collapsable: true,
          children: [
            "reference/baseline"
          ]
        },
        {
          title: "関連情報",
          collapsable: true,
          children: [
            "info/faq",
            "info/release"
          ]
        }
      ],
      "/request/": [
        {
          title: "プロジェクト関連",
          collapsable: false,
          children: [
            ["create-project", "新規登録"],
            ["get-project", "プロジェクト情報の確認"],
            ["delete-project", "登録解除"],
          ]
        },
        {
          title: "クラウド環境関連",
          collapsable: false,
          children: [
            ["create-account", "利用申請"],
            ["get-account", "クラウド環境情報の確認"],
            ["delete-account", "削除申請"]
          ]
        },
        {
          title: "管理者作業関連",
          collapsable: false,
          children: [
            ["create-ticket", "作業の依頼"],
            ["get-tickets", "作業状況の確認"]
          ]
        },
      ]  
    },
    // GitHub setting
    repo: "jkc-cloud/orbit-doc-UserManual",
    repoLabel: "GitHub",
    docsRepo: "jkc-cloud/orbit-doc-UserManuals",
    docsDir: "src",
    docsBranch: "master"
  }
};