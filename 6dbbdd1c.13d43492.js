(window.webpackJsonp=window.webpackJsonp||[]).push([[17],{104:function(e,t,n){"use strict";n.d(t,"a",(function(){return b})),n.d(t,"b",(function(){return m}));var r=n(0),a=n.n(r);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function s(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var l=a.a.createContext({}),d=function(e){var t=a.a.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):s(s({},t),e)),n},b=function(e){var t=d(e.components);return a.a.createElement(l.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return a.a.createElement(a.a.Fragment,{},t)}},u=a.a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,i=e.parentName,l=c(e,["components","mdxType","originalType","parentName"]),b=d(n),u=r,m=b["".concat(i,".").concat(u)]||b[u]||p[u]||o;return n?a.a.createElement(m,s(s({ref:t},l),{},{components:n})):a.a.createElement(m,s({ref:t},l))}));function m(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,i=new Array(o);i[0]=u;var s={};for(var c in t)hasOwnProperty.call(t,c)&&(s[c]=t[c]);s.originalType=e,s.mdxType="string"==typeof e?e:r,i[1]=s;for(var l=2;l<o;l++)i[l]=n[l];return a.a.createElement.apply(null,i)}return a.a.createElement.apply(null,n)}u.displayName="MDXCreateElement"},162:function(e,t,n){"use strict";n.r(t),t.default=n.p+"assets/images/pins-cloud-boards-azure-gcloud-s3-aef04618e91dff52d41860a986bc3599.png"},163:function(e,t,n){"use strict";n.r(t),t.default=n.p+"assets/images/pins-upload-s3-results-c69d71d8fc9bdb8ae7db55167c3c245a.png"},75:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return i})),n.d(t,"metadata",(function(){return s})),n.d(t,"rightToc",(function(){return c})),n.d(t,"default",(function(){return d}));var r=n(2),a=n(6),o=(n(0),n(104)),i={slug:"pins-0-3-0",title:"pins 0.3: Azure, GCloud and S3",description:"New CRAN release for pins adds support for cloud boards (Azure, Google Cloud and S3), new functions, use cases and many other improvements.",author:"Javier Luraschi",author_title:"Software Engineer @ RStudio",author_url:"https://github.com/javierluraschi",author_image_url:"https://avatars0.githubusercontent.com/u/3478847?s=460&v=4",tags:["release","announcement"]},s={permalink:"/blog/pins-0-3-0",editUrl:"https://github.com/mlverse/pins/edit/master/website/blog/blog/2019-11-28-pins-0-3-0.md",source:"@site/blog/2019-11-28-pins-0-3-0.md",description:"New CRAN release for pins adds support for cloud boards (Azure, Google Cloud and S3), new functions, use cases and many other improvements.",date:"2019-11-28T00:00:00.000Z",tags:[{label:"release",permalink:"/blog/tags/release"},{label:"announcement",permalink:"/blog/tags/announcement"}],title:"pins 0.3: Azure, GCloud and S3",readingTime:5.065,truncated:!0,prevItem:{title:"pins 0.4: Versioning",permalink:"/blog/pins-0-4-0"},nextItem:{title:"pins: Pin, Discover and Share Resources",permalink:"/blog/pins-0-2-0"}},c=[{value:"Cloud Boards",id:"cloud-boards",children:[]},{value:"Pin Information",id:"pin-information",children:[]}],l={rightToc:c};function d(e){var t=e.components,i=Object(a.a)(e,["components"]);return Object(o.b)("wrapper",Object(r.a)({},l,i,{components:t,mdxType:"MDXLayout"}),Object(o.b)("p",null,"New CRAN release for pins adds support for cloud boards (Azure, Google Cloud and S3), new functions, use cases and many other improvements."),Object(o.b)("p",null,"A new version of ",Object(o.b)("inlineCode",{parentName:"p"},"pins")," is available on CRAN! ",Object(o.b)("inlineCode",{parentName:"p"},"pins 0.3")," comes with many improvements and the following major features:"),Object(o.b)("ul",null,Object(o.b)("li",{parentName:"ul"},"Support for new ",Object(o.b)("strong",{parentName:"li"},"cloud boards")," to pin resources in ",Object(o.b)("a",Object(r.a)({parentName:"li"},{href:"/"}),"Azure"),", ",Object(o.b)("a",Object(r.a)({parentName:"li"},{href:"/"}),"GCloud")," and ",Object(o.b)("a",Object(r.a)({parentName:"li"},{href:"/"}),"S3")," storage."),Object(o.b)("li",{parentName:"ul"},"Retrieve ",Object(o.b)("strong",{parentName:"li"},"pin information")," with ",Object(o.b)("inlineCode",{parentName:"li"},"pin_info()")," including properties particular to each board.")),Object(o.b)("p",null,"You can install this new version from CRAN as follows:"),Object(o.b)("pre",null,Object(o.b)("code",Object(r.a)({parentName:"pre"},{className:"language-r"}),'install.packages("pins")\n')),Object(o.b)("p",null,"In addition, there is a new ",Object(o.b)("a",Object(r.a)({parentName:"p"},{href:"https://rstudio.github.io/pins/articles/use-cases.html"}),"Use Cases")," section in our docs, various improvements (see ",Object(o.b)("a",Object(r.a)({parentName:"p"},{href:"https://rstudio.github.io/pins/news/index.html"}),"NEWS"),") and two community extensions being developed to support ",Object(o.b)("a",Object(r.a)({parentName:"p"},{href:"https://rstudio.github.io/connections/#pins"}),"databases")," and ",Object(o.b)("a",Object(r.a)({parentName:"p"},{href:"https://gitlab.com/gwmngilfen/nextcloudr"}),"Nextcloud")," as boards."),Object(o.b)("h2",{id:"cloud-boards"},"Cloud Boards"),Object(o.b)("p",null,Object(o.b)("inlineCode",{parentName:"p"},"pins 0.3")," adds support to find, retrieve and store resources in various cloud providers like: ",Object(o.b)("a",Object(r.a)({parentName:"p"},{href:"https://azure.microsoft.com/"}),"Microsoft Azure"),", ",Object(o.b)("a",Object(r.a)({parentName:"p"},{href:"https://cloud.google.com/"}),"Google Cloud")," and ",Object(o.b)("a",Object(r.a)({parentName:"p"},{href:"https://aws.amazon.com/"}),"Amazon Web Services"),"."),Object(o.b)("p",null,Object(o.b)("img",{src:n(162).default})),Object(o.b)("p",null,"To illustrate how they work, lets first try to find the World Bank indicators dataset in ",Object(o.b)("a",Object(r.a)({parentName:"p"},{href:"https://www.kaggle.com/"}),"Kaggle"),":"),Object(o.b)("pre",null,Object(o.b)("code",Object(r.a)({parentName:"pre"},{className:"language-r"}),'library(pins)\npin_find("indicators", board = "kaggle")\n')),Object(o.b)("pre",null,Object(o.b)("code",Object(r.a)({parentName:"pre"},{}),"# A tibble: 6 x 4\n  name                                            description                             type  board\n  <chr>                                           <chr>                                   <chr> <chr>\n1 worldbank/world-development-indicators          World Development Indicators            files kaggle\n2 theworldbank/world-development-indicators       World Development Indicators            files kaggle\n3 cdc/chronic-disease                             Chronic Disease Indicators              files kaggle\n4 bigquery/worldbank-wdi                          World Development Indicators (WDI) Data files kaggle\n5 rajanand/key-indicators-of-annual-health-survey Health Analytics                        files kaggle\n6 loveall/human-happiness-indicators              Human Happiness Indicators              files kaggle\n")),Object(o.b)("p",null,"Which we can then easily download with ",Object(o.b)("inlineCode",{parentName:"p"},"pin_get()"),", beware this is a 2GB download:"),Object(o.b)("pre",null,Object(o.b)("code",Object(r.a)({parentName:"pre"},{className:"language-r"}),'pin_get("worldbank/world-development-indicators")\n')),Object(o.b)("pre",null,Object(o.b)("code",Object(r.a)({parentName:"pre"},{}),'[1] "/.../worldbank/world-development-indicators/Country.csv"\n[2] "/.../worldbank/world-development-indicators/CountryNotes.csv"\n[3] "/.../worldbank/world-development-indicators/database.sqlite"\n[4] "/.../worldbank/world-development-indicators/Footnotes.csv"\n[5] "/.../worldbank/world-development-indicators/hashes.txt"\n[6] "/.../worldbank/world-development-indicators/Indicators.csv"\n[7] "/.../worldbank/world-development-indicators/Series.csv"\n[8] "/.../worldbank/world-development-indicators/SeriesNotes.csv"\n')),Object(o.b)("p",null,"The ",Object(o.b)("inlineCode",{parentName:"p"},"Indicators.csv")," file contains all the indicators, so let's load it with ",Object(o.b)("a",Object(r.a)({parentName:"p"},{href:"https://readr.tidyverse.org/"}),"readr"),":"),Object(o.b)("pre",null,Object(o.b)("code",Object(r.a)({parentName:"pre"},{className:"language-r"}),'indicators <- pin_get("worldbank/world-development-indicators")[6] %>%\n  readr::read_csv()\n')),Object(o.b)("p",null,"Analysing this dataset would be quite interesting; however, this post focuses on how to share this in S3, Google Cloud or Azure storage. More specifically, we will learn how to publish to an ",Object(o.b)("a",Object(r.a)({parentName:"p"},{href:"/"}),"S3 board"),". To publish to other cloud providers, take a look at the ",Object(o.b)("a",Object(r.a)({parentName:"p"},{href:"/"}),"Google Cloud")," and ",Object(o.b)("a",Object(r.a)({parentName:"p"},{href:"/"}),"Azure boards")," articles."),Object(o.b)("p",null,"As you would expect, the first step is to register the S3 board. When using RStudio, you can use the ",Object(o.b)("a",Object(r.a)({parentName:"p"},{href:"/"}),"New Connection")," action to guide you through this process, or you can specify your ",Object(o.b)("inlineCode",{parentName:"p"},"key")," and ",Object(o.b)("inlineCode",{parentName:"p"},"secret")," as follows. Please refer to the ",Object(o.b)("a",Object(r.a)({parentName:"p"},{href:"/"}),"S3 board")," article to understand how to store your credentials securely."),Object(o.b)("pre",null,Object(o.b)("code",Object(r.a)({parentName:"pre"},{className:"language-r"}),'board_register_s3(name = "rpins",\n                  bucket  = "rpins",\n                  key = "VerySecretKey",\n                  secret = "EvenMoreImportantSecret")\n')),Object(o.b)("p",null,"With the S3 board registered, we can now pin the indicators dataset with ",Object(o.b)("inlineCode",{parentName:"p"},"pin()"),":"),Object(o.b)("pre",null,Object(o.b)("code",Object(r.a)({parentName:"pre"},{className:"language-r"}),'pin(indicators, name = "worldbank/indicators", board = "rpins")\n')),Object(o.b)("p",null,"That's about it! We can now find and retrieve this dataset from S3 using ",Object(o.b)("inlineCode",{parentName:"p"},"pin_find()"),", ",Object(o.b)("inlineCode",{parentName:"p"},"pin_get()")," or view the uploaded resources in the S3 management console:"),Object(o.b)("p",null,Object(o.b)("img",{src:n(163).default})),Object(o.b)("p",null,"To make this even easier for others to consume, we can make this S3 bucket public; which means you can now connect to this board without even having to configure S3, making it possible to retrieve this dataset with just one line of R code!"),Object(o.b)("pre",null,Object(o.b)("code",Object(r.a)({parentName:"pre"},{className:"language-r"}),'pins::pin_get("worldbank/indicators", "https://rpins.s3.amazonaws.com")\n')),Object(o.b)("pre",null,Object(o.b)("code",Object(r.a)({parentName:"pre"},{}),"# A tibble: 5,656,458 x 6\n   CountryName CountryCode IndicatorName                          IndicatorCode    Year      Value\n   <chr>       <chr>       <chr>                                  <chr>           <dbl>      <dbl>\n 1 Arab World  ARB         Adolescent fertility rate (births per\u2026 SP.ADO.TFRT      1960    1.34e+2\n 2 Arab World  ARB         Age dependency ratio (% of working-ag\u2026 SP.POP.DPND      1960    8.78e+1\n 3 Arab World  ARB         Age dependency ratio, old (% of worki\u2026 SP.POP.DPND.OL   1960    6.63e+0\n 4 Arab World  ARB         Age dependency ratio, young (% of wor\u2026 SP.POP.DPND.YG   1960    8.10e+1\n 5 Arab World  ARB         Arms exports (SIPRI trend indicator v\u2026 MS.MIL.XPRT.KD   1960    3.00e+6\n 6 Arab World  ARB         Arms imports (SIPRI trend indicator v\u2026 MS.MIL.MPRT.KD   1960    5.38e+8\n 7 Arab World  ARB         Birth rate, crude (per 1,000 people)   SP.DYN.CBRT.IN   1960    4.77e+1\n 8 Arab World  ARB         CO2 emissions (kt)                     EN.ATM.CO2E.KT   1960    5.96e+4\n 9 Arab World  ARB         CO2 emissions (metric tons per capita) EN.ATM.CO2E.PC   1960    6.44e-1\n10 Arab World  ARB         CO2 emissions from gaseous fuel consu\u2026 EN.ATM.CO2E.GF\u2026  1960    5.04e+0\n# \u2026 with 5,656,448 more rows\n")),Object(o.b)("p",null,"This works since ",Object(o.b)("inlineCode",{parentName:"p"},"pins 0.3")," automatically register URLs as a ",Object(o.b)("a",Object(r.a)({parentName:"p"},{href:"/"}),"website board")," to save you from having to explicitly call ",Object(o.b)("inlineCode",{parentName:"p"},"board_register_datatxt()"),"."),Object(o.b)("p",null,"It's also worth mentioning that ",Object(o.b)("inlineCode",{parentName:"p"},"pins")," stores the dataset using an R native format, which requires only 72MB and loads much faster than the original 2GB dataset."),Object(o.b)("h2",{id:"pin-information"},"Pin Information"),Object(o.b)("p",null,"Boards like ",Object(o.b)("a",Object(r.a)({parentName:"p"},{href:"/"}),"Kaggle")," and ",Object(o.b)("a",Object(r.a)({parentName:"p"},{href:"/"}),"RStudio Connect"),", store additional information for each pin which you can now easily retrieve with ",Object(o.b)("inlineCode",{parentName:"p"},"pin_info()"),"."),Object(o.b)("p",null,"For instance, we can retrieve additional properties from the indicators pin from Kaggle as follows,"),Object(o.b)("pre",null,Object(o.b)("code",Object(r.a)({parentName:"pre"},{className:"language-r"}),'pin_info("worldbank/world-development-indicators", board = "kaggle")\n')),Object(o.b)("pre",null,Object(o.b)("code",Object(r.a)({parentName:"pre"},{}),"# Source: kaggle<worldbank/world-development-indicators> [files]\n# Description: World Development Indicators\n# Properties:\n#   - id: 23\n#   - subtitle: Explore country development indicators from around the world\n#   - tags: (ref) business, economics, international relations, business finance...\n#   - creatorName: Megan Risdal\n#   - creatorUrl: mrisdal\n#   - totalBytes: 387054886\n#   - url: https://www.kaggle.com/worldbank/world-development-indicators\n#   - lastUpdated: 2017-05-01T17:50:44.863Z\n#   - downloadCount: 42961\n#   - isPrivate: FALSE\n#   - isReviewed: TRUE\n#   - isFeatured: FALSE\n#   - licenseName: World Bank Dataset Terms of Use\n#   - ownerName: World Bank\n#   - ownerRef: worldbank\n#   - kernelCount: 422\n#   - topicCount: 7\n#   - viewCount: 254379\n#   - voteCount: 1121\n#   - currentVersionNumber: 2\n#   - usabilityRating: 0.7647\n#   - extension: zip\n")),Object(o.b)("p",null,"And from RStudio Connect boards as well,"),Object(o.b)("pre",null,Object(o.b)("code",Object(r.a)({parentName:"pre"},{className:"language-r"}),'pin_info("worldnews", board = "rsconnect")\n')),Object(o.b)("pre",null,Object(o.b)("code",Object(r.a)({parentName:"pre"},{}),"# Source: rsconnect<jluraschi/worldnews> [table]\n# Properties:\n#   - id: 6446\n#   - guid: 1b9f04c5-ddd4-43ca-8352-98f6f01a7034\n#   - access_type: all\n#   - url: https://beta.rstudioconnect.com/content/6446/\n#   - vanity_url: FALSE\n#   - bundle_id: 16216\n#   - app_mode: 4\n#   - content_category: pin\n#   - has_parameters: FALSE\n#   - created_time: 2019-09-30T18:20:21.911777Z\n#   - last_deployed_time: 2019-11-18T16:00:16.919478Z\n#   - build_status: 2\n#   - run_as_current_user: FALSE\n#   - owner_first_name: Javier\n#   - owner_last_name: Luraschi\n#   - owner_username: jluraschi\n#   - owner_guid: ac498f34-174c-408f-8089-a9f10c630a37\n#   - owner_locked: FALSE\n#   - is_scheduled: FALSE\n#   - rows: 44\n#   - cols: 1\n")),Object(o.b)("p",null,"To retrieve all the extended information when discovering pins, pass ",Object(o.b)("inlineCode",{parentName:"p"},"extended = TRUE")," to ",Object(o.b)("inlineCode",{parentName:"p"},"pin_find()"),"."),Object(o.b)("p",null,"Thank you for reading this post!"),Object(o.b)("p",null,"Please refer to ",Object(o.b)("a",Object(r.a)({parentName:"p"},{href:"https://rstudio.github.io/pins"}),"rstudio.github.io/pins")," for detailed documentation, ",Object(o.b)("a",Object(r.a)({parentName:"p"},{href:"https://github.com/rstudio/pins/issues/new"}),"GitHub")," to file issues or feature requests and ",Object(o.b)("a",Object(r.a)({parentName:"p"},{href:"https://gitter.im/rstudio/pins"}),"Gitter")," to chat with us about anything else."))}d.isMDXComponent=!0}}]);