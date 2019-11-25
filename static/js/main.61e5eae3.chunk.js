(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{310:function(e,t,a){e.exports=a(771)},315:function(e,t,a){},316:function(e,t,a){},342:function(e,t){},344:function(e,t){},375:function(e,t){},376:function(e,t){},424:function(e,t){},426:function(e,t){},449:function(e,t){},557:function(e,t){},771:function(e,t,a){"use strict";a.r(t);var n=a(10),r=a.n(n),c=a(302),o=a.n(c),i=(a(315),a(303)),s=a(304),l=a(308),u=a(305),d=a(309),h=a(20),p=(a(316),a(306)),m=a(307),f=(a(719),/[^A-Za-z _-]/g),g=/[^A-Za-z \/]/g,C=/ /g;var b=function(e){function t(e){var a;return Object(i.a)(this,t),(a=Object(l.a)(this,Object(u.a)(t).call(this,e))).state={decks:[],postText:"",wotcUrl:"",cardString:"",cardCounts:[]},a.handleCardChange=a.handleCardChange.bind(Object(h.a)(Object(h.a)(a))),a.handleUrlChange=a.handleUrlChange.bind(Object(h.a)(Object(h.a)(a))),a.handleSubmit=a.handleSubmit.bind(Object(h.a)(Object(h.a)(a))),a.getLink=a.getLink.bind(Object(h.a)(Object(h.a)(a))),a.getCardCount=a.getCardCount.bind(Object(h.a)(Object(h.a)(a))),a}return Object(d.a)(t,e),Object(s.a)(t,[{key:"handleUrlChange",value:function(e){this.setState({wotcUrl:e.target.value.trim()})}},{key:"handleCardChange",value:function(e){this.setState({cardString:e.target.value})}},{key:"handleSubmit",value:function(e){var t=this;e.preventDefault();var a=this.state.wotcUrl;if(a.startsWith("https://magic.wizards.com")){var n={uri:"https://cors-anywhere.herokuapp.com/".concat(this.state.wotcUrl),headers:{Origin:"https://feremiyjeenyus.github.io/mtgo-results-scraper/"},transform:function(e){return m.load(e)}};p(n).then(function(e){var n=[],r=[];e(".deck-group").each(function(t,r){var c=e(this).find("h4").text(),o=c.split(" (")[0],i=c.split(" ("),s=i[0],l="";i[1]&&(l=i[1].replace(f,"").replace(C,"_").toLowerCase());var u="".concat(a,"#").concat(s.replace(f,"").replace(C,"_").toLowerCase()).concat(l?"_"+l:""),d={};e(this).find(".sorted-by-overview-container").find(".row").each(function(t,a){d[e(this).find(".card-name").text().toUpperCase().replace(g,"")]=parseInt(e(this).find(".card-count").text(),10)});var h={};e(this).find(".sorted-by-sideboard-container").find(".row").each(function(t,a){h[e(this).find(".card-name").text().toUpperCase().replace(g,"")]=parseInt(e(this).find(".card-count").text(),10)}),n.push({name:o,url:u,cards:d,sideboard:h})});var c=n.map(function(e){var t="* [archetype](".concat(e.url,"): **").concat(e.name.replace(/[_]/g,"\\_")).concat(r.includes(e.name)?" (duplicate pilot, link points to other list)":"","**");return r.push(e.name),t});t.setState(function(e){return{postText:c.join("\r\n"),decks:n}})}).catch(function(e){console.log(e)})}}},{key:"getLink",value:function(e){var t=this.state.wotcUrl,a=e.split(" ("),n=a[0],r="";return a[1]&&(r=a[1].replace(f,"").replace(C,"_").toLowerCase()),"".concat(t,"#").concat(n.replace(f,"").replace(C,"_").toLowerCase()).concat(r?"_"+r:"")}},{key:"getCardCount",value:function(){var e=this.state,t=e.cardString,a=e.decks,n=[];t.split(";").forEach(function(e){var t=e.toUpperCase().replace(g,"");if(t){var r=0,c=0;a.forEach(function(e){(e.cards[t]||e.sideboard[t])&&(r+=0|e.cards[t],r+=0|e.sideboard[t],c+=1)}),n.push({key:t,name:t,cardCount:r,deckCount:c})}}),this.setState(function(e){return{cardCounts:n}})}},{key:"render",value:function(){return r.a.createElement("div",{className:"App"},r.a.createElement("header",{className:"App-header"},"MTGO Results Scraper"),r.a.createElement("div",null,r.a.createElement("a",{href:"https://magic.wizards.com/en/content/deck-lists-magic-online-products-game-info",target:"_blank"},"MTGO Results"),r.a.createElement("form",{onSubmit:this.handleSubmit},r.a.createElement("label",{htmlFor:"url-input"},"URL to scrape: "),r.a.createElement("input",{id:"url-input",onChange:this.handleUrlChange,value:this.state.wotcUrl}),r.a.createElement("button",null,"Scrape")),r.a.createElement("textarea",{readOnly:!0,style:{width:1400,height:600},value:"".concat(this.state.postText,"\r\n\r\n").concat("Direct link formatting thanks to /u/FereMiyJeenyus and [their web scraper](https://old.reddit.com/r/magicTCG/comments/brbhfg/i_made_a_useful_tool_for_anyone_who_posts_mtgo/)! If you encounter any dead or broken links, or have any questions/praise, please reach out to them!")})),r.a.createElement("div",null,r.a.createElement("label",{htmlFor:"card-input"},"Cards to count (separate with semicolons): "),r.a.createElement("input",{id:"card-input",onChange:this.handleCardChange,value:this.state.cardString}),r.a.createElement("button",{onClick:this.getCardCount},"Get Card Count")),r.a.createElement("div",null,this.state.cardCounts.length&&this.state.cardCounts.map(function(e){return function(e){return r.a.createElement("div",{key:e.name},e.cardCount,1===e.cardCount?" copy of ":" copies of ",e.name," in ",e.deckCount," deck",1!==e.deckCount&&"s")}(e)})))}}]),t}(n.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(r.a.createElement(b,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})}},[[310,1,2]]]);
//# sourceMappingURL=main.61e5eae3.chunk.js.map