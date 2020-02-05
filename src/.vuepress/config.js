module.exports = {
  title: "Orbit Portal",
  description: "Orbitとは、クラウドを利用した開発や運用を支援するために作られた「クラウド基盤」です。",
  dest: "release",
  extraWatchFiles: [
    ".vuepress/config.js"
  ],
  themeConfig: {
    logo: "/img/logo.jpg",
    markdown: {
      config: md => {
        md.set({ breaks: true });
        md.use(require('markdown-it'));
      }
    },
    //Navigator Setting
    nav: [
      { text: "おしらせ", link: "/information/" },
      { 
        text: "ユーザーガイド", 
        items: [
          { text: "はじめに", link: "/guide/common/" },
          { text: "AWSを利用する場合", link: "/guide/aws/" },
          { text: "GCPを利用する場合", link: "/guide/gcp/" }
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
            text: "ユーザ関連", 
            items: [
              { text: "登録申請", link: "/request/regist-user" },
              { text: "情報変更申請", link: "/request/update-user" },
              { text: "削除申請", link: "/request/unregist-user" }
            ]
          },
          {
            text: "その他", 
            items: [
              { text: "監査ログ確認依頼", link: "/request/analyze-auditlog" },
              { text: "サポートプラン変更申請", link: "/request/update-support" }
            ]
          }
        ]
      },
      { 
        text: "カタログ", 
        items: [
          { text: "カタログとは", link: "/catalog/" },
          { text: "カタログ検索", link: "/catalog/search" },
          { text: "フィードバック", link: "/catalog/feedback" }
        ]
      },
      { 
        text: "サポート", 
        items: [
          { text: "用語集", link: "/glossary/" },
          { text: "リリースノート", link: "/release/" },
          { text: "よくある質問", link: "/faq/" },
          { text: "お問い合わせ", link: "/support/" }
        ]
      },
    ],
    //Sidebar Setting
    sidebar: {
      "/information/": "",
      "/guide/aws/": getGuideSidebarForAWS(),
      "/guide/gcp/": getGuideSidebarForGCP(),
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
      collapsable: false,
      children: [
        '',
        'account-management',
        'billing',
        'id-management',
        'security',
        'audit',
        'faq'
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
        '',
      ]
    }
  ]
}