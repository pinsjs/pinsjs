(window.webpackJsonp=window.webpackJsonp||[]).push([[30],{104:function(e,t,n){"use strict";n.d(t,"a",(function(){return d})),n.d(t,"b",(function(){return m}));var a=n(0),r=n.n(a);function s(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){s(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},s=Object.keys(e);for(a=0;a<s.length;a++)n=s[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(a=0;a<s.length;a++)n=s[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var u=r.a.createContext({}),p=function(e){var t=r.a.useContext(u),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},d=function(e){var t=p(e.components);return r.a.createElement(u.Provider,{value:t},e.children)},l={inlineCode:"code",wrapper:function(e){var t=e.children;return r.a.createElement(r.a.Fragment,{},t)}},b=r.a.forwardRef((function(e,t){var n=e.components,a=e.mdxType,s=e.originalType,o=e.parentName,u=c(e,["components","mdxType","originalType","parentName"]),d=p(n),b=a,m=d["".concat(o,".").concat(b)]||d[b]||l[b]||s;return n?r.a.createElement(m,i(i({ref:t},u),{},{components:n})):r.a.createElement(m,i({ref:t},u))}));function m(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var s=n.length,o=new Array(s);o[0]=b;var i={};for(var c in t)hasOwnProperty.call(t,c)&&(i[c]=t[c]);i.originalType=e,i.mdxType="string"==typeof e?e:a,o[1]=i;for(var u=2;u<s;u++)o[u]=n[u];return r.a.createElement.apply(null,o)}return r.a.createElement.apply(null,n)}b.displayName="MDXCreateElement"},180:function(e,t,n){"use strict";n.r(t),t.default=n.p+"assets/images/schedule-updates-rsconnect-bc13f04167262c8f22a6607a62cd87f8.png"},87:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return o})),n.d(t,"metadata",(function(){return i})),n.d(t,"rightToc",(function(){return c})),n.d(t,"default",(function(){return p}));var a=n(2),r=n(6),s=(n(0),n(104)),o={id:"automate-dataset-updates",title:"Automate Dataset Updates"},i={unversionedId:"use-cases/automate-dataset-updates",id:"use-cases/automate-dataset-updates",isDocsHomePage:!1,title:"Automate Dataset Updates",description:"After datasets are shared (as showcased in the Reuse Tidy Datasets use case), it is often useful to also consider automating this process. This is especially interesting for datasets that tend to get out-of-date constantly.",source:"@site/docs/use-cases/automate-dataset-updates.md",slug:"/use-cases/automate-dataset-updates",permalink:"/docs/use-cases/automate-dataset-updates",editUrl:"https://github.com/mlverse/pins/edit/master/website/docs/use-cases/automate-dataset-updates.md",version:"current",sidebar:"docs",previous:{title:"Reuse Tidy Datasets",permalink:"/docs/use-cases/reuse-tidy-datasets"},next:{title:"Create Data Pipelines",permalink:"/docs/use-cases/create-data-pipelines"}},c=[],u={rightToc:c};function p(e){var t=e.components,o=Object(r.a)(e,["components"]);return Object(s.b)("wrapper",Object(a.a)({},u,o,{components:t,mdxType:"MDXLayout"}),Object(s.b)("p",null,"After datasets are shared (as showcased in the ",Object(s.b)("a",Object(a.a)({parentName:"p"},{href:"/"}),"Reuse Tidy Datasets")," use case), it is often useful to also consider automating this process. This is especially interesting for datasets that tend to get out-of-date constantly."),Object(s.b)("p",null,"For example, if we were interested in updating a pin to track daily news from the ",Object(s.b)("a",Object(a.a)({parentName:"p"},{href:"http://feeds.bbci.co.uk/news/world/rss.xml"}),"BBC World News RSS"),", we could create the following ",Object(s.b)("a",Object(a.a)({parentName:"p"},{href:"https://rmarkdown.rstudio.com/"}),"R Markdown")," report to download the RSS feed, tidy the news, and publish a pin with the up-to-date news:"),Object(s.b)("pre",null,Object(s.b)("code",Object(a.a)({parentName:"pre"},{className:"language-markdown"}),'---\ntitle: "RStudio Connect -- World News"\n---\n\n`r \'\'````{r, setup, include = FALSE}\nlibrary(pins)\nboard_register_rsconnect(key = Sys.getenv("CONNECT_API_KEY"),\n                         server = Sys.getenv("CONNECT_SERVER"))\n```\n\nCreate the `world_news` data frame,\n\n`r \'\'````{r  fig.align=\'center\', warning=FALSE}\nlibrary(xml2)\n\nworld_news <- data.frame(title = xml_text(xml_find_all(\n  read_xml("http://feeds.bbci.co.uk/news/rss.xml"), "///item/title/node()")))\n```\n\nWhich you can then share as a pin,\n\n`r \'\'````{r}\npin(world_news, "worldnews", board = "rsconnect")\n```\n')),Object(s.b)("p",null,"While you can run manually this report each time you need the ",Object(s.b)("inlineCode",{parentName:"p"},"worldnews")," pin updated, using automated techniques makes so much sense."),Object(s.b)("p",null,"The ",Object(s.b)("inlineCode",{parentName:"p"},"pins")," package does not provide support to automate execution of R code; however, many tools and services can be used in combination with ",Object(s.b)("inlineCode",{parentName:"p"},"pins")," to update datasets with ease. For instance, when using GitHub, Travis can be used in combination with a ",Object(s.b)("inlineCode",{parentName:"p"},"GITHUB_PAT")," environment variable to knit this daily news report and update pins in GitHub. Similarly, using RStudio Connect, we can easily publish this report and configure RStudio Connect to run this report daily -- the pin will then be kept up-to-date, every-day, automatically!"),Object(s.b)("p",null,"You can preview the ",Object(s.b)("inlineCode",{parentName:"p"},"worldnews")," dataset at ",Object(s.b)("a",Object(a.a)({parentName:"p"},{href:"https://beta.rstudioconnect.com/connect/#/apps/7532/access"}),"beta.rstudioconnect.com/connect/#/apps/7532/access"),":"),Object(s.b)("p",null,Object(s.b)("a",Object(a.a)({parentName:"p"},{href:"https://beta.rstudioconnect.com/connect/#/apps/7532/access"}),Object(s.b)("img",{src:n(180).default}))))}p.isMDXComponent=!0}}]);