(function(){
  var $=function(id){return document.getElementById(id)};
  var d=new Date();
  function two(n){return n<10?"0"+n:""+n}
  function key(y,m,dd){return y+"-"+two(m+1)+"-"+two(dd)}

  /* stars */
  var c=$("stars"),x=c.getContext("2d"),S=[],still=matchMedia("(prefers-reduced-motion:reduce)").matches;
  function size(){c.width=innerWidth;c.height=innerHeight}
  size();addEventListener("resize",size);
  for(var i=0;i<70;i++)S.push({x:Math.random(),y:Math.random(),r:Math.random()*1.6+.4,s:Math.random()*.00006+.00002,p:Math.random()*6,red:Math.random()<.3});
  function draw(t){
    x.clearRect(0,0,c.width,c.height);
    S.forEach(function(s){
      if(!still){s.y-=s.s*16;if(s.y<0)s.y=1}
      var a=.35+.4*Math.sin(t/1200+s.p);
      x.beginPath();x.arc(s.x*c.width,s.y*c.height,s.r,0,6.283);
      x.fillStyle=s.red?"rgba(255,70,80,"+a+")":"rgba(255,240,240,"+a*.8+")";
      x.shadowColor=s.red?"#ff2a36":"#fff";x.shadowBlur=8;x.fill();
    });
    if(!still)requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);

  /* daily reminder */
  var lines=["Khaos reminds me to release.","Nyx reminds me to look within.","Eos reminds me to welcome the dawn.","Bennu reminds me that I can rise again."];
  var day=Math.floor((d-new Date(d.getFullYear(),0,0))/864e5);
  if($("remind"))$("remind").textContent=lines[day%4];
  if($("today"))$("today").textContent=d.toLocaleDateString(undefined,{weekday:"long",month:"long",day:"numeric"});

  /* data-driven bits: calendar, up next, inbox */
  var needs=$("cal")||$("upnext")||$("question");
  if(!needs)return;
  var y=d.getFullYear(),m=d.getMonth(),data={events:[],questions:[],news:[]};
  var sel=key(d.getFullYear(),d.getMonth(),d.getDate()),LK="zero-events";
  function lget(){try{return JSON.parse(localStorage.getItem(LK)||"[]")}catch(e){return[]}}
  function lset(a){try{localStorage.setItem(LK,JSON.stringify(a))}catch(e){}}
  function all(){return data.events.concat(lget().map(function(e){return{id:e.id,date:e.date,title:e.title,time:e.time,local:true}}))}
  function esc(s){var e=document.createElement("div");e.textContent=s;return e.innerHTML}
  function upnext(){
    var el=$("upnext");if(!el)return;
    var t=key(d.getFullYear(),d.getMonth(),d.getDate());
    var list=all().filter(function(e){return e.date>=t}).sort(function(a,b){return (a.date+(a.time||"")).localeCompare(b.date+(b.time||""))}).slice(0,5);
    if(!list.length)return;
    el.className="";
    el.innerHTML=list.map(function(e){return '<div class="upitem"><b>'+esc(e.title)+'</b><br><span class="muted">'+esc(e.date)+(e.time?" · "+esc(e.time):"")+'</span></div>'}).join("");
  }
  function dayview(){
    var box=$("daylist");if(!box)return;
    var p=sel.split("-"),dt=new Date(+p[0],+p[1]-1,+p[2]);
    $("daytitle").textContent=dt.toLocaleDateString(undefined,{weekday:"long",month:"long",day:"numeric"});
    var list=all().filter(function(e){return e.date===sel});
    if(!list.length){box.className="empty";box.textContent="Nothing on this day.";return}
    box.className="";
    box.innerHTML=list.map(function(e){return '<div class="upitem"><b>'+esc(e.title)+'</b>'+(e.time?'<br><span class="muted">'+esc(e.time)+'</span>':'')+(e.local?' <button type="button" class="rm" data-id="'+esc(e.id)+'" aria-label="Remove '+esc(e.title)+'">Remove</button>':'')+'</div>'}).join("");
    Array.prototype.forEach.call(box.querySelectorAll(".rm"),function(r){r.onclick=function(){lset(lget().filter(function(e){return e.id!==r.getAttribute("data-id")}));cal();upnext()}});
  }
  function cal(){
    var el=$("cal");if(!el)return;
    $("calt").textContent=new Date(y,m,1).toLocaleDateString(undefined,{month:"long",year:"numeric"});
    var first=new Date(y,m,1).getDay(),total=Math.ceil((first+new Date(y,m+1,0).getDate())/7)*7,tk=key(d.getFullYear(),d.getMonth(),d.getDate()),h="",list=all();
    ["S","M","T","W","T","F","S"].forEach(function(s){h+='<div class="dow">'+s+'</div>'});
    for(var i=0;i<total;i++){
      var dt=new Date(y,m,1-first+i),k=key(dt.getFullYear(),dt.getMonth(),dt.getDate());
      var ev=list.filter(function(e){return e.date===k}).map(function(e){return '<span class="ev">'+esc(e.title)+'</span>'}).join("");
      h+='<button type="button" class="day'+(dt.getMonth()!==m?" out":"")+(k===tk?" now":"")+(k===sel?" sel":"")+'" data-k="'+k+'" aria-pressed="'+(k===sel)+'" aria-label="'+dt.toDateString()+'">'+dt.getDate()+ev+'</button>';
    }
    el.innerHTML=h;
    Array.prototype.forEach.call(el.querySelectorAll(".day"),function(b){b.onclick=function(){
      sel=b.getAttribute("data-k");var p=sel.split("-");y=+p[0];m=+p[1]-1;cal();
      var s=el.querySelector(".day.sel");if(s)s.focus();
    }});
    dayview();
  }
  /* daily question generator: 500+ distinct questions, same one for everyone each day */
  var QPOOL=null;
  function buildPool(){
    var out=[],A=["begin","release","rebuild","forgive","try","say out loud","let go of","choose","protect","welcome","question","create","stop carrying","ask for","celebrate","start over with"],
    AC=["nobody was watching","you weren’t afraid of being wrong","you had a clean slate","you trusted the process","nobody needed you to explain","you had one more year","failure wasn’t possible","you already believed you were enough","you were braver than you feel","the old rules didn’t apply","you had the whole night to think","you knew it would work out","no one was keeping score","you weren’t worried about being judged","you could change your mind later","today was day one"],
    BN=["belief","habit","fear","rule","chapter","label","routine","expectation","version of you","story","promise","plan"],
    BP=["deserves a thank-you","is ready to rest","no longer fits","still has something to teach you","is holding you back","has been quietly changing","is worth keeping","is ready to be rewritten"],
    CT=["today","this week","before the month ends","before the next full moon","tomorrow morning","by this weekend"],
    CG=["welcome a new beginning","make room for something new","honor who you were","feel more like yourself","let the dawn in","rest without guilt","move toward what’s calling you","let go of something heavy","be kinder to yourself","try something unfamiliar","say yes to yourself","finish something you started","begin something you’ve been avoiding","feel proud of how far you’ve come"],
    EA=["surprise yourself","change your mind","do something for the first time","forgive yourself","feel completely like yourself","let someone see the real you","rest without guilt","start over","say no and mean it","laugh until it hurt","feel proud of yourself","ask for help","let go of something","feel truly free"],
    ET=["what did it teach you","what changed afterward","what did you need in that moment","how did it feel"],
    FS=["I’m ready to stop …","Something I’m still becoming is …","The version of me I’m leaving behind is …","I feel most like myself when …","The dawn I’m waiting for looks like …","One thing I’d tell my past self is …","I’m learning to let go of …","What I’m protecting right now is …","I used to believe …, but now …","The bravest thing I did this year was …","I’m grateful that I outgrew …","The next chapter feels like …","I keep coming back to …","What I need more of is …","What I need less of is …","I’m proud that I …","Tonight, I’m releasing …","In the quiet, I hear …","If I started from zero today, I would …","The part of me that’s still rising is …"],
    D=["Khaos asks: what are you ready to release?","Khaos asks: what could you begin if nothing was holding you?","Khaos asks: what ending are you avoiding?","Khaos asks: what would you do with infinite possibility?","Khaos asks: where could you use a little more empty space?","Khaos asks: what no longer serves you?","Khaos asks: what are you holding onto too tightly?","Khaos asks: what would happen if you let it all fall away?",
    "Nyx asks: what truth do you find in the quiet?","Nyx asks: what are you afraid to look at?","Nyx asks: what has your dream been trying to tell you?","Nyx asks: what do you know that you haven’t said out loud?","Nyx asks: what do you need to understand about yourself?","Nyx asks: what is waiting for you in the dark?","Nyx asks: when did you last sit with the unknown?","Nyx asks: what do the stars remind you of?",
    "Eos asks: what is beginning for you?","Eos asks: what are you hopeful about?","Eos asks: what light came after your last dark season?","Eos asks: what would a fresh start look like?","Eos asks: what are you ready to welcome?","Eos asks: what is one thing that feels possible today?","Eos asks: where is the courage to change?","Eos asks: what small sunrise happened this week?",
    "Bennu asks: what are you ready to rise from?","Bennu asks: what have you rebuilt that you’re proud of?","Bennu asks: what did you survive that made you stronger?","Bennu asks: what are you becoming?","Bennu asks: what needs to burn so something new can grow?","Bennu asks: when did you last begin again?","Bennu asks: what would resilience look like today?","Bennu asks: what are you transforming?"];
    A.forEach(function(v){AC.forEach(function(c){out.push("What would you "+v+" if "+c+"?")})});
    BN.forEach(function(n){BP.forEach(function(p){out.push("Which "+n+" "+p+"?")})});
    CT.forEach(function(t){CG.forEach(function(g){out.push("What is one small thing you can do "+t+" to "+g+"?")})});
    EA.forEach(function(a){ET.forEach(function(t){out.push("When did you last "+a+", and "+t+"?")})});
    FS.forEach(function(s){out.push("Finish this sentence: "+s)});
    D.forEach(function(q){out.push(q)});
    var seed=20260101;                        /* fixed seed = same order for everyone */
    function rnd(){seed|=0;seed=seed+0x6D2B79F5|0;var t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}
    for(var i=out.length-1;i>0;i--){var j=Math.floor(rnd()*(i+1)),k=out[i];out[i]=out[j];out[j]=k}
    return out;
  }
  function dailyQuestion(curated){
    if(!QPOOL)QPOOL=buildPool();
    var n=Math.floor((Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())-Date.UTC(2026,0,1))/864e5);
    if(n<0)n=0;
    if(curated&&curated.length&&n%4===0)return curated[(n/4)%curated.length];   /* every 4th day is hand-picked */
    return QPOOL[n%QPOOL.length];
  }
  function inbox(){
    if(!$("question"))return;
    $("question").textContent=dailyQuestion(data.questions||[]);
    if(data.challenge)$("challenge").textContent=data.challenge;
    if(data.news&&data.news.length){$("news").innerHTML=data.news.map(function(n){
      if(typeof n==="string")return '<div class="upitem">'+esc(n)+'</div>';
      var dt=n.date?new Date(n.date+"T12:00:00").toLocaleDateString(undefined,{month:"short",day:"numeric",year:"numeric"}):"";
      var ok=n.link&&n.link.indexOf("https://discord.com/")===0;
      return '<div class="upitem"><div class="nt">'+esc(n.text||n.title||"")+'</div><span class="muted">'+esc(dt)+(ok?' · <a href="'+esc(n.link)+'" rel="noopener">View in Discord</a>':'')+'</span></div>';
    }).join("")}
  }
  function go(){cal();upnext();inbox()}
  if($("prev")){
    $("prev").onclick=function(){m--;if(m<0){m=11;y--}cal()};
    $("next").onclick=function(){m++;if(m>11){m=0;y++}cal()};
    $("today-btn").onclick=function(){y=d.getFullYear();m=d.getMonth();cal()};
  }
  if($("addev")){
    $("addev").onsubmit=function(e){
      e.preventDefault();
      var t=$("evt").value.trim();if(!t)return;
      var a=lget();a.push({id:String(Date.now()),date:sel,title:t,time:$("evtime").value.trim()});
      lset(a);$("evt").value="";$("evtime").value="";cal();upnext();
    };
  }
  fetch("announcements.json").then(function(r){return r.json()}).then(function(j){data=j;go()}).catch(go);
})();

