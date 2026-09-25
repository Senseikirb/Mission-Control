/* Mission Control 8: pure data model. No DOM, network, eval, or implicit writes. */
const Engine = (()=>{
'use strict';
const SCHEMA=8, KEY='missionControl_v8', LEGACY_KEY='missionControlRPG_v3';
const clone=x=>JSON.parse(JSON.stringify(x));
const obj=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const idOK=x=>typeof x==='string'&&/^[A-Za-z0-9][A-Za-z0-9_-]{0,100}$/.test(x)&&!['__proto__','constructor','prototype'].includes(x);
const finite=x=>typeof x==='number'&&Number.isFinite(x)&&x>=0;
const day=d=>{d=d||new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');};
const validDay=x=>typeof x==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(x)&&day(new Date(x+'T12:00:00'))===x;
const shiftDay=(s,n)=>{const d=new Date(s+'T12:00:00');d.setDate(d.getDate()+n);return day(d);};
const weekStart=s=>{const d=new Date(s+'T12:00:00');return shiftDay(s,-((d.getDay()+6)%7));};
const uid=prefix=>prefix+'-'+(globalThis.crypto?.randomUUID?.()||Date.now().toString(36)+'-'+Math.random().toString(36).slice(2));
const safeURL=u=>{try{const p=new URL(u);return ['https:','http:'].includes(p.protocol)?p.href:'';}catch{return '';}};
const hash=s=>{let n=2166136261;for(const ch of s)n=Math.imul(n^ch.charCodeAt(0),16777619);return n>>>0;};
function all(c){return [...c.weeks.flatMap(w=>w.activities.map(a=>({...a,kind:'plan',cycleId:w.id,cycle:w.num,title:a.name}))),...c.bonusMissions.map(a=>({...a,kind:'quest',tracks:[a.track]})),...c.leadershipLessons.map(a=>({...a,kind:'leadership',tracks:a.tracks||['PM','PS']}))];}
function mode(a){if(a.mode)return {value:a.mode,inferred:false};const t=((a.name||a.title||'')+' '+(a.cat||'')+' '+(a.links||[]).map(x=>x.t+' '+x.u).join(' ')).toLowerCase();let value='reading';if(/podcast|audiobook/.test(t))value='audio';else if(/youtube|3b1b|3blue1brown|brackeys|gdquest|gmtk|lecture|statquest|video|ted/.test(t))value='video';else if(/\bapp\b|mobile|brilliant|pocket prep|icircuit/.test(t))value='app';else if(/install|build|train |deploy|kicad|godot:|project \d|fpga|write|draft|setup|configure|set up/.test(t))value='hands-on';return {value,inferred:true};}
function scanUnsafe(x){if(Array.isArray(x)){x.forEach(scanUnsafe);return;}if(obj(x))for(const [k,v]of Object.entries(x)){if(['__proto__','constructor','prototype'].includes(k))throw Error('Unsafe object key: '+k);scanUnsafe(v);}}
function validateConfig(c){
 const errors=[],warnings=[];const check=(v,msg)=>{if(!v)errors.push(msg);};
 try{scanUnsafe(c);}catch(e){return {errors:[e.message],warnings};}
 if(!obj(c))return {errors:['Configuration must be an object.'],warnings};
 for(const key of ['tracks','phases','weeks','projects','resources','jobTracks','bonusMissions','leadershipLessons','views'])check(Array.isArray(c[key]),key+' must be an array.');
 check(obj(c.meta)&&typeof c.meta.title==='string','meta.title is required.');check(obj(c.rpg),'rpg is required.');
 if(errors.length)return {errors,warnings};
 const r=c.rpg;
 for(const k of ['classes','stats','ranks','rankMessages','augmentations','rewardTiers','achievements'])check(Array.isArray(r[k])&&r[k].length>0,'rpg.'+k+' must be a nonempty array.');
 for(const k of ['difficultyMap','difficultyXP','difficultyStars','defaultRewards','rules'])check(obj(r[k]),'rpg.'+k+' is required.');
 if(errors.length)return {errors,warnings};
 const ids=new Set();const unique=(x,label)=>{check(idOK(x),label+' requires a safe, stable ID.');check(!ids.has(x),'Duplicate ID: '+x);ids.add(x);};
 const tracks=new Set(c.tracks.map(t=>t.code)),cycles=new Set(c.weeks.map(w=>w.num)),projects=new Set(c.projects.map(p=>p.id));
 check(c.tracks.length>0&&c.weeks.length>0,'At least one track and cycle are required.');
 check(tracks.size===c.tracks.length,'Duplicate track code.');
 c.tracks.forEach(t=>{check(/^[A-Z]{2,4}$/.test(t.code),'Invalid track code.');check(typeof t.name==='string','Track name required.');check(/^#[0-9a-f]{6}$/i.test(t.color),'Track colors must be six-digit hex.');});
 const validTracks=(ts,label)=>check(Array.isArray(ts)&&ts.length>0&&new Set(ts).size===ts.length&&ts.every(t=>tracks.has(t)),label+' has missing, duplicate or unknown tracks.');
 check(cycles.size===c.weeks.length,'Duplicate cycle number.');
 c.weeks.forEach(w=>{unique(w.id,'Cycle');check(Number.isInteger(w.num)&&w.num>0,'Invalid cycle number.');check(typeof w.title==='string','Cycle title required.');check(Array.isArray(w.activities),'activities must be an array.');check(finite(w.totalHrs),'Declared cycle hours must be nonnegative.');});
 if(errors.length)return {errors,warnings};
 const activities=all(c),activityIds=new Set(activities.map(a=>a.id));
 activities.forEach(a=>{unique(a.id,'Activity');check(typeof a.title==='string'&&a.title.trim().length>0,'Activity title required: '+a.id);validTracks(a.tracks,a.id);
  if(a.kind==='plan')check(finite(a.hrs)&&a.hrs<=10000,'Invalid hours: '+a.id);else check(finite(a.xp)&&a.xp<=100000,'Invalid XP: '+a.id);
  if(a.mode!==undefined)check(['reading','hands-on','audio','video','app'].includes(a.mode),'Unknown content mode: '+a.id);
  if(a.minSessionMinutes!==undefined)check(finite(a.minSessionMinutes)&&a.minSessionMinutes>0,'Invalid minimum session: '+a.id);
  if(a.prerequisites==null)warnings.push(a.id+': prerequisite information missing.');else{check(Array.isArray(a.prerequisites),'prerequisites must be null or an array: '+a.id);if(Array.isArray(a.prerequisites))check(new Set(a.prerequisites).size===a.prerequisites.length&&a.prerequisites.every(p=>p!==a.id&&activityIds.has(p)),'Unknown, duplicate or self prerequisite: '+a.id);}
  if(a.projectIds!==undefined)check(Array.isArray(a.projectIds)&&a.projectIds.every(p=>projects.has(p)),'Unknown project: '+a.id);
  for(const l of a.links||[])check(obj(l)&&typeof l.t==='string'&&!!safeURL(l.u),'Invalid resource link: '+a.id);
  if(a.url)check(!!safeURL(a.url),'Invalid URL: '+a.id);
 });
 const visiting=new Set(),visited=new Set(),byId=new Map(activities.map(a=>[a.id,a]));
 function dfs(id){if(visiting.has(id)){errors.push('Prerequisite cycle at '+id);return;}if(visited.has(id))return;visiting.add(id);for(const p of byId.get(id)?.prerequisites||[])dfs(p);visiting.delete(id);visited.add(id);}
 if(!errors.length)activities.forEach(a=>dfs(a.id));
 c.weeks.forEach(w=>{const h=w.activities.reduce((s,a)=>s+a.hrs,0);if(Math.abs(h-w.totalHrs)>.001)warnings.push('Cycle '+w.num+': activities total '+h+'h; declared '+w.totalHrs+'h.');});
 c.phases.forEach(p=>{unique(p.id,'Phase');check(typeof p.name==='string'&&Array.isArray(p.weeks)&&p.weeks.every(n=>cycles.has(n)),'Invalid phase: '+p.id);});
 c.projects.forEach(p=>{unique(p.id,'Project');check(typeof p.title==='string'&&typeof p.desc==='string'&&typeof p.metrics==='string'&&Array.isArray(p.tech)&&obj(p.crossover)&&Array.isArray(p.defaultTasks),'Invalid project: '+p.id);if(obj(p.crossover))check(Object.keys(p.crossover).every(t=>tracks.has(t)),'Unknown project track.');for(const t of p.defaultTasks||[]){unique(t.id,'Project task');check(typeof t.text==='string','Project task text required.');}});
 c.resources.forEach(r=>{unique(r.id,'Resource');check(typeof r.name==='string'&&typeof r.cat==='string'&&!!safeURL(r.url),'Invalid resource: '+r.id);});
 const jobs=new Set();c.jobTracks.forEach(t=>{check(tracks.has(t.code)&&!jobs.has(t.code)&&Array.isArray(t.companies),'Invalid job track.');jobs.add(t.code);for(const j of t.companies||[]){unique(j.id,'Company');check(typeof j.name==='string','Company name required.');}});
 const viewIds=['command','missions','sidequests','operations','intel','recruit','operative','achievements','leadership','config'];
 check(new Set(c.views.map(v=>v.id)).size===c.views.length&&c.views.length===viewIds.length&&viewIds.every(id=>c.views.some(v=>v.id===id)),'views must contain each of the ten supported sections exactly once.');
 c.views.forEach(v=>check(typeof v.label==='string','View label required.'));
 r.classes.forEach(x=>{unique(x.id,'Class');check(typeof x.name==='string'&&obj(x.bonus),'Invalid class.');for(const [k,v]of Object.entries(x.bonus||{}))check((k==='all'||tracks.has(k))&&finite(v)&&v>0&&v<=10,'Invalid class bonus.');});
 r.stats.forEach(s=>{unique(s.key,'Stat');validTracks(s.tracks,s.key);check(s.boost===undefined||(finite(s.boost)&&s.boost<=10),'Invalid stat boost.');});
 r.augmentations.forEach(a=>unique(a.id,'Augmentation'));
 r.achievements.forEach(a=>{unique(a.id,'Achievement');check(/^(totalCompleted|totalXP|rank|streak|credsEarned|shipped)\s*(>=|<=|>|<|===|==)\s*\d+$/.test(a.condition),'Unsupported achievement expression: '+a.id);});
 for(const [k,v]of Object.entries(r.difficultyMap))check(Number.isFinite(+k)&&+k>=0&&finite(r.difficultyXP[v]),'Invalid difficulty mapping.');
 check(Object.prototype.hasOwnProperty.call(r.difficultyMap,'0'),'difficultyMap must define threshold 0.');
 check(Object.values(r.difficultyXP).every(finite),'XP must be finite and nonnegative.');
 check(r.ranks.every(s=>typeof s==='string'),'Rank names must be strings.');
 check(new Set(r.rewardTiers.map(t=>t.name)).size===r.rewardTiers.length,'Duplicate reward tier.');
 check(Math.abs(r.rewardTiers.reduce((n,t)=>n+t.pct,0)-100)<.001,'Reward tier percentages must total 100.');
 r.rewardTiers.forEach(t=>check(finite(t.pct)&&Array.isArray(r.defaultRewards[t.name])&&r.defaultRewards[t.name].length>0&&r.defaultRewards[t.name].every(s=>typeof s==='string'),'Invalid reward tier: '+t.name));
 check(Number.isInteger(r.rules.categoryEvery)&&r.rules.categoryEvery>0&&finite(r.rules.categoryXP)&&finite(r.rules.stretchMultiplier),'Invalid progression rules.');
 check(r.rules.dailyBonus===0&&r.rules.streakMultiplier===0,'Daily and streak multipliers must be 0 in schema 8.');
 return {errors,warnings};
}
function assertConfig(c){const v=validateConfig(c);if(v.errors.length)throw Error(v.errors.slice(0,12).join('\n'));return v;}
function fresh(c){assertConfig(c);return {schemaVersion:SCHEMA,appVersion:'8.0.0',revision:0,savedAt:null,config:clone(c),progress:{records:{},events:{},sessions:[],history:[],cycleNotes:{},projects:{},resources:{},jobs:{},retrospectives:[],credentials:{},profile:{name:'',callsign:'',classId:c.rpg.classes.at(-1).id,missionStatement:''},settings:{weeklyHours:3,sessionMinutes:20,format:'reading',preferredTracks:[],activeCycle:c.weeks[0].id,includeStretch:false,quiet:true,celebrate:false},baseline:{xp:0,stats:{},augPoints:0,augmentations:[],rewards:[],achievements:[],legacyCreds:0},purchases:[],recovery:[],migration:null}};}
function record(b,id){return b.progress.records[id]||{completed:false,note:'',link:'',checkpoint:'',demonstrated:false,deferred:false,legacyHours:0};}
function hours(b,id){const r=record(b,id);return (Number(r.legacyHours)||0)+b.progress.sessions.filter(s=>s.activityId===id&&s.active).reduce((n,s)=>n+s.minutes/60,0);}
function difficulty(c,hrs){let result='Routine';Object.keys(c.rpg.difficultyMap).map(Number).sort((a,b)=>a-b).forEach(n=>{if(hrs>=n)result=c.rpg.difficultyMap[n];});return result;}
function rankFromXP(x){let rank=1,spent=0;while(rank<10000&&x-spent>=50*rank*(rank+1)){spent+=50*rank*(rank+1);rank++;}return {rank,xp:x-spent,next:50*rank*(rank+1)};}
function recognition(c,id,resource){if(hash(id+'chance')%10000>=7000+(resource?500:0))return null;const n=(hash(id+'tier')%10000)/100;let acc=0;for(const tier of c.rpg.rewardTiers){acc+=tier.pct;if(n<acc){const pool=c.rpg.defaultRewards[tier.name];return {tier:tier.name,reward:pool[hash(id+'text')%pool.length],icon:tier.icon};}}return null;}
function eventFor(b,a,now){const c=b.config,p=b.progress,cls=c.rpg.classes.find(x=>x.id===p.profile.classId)||c.rpg.classes.at(-1),aug=progression(b).activeAugmentations;
 const diff=difficulty(c,a.hrs||0);let xp=a.kind==='plan'?c.rpg.difficultyXP[diff]:a.xp;
 if(a.kind==='plan'){if(a.stretch)xp=Math.round(xp*c.rpg.rules.stretchMultiplier);xp=Math.round(xp*(cls.bonus.all||1));if(aug.includes('overclock')&&['High-Risk','Critical'].includes(diff))xp=Math.round(xp*1.1);}
 const stats={};for(const st of c.rpg.stats){const matches=a.tracks.filter(t=>st.tracks.includes(t));if(matches.length)stats[st.key]=Math.round(xp/30*Math.max(...matches.map(t=>cls.bonus[t]||1))*(st.boost||1));}
 return {id:'completion-'+a.id,activityId:a.id,title:a.title,kind:a.kind,tracks:clone(a.tracks),xp,stats,active:true,firstAt:now.toISOString(),localDay:day(now),reward:recognition(c,a.id,aug.includes('resource')),ruleVersion:'8.0.0',classId:cls.id,augmentations:clone(aug)};
}
function complete(b,id,value,now=new Date()){
 const a=all(b.config).find(a=>a.id===id);if(!a)throw Error('Activity not in active config.');const r=b.progress.records[id]||(b.progress.records[id]=record(b,id));
 if(r.completed===value)return false;
 if(value){let e=b.progress.events[id];if(!e){e=r.legacyCredit?{id:'completion-'+id,activityId:id,title:a.title,kind:a.kind,tracks:a.tracks,xp:0,stats:{},active:true,legacy:true,firstAt:r.completedAt||now.toISOString(),localDay:r.legacyLocalDay||null,reward:null}:eventFor(b,a,now);b.progress.events[id]=e;}e.active=true;r.completedAt=e.firstAt;r.deferred=false;}
 else {if(b.progress.events[id])b.progress.events[id].active=false;r.demonstrated=false;}
 r.completed=value;b.progress.history.push({id:uid('history'),type:value?'complete':'undo',activityId:id,at:now.toISOString(),localDay:day(now)});return true;
}
function bulk(b,ids,value,now=new Date()){return [...new Set(ids)].sort().reduce((n,id)=>n+Number(complete(b,id,value,now)),0);}
function addSession(b,id,minutes,note='',sessionId=uid('session'),now=new Date()){
 if(!all(b.config).some(a=>a.id===id))throw Error('Unknown activity.');if(!finite(minutes)||minutes<=0||minutes>1440)throw Error('Enter 1–1440 session minutes.');
 if(b.progress.sessions.some(s=>s.id===sessionId))return false;
 b.progress.sessions.push({id:sessionId,activityId:id,minutes,note,active:true,at:now.toISOString(),localDay:day(now)});return true;
}
function defer(b,id,value,reason='',now=new Date()){const r=b.progress.records[id]||(b.progress.records[id]=record(b,id));if(r.deferred===value)return false;r.deferred=value;b.progress.history.push({id:uid('history'),type:value?'defer':'resume',activityId:id,reason,at:now.toISOString(),localDay:day(now)});return true;}
function streak(b,today=day()){const dates=new Set([...b.progress.sessions.filter(s=>s.active).map(s=>s.localDay),...Object.values(b.progress.events).filter(e=>e.active&&!e.legacy).map(e=>e.localDay)].filter(d=>validDay(d)&&d<=today));let count=0,cursor=dates.has(today)?today:shiftDay(today,-1);while(dates.has(cursor)){count++;cursor=shiftDay(cursor,-1);}return {count,activeDays:dates.size,today:dates.has(today)};}
function evalCondition(expr,ctx){const m=expr.match(/^(\w+)\s*(>=|<=|>|<|===|==)\s*(\d+)$/);if(!m)return false;const v=ctx[m[1]],n=+m[3];return ({'>=':v>=n,'<=':v<=n,'>':v>n,'<':v<n,'==':v===n,'===':v===n})[m[2]]||false;}
function progression(b,today=day()){
 const p=b.progress,base=p.baseline,active=Object.values(p.events).filter(e=>e.active&&!e.legacy),cats={},bonuses=[];
 const sorted=[...active].sort((a,b)=>a.activityId.localeCompare(b.activityId));
 sorted.forEach(e=>e.tracks.forEach(t=>{cats[t]=(cats[t]||0)+1;if(cats[t]%b.config.rpg.rules.categoryEvery===0)bonuses.push({id:'category-'+t+'-'+cats[t],origin:e.id,xp:b.config.rpg.rules.categoryXP});}));
 const totalXP=base.xp+active.reduce((n,e)=>n+e.xp,0)+bonuses.reduce((n,e)=>n+e.xp,0),rank=rankFromXP(totalXP),baseRank=rankFromXP(base.xp).rank;
 const stats={};b.config.rpg.stats.forEach(st=>stats[st.key]=Math.min(100,(base.stats[st.key]??10)+active.reduce((n,e)=>n+(e.stats[st.key]||0),0)+Math.max(0,rank.rank-baseRank)));
 const earnedPoints=base.augPoints+Math.max(0,Math.floor(rank.rank/5)-Math.floor(baseRank/5));
 const eligible=p.purchases.filter(x=>x.active).slice(0,earnedPoints),activeAugmentations=[...base.augmentations,...eligible.map(x=>x.augmentationId)];
 const credentialList=Object.values(p.credentials).filter(x=>x.active&&x.issuer.trim()&&x.reference.trim()),credsEarned=new Set(credentialList.map(x=>x.issuer.trim().toLowerCase()+'|'+x.reference.trim().toLowerCase())).size;
 const totalCompleted=Object.values(p.records).filter(r=>r.completed).length,shipped=Object.values(p.projects).filter(p=>p.status==='Shipped').length,st=streak(b,today);
 const ctx={totalCompleted,totalXP,rank:rank.rank,streak:st.count,credsEarned,shipped};
 return {...rank,totalXP,stats,cats,bonuses,totalCompleted,shipped,credsEarned,streak:st,augPoints:Math.max(0,earnedPoints-eligible.length),activeAugmentations,suspended:p.purchases.filter(x=>x.active&&!eligible.includes(x)),achievements:b.config.rpg.achievements.filter(a=>evalCondition(a.condition,ctx)).map(a=>a.id),rewards:active.filter(e=>e.reward).map(e=>({...e.reward,origin:e.id,activityId:e.activityId,title:e.title,date:e.localDay}))};
}
function prerequisite(b,a){if(a.prerequisites==null)return {unknown:true,blocked:[],text:'Prerequisites not specified — review readiness.'};const blocked=a.prerequisites.filter(id=>!record(b,id).completed);return {unknown:false,blocked,text:blocked.length?'Waiting for '+blocked.length+' configured prerequisite(s).':a.prerequisites.length?'Configured prerequisites complete.':'No prerequisites configured as required.'};}
function recommend(b,today=day()){
 const s=b.progress.settings,start=weekStart(today),spent=b.progress.sessions.filter(x=>x.active&&x.localDay>=start&&x.localDay<=today).reduce((n,x)=>n+x.minutes,0),remaining=Math.max(0,s.weeklyHours*60-spent),available=Math.min(s.sessionMinutes,remaining);
 if(available<=0)return {items:[],spent,remaining,available,reason:'Your weekly budget is used. Rest is always available; adjust the budget only if it fits your week.'};
 const candidates=all(b.config).filter(a=>a.kind==='plan'&&(a.cycleId===s.activeCycle||hours(b,a.id)>0)&&!record(b,a.id).completed&&!record(b,a.id).deferred&&(s.includeStretch||!a.stretch)&&!prerequisite(b,a).blocked.length&&(s.format==='all'||mode(a).value===s.format)&&(!a.minSessionMinutes||a.minSessionMinutes<=available));
 const items=candidates.map(a=>{const logged=hours(b,a.id),left=Math.max(0,a.hrs*60-logged*60),estimate=a.hrs>0,minutes=Math.min(available,estimate&&left>0?left:available),preferred=a.tracks.some(t=>s.preferredTracks.includes(t)),score=(a.stretch?-50:0)+(a.priority?20:0)+(preferred?30:0)+(logged>0?40:0)+(left>0&&left<=available?10:0);
 const reasons=[logged>0?'Continue work already started':a.priority?'Priority in your plan':'Core work in your selected cycle',preferred?'Matches your preferred tracks':'Covers '+a.tracks.join(' / '),Math.round(minutes)+' min within your session and weekly budget'];
 if(a.stretch)reasons[0]='Optional stretch work';
 return {a,minutes,logged,left,estimate,score,reasons,mode:mode(a),prerequisite:prerequisite(b,a)};
 }).sort((a,b)=>b.score-a.score||a.a.id.localeCompare(b.a.id)).slice(0,3);
 return {items,spent,remaining,available,reason:items.length?'Choose one option; these are alternatives.':'No matching activity is ready. Try another format or cycle, or resume parked work on the Mission Board.'};
}
function applyConfig(b,c){assertConfig(c);const n=clone(b),oldIds=new Set(all(b.config).map(a=>a.id)),newIds=new Set(all(c).map(a=>a.id));n.config=clone(c);const gone=[...oldIds].filter(id=>!newIds.has(id)&&n.progress.records[id]);if(gone.length)n.progress.history.push({id:uid('history'),type:'config-archive',activityIds:gone,at:new Date().toISOString()});if(!c.weeks.some(w=>w.id===n.progress.settings.activeCycle))n.progress.settings.activeCycle=c.weeks[0].id;n.progress.settings.preferredTracks=n.progress.settings.preferredTracks.filter(t=>c.tracks.some(x=>x.code===t));return n;}
function validateBundle(b){
 if(!obj(b)||b.schemaVersion!==SCHEMA)throw Error('Unsupported backup schema. Expected schema 8.');assertConfig(b.config);scanUnsafe(b.progress);const p=b.progress;if(!obj(p))throw Error('Missing progress.');
 for(const k of ['records','events','cycleNotes','projects','resources','jobs','credentials','profile','settings','baseline'])if(!obj(p[k]))throw Error('Malformed progress.'+k);
 for(const k of ['sessions','history','retrospectives','purchases','recovery'])if(!Array.isArray(p[k]))throw Error('Malformed progress.'+k);
 const base=p.baseline;if(!finite(base.xp)||!finite(base.augPoints)||!obj(base.stats)||!Object.values(base.stats).every(finite)||!['augmentations','rewards','achievements'].every(k=>Array.isArray(base[k])))throw Error('Malformed legacy balance.');
 for(const [id,r]of Object.entries(p.records)){if(!idOK(id)||!obj(r)||typeof r.completed!=='boolean'||(r.legacyHours!==undefined&&!finite(r.legacyHours)))throw Error('Malformed activity record: '+id);for(const k of ['note','link','checkpoint'])if(r[k]!==undefined&&typeof r[k]!=='string')throw Error('Invalid record text: '+id);for(const k of ['deferred','demonstrated','legacyCredit'])if(r[k]!==undefined&&typeof r[k]!=='boolean')throw Error('Invalid record flag: '+id);}
 for(const [id,e]of Object.entries(p.events)){if(!obj(e)||e.activityId!==id||!idOK(id)||!finite(e.xp)||typeof e.active!=='boolean'||!obj(e.stats)||!Object.values(e.stats).every(finite)||!Array.isArray(e.tracks)||e.tracks.some(t=>typeof t!=='string')||e.active!==!!p.records[id]?.completed)throw Error('Malformed completion event: '+id);if(e.localDay!==null&&!validDay(e.localDay))throw Error('Invalid completion day.');if(e.reward!==null&&!obj(e.reward))throw Error('Invalid reward.');}
 for(const [id,r]of Object.entries(p.records))if(r.completed&&!p.events[id])throw Error('Completed record is missing its event: '+id);
 const sessions=new Set();for(const s of p.sessions){if(!obj(s)||!idOK(s.id)||sessions.has(s.id)||!idOK(s.activityId)||!finite(s.minutes)||s.minutes<=0||s.minutes>1440||!validDay(s.localDay)||typeof s.active!=='boolean')throw Error('Malformed or duplicate session.');sessions.add(s.id);}
 const st=p.settings;if(!finite(st.weeklyHours)||st.weeklyHours>168||!finite(st.sessionMinutes)||st.sessionMinutes<1||st.sessionMinutes>1440||!['all','reading','hands-on','audio','video','app'].includes(st.format)||!Array.isArray(st.preferredTracks)||!st.preferredTracks.every(t=>b.config.tracks.some(x=>x.code===t))||!b.config.weeks.some(w=>w.id===st.activeCycle)||!['includeStretch','quiet','celebrate'].every(k=>typeof st[k]==='boolean'))throw Error('Invalid planner settings.');
 for(const [id,c]of Object.entries(p.credentials))if(!idOK(id)||!obj(c)||typeof c.issuer!=='string'||typeof c.reference!=='string'||typeof c.active!=='boolean')throw Error('Malformed credential.');
 for(const [id,j]of Object.entries(p.projects)){if(!idOK(id)||!obj(j)||!Array.isArray(j.subtasks)||j.subtasks.some(t=>!idOK(t.id)||typeof t.text!=='string'||typeof t.done!=='boolean')||new Set(j.subtasks.map(t=>t.id)).size!==j.subtasks.length)throw Error('Malformed project.');}
 for(const [id,j]of Object.entries(p.jobs))if(!idOK(id)||!obj(j)||typeof j.company!=='string'||(j.custom!==undefined&&typeof j.custom!=='boolean'))throw Error('Malformed recruitment record.');
 for(const [id,r]of Object.entries(p.resources))if(!idOK(id)||!['N/A','Started','Completed'].includes(r))throw Error('Malformed resource status.');
 for(const [id,text]of Object.entries(p.cycleNotes))if(!idOK(id)||typeof text!=='string')throw Error('Malformed cycle note.');
 for(const r of p.retrospectives)if(!obj(r)||typeof r.text!=='string'||!Number.isInteger(r.atWeek)||r.atWeek<1)throw Error('Malformed retrospective.');
 for(const r of base.rewards)if(!obj(r)||typeof r.reward!=='string')throw Error('Malformed legacy reward.');
 if(!base.augmentations.every(idOK)||!base.achievements.every(idOK))throw Error('Malformed legacy identifiers.');
 for(const r of p.recovery)if(!obj(r)||!idOK(r.id)||typeof r.kind!=='string'||typeof r.reason!=='string'||typeof r.resolved!=='boolean')throw Error('Malformed recovery archive.');
 for(const r of p.history)if(!obj(r)||!idOK(r.id)||typeof r.type!=='string')throw Error('Malformed event history.');
 const purchases=new Set();for(const x of p.purchases){if(!obj(x)||!idOK(x.augmentationId)||typeof x.active!=='boolean'||purchases.has(x.augmentationId))throw Error('Malformed augmentation purchase.');purchases.add(x.augmentationId);}
 return b;
}
function parse(text){const v=JSON.parse(text);scanUnsafe(v);return v;}
function migrate(raw,c,confirmOriginal=false){
 scanUnsafe(raw);if(!obj(raw)||!obj(raw.activities)||!obj(raw.rpg))throw Error('This is not a recognized legacy save.');const b=fresh(c),p=b.progress;p.migration={at:new Date().toISOString(),confirmedOriginal:confirmOriginal,raw:clone(raw),note:'Legacy balances are preserved as an unreconciled opening balance. Historical bonuses, rewards and UTC streak dates cannot be reconstructed reliably. Legacy undo changes completion only; no legacy XP is re-awarded.'};
 const r=raw.rpg;p.baseline={xp:finite(r.totalXP)?r.totalXP:0,stats:obj(r.stats)?Object.fromEntries(Object.entries(r.stats).filter(([k,v])=>idOK(k)&&finite(v))):{},augPoints:finite(r.augPoints)?r.augPoints:0,augmentations:Array.isArray(r.augmentations)?clone(r.augmentations):[],rewards:Array.isArray(r.rewardHistory)?clone(r.rewardHistory):[],achievements:Array.isArray(raw.achievements)?clone(raw.achievements):[],legacyCreds:finite(r.credsEarned)?r.credsEarned:0};
 p.profile={name:String(r.name||''),callsign:String(r.callsign||''),classId:c.rpg.classes.some(x=>x.id===r.classId)?r.classId:c.rpg.classes.at(-1).id,missionStatement:String(r.missionStatement||'')};p.settings.quiet=raw.quietRewards!==false;p.retrospectives=Array.isArray(r.retrospectives)?clone(r.retrospectives):[];
 const items=all(c);const quarantine=(kind,key,value,reason,candidates=[])=>p.recovery.push({id:uid('recovery'),kind,key,value:clone(value),reason,candidates,resolved:false});
 function importRecord(id,d){if(!obj(d)){quarantine('activity',id,d,'Malformed record');return;}const h=Number(d.actualHrs||0);p.records[id]={...record(b,id),completed:!!d.completed,note:String(d.note||''),legacyHours:Number.isFinite(h)&&h>=0?h:0,completedAt:d.completedAt||null,legacyCredit:!!d.completed,legacySource:clone(d)};if(d.completed){const a=items.find(a=>a.id===id);p.events[id]={id:'completion-'+id,activityId:id,title:a.title,kind:a.kind,tracks:a.tracks,xp:0,stats:{},active:true,legacy:true,firstAt:d.completedAt||null,localDay:null,reward:null};}}
 for(const [key,d]of Object.entries(raw.activities)){let matches=[];if(items.some(a=>a.id===key))matches=[key];else if(d?.name)matches=items.filter(a=>a.title===d.name).map(a=>a.id);else if(confirmOriginal){const m=key.match(/^w(\d+)_a(\d+)$/);if(m){const id='act-'+m[1].padStart(2,'0')+'-'+String(+m[2]+1).padStart(2,'0');if(items.some(a=>a.id===id))matches=[id];}}
  if(matches.length===1&&!p.records[matches[0]])importRecord(matches[0],d);else if(d?.completed||d?.note||d?.actualHrs||Object.keys(d||{}).some(k=>!['completed','actualHrs'].includes(k)))quarantine('activity',key,d,matches.length>1?'Ambiguous title':'Position has no verified configuration identity',matches);
 }
 for(const [field,kind]of [['bonusQuests','quest'],['leadershipStatus','leadership']])for(const [id,d]of Object.entries(raw[field]||{})){if(items.some(a=>a.id===id&&a.kind===kind))importRecord(id,d);else quarantine('activity',id,d,'Unmatched legacy ID');}
 for(const [id,d]of Object.entries(raw.projectData||{})){if(c.projects.some(a=>a.id===id)&&obj(d)&&Array.isArray(d.subtasks))p.projects[id]=clone(d);else quarantine('project',id,d,'Unmatched or malformed project');}
 for(const [key,d]of Object.entries(raw.weekNotes||{})){const w=confirmOriginal?c.weeks.find(w=>'w'+w.num===key):null;if(w)p.cycleNotes[w.id]=String(d);else if(d)quarantine('cycleNote',key,d,'Cycle identity needs review');}
 for(const [key,d]of Object.entries(raw.resourceStatus||{})){const item=confirmOriginal&&/^r\d+$/.test(key)?c.resources[+key.slice(1)]:null;if(item)p.resources[item.id]=d;else if(d!=='N/A')quarantine('resource',key,d,'Resource position needs review');}
 for(const [key,d]of Object.entries(raw.jobData||{})){const m=key.match(/^([A-Z]+)_(\d+)$/),tr=m&&c.jobTracks.find(t=>t.code===m[1]);let j=tr?.companies.filter(j=>j.name===d.company)||[];if(j.length===1)p.jobs[j[0].id]={...clone(d),track:tr.code};else quarantine('job',key,d,'Company identity needs review');}
 for(const j of raw.customJobs||[])if(idOK(j.id))p.jobs[j.id]={...clone(j),custom:true};else quarantine('job',String(j.id),j,'Invalid custom company ID');
 // Start dates and all unknown fields remain byte-for-byte as JSON values in migration.raw.
 return validateBundle(b);
}
function resolveRecovery(b,recoveryId,targetId){const q=b.progress.recovery.find(q=>q.id===recoveryId);if(!q||q.resolved)throw Error('Recovery record unavailable.');if(q.kind!=='activity')throw Error('Use the raw recovery export for this record type.');if(b.progress.records[targetId])throw Error('Target already has a record. Export and review both; no overwrite was made.');const a=all(b.config).find(a=>a.id===targetId);if(!a||!obj(q.value))throw Error('Choose a valid activity and record.');const d=q.value,h=Number(d.actualHrs||0);b.progress.records[targetId]={...record(b,targetId),completed:!!d.completed,note:String(d.note||''),legacyHours:Number.isFinite(h)&&h>=0?h:0,legacyCredit:!!d.completed,legacySource:clone(d)};if(d.completed)b.progress.events[targetId]={id:'completion-'+targetId,activityId:targetId,title:a.title,kind:a.kind,tracks:a.tracks,xp:0,stats:{},active:true,legacy:true,firstAt:d.completedAt||null,localDay:null,reward:null};q.resolved=true;q.targetId=targetId;}
return {SCHEMA,KEY,LEGACY_KEY,clone,obj,idOK,finite,day,validDay,shiftDay,weekStart,uid,safeURL,hash,all,mode,validateConfig,assertConfig,fresh,record,hours,difficulty,rankFromXP,complete,bulk,addSession,defer,streak,progression,prerequisite,recommend,applyConfig,validateBundle,parse,migrate,resolveRecovery};
})();
if(typeof module!=='undefined')module.exports=Engine;
