(function(){
'use strict';
var SB='https://wmmywitrqcitnbrrnouz.supabase.co',KEY='sb_publishable_hEyfdohetkQDym4y-wIgWA_VpW12syZ';
var COLORS=['#4F46E5','#047857','#BE185D','#0E7490'];
function $(s,r){return (r||document).querySelector(s)}
function $$(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))}
function h(tag,attrs){var e=document.createElement(tag);if(attrs)for(var k in attrs){if(k==='text')e.textContent=attrs[k];else if(k==='class')e.className=attrs[k];else e.setAttribute(k,attrs[k])}for(var i=2;i<arguments.length;i++){var c=arguments[i];if(c)e.appendChild(c)}return e}
function safeUrl(u){return /^https:\/\//i.test(u||'')?u:''}
function api(path){return fetch(SB+'/rest/v1/'+path,{headers:{apikey:KEY}}).then(function(r){if(!r.ok)throw new Error(r.status);return r.json()})}

/* Service tabs */
var tabs=$$('.tab'),panels=$$('.panel'),wrap=$('.panels');
function pick(i,focus){tabs.forEach(function(t,j){t.setAttribute('aria-selected',j===i);t.tabIndex=j===i?0:-1});panels.forEach(function(p,j){p.hidden=j!==i});wrap.className='panels p'+i;if(focus)tabs[i].focus()}
if(tabs.length){tabs.forEach(function(t,i){t.addEventListener('click',function(){pick(i)});t.addEventListener('keydown',function(e){var n=tabs.length;if(e.key==='ArrowDown'||e.key==='ArrowRight'){e.preventDefault();pick((i+1)%n,true)}else if(e.key==='ArrowUp'||e.key==='ArrowLeft'){e.preventDefault();pick((i+n-1)%n,true)}})});pick(0)}

/* Live content from the admin panel */
function renderProjects(rows){
  var box=$('#project-list');if(!rows.length)return;box.textContent='';
  rows.forEach(function(p,i){
    var c=COLORS[i%4],shot=h('div',{class:'shot'});shot.style.background=c;
    if(safeUrl(p.image_url)){shot.appendChild(h('img',{src:safeUrl(p.image_url),alt:p.title,loading:'lazy',width:'800',height:'450'}))}
    else{var win=h('div',{class:'win'},h('div',{class:'dots'},h('i'),h('i'),h('i')),h('div',{class:'ph',text:p.title}));$$('i',win).forEach(function(d,k){d.style.background=['#EC4899','#FBBF24','#10B981'][k]});shot.appendChild(win)}
    var body=h('div',null,h('h3',{text:p.title}),h('p',{text:[p.work_type,p.result].filter(Boolean).join(' · ')}));
    var art=h('article',{class:'proj'},shot,body);
    if(safeUrl(p.link_url)){var a=h('a',{href:safeUrl(p.link_url),target:'_blank',rel:'noopener'},art);a.className='proj';art.className='';art.style.cssText='display:flex;flex-direction:column;gap:16px';box.appendChild(a)}else box.appendChild(art);
  });
}
function renderReviews(rows){
  var box=$('#review-list');if(!rows.length)return;box.textContent='';
  rows.forEach(function(r,i){
    var f=h('figure',{class:'rev'});f.style.setProperty('--c',COLORS[i%4]);
    f.appendChild(h('div',{class:'stars','aria-label':r.rating+' out of 5 stars',text:new Array(r.rating+1).join('★')}));
    f.appendChild(h('blockquote',{text:r.quote}));
    f.appendChild(h('cite',{text:r.author+(r.detail?' · '+r.detail:'')}));
    box.appendChild(f);
  });
}
function embedFor(url){
  var m,u=url||'';
  if((m=u.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([\w-]{11})/)))return{type:'yt',id:m[1]};
  if((m=u.match(/vimeo\.com\/(?:video\/)?(\d+)/)))return{type:'vimeo',id:m[1]};
  if(/\.(mp4|webm)(\?|$)/i.test(u))return{type:'file',url:u};
  return null;
}
function renderVideos(rows){
  var box=$('#video-list');if(!rows.length)return;box.textContent='';
  rows.forEach(function(v){
    var e=embedFor(v.video_url);if(!e)return;
    var vb=h('div',{class:'vbox'});
    if(e.type==='file'){vb.appendChild(h('video',{controls:'',preload:'none',poster:safeUrl(v.poster_url),src:safeUrl(e.url),title:v.title}))}
    else{
      var thumb=safeUrl(v.poster_url)||(e.type==='yt'?'https://i.ytimg.com/vi/'+e.id+'/hqdefault.jpg':'');
      var btn=h('button',{type:'button','aria-label':'Play video: '+v.title});
      if(thumb)btn.appendChild(h('img',{src:thumb,alt:'',loading:'lazy'}));
      btn.appendChild(h('span',{class:'play'}));
      btn.addEventListener('click',function(){var src=e.type==='yt'?'https://www.youtube-nocookie.com/embed/'+e.id+'?autoplay=1&rel=0':'https://player.vimeo.com/video/'+e.id+'?autoplay=1';vb.textContent='';vb.appendChild(h('iframe',{src:src,title:v.title,allow:'autoplay; encrypted-media; picture-in-picture; fullscreen',allowfullscreen:'',loading:'lazy'}))});
      vb.appendChild(btn);
    }
    var fig=h('figure',{class:'vid'},vb,h('div',null,h('h3',{text:v.title}),v.client?h('p',{text:v.client}):null));
    box.appendChild(fig);
  });
}
function applySettings(rows){
  var s={};rows.forEach(function(r){s[r.key]=r.value});
  $$('[data-s]').forEach(function(el){var v=s[el.getAttribute('data-s')];if(v)el.textContent=v});
  $$('[data-s-href]').forEach(function(el){var v=safeUrl(s[el.getAttribute('data-s-href')]);if(v)el.href=v});
  if(s.contact_email){$$('[data-mail]').forEach(function(el){el.href='mailto:'+s.contact_email;if(el.hasAttribute('data-mail-text'))el.textContent=s.contact_email})}
}
Promise.all([
  api('projects?select=*&published=eq.true&order=sort_order.asc').then(renderProjects).catch(function(){}),
  api('reviews?select=*&published=eq.true&order=sort_order.asc').then(renderReviews).catch(function(){}),
  api('videos?select=*&published=eq.true&order=sort_order.asc').then(renderVideos).catch(function(){}),
  api('settings?select=key,value').then(applySettings).catch(function(){})
]);

