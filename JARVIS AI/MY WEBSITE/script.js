const $=s=>document.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const tk=n=>"৳"+Number(n||0).toLocaleString("en-IN");
const today=()=>new Date().toISOString().slice(0,10);
let C={},sel=null;
const paid=c=>(c.pays||[]).reduce((s,r)=>s+(+r.amt||0),0);
const due=c=>(+c.total||0)-paid(c);
const cls=n=>n>0?"red":"ok";

function renderList(){
  const q=$("#q").value.trim().toLowerCase();
  const ids=Object.keys(C).filter(id=>(C[id].name+" "+C[id].acct+" "+C[id].phone).toLowerCase().includes(q))
    .sort((a,b)=>(C[a].name||"").localeCompare(C[b].name||""));
  $("#list").innerHTML=ids.length?ids.map(id=>{const c=C[id],b=due(c);
    return `<button class="it${id===sel?" on":""}" data-id="${esc(id)}"><span>${esc(c.name)||"(naam nei)"}<small>Account No: ${esc(c.acct||"-")}</small></span><span class="b ${cls(b)}">${tk(b)}</span></button>`}).join(""):
    `<div class="empty">Kono customer nei.</div>`;
  $("#all").textContent=tk(Object.values(C).reduce((s,c)=>s+Math.max(0,due(c)),0));
}
function sums(){
  const c=C[sel];if(!c)return;
  let run=+c.total||0;
  document.querySelectorAll("#ledger tbody tr").forEach((r,n)=>{run-=(+c.pays[n].amt||0);const t=r.querySelector(".bal");t.textContent=tk(run);t.className="bal "+cls(run)});
  $("#st").textContent=tk(c.total);$("#sp").textContent=tk(paid(c));
  $("#sd").textContent=tk(due(c));$("#sd").className=cls(due(c));
}
function renderDetail(){
  const c=C[sel];
  if(!c){$("#main").innerHTML='<div class="empty">Customer select koro.</div>';return}
  const f=(k,l,m)=>`<div><label>${l}<input data-f="${k}" ${m||""} value="${esc(c[k])}"></label></div>`;
  const rows=(c.pays||[]).map((r,i)=>`<tr data-i="${i}"><td><input type="date" data-k="d" value="${esc(r.d)}" aria-label="Date"></td>
    <td><input class="n" inputmode="decimal" data-k="amt" value="${esc(r.amt)}" aria-label="Payment Received"></td>
    <td class="bal"></td><td class="x"><button data-del="${i}" aria-label="Line mucho">✕</button></td></tr>`).join("");
  $("#main").innerHTML=`<div id="det"><button class="back" id="bk">← Sob customer</button>
  <div class="grid">${f("name","Customer Name")}${f("acct","Account No")}${f("phone","Number",'inputmode="tel"')}${f("product","Product Name")}${f("total","Total (৳)",'inputmode="decimal"')}</div>
  <div class="sum"><div><span>Total</span><b id="st"></b></div><div><span>Payment Received</span><b id="sp"></b></div><div><span>Current Due</span><b id="sd"></b></div></div>
  <div class="wrap" id="ledger"><table><thead><tr><th>Date</th><th class="n">Payment Received</th><th class="n">Remaining Due</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>
  <div class="act"><button class="p" id="nr">+ Notun Payment</button><button id="dc">Customer muche felo</button></div></div>`;
  sums();
}
const LS="khata-data";
function seed(){
  return {"liton-ali":{name:"Md. Liton Ali",acct:"90",phone:"01732059111",product:'LED-32"',total:"20000",
    pays:[["2022-08-13",7000],["2022-09-26",1000],["2022-11-03",1000],["2022-12-26",1000],["2023-06-05",1000],
    ["2023-07-27",1000],["2023-12-18",1000],["2024-03-09",1000],["2024-08-18",1000],["2024-10-28",2000],["2025-01-27",1000]]
    .map(([d,a])=>({d,amt:String(a)}))}};
}
function save(){
  try{localStorage.setItem(LS,JSON.stringify(C))}catch(e){
    $("#note").hidden=false;$("#note").textContent="Save hoy ni. Browser storage bondho thakte pare.";
  }
}
function show(id){sel=id;$("#app").classList.add("det");renderList();renderDetail()}

$("#list").addEventListener("click",e=>{const b=e.target.closest(".it");if(b)show(b.dataset.id)});
$("#q").addEventListener("input",renderList);
$("#main").addEventListener("input",e=>{
  const i=e.target,c=C[sel];if(!c)return;
  if(i.dataset.f)c[i.dataset.f]=i.value;
  else{const tr=i.closest("tr");if(!tr)return;c.pays[+tr.dataset.i][i.dataset.k]=i.value}
  sums();renderList();save();
});
$("#main").addEventListener("click",e=>{
  const c=C[sel],t=e.target;
  if(t.id==="bk")$("#app").classList.remove("det");
  else if(t.id==="nr"){c.pays=[...(c.pays||[]),{d:today(),amt:""}];renderDetail();save();
    const l=document.querySelector("#ledger tbody tr:last-child input[data-k=amt]");if(l)l.focus()}
  else if(t.dataset.del!==undefined){c.pays.splice(+t.dataset.del,1);renderDetail();renderList();save()}
  else if(t.id==="dc"&&confirm((c.name||"Ei customer")+" er sob hisab muche jabe. Nishchit?")){
    const id=sel;delete C[id];sel=null;$("#app").classList.remove("det");renderList();renderDetail();}
});
$("#add").onclick=()=>{$("#f").reset();$("#dlg").showModal();$("#fn").focus()};
$("#f").addEventListener("submit",e=>{
  if(e.submitter&&e.submitter.value!=="ok")return;
  const name=$("#fn").value.trim();if(!name)return;
  const id="c"+Date.now().toString(36);
  C[id]={name,phone:$("#fp").value.trim(),acct:$("#fa").value.trim(),product:$("#fr").value.trim(),total:$("#ft").value.trim(),pays:[]};
  save();show(id);
});

try{C=JSON.parse(localStorage.getItem(LS)||"null")||seed()}catch(e){C=seed()}
renderList();
