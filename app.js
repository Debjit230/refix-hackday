const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
function scrollToSection(id){document.getElementById(id)?.scrollIntoView({behavior:'smooth'})}

const conditions={working:0,partial:-8,dead:-25};let selectedCondition='working';
$$('.condition-btn').forEach(btn=>btn.addEventListener('click',()=>{$$('.condition-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');selectedCondition=btn.dataset.condition}));

const profiles={
 phone:{base:88,waste:180,name:'Smartphone'},laptop:{base:84,waste:2000,name:'Laptop'},tablet:{base:86,waste:420,name:'Tablet'},headphones:{base:76,waste:90,name:'Headphones / Earbuds'},charger:{base:70,waste:90,name:'Charger / Adapter'},other:{base:68,waste:350,name:'Other electronics'}
};
const problemAdjust={battery:0,heat:-8,screen:-14,power:-18,slow:2,physical:-16};
const problemText={battery:'Battery wear is a common, often serviceable failure mode.',heat:'Heat can indicate airflow, battery or power-management issues and should be checked safely.',screen:'Display damage may be repairable depending on parts availability and device age.',power:'A no-power symptom can have several causes; start with safe power and charging checks.',slow:'Slowness may be software-related and does not automatically mean the device is end-of-life.',physical:'Physical damage should be assessed for repairability and electrical safety before reuse.'};
$('#diagnosisForm').addEventListener('submit',e=>{e.preventDefault();const device=$('#device').value,problem=$('#problem').value,age=+$('#age').value;let score=profiles[device].base+problemAdjust[problem]+conditions[selectedCondition]-(age>5?12:age>2?4:0);score=Math.max(18,Math.min(97,score));let action='REPAIR',icon='🔧',title='Repair looks practical.',next='Check the suspected component and compare repair cost with replacement.',summary=problemText[problem];if(score<48||selectedCondition==='dead'&&age>5){action='RECYCLE';icon='♻️';title='Responsible recycling may be the better path.';next='Avoid general waste; use a verified electronics recycling route.'}else if(score<67){action='REUSE / DONATE';icon='🤝';title='Consider reuse before replacement.';next='If the device still has useful life, refurbish, donate or repurpose it.'}let waste=Math.round(profiles[device].waste*(score/100));$('#resultEmpty').classList.add('hidden');$('#resultContent').classList.remove('hidden');$('#confidence').textContent=Math.max(70,Math.min(97,score+8))+'% confidence';$('#resultTitle').textContent=title;$('#resultSummary').textContent=summary;$('#repairScore').textContent=score;$('#repairBar').style.width=score+'%';$('#waste').textContent=waste;$('#actionBadge').textContent=icon+' '+action;$('#recIcon').textContent=icon;$('#nextAction').textContent=next;localStorage.setItem('refixLastResult',JSON.stringify({device,problem,score,action,waste}));scrollToSection('resultPanel')});

const inputs=$$('.calc-row input');function updateImpact(){let total=0;inputs.forEach(i=>total+=Math.max(0,+i.value||0)*(+i.dataset.kg));total=Math.round(total*100)/100;$('#impactTotal').textContent=total.toFixed(2);$('#recoverable').textContent=(total*.64).toFixed(2)+' kg';$('#impactBar').style.width=Math.min(92,Math.max(8,total/6*100))+'%'}inputs.forEach(i=>i.addEventListener('input',updateImpact));updateImpact();

$$('.circle-btn').forEach(btn=>btn.addEventListener('click',()=>showToast('In the production version, this opens verified directions.')));
function showToast(t){const x=$('#toast');x.textContent=t;x.classList.add('show');setTimeout(()=>x.classList.remove('show'),2200)}

const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.12});$$('.reveal').forEach(el=>io.observe(el));

$$('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const id=a.getAttribute('href').slice(1);if(id&&document.getElementById(id)){e.preventDefault();scrollToSection(id)}}));

window.addEventListener('load',()=>{const r=localStorage.getItem('refixLastResult');if(r){try{const x=JSON.parse(r);showToast('Welcome back — your last diagnosis is saved locally.')}catch{}}});
