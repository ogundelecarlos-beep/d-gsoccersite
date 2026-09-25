(function(){
  "use strict";
  document.documentElement.classList.add('js');
  setTimeout(function(){ if(!window.__dgReady){ document.documentElement.classList.add('rescue'); } }, 4500);
  var RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var FINE = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- PRELOADER ---------- */
  var pre = document.getElementById('preloader');
  var preLogo = document.getElementById('pre-logo');
  'D&GSOCCER'.split('').forEach(function(c,i){
    var s = document.createElement('i');
    s.textContent = c === ' ' ? ' ' : c;
    s.style.animationDelay = (0.05 + i*0.05) + 's';
    if(i >= 3) s.style.color = '#e2c057';
    preLogo.appendChild(s);
  });
  document.body.classList.add('is-loading');
  function killPreloader(){
    pre.classList.add('done');
    document.body.classList.remove('is-loading');
    setTimeout(function(){ pre.classList.add('hidden'); }, 1600);
    startHero();
  }
  setTimeout(killPreloader, RM ? 200 : 1750);

  /* ---------- SPLIT TEXT ---------- */
  function splitNode(node){
    var walk = [];
    (function rec(n){
      Array.prototype.slice.call(n.childNodes).forEach(function(c){
        if(c.nodeType === 3) walk.push(c); else if(c.nodeType === 1) rec(c);
      });
    })(node);
    var idx = 0;
    walk.forEach(function(textNode){
      var frag = document.createDocumentFragment();
      textNode.nodeValue.split(/(\s+)/).forEach(function(word){
        if(!word) return;
        if(/^\s+$/.test(word)){ frag.appendChild(document.createTextNode(' ')); return; }
        var wrap = document.createElement('span');
        wrap.className = 'word';
        word.split('').forEach(function(ch){
          var sp = document.createElement('span');
          sp.className = 'ch';
          sp.textContent = ch;
          sp.style.transitionDelay = (idx * 0.016) + 's';
          idx++;
          wrap.appendChild(sp);
        });
        frag.appendChild(wrap);
      });
      textNode.parentNode.replaceChild(frag, textNode);
    });
  }
  var h1 = document.getElementById('h1');
  if(!RM){
    splitNode(h1);
    document.querySelectorAll('.split').forEach(splitNode);
  }
  function startHero(){
    h1.classList.add('in');
    document.querySelectorAll('.hero .rv').forEach(function(el,i){
      setTimeout(function(){ el.classList.add('in'); }, 220 + i*110);
    });
  }

  /* ---------- REVEAL ON SCROLL ---------- */
  var io = new IntersectionObserver(function(en){
    en.forEach(function(e){
      if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, {threshold:.16, rootMargin:'0px 0px -6% 0px'});
  document.querySelectorAll('.rv, .stg, .split').forEach(function(el){
    if(el.closest('.hero')) return;
    io.observe(el);
  });

  /* ---------- HEADER + NAV ---------- */
  var hdr = document.getElementById('hdr');
  var nav = document.getElementById('nav');
  var burger = document.getElementById('burger');
  var links = Array.prototype.slice.call(nav.querySelectorAll('a'));
  var targets = links.map(function(a){ return document.querySelector(a.getAttribute('href')); });
  burger.addEventListener('click', function(){
    var open = nav.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  links.forEach(function(a){ a.addEventListener('click', function(){
    nav.classList.remove('open'); burger.classList.remove('open');
  }); });

  var navIo = new IntersectionObserver(function(en){
    en.forEach(function(e){
      var i = targets.indexOf(e.target);
      if(e.isIntersecting && i > -1){
        links.forEach(function(l){ l.classList.remove('active'); });
        links[i].classList.add('active');
      }
    });
  }, {threshold:.25, rootMargin:'-80px 0px -55% 0px'});
  targets.forEach(function(t){ if(t) navIo.observe(t); });

  /* ---------- SCROLL DRIVEN ---------- */
  var pendingCounts = null;
  function checkCounters(){
    if(!pendingCounts || !pendingCounts.length) return;
    for(var i = pendingCounts.length - 1; i >= 0; i--){
      var el = pendingCounts[i], r = el.getBoundingClientRect();
      if(r.bottom < 0){
        el.textContent = el.dataset.to + (el.dataset.suf || '');
        pendingCounts.splice(i, 1);
      } else if(r.top < window.innerHeight * .88 && r.bottom > 0){
        count(el);
        pendingCounts.splice(i, 1);
      }
    }
  }
  var bar = document.getElementById('progress');
  var floatBtn = document.getElementById('float');
  var heroEl = document.getElementById('hero');
  var stepsEl = document.getElementById('steps');
  var pars = Array.prototype.slice.call(document.querySelectorAll('[data-par]'));
  var ticking = false;
  function onScroll(){
    if(ticking) return;
    ticking = true;
    requestAnimationFrame(function(){
      var y = window.scrollY;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
      hdr.classList.toggle('stuck', y > 24);
      floatBtn.classList.toggle('show', y > window.innerHeight * .75);

      if(!RM){
        pars.forEach(function(el){
          var r = el.getBoundingClientRect();
          if(r.bottom > -200 && r.top < window.innerHeight + 200){
            el.style.transform = 'translateY(' + ((window.innerHeight - r.top) * parseFloat(el.dataset.par)) + 'px)';
          }
        });
        var hr = heroEl.getBoundingClientRect();
        if(hr.bottom > 0){
          var vis = heroEl.querySelector('.hero-visual');
          if(vis) vis.style.transform = 'translateY(' + (y * .07) + 'px)';
        }
      }

      checkCounters();

      if(stepsEl){
        var sr = stepsEl.getBoundingClientRect();
        var p = Math.max(0, Math.min(1, (window.innerHeight * .78 - sr.top) / (sr.height * .8)));
        stepsEl.style.setProperty('--p', p.toFixed(3));
        var sts = stepsEl.querySelectorAll('.step');
        sts.forEach(function(s,i){ s.classList.toggle('lit', p > (i / sts.length) * .92); });
      }
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  /* ---------- COUNTERS ---------- */
  function count(el){
    var to = parseFloat(el.dataset.to), suf = el.dataset.suf || '', t0 = null, dur = 1500;
    function step(ts){
      if(!t0) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * to) + suf;
      if(p < 1) requestAnimationFrame(step); else el.textContent = to + suf;
    }
    requestAnimationFrame(step);
  }
  pendingCounts = Array.prototype.slice.call(document.querySelectorAll('[data-to]'));
  checkCounters();

  /* ---------- CURSOR ---------- */
  if(FINE && !RM){
    var cur = document.getElementById('cursor'), dot = document.getElementById('cursor-dot');
    var lbl = cur.querySelector('.lbl'), spot = document.getElementById('spot');
    var cx = innerWidth/2, cy = innerHeight/2, rx = cx, ry = cy, raf = false;
    document.addEventListener('mousemove', function(e){
      cx = e.clientX; cy = e.clientY;
      dot.style.transform = 'translate(' + cx + 'px,' + cy + 'px)';
      cur.classList.add('ready'); dot.classList.add('ready');
      if(!raf){
        raf = true;
        requestAnimationFrame(function(){
          spot.style.setProperty('--cx', (cx / innerWidth * 100) + '%');
          spot.style.setProperty('--cy', (cy / innerHeight * 100) + '%');
          raf = false;
        });
      }
    }, {passive:true});
    (function loop(){
      rx += (cx - rx) * .16; ry += (cy - ry) * .16;
      cur.style.transform = 'translate(' + rx + 'px,' + ry + 'px)';
      requestAnimationFrame(loop);
    })();
    document.querySelectorAll('a, button, .card, .prof, .vid').forEach(function(el){
      el.addEventListener('mouseenter', function(){
        cur.classList.add('grow');
        lbl.textContent = el.dataset.cursor || '';
      });
      el.addEventListener('mouseleave', function(){
        cur.classList.remove('grow'); lbl.textContent = '';
      });
    });
  }

  /* ---------- MAGNETIC BUTTONS + RIPPLE + CARD GLOW ---------- */
  if(FINE && !RM){
    document.querySelectorAll('.mag').forEach(function(el){
      el.addEventListener('mousemove', function(e){
        var r = el.getBoundingClientRect();
        var mx = e.clientX - r.left - r.width/2, my = e.clientY - r.top - r.height/2;
        el.style.transform = 'translate(' + (mx*.22) + 'px,' + (my*.32) + 'px)';
      });
      el.addEventListener('mouseleave', function(){ el.style.transform = ''; });
    });
    document.querySelectorAll('.glow').forEach(function(el){
      el.addEventListener('mousemove', function(e){
        var r = el.getBoundingClientRect();
        el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        el.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
    document.querySelectorAll('.tilt').forEach(function(el){
      el.addEventListener('mousemove', function(e){
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left)/r.width - .5, py = (e.clientY - r.top)/r.height - .5;
        el.style.transform = 'perspective(900px) rotateX(' + (py*-5) + 'deg) rotateY(' + (px*5) + 'deg) translateY(-6px)';
      });
      el.addEventListener('mouseleave', function(){ el.style.transform = ''; });
    });
  }
  document.querySelectorAll('.btn, .nav-cta').forEach(function(b){
    b.addEventListener('click', function(e){
      var r = b.getBoundingClientRect(), s = Math.max(r.width, r.height);
      var rp = document.createElement('span');
      rp.className = 'ripple';
      rp.style.width = rp.style.height = s + 'px';
      rp.style.left = (e.clientX - r.left - s/2) + 'px';
      rp.style.top = (e.clientY - r.top - s/2) + 'px';
      b.appendChild(rp);
      setTimeout(function(){ rp.remove(); }, 660);
    });
  });

  /* ---------- TABS (metodologia) ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tab'));
  var panes = Array.prototype.slice.call(document.querySelectorAll('.pane'));
  function setTab(i){
    tabs.forEach(function(t,j){ t.classList.toggle('on', i===j); t.setAttribute('aria-selected', i===j ? 'true':'false'); });
    panes.forEach(function(p,j){ p.classList.toggle('on', i===j); });
  }
  tabs.forEach(function(t,i){
    t.addEventListener('click', function(){ setTab(i); });
    t.addEventListener('mouseenter', function(){ if(FINE) setTab(i); });
  });

  /* ---------- FAQ ---------- */
  document.querySelectorAll('.faq-i').forEach(function(item){
    var q = item.querySelector('.faq-q'), w = item.querySelector('.faq-a-w');
    if(item.classList.contains('open')) w.style.maxHeight = w.scrollHeight + 'px';
    q.addEventListener('click', function(){
      var open = item.classList.contains('open');
      document.querySelectorAll('.faq-i.open').forEach(function(o){
        if(o !== item){ o.classList.remove('open'); o.querySelector('.faq-a-w').style.maxHeight = null; }
      });
      item.classList.toggle('open', !open);
      w.style.maxHeight = open ? null : w.scrollHeight + 'px';
    });
  });

  /* ---------- RAIL (drag + arrows) ---------- */
  var rail = document.getElementById('rail');
  if(rail){
    var down = false, sx = 0, sl = 0, moved = 0;
    rail.addEventListener('pointerdown', function(e){
      down = true; moved = 0; sx = e.clientX; sl = rail.scrollLeft;
      rail.classList.add('drag');
    });
    window.addEventListener('pointerup', function(){
      down = false; rail.classList.remove('drag');
    });
    rail.addEventListener('pointermove', function(e){
      if(!down) return;
      var d = e.clientX - sx;
      moved = Math.abs(d);
      rail.scrollLeft = sl - d;
      if(moved > 6) e.preventDefault();
    });
    rail.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(e){ if(moved > 8) e.preventDefault(); });
    });
    function step(dir){
      var card = rail.querySelector('.vid');
      var w = card ? card.getBoundingClientRect().width + 18 : 260;
      rail.scrollBy({left: dir * w, behavior: 'smooth'});
    }
    document.getElementById('prev').addEventListener('click', function(){ step(-1); });
    document.getElementById('next').addEventListener('click', function(){ step(1); });
  }

  /* ---------- HERO CANVAS ---------- */
  var cv = document.getElementById('fx');
  if(cv && !RM){
    var ctx = cv.getContext('2d'), W = 0, H = 0, parts = [], run = true;
    function size(){
      var d = Math.min(window.devicePixelRatio || 1, 2);
      W = cv.width = cv.offsetWidth * d;
      H = cv.height = cv.offsetHeight * d;
      ctx.setTransform(d,0,0,d,0,0);
      parts = [];
      var n = Math.min(46, Math.round(cv.offsetWidth / 26));
      for(var i=0;i<n;i++){
        parts.push({
          x: Math.random() * cv.offsetWidth,
          y: Math.random() * cv.offsetHeight,
          r: Math.random() * 1.7 + .5,
          vy: -(Math.random() * .28 + .07),
          vx: (Math.random() - .5) * .12,
          a: Math.random() * .5 + .12
        });
      }
    }
    function draw(){
      if(!run) return;
      ctx.clearRect(0,0,cv.offsetWidth,cv.offsetHeight);
      for(var i=0;i<parts.length;i++){
        var p = parts[i];
        p.y += p.vy; p.x += p.vx;
        if(p.y < -10){ p.y = cv.offsetHeight + 10; p.x = Math.random() * cv.offsetWidth; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, 6.283);
        ctx.fillStyle = 'rgba(224,189,74,' + p.a + ')';
        ctx.shadowBlur = 8; ctx.shadowColor = 'rgba(201,162,39,.7)';
        ctx.fill();
      }
      requestAnimationFrame(draw);
    }
    size(); draw();
    window.addEventListener('resize', size);
    new IntersectionObserver(function(en){
      en.forEach(function(e){
        run = e.isIntersecting;
        if(run) draw();
      });
    }, {threshold:0}).observe(cv);
  }

  window.__dgReady = true;
})();
