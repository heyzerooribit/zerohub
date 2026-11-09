/* Daily tarot card: one pull per visitor per day, saved in this browser */
(function(){
  var $=function(id){return document.getElementById(id)};
  var MAJ=[
   ["The Fool","beginnings · trust · a leap","A fresh start. Step forward with open hands and trust the unknown.","Hesitation or recklessness. Look before you leap, but don’t let fear keep you still."],
   ["The Magician","willpower · skill · action","You have what you need. Focus your intention and make it real.","Scattered energy or untapped talent. Check whether you’re using your gifts honestly."],
   ["The High Priestess","intuition · mystery · stillness","Listen inward. The answer is already quietly present.","Ignoring your instincts, or secrets that need light. Quiet down and listen."],
   ["The Empress","nurture · abundance · creativity","Growth through care. Create, enjoy, and let things flourish.","Overgiving or creative block. Return to caring for yourself first."],
   ["The Emperor","structure · authority · stability","Build firm foundations. Lead with clarity and healthy boundaries.","Rigidity or lack of control. Ease your grip, or find your footing."],
   ["The Hierophant","tradition · guidance · belonging","Learn from trusted wisdom, or honor a shared tradition.","Question the rules. Your path may need to be your own."],
   ["The Lovers","connection · choice · alignment","A meaningful bond, or a choice that reflects your true values.","Misalignment or a hard choice avoided. Return to what you honestly value."],
   ["The Chariot","drive · determination · victory","Focus and willpower carry you forward. Take the wheel.","Lost direction or forced momentum. Regain control by slowing down."],
   ["Strength","courage · patience · compassion","Quiet strength wins. Meet challenges with gentleness and resolve.","Self-doubt or depleted energy. Rebuild your confidence kindly."],
   ["The Hermit","solitude · reflection · wisdom","Step back and seek your inner light. Time alone brings clarity.","Isolation or avoiding yourself. Reach out, or finally look within."],
   ["Wheel of Fortune","cycles · change · fate","Things are turning. Trust that movement is coming.","Resistance to change or a run of bad timing. This cycle will pass."],
   ["Justice","fairness · truth · accountability","Honest choices carry fair results. See things as they are.","Avoiding responsibility, or an unfair situation. Be honest with yourself."],
   ["The Hanged Man","pause · surrender · new perspective","Let go and wait. A different view changes everything.","Stalling or needless sacrifice. Decide what you’re really waiting for."],
   ["Death","endings · transformation · release","Something ends so something new can begin. Let it go.","Clinging to what’s finished. Change is coming whether you resist it or not."],
   ["Temperance","balance · patience · harmony","Blend and moderate. Slow, steady care brings healing.","Imbalance or excess. Find your center again."],
   ["The Devil","attachment · temptation · shadow","Notice what holds you. The chains are looser than they look.","Breaking free. Releasing a habit, belief, or bond that kept you small."],
   ["The Tower","upheaval · revelation · breakthrough","Sudden change shakes what wasn’t solid. Clear ground follows.","Avoiding a needed collapse, or a slow rebuilding after upheaval."],
   ["The Star","hope · healing · renewal","Calm after the storm. Trust that you’re being restored.","Lost hope or low faith. Let a small light be enough for now."],
   ["The Moon","dreams · illusion · intuition","Not everything is clear. Move gently and trust your gut.","Confusion lifting. Fears or secrets come into the light."],
   ["The Sun","joy · clarity · vitality","Warmth and success. Let yourself enjoy what’s good.","Dimmed joy or overconfidence. The light is still there."],
   ["Judgement","awakening · reckoning · calling","A turning point. Answer the call to rise into who you’re becoming.","Self-doubt or ignoring the call. Forgive yourself and begin again."],
   ["The World","completion · wholeness · fulfillment","A cycle completes. Celebrate how far you’ve come.","Nearly there but unfinished. One last step before the next chapter."]
  ];
  var MIN={
   "Wands":[
    ["spark · inspiration · beginnings","A creative or personal spark. Act on the new idea.","A delayed spark. Don’t force a new beginning; be patient with inspiration."],
    ["planning · choices · vision","You’ve made a start. Decide where to go next.","Fear of the unknown or poor planning. Step outside your comfort zone."],
    ["expansion · foresight · progress","Your efforts are reaching outward. Look ahead.","Delays or frustrated plans. Be patient and adjust."],
    ["celebration · home · stability","A joyful milestone or a sense of belonging.","An unsettled home or a celebration postponed. Look for what feels steady."],
    ["conflict · competition · friction","Clashing ideas. Healthy competition if kept in balance.","Avoiding conflict, or tension easing. Seek a truce."],
    ["victory · recognition · confidence","Success is acknowledged. Take pride.","Self-doubt or a stalled win. Define success on your own terms."],
    ["defense · perseverance · standing firm","Hold your ground. You’re defending something worth keeping.","Feeling overwhelmed or giving in. Choose your battles."],
    ["speed · movement · messages","Things move quickly. News or progress arrives.","Delays or scattered energy. Slow down and aim."],
    ["resilience · persistence · the last stretch","You’re weary but nearly through. Keep going.","Exhaustion or burnout. Rest, and drop what you’re guarding."],
    ["burden · responsibility · overload","You’re carrying a lot. Ask what’s truly yours to carry.","Putting down a burden. Delegating, or finally resting."],
    ["curiosity · exploration · enthusiasm","A bold new interest. Explore without needing it perfect.","Restlessness or unfinished ideas. Follow through."],
    ["adventure · passion · momentum","Charge ahead with energy and conviction.","Impulsiveness or burnout. Aim before you act."],
    ["confidence · warmth · vitality","Radiate self-assurance. Lead with warmth.","Insecurity or jealousy. Reclaim your own spark."],
    ["vision · leadership · boldness","Lead by inspiring. Turn vision into reality.","Domineering or unfocused. Lead with humility."]],
   "Cups":[
    ["new feelings · compassion · openness","An emotional beginning. Let your heart open.","Blocked feelings or emptiness. Be gentle and go slowly."],
    ["partnership · harmony · mutual respect","A true connection built on give and take.","Imbalance or a strained bond. Communicate honestly."],
    ["friendship · celebration · community","Enjoy the people who lift you up.","Overindulgence or feeling left out. Seek real connection."],
    ["apathy · reflection · reevaluation","Boredom or withdrawal. Notice what’s being offered.","Reawakening interest. You’re ready to engage again."],
    ["loss · grief · regret","Mourn what’s gone, but notice what remains.","Acceptance and moving on. Healing begins."],
    ["nostalgia · memory · kindness","A sweet memory or a gentle gesture. Reconnect.","Stuck in the past. Honor it, then step forward."],
    ["choices · imagination · illusions","Many options and daydreams. Sort out what’s real.","Clarity arrives. Choose one and commit."],
    ["walking away · seeking more · letting go","Leave what no longer fulfills you, even if it’s hard.","Fear of leaving, or drifting. Decide whether to stay or go."],
    ["contentment · wishes granted · satisfaction","Savor what you’ve achieved. A wish comes true.","Dissatisfaction or smugness. What would truly fulfill you?"],
    ["harmony · family · emotional fulfillment","Lasting happiness with the people you love.","Disconnection or unrealistic ideals. Tend to your closest bonds."],
    ["tenderness · intuition · creative messages","A sweet surprise or creative message. Stay open.","Emotional immaturity or a creative block. Be honest with your feelings."],
    ["romance · charm · following the heart","An invitation or offer. Lead with sincerity.","Moodiness or unrealistic expectations. Ground your dreams."],
    ["empathy · compassion · emotional wisdom","Care for others with an open heart and clear boundaries.","Overwhelmed by feelings. Fill your own cup first."],
    ["calm · balance · emotional maturity","A steady hand and a steady heart. Lead with compassion.","Suppressed feelings or volatility. Express what you’ve held back."]],
   "Swords":[
    ["clarity · truth · breakthrough","A sharp new insight. Speak and think clearly.","Confusion or harsh words. Slow down and find the facts."],
    ["indecision · stalemate · avoidance","A hard choice. Stop blocking your own view.","A decision at last, or information overload. Trust what you know."],
    ["heartbreak · sorrow · honesty","Pain that needs acknowledging. Grief eases with time.","Healing from hurt. Release the pain you’ve been holding."],
    ["rest · recovery · retreat","Pause and restore. Rest isn’t giving up.","Restlessness or burnout. Return to the world slowly."],
    ["conflict · tension · a hollow victory","A win that costs too much. Choose your fights.","Reconciliation or lingering resentment. Let it end."],
    ["transition · moving on · calmer waters","Leave turbulence behind and head toward peace.","Resistance to leaving. You’re carrying what you meant to leave behind."],
    ["strategy · secrecy · cunning","Act carefully, and be honest about what you’re not saying.","Coming clean, or getting caught. Honesty frees you."],
    ["restriction · feeling trapped · self-limits","The bindings are looser than they appear. Look up.","Release and a new perspective. You’re finding the way out."],
    ["anxiety · worry · sleepless nights","Fear is louder at night. Share the weight.","Worries easing. Reach out and let go of what you imagined."],
    ["endings · rock bottom · release","A painful finish, and the worst is over. Dawn follows.","Recovery begins, or refusing to let something end."],
    ["curiosity · vigilance · new ideas","Stay curious and keep asking questions.","Gossip or scattered thinking. Think before you speak."],
    ["ambition · action · directness","Pursue your goal at speed, but mind your words.","Impatience or a reckless rush. Pause."],
    ["clarity · independence · honesty","Clear-eyed and fair. Say what you mean.","Coldness or bitterness. Let compassion soften your edge."],
    ["authority · intellect · truth","Decide with reason and fairness. Think it through.","Cruelty or manipulation. Hold power responsibly."]],
   "Pentacles":[
    ["opportunity · prosperity · foundation","A tangible new start in work, money, or health.","A missed chance or a shaky plan. Reassess before you invest."],
    ["balance · juggling · adaptability","Keep several things moving, and stay flexible.","Overwhelm or dropped balls. Simplify."],
    ["teamwork · craft · collaboration","Good work through shared effort. Ask for input.","Disharmony or outside expectations. Look inward and find your own path."],
    ["security · control · holding on","Protect what you’ve built, but don’t clench.","Release control. Let go of what you’re gripping and make room for possibility."],
    ["hardship · isolation · worry","Hard times. Help is closer than it seems.","Recovery and asking for help. The worst is behind you."],
    ["generosity · fairness · giving and receiving","Share what you have, and accept help.","Strings attached or imbalance. Keep the exchange fair."],
    ["patience · investment · reflection","Tend slowly. Results take time, so assess your progress.","Impatience or wasted effort. Is this still worth growing?"],
    ["craft · diligence · mastery","Dedicated practice builds skill. Keep at it.","Perfectionism or boredom. Find meaning in the work."],
    ["independence · luxury · self-sufficiency","Enjoy the rewards of your effort.","Overworking or dependency. Build real self-reliance."],
    ["legacy · wealth · lasting security","Long-term stability, and family. A lasting foundation.","Instability or conflict over resources. Rebuild what lasts."],
    ["study · opportunity · practical curiosity","A chance to learn. Begin something grounded.","Procrastination or lost focus. Take the first small step."],
    ["reliability · routine · steady progress","Slow, thorough work gets there. Stay consistent.","Stagnation or a rigid routine. Break the rut."],
    ["nurturing · practicality · abundance","Create comfort and warmth. Care for body and home.","Neglecting yourself or smothering others. Rebalance work and care."],
    ["stability · prosperity · generosity","Build, provide, and lead steadily.","Greed or stubbornness. Hold wealth lightly."]]
  };
  var RANKS=["Ace","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Page","Knight","Queen","King"];
  var ROM=["0","I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII","XIII","XIV","XV","XVI","XVII","XVIII","XIX","XX","XXI"];
  var DECK=[];
  MAJ.forEach(function(m,i){DECK.push({name:m[0],num:ROM[i],rank:m[0],suit:"Major Arcana",kw:m[1],up:m[2],rev:m[3]})});
  ["Wands","Cups","Swords","Pentacles"].forEach(function(s){MIN[s].forEach(function(c,i){DECK.push({name:RANKS[i]+" of "+s,num:"",rank:RANKS[i],suit:"of "+s,kw:c[0],up:c[1],rev:c[2]})})});

  function two(n){return n<10?"0"+n:""+n}
  function today(){var d=new Date();return d.getFullYear()+"-"+two(d.getMonth()+1)+"-"+two(d.getDate())}
  var KEY="zero-tarot";
  function load(){try{var v=JSON.parse(localStorage.getItem(KEY));return v&&Array.isArray(v.log)?v:{log:[]}}catch(e){return{log:[]}}}
  function save(v){try{localStorage.setItem(KEY,JSON.stringify(v))}catch(e){}}
  function rnd(n){var a=new Uint32Array(1);crypto.getRandomValues(a);return a[0]%n}

  function show(e){
    var c=DECK[e.id];
    $("tfront").className="tface front"+(e.rev?" rev":"");
    $("tfront").innerHTML=(c.num?'<span class="tnum">'+c.num+'</span>':'')+'<span class="trank">'+c.rank+'</span><span class="tsuit">'+c.suit+'</span>';
    $("tname").textContent=c.name+(e.rev?" (reversed)":"");
    $("tkw").textContent=c.kw;
    $("tmean").textContent=e.rev?c.rev:c.up;
    $("tother").textContent=(e.rev?"Upright: "+c.up:"Reversed: "+c.rev);
    $("tinfo").hidden=false;
    $("tcard").classList.add("flip");
    $("tdraw").hidden=true;
  }
  function history(v){
    var t=today(),past=v.log.filter(function(x){return x.date!==t&&DECK[x.id]}).slice(-7).reverse();
    var box=$("thist");
    if(!past.length){box.innerHTML="";return}
    box.innerHTML='<h3>Past pulls</h3><div class="chips">'+past.map(function(x){
      var dt=new Date(x.date+"T12:00:00").toLocaleDateString(undefined,{month:"short",day:"numeric"});
      return '<span class="chip">'+dt+" · "+DECK[x.id].name+(x.rev?" (reversed)":"")+'</span>';
    }).join("")+'</div>';
  }
  var t=today();
  function mineToday(s){return s.log.filter(function(x){return x.date===t&&DECK[x.id]})[0]}
  if($("tdraw")){
  var v=load(),mine=v.log.filter(function(x){return x.date===t&&DECK[x.id]})[0];
  if(mine)show(mine);
  history(v);
  $("tdraw").onclick=function(){
    var s=load();
    var e=s.log.filter(function(x){return x.date===t&&DECK[x.id]})[0];
    if(!e){e={date:t,id:rnd(DECK.length),rev:rnd(2)===1};s.log.push(e);s.log=s.log.slice(-30);save(s)}
    show(e);history(s);
  };
  }
  /* home page teaser */
  if($("hometarot")){
    var hm=mineToday(load());
    if(hm){
      var hc=DECK[hm.id];
      $("htname").textContent=hc.name+(hm.rev?" (reversed)":"");
      $("htname").hidden=false;
      $("htmsg").textContent=hm.rev?hc.rev:hc.up;
      $("htbtn").textContent="See your card";
    }
  }
  window.__zeroDeck=DECK.length;
})();
