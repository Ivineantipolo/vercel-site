const portfolioData={"wordpress": [["World Wise Travel", "https://worldwisetravel.com/"], ["Civil X Hire", "https://civil-x.com.au/"], ["Strive Chiropractic", "https://www.strivechiropractic.com/"], ["Coastal Goddess", "https://coastalgoddess.com.au/"], ["Sitlec Electrical", "https://sitlec.com.au/"], ["Baissline Surveying", "https://baisslinesurveying.com.au/"], ["Blind Inspiration", "https://www.swaycurtains.com.au/"], ["Argie Grillz", "https://argiegrillz.com.au/"], ["Wow Clinic", "https://wowclinic.com.au/"], ["Greyfield", "https://greyfield.com.au/"], ["Ausdeck", "https://ausdeck.com.au/"], ["Northern Ag Capital", "https://northernagcapital.com/"], ["North Penrith Marketplace", "https://northpenrithmarketplace.com.au/"], ["Gift Card Store", "https://giftcardstore.com.au/"], ["Southside Mower Centre", "https://southsidemowercentre.com.au/"], ["Rush Hour", "https://rushhour.net.au/"], ["PlaySpaces Australia", "https://playspacesaustralia.com.au/"], ["Ability Companions", "https://abilitycompanions.com/"], ["Sparling Construction", "https://www.sparlingconstruction.com/"], ["Teresa's Centre", "https://teresascentre.com.au/"], ["The Radiology Centre", "https://theradiologycentre.com.au/"], ["Sherwood Receptions", "https://www.sherwoodreceptions.com.au/"], ["GNM Electrical", "https://gnmelectrical.com.au/"], ["Schneider Law Firm", "https://schneiderlawfirm.com/"], ["Modena", "https://modena.com.au/"], ["Global JS", "https://globaljcllc.com/"], ["Songbird Floral Designs", "https://songbirdfloraldesigns.com/"], ["Cultivating Connection Counseling", "https://cultivatingconnectioncounseling.com/"], ["Avalon Events Center", "https://avaloneventscenter.com/"], ["Midwest Concrete Pump Sales", "https://midwestcps.com/"], ["Chimney Sweep Clean", "https://chimneysweepclean.com/"], ["Viridios Capital", "https://viridioscapital.com/"], ["Maralytics", "https://maralytics.com/"]], "webflow": [["Weddings at the Overlook", "https://www.weddingsattheoverlook.com/"], ["Dawnelle Davis", "https://www.dawnelledavis.com/"], ["Superblue", "https://www.superblue.com/"], ["Enertiv", "https://www.enertiv.com/"], ["French Alley", "https://www.frenchalley.ae/"], ["Satolah Creek Farm", "https://satolahcreekfarm.com/"], ["Swifly", "https://www.swifly.co/"], ["Mero", "https://www.mero.co/"], ["Zest MSP", "https://zestmsp.com/"], ["Yarborough Mill", "https://www.yarboroughmill.com/"], ["Crew General Constructors Inc", "https://www.crewgc.com/"], ["Takallam", "https://takallam.com/"], ["Alligator Steps", "https://www.alligatorsteps.com/"], ["Serebro Health", "https://serebrohealth.ca/"]], "shopify": [["Turkey Flat", "https://turkeyflat.com.au/"], ["Caviar Culture", "https://caviarculture.com.au/"], ["Karrawatta", "https://www.karrawatta.com.au/"], ["Mindrise", "https://mindrise.au/"], ["By Beth", "https://bybeth.com/"]], "duda": [["Bob Sullivan CMC Consulting", "https://www.bobsullivancmc.com/"], ["Southern Septic Service", "https://www.southernsepticserviceinc.com/"], ["Green Lawns Solutions", "https://www.greenlawnssolutions.com/"], ["Exceed Pest Control", "https://exceedpestcontrolinc.com/"], ["Sober Living Fort Worth", "https://www.soberlivingfortworth.com/"], ["Helm Construction Company", "https://www.helmconstructionco.com/"], ["Sea Clear Window Washing", "https://www.seaclearwindows.com/"], ["Ramirez Landscaping & Lighting", "https://www.ramirezlandl.com/"]]};
portfolioData.webflow=portfolioData.webflow.filter(([name])=>!['French Alley','Yarborough Mill'].includes(name));
const platformLabels={wordpress:'WordPress',webflow:'Webflow',shopify:'Shopify',duda:'Duda'};
const grid=document.querySelector('#projectGrid');
const cursor=document.querySelector('.cursor');
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer=window.matchMedia('(pointer: fine)').matches;
let revealObserver;
let screenshotPreloadObserver;
let screenshotPreloadTimer;
const screenshotLoaders=new WeakMap();

