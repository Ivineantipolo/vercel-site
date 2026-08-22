const portfolioData={"wordpress": [["World Wise Travel", "https://worldwisetravel.com/"], ["Civil X Hire", "https://civil-x.com.au/"], ["Coastal Goddess", "https://coastalgoddess.com.au/"], ["Sitlec Electrical", "https://sitlec.com.au/"], ["Baissline Surveying", "https://baisslinesurveying.com.au/"], ["Blind Inspiration", "https://www.swaycurtains.com.au/"], ["Argie Grillz", "https://argiegrillz.com.au/"], ["Wow Clinic", "https://wowclinic.com.au/"], ["Greyfield", "https://greyfield.com.au/"], ["Ausdeck", "https://ausdeck.com.au/"], ["North Penrith Marketplace", "https://northpenrithmarketplace.com.au/"], ["Gift Card Store", "https://giftcardstore.com.au/"], ["Southside Mower Centre", "https://southsidemowercentre.com.au/"], ["Rush Hour", "https://rushhour.net.au/"], ["PlaySpaces Australia", "https://playspacesaustralia.com.au/"], ["Ability Companions", "https://abilitycompanions.com/"], ["Teresa's Centre", "https://teresascentre.com.au/"], ["The Radiology Centre", "https://theradiologycentre.com.au/"], ["Sherwood Receptions", "https://www.sherwoodreceptions.com.au/"], ["GNM Electrical", "https://gnmelectrical.com.au/"], ["Modena", "https://modena.com.au/"], ["Global JS", "https://globaljcllc.com/"], ["Songbird Floral Designs", "https://songbirdfloraldesigns.com/"], ["Cultivating Connection Counseling", "https://cultivatingconnectioncounseling.com/"], ["Midwest Concrete Pump Sales", "https://midwestcps.com/"], ["Chimney Sweep Clean", "https://chimneysweepclean.com/"], ["Viridios Capital", "https://viridioscapital.com/"], ["Maralytics", "https://maralytics.com/"]], "webflow": [["Weddings at the Overlook", "https://www.weddingsattheoverlook.com/"], ["Dawnelle Davis", "https://www.dawnelledavis.com/"], ["Superblue", "https://www.superblue.com/"], ["French Alley", "https://www.frenchalley.ae/"], ["Satolah Creek Farm", "https://satolahcreekfarm.com/"], ["Swifly", "https://www.swifly.co/"], ["Mero", "https://www.mero.co/"], ["Zest MSP", "https://zestmsp.com/"], ["Yarborough Mill", "https://www.yarboroughmill.com/"], ["Crew General Constructors Inc", "https://www.crewgc.com/"], ["Takallam", "https://takallam.com/"], ["Alligator Steps", "https://www.alligatorsteps.com/"], ["Serebro Health", "https://serebrohealth.ca/"]], "shopify": [["Turkey Flat", "https://turkeyflat.com.au/"], ["Caviar Culture", "https://caviarculture.com.au/"], ["Karrawatta", "https://www.karrawatta.com.au/"], ["Mindrise", "https://mindrise.au/"], ["By Beth", "https://bybeth.com/"]]};
const platformLabels={wordpress:'WordPress',webflow:'Webflow',shopify:'Shopify'};
const grid=document.querySelector('#projectGrid');
const cursor=document.querySelector('.cursor');
let revealObserver;

function screenshotUrl(url){
  return `https://s.wordpress.com/mshots/v1/${encodeURIComponent(url)}?w=1400`;
}

function cardClass(i){
  const pattern=['featured','','tall','','featured','','tall',''];
  return pattern[i%pattern.length];
}

function wireProjectInteractions(){
  document.querySelectorAll('#projectGrid .preview').forEach(pre=>{
    const img=pre.querySelector('img');
    const reset=()=>{
      img.style.transitionDuration='1.2s,.35s';
      img.style.transform='translateY(0)';
    };
    const go=()=>{
      const distance=Math.max(0,img.getBoundingClientRect().height-pre.clientHeight);
      img.style.transitionDuration=`${Math.max(3,Math.min(9,distance/130))}s,.35s`;
      img.style.transform=`translateY(-${distance}px)`;
    };
    pre.addEventListener('mouseenter',go);
    pre.addEventListener('mouseleave',reset);
    pre.addEventListener('mouseenter',()=>cursor.classList.add('on'));
    pre.addEventListener('mousemove',e=>{
      cursor.style.left=e.clientX+'px';
      cursor.style.top=e.clientY+'px';
    });
    pre.addEventListener('mouseleave',()=>cursor.classList.remove('on'));
  });
}

function renderProjects(platform){
  const items=portfolioData[platform] || [];
  grid.classList.remove('project-grid-enter');
  grid.innerHTML=items.map((p,i)=>{
    const [name,url]=p;
    const domain=new URL(url).hostname.replace('www.','');
    const platformName=platformLabels[platform];
    return `<article class="card ${cardClass(i)}"><a class="preview" href="${url}" target="_blank" rel="noreferrer"><img loading="lazy" alt="${name} website screenshot" src="${screenshotUrl(url)}"><span class="view">View live ↗</span></a><div class="info"><span class="idx">${String(i+1).padStart(2,'0')}</span><div><h3>${name}</h3><p>${domain}</p><div class="tags"><span>${platformName}</span><span>Website Development</span><span>Responsive Build</span></div></div></div></article>`;
  }).join('');
  requestAnimationFrame(()=>grid.classList.add('project-grid-enter'));
  [...grid.querySelectorAll('.card')].forEach((card,i)=>card.style.animationDelay=`${Math.min(i*35,280)}ms`);
  wireProjectInteractions();
}

document.querySelectorAll('.project-tab').forEach(tab=>{
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
