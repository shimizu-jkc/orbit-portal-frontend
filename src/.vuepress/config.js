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
    search: false,
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
              { text: "用語集", link: "/guide/common/glossary" }
            ]
          },
          { 
            text: "AWS利用者向け", 
            items: [
              { text: "ご利用の前に", link: "/guide/aws/introduction" },
              { text: "AWSの利用を開始する", link: "/guide/aws/startup" },
              { text: "基本的な使い方", link: "/guide/aws/usecase" },
              { text: "提供サービス", link: "/guide/aws/service" },
              { text: "よくある質問", link: "/guide/aws/faq" },
              { text: "リファレンス", link: "/guide/aws/reference" }
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
          { text: "ナレッジとは", link: "/knowledge/introduction" },
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
    sidebarDepth: 0,
    sidebar: {
      "/guide/common/": [
        "introduction",
        "glossary"
      ],
      "/guide/aws/": [
        {
          title: "ユーザーガイド(AWS)",
          collapsable: false,
          children: [
            "introduction",
            "startup",
            "support-region",
            "faq"
          ]
        },
        {
          title: "基本的な使い方",
          collapsable: false,
          children: [
            "usecase/user-management",
            "usecase/request",
            "usecase/close"
          ]
        },
        {
          title: "提供サービス",
          collapsable: false,
          children: [  
            "service/account-management",
            "service/billing",
            "service/id-management",
            "service/security",
            "service/threat-detection",
            "service/monitoring",
            "service/audit",
            "service/budget-alert"
          ]
        },
        {
          title: "リファレンス",
          collapsable: true,
          children: [
            "reference/baseline"
          ]
        }
      ],
      "/request/": [
        {
          title: "使い方",
          collapsable: true,
          children: [
            "manual/create-project",
            "manual/get-update-project",
            "manual/delete-project",
            "manual/create-account",
            "manual/get-update-account",
            "manual/delete-account",
            "manual/create-ticket",
            "manual/get-update-ticket"
          ]
        },
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
    repo: "jkc-cloud/orbit-portal-frontend",
    repoLabel: "GitHub",
    docsRepo: "jkc-cloud/orbit-portal-frontend",
    docsDir: "src",
    docsBranch: "master"
  }
};