function screenshotUrl(url){
  return `https://s.wordpress.com/mshots/v1/${encodeURIComponent(url)}?w=1400`;
}

function fullScreenshotUrl(url){
  const params=new URLSearchParams({
    url,
    meta:'false',
    embed:'screenshot.url',
    'screenshot.fullPage':'true',
    'screenshot.type':'jpeg',
    'viewport.width':'1400',
    'viewport.height':'900'
  });
  return `https://api.microlink.io/?${params}`;
}

function cardClass(i){
  const pattern=['featured','','tall','','featured','','tall',''];
  return pattern[i%pattern.length];
}

function wireProjectInteractions(){
  if(screenshotPreloadObserver)screenshotPreloadObserver.disconnect();
  if(screenshotPreloadTimer)clearTimeout(screenshotPreloadTimer);

  if(finePointer&&!reducedMotion&&'IntersectionObserver' in window){
    screenshotPreloadObserver=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(!entry.isIntersecting)return;
        screenshotLoaders.get(entry.target)?.();
        screenshotPreloadObserver.unobserve(entry.target);
      });
    },{rootMargin:'0px',threshold:.01});
  }

  const previews=[...document.querySelectorAll('#projectGrid .preview')];

  previews.forEach(pre=>{
    const img=pre.querySelector('img');
    const card=pre.closest('.card');
    let hovering=false;
    let fullImagePromise;

    const reset=()=>{
      hovering=false;
      img.style.transitionDuration='.4s,1.1s,.35s';
      img.style.transform='translateY(0)';
    };

    const startScroll=()=>{
      if(!hovering||!img.naturalWidth)return;

      const renderedHeight=(img.naturalHeight/img.naturalWidth)*pre.clientWidth;
      const distance=Math.max(0,renderedHeight-pre.clientHeight);
      const duration=Math.max(4,Math.min(14,distance/110));

      img.style.transitionDuration='.4s,0s,.35s';
      img.style.transform='translateY(0)';
      void img.offsetHeight;

      requestAnimationFrame(()=>{
        if(!hovering)return;
        img.style.transitionDuration=`.4s,${duration}s,.35s`;
        img.style.transform=`translateY(-${distance}px)`;
      });
    };

    const loadFullScreenshot=()=>{
      if(img.dataset.fullLoaded==='true')return Promise.resolve(true);
      if(fullImagePromise)return fullImagePromise;

      img.dataset.fullLoading='true';
      fullImagePromise=new Promise(resolve=>{
        const fullImage=new Image();

        fullImage.addEventListener('load',()=>{
          const placeholderWidth=img.naturalWidth || 1400;
          const maxExpectedWidth=Math.max(3200,placeholderWidth*2.5);

          // Some sites make the full-page capture service expand the canvas
          // far beyond the requested viewport, leaving a tiny page at the
          // left and a large blank area. Keep the healthy mShots preview when
          // that happens instead of swapping in the malformed capture.
          if(fullImage.naturalWidth>maxExpectedWidth){
            img.dataset.fullLoading='false';
            img.dataset.fullRejected='true';
            resolve(false);
            return;
          }

          img.src=fullImage.src;

          const finish=()=>{
            img.dataset.fullLoading='false';
            img.dataset.fullLoaded='true';
            resolve(true);
          };

          if(typeof img.decode==='function'){
            img.decode().catch(()=>{}).finally(finish);
          }else{
            requestAnimationFrame(finish);
          }
        },{once:true});

        fullImage.addEventListener('error',()=>{
          img.dataset.fullLoading='false';
          fullImagePromise=undefined;
          resolve(false);
        },{once:true});

        fullImage.src=img.dataset.fullSrc;
      });

      return fullImagePromise;
    };

    screenshotLoaders.set(pre,loadFullScreenshot);
    if(screenshotPreloadObserver)screenshotPreloadObserver.observe(pre);

    const go=()=>{
      hovering=true;
      if(img.complete&&img.naturalWidth){
        startScroll();
      }else{
        img.addEventListener('load',startScroll,{once:true});
      }

      if(img.dataset.fullLoaded==='true')return;

      loadFullScreenshot().then(loaded=>{
        if(loaded)startScroll();
      });
    };
    pre.addEventListener('mouseenter',go);
    pre.addEventListener('mouseleave',reset);
    pre.addEventListener('mouseenter',()=>cursor.classList.add('on'));
    pre.addEventListener('mousemove',e=>{
      cursor.style.left=e.clientX+'px';
      cursor.style.top=e.clientY+'px';
    });
    pre.addEventListener('mouseleave',()=>cursor.classList.remove('on'));
    if(finePointer&&!reducedMotion&&card){
      card.addEventListener('pointermove',e=>{
        const r=card.getBoundingClientRect();
        card.style.setProperty('--spot-x',`${e.clientX-r.left}px`);
        card.style.setProperty('--spot-y',`${e.clientY-r.top}px`);
      });
    }
  });

  if(finePointer&&!reducedMotion){
    screenshotPreloadTimer=setTimeout(()=>{
      previews.slice(0,3).forEach(pre=>screenshotLoaders.get(pre)?.());
    },200);
  }
}

