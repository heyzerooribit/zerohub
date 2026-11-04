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
  function esc(s){var e=document.createElement("div");e.textContent=s;return e.innerHTML}
  function upnext(){
    var el=$("upnext");if(!el)return;
    var t=key(d.getFullYear(),d.getMonth(),d.getDate());
    var list=data.events.filter(function(e){return e.date>=t}).sort(function(a,b){return (a.date+(a.time||"")).localeCompare(b.date+(b.time||""))}).slice(0,5);
    if(!list.length)return;
    el.className="";
    el.innerHTML=list.map(function(e){return '<div class="upitem"><b>'+esc(e.title)+'</b><br><span class="muted">'+esc(e.date)+(e.time?" · "+esc(e.time):"")+'</span></div>'}).join("");
  }
  function cal(){
    var el=$("cal");if(!el)return;
    $("calt").textContent=new Date(y,m,1).toLocaleDateString(undefined,{month:"long",year:"numeric"});
    var h="",first=new Date(y,m,1).getDay(),dim=new Date(y,m+1,0).getDate(),prev=new Date(y,m,0).getDate();
    ["S","M","T","W","T","F","S"].forEach(function(s){h+='<div class="dow">'+s+'</div>'});
    for(var i=0;i<first;i++)h+='<div class="day out">'+(prev-first+i+1)+'</div>';
    for(var n=1;n<=dim;n++){
      var k=key(y,m,n),now=(k===key(d.getFullYear(),d.getMonth(),d.getDate()))?" now":"";
      var ev=data.events.filter(function(e){return e.date===k}).map(function(e){return '<span class="ev">'+esc(e.title)+'</span>'}).join("");
      h+='<div class="day'+now+'">'+n+ev+'</div>';
    }
    var tail=(7-(first+dim)%7)%7;
    for(var j=1;j<=tail;j++)h+='<div class="day out">'+j+'</div>';
    el.innerHTML=h;
  }
  function inbox(){
    if(!$("question"))return;
    var q=data.questions;
    $("question").textContent=q.length?q[day%q.length]:"No question posted yet.";
    if(data.challenge)$("challenge").textContent=data.challenge;
    if(data.news&&data.news.length){$("news").innerHTML=data.news.map(function(n){return '<div class="upitem">'+esc(typeof n==="string"?n:n.title||"")+'</div>'}).join("")}
  }
  function go(){cal();upnext();inbox()}
  if($("prev")){
    $("prev").onclick=function(){m--;if(m<0){m=11;y--}cal()};
    $("next").onclick=function(){m++;if(m>11){m=0;y++}cal()};
    $("today-btn").onclick=function(){y=d.getFullYear();m=d.getMonth();cal()};
  }
  fetch("zero-data.json").then(function(r){return r.json()}).then(function(j){data=j;go()}).catch(go);
})();