/* profile editor (saved in this browser only) */
(function(){
  var $=function(id){return document.getElementById(id)};
  var btn=$("me");if(!btn)return;
  var KEY="zero-profile",DEF={name:"ZERØ",status:"",color:0,img:""};
  var PAL=[["#ff6b5e","#7a0f18"],["#ff2a36","#5c0a10"],["#d9d2d0","#4a4444"],["#9a85ff","#2a1a66"],["#3a4468","#0b0e1a"]];
  var NAMES=["Ember","Crimson","Ash","Violet","Night"];
  function load(){try{return Object.assign({},DEF,JSON.parse(localStorage.getItem(KEY)||"{}"))}catch(e){return Object.assign({},DEF)}}
  function store(p){try{localStorage.setItem(KEY,JSON.stringify(p));return true}catch(e){return false}}
  function initial(p){var n=(p.name||"").trim();return(!n||n==="ZERØ")?"Ø":Array.from(n)[0].toUpperCase()}
  function paint(el,p){
    if(p.img){el.style.background="url("+p.img+") center/cover";el.textContent=""}
    else{var c=PAL[p.color]||PAL[0];el.style.background="radial-gradient(circle at 30% 25%,"+c[0]+","+c[1]+")";el.textContent=initial(p)}
  }
  function paintSide(p){
    paint($("me-av"),p);
    $("me-name").textContent=(p.name||"").trim()||"ZERØ";
    $("me-sub").textContent=(p.status||"").trim()||"Edit profile";
  }
  var saved=load();paintSide(saved);

  var ov=document.createElement("div");ov.id="povl";ov.hidden=true;var dlg=document.createElement("div");dlg.className="pdlg";dlg.setAttribute("role","dialog");dlg.setAttribute("aria-modal","true");dlg.setAttribute("aria-labelledby","ptitle");function shut(){ov.hidden=true;btn.focus()}
  dlg.innerHTML='<form id="pform"><h2 id="ptitle">Edit profile</h2>'+
   '<div class="prev"><div class="av" id="pprev"></div><div class="btns"><button type="button" class="btn ghost" id="pup">Upload photo</button><button type="button" class="btn ghost" id="pnoimg">Remove photo</button></div><input type="file" id="pfile" accept="image/*" hidden></div>'+
   '<label class="f">Display name<input type="text" id="pname" maxlength="24" autocomplete="off"></label>'+
   '<label class="f">Status<input type="text" id="pstat" maxlength="60" autocomplete="off" placeholder="What are you becoming?"></label>'+
   '<fieldset><legend>Avatar color</legend><div class="sw" id="psw"></div></fieldset>'+
   '<p class="muted" style="margin:1rem 0 0">Saved in this browser only.</p>'+
   '<div class="btns"><button type="submit" class="btn main">Save</button><button type="button" class="btn ghost" id="pcancel">Cancel</button><button type="button" class="btn ghost" id="preset">Reset</button></div></form>';
  ov.appendChild(dlg);document.body.appendChild(ov);
  var draft;
  function swatches(){
    $("psw").innerHTML=PAL.map(function(c,i){return '<label title="'+NAMES[i]+'"><input type="radio" name="pc" value="'+i+'"'+(draft.color===i?" checked":"")+' aria-label="'+NAMES[i]+'"><span style="background:radial-gradient(circle at 30% 25%,'+c[0]+','+c[1]+')"></span></label>'}).join("");
    Array.prototype.forEach.call(dlg.querySelectorAll("input[name=pc]"),function(r){r.onchange=function(){draft.color=+r.value;draft.img="";prev()}});
  }
  function prev(){paint($("pprev"),draft)}
  function fill(){$("pname").value=draft.name;$("pstat").value=draft.status;swatches();prev()}
  btn.onclick=function(){draft=Object.assign({},load());fill();ov.hidden=false;$("pname").focus()};
  $("pname").oninput=function(){draft.name=this.value;prev()};
  $("pstat").oninput=function(){draft.status=this.value};
  $("pup").onclick=function(){$("pfile").click()};
  $("pnoimg").onclick=function(){draft.img="";prev()};
  $("pfile").onchange=function(){
    var f=this.files&&this.files[0];if(!f)return;
    var r=new FileReader();
    r.onload=function(){
      var im=new Image();
      im.onload=function(){
        var s=Math.min(im.width,im.height),cv=document.createElement("canvas");cv.width=cv.height=128;
        cv.getContext("2d").drawImage(im,(im.width-s)/2,(im.height-s)/2,s,s,0,0,128,128);
        draft.img=cv.toDataURL("image/jpeg",.85);prev();
      };
      im.src=r.result;
    };
    r.readAsDataURL(f);this.value="";
  };
  $("pcancel").onclick=function(){shut()};
  $("preset").onclick=function(){draft=Object.assign({},DEF);fill()};
  $("pform").onsubmit=function(e){
    e.preventDefault();
    if(!(draft.name||"").trim())draft.name="ZERØ";
    store(draft);paintSide(load());shut();
  };
  ov.addEventListener("click",function(e){if(e.target===ov)shut()});document.addEventListener("keydown",function(e){if(e.key==="Escape"&&!ov.hidden)shut()});
})();

