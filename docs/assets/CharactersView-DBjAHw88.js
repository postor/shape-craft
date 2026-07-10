import{h as Ct,c as et,i as ot,C as dt,k as At,m as Lt,e as ut,a as pt,d as St,f as wt,b as xt,v as G,g as qt,n as Nt,j as mt,P as Tt}from"./index-BMP5JURj.js";import{u as Mt}from"./scene-graph-DdH_P7zb.js";import{V as Rt}from"./three-view-9LBvUaJG.js";import{t as ft,s as jt}from"./transform-ui-BA30VBPc.js";import{c as It}from"./ruler-Drd-pUsa.js";import{f as at,b as Pt,r as Ht}from"./instance-D8Blx1Z_.js";import{C as Ft}from"./character-anim-BH4CjJkQ.js";import"./OrbitControls-zx1pWSMR.js";import"./TransformControls-DLnrXjt5.js";async function Bt(y,h,k){var it;const b=document.createElement("div");b.className="editor-page",y.appendChild(b);let i,C=k,A=dt.includes(h??"")?h:"humanoid";if(k){const t=await Ct(k);t?(i=t,t.characterType&&(A=t.characterType)):i=et("Untitled","character")}else i={...et(A,"character"),...ot(A)};const _=document.createElement("div");_.className="editor-layout";const T=document.createElement("div");T.className="panel hierarchy";const z=document.createElement("div");z.className="panel viewport-panel";const M=document.createElement("div");M.className="panel inspector",_.append(T,z,M),b.appendChild(_);const w=document.createElement("div");w.className="toolbar",w.innerHTML=`
    <div class="toolbar-row">
      <span class="muted">类别：</span>
      ${dt.map(t=>`<button class="chip ${t===A?"active":""}" data-type="${t}">${At[t]}</button>`).join("")}
    </div>
    <div class="toolbar-row">
      <span class="muted">变换：</span>
      <button class="btn small mode active" data-mode="rotate">旋转</button>
      <button class="btn small mode" data-mode="translate">拖拽</button>
      <button class="btn small mode" data-mode="scale">缩放</button>
      <span class="sep"></span>
      <button class="btn small" data-shot>📷 截图</button>
    </div>
    <div class="toolbar-row">
      <span class="muted">添加：</span>
      <button class="btn small" data-add="box">Box</button>
      <button class="btn small" data-add="sphere">Sphere</button>
      <button class="btn small" data-add="cylinder">Cylinder</button>
      <button class="btn small" data-add="cone">Cone</button>
      <button class="btn small" data-add="plane">Plane</button>
      <button class="btn small" data-add="node">Node</button>
    </div>
    <div class="toolbar-row">
      <span class="muted">引用：</span>
      <select class="ref-select" data-ref-select><option value="">选择元件…</option></select>
      <button class="btn small" data-insert-ref>插入引用</button>
    </div>
  `,z.appendChild(w);const U=document.createElement("div");U.className="viewport-host",z.appendChild(U);const m=new Rt(U,t=>j(t),(t,a)=>yt(t,a));y.__dispose=()=>{try{m.dispose()}catch{}};const $=new Ft(m.getRootGroup());$.setClips(d()),m.onFrame(t=>$.update(t));const bt=It(U),g=document.createElement("div");g.className="editor-topbar",g.innerHTML=`
    <a class="btn small" href="#/library">← 返回</a>
    <input class="name-input" type="text" value="${i.name}" />
    <span class="badge">${Lt("character")}</span>
    <button class="btn primary" data-save>保存</button>
    ${C?'<button class="btn danger" data-del>删除</button>':""}
    <span class="save-state"></span>
  `,b.insertBefore(g,_);let v=null,x=null;const R=new Set;let o=null;function d(){return i.animClips||(i.animClips=Dt(Nt[A])),i.animClips}function L(){$.setClips(d()),$.rebind(m.getRootGroup()),x&&$.play(x)}function vt(){const t=[],a=l=>{l.shape==="node"&&t.push(l.name),l.children.forEach(a)};return a(i.root),t}T.addEventListener("click",t=>{const a=t.target.closest(".row-del");if(!a)return;const l=a.getAttribute("data-del-id");l&&(J(i.root,l),v===l&&(v=null),q())});function V(){T.innerHTML='<h4>骨架层级</h4><div class="tree"></div>',T.querySelector(".tree").appendChild(nt(i.root,!0))}function nt(t,a){const l=document.createElement("div");l.className="tree-row"+(m.getSelectedId()===t.id?" selected":"");const r=t.shape==="instance"?'<span class="lock" title="实例引用（整体锁定）">🔒</span>':"";l.innerHTML=`<span class="dot ${t.shape}"></span><span class="pname">${t.name}</span><span class="pshape">${t.shape}</span>${r}<button class="row-del" title="删除" data-del-id="${t.id}">×</button>`,l.addEventListener("click",p=>{p.target.classList.contains("row-del")||j(t.id)});const u=document.createElement("div");if(u.appendChild(l),t.children.length){const p=document.createElement("div");p.className="tree-kids";for(const K of t.children)p.appendChild(nt(K,!1));u.appendChild(p)}return a&&u.classList.add("root-node"),u}function j(t){v=t,m.setSelected(t),V(),Y()}function yt(t,a){const l=at(i.root,t);l&&(l.position=a.position,l.rotation=a.rotation,l.scale=a.scale,Y())}function st(){M.innerHTML=`
      <h4>动画 Animation</h4>
      <div class="anim-panel"></div>
      <h4>属性 Inspector</h4>
      <div class="inspector-body"></div>
    `,S(M.querySelector(".anim-panel")),Y()}function S(t){const a=d(),l=vt(),r=e=>Math.round(e*180/Math.PI),u=(e,n,s,c)=>`<span class="kf-dot${o&&o.clip===e&&o.track===n&&o.kf===c?" selected":""}" style="left:${(s.t*100).toFixed(2)}%" data-kf="${e}:${n}:${c}" title="t=${s.t.toFixed(2)} · ${r(s.value)}°"></span>`,p=(e,n,s)=>`
      <div class="track-row">
        <span class="track-label" title="${n.joint}">${n.joint}·${n.axis}</span>
        <div class="timeline" data-timeline="${e}:${s}">
          ${n.keyframes.map((c,f)=>u(e,s,c,f)).join("")}
          <span class="tl-zero">0</span><span class="tl-one">1</span>
        </div>
        <button class="row-del" title="删除轨道" data-del-track="${e}:${s}">×</button>
      </div>`,K=e=>{if(!o||o.clip!==e)return"";const n=a[e].tracks[o.track],s=n.keyframes[o.kf];return`<div class="kf-editor">
        <span class="kf-tag">选中关键帧：${n.joint} · ${n.axis}</span>
        <label class="mini">值°<input type="number" step="1" value="${r(s.value)}" data-kf-val="${e}:${o.track}:${o.kf}"/></label>
        <button class="btn tiny danger" data-kf-del="${e}:${o.track}:${o.kf}">删除关键帧</button>
      </div>`},O=(e,n)=>`
      <div class="clip-body">
        <label class="mini">时长(s)<input type="number" step="0.1" min="0.1" value="${n.duration}" data-clip-dur="${e}"/></label>
        <div class="track-builder">
          <label class="mini">引用节点<input list="bone-list" value="${l[0]??""}" data-builder-joint="${e}"/></label>
          <span class="axis-checks">
            ${["x","y","z"].map(s=>`<label><input type="checkbox" data-builder-axis="${e}:${s}"/>${s.toUpperCase()}</label>`).join("")}
          </span>
          <button class="btn tiny" data-add-tracks="${e}">＋ 添加轨道</button>
          <span class="muted tiny-hint">勾选轴后，为该节点一次生成多条轨道</span>
        </div>
        <div class="tracks">${n.tracks.map((s,c)=>p(e,s,c)).join("")}</div>
        ${K(e)}
      </div>`,W=a.map((e,n)=>{const s=!R.has(n);return`
        <div class="clip-card ${x===e.name?"active":""}" data-clip="${n}">
          <div class="clip-head">
            <button class="btn tiny play-clip" data-play-clip="${n}">▶</button>
            <input class="clip-label" type="text" value="${e.label}" data-clip-label="${n}"/>
            <input class="clip-name" type="text" value="${e.name}" data-clip-name="${n}" title="槽位标识"/>
            <button class="row-del" title="删除槽位" data-del-clip="${n}">×</button>
            <button class="btn tiny" data-toggle-clip="${n}">${s?"收起":"展开"}</button>
          </div>
          ${s?O(n,e):""}
        </div>`}).join("");t.innerHTML=`
      <datalist id="bone-list">${l.map(e=>`<option value="${e}">`).join("")}</datalist>
      <div class="anim-buttons">
        <button class="btn small primary" data-add-clip>+ 新增槽位</button>
      </div>
      <div class="clip-list">${W}</div>
      <div class="anim-controls">
        <button class="btn small" data-play>⏸ 暂停</button>
        <label class="field"><span>速度 Speed</span>
          <input type="range" min="0.1" max="3" step="0.1" value="1" data-speed />
        </label>
        <label class="field"><span>朝向角度 Yaw</span>
          <input type="range" min="-180" max="180" step="1" value="0" data-yaw />
        </label>
      </div>
      <p class="muted anim-hint">脚本槽位 = 一段动画。先选“引用节点”，勾选 X/Y/Z 一次生成多条轨道；在轨道时间轴上<strong>点空白加关键帧、点圆点选中并拖动改时间</strong>，选中后在下方填角度（度）即可驱动该节点旋转。</p>
    `,t.querySelectorAll("[data-play-clip]").forEach(e=>e.addEventListener("click",()=>{const n=Number(e.getAttribute("data-play-clip")),s=d()[n];s&&(x=s.name,$.play(s.name),t.querySelectorAll(".clip-card").forEach(c=>c.classList.remove("active")),e.closest(".clip-card").classList.add("active"),t.querySelector("[data-play]").textContent="⏸ 暂停")})),t.querySelector("[data-play]").addEventListener("click",e=>{const n=e.target,s=!$.isPlaying();$.setPlaying(s),n.textContent=s?"⏸ 暂停":"▶ 播放"});const P=t.querySelector("[data-speed]");P.addEventListener("input",()=>$.setSpeed(parseFloat(P.value)||1));const H=t.querySelector("[data-yaw]");H.addEventListener("input",()=>{const e=parseFloat(H.value)*Math.PI/180;m.getRootGroup().rotation.y=e}),t.querySelectorAll("[data-clip-label]").forEach(e=>e.addEventListener("input",()=>{d()[Number(e.getAttribute("data-clip-label"))].label=e.value})),t.querySelectorAll("[data-clip-name]").forEach(e=>e.addEventListener("input",()=>{d()[Number(e.getAttribute("data-clip-name"))].name=e.value})),t.querySelectorAll("[data-clip-dur]").forEach(e=>e.addEventListener("input",()=>{const n=Number(e.getAttribute("data-clip-dur"));d()[n].duration=Math.max(.1,parseFloat(e.value)||1),L()})),t.querySelectorAll("[data-timeline]").forEach(e=>e.addEventListener("pointerdown",n=>{n.preventDefault();const[s,c]=e.getAttribute("data-timeline").split(":").map(Number),f=n.target.closest(".kf-dot");let E;if(f)E=Number(f.getAttribute("data-kf").split(":")[2]);else{const Z=e.getBoundingClientRect(),B=Math.min(1,Math.max(0,(n.clientX-Z.left)/Z.width)),D=d()[s].tracks[c].keyframes;D.push({t:B,value:0}),E=D.length-1}o={clip:s,track:c,kf:E};const N=Z=>{const B=t.querySelector(`[data-timeline="${s}:${c}"]`);if(!B)return;const D=B.getBoundingClientRect(),rt=Math.min(1,Math.max(0,(Z.clientX-D.left)/D.width));d()[s].tracks[c].keyframes[E].t=rt;const ct=B.querySelector(`[data-kf="${s}:${c}:${E}"]`);ct&&(ct.style.left=(rt*100).toFixed(2)+"%"),L()},F=()=>{window.removeEventListener("pointermove",N),window.removeEventListener("pointerup",F),S(t)};window.addEventListener("pointermove",N),window.addEventListener("pointerup",F),S(t)})),t.querySelectorAll("[data-add-tracks]").forEach(e=>e.addEventListener("click",()=>{const n=Number(e.getAttribute("data-add-tracks")),c=t.querySelector(`[data-builder-joint="${n}"]`).value.trim()||l[0]||"joint.root",f=d()[n].tracks;for(const E of["x","y","z"]){const N=t.querySelector(`[data-builder-axis="${n}:${E}"]`);N!=null&&N.checked&&!f.some(F=>F.joint===c&&F.axis===E)&&f.push({joint:c,axis:E,keyframes:[{t:0,value:0},{t:1,value:0}]})}L(),S(t)})),t.querySelectorAll("[data-kf-val]").forEach(e=>e.addEventListener("input",()=>{const[n,s,c]=e.getAttribute("data-kf-val").split(":").map(Number);d()[n].tracks[s].keyframes[c].value=(parseFloat(e.value)||0)*(Math.PI/180),L()})),t.querySelectorAll("[data-kf-del]").forEach(e=>e.addEventListener("click",()=>{const[n,s,c]=e.getAttribute("data-kf-del").split(":").map(Number),f=d()[n].tracks[s].keyframes;f.length>1&&f.splice(c,1),o&&o.clip===n&&o.track===s&&o.kf===c&&(o=null),L(),S(t)})),t.querySelectorAll("[data-del-track]").forEach(e=>e.addEventListener("click",()=>{const[n,s]=e.getAttribute("data-del-track").split(":").map(Number);d()[n].tracks.splice(s,1),o&&o.clip===n&&o.track===s&&(o=null),L(),S(t)})),t.querySelectorAll("[data-del-clip]").forEach(e=>e.addEventListener("click",()=>{const n=Number(e.getAttribute("data-del-clip"));d().splice(n,1),o&&o.clip===n&&(o=null),L(),S(t)})),t.querySelectorAll("[data-toggle-clip]").forEach(e=>e.addEventListener("click",()=>{const n=Number(e.getAttribute("data-toggle-clip"));R.has(n)?R.delete(n):R.add(n),S(t)})),t.querySelector("[data-add-clip]").addEventListener("click",()=>{const e=d(),n=e.filter(s=>s.name.startsWith("custom")).length+1;e.push({name:`custom${n}`,label:`Custom ${n}`,duration:1,tracks:[]}),L(),S(t)})}function Y(){const t=M.querySelector(".inspector-body"),a=v?at(i.root,v):null;if(t.innerHTML="",!a){t.innerHTML='<p class="muted">在视图或骨架中选中一个节点以编辑其变换与材质。</p>';return}t.appendChild(ht(a))}function ht(t){if(t.shape==="instance")return kt(t);const a=document.createElement("div");a.className="inspector-form";const l=document.createElement("label");l.className="field full",l.innerHTML="<span>名称</span>";const r=document.createElement("input");r.value=t.name,r.addEventListener("input",()=>{t.name=r.value,V()}),l.appendChild(r),a.appendChild(l),a.appendChild(ft("位置 Position",t.position,p=>{t.position=p,I()})),a.appendChild(ft("旋转 Rotation (rad)",t.rotation,p=>{t.rotation=p,I()})),a.appendChild(jt(t.scale,p=>{t.scale=p,I()}));const u=document.createElement("button");return u.className="btn small danger full",u.textContent="删除此部件",u.addEventListener("click",()=>{J(i.root,t.id),v=null,q()}),a.appendChild(u),a}function kt(t){const a=document.createElement("div");a.className="inspector-form",a.innerHTML=`
      <div class="group">
        <div class="group-title">实例引用 Instance</div>
        <p class="muted">该部件整体引用了另一个元件，内部细节不可在此编辑。</p>
        <label class="field full"><span>名称</span></label>
        <input class="inst-name" type="text" value="${t.name}" />
        <label class="field full"><span>引用 ID</span></label>
        <input class="inst-ref" type="text" value="${t.refId??""}" readonly />
      </div>
    `;const l=a.querySelector(".inst-name");l.addEventListener("input",()=>{t.name=l.value,V()});const r=document.createElement("a");r.className="btn small full",r.textContent="打开原件编辑器 →",r.href=`#/editor/${t.refId}`,a.appendChild(r);const u=document.createElement("button");return u.className="btn small danger full",u.textContent="删除此引用",u.addEventListener("click",()=>{J(i.root,t.id),v=null,q()}),a.appendChild(u),a}function $t(t){let a=v&&at(i.root,v)||i.root;a.shape==="instance"&&(a=i.root);const l=t==="node",r=wt({shape:t,name:l?`Node ${a.children.length+1}`:`${t[0].toUpperCase()}${t.slice(1)} ${a.children.length+1}`,material:qt(t==="sphere"||t==="cone"?"#4caf50":"#cccccc"),size:t==="box"?G(.3,.3,.3):t==="sphere"?G(.2,.2,.2):t==="plane"?G(.5,.5,1):G(.15,.5,.15),position:G(0,l?0:.2,0)});a.children.push(r),j(r.id),I()}function I(){return Ht(i.root).then(t=>{m.setRoot(i.root,a=>t.get(a)??null),$.rebind(m.getRootGroup()),v&&m.setSelected(v)})}function q(){I(),bt(m.getDimensions()),V(),Y()}async function lt(){const t=w.querySelector("[data-ref-select]");if(!t)return;const a=await ut(),l=t.value;t.innerHTML='<option value="">选择元件…</option>'+a.filter(r=>r.id!==C).map(r=>`<option value="${r.id}">${r.name} · ${r.category}</option>`).join(""),a.some(r=>r.id===l)&&(t.value=l)}w.addEventListener("click",async t=>{var O,W,P,H,e;const a=t.target,l=(O=a.getAttribute)==null?void 0:O.call(a,"data-type"),r=(W=a.getAttribute)==null?void 0:W.call(a,"data-mode"),u=(P=a.hasAttribute)==null?void 0:P.call(a,"data-shot"),p=(H=a.getAttribute)==null?void 0:H.call(a,"data-add");if(p){$t(p);return}if((e=a.hasAttribute)==null?void 0:e.call(a,"data-insert-ref")){const n=w.querySelector("[data-ref-select]"),s=n==null?void 0:n.value;if(!s)return;const c=(await ut()).find(E=>E.id===s),f=Pt({root:i.root,selectedId:v,refId:s,refName:(c==null?void 0:c.name)??"Instance"});j(f.id),q();return}if(l&&l!==A){A=l,i={...et(A,"character"),...ot(A)},C=void 0,R.clear();const n=d()[0];x=n?n.name:null,L(),g.querySelector(".name-input").value=i.name,j(null),q(),st();return}r&&(m.setTransformMode(r),w.querySelectorAll(".mode").forEach(n=>n.classList.remove("active")),a.classList.add("active")),u&&(i.thumbnail=m.captureThumbnail(),C?(pt(C,Q()),X("已截图并保存 ✓")):X("已截图（保存后将按当前视图刷新）"))});function X(t){g.querySelector(".save-state").textContent=t}function gt(){if(!g.querySelector("[data-del]")){const t=document.createElement("button");t.className="btn danger",t.setAttribute("data-del",""),t.textContent="删除",g.insertBefore(t,g.querySelector(".save-state"))}}function Q(){return{name:i.name,category:i.category,description:i.description,root:i.root,thumbnail:i.thumbnail,characterType:A,animClips:d()}}async function Et(){const t=g.querySelector(".name-input").value||"Untitled";i.name=t,i.category="character",i.thumbnail=m.captureThumbnail();try{if(C)return await pt(C,Q()),"updated";const a=await xt(Q());return C=a.id,i.id=a.id,i.createdAt=a.createdAt,i.updatedAt=a.updatedAt,gt(),lt(),"created"}catch(a){return X("保存失败："+a.message),"failed"}}g.querySelector("[data-save]").addEventListener("click",async()=>{await Et()!=="failed"&&X("已保存到元件库 ✓")}),(it=g.querySelector("[data-del]"))==null||it.addEventListener("click",async()=>{C&&confirm("确定删除该角色？")&&(await St(C),location.hash="#/library")}),st(),lt();const tt=d()[0];tt&&(x=tt.name,$.play(tt.name)),q()}function Dt(y){return y.map(h=>({...h,tracks:h.tracks.map(k=>({...k,keyframes:k.keyframes.map(b=>({...b}))}))}))}function J(y,h){const k=y.children.findIndex(b=>b.id===h);if(k!==-1)return y.children.splice(k,1),!0;for(const b of y.children)if(J(b,h))return!0;return!1}function Wt({type:y,id:h}){const k=Mt(b=>{Bt(b,y,h)},`${y}|${h}`);return mt.jsx(Tt,{active:"characters",children:mt.jsx("div",{className:"canvas-host",ref:k})})}export{Wt as CharactersView};
