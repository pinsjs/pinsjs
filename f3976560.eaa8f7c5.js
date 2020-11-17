(window.webpackJsonp=window.webpackJsonp||[]).push([[38],{104:function(e,t,n){"use strict";n.d(t,"a",(function(){return b})),n.d(t,"b",(function(){return m}));var a=n(0),r=n.n(a);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function s(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?s(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):s(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},i=Object.keys(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var l=r.a.createContext({}),p=function(e){var t=r.a.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},b=function(e){var t=p(e.components);return r.a.createElement(l.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.a.createElement(r.a.Fragment,{},t)}},d=r.a.forwardRef((function(e,t){var n=e.components,a=e.mdxType,i=e.originalType,s=e.parentName,l=c(e,["components","mdxType","originalType","parentName"]),b=p(n),d=a,m=b["".concat(s,".").concat(d)]||b[d]||u[d]||i;return n?r.a.createElement(m,o(o({ref:t},l),{},{components:n})):r.a.createElement(m,o({ref:t},l))}));function m(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=n.length,s=new Array(i);s[0]=d;var o={};for(var c in t)hasOwnProperty.call(t,c)&&(o[c]=t[c]);o.originalType=e,o.mdxType="string"==typeof e?e:a,s[1]=o;for(var l=2;l<i;l++)s[l]=n[l];return r.a.createElement.apply(null,s)}return r.a.createElement.apply(null,n)}d.displayName="MDXCreateElement"},188:function(e,t,n){"use strict";n.r(t),t.default=n.p+"assets/images/kaggle-uploaded-dataset-ade3db4018f63b814f7229f9230682ec.png"},189:function(e,t,n){"use strict";n.r(t),t.default=n.p+"assets/images/rstudio-connect-board-6c1fde2a804e93367cd7eb74fa6ce966.png"},190:function(e,t,n){"use strict";n.r(t),t.default=n.p+"assets/images/rstudio-explore-pins-dca031d2c4dbd57de4da3eae918101f9.png"},191:function(e,t,n){"use strict";n.r(t),t.default=n.p+"assets/images/rstudio-discover-pins-f11a776f2e9cfa1e64a2e66efdadc0bf.png"},192:function(e,t,n){"use strict";n.r(t),t.default=n.p+"assets/images/rstudio-share-resources-eb6019f2729e0dda9b98bf4005605e05.png"},193:function(e,t,n){"use strict";n.r(t),t.default=n.p+"assets/images/rstudio-plot-pin-1-1aa2c7c2f626c48d4deb8148c19a4472.png"},94:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return s})),n.d(t,"metadata",(function(){return o})),n.d(t,"rightToc",(function(){return c})),n.d(t,"default",(function(){return p}));var a=n(2),r=n(6),i=(n(0),n(104)),s={},o={type:"mdx",permalink:"/",source:"@site/src/pages/index.md"},c=[{value:"Overview",id:"overview",children:[]},{value:"Installation",id:"installation",children:[]},{value:"Usage",id:"usage",children:[{value:"Pin",id:"pin",children:[]},{value:"Discover",id:"discover",children:[]},{value:"Share",id:"share",children:[]},{value:"RStudio",id:"rstudio",children:[]},{value:"Python",id:"python",children:[]}]}],l={rightToc:c};function p(e){var t=e.components,s=Object(r.a)(e,["components"]);return Object(i.b)("wrapper",Object(a.a)({},l,s,{components:t,mdxType:"MDXLayout"}),Object(i.b)("h2",{id:"overview"},"Overview"),Object(i.b)("p",null,"You can use the ",Object(i.b)("inlineCode",{parentName:"p"},"pins")," package to:"),Object(i.b)("ul",null,Object(i.b)("li",{parentName:"ul"},Object(i.b)("strong",{parentName:"li"},"Pin")," remote resources locally with ",Object(i.b)("inlineCode",{parentName:"li"},"pin()"),", work offline and\ncache results."),Object(i.b)("li",{parentName:"ul"},Object(i.b)("strong",{parentName:"li"},"Discover")," new resources across different boards using\n",Object(i.b)("inlineCode",{parentName:"li"},"pin_find()"),"."),Object(i.b)("li",{parentName:"ul"},Object(i.b)("strong",{parentName:"li"},"Share")," resources in local folders, GitHub, Kaggle, and RStudio\nConnect by registering new boards with ",Object(i.b)("inlineCode",{parentName:"li"},"board_register()"),".")),Object(i.b)("h2",{id:"installation"},"Installation"),Object(i.b)("pre",null,Object(i.b)("code",Object(a.a)({parentName:"pre"},{className:"language-r"}),'# Install the released version from CRAN:\ninstall.packages("pins")\n')),Object(i.b)("p",null,"To get a bug fix, or use a feature from the development version, you can\ninstall pins from GitHub."),Object(i.b)("pre",null,Object(i.b)("code",Object(a.a)({parentName:"pre"},{className:"language-r"}),'# install.packages("remotes")\nremotes::install_github("rstudio/pins")\n')),Object(i.b)("h2",{id:"usage"},"Usage"),Object(i.b)("pre",null,Object(i.b)("code",Object(a.a)({parentName:"pre"},{className:"language-r"}),"library(pins)\n")),Object(i.b)("h3",{id:"pin"},"Pin"),Object(i.b)("p",null,"There are two main ways to pin a resource:"),Object(i.b)("ul",null,Object(i.b)("li",{parentName:"ul"},Object(i.b)("p",{parentName:"li"},"Pin a remote file with ",Object(i.b)("inlineCode",{parentName:"p"},"pin(url)"),". This will download the file and\nmake it available in a local cache:"),Object(i.b)("pre",{parentName:"li"},Object(i.b)("code",Object(a.a)({parentName:"pre"},{className:"language-r"}),'url <- "https://raw.githubusercontent.com/facebook/prophet/master/examples/example_retail_sales.csv"\nretail_sales <- read.csv(pin(url))\n')),Object(i.b)("p",{parentName:"li"},"This makes subsequent uses much faster and allows you to work\noffline. If the resource changes, ",Object(i.b)("inlineCode",{parentName:"p"},"pin()")," will automatically\nre-download it; if goes away, ",Object(i.b)("inlineCode",{parentName:"p"},"pin()")," will keep the local cache.")),Object(i.b)("li",{parentName:"ul"},Object(i.b)("p",{parentName:"li"},"Pin an expensive local computation with ",Object(i.b)("inlineCode",{parentName:"p"},"pin(object, name)"),":"),Object(i.b)("pre",{parentName:"li"},Object(i.b)("code",Object(a.a)({parentName:"pre"},{className:"language-r"}),'library(dplyr)\nretail_sales %>%\n  group_by(month = lubridate::month(ds, T)) %>%\n  summarise(total = sum(y)) %>%\n  pin("sales_by_month")\n')),Object(i.b)("p",{parentName:"li"},"Then later retrieve it with ",Object(i.b)("inlineCode",{parentName:"p"},"pin_get(name)"),"."),Object(i.b)("pre",{parentName:"li"},Object(i.b)("code",Object(a.a)({parentName:"pre"},{className:"language-r"}),'pin_get("sales_by_month")\n#> # A tibble: 12 x 2\n#>    month   total\n#>    <ord>   <int>\n#>  1 Jan   6896303\n#>  2 Feb   6890866\n#>  3 Mar   7800074\n#>  4 Apr   7680417\n#>  5 May   8109219\n#>  6 Jun   7451431\n#>  7 Jul   7470947\n#>  8 Aug   7639700\n#>  9 Sep   7130241\n#> 10 Oct   7363820\n#> 11 Nov   7438702\n#> 12 Dec   8656874\n')))),Object(i.b)("h3",{id:"discover"},"Discover"),Object(i.b)("p",null,"You can also discover remote resources using ",Object(i.b)("inlineCode",{parentName:"p"},"pin_find()"),". It can search\nfor resources in CRAN packages, Kaggle, and RStudio Connect. For\ninstance, we can search datasets mentioning \u201cseattle\u201d in CRAN packages\nwith:"),Object(i.b)("pre",null,Object(i.b)("code",Object(a.a)({parentName:"pre"},{className:"language-r"}),'pin_find("seattle", board = "packages")\n#> # A tibble: 6 x 4\n#>   name               description                               type  board\n#>   <chr>              <chr>                                     <chr> <chr>\n#> 1 hpiR/ex_sales      Subset of Seattle Home Sales from hpiR p\u2026 table packa\u2026\n#> 2 hpiR/seattle_sales Seattle Home Sales from hpiR package.     table packa\u2026\n#> 3 latticeExtra/Seat\u2026 Daily Rainfall and Temperature at the Se\u2026 table packa\u2026\n#> 4 microsynth/seattl\u2026 Data for a crime intervention in Seattle\u2026 table packa\u2026\n#> 5 vegawidget/data_s\u2026 Example dataset: Seattle daily weather f\u2026 table packa\u2026\n#> 6 vegawidget/data_s\u2026 Example dataset: Seattle hourly temperat\u2026 table packa\u2026\n')),Object(i.b)("p",null,"Notice that the full name of a pin is ",Object(i.b)("inlineCode",{parentName:"p"},"<owner>/<name>"),". This namespacing\nallows multiple people (or packages) to create pins with the same name."),Object(i.b)("p",null,"You can then retrieve a pin through ",Object(i.b)("inlineCode",{parentName:"p"},"pin_get()"),":"),Object(i.b)("pre",null,Object(i.b)("code",Object(a.a)({parentName:"pre"},{className:"language-r"}),'seattle_sales <- pin_get("hpiR/seattle_sales") %>% print()\n#> # A tibble: 43,313 x 16\n#>    pinx  sale_id sale_price sale_date  use_type  area lot_sf  wfnt\n#>    <chr> <chr>        <int> <date>     <chr>    <int>  <int> <dbl>\n#>  1 ..00\u2026 2013..\u2026     289000 2013-02-06 sfr         79   9295     0\n#>  2 ..00\u2026 2013..\u2026     356000 2013-07-11 sfr         18   6000     0\n#>  3 ..00\u2026 2010..\u2026     333500 2010-12-29 sfr         79   7200     0\n#>  4 ..00\u2026 2016..\u2026     577200 2016-03-17 sfr         79   7200     0\n#>  5 ..00\u2026 2012..\u2026     237000 2012-05-02 sfr         79   5662     0\n#>  6 ..00\u2026 2014..\u2026     347500 2014-03-11 sfr         79   5830     0\n#>  7 ..00\u2026 2012..\u2026     429000 2012-09-20 sfr         18  12700     0\n#>  8 ..00\u2026 2015..\u2026     653295 2015-07-21 sfr         79   7000     0\n#>  9 ..00\u2026 2014..\u2026     427650 2014-02-19 townhou\u2026    79   3072     0\n#> 10 ..00\u2026 2015..\u2026     488737 2015-03-19 townhou\u2026    79   3072     0\n#> # \u2026 with 43,303 more rows, and 8 more variables: bldg_grade <int>,\n#> #   tot_sf <int>, beds <int>, baths <dbl>, age <int>, eff_age <int>,\n#> #   longitude <dbl>, latitude <dbl>\n')),Object(i.b)("p",null,"Or explore additional properties in this pin with ",Object(i.b)("inlineCode",{parentName:"p"},"pin_info()"),":"),Object(i.b)("pre",null,Object(i.b)("code",Object(a.a)({parentName:"pre"},{className:"language-r"}),'pin_info("hpiR/seattle_sales")\n#> # Source: packages<hpiR/seattle_sales> [table]\n#> # Description: Seattle Home Sales from hpiR package.\n#> # Properties:\n#> #   rows: 43313\n#> #   cols: 16\n')),Object(i.b)("h3",{id:"share"},"Share"),Object(i.b)("p",null,"Finally, you can share resources with other users by publishing to\n",Object(i.b)("a",Object(a.a)({parentName:"p"},{href:"https://pins.rstudio.com/articles/boards-kaggle.html"}),"Kaggle"),",\n",Object(i.b)("a",Object(a.a)({parentName:"p"},{href:"https://pins.rstudio.com/articles/boards-github.html"}),"GitHub"),", ",Object(i.b)("a",Object(a.a)({parentName:"p"},{href:"https://pins.rstudio.com/articles/boards-rsconnect.html"}),"RStudio\nConnect"),",\n",Object(i.b)("a",Object(a.a)({parentName:"p"},{href:"https://pins.rstudio.com/articles/boards-azure.html"}),"Azure"),", ",Object(i.b)("a",Object(a.a)({parentName:"p"},{href:"https://pins.rstudio.com/articles/boards-gcloud.html"}),"Google\nCloud"),",\n",Object(i.b)("a",Object(a.a)({parentName:"p"},{href:"https://pins.rstudio.com/articles/boards-s3.html"}),"S3"),",\n",Object(i.b)("a",Object(a.a)({parentName:"p"},{href:"https://pins.rstudio.com/articles/boards-dospace.html"}),"DigitalOcean")," or\nintegrate them into your\n",Object(i.b)("a",Object(a.a)({parentName:"p"},{href:"https://pins.rstudio.com/articles/boards-websites.html"}),"website")," as\nwell."),Object(i.b)("p",null,"To publish to Kaggle, you would first need to register the Kaggle board\nby creating a ",Object(i.b)("a",Object(a.a)({parentName:"p"},{href:"https://www.kaggle.com/me/account"}),"Kaggle API Token"),":"),Object(i.b)("pre",null,Object(i.b)("code",Object(a.a)({parentName:"pre"},{className:"language-r"}),'board_register_kaggle(token = "<path-to-kaggle.json>")\n')),Object(i.b)("p",null,"You can then easily publish to Kaggle:"),Object(i.b)("pre",null,Object(i.b)("code",Object(a.a)({parentName:"pre"},{className:"language-r"}),'pin(seattle_sales, board = "kaggle")\n')),Object(i.b)("p",null,Object(i.b)("img",{src:n(188).default})),Object(i.b)("p",null,"Learn more in ",Object(i.b)("inlineCode",{parentName:"p"},'vignette("boards-understanding")')),Object(i.b)("h3",{id:"rstudio"},"RStudio"),Object(i.b)("p",null,"Experimental support for ",Object(i.b)("inlineCode",{parentName:"p"},"pins")," was introduced in RStudio Connect 1.7.8\nso that you can use ",Object(i.b)("a",Object(a.a)({parentName:"p"},{href:"https://rstudio.com/products/rstudio/"}),"RStudio"),"\nand ",Object(i.b)("a",Object(a.a)({parentName:"p"},{href:"https://rstudio.com/products/connect/"}),"RStudio Connect")," to\ndiscover and share resources within your organization with ease. To\nenable new boards, use ",Object(i.b)("a",Object(a.a)({parentName:"p"},{href:"https://blog.rstudio.com/2017/08/16/rstudio-preview-connections/"}),"RStudio\u2019s Data\nConnections"),"\nto start a new \u2018pins\u2019 connection and then select which board to connect\nto:"),Object(i.b)("p",null,Object(i.b)("img",{src:n(189).default})),Object(i.b)("p",null,"Once connected, you can use the connections pane to track the pins you\nown and preview them with ease. Notice that one connection is created\nfor each board."),Object(i.b)("p",null,Object(i.b)("img",{src:n(190).default})),Object(i.b)("p",null,"To ",Object(i.b)("strong",{parentName:"p"},"discover")," remote resources, simply expand the \u201cAddins\u201d menu and\nselect \u201cFind Pin\u201d from the dropdown. This addin allows you to search for\npins across all boards, or scope your search to particular ones as well:"),Object(i.b)("p",null,Object(i.b)("img",{src:n(191).default})),Object(i.b)("p",null,"You can then ",Object(i.b)("strong",{parentName:"p"},"share")," local resources using the RStudio Connect board.\nLets use ",Object(i.b)("inlineCode",{parentName:"p"},"dplyr")," and the ",Object(i.b)("inlineCode",{parentName:"p"},"hpiR_seattle_sales")," pin to analyze this\nfurther and then pin our results in RStudio Connect."),Object(i.b)("pre",null,Object(i.b)("code",Object(a.a)({parentName:"pre"},{className:"language-r"}),'board_register_rsconnect(name = "myrsc")\n')),Object(i.b)("pre",null,Object(i.b)("code",Object(a.a)({parentName:"pre"},{className:"language-r"}),'seattle_sales %>%\n  group_by(baths = ceiling(baths)) %>%\n  summarise(sale = floor(mean(sale_price))) %>%\n  pin("sales-by-baths", board = "myrsc")\n')),Object(i.b)("p",null,"After a pin is published, you can then browse to the pin\u2019s content from\nthe RStudio Connect web interface."),Object(i.b)("p",null,Object(i.b)("img",{src:n(192).default})),Object(i.b)("p",null,"You can now set the appropriate permissions in RStudio Connect, and\nvoila","!"," From now on, those with access can make use of this remote file\nlocally","!"),Object(i.b)("p",null,"For instance, a colleague can reuse the ",Object(i.b)("inlineCode",{parentName:"p"},"sales-by-baths")," pin by\nretrieving it from RStudio Connect and visualize its contents using\nggplot2:"),Object(i.b)("pre",null,Object(i.b)("code",Object(a.a)({parentName:"pre"},{className:"language-r"}),'library(ggplot2)\nboard_register_rsconnect(name = "myrsc")\n\npin_get("sales-by-baths", board = "myrsc") %>%\n  ggplot(aes(x = baths, y = sale)) +\n  geom_point() +\n  geom_smooth(method = \'lm\', formula = y ~ exp(x))\n')),Object(i.b)("p",null,Object(i.b)("img",{src:n(193).default})),Object(i.b)("p",null,"Pins can also be automated using scheduled R Markdown. This makes it\nmuch easier to create Shiny applications that rely on scheduled data\nupdates or to share prepared resources across multiple pieces of\ncontent. You no longer have to fuss with file paths on RStudio Connect,\nmysterious resource URLs, or redeploying application code just to update\na dataset","!"),Object(i.b)("h3",{id:"python"},"Python"),Object(i.b)("p",null,"Experimental support for pins is also available in Python. However,\nsince the Python interface currently makes use of the R package, the R\nruntime needs to be installed when using pins from Python. To get\nstarted, first install the pins module:"),Object(i.b)("pre",null,Object(i.b)("code",Object(a.a)({parentName:"pre"},{className:"language-bash"}),"pip install git+https://github.com/rstudio/pins.git@v0.3.1#subdirectory=python\n")),Object(i.b)("p",null,"Followed by using ",Object(i.b)("inlineCode",{parentName:"p"},"pins")," from Python:"),Object(i.b)("pre",null,Object(i.b)("code",Object(a.a)({parentName:"pre"},{className:"language-python"}),'import pins\npins.pin_get("hpiR/seattle_sales")\n')),Object(i.b)("p",null,"Please make sure to ",Object(i.b)("del",{parentName:"p"},"pin")," visit,\n",Object(i.b)("a",Object(a.a)({parentName:"p"},{href:"https://pins.rstudio.com/"}),"pins.rstudio.com"),", where you will find\ndetailed documentation and additional resources."))}p.isMDXComponent=!0}}]);