function wireImageShimmer(){
  grid.querySelectorAll('.preview').forEach(pre=>{
    pre.classList.add('loading');
    const img=pre.querySelector('img');
    const clear=()=>pre.classList.remove('loading');
    if(img.complete)clear();
    else{
      img.addEventListener('load',clear,{once:true});
      img.addEventListener('error',clear,{once:true});
    }
  });
}

function renderProjects(platform){
  const items=portfolioData[platform] || [];
  grid.classList.remove('project-grid-enter');
  grid.innerHTML=items.map((p,i)=>{
    const [name,url]=p;
    const domain=new URL(url).hostname.replace('www.','');
    const platformName=platformLabels[platform];
    return `<article class="card ${cardClass(i)}"><a class="preview" href="${url}" target="_blank" rel="noreferrer"><img loading="lazy" alt="${name} website screenshot" src="${screenshotUrl(url)}" data-full-src="${fullScreenshotUrl(url)}"><span class="view">View live ↗</span></a><div class="info"><span class="idx">${String(i+1).padStart(2,'0')}</span><div><h3>${name}</h3><p>${domain}</p><div class="tags"><span>${platformName}</span><span>Website Development</span><span>Responsive Build</span></div></div></div></article>`;
  }).join('');
  requestAnimationFrame(()=>grid.classList.add('project-grid-enter'));
  [...grid.querySelectorAll('.card')].forEach((card,i)=>card.style.animationDelay=`${Math.min(i*35,280)}ms`);
  wireProjectInteractions();
  wireImageShimmer();
}

document.querySelectorAll('.project-tab').forEach(tab=>{
  const count=tab.querySelector('.count');
  if(count)count.textContent=portfolioData[tab.dataset.platform]?.length ?? 0;
  tab.addEventListener('click',()=>{
    document.querySelectorAll('.project-tab').forEach(t=>{
      t.classList.remove('active');
      t.setAttribute('aria-selected','false');
    });
    tab.classList.add('active');
    tab.setAttribute('aria-selected','true');
    renderProjects(tab.dataset.platform);
  });
});

renderProjects('wordpress');

document.querySelectorAll('.reveal').forEach((e,i)=>e.style.transitionDelay=`${Math.min(i*35,220)}ms`);
revealObserver=new IntersectionObserver(es=>es.forEach(e=>{
  if(e.isIntersecting){
    e.target.classList.add('show');
    revealObserver.unobserve(e.target);
  }
}),{threshold:.08});
document.querySelectorAll('.reveal').forEach(e=>revealObserver.observe(e));

document.addEventListener('scroll',()=>document.querySelector('.header').classList.toggle('scrolled',scrollY>20));

