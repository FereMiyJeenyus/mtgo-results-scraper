(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{306:function(e,t,n){e.exports=n(761)},311:function(e,t,n){},312:function(e,t,n){},335:function(e,t){},337:function(e,t){},368:function(e,t){},369:function(e,t){},417:function(e,t){},419:function(e,t){},442:function(e,t){},550:function(e,t){},761:function(e,t,n){"use strict";n.r(t);var a=n(19),r=n.n(a),c=n(297),o=n.n(c),i=(n(311),n(298)),s=n(299),l=n(304),u=n(300),h=n(305),p=n(42),m=(n(312),n(301)),d=n(302),f=n(303),w=n.n(f),b=function(e){function t(e){var n;return Object(i.a)(this,t),(n=Object(l.a)(this,Object(u.a)(t).call(this,e))).state={scrapeResults:"",wotcUrl:""},n.handleChange=n.handleChange.bind(Object(p.a)(Object(p.a)(n))),n.handleSubmit=n.handleSubmit.bind(Object(p.a)(Object(p.a)(n))),n}return Object(h.a)(t,e),Object(s.a)(t,[{key:"handleChange",value:function(e){this.setState({wotcUrl:e.target.value.trim()})}},{key:"handleSubmit",value:function(e){var t=this;if(e.preventDefault(),this.state.wotcUrl.startsWith("https://magic.wizards.com")){var n={uri:"https://cors-anywhere.herokuapp.com/".concat(this.state.wotcUrl),transform:function(e){return d.load(e)}},a=/[\d\)]/g;m(n).then(function(e){var n=[],r=t.state.wotcUrl;e("h4").each(function(t,c){var o=e(this).text().split(" ("),i=o[0],s=o[1].replace(" ","_").replace(a,"").toLowerCase();n.push({name:i,url:"".concat(r,"#").concat(i.replace(" ","_").replace(a,"").toLowerCase(),"_").concat(s)})});var c=n.map(function(e){return"* [archetype](".concat(e.url,"): **").concat(e.name.replace(/[_]/g,"\\_"),"**")});t.setState(function(e){return{wotcUrl:"",scrapeResults:c.join("\r\n"),scrapeTest:c[0]}})}).catch(function(e){console.log(e)})}}},{key:"getRawMarkup",value:function(){return{__html:(new w.a).render(this.state.scrapeTest)}}},{key:"render",value:function(){return r.a.createElement("div",{className:"App"},r.a.createElement("header",{className:"App-header"},r.a.createElement("form",{onSubmit:this.handleSubmit},r.a.createElement("label",{htmlFor:"url-input"},"URL to scrape:\xa0"),r.a.createElement("input",{id:"url-input",onChange:this.handleChange,value:this.state.wotcUrl}),r.a.createElement("br",null),r.a.createElement("button",null,"Scrape")),r.a.createElement("textarea",{readOnly:!0,style:{width:1400,height:600},value:"".concat(this.state.scrapeResults,"\r\n\r\n").concat("^(Direct link formatting thanks to /u/FereMiyJeenyus and their web scraper! If you encounter any dead or broken links, or have any questions/praise, please reach out to them!)")}),r.a.createElement("div",{className:"content",dangerouslySetInnerHTML:this.getRawMarkup()})))}}]),t}(a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(r.a.createElement(b,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})}},[[306,1,2]]]);
//# sourceMappingURL=main.30b0ae6f.chunk.js.map