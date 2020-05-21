module.exports = {
  title: "OrBIT Portal",
  description: "OrBITは、クラウドを利用した開発や運用を支援するために作られた「クラウド基盤」です。",
  dest: "release",
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
    "@vuepress/medium-zoom"
  ],
  themeConfig: {
    logo: "/img/logo.jpg",
    //lastUpdated: "Last Updated",
    //Navigator Setting
    nav: [
      { text: "おしらせ", link: "/information/" },
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
            text: "クラウド環境関連", 
            items: [            
              { text: "払い出し申請", link: "/request/create-env" },
              { text: "設定変更申請", link: "/request/update-env" },
              { text: "解約申請", link: "/request/destroy-env" }
            ],
          },
          {
            text: "ユーザー関連", 
            items: [
              { text: "登録申請", link: "/request/regist-user" },
              { text: "情報変更申請", link: "/request/update-user" },
              { text: "削除申請", link: "/request/unregist-user" }
            ]
          },
          {
            text: "作業依頼", 
            items: [
              { text: "サポートプラン変更", link: "/request/update-support" },
              { text: "監査ログ確認", link: "/request/analyze-auditlog" },
              { text: "その他", link: "/request/other" }
            ]
          }
        ]
      },
      { 
        text: "カタログ", 
        items: [
          { text: "カタログとは", link: "/catalog/introduction" },
          { text: "カタログ一覧", link: "/catalog/list" },
          { text: "フィードバック", link: "/catalog/feedback" }
        ]
      },
      { 
        text: "サポート", 
        items: [
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

// functions
function getGuideSidebarForAWS() {
  return [
    {
      title: "ユーザーガイド(AWS)",
      collapsable: true,
      children: [
        "",
        "account-management",
        "billing",
        "id-management",
        "security",
        "threat-detection",
        "monitoring",
        "audit",
        "baseline",        
        "faq"
      ]
    }
  ]
}

function getGuideSidebarForGCP() {
  return [
    {
      title: "ユーザーガイド(GCP)",
      collapsable: false,
      children: [
        "",
      ]
    }
  ]
}