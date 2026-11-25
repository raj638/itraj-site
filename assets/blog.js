(function(){
'use strict';
var SB='https://wmmywitrqcitnbrrnouz.supabase.co',KEY='sb_publishable_hEyfdohetkQDym4y-wIgWA_VpW12syZ';
function $(s){return document.querySelector(s)}
function h(tag,attrs){var e=document.createElement(tag);if(attrs)for(var k in attrs){if(k==='text')e.textContent=attrs[k];else if(k==='class')e.className=attrs[k];else e.setAttribute(k,attrs[k])}for(var i=2;i<arguments.length;i++){if(arguments[i])e.appendChild(arguments[i])}return e}
function safeUrl(u){return /^https:\/\//i.test(u||'')?u:''}
function api(p){return fetch(SB+'/rest/v1/'+p,{headers:{apikey:KEY}}).then(function(r){if(!r.ok)throw new Error(r.status);return r.json()})}
function fmt(d){try{return new Date(d).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})}catch(e){return ''}}
function setMeta(name,val,attr){var el=document.querySelector('meta['+(attr||'name')+'="'+name+'"]');if(el)el.setAttribute('content',val)}
var path=location.pathname.replace(/\/+$/,'');
var list=$('#post-list'),art=$('#post');
if(list){
  api('posts?select=slug,title,excerpt,cover_url,created_at&published=eq.true&order=sort_order.asc,created_at.desc').then(function(rows){
    list.textContent='';
    if(!rows.length){list.appendChild(h('p',{text:'New articles are on the way.'}));return}
    rows.forEach(function(p){
      var card=h('a',{class:'blog-card',href:'/blog/'+encodeURIComponent(p.slug)});
      if(safeUrl(p.cover_url))card.appendChild(h('img',{src:safeUrl(p.cover_url),alt:'',loading:'lazy',width:'800',height:'420'}));
      card.appendChild(h('div',null,h('h2',{text:p.title}),h('p',{text:p.excerpt||''}),h('span',{class:'meta',text:fmt(p.created_at)+' · Read article →'})));
      list.appendChild(card);
    });
  }).catch(function(){list.textContent='Could not load articles right now. Please try again later.'});
}
if(art){
  var slug=decodeURIComponent(path.split('/').pop());
  api('posts?select=*&published=eq.true&slug=eq.'+encodeURIComponent(slug)+'&limit=1').then(function(rows){
    if(!rows.length)throw new Error('nf');
    var p=rows[0],url='https://itraj.in/blog/'+p.slug,desc=p.excerpt||'';
    document.title=p.title+' | Raj Singh';
    setMeta('description',desc);setMeta('og:title',p.title,'property');setMeta('og:description',desc,'property');
    var robots=document.querySelector('meta[name=robots]');if(robots)robots.remove();
    var can=document.querySelector('link[rel=canonical]');can.setAttribute('href',url);
    var ld=h('script',{type:'application/ld+json'});
    ld.textContent=JSON.stringify({'@context':'https://schema.org','@type':'Article',headline:p.title,description:desc,datePublished:p.created_at,mainEntityOfPage:url,author:{'@type':'Person',name:'Raj Singh',url:'https://itraj.in/'},publisher:{'@type':'Person',name:'Raj Singh'},image:'https://itraj.in/assets/og.png'});
    document.head.appendChild(ld);
    art.textContent='';
    art.appendChild(h('p',null,h('a',{href:'/blog',class:'back',text:'← All articles'})));
    art.appendChild(h('h1',{class:'post-title',text:p.title}));
    art.appendChild(h('p',{class:'meta',text:'By Raj Singh · '+fmt(p.created_at)}));
    if(safeUrl(p.cover_url))art.appendChild(h('img',{src:safeUrl(p.cover_url),alt:p.title,class:'post-cover',width:'1200',height:'630'}));
    var body=h('div',{class:'post-body'}),ul=null;
    (p.body||'').split(/\r?\n/).forEach(function(line){
      line=line.trim();
      if(!line){ul=null;return}
      if(line.indexOf('## ')===0){ul=null;body.appendChild(h('h2',{text:line.slice(3)}));return}
      if(line.indexOf('- ')===0){if(!ul){ul=h('ul');body.appendChild(ul)}ul.appendChild(h('li',{text:line.slice(2)}));return}
      ul=null;body.appendChild(h('p',{text:line}));
    });
    art.appendChild(body);
    art.appendChild(h('div',{class:'post-cta'},h('h2',{text:'Need help with your store?'}),h('p',{text:'Tell me what you are trying to fix and I will reply within one working day.'}),h('a',{class:'btn btn-primary',href:'/#contact',text:'Start your project →'})));
  }).catch(function(){
    art.textContent='';art.appendChild(h('h1',{text:'Article not found'}));art.appendChild(h('p',null,h('a',{href:'/blog',text:'← Back to all articles'})));
  });
}
})();