document.querySelectorAll('[data-count]').forEach(el=>{
  let done=false;
  new IntersectionObserver(es=>es.forEach(e=>{
    if(e.isIntersecting&&!done){
      done=true;
      let t=+el.dataset.count,s=performance.now();
      let tick=n=>{
        let p=Math.min((n-s)/900,1);
        el.textContent=Math.floor(p*t)+(t===10?'+':'');
        if(p<1)requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
  })).observe(el);
});

document.querySelectorAll('.role:not(.experience-static .role)').forEach(r=>r.addEventListener('click',()=>{
  let open=!r.classList.contains('open');
  document.querySelectorAll('.role').forEach(x=>{
    x.classList.remove('open');
    x.querySelector('.toggle').textContent='+';
  });
  if(open){
    r.classList.add('open');
    r.querySelector('.toggle').textContent='−';
  }
}));

document.querySelectorAll('.experience-static .role').forEach(role=>{
  const toggleRole=()=>{
    const willOpen=!role.classList.contains('open');
    document.querySelectorAll('.experience-static .role').forEach(r=>{
      r.classList.remove('open');
      const b=r.querySelector('.toggle');
      if(b){b.textContent='+';b.setAttribute('aria-expanded','false');}
    });
    if(willOpen){
      role.classList.add('open');
      const btn=role.querySelector('.toggle');
      if(btn){btn.textContent='−';btn.setAttribute('aria-expanded','true');}
    }
  };
  role.addEventListener('click',toggleRole);
  const toggleBtn=role.querySelector('.toggle');
  if(toggleBtn)toggleBtn.addEventListener('click',e=>{e.stopPropagation();toggleRole();});
});

document.querySelectorAll('.tilt').forEach(c=>{
  c.addEventListener('pointermove',e=>{
    let b=c.getBoundingClientRect(),x=(e.clientX-b.left)/b.width-.5,y=(e.clientY-b.top)/b.height-.5;
    c.style.transform=`perspective(900px) rotateX(${-y*5}deg) rotateY(${x*5}deg) translateY(-4px)`;
  });
  c.addEventListener('pointerleave',()=>c.style.transform='');
});

document.querySelectorAll('.magnetic').forEach(b=>{
  b.addEventListener('pointermove',e=>{
    let r=b.getBoundingClientRect();
    b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.1}px,${(e.clientY-r.top-r.height/2)*.14}px)`;
  });
  b.addEventListener('pointerleave',()=>b.style.transform='');
});

// Modern ambient motion and scroll feedback.
const progress=document.createElement('div');
progress.className='scroll-progress';
progress.setAttribute('aria-hidden','true');
document.body.prepend(progress);

function updateScrollUI(){
  const max=document.documentElement.scrollHeight-window.innerHeight;
  const amount=max>0?(window.scrollY/max)*100:0;
  progress.style.setProperty('--scroll-progress',`${amount}%`);
}

updateScrollUI();
document.addEventListener('scroll',updateScrollUI,{passive:true});

if(finePointer&&!reducedMotion){
  document.addEventListener('pointermove',e=>{
    document.body.style.setProperty('--pointer-x',`${(e.clientX/window.innerWidth)*100}%`);
    document.body.style.setProperty('--pointer-y',`${(e.clientY/window.innerHeight)*100}%`);
  },{passive:true});

  document.querySelectorAll('.profile,.stat,.role,.service,.tool').forEach(el=>{
    el.addEventListener('pointermove',e=>{
      const r=el.getBoundingClientRect();
      el.style.setProperty('--spot-x',`${e.clientX-r.left}px`);
      el.style.setProperty('--spot-y',`${e.clientY-r.top}px`);
    });
  });
}

const navLinks=[...document.querySelectorAll('.nav a[href^="#"]')];
const observedSections=navLinks
  .map(link=>document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

if(observedSections.length){
  const navObserver=new IntersectionObserver(entries=>{
    const visible=entries
      .filter(entry=>entry.isIntersecting)
      .sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
    if(!visible)return;
    navLinks.forEach(link=>{
      const active=link.getAttribute('href')===`#${visible.target.id}`;
      link.classList.toggle('active',active);
      if(active)link.setAttribute('aria-current','location');
      else link.removeAttribute('aria-current');
    });
  },{rootMargin:'-25% 0px -60%',threshold:[0,.1,.3,.6]});
  observedSections.forEach(section=>navObserver.observe(section));
}

// Mobile nav toggle
const header=document.querySelector('.header');
const navToggle=document.querySelector('.nav-toggle');
if(header&&navToggle){
  navToggle.addEventListener('click',()=>{
    const open=header.classList.toggle('nav-open');
    navToggle.setAttribute('aria-expanded',String(open));
  });
  document.querySelectorAll('.nav a').forEach(a=>a.addEventListener('click',()=>{
    header.classList.remove('nav-open');
    navToggle.setAttribute('aria-expanded','false');
  }));
}

// Hero headline word-by-word reveal
(function initHeroReveal(){
  const h1=document.querySelector('.hero h1');
  if(!h1||reducedMotion)return;
  const gradientSpan=h1.querySelector('span');
  const textNode=[...h1.childNodes].find(n=>n.nodeType===3&&n.textContent.trim());
  let wordCount=0;
  if(textNode){
    const words=textNode.textContent.trim().split(/\s+/);
    wordCount=words.length;
    const frag=document.createDocumentFragment();
    words.forEach((w,i)=>{
      const mask=document.createElement('span');
      mask.className='word-mask';
      const word=document.createElement('span');
      word.className='word';
      word.style.animationDelay=`${i*70}ms`;
      word.textContent=w;
      mask.appendChild(word);
      frag.appendChild(mask);
      frag.appendChild(document.createTextNode(' '));
    });
    h1.replaceChild(frag,textNode);
  }
  if(gradientSpan){
    gradientSpan.classList.add('word-line');
    gradientSpan.style.animationDelay=`${wordCount*70+150}ms`;
  }
})();

// Back to top
const toTop=document.createElement('button');
toTop.className='to-top';
toTop.type='button';
toTop.setAttribute('aria-label','Back to top');
toTop.textContent='↑';
document.body.appendChild(toTop);
toTop.addEventListener('click',()=>window.scrollTo({top:0,behavior:reducedMotion?'auto':'smooth'}));
function updateToTop(){toTop.classList.toggle('show',window.scrollY>600);}
updateToTop();
document.addEventListener('scroll',updateToTop,{passive:true});
