// ================================================================
// particles.js -- IMJR-WEB Botanical Ambient Particles
// OSTP @echoShift  |  Pipeline: Leviatan
// ================================================================
'use strict';
(function () {
  const PALETTE = [[122,171,136],[196,162,90],[61,107,79],[232,213,163],[160,200,168]];
  const COUNT = 32;
  let canvas, ctx, W, H, parts = [], raf = null, active = false;

  function resize() { if(canvas){ W=canvas.width=window.innerWidth; H=canvas.height=window.innerHeight; } }
  function rand(a,b){ return a+Math.random()*(b-a); }
  function Particle(){ this.spawn(true); }
  Particle.prototype.spawn=function(scatter){
    this.x=rand(0,W); this.y=scatter?rand(0,H):H+rand(10,40);
    this.rx=rand(2,6); this.ry=this.rx*rand(1.8,3.2);
    this.rot=rand(0,Math.PI*2); this.vx=rand(-0.3,0.3); this.vy=-(0.28+rand(0,0.3));
    this.vrot=rand(-0.008,0.008); this.wb=rand(0,Math.PI*2); this.wbs=rand(0.006,0.016);
    this.maxA=rand(0.06,0.18); this.age=scatter?rand(0,1):0; this.life=rand(0.5,1.2);
    const c=PALETTE[Math.floor(rand(0,PALETTE.length))];
    this.r=c[0]; this.g=c[1]; this.b=c[2];
  };
  Particle.prototype.step=function(){
    this.wb+=this.wbs; this.x+=this.vx+Math.sin(this.wb)*0.25; this.y+=this.vy;
    this.rot+=this.vrot; this.age+=0.004;
    if(this.y<-30||this.age>this.life) this.spawn(false);
  };
  Particle.prototype.draw=function(){
    const t=this.age/this.life; const env=t<0.15?t/0.15:t>0.8?(1-t)/0.2:1;
    const a=env*this.maxA; if(a<=0.005) return;
    ctx.save(); ctx.translate(this.x,this.y); ctx.rotate(this.rot);
    ctx.beginPath(); ctx.ellipse(0,0,this.rx,this.ry,0,0,Math.PI*2);
    ctx.fillStyle='rgba('+this.r+','+this.g+','+this.b+','+a.toFixed(3)+')';
    ctx.fill(); ctx.restore();
  };
  function init(){
    canvas=document.getElementById('vz-particles'); if(!canvas) return;
    ctx=canvas.getContext('2d'); resize();
    parts=Array.from({length:COUNT},()=>new Particle());
    window.addEventListener('resize',resize);
    watchState();
  }
  function loop(){ ctx.clearRect(0,0,W,H); parts.forEach(p=>{p.step();p.draw();}); raf=requestAnimationFrame(loop); }
  function start(){ if(!raf){ active=true; loop(); } }
  function stop(){ if(raf){ cancelAnimationFrame(raf); raf=null; active=false; } if(ctx) ctx.clearRect(0,0,W,H); }
  function watchState(){
    const body=document.body;
    const obs=new MutationObserver(()=>{ body.classList.contains('state-fan')?start():stop(); });
    obs.observe(body,{attributes:true,attributeFilter:['class']});
  }
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
})();
