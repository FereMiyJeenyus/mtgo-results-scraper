(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{306:function(e,t,n){e.exports=n(761)},311:function(e,t,n){},312:function(e,t,n){},335:function(e,t){},337:function(e,t){},368:function(e,t){},369:function(e,t){},417:function(e,t){},419:function(e,t){},442:function(e,t){},550:function(e,t){},761:function(e,t,n){"use strict";n.r(t);var a=n(19),r=n.n(a),o=n(297),c=n.n(o),i=(n(311),n(298)),s=n(299),l=n(304),u=n(300),h=n(305),m=n(42),p=(n(312),n(301)),d=n(302),f=n(303),w=n.n(f),g=function(e){function t(e){var n;return Object(i.a)(this,t),(n=Object(l.a)(this,Object(u.a)(t).call(this,e))).state={scrapeResults:"",wotcUrl:""},n.handleChange=n.handleChange.bind(Object(m.a)(Object(m.a)(n))),n.handleSubmit=n.handleSubmit.bind(Object(m.a)(Object(m.a)(n))),n}return Object(h.a)(t,e),Object(s.a)(t,[{key:"handleChange",value:function(e){this.setState({wotcUrl:e.target.value.trim()})}},{key:"handleSubmit",value:function(e){var t=this;if(e.preventDefault(),this.state.wotcUrl.startsWith("https://magic.wizards.com")){var n={uri:"https://cors-anywhere.herokuapp.com/".concat(this.state.wotcUrl),transform:function(e){return d.load(e)}},a=/[^A-Za-z _-]/g,r=/ /g;p(n).then(function(e){var n=[],o=t.state.wotcUrl,c=[];e("h4").each(function(t,c){var i=e(this).text().split(" ("),s=i[0],l="";i[1]&&(l=i[1].replace(a,"").replace(r,"_").toLowerCase()),n.push({name:s,url:"".concat(o,"#").concat(s.replace(a,"").replace(r,"_").toLowerCase()).concat(l?"_"+l:"")})});var i=n.map(function(e){var t="* [archetype](".concat(e.url,"): **").concat(e.name.replace(/[_]/g,"\\_")).concat(c.includes(e.name)?" (duplicate pilot, link points to wrong other list)":"","**");return c.push(e.name),t});t.setState(function(e){return{scrapeResults:i.join("\r\n"),scrapeTest:i[0]}})}).catch(function(e){console.log(e)})}}},{key:"getRawMarkup",value:function(){return{__html:(new w.a).render(this.state.scrapeTest)}}},{key:"render",value:function(){return r.a.createElement("div",{className:"App"},r.a.createElement("header",{className:"App-header"},r.a.createElement("a",{href:"https://magic.wizards.com/en/content/deck-lists-magic-online-products-game-info",target:"_blank"},"MTGO Results"),r.a.createElement("form",{onSubmit:this.handleSubmit},r.a.createElement("label",{htmlFor:"url-input"},"URL to scrape:\xa0"),r.a.createElement("input",{id:"url-input",onChange:this.handleChange,value:this.state.wotcUrl}),r.a.createElement("button",null,"Scrape")),r.a.createElement("textarea",{readOnly:!0,style:{width:1400,height:600},value:"".concat(this.state.scrapeResults,"\r\n\r\n").concat("Direct link formatting thanks to /u/FereMiyJeenyus and [their web scraper](https://old.reddit.com/r/magicTCG/comments/brbhfg/i_made_a_useful_tool_for_anyone_who_posts_mtgo/)! If you encounter any dead or broken links, or have any questions/praise, please reach out to them!")}),r.a.createElement("div",{className:"content",dangerouslySetInnerHTML:this.getRawMarkup()})))}}]),t}(a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));c.a.render(r.a.createElement(g,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})}},[[306,1,2]]]);
//# sourceMappingURL=main.847f0e77.chunk.js.map