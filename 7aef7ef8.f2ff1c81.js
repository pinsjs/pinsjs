(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{62:function(e,a,t){"use strict";t.r(a),t.d(a,"frontMatter",(function(){return c})),t.d(a,"metadata",(function(){return b})),t.d(a,"rightToc",(function(){return l})),t.d(a,"default",(function(){return p}));var n=t(2),r=t(6),s=(t(0),t(73)),i=t(77),o=t(78),c={id:"sharing",title:"Sharing",slug:"/sharing"},b={unversionedId:"overview/sharing",id:"overview/sharing",isDocsHomePage:!1,title:"Sharing",description:'After performing a data analysis, you might want to share your dataset with others, which you can achieve using pin(data, board = "").',source:"@site/docs/overview/sharing.md",slug:"/sharing",permalink:"/pinsjs/docs/sharing",editUrl:"https://github.com/pinsjs/pinsjs/edit/master/website/docs/overview/sharing.md",version:"current",sidebar:"docs",previous:{title:"Discovering",permalink:"/pinsjs/docs/discovering"}},l=[],u={rightToc:l};function p(e){var a=e.components,t=Object(r.a)(e,["components"]);return Object(s.b)("wrapper",Object(n.a)({},u,t,{components:a,mdxType:"MDXLayout"}),Object(s.b)("p",null,"After performing a data analysis, you might want to share your dataset with others, which you can achieve using ",Object(s.b)("inlineCode",{parentName:"p"},'pin(data, board = "<board-name>")'),"."),Object(s.b)("p",null,'There are multiple boards available, one of them is the "local" board which ',Object(s.b)("inlineCode",{parentName:"p"},"pins.js"),' uses by default. A "local" board can help you share pins with other JavaScript or Python sessions using a well-known cache folder in your local computer. Notice that this board is available by default:'),Object(s.b)(i.a,{groupId:"multilang-plugin",defaultValue:"js",values:[{label:"JavaScript",value:"js"},{label:"Python",value:"py"}],mdxType:"Tabs"},Object(s.b)(o.a,{value:"js",mdxType:"TabItem"},Object(s.b)("pre",null,Object(s.b)("code",Object(n.a)({parentName:"pre"},{className:"language-js"})," boardList()\n"))),Object(s.b)(o.a,{value:"py",mdxType:"TabItem"},Object(s.b)("pre",null,Object(s.b)("code",Object(n.a)({parentName:"pre"},{className:"language-py"})," board_list()\n")))),Object(s.b)("p",null,'Unless you\'ve registered a board, you can expect the output to be an array containing the "local" board.'),Object(s.b)("p",null,"Other boards supported in ",Object(s.b)("inlineCode",{parentName:"p"},"pins.js")," include Amazon S3 and RStudio Connnect boards, you can register an Amazon S3 board as follows:"),Object(s.b)(i.a,{groupId:"multilang-plugin",defaultValue:"js",values:[{label:"JavaScript",value:"js"},{label:"Python",value:"py"}],mdxType:"Tabs"},Object(s.b)(o.a,{value:"js",mdxType:"TabItem"},Object(s.b)("pre",null,Object(s.b)("code",Object(n.a)({parentName:"pre"},{className:"language-js"})," pins.boardRegister('s3', {\n  bucket: 'bucket',\n  key: 'key',\n  secret: 'secret'\n});\n\n"))),Object(s.b)(o.a,{value:"py",mdxType:"TabItem"},Object(s.b)("pre",null,Object(s.b)("code",Object(n.a)({parentName:"pre"},{className:"language-py"}),' pins.board_register("s3", bucket = "bucket", key = "key", secret = "secrert")\n')))),Object(s.b)("p",null,"Similarily, and RStudio Connect board can be register as:"),Object(s.b)(i.a,{groupId:"multilang-plugin",defaultValue:"js",values:[{label:"JavaScript",value:"js"},{label:"Python",value:"py"}],mdxType:"Tabs"},Object(s.b)(o.a,{value:"js",mdxType:"TabItem"},Object(s.b)("pre",null,Object(s.b)("code",Object(n.a)({parentName:"pre"},{className:"language-js"})," pins.boardRegister('rsconnect', { 'key', 'server' }); \n"))),Object(s.b)(o.a,{value:"py",mdxType:"TabItem"},Object(s.b)("pre",null,Object(s.b)("code",Object(n.a)({parentName:"pre"},{className:"language-py"}),' pins.board_register(\'rsconnect\', key = "key", server = "https://rsconnectsrv/" });\n')))))}p.isMDXComponent=!0}}]);