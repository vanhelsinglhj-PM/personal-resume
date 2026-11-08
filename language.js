(function(){
  if(window.__portfolioLanguageReady)return;
  window.__portfolioLanguageReady=true;
  const storageKey='johnny-portfolio-language';
  let language='zh';
  try{language=new URLSearchParams(location.search).get('lang')||localStorage.getItem(storageKey)||'zh';}catch{}
  if(language!=='en')language='zh';
  let toast;
  const chineseTitle=document.title;
  function updateLinks(){
    if(location.protocol!=='file:')return;
    document.querySelectorAll('a[href]').forEach(link=>{
      const raw=link.getAttribute('href');
      if(!raw||raw.startsWith('#')||/^(mailto:|tel:|https?:)/i.test(raw))return;
      try{const url=new URL(raw,location.href);if(url.protocol!=='file:'||!url.pathname.endsWith('.html'))return;url.searchParams.set('lang',language);const filename=url.pathname.substring(url.pathname.lastIndexOf('/')+1);link.setAttribute('href',filename+url.search+url.hash);}catch{}
    });
  }
  function refresh(){
    document.documentElement.lang=language==='en'?'en':'zh-CN';
    document.title=language==='en'?(location.protocol==='file:'?'Local preview · ':'')+'Johnny Lee · AI Product Manager | Portfolio':chineseTitle;
    document.querySelectorAll('.language-switch [data-language]').forEach(button=>{const active=button.getAttribute('data-language')===language;button.setAttribute('aria-pressed',String(active));button.classList.toggle('active',active);});
    document.querySelectorAll('[data-label-zh][data-label-en]').forEach(node=>node.setAttribute('aria-label',node.getAttribute(language==='en'?'data-label-en':'data-label-zh')));
    document.querySelectorAll('[data-alt-zh][data-alt-en]').forEach(node=>node.setAttribute('alt',node.getAttribute(language==='en'?'data-alt-en':'data-alt-zh')));
    updateLinks();
  }
  function setLanguage(next){
    if(next===language)return;
    if(toast)toast.remove();
    toast=document.createElement('div');toast.className='language-toast';toast.setAttribute('role','status');
    const spinner=document.createElement('span');spinner.className='language-spinner';spinner.setAttribute('aria-hidden','true');toast.appendChild(spinner);
    toast.appendChild(document.createTextNode(next==='en'?'Switching language to English':'正在切换成中文'));document.body.appendChild(toast);
    requestAnimationFrame(()=>{language=next;try{localStorage.setItem(storageKey,language);}catch{}if(location.protocol==='file:'){try{const url=new URL(location.href);url.searchParams.set('lang',language);history.replaceState(history.state,'',url.href);}catch{}}refresh();requestAnimationFrame(()=>{if(toast){toast.remove();toast=null;}});});
  }
  document.addEventListener('click',event=>{const button=event.target.closest('[data-language]');if(button&&button.closest('.language-switch'))setLanguage(button.getAttribute('data-language'));});
  refresh();
  let frame=0;new MutationObserver(()=>{if(!frame)frame=requestAnimationFrame(()=>{frame=0;refresh();});}).observe(document.body,{childList:true,subtree:true});
})();
