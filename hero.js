(()=>{
  const hero=document.getElementById('hero');
  const heroContent=document.getElementById('heroContent');
  const heroSpacer=document.getElementById('heroSpacer');
  const canvas=document.getElementById('particleCanvas');
  const ctx=canvas.getContext('2d',{alpha:true});
  const identityWrap=document.getElementById('identityWrap');
  const identity=document.getElementById('identity');
  const wordLeft=document.getElementById('wordLeft');
  const wordRight=document.getElementById('wordRight');
  const ySlot=document.getElementById('ySlot');
  const yGlyph=document.getElementById('yGlyph');
  const identityReveal=document.getElementById('identityReveal');
  const identityRule=document.getElementById('identityRule');
  const role=document.getElementById('role');
  const roleText=role.textContent.trim();
  const scrollLink=document.querySelector('.scroll-link');
  const heroMeta=document.getElementById('heroMetaBottom');
  const siteHeader=document.getElementById('siteHeader');
  const siteLogo=document.querySelector('.site-logo');

  function startScrollHintBounce(){
    if(!matchMedia('(prefers-reduced-motion: reduce)').matches) scrollLink.classList.add('is-bouncing');
  }

  function buildRoleWave(){
    role.textContent='';
    [...roleText].forEach((ch)=>{
      const span=document.createElement('span');
      if(ch===' '){
        span.className='role-space';
        span.setAttribute('aria-hidden','true');
      }else{
        span.className='role-char';
        span.textContent=ch;
        span.setAttribute('aria-hidden','true');
      }
      role.appendChild(span);
    });
    role.setAttribute('aria-label',roleText);
  }

  buildRoleWave();
  // How many viewport heights the hero occupies before WORK covers it.
  const HERO_SPAN=parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue('--hero-span'))||2;
  const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  let currentY=18;
  let finalReady=false;

  function transition(el,props,duration,easing='cubic-bezier(.22,.8,.24,1)'){
    el.style.transition=props.map(p=>`${p} ${duration}ms ${easing}`).join(', ');
  }

  function availableIdentityWidth(){
    if(innerWidth<=420) return innerWidth-20;
    if(innerWidth<=720) return innerWidth-40;
    if(innerWidth<=960) return innerWidth-96;
    return Math.min(innerWidth-160,1600);
  }

  function measureFit(){
    const maxWidth=Math.max(220,availableIdentityWidth());
    const naturalWidth=identity.scrollWidth;
    const scale=Math.min(1,maxWidth/naturalWidth);
    identity.style.setProperty('--fit-scale',String(scale));
    return scale;
  }

  function setIdentityTransform(y=currentY,extraScale=1){
    currentY=y;
    const fit=Number(identity.style.getPropertyValue('--fit-scale'))||1;
    identity.style.transform=`translateY(${y}px) scale(${fit*extraScale})`;
  }

  function syncRuleWidth(){
    const rect=identity.getBoundingClientRect();
    identityRule.style.width=`${Math.round(rect.width)}px`;
  }

  function refit(y=currentY){
    measureFit();
    setIdentityTransform(y);
    syncRuleWidth();
  }

  async function playIdentity(){
    if(reducedMotion){
      ySlot.style.width='.56em';
      ySlot.style.opacity='1';
      identity.style.opacity='1';
      identity.style.filter='none';
      identityReveal.style.transform='none';
      identityRule.style.opacity='1';
      identityRule.style.transform='scaleX(1)';
      role.querySelectorAll('.role-char').forEach(char=>{char.style.opacity='1';char.style.transform='none';char.style.filter='none';});
      refit(0);
      identityWrap.style.transform='none';
      finalReady=true;
      startScrollHintBounce();
      return;
    }

    // 00. Particle cloud lives alone for a short beat.
    introCloud.mode='hold';
    await sleep(220);

    // 01. Cloud condenses into a dotted SOUL silhouette.
    introCloud.mode='morph';
    introCloud.started=performance.now();
    await sleep(520);

    // 02. Real SOUL replaces the dotted silhouette with a softer materialization.
    refit(18);
    identity.style.opacity='.1';
    identity.style.filter='blur(12px)';
    setIdentityTransform(10,.988);
    await sleep(24);
    transition(identity,['opacity','transform','filter'],520,'cubic-bezier(.16,1,.3,1)');
    identity.style.opacity='1';
    identity.style.filter='blur(0px)';
    setIdentityTransform(0,1);
    introCloud.mode='fade';
    introCloud.started=performance.now();
    await sleep(460);

    // ------------------------------------------------------------------
    // The auto-played part ends here, with SOUL on screen. Everything that
    // follows — the Y going in, the rule, the role line, the exit — is
    // scrubbed by scrubIdentity() from the scroll position instead of being
    // played on a timer. A timed intro plays whether or not anyone is
    // watching, so the details in its tail were never actually seen; tying
    // them to scroll means they cannot be missed, because the visitor is the
    // one advancing them.
    finalReady=true;
    startScrollHintBounce();
    updateHeroScroll();
  }

  // Scrub helpers. Kept local and tiny — this is the only place that needs them.
  const clamp01=v=>v<0?0:v>1?1:v;
  const seg=(p,a,b)=>clamp01((p-a)/(b-a));
  const easeOut=t=>1-Math.pow(1-t,3);
  const smooth=t=>t*t*(3-2*t);
  const lerp=(a,b,t)=>a+(b-a)*t;
  let roleChars=[...role.querySelectorAll('.role-char')];
  let lastSpin=0;
  let liftY=0;
  // Measured on first entry into the landing band, cleared on resize.
  let landing=null;

  // Where the big SOYUL has to end up: exactly on top of the header logo, so
  // the handoff between the two is invisible. Measured rather than guessed —
  // any hardcoded offset drifts the moment a padding or font size changes.
  function measureLanding(){
    const idRect=identity.getBoundingClientRect();
    const lgRect=siteLogo.getBoundingClientRect();
    if(!idRect.height||!lgRect.height) return null;
    // While hidden the header sits one header-height above its resting place.
    const offY=siteHeader.classList.contains('is-visible')?0:siteHeader.offsetHeight;
    const wrapRect=identityWrap.getBoundingClientRect();
    return {
      // Scale about SOYUL's own centre, not the full-width wrapper's.
      ox:idRect.left+idRect.width/2-wrapRect.left,
      oy:idRect.top+idRect.height/2-wrapRect.top,
      scale:lgRect.height/idRect.height,
      dx:(lgRect.left+lgRect.width/2)-(idRect.left+idRect.width/2),
      dy:(lgRect.top+offY+lgRect.height/2)-(idRect.top+idRect.height/2)
    };
  }

  // t: 0 while the finished name rests, 1 once it has docked into the header.
  // The name does not go into the black hole — only the void does. It survives
  // as the site logo, so the visitor never loses the name they came to read.
  function scrubLanding(t){
    if(reducedMotion||!finalReady) return;
    if(t<=0){
      identityWrap.style.transform=`translateY(${liftY.toFixed(2)}px)`;
      identityWrap.style.opacity='1';
      identityReveal.style.opacity='1';
      siteHeader.classList.add('is-logo-hidden');
      return;
    }
    if(!landing) landing=measureLanding();
    if(!landing) return;
    identityWrap.style.transformOrigin=
      `${landing.ox.toFixed(1)}px ${landing.oy.toFixed(1)}px`;
    identityWrap.style.transform=
      `translate(${(landing.dx*t).toFixed(2)}px,${(liftY+landing.dy*t).toFixed(2)}px) `+
      `scale(${lerp(1,landing.scale,t).toFixed(4)})`;
    // The rule and the role line are not part of the logo, so they go first.
    identityReveal.style.opacity=Math.max(0,1-t*2.4).toFixed(3);
    // Cross-fade to the real header logo over the last sliver, once the two
    // are the same size in the same place.
    const handoff=seg(t,.94,1);
    identityWrap.style.opacity=(1-handoff).toFixed(3);
    siteHeader.classList.toggle('is-logo-hidden',handoff<1);
  }

  // p is 0 at the top of the page and 1 when the hero has fully handed over.
  function scrubIdentity(p){
    if(reducedMotion||!finalReady) return;

    // 01. SO and UL part to open a slot for the real Y.
    const sep=easeOut(seg(p,0,.18));
    // 03. …and close back up once the Y is in place.
    const settle=easeOut(seg(p,.36,.45));
    const gap=lerp(lerp(0,-.12,sep),-.015,settle);
    wordLeft.style.transform=`translateX(${gap.toFixed(4)}em)`;
    wordRight.style.transform=`translateX(${(-gap).toFixed(4)}em)`;
    ySlot.style.width=`${(.56*sep).toFixed(4)}em`;
    ySlot.style.opacity=sep.toFixed(3);

    // 02. The stem appears, then makes one sideways revolution while the
    //     glyph unclips from a bare vertical into the whole letter.
    const spin=seg(p,.15,.36);
    yGlyph.style.opacity=spin>0?'1':'0';
    yGlyph.style.transform=
      `translate(-50%,-50%) rotateY(${(360*easeOut(spin)).toFixed(2)}deg)`;
    // Both ends written as polygons so every coordinate interpolates; a
    // polygon-to-inset transition has nothing to interpolate between.
    const o=easeOut(seg(p,.22,.36));
    const x1=lerp(46,0,o),x2=lerp(54,100,o),y1=lerp(49,0,o);
    yGlyph.style.clipPath=
      `polygon(${x1.toFixed(2)}% ${y1.toFixed(2)}%,${x2.toFixed(2)}% ${y1.toFixed(2)}%,`+
      `${x2.toFixed(2)}% 100%,${x1.toFixed(2)}% 100%)`;
    // One pulse through the particle field as the letter lands, not on a loop.
    if(spin>=1&&lastSpin<1) burstPulse(.62);
    lastSpin=spin;

    // 04. SOYUL, the rule and the role line rise together as one block.
    const lift=smooth(seg(p,.42,.58));
    liftY=-(innerWidth<720?72:70)*lift;
    identityReveal.style.transform=`translateY(${(20*(1-lift)).toFixed(2)}px)`;
    identityRule.style.opacity=lift.toFixed(3);
    identityRule.style.transform=`scaleX(${lift.toFixed(4)})`;

    // The role line keeps its character wave, spread across the same band.
    for(let i=0;i<roleChars.length;i++){
      const t=easeOut(seg(p,.46+i*.0035,.55+i*.0035));
      const c=roleChars[i];
      c.style.opacity=t.toFixed(3);
      c.style.transform=`translateY(${(9*(1-t)).toFixed(2)}px) rotateX(${(-24*(1-t)).toFixed(2)}deg)`;
      c.style.filter=t>=1?'none':`blur(${(4*(1-t)).toFixed(2)}px)`;
    }
  }



  let w=0,h=0,dpr=1,raf=0,particles=[],pulse=0,pulsePower=0;
  // 0 while the hero is at rest, 1 when it has fully collapsed. Drives the
  // inward acceleration of the field so the exit reads as a pull, not a fade.
  let scrollPull=0;
  const pointer={x:-9999,y:-9999,active:false};

  // Intro cloud particles are separate from the ambient field so the hero can
  // have a strong opening moment without keeping a heavy effect throughout.
  const introCloud={particles:[],targets:[],mode:'hold',started:0,alpha:1};

  function particleCount(){if(innerWidth<480)return 260;if(innerWidth<768)return 420;if(innerWidth<1200)return 720;return 1100}
  function introCount(){if(innerWidth<480)return 220;if(innerWidth<768)return 340;if(innerWidth<1200)return 520;return 760}

  function resize(){
    const rect=hero.getBoundingClientRect();
    w=rect.width;h=rect.height;dpr=Math.min(devicePixelRatio||1,2);
    canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);
    canvas.style.width=`${w}px`;canvas.style.height=`${h}px`;
    ctx.setTransform(dpr,0,0,dpr,0,0);
    landing=null;
    createParticles();
    createIntroCloud();
    refit(currentY);
    heroSpacer.style.height=`${Math.round(hero.offsetHeight*HERO_SPAN)}px`;
  }

  function createParticles(){
    particles=Array.from({length:particleCount()},()=>{
      const x=Math.random()*w,y=Math.random()*h;
      return{ox:x,oy:y,x,y,vx:0,vy:0,size:Math.random()*1.15+.55,alpha:Math.random()*.28+.10,drift:Math.random()*Math.PI*2};
    });
  }

  function makeSoulTargets(count){
    const off=document.createElement('canvas');
    const ow=Math.max(640,Math.round(Math.min(w*.72,1180)));
    const oh=Math.max(220,Math.round(Math.min(h*.34,400)));
    off.width=ow;off.height=oh;
    const oc=off.getContext('2d');
    const computed=getComputedStyle(identity);
    const fontFamily=computed.fontFamily || 'Arial, sans-serif';
    const fontWeight=computed.fontWeight || '600';
    let fs=Math.min(oh*.72,ow*.21);
    oc.font=`${fontWeight} ${fs}px ${fontFamily}`;
    oc.textAlign='center';oc.textBaseline='middle';oc.fillStyle='#fff';
    oc.fillText('SOUL',ow/2,oh/2);
    const data=oc.getImageData(0,0,ow,oh).data;
    const candidates=[];
    const step=Math.max(3,Math.floor(Math.sqrt((ow*oh)/(count*10))));
    for(let y=0;y<oh;y+=step){
      for(let x=0;x<ow;x+=step){
        if(data[(y*ow+x)*4+3]>80)candidates.push({x,y});
      }
    }
    const scale=Math.min(1,(availableIdentityWidth()*.92)/ow);
    const left=w/2-(ow*scale)/2,top=h/2-(oh*scale)/2;
    const out=[];
    if(!candidates.length){
      for(let i=0;i<count;i++)out.push({x:w/2+(Math.random()-.5)*w*.3,y:h/2+(Math.random()-.5)*h*.12});
      return out;
    }
    for(let i=0;i<count;i++){
      const c=candidates[Math.floor(Math.random()*candidates.length)];
      out.push({x:left+c.x*scale,y:top+c.y*scale});
    }
    return out;
  }

  function createIntroCloud(){
    const count=introCount();
    const cx=w/2,cy=h/2;
    const halfW=Math.min(w*.17,260),halfH=Math.min(h*.11,110);
    introCloud.targets=makeSoulTargets(count);
    introCloud.particles=Array.from({length:count},(_,i)=>{
      // Start from a rectangular/square cloud instead of an oval so the first
      // impression feels more structured and less organic.
      const x=cx+(Math.random()*2-1)*halfW+(Math.random()-.5)*8;
      const y=cy+(Math.random()*2-1)*halfH+(Math.random()-.5)*8;
      return{x,y,sx:x,sy:y,tx:introCloud.targets[i].x,ty:introCloud.targets[i].y,size:Math.random()*1.15+.55,alpha:Math.random()*.45+.45,phase:Math.random()*Math.PI*2};
    });
    introCloud.alpha=1;
  }

  function burstPulse(power=1){pulse=1;pulsePower=power}
  function easeOutCubic(t){return 1-Math.pow(1-t,3)}
  function easeInOut(t){return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2}

  function drawIntroCloud(now){
    if(!introCloud.particles.length||introCloud.alpha<=.005)return;
    let progress=0;
    if(introCloud.mode==='morph')progress=Math.min(1,(now-introCloud.started)/760);
    if(introCloud.mode==='fade'){
      const f=Math.min(1,(now-introCloud.started)/700);
      progress=1;
      introCloud.alpha=1-easeOutCubic(f);
    }
    const morph=easeInOut(progress);
    const centerX=w/2,centerY=h/2;
    for(const p of introCloud.particles){
      p.phase+=.02;
      let x=p.sx+(p.tx-p.sx)*morph;
      let y=p.sy+(p.ty-p.sy)*morph;
      const jitter=(1-morph)*2.4;
      x+=Math.cos(p.phase)*jitter;y+=Math.sin(p.phase*.83)*jitter;

      // Mouse repulsion works even during the opening cloud state.
      if(pointer.active){
        const dx=x-pointer.x,dy=y-pointer.y,dist=Math.hypot(dx,dy),radius=innerWidth<720?120:170;
        if(dist<radius&&dist>.01){const f=(1-dist/radius)*26;x+=(dx/dist)*f;y+=(dy/dist)*f;}
      }
      // Keep the cloud gently alive before it morphs.
      if(introCloud.mode==='hold'){
        const dx=x-centerX,dy=y-centerY;
        x+=Math.sin(now*.0012+p.phase)*1.1+(dx/(Math.max(1,Math.abs(dx))))*.15;
        y+=Math.cos(now*.001+p.phase)*.8+(dy/(Math.max(1,Math.abs(dy))))*.08;
      }
      ctx.beginPath();ctx.arc(x,y,p.size,0,Math.PI*2);
      ctx.fillStyle=`rgba(250,250,248,${p.alpha*introCloud.alpha})`;ctx.fill();
    }
  }

  function animate(now=performance.now()){
    ctx.clearRect(0,0,w,h);const cx=w/2,cy=h/2;pulse*=.91;
    for(const p of particles){
      p.drift+=.0042;let fx=(p.ox-p.x)*.0085,fy=(p.oy-p.y)*.0085;
      if(pointer.active){
        const dx=p.x-pointer.x,dy=p.y-pointer.y,dist=Math.hypot(dx,dy),radius=innerWidth<720?125:185;
        if(dist<radius&&dist>.01){const force=(1-dist/radius)*2.6;fx+=(dx/dist)*force;fy+=(dy/dist)*force}
      }
      if(pulse>.01){
        const dx=p.x-cx,dy=p.y-cy,dist=Math.hypot(dx,dy)||1,local=Math.max(0,1-dist/Math.max(w,h)*2.1);
        fx+=(dx/dist)*pulse*pulsePower*local*.8;fy+=(dy/dist)*pulse*pulsePower*local*.8;
      }
      if(scrollPull>.001){
        const gx=cx-p.x,gy=cy-p.y,gd=Math.hypot(gx,gy)||1;
        // Squared so the field barely stirs early and rushes at the end.
        const g=scrollPull*scrollPull*1.15;
        fx+=(gx/gd)*g;fy+=(gy/gd)*g;
      }
      // Less damping under pull, so they visibly gain speed on the way in.
      const damp=.935+scrollPull*.05;
      p.vx=(p.vx+fx)*damp;p.vy=(p.vy+fy)*damp;p.x+=p.vx+Math.cos(p.drift)*.035;p.y+=p.vy+Math.sin(p.drift*.82)*.03;
      ctx.beginPath();ctx.arc(p.x,p.y,p.size,0,Math.PI*2);ctx.fillStyle=`rgba(250,250,248,${p.alpha})`;ctx.fill();
    }
    drawIntroCloud(now);
    raf=requestAnimationFrame(animate);
  }

  function startParticles(){
    if(reducedMotion||raf) return;
    raf=requestAnimationFrame(animate);
  }
  function stopParticles(){
    if(!raf) return;
    cancelAnimationFrame(raf);
    raf=0;
  }

  hero.addEventListener('pointermove',e=>{const r=hero.getBoundingClientRect();pointer.x=e.clientX-r.left;pointer.y=e.clientY-r.top;pointer.active=true});
  hero.addEventListener('pointerleave',()=>pointer.active=false);

  // Scroll-linked "black hole" exit: as the work section rises to cover the
  // pinned hero, the identity group shrinks/blurs/fades toward its own
  // center instead of just being clipped by the section edge.
  let heroScrollTicking=false,lastP=-1,heroHidden=false;
  function updateHeroScroll(){
    heroScrollTicking=false;
    if(reducedMotion)return;
    // The hero is fixed, so the WORK sheet starts covering it the moment the
    // spacer has less than one viewport left — not at the end of the spacer.
    // That boundary, not the raw scroll fraction, is what splits the hero into
    // its two phases, and deriving it keeps the split correct at any --hero-span.
    const vh=innerHeight||1;
    const uncovered=Math.max(1,heroSpacer.offsetHeight-vh);
    // Phase A — the hero owns the whole screen: assemble, then hold still.
    const p=clamp01(scrollY/uncovered);
    // Phase B — WORK is sliding up over the hero: the void collapses and the
    // name docks into the header instead of collapsing with it.
    const pB=clamp01((scrollY-uncovered)/vh);

    // Skip redundant writes — the wheel fires far more often than the value
    // meaningfully changes. p===1 and p===0 always get through, because those
    // are the two frames that have to land exactly.
    const key=p+pB;
    if(key>0&&key<2&&Math.abs(key-lastP)<0.0015) return;
    lastP=key;

    // Assembles over the first .58 of phase A, then holds, fully assembled and
    // dead still, on an uncovered screen until phase A ends. That stillness is
    // the whole point: the visitor came here to read this name.
    scrubIdentity(p);

    const eased=smooth(pB);
    scrollPull=eased;
    scrubLanding(eased);

    // The void collapses; the name does not go with it. The particle field is
    // dragged into the centre by scrollPull inside animate().
    canvas.style.opacity=(1-eased).toFixed(3);
    heroMeta.style.opacity=Math.max(0,1-eased*2.4).toFixed(3);
    // Only the last tenth fades the hero plate itself, and only after the name
    // has docked — any earlier and the docking would fade out mid-flight.
    hero.style.opacity=String(Math.max(0,1-Math.max(0,(eased-.9)/.1)));

    // Once WORK fully covers the hero it stays covered for the rest of the
    // page, so drop it out of the paint pipeline and stop the particle loop.
    // This runs last: hiding before the writes above would freeze the docking
    // one frame short of the header.
    const shouldHide=pB>=1;
    if(shouldHide!==heroHidden){
      heroHidden=shouldHide;
      hero.style.visibility=shouldHide?'hidden':'';
      if(shouldHide) stopParticles(); else startParticles();
    }
  }
  function onHeroScroll(){
    if(!heroScrollTicking){heroScrollTicking=true;requestAnimationFrame(updateHeroScroll);}
  }
  addEventListener('scroll',onHeroScroll,{passive:true});

  addEventListener('resize',resize,{passive:true});
  resize();
  if(!reducedMotion) startParticles();
  playIdentity();
  updateHeroScroll();
  addEventListener('pagehide',stopParticles,{once:true});
})();
