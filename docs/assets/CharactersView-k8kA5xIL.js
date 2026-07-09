import{g as Ae,c as te,k as oe,C as de,m as Le,n as Se,b as ue,d as pe,e as we,f as xe,h as Ne,v as G,i as qe,o as Te,j as me,P as Me}from"./index-DqQLpniU.js";import{u as Ie}from"./scene-graph-BBcX3L4X.js";import{V as Re}from"./three-view-BlP7s2mS.js";import{c as je}from"./ruler-DTLJ0Tp3.js";import{f as ae,b as Pe,r as He}from"./instance-Bf9YAcLc.js";import{C as Fe}from"./character-anim-BH4CjJkQ.js";import"./OrbitControls-BautoDRw.js";import"./TransformControls-BhxSwY5C.js";async function Be(h,$,k){var ie;const b=document.createElement("div");b.className="editor-page",h.appendChild(b);let c,A=k,L=de.includes($??"")?$:"humanoid";if(k){const e=await Ae(k);e?(c=e,e.characterType&&(L=e.characterType)):c=te("Untitled","character")}else c={...te(L,"character"),...oe(L)};const U=document.createElement("div");U.className="editor-layout";const j=document.createElement("div");j.className="panel hierarchy";const V=document.createElement("div");V.className="panel viewport-panel";const P=document.createElement("div");P.className="panel inspector",U.append(j,V,P),b.appendChild(U);const q=document.createElement("div");q.className="toolbar",q.innerHTML=`
    <div class="toolbar-row">
      <span class="muted">类别：</span>
      ${de.map(e=>`<button class="chip ${e===L?"active":""}" data-type="${e}">${Le[e]}</button>`).join("")}
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
  `,V.appendChild(q);const X=document.createElement("div");X.className="viewport-host",V.appendChild(X);const f=new Re(X,e=>F(e),(e,a)=>be(e,a));h.__dispose=()=>{try{f.dispose()}catch{}};const E=new Fe(f.getRootGroup());E.setClips(u()),f.onFrame(e=>E.update(e));const fe=je(X),g=document.createElement("div");g.className="editor-topbar",g.innerHTML=`
    <a class="btn small" href="#/library">← 返回</a>
    <input class="name-input" type="text" value="${c.name}" />
    <span class="badge">${Se("character")}</span>
    <button class="btn primary" data-save>保存</button>
    ${A?'<button class="btn danger" data-del>删除</button>':""}
    <span class="save-state"></span>
  `,b.insertBefore(g,U);let y=null,T=null;const H=new Set;let d=null;function u(){return c.animClips||(c.animClips=De(Te[L])),c.animClips}function w(){E.setClips(u()),E.rebind(f.getRootGroup()),T&&E.play(T)}function ve(){const e=[],a=l=>{l.shape==="node"&&e.push(l.name),l.children.forEach(a)};return a(c.root),e}j.addEventListener("click",e=>{const a=e.target.closest(".row-del");if(!a)return;const l=a.getAttribute("data-del-id");l&&(J(c.root,l),y===l&&(y=null),M())});function Z(){j.innerHTML='<h4>骨架层级</h4><div class="tree"></div>',j.querySelector(".tree").appendChild(ne(c.root,!0))}function ne(e,a){const l=document.createElement("div");l.className="tree-row"+(f.getSelectedId()===e.id?" selected":"");const i=e.shape==="instance"?'<span class="lock" title="实例引用（整体锁定）">🔒</span>':"";l.innerHTML=`<span class="dot ${e.shape}"></span><span class="pname">${e.name}</span><span class="pshape">${e.shape}</span>${i}<button class="row-del" title="删除" data-del-id="${e.id}">×</button>`,l.addEventListener("click",p=>{p.target.classList.contains("row-del")||F(e.id)});const r=document.createElement("div");if(r.appendChild(l),e.children.length){const p=document.createElement("div");p.className="tree-kids";for(const m of e.children)p.appendChild(ne(m,!1));r.appendChild(p)}return a&&r.classList.add("root-node"),r}function F(e){y=e,f.setSelected(e),Z(),K()}function be(e,a){const l=ae(c.root,e);l&&(l.position=a.position,l.rotation=a.rotation,l.scale=a.scale,K())}function se(){P.innerHTML=`
      <h4>动画 Animation</h4>
      <div class="anim-panel"></div>
      <h4>属性 Inspector</h4>
      <div class="inspector-body"></div>
    `,x(P.querySelector(".anim-panel")),K()}function x(e){const a=u(),l=ve(),i=t=>Math.round(t*180/Math.PI),r=(t,n,s,o)=>`<span class="kf-dot${d&&d.clip===t&&d.track===n&&d.kf===o?" selected":""}" style="left:${(s.t*100).toFixed(2)}%" data-kf="${t}:${n}:${o}" title="t=${s.t.toFixed(2)} · ${i(s.value)}°"></span>`,p=(t,n,s)=>`
      <div class="track-row">
        <span class="track-label" title="${n.joint}">${n.joint}·${n.axis}</span>
        <div class="timeline" data-timeline="${t}:${s}">
          ${n.keyframes.map((o,v)=>r(t,s,o,v)).join("")}
          <span class="tl-zero">0</span><span class="tl-one">1</span>
        </div>
        <button class="row-del" title="删除轨道" data-del-track="${t}:${s}">×</button>
      </div>`,m=t=>{if(!d||d.clip!==t)return"";const n=a[t].tracks[d.track],s=n.keyframes[d.kf];return`<div class="kf-editor">
        <span class="kf-tag">选中关键帧：${n.joint} · ${n.axis}</span>
        <label class="mini">值°<input type="number" step="1" value="${i(s.value)}" data-kf-val="${t}:${d.track}:${d.kf}"/></label>
        <button class="btn tiny danger" data-kf-del="${t}:${d.track}:${d.kf}">删除关键帧</button>
      </div>`},N=(t,n)=>`
      <div class="clip-body">
        <label class="mini">时长(s)<input type="number" step="0.1" min="0.1" value="${n.duration}" data-clip-dur="${t}"/></label>
        <div class="track-builder">
          <label class="mini">引用节点<input list="bone-list" value="${l[0]??""}" data-builder-joint="${t}"/></label>
          <span class="axis-checks">
            ${["x","y","z"].map(s=>`<label><input type="checkbox" data-builder-axis="${t}:${s}"/>${s.toUpperCase()}</label>`).join("")}
          </span>
          <button class="btn tiny" data-add-tracks="${t}">＋ 添加轨道</button>
          <span class="muted tiny-hint">勾选轴后，为该节点一次生成多条轨道</span>
        </div>
        <div class="tracks">${n.tracks.map((s,o)=>p(t,s,o)).join("")}</div>
        ${m(t)}
      </div>`,I=a.map((t,n)=>{const s=!H.has(n);return`
        <div class="clip-card ${T===t.name?"active":""}" data-clip="${n}">
          <div class="clip-head">
            <button class="btn tiny play-clip" data-play-clip="${n}">▶</button>
            <input class="clip-label" type="text" value="${t.label}" data-clip-label="${n}"/>
            <input class="clip-name" type="text" value="${t.name}" data-clip-name="${n}" title="槽位标识"/>
            <button class="row-del" title="删除槽位" data-del-clip="${n}">×</button>
            <button class="btn tiny" data-toggle-clip="${n}">${s?"收起":"展开"}</button>
          </div>
          ${s?N(n,t):""}
        </div>`}).join("");e.innerHTML=`
      <datalist id="bone-list">${l.map(t=>`<option value="${t}">`).join("")}</datalist>
      <div class="anim-buttons">
        <button class="btn small primary" data-add-clip>+ 新增槽位</button>
      </div>
      <div class="clip-list">${I}</div>
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
    `,e.querySelectorAll("[data-play-clip]").forEach(t=>t.addEventListener("click",()=>{const n=Number(t.getAttribute("data-play-clip")),s=u()[n];s&&(T=s.name,E.play(s.name),e.querySelectorAll(".clip-card").forEach(o=>o.classList.remove("active")),t.closest(".clip-card").classList.add("active"),e.querySelector("[data-play]").textContent="⏸ 暂停")})),e.querySelector("[data-play]").addEventListener("click",t=>{const n=t.target,s=!E.isPlaying();E.setPlaying(s),n.textContent=s?"⏸ 暂停":"▶ 播放"});const S=e.querySelector("[data-speed]");S.addEventListener("input",()=>E.setSpeed(parseFloat(S.value)||1));const D=e.querySelector("[data-yaw]");D.addEventListener("input",()=>{const t=parseFloat(D.value)*Math.PI/180;f.getRootGroup().rotation.y=t}),e.querySelectorAll("[data-clip-label]").forEach(t=>t.addEventListener("input",()=>{u()[Number(t.getAttribute("data-clip-label"))].label=t.value})),e.querySelectorAll("[data-clip-name]").forEach(t=>t.addEventListener("input",()=>{u()[Number(t.getAttribute("data-clip-name"))].name=t.value})),e.querySelectorAll("[data-clip-dur]").forEach(t=>t.addEventListener("input",()=>{const n=Number(t.getAttribute("data-clip-dur"));u()[n].duration=Math.max(.1,parseFloat(t.value)||1),w()})),e.querySelectorAll("[data-timeline]").forEach(t=>t.addEventListener("pointerdown",n=>{n.preventDefault();const[s,o]=t.getAttribute("data-timeline").split(":").map(Number),v=n.target.closest(".kf-dot");let C;if(v)C=Number(v.getAttribute("data-kf").split(":")[2]);else{const W=t.getBoundingClientRect(),z=Math.min(1,Math.max(0,(n.clientX-W.left)/W.width)),Y=u()[s].tracks[o].keyframes;Y.push({t:z,value:0}),C=Y.length-1}d={clip:s,track:o,kf:C};const R=W=>{const z=e.querySelector(`[data-timeline="${s}:${o}"]`);if(!z)return;const Y=z.getBoundingClientRect(),ce=Math.min(1,Math.max(0,(W.clientX-Y.left)/Y.width));u()[s].tracks[o].keyframes[C].t=ce;const re=z.querySelector(`[data-kf="${s}:${o}:${C}"]`);re&&(re.style.left=(ce*100).toFixed(2)+"%"),w()},_=()=>{window.removeEventListener("pointermove",R),window.removeEventListener("pointerup",_),x(e)};window.addEventListener("pointermove",R),window.addEventListener("pointerup",_),x(e)})),e.querySelectorAll("[data-add-tracks]").forEach(t=>t.addEventListener("click",()=>{const n=Number(t.getAttribute("data-add-tracks")),o=e.querySelector(`[data-builder-joint="${n}"]`).value.trim()||l[0]||"joint.root",v=u()[n].tracks;for(const C of["x","y","z"]){const R=e.querySelector(`[data-builder-axis="${n}:${C}"]`);R!=null&&R.checked&&!v.some(_=>_.joint===o&&_.axis===C)&&v.push({joint:o,axis:C,keyframes:[{t:0,value:0},{t:1,value:0}]})}w(),x(e)})),e.querySelectorAll("[data-kf-val]").forEach(t=>t.addEventListener("input",()=>{const[n,s,o]=t.getAttribute("data-kf-val").split(":").map(Number);u()[n].tracks[s].keyframes[o].value=(parseFloat(t.value)||0)*(Math.PI/180),w()})),e.querySelectorAll("[data-kf-del]").forEach(t=>t.addEventListener("click",()=>{const[n,s,o]=t.getAttribute("data-kf-del").split(":").map(Number),v=u()[n].tracks[s].keyframes;v.length>1&&v.splice(o,1),d&&d.clip===n&&d.track===s&&d.kf===o&&(d=null),w(),x(e)})),e.querySelectorAll("[data-del-track]").forEach(t=>t.addEventListener("click",()=>{const[n,s]=t.getAttribute("data-del-track").split(":").map(Number);u()[n].tracks.splice(s,1),d&&d.clip===n&&d.track===s&&(d=null),w(),x(e)})),e.querySelectorAll("[data-del-clip]").forEach(t=>t.addEventListener("click",()=>{const n=Number(t.getAttribute("data-del-clip"));u().splice(n,1),d&&d.clip===n&&(d=null),w(),x(e)})),e.querySelectorAll("[data-toggle-clip]").forEach(t=>t.addEventListener("click",()=>{const n=Number(t.getAttribute("data-toggle-clip"));H.has(n)?H.delete(n):H.add(n),x(e)})),e.querySelector("[data-add-clip]").addEventListener("click",()=>{const t=u(),n=t.filter(s=>s.name.startsWith("custom")).length+1;t.push({name:`custom${n}`,label:`Custom ${n}`,duration:1,tracks:[]}),w(),x(e)})}function K(){const e=P.querySelector(".inspector-body"),a=y?ae(c.root,y):null;if(e.innerHTML="",!a){e.innerHTML='<p class="muted">在视图或骨架中选中一个节点以编辑其变换与材质。</p>';return}e.appendChild($e(a))}function ye(e,a,l){const i=document.createElement("label");i.className="field",i.innerHTML=`<span>${e}</span>`;const r=document.createElement("input");return r.type="number",r.step="0.1",r.value=String(a),r.addEventListener("input",()=>l(parseFloat(r.value)||0)),i.appendChild(r),i}function he(e,a,l){const i=document.createElement("div");i.className="vec3";const r=["X","Y","Z"];return["x","y","z"].forEach((p,m)=>{i.appendChild(ye(`${e} ${r[m]}`,a[p],N=>l({...a,[p]:N})))}),i}function $e(e){if(e.shape==="instance")return ke(e);const a=document.createElement("div");a.className="inspector-form";const l=document.createElement("label");l.className="field full",l.innerHTML="<span>名称</span>";const i=document.createElement("input");i.value=e.name,i.addEventListener("input",()=>{e.name=i.value,Z()}),l.appendChild(i),a.appendChild(l);const r=(m,N,I)=>{const S=document.createElement("div");return S.className="group",S.innerHTML=`<div class="group-title">${m}</div>`,S.appendChild(he(m,N,I)),S};a.appendChild(r("位置 Position",e.position,m=>{e.position=m,B()})),a.appendChild(r("旋转 Rotation (rad)",e.rotation,m=>{e.rotation=m,B()})),a.appendChild(r("缩放 Scale",e.scale,m=>{e.scale=m,B()}));const p=document.createElement("button");return p.className="btn small danger full",p.textContent="删除此部件",p.addEventListener("click",()=>{J(c.root,e.id),y=null,M()}),a.appendChild(p),a}function ke(e){const a=document.createElement("div");a.className="inspector-form",a.innerHTML=`
      <div class="group">
        <div class="group-title">实例引用 Instance</div>
        <p class="muted">该部件整体引用了另一个元件，内部细节不可在此编辑。</p>
        <label class="field full"><span>名称</span></label>
        <input class="inst-name" type="text" value="${e.name}" />
        <label class="field full"><span>引用 ID</span></label>
        <input class="inst-ref" type="text" value="${e.refId??""}" readonly />
      </div>
    `;const l=a.querySelector(".inst-name");l.addEventListener("input",()=>{e.name=l.value,Z()});const i=document.createElement("a");i.className="btn small full",i.textContent="打开原件编辑器 →",i.href=`#/editor/${e.refId}`,a.appendChild(i);const r=document.createElement("button");return r.className="btn small danger full",r.textContent="删除此引用",r.addEventListener("click",()=>{J(c.root,e.id),y=null,M()}),a.appendChild(r),a}function Ee(e){let a=y&&ae(c.root,y)||c.root;a.shape==="instance"&&(a=c.root);const l=e==="node",i=xe({shape:e,name:l?`Node ${a.children.length+1}`:`${e[0].toUpperCase()}${e.slice(1)} ${a.children.length+1}`,material:qe(e==="sphere"||e==="cone"?"#4caf50":"#cccccc"),size:e==="box"?G(.3,.3,.3):e==="sphere"?G(.2,.2,.2):e==="plane"?G(.5,.5,1):G(.15,.5,.15),position:G(0,l?0:.2,0)});a.children.push(i),F(i.id),B()}function B(){return He(c.root).then(e=>{f.setRoot(c.root,a=>e.get(a)??null),E.rebind(f.getRootGroup()),y&&f.setSelected(y)})}function M(){B(),fe(f.getDimensions()),Z(),K()}async function le(){const e=q.querySelector("[data-ref-select]");if(!e)return;const a=await ue(),l=e.value;e.innerHTML='<option value="">选择元件…</option>'+a.filter(i=>i.id!==A).map(i=>`<option value="${i.id}">${i.name} · ${i.category}</option>`).join(""),a.some(i=>i.id===l)&&(e.value=l)}q.addEventListener("click",async e=>{var N,I,S,D,t;const a=e.target,l=(N=a.getAttribute)==null?void 0:N.call(a,"data-type"),i=(I=a.getAttribute)==null?void 0:I.call(a,"data-mode"),r=(S=a.hasAttribute)==null?void 0:S.call(a,"data-shot"),p=(D=a.getAttribute)==null?void 0:D.call(a,"data-add");if(p){Ee(p);return}if((t=a.hasAttribute)==null?void 0:t.call(a,"data-insert-ref")){const n=q.querySelector("[data-ref-select]"),s=n==null?void 0:n.value;if(!s)return;const o=(await ue()).find(C=>C.id===s),v=Pe({root:c.root,selectedId:y,refId:s,refName:(o==null?void 0:o.name)??"Instance"});F(v.id),M();return}if(l&&l!==L){L=l,c={...te(L,"character"),...oe(L)},A=void 0,H.clear();const n=u()[0];T=n?n.name:null,w(),g.querySelector(".name-input").value=c.name,F(null),M(),se();return}i&&(f.setTransformMode(i),q.querySelectorAll(".mode").forEach(n=>n.classList.remove("active")),a.classList.add("active")),r&&(c.thumbnail=f.captureThumbnail(),A?(pe(A,Q()),O("已截图并保存 ✓")):O("已截图（保存后将按当前视图刷新）"))});function O(e){g.querySelector(".save-state").textContent=e}function ge(){if(!g.querySelector("[data-del]")){const e=document.createElement("button");e.className="btn danger",e.setAttribute("data-del",""),e.textContent="删除",g.insertBefore(e,g.querySelector(".save-state"))}}function Q(){return{name:c.name,category:c.category,description:c.description,root:c.root,thumbnail:c.thumbnail,characterType:L,animClips:u()}}async function Ce(){const e=g.querySelector(".name-input").value||"Untitled";c.name=e,c.category="character",c.thumbnail=f.captureThumbnail();try{if(A)return await pe(A,Q()),"updated";const a=await Ne(Q());return A=a.id,c.id=a.id,c.createdAt=a.createdAt,c.updatedAt=a.updatedAt,ge(),le(),"created"}catch(a){return O("保存失败："+a.message),"failed"}}g.querySelector("[data-save]").addEventListener("click",async()=>{await Ce()!=="failed"&&O("已保存到元件库 ✓")}),(ie=g.querySelector("[data-del]"))==null||ie.addEventListener("click",async()=>{A&&confirm("确定删除该角色？")&&(await we(A),location.hash="#/library")}),se(),le();const ee=u()[0];ee&&(T=ee.name,E.play(ee.name)),M()}function De(h){return h.map($=>({...$,tracks:$.tracks.map(k=>({...k,keyframes:k.keyframes.map(b=>({...b}))}))}))}function J(h,$){const k=h.children.findIndex(b=>b.id===$);if(k!==-1)return h.children.splice(k,1),!0;for(const b of h.children)if(J(b,$))return!0;return!1}function Ke({type:h,id:$}){const k=Ie(b=>{Be(b,h,$)},`${h}|${$}`);return me.jsx(Me,{active:"characters",children:me.jsx("div",{className:"canvas-host",ref:k})})}export{Ke as CharactersView};