/* Contact form */
var form=$('#contact-form');
if(form){
  var msg=$('#form-msg'),btn=$('button[type=submit]',form);
  form.addEventListener('submit',function(ev){
    ev.preventDefault();
    msg.className='msg';msg.textContent='';
    var d=new FormData(form);
    if(d.get('website')){msg.className='msg ok';msg.textContent='Thanks! Your message has been sent.';form.reset();return}
    var last=0;try{last=+localStorage.getItem('itraj_last')||0}catch(e){}
    if(Date.now()-last<30000){msg.className='msg err';msg.textContent='Please wait a moment before sending another message.';return}
    var body={name:(d.get('name')||'').trim(),email:(d.get('email')||'').trim(),service:d.get('service')||null,message:(d.get('message')||'').trim()};
    if(!body.name||!body.email||!body.message){msg.className='msg err';msg.textContent='Please fill in your name, email and a short message.';return}
    btn.disabled=true;btn.textContent='Sending...';
    fetch(SB+'/rest/v1/inquiries',{method:'POST',headers:{apikey:KEY,'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify(body)})
    .then(function(r){if(!r.ok)throw new Error(r.status);try{localStorage.setItem('itraj_last',Date.now())}catch(e){}
      msg.className='msg ok';msg.textContent='Thanks! Your message has been sent. Raj will reply within one working day.';form.reset();
      if(window.gtag)gtag('event','generate_lead',{method:'contact_form'})})
    .catch(function(){msg.className='msg err';msg.textContent='Sorry, that did not send. Please email raj638@gmail.com directly.'})
    .then(function(){btn.disabled=false;btn.textContent='Send inquiry →'});
  });
}
})();