/* live Discord count (bots included, as Discord counts them) */
(function(){
  var num=document.getElementById("onnum");if(!num)return;
  var code="jBfXVJUcVZ";
  function get(u){return fetch(u).then(function(r){if(!r.ok)throw new Error(r.status);return r.json()})}
  get("https://discord.com/api/v9/invites/"+code+"?with_counts=true").then(function(j){
    if(typeof j.approximate_presence_count!=="number")throw new Error("no count");
    num.textContent=j.approximate_presence_count;
    if(typeof j.approximate_member_count==="number")document.getElementById("ontot").textContent="of "+j.approximate_member_count+" members";
    var gid=j.guild&&j.guild.id;if(!gid)return;
    return get("https://discord.com/api/guilds/"+gid+"/widget.json").then(function(w){
      var box=document.getElementById("who");if(!w||!w.members)return;
      w.members.slice(0,16).forEach(function(m){
        var s=document.createElement("span"),i=document.createElement("img");
        i.src=m.avatar_url;i.alt="";i.width=22;i.height=22;s.appendChild(i);
        s.appendChild(document.createTextNode(m.username));
        if(m.bot){var t=document.createElement("em");t.className="tagbot";t.textContent="BOT";s.appendChild(t)}
        box.appendChild(s);
      });
    }).catch(function(){});
  }).catch(function(){
    num.textContent="Join";document.getElementById("onnum").nextSibling.textContent=" the server to see who’s around";
  });
})();
