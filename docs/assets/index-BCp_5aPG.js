var Ud=Object.defineProperty;var Nd=(i,e,t)=>e in i?Ud(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t;var ue=(i,e,t)=>Nd(i,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();function Od(){const i=fn("#6b6b6b",1),e={...fn("#4f4f4f"),roughness:1,metalness:0},t={...fn("#4aa3e0",.62),roughness:.1,metalness:.15},n={...fn("#3a8fd0",.7),roughness:.15,metalness:.1},s=Be({shape:"node",name:"Waterfall",children:[Be({shape:"box",name:"BackRock",size:{x:3,y:3.2,z:.5},position:{x:0,y:0,z:-.55},material:e}),Be({shape:"box",name:"LeftRock",size:{x:.6,y:3.2,z:1.2},position:{x:-1.2,y:0,z:0},material:i}),Be({shape:"box",name:"RightRock",size:{x:.6,y:3.2,z:1.2},position:{x:1.2,y:0,z:0},material:i}),Be({shape:"plane",name:"Water",size:{x:1.8,y:3,z:1},position:{x:0,y:0,z:.05},material:t}),Be({shape:"box",name:"TopLedge",size:{x:3,y:.5,z:1.4},position:{x:0,y:1.7,z:0},material:i}),Be({shape:"box",name:"Pool",size:{x:3,y:.3,z:1.6},position:{x:0,y:-1.55,z:.2},material:n})]});return ti(s)}const _h=[{key:"waterfall",label:"🌊 瀑布 Waterfall",defaultName:"瀑布 Waterfall",build:Od}],Oc=["humanoid","quadruped","flying"],zd={humanoid:"Humanoid 人形",quadruped:"Quadruped 四足",flying:"Flying 飞行"};function Fd(i,e){var t,n,s,r,a,o;return Be({name:e,shape:i.shape,size:P(i.size.x,i.size.y,i.size.z),position:P(((t=i.offset)==null?void 0:t.x)??0,((n=i.offset)==null?void 0:n.y)??0,((s=i.offset)==null?void 0:s.z)??0),rotation:P(((r=i.rotation)==null?void 0:r.x)??0,((a=i.rotation)==null?void 0:a.y)??0,((o=i.rotation)==null?void 0:o.z)??0),material:fn(i.color)})}function kd(i){var t,n,s;const e=Be({name:i.name,shape:"node",position:P(i.position.x,i.position.y,i.position.z),rotation:P(((t=i.rest)==null?void 0:t.x)??0,((n=i.rest)==null?void 0:n.y)??0,((s=i.rest)==null?void 0:s.z)??0)});return i.mesh&&e.children.push(Fd(i.mesh,`${i.name}.mesh`)),e}function Zo(i){const e=new Map;for(const s of i.joints)e.set(s.name,kd(s));for(const s of i.joints){if(!s.parent)continue;const r=e.get(s.parent),a=e.get(s.name);r&&a&&r.children.push(a)}const t=Be({name:`Character:${i.type}`,shape:"node"}),n=i.joints.filter(s=>!s.parent);for(const s of n){const r=e.get(s.name);r&&t.children.push(r)}return ti(t)}const ee=i=>i*Math.PI/180,Bd={type:"humanoid",joints:[{name:"joint.pelvis",parent:null,position:P(0,.95,0),mesh:{shape:"box",size:P(.42,.22,.26),color:"#3f6fb0",offset:P(0,0,0)}},{name:"joint.spine",parent:"joint.pelvis",position:P(0,.11,0),mesh:{shape:"box",size:P(.5,.55,.3),color:"#4caf50",offset:P(0,.27,0)}},{name:"joint.head",parent:"joint.spine",position:P(0,.62,0),mesh:{shape:"sphere",size:P(.17,.17,.17),color:"#f1c27d",offset:P(0,.2,0)}},{name:"joint.shoulderL",parent:"joint.spine",position:P(-.32,.42,0),mesh:{shape:"box",size:P(.14,.42,.14),color:"#4caf50",offset:P(0,-.21,0)}},{name:"joint.elbowL",parent:"joint.shoulderL",position:P(0,-.42,0),mesh:{shape:"box",size:P(.12,.42,.12),color:"#f1c27d",offset:P(0,-.21,0)}},{name:"joint.shoulderR",parent:"joint.spine",position:P(.32,.42,0),mesh:{shape:"box",size:P(.14,.42,.14),color:"#4caf50",offset:P(0,-.21,0)}},{name:"joint.elbowR",parent:"joint.shoulderR",position:P(0,-.42,0),mesh:{shape:"box",size:P(.12,.42,.12),color:"#f1c27d",offset:P(0,-.21,0)}},{name:"joint.hipL",parent:"joint.pelvis",position:P(-.16,-.1,0),mesh:{shape:"box",size:P(.18,.46,.18),color:"#2f6f9f",offset:P(0,-.23,0)}},{name:"joint.kneeL",parent:"joint.hipL",position:P(0,-.46,0),mesh:{shape:"box",size:P(.16,.46,.16),color:"#1f4f7f",offset:P(0,-.23,0)}},{name:"joint.hipR",parent:"joint.pelvis",position:P(.16,-.1,0),mesh:{shape:"box",size:P(.18,.46,.18),color:"#2f6f9f",offset:P(0,-.23,0)}},{name:"joint.kneeR",parent:"joint.hipR",position:P(0,-.46,0),mesh:{shape:"box",size:P(.16,.46,.16),color:"#1f4f7f",offset:P(0,-.23,0)}}]},Hd={type:"quadruped",joints:[{name:"joint.body",parent:null,position:P(0,.75,0),mesh:{shape:"box",size:P(.44,.4,1),color:"#b5732f",offset:P(0,0,0)}},{name:"joint.neck",parent:"joint.body",position:P(0,.1,.55),mesh:{shape:"box",size:P(.22,.22,.4),color:"#c98a3f",offset:P(0,.05,.15)}},{name:"joint.head",parent:"joint.neck",position:P(0,.1,.4),mesh:{shape:"box",size:P(.26,.26,.34),color:"#a5642a",offset:P(0,.05,.1)}},{name:"joint.legFL",parent:"joint.body",position:P(-.2,-.18,.38),mesh:{shape:"box",size:P(.12,.45,.12),color:"#8a531f",offset:P(0,-.22,0)}},{name:"joint.kneeFL",parent:"joint.legFL",position:P(0,-.45,0),mesh:{shape:"box",size:P(.1,.42,.1),color:"#6f4220",offset:P(0,-.2,0)}},{name:"joint.legFR",parent:"joint.body",position:P(.2,-.18,.38),mesh:{shape:"box",size:P(.12,.45,.12),color:"#8a531f",offset:P(0,-.22,0)}},{name:"joint.kneeFR",parent:"joint.legFR",position:P(0,-.45,0),mesh:{shape:"box",size:P(.1,.42,.1),color:"#6f4220",offset:P(0,-.2,0)}},{name:"joint.legBL",parent:"joint.body",position:P(-.2,-.18,-.38),mesh:{shape:"box",size:P(.13,.5,.13),color:"#8a531f",offset:P(0,-.25,0)}},{name:"joint.kneeBL",parent:"joint.legBL",position:P(0,-.5,0),mesh:{shape:"box",size:P(.11,.46,.11),color:"#6f4220",offset:P(0,-.22,0)}},{name:"joint.legBR",parent:"joint.body",position:P(.2,-.18,-.38),mesh:{shape:"box",size:P(.13,.5,.13),color:"#8a531f",offset:P(0,-.25,0)}},{name:"joint.kneeBR",parent:"joint.legBR",position:P(0,-.5,0),mesh:{shape:"box",size:P(.11,.46,.11),color:"#6f4220",offset:P(0,-.22,0)}},{name:"joint.tail",parent:"joint.body",position:P(0,.05,-.55),mesh:{shape:"box",size:P(.1,.1,.5),color:"#a5642a",offset:P(0,0,-.22)}}]},Gd={type:"flying",joints:[{name:"joint.body",parent:null,position:P(0,1,0),mesh:{shape:"box",size:P(.3,.28,.7),color:"#5b8def",offset:P(0,0,0)}},{name:"joint.neck",parent:"joint.body",position:P(0,.14,.4),mesh:{shape:"box",size:P(.12,.12,.6),color:"#7aa7f0",offset:P(0,.07,.22)}},{name:"joint.head",parent:"joint.neck",position:P(0,.14,.56),mesh:{shape:"sphere",size:P(.18,.16,.18),color:"#f1c27d",offset:P(0,.06,.05)}},{name:"joint.beak",parent:"joint.head",position:P(0,.02,.16),mesh:{shape:"cone",size:P(.08,.26,.08),color:"#e8913a",offset:P(0,0,.13),rotation:P(Math.PI/2,0,0)}},{name:"joint.wingL",parent:"joint.body",position:P(-.18,.05,0),mesh:{shape:"box",size:P(.6,.06,.34),color:"#3f6fb0",offset:P(-.32,0,0)}},{name:"joint.wingTipL",parent:"joint.wingL",position:P(-.64,0,0),mesh:{shape:"box",size:P(.6,.05,.3),color:"#355c93",offset:P(-.3,0,0)}},{name:"joint.wingR",parent:"joint.body",position:P(.18,.05,0),mesh:{shape:"box",size:P(.6,.06,.34),color:"#3f6fb0",offset:P(.32,0,0)}},{name:"joint.wingTipR",parent:"joint.wingR",position:P(.64,0,0),mesh:{shape:"box",size:P(.6,.05,.3),color:"#355c93",offset:P(.3,0,0)}},{name:"joint.legL",parent:"joint.body",position:P(-.1,-.12,.05),mesh:{shape:"box",size:P(.1,.42,.1),color:"#e0a23a",offset:P(0,-.21,0)}},{name:"joint.footL",parent:"joint.legL",position:P(0,-.42,0),mesh:{shape:"box",size:P(.14,.08,.24),color:"#caa",offset:P(0,-.04,.06)}},{name:"joint.legR",parent:"joint.body",position:P(.1,-.12,.05),mesh:{shape:"box",size:P(.1,.42,.1),color:"#e0a23a",offset:P(0,-.21,0)}},{name:"joint.footR",parent:"joint.legR",position:P(0,-.42,0),mesh:{shape:"box",size:P(.14,.08,.24),color:"#caa",offset:P(0,-.04,.06)}},{name:"joint.tail",parent:"joint.body",position:P(0,0,-.4),mesh:{shape:"cone",size:P(.14,.5,.14),color:"#5b8def",offset:P(0,0,-.28),rotation:P(Math.PI/2,0,0)}}]},Jo={humanoid:Bd,quadruped:Hd,flying:Gd},j=(i,e)=>({t:i,value:e}),Vd={name:"idle",label:"Stand 站立",duration:3,tracks:[{joint:"joint.spine",axis:"x",keyframes:[j(0,0),j(.5,ee(2)),j(1,0)]},{joint:"joint.shoulderL",axis:"x",keyframes:[j(0,ee(3)),j(.5,ee(1)),j(1,ee(3))]},{joint:"joint.shoulderR",axis:"x",keyframes:[j(0,ee(3)),j(.5,ee(5)),j(1,ee(3))]},{joint:"joint.head",axis:"y",keyframes:[j(0,ee(-4)),j(.5,ee(4)),j(1,ee(-4))]}]},Wd={name:"sit",label:"Sit 坐",duration:2.5,tracks:[{joint:"joint.pelvis",axis:"x",keyframes:[j(0,ee(8)),j(1,ee(8))]},{joint:"joint.spine",axis:"x",keyframes:[j(0,ee(-12)),j(1,ee(-12))]},{joint:"joint.hipL",axis:"x",keyframes:[j(0,ee(85)),j(1,ee(85))]},{joint:"joint.hipR",axis:"x",keyframes:[j(0,ee(85)),j(1,ee(85))]},{joint:"joint.kneeL",axis:"x",keyframes:[j(0,ee(-95)),j(1,ee(-95))]},{joint:"joint.kneeR",axis:"x",keyframes:[j(0,ee(-95)),j(1,ee(-95))]},{joint:"joint.shoulderL",axis:"x",keyframes:[j(0,ee(14)),j(1,ee(14))]},{joint:"joint.shoulderR",axis:"x",keyframes:[j(0,ee(14)),j(1,ee(14))]}]},jd={name:"walk",label:"Walk 走",duration:1.4,tracks:[{joint:"joint.hipL",axis:"x",keyframes:[j(0,ee(28)),j(.25,0),j(.5,ee(-22)),j(.75,0),j(1,ee(28))]},{joint:"joint.hipR",axis:"x",keyframes:[j(0,ee(-22)),j(.25,0),j(.5,ee(28)),j(.75,0),j(1,ee(-22))]},{joint:"joint.kneeL",axis:"x",keyframes:[j(0,0),j(.5,0),j(.75,ee(-35)),j(1,0)]},{joint:"joint.kneeR",axis:"x",keyframes:[j(0,0),j(.25,ee(-35)),j(.5,0),j(1,0)]},{joint:"joint.shoulderL",axis:"x",keyframes:[j(0,ee(-26)),j(.25,0),j(.5,ee(26)),j(.75,0),j(1,ee(-26))]},{joint:"joint.shoulderR",axis:"x",keyframes:[j(0,ee(26)),j(.25,0),j(.5,ee(-26)),j(.75,0),j(1,ee(26))]},{joint:"joint.elbowL",axis:"x",keyframes:[j(0,ee(12)),j(1,ee(12))]},{joint:"joint.elbowR",axis:"x",keyframes:[j(0,ee(12)),j(1,ee(12))]},{joint:"joint.spine",axis:"y",keyframes:[j(0,ee(-4)),j(.5,ee(4)),j(1,ee(-4))]}]},Xd={name:"idle",label:"Stand 站立",duration:3,tracks:[{joint:"joint.head",axis:"x",keyframes:[j(0,ee(-3)),j(.5,ee(3)),j(1,ee(-3))]},{joint:"joint.tail",axis:"y",keyframes:[j(0,ee(-6)),j(.5,ee(6)),j(1,ee(-6))]},{joint:"joint.body",axis:"x",keyframes:[j(0,ee(1)),j(.5,ee(-1)),j(1,ee(1))]}]},qd={name:"walk",label:"Walk 走",duration:1.6,tracks:[{joint:"joint.legFL",axis:"x",keyframes:[j(0,ee(24)),j(.5,ee(-20)),j(1,ee(24))]},{joint:"joint.kneeFL",axis:"x",keyframes:[j(0,0),j(.2,ee(-30)),j(.45,0),j(1,0)]},{joint:"joint.legBR",axis:"x",keyframes:[j(0,ee(24)),j(.5,ee(-20)),j(1,ee(24))]},{joint:"joint.kneeBR",axis:"x",keyframes:[j(0,0),j(.2,ee(-30)),j(.45,0),j(1,0)]},{joint:"joint.legFR",axis:"x",keyframes:[j(0,ee(-20)),j(.5,ee(24)),j(1,ee(-20))]},{joint:"joint.kneeFR",axis:"x",keyframes:[j(0,ee(-30)),j(.7,0),j(.9,ee(-30)),j(1,ee(-30))]},{joint:"joint.legBL",axis:"x",keyframes:[j(0,ee(-20)),j(.5,ee(24)),j(1,ee(-20))]},{joint:"joint.kneeBL",axis:"x",keyframes:[j(0,ee(-30)),j(.7,0),j(.9,ee(-30)),j(1,ee(-30))]},{joint:"joint.tail",axis:"y",keyframes:[j(0,ee(-4)),j(.5,ee(4)),j(1,ee(-4))]},{joint:"joint.head",axis:"x",keyframes:[j(0,ee(-2)),j(.5,ee(2)),j(1,ee(-2))]}]},$d={name:"idle",label:"Stand 站立",duration:3,tracks:[{joint:"joint.wingL",axis:"y",keyframes:[j(0,ee(-82)),j(.5,ee(-78)),j(1,ee(-82))]},{joint:"joint.wingTipL",axis:"y",keyframes:[j(0,ee(-45)),j(.5,ee(-42)),j(1,ee(-45))]},{joint:"joint.wingR",axis:"y",keyframes:[j(0,ee(82)),j(.5,ee(78)),j(1,ee(82))]},{joint:"joint.wingTipR",axis:"y",keyframes:[j(0,ee(45)),j(.5,ee(42)),j(1,ee(45))]},{joint:"joint.body",axis:"x",keyframes:[j(0,ee(2)),j(.5,ee(-2)),j(1,ee(2))]}]},Yd={name:"walk",label:"Walk 走",duration:1.8,tracks:[{joint:"joint.wingL",axis:"y",keyframes:[j(0,ee(-82)),j(1,ee(-82))]},{joint:"joint.wingTipL",axis:"y",keyframes:[j(0,ee(-45)),j(1,ee(-45))]},{joint:"joint.wingR",axis:"y",keyframes:[j(0,ee(82)),j(1,ee(82))]},{joint:"joint.wingTipR",axis:"y",keyframes:[j(0,ee(45)),j(1,ee(45))]},{joint:"joint.legL",axis:"x",keyframes:[j(0,ee(22)),j(.5,ee(-18)),j(1,ee(22))]},{joint:"joint.legR",axis:"x",keyframes:[j(0,ee(-18)),j(.5,ee(22)),j(1,ee(-18))]},{joint:"joint.body",axis:"x",keyframes:[j(0,ee(3)),j(.5,ee(-3)),j(1,ee(3))]},{joint:"joint.head",axis:"x",keyframes:[j(0,ee(-3)),j(.5,ee(3)),j(1,ee(-3))]},{joint:"joint.tail",axis:"y",keyframes:[j(0,ee(-5)),j(.5,ee(5)),j(1,ee(-5))]}]},Kd={name:"fly",label:"Fly 飞翔",duration:.9,tracks:[{joint:"joint.wingL",axis:"z",keyframes:[j(0,ee(50)),j(.5,ee(-35)),j(1,ee(50))]},{joint:"joint.wingTipL",axis:"z",keyframes:[j(0,ee(20)),j(.5,ee(-15)),j(1,ee(20))]},{joint:"joint.wingR",axis:"z",keyframes:[j(0,ee(-50)),j(.5,ee(35)),j(1,ee(-50))]},{joint:"joint.wingTipR",axis:"z",keyframes:[j(0,ee(-20)),j(.5,ee(15)),j(1,ee(-20))]},{joint:"joint.legL",axis:"x",keyframes:[j(0,ee(68)),j(1,ee(68))]},{joint:"joint.legL",axis:"z",keyframes:[j(0,ee(-12)),j(1,ee(-12))]},{joint:"joint.legR",axis:"x",keyframes:[j(0,ee(68)),j(1,ee(68))]},{joint:"joint.legR",axis:"z",keyframes:[j(0,ee(12)),j(1,ee(12))]},{joint:"joint.body",axis:"x",keyframes:[j(0,ee(6)),j(.5,ee(-2)),j(1,ee(6))]}]},vh={humanoid:[Vd,Wd,jd],quadruped:[Xd,qd],flying:[$d,Yd,Kd]};function zc(i,e){const t=Jo[i];return{name:e??(i==="humanoid"?"Humanoid":i==="quadruped"?"Quadruped":"Flying"),category:"character",description:`Character · ${i}`,root:Zo(t),characterType:i}}const Zd=24,Jd=48,Qd=6;let Fc=0;function xh(i="scene"){return Fc+=1,`${i}_${Date.now().toString(36)}_${Fc.toString(36)}`}function Sn(i){return i+1}function yh(i){const e=Sn(i);return e*e}function Mh(i=Zd,e=Jd,t="#6b8e3d"){const n=yh(e);return{size:i,segments:e,heights:new Array(n).fill(0),water:new Array(n).fill(0),color:t}}function si(i,e){return{id:xh("obj"),assetId:i,name:e,position:P(0,0,0),rotation:P(),scale:P(1,1,1)}}function no(i="Untitled Scene"){const e=new Date().toISOString(),t=Mh();return{id:xh("scene"),name:i,size:t.size,waterLevel:-2,terrain:t,objects:[],createdAt:e,updatedAt:e}}function Qo(i){const e=yh(i.segments);return(!i.water||i.water.length!==e)&&(i.water=new Array(e).fill(0)),i}function io(i,e,t){const{size:n,segments:s,heights:r}=i,a=Sn(s),o=(e+n/2)/n*s,c=(t+n/2)/n*s;if(o<0||c<0||o>s||c>s)return 0;const l=Math.min(Math.floor(o),s),h=Math.min(Math.floor(c),s),f=Math.min(l+1,s),d=Math.min(h+1,s),p=o-l,g=c-h,x=r[h*a+l],u=r[h*a+f],m=r[d*a+l],w=r[d*a+f],S=x+(u-x)*p,y=m+(w-m)*p;return S+(y-S)*g}let kc=0;function pa(i="anim"){return kc+=1,`${i}_${Date.now().toString(36)}_${kc.toString(36)}`}function Bc(i,e,t){return{time:i,position:{...e},rotation:P(),scale:P(1,1,1)}}function Kr(i,e,t,n){const s=new Date().toISOString(),r=t*.75,a=P(r,t*.65,r),o=P(0,0,0);return{id:pa("anim"),name:n??`${e} 动画`,sceneId:i,duration:8,tracks:[{id:pa("track"),kind:"camera",keyframes:[Bc(0,a)]},{id:pa("track"),kind:"cameraTarget",keyframes:[Bc(0,o)]}],createdAt:s,updatedAt:s}}function En(i,e,t){const n=e.time-i.time||1,s=Math.max(0,Math.min(1,(t-i.time)/n));return i.value+(e.value-i.value)*s}function Zi(i,e){const t=i.keyframes;if(t.length===0)return{position:P(),rotation:P(),scale:P(1,1,1),state:"none"};if(t.length===1||e<=t[0].time){const s=t[0];return{position:{...s.position},rotation:{...s.rotation},scale:{...s.scale},state:s.state??"none"}}if(e>=t[t.length-1].time){const s=t[t.length-1];return{position:{...s.position},rotation:{...s.rotation},scale:{...s.scale},state:s.state??"none"}}for(let s=0;s<t.length-1;s++){const r=t[s],a=t[s+1];if(e>=r.time&&e<=a.time){const o=a.state??"none";return{position:P(En({time:r.time,value:r.position.x},{time:a.time,value:a.position.x},e),En({time:r.time,value:r.position.y},{time:a.time,value:a.position.y},e),En({time:r.time,value:r.position.z},{time:a.time,value:a.position.z},e)),rotation:P(En({time:r.time,value:r.rotation.x},{time:a.time,value:a.rotation.x},e),En({time:r.time,value:r.rotation.y},{time:a.time,value:a.rotation.y},e),En({time:r.time,value:r.rotation.z},{time:a.time,value:a.rotation.z},e)),scale:P(En({time:r.time,value:r.scale.x},{time:a.time,value:a.scale.x},e),En({time:r.time,value:r.scale.y},{time:a.time,value:a.scale.y},e),En({time:r.time,value:r.scale.z},{time:a.time,value:a.scale.z},e)),state:o}}}const n=t[t.length-1];return{position:{...n.position},rotation:{...n.rotation},scale:{...n.scale},state:n.state??"none"}}function Hc(i,e){return i.tracks.find(t=>t.kind==="object"&&t.objectId===e)??null}function eu(i){return JSON.parse(JSON.stringify(i))}function Sh(i,e){const t=eu(i);for(const n of t.joints)if(n.mesh){const s=e(n.name);s&&(n.mesh={...n.mesh,color:s})}return t}function Or(i,e){if(i.name===e)return i;for(const t of i.children){const n=Or(t,e);if(n)return n}return null}const un=(i="#2c2f36")=>({...fn(i),roughness:.55,metalness:.6}),dt=i=>({...fn(i),roughness:.85,metalness:.05});function bh(){const e=Be({shape:"node",name:"Locomotive",children:[Be({shape:"box",name:"Frame",size:P(7.4,.35,2.7),position:P(0,.4,0),material:un("#23262c")}),Be({shape:"cylinder",name:"Boiler",size:P(1.05,4.6,1.05),position:P(-.3,1.45,0),rotation:P(0,0,Math.PI/2),material:un("#3a3f47")}),Be({shape:"cylinder",name:"Smokebox",size:P(1.12,.6,1.12),position:P(2.2,1.45,0),rotation:P(0,0,Math.PI/2),material:dt("#7a1f1f")}),Be({shape:"box",name:"Cabin",size:P(2.4,2.3,2.5),position:P(-2.7,1.65,0),material:dt("#5a3a22")}),Be({shape:"box",name:"CabinRoof",size:P(2.7,.22,2.7),position:P(-2.7,2.85,0),material:dt("#33220f")}),Be({shape:"cylinder",name:"Chimney",size:P(.36,1.1,.36),position:P(1.5,2.7,0),material:dt("#1c1c1c")}),Be({shape:"sphere",name:"Dome",size:P(.45,.45,.45),position:P(.2,2.55,0),material:un("#8a8f99")}),Be({shape:"box",name:"Cowcatcher",size:P(1.3,1,2.3),position:P(3,.75,0),rotation:P(0,0,-Math.PI/7),material:dt("#3a3a3a")}),Be({shape:"sphere",name:"Lamp",size:P(.28,.28,.28),position:P(2.6,1.7,0),material:dt("#ffd76b")}),...[-2,-.6,.8,2].map(t=>Be({shape:"cylinder",name:`Wheel@${t}`,size:P(.7,.3,.7),position:P(t,.7,0),rotation:P(0,0,Math.PI/2),material:un("#15171b")}))]});return ti(e)}function Eh(){const i=Be({shape:"node",name:"TrainCar",children:[Be({shape:"box",name:"Frame",size:P(5.2,.3,2.4),position:P(0,.45,0),material:un("#23262c")}),Be({shape:"box",name:"Body",size:P(5,1.9,2.4),position:P(0,1.35,0),material:dt("#7a4a23")}),Be({shape:"box",name:"Roof",size:P(5.2,.22,2.6),position:P(0,2.4,0),material:dt("#3c2a14")}),Be({shape:"box",name:"Door",size:P(.1,1.4,1.4),position:P(1.2,1.35,0),material:dt("#5e3819")}),...[-1.6,1.6].flatMap(e=>[Be({shape:"cylinder",name:`WheelL@${e}`,size:P(.5,.22,.5),position:P(e,.5,.95),rotation:P(0,0,Math.PI/2),material:un("#15171b")}),Be({shape:"cylinder",name:`WheelR@${e}`,size:P(.5,.22,.5),position:P(e,.5,-.95),rotation:P(0,0,Math.PI/2),material:un("#15171b")})])]});return ti(i)}function wh(i=72){const e=[];for(let s=-i/2+1.6/2;s<i/2;s+=1.6)e.push(Be({shape:"box",name:`Tie@${s.toFixed(1)}`,size:P(.32,.14,1.9),position:P(s,.07,0),material:dt("#5a3d23")}));const n=Be({shape:"node",name:"Rail",children:[...e,Be({shape:"box",name:"RailL",size:P(i,.15,.14),position:P(0,.18,.72),material:un("#6a6f78")}),Be({shape:"box",name:"RailR",size:P(i,.15,.14),position:P(0,.18,-.72),material:un("#6a6f78")})]});return ti(n)}function Th(){const i=Be({shape:"node",name:"Tree",children:[Be({shape:"cylinder",name:"Trunk",size:P(.26,2,.26),position:P(0,1,0),material:dt("#6b4a23")}),Be({shape:"cone",name:"Foliage1",size:P(1.6,2,1.6),position:P(0,2.8,0),material:dt("#2f7d32")}),Be({shape:"cone",name:"Foliage2",size:P(1.2,1.7,1.2),position:P(0,3.7,0),material:dt("#37933b")}),Be({shape:"cone",name:"Foliage3",size:P(.8,1.4,.8),position:P(0,4.4,0),material:dt("#43a648")})]});return ti(i)}function Ah(i={}){const e=i.horse??"#9a6a35",t=i.horse?ma(i.horse,-.25):"#6f4a22",n=i.horse?ma(i.horse,.12):"#a8743a",s=i.coat??"#3a2b2b",r=i.hat??"#1c1c1c",a="#e8b98a",o=Sh(Jo.quadruped,h=>h==="joint.head"?n:h.startsWith("joint.leg")||h.startsWith("joint.knee")?t:e),c=Zo(o),l=Or(c,"joint.body");return l&&l.children.push(Be({shape:"box",name:"rider.torso",size:P(.36,.55,.24),position:P(0,.62,0),material:dt(s)}),Be({shape:"box",name:"rider.hip",size:P(.34,.22,.26),position:P(0,.34,0),material:dt(ma(s,-.2))}),Be({shape:"sphere",name:"rider.head",size:P(.16,.16,.16),position:P(0,1,.05),material:dt(a)}),Be({shape:"cylinder",name:"rider.hat",size:P(.2,.2,.2),position:P(0,1.12,.05),material:dt(r)}),Be({shape:"box",name:"rider.hatBrim",size:P(.44,.06,.44),position:P(0,1.03,.05),material:dt(r)}),Be({shape:"box",name:"rider.armL",size:P(.1,.46,.1),position:P(-.22,.66,.22),rotation:P(Math.PI/2.2,0,0),material:dt(s)}),Be({shape:"box",name:"rider.armR",size:P(.1,.46,.1),position:P(.22,.66,.22),rotation:P(Math.PI/2.2,0,0),material:dt(s)}),Be({shape:"box",name:"rider.gun",size:P(.07,.07,.85),position:P(.22,.55,.5),material:un("#15171b")})),ti(c)}function tu(i={}){const e=i.coat??"#2f5f9f",t=i.pants??"#2a2f3a",n=i.hat??"#3a2a18",s="#e8b98a",r=Sh(Jo.humanoid,l=>l.startsWith("joint.leg")||l.startsWith("joint.knee")?t:l==="joint.head"?s:e),a=Zo(r),o=Or(a,"joint.head");o&&o.children.push(Be({shape:"cylinder",name:"person.hat",size:P(.2,.22,.2),position:P(0,.22,0),material:dt(n)}),Be({shape:"box",name:"person.hatBrim",size:P(.46,.06,.46),position:P(0,.12,0),material:dt(n)}));const c=Or(a,"joint.spine");return c&&c.children.push(Be({shape:"box",name:"person.armL",size:P(.11,.46,.11),position:P(-.2,.2,.26),rotation:P(Math.PI/2.1,0,0),material:dt(e)}),Be({shape:"box",name:"person.armR",size:P(.11,.46,.11),position:P(.2,.2,.26),rotation:P(Math.PI/2.1,0,0),material:dt(e)}),Be({shape:"box",name:"person.gun",size:P(.07,.07,.9),position:P(.2,.18,.55),material:un("#15171b")})),ti(a)}function ma(i,e){const t=/^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(i.trim());if(!t)return i;const n=s=>{const r=parseInt(s,16);return Math.max(0,Math.min(255,Math.round(r+e*255))).toString(16).padStart(2,"0")};return`#${n(t[1])}${n(t[2])}${n(t[3])}`}function nu(i="火车头 Locomotive"){return{name:i,category:"decor",description:"蒸汽火车头：锅炉 + 驾驶室 + 烟囱 + 排障器 + 车轮。",root:bh()}}function iu(i="火车车厢 Train Car"){return{name:i,category:"decor",description:"货运/客运车厢：车厢 + 车顶 + 车轮。",root:Eh()}}function su(i="铁轨 Rail"){return{name:i,category:"road",description:"铁轨：两条钢轨 + 枕木。",root:wh()}}function ru(i="树木 Tree"){return{name:i,category:"tree",description:"松木：树干 + 三层锥形树冠。",root:Th()}}function au(i="劫匪骑兵 Bandit"){return{name:i,category:"character",characterType:"quadruped",description:"骑马劫匪：四足马 + 持枪骑手。",root:Ah({coat:"#3a2b2b",hat:"#111"})}}function ou(i="护卫骑兵 Defender"){return{name:i,category:"character",characterType:"quadruped",description:"骑马护卫：四足马 + 持枪骑手。",root:Ah({coat:"#274b73",hat:"#222"})}}function cu(i="火车护卫 Defender"){return{name:i,category:"character",characterType:"humanoid",description:"站立持枪护卫。",root:tu({coat:"#2f5f9f",hat:"#3a2a18"})}}_h.push({key:"decor",label:"🚂 火车头 Locomotive",defaultName:"火车头 Locomotive",build:bh},{key:"decor",label:"🚃 火车车厢 Train Car",defaultName:"火车车厢 Train Car",build:Eh},{key:"road",label:"🛤 铁轨 Rail",defaultName:"铁轨 Rail",build:()=>wh()},{key:"tree",label:"🌲 树木 Tree",defaultName:"树木 Tree",build:Th});const lu=["tree","flower","grass","house","rock","road","decor","character","waterfall","other"];function P(i=0,e=0,t=0){return{x:i,y:e,z:t}}let Gc=0;function Is(i="part"){return Gc+=1,`${i}_${Date.now().toString(36)}_${Gc.toString(36)}`}function fn(i="#cccccc",e=1){return{color:i,roughness:.8,metalness:.05,...e<1?{opacity:e}:{}}}function Be(i){return{id:i.id??Is(),name:i.name,shape:i.shape,size:i.size??P(1,1,1),position:i.position??P(),rotation:i.rotation??P(),scale:i.scale??P(1,1,1),material:i.material??fn(),refId:i.refId,children:i.children??[]}}function Rh(i){return{...i,id:Is(),material:{...i.material},size:{...i.size},position:{...i.position},rotation:{...i.rotation},scale:{...i.scale},children:i.children.map(Rh)}}function zr(i){const e=new Set,t=n=>{let s=n.id;return(!s||e.has(s))&&(s=Is()),e.add(s),{...n,id:s,children:n.children.map(t)}};return t(i)}function Rs(i="Untitled",e="other"){const t=new Date().toISOString();return{id:Is("asset"),name:i,category:e,description:"",root:Be({shape:"node",name:"Root",material:fn("#cccccc")}),createdAt:t,updatedAt:t}}function Fr(i){const e=i.root;return e.shape==="box"&&e.name==="Root"&&e.children.length===0?{...i,root:{...e,shape:"node"}}:i}function hu(i,e){switch(i){case"box":return P(e.x/2,e.y/2,e.z/2);case"sphere":return P(e.x,e.x,e.x);case"cylinder":return P(e.x,e.y/2,e.x);case"cone":return P(e.x,e.y/2,e.x);case"plane":return P(e.x/2,e.y/2,1e-4);case"triangle":return P(e.x/2,e.y/2,1e-4);default:return P(0,0,0)}}function Ch(i,e,t,n){const s=P(t.x*i.scale.x,t.y*i.scale.y,t.z*i.scale.z),r=P(e.x+i.position.x*t.x,e.y+i.position.y*t.y,e.z+i.position.z*t.z),a=hu(i.shape,i.size);n.min.x=Math.min(n.min.x,r.x-a.x*s.x),n.min.y=Math.min(n.min.y,r.y-a.y*s.y),n.min.z=Math.min(n.min.z,r.z-a.z*s.z),n.max.x=Math.max(n.max.x,r.x+a.x*s.x),n.max.y=Math.max(n.max.y,r.y+a.y*s.y),n.max.z=Math.max(n.max.z,r.z+a.z*s.z);for(const o of i.children)Ch(o,r,s,n)}function Lh(i){const e={min:P(1/0,1/0,1/0),max:P(-1/0,-1/0,-1/0)};return Ch(i,P(),P(1,1,1),e),isFinite(e.min.x)?e:{min:P(),max:P()}}function ti(i){const e=Lh(i),t=(e.min.x+e.max.x)/2,n=(e.min.y+e.max.y)/2,s=(e.min.z+e.max.z)/2;return i.position=P(i.position.x-t,i.position.y-n,i.position.z-s),i}function ui(i){const e=Lh(i);return(e.max.y-e.min.y)/2}function Fn(i){const e=document.createElement("nav");return e.className="topnav",e.innerHTML=`
    <a class="brand" href="#/">🌱 ShapeCraft</a>
    <div class="nav-links">
      <a href="#/" class="${i==="home"?"active":""}">首页</a>
      <a href="#/library" class="${i==="library"?"active":""}">元件库</a>
      <a href="#/characters" class="${i==="characters"?"active":""}">角色</a>
      <a href="#/scenes" class="${i==="scene"?"active":""}">场景</a>
      <a href="#/roam" class="${i==="roam"?"active":""}">漫游</a>
      <a href="#/animations" class="${i==="animation"?"active":""}">动画</a>
      <a class="demo-link" href="#/demo">▶ 劫案 Demo</a>
      <a href="#/settings" class="${i==="settings"?"active":""}">设置</a>
    </div>
  `,e}function kr(i){return{tree:"树",flower:"花",grass:"草",house:"房子",rock:"石头",road:"道路",decor:"装饰",character:"角色",waterfall:"瀑布",other:"其他"}[i]??i}function du(i){return lu.map(e=>`<option value="${e}" ${e===i?"selected":""}>${kr(e)}</option>`).join("")}function Vc(i){const e=document.createElement("div");e.className="page",e.appendChild(Fn("home"));const t=document.createElement("section");t.className="hero",t.innerHTML=`
    <h1>ShapeCraft</h1>
    <p class="tagline">AI 驱动的 3D 世界与多人游戏创作平台 · 第一阶段：元件库与编辑器</p>
    <div class="cta">
      <a class="btn primary" href="#/library">进入元件库</a>
      <a class="btn" href="#/scenes">场景编辑</a>
      <a class="btn accent" href="#/demo">▶ 导演：火车大劫案</a>
    </div>
    <p class="hint">用基础形状 + 材质构造 树 / 花 / 草 / 房子，或用聊天自动生成。</p>
  `,e.appendChild(t);const n=document.createElement("section");n.className="features",n.innerHTML=`
    <div class="feature">
      <h3>元件库 CRUD</h3>
      <p>创建、查看、编辑、删除可复用的 3D 元件（prefab），保存为内部 JSON。</p>
    </div>
    <div class="feature">
      <h3>可视化编辑器</h3>
      <p>基于 box / sphere / cylinder / cone / plane 的组合、层级、变换与材质。</p>
    </div>
    <div class="feature">
      <h3>聊天式建造</h3>
      <p>“帮我造一棵树” 即自动生成并附加基础材质，无需手工拼装。</p>
    </div>
    <div class="feature">
      <h3><a href="#/characters">角色设计 · 轴动画</a></h3>
      <p>人形 / 四足 / 飞行三类骨架，脚本槽位驱动的站立、坐、走、飞翔动画，可调节速度角度。</p>
    </div>
    <div class="feature">
      <h3><a href="#/scenes">场景编辑 · 地形 / 物件</a></h3>
      <p>方形区域：地形模式下抬高 / 降低笔刷 + 水位控制；切到物件模式把元件（含角色）摆上地形。</p>
    </div>
    <div class="feature">
      <h3><a href="#/animations">动画编辑 · 相机 / 物件</a></h3>
      <p>选择一个已有场景，自动生成相机与相机目标（空 node）轨道；可增建自定义轨道绑定角色 / 元件，在关键帧调整位置并设置区段动画状态（走 / 飞）。每个物件最多一个轨道。</p>
    </div>
  `,e.appendChild(n),i.appendChild(e)}const Zr="shapecraft.settings.v1",Ph="shapecraft.mode.v1";function Ds(){try{const i=localStorage.getItem(Ph);return i?JSON.parse(i).local!==!1:!0}catch{return!0}}function uu(i){localStorage.setItem(Ph,JSON.stringify({local:i}))}const ga={enabled:!1,apiKey:"",model:"gpt-4o-mini",baseUrl:"https://api.openai.com/v1",supportsVision:!1};function Us(){try{const i=localStorage.getItem(Zr);return i?{...ga,...JSON.parse(i)}:{...ga}}catch{return{...ga}}}function fu(i){localStorage.setItem(Zr,JSON.stringify(i))}const ec="shapecraft.assets.v1",pu="/api/assets",so=new Set;function mu(i){return so.add(i),()=>so.delete(i)}function yi(){so.forEach(i=>i())}let Wc=class extends Error{constructor(t,n){super(t);ue(this,"status");this.name="HttpError",this.status=n}};async function Ns(i,e){if(Ds())return null;try{const t=await fetch(`${pu}${i}`,{headers:{"Content-Type":"application/json"},...e});if(!t.ok){let n=t.statusText;try{const s=await t.json();s!=null&&s.message&&(n=s.message)}catch{}throw new Wc(n,t.status)}return await t.json()}catch(t){if(t instanceof Wc)throw t;return null}}function Os(){try{const i=localStorage.getItem(ec);return i?JSON.parse(i):[]}catch{return[]}}function tc(i){localStorage.setItem(ec,JSON.stringify(i))}async function On(){const i=await Ns("");return i?i.map(e=>Fr({...e,root:zr(e.root)})):Os().map(e=>Fr({...e,root:zr(e.root)}))}async function zs(i){const e=await Ns(`/${i}`);if(e)return Fr({...e,root:zr(e.root)});const t=Os().find(n=>n.id===i)??null;return t?Fr({...t,root:zr(t.root)}):null}async function dn(i){const e=await Ns("",{method:"POST",body:JSON.stringify(i)});if(e)return yi(),e;const t=Os(),n=new Date().toISOString(),s={id:`asset_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,8)}`,...i,createdAt:n,updatedAt:n};return t.push(s),tc(t),yi(),s}async function Ls(i,e){const t=await Ns(`/${i}`,{method:"PUT",body:JSON.stringify({id:i,...e})});if(t)return yi(),t;const n=Os(),s=n.findIndex(a=>a.id===i);if(s===-1)throw new Error("Asset not found");const r={...n[s],...e,id:n[s].id,createdAt:n[s].createdAt,updatedAt:new Date().toISOString()};return n[s]=r,tc(n),yi(),r}async function nc(i){const e=await Ns(`/${i}`,{method:"DELETE"});if(e&&e.deleted){yi();return}const t=Os().filter(n=>n.id!==i);tc(t),yi()}async function gu(i){const e=await zs(i);if(!e)throw new Error("Asset not found");return dn({name:`${e.name} (Copy)`,category:e.category,description:e.description,root:Rh(e.root),thumbnail:e.thumbnail})}async function _u(i,e){const t=await zs(i);if(!t)throw new Error("Asset not found");return Ls(i,{...t,name:e})}function vu(){yi()}function xu(i){const e=document.createElement("div");e.className="page",e.appendChild(Fn("library"));const t=document.createElement("div");t.className="page-header",t.innerHTML=`
    <div>
      <h2>元件库</h2>
      <p class="muted">管理可复用的 3D 元件（prefab）。</p>
    </div>
    <a class="btn primary" href="#/editor">+ 新建元件</a>
  `,e.appendChild(t);const n=document.createElement("div");n.className="quickbar",n.innerHTML='<span class="muted">预设元件 Presets：</span>';for(const c of _h){const l=document.createElement("button");l.className="btn small",l.textContent=c.label,l.addEventListener("click",async()=>{await dn({name:c.defaultName,category:c.key,description:"",root:c.build()}),await r()}),n.appendChild(l)}e.appendChild(n);const s=document.createElement("div");s.className="asset-grid",e.appendChild(s);async function r(){const c=await On();if(s.innerHTML="",c.length===0){s.innerHTML='<p class="empty">还没有元件，点击「新建元件」或上方快捷按钮开始。</p>';return}for(const l of c)s.appendChild(a(l))}function a(c){const l=document.createElement("div");return l.className="asset-card",l.innerHTML=`
      <div class="thumb">
        ${c.thumbnail?`<img src="${c.thumbnail}" alt=""/>`:`<div class="thumb-placeholder">${kr(c.category)}</div>`}
      </div>
      <div class="meta">
        <strong>${c.name}</strong>
        <span class="badge">${kr(c.category)}</span>
      </div>
      <div class="card-actions">
        <a class="btn small" href="#/editor/${c.id}">编辑</a>
        <button class="btn small" data-dup="${c.id}">拷贝</button>
        <button class="btn small" data-rename="${c.id}">改名</button>
        <button class="btn small danger" data-del="${c.id}">删除</button>
      </div>
    `,l}s.addEventListener("click",async c=>{var p,g,x;const l=c.target,h=(p=l.getAttribute)==null?void 0:p.call(l,"data-del");if(h){confirm("确定删除该元件？")&&(await nc(h),await r());return}const f=(g=l.getAttribute)==null?void 0:g.call(l,"data-dup");if(f){await gu(f),await r();return}const d=(x=l.getAttribute)==null?void 0:x.call(l,"data-rename");if(d){const u=(await On()).find(w=>w.id===d),m=prompt("重命名元件：",(u==null?void 0:u.name)??"");m&&m.trim()&&m.trim()!==(u==null?void 0:u.name)&&(await _u(d,m.trim()),await r());return}});const o=mu(r);e.addEventListener("remove",o),r(),i.appendChild(e)}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const ic="169",Wt={ROTATE:0,DOLLY:1,PAN:2},$i={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},yu=0,jc=1,Mu=2,Ih=1,Su=2,In=3,Qn=0,Xt=1,jt=2,Kn=0,Ji=1,Xc=2,qc=3,$c=4,bu=5,mi=100,Eu=101,wu=102,Tu=103,Au=104,Ru=200,Cu=201,Lu=202,Pu=203,ro=204,ao=205,Iu=206,Du=207,Uu=208,Nu=209,Ou=210,zu=211,Fu=212,ku=213,Bu=214,oo=0,co=1,lo=2,ts=3,ho=4,uo=5,fo=6,po=7,Dh=0,Hu=1,Gu=2,Zn=0,Vu=1,Wu=2,ju=3,Xu=4,qu=5,$u=6,Yu=7,Uh=300,ns=301,is=302,mo=303,go=304,Jr=306,_o=1e3,vi=1001,vo=1002,rn=1003,Ku=1004,Xs=1005,nn=1006,_a=1007,xi=1008,zn=1009,Nh=1010,Oh=1011,Ps=1012,sc=1013,Mi=1014,Dn=1015,Fs=1016,rc=1017,ac=1018,ss=1020,zh=35902,Fh=1021,kh=1022,pn=1023,Bh=1024,Hh=1025,Qi=1026,rs=1027,Gh=1028,oc=1029,Vh=1030,cc=1031,lc=1033,Er=33776,wr=33777,Tr=33778,Ar=33779,xo=35840,yo=35841,Mo=35842,So=35843,bo=36196,Eo=37492,wo=37496,To=37808,Ao=37809,Ro=37810,Co=37811,Lo=37812,Po=37813,Io=37814,Do=37815,Uo=37816,No=37817,Oo=37818,zo=37819,Fo=37820,ko=37821,Rr=36492,Bo=36494,Ho=36495,Wh=36283,Go=36284,Vo=36285,Wo=36286,Zu=3200,Ju=3201,jh=0,Qu=1,Yn="",xn="srgb",ni="srgb-linear",hc="display-p3",Qr="display-p3-linear",Br="linear",ht="srgb",Hr="rec709",Gr="p3",Li=7680,Yc=519,ef=512,tf=513,nf=514,Xh=515,sf=516,rf=517,af=518,of=519,jo=35044,Kc="300 es",Un=2e3,Vr=2001;class Ti{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const s=this._listeners[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const n=this._listeners[e.type];if(n!==void 0){e.target=this;const s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}}const Dt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Cr=Math.PI/180,Xo=180/Math.PI;function Jn(){const i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Dt[i&255]+Dt[i>>8&255]+Dt[i>>16&255]+Dt[i>>24&255]+"-"+Dt[e&255]+Dt[e>>8&255]+"-"+Dt[e>>16&15|64]+Dt[e>>24&255]+"-"+Dt[t&63|128]+Dt[t>>8&255]+"-"+Dt[t>>16&255]+Dt[t>>24&255]+Dt[n&255]+Dt[n>>8&255]+Dt[n>>16&255]+Dt[n>>24&255]).toLowerCase()}function Ft(i,e,t){return Math.max(e,Math.min(t,i))}function cf(i,e){return(i%e+e)%e}function va(i,e,t){return(1-t)*i+t*e}function Mn(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function it(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const lf={DEG2RAD:Cr};class ke{constructor(e=0,t=0){ke.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Ft(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*s+e.x,this.y=r*s+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Ye{constructor(e,t,n,s,r,a,o,c,l){Ye.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,c,l)}set(e,t,n,s,r,a,o,c,l){const h=this.elements;return h[0]=e,h[1]=s,h[2]=o,h[3]=t,h[4]=r,h[5]=c,h[6]=n,h[7]=a,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[3],c=n[6],l=n[1],h=n[4],f=n[7],d=n[2],p=n[5],g=n[8],x=s[0],u=s[3],m=s[6],w=s[1],S=s[4],y=s[7],L=s[2],C=s[5],R=s[8];return r[0]=a*x+o*w+c*L,r[3]=a*u+o*S+c*C,r[6]=a*m+o*y+c*R,r[1]=l*x+h*w+f*L,r[4]=l*u+h*S+f*C,r[7]=l*m+h*y+f*R,r[2]=d*x+p*w+g*L,r[5]=d*u+p*S+g*C,r[8]=d*m+p*y+g*R,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],h=e[8];return t*a*h-t*o*l-n*r*h+n*o*c+s*r*l-s*a*c}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],h=e[8],f=h*a-o*l,d=o*c-h*r,p=l*r-a*c,g=t*f+n*d+s*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const x=1/g;return e[0]=f*x,e[1]=(s*l-h*n)*x,e[2]=(o*n-s*a)*x,e[3]=d*x,e[4]=(h*t-s*c)*x,e[5]=(s*r-o*t)*x,e[6]=p*x,e[7]=(n*c-l*t)*x,e[8]=(a*t-n*r)*x,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,a,o){const c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*a+l*o)+a+e,-s*l,s*c,-s*(-l*a+c*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(xa.makeScale(e,t)),this}rotate(e){return this.premultiply(xa.makeRotation(-e)),this}translate(e,t){return this.premultiply(xa.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const xa=new Ye;function qh(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function Wr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function hf(){const i=Wr("canvas");return i.style.display="block",i}const Zc={};function Lr(i){i in Zc||(Zc[i]=!0,console.warn(i))}function df(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}function uf(i){const e=i.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function ff(i){const e=i.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const Jc=new Ye().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Qc=new Ye().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),fs={[ni]:{transfer:Br,primaries:Hr,luminanceCoefficients:[.2126,.7152,.0722],toReference:i=>i,fromReference:i=>i},[xn]:{transfer:ht,primaries:Hr,luminanceCoefficients:[.2126,.7152,.0722],toReference:i=>i.convertSRGBToLinear(),fromReference:i=>i.convertLinearToSRGB()},[Qr]:{transfer:Br,primaries:Gr,luminanceCoefficients:[.2289,.6917,.0793],toReference:i=>i.applyMatrix3(Qc),fromReference:i=>i.applyMatrix3(Jc)},[hc]:{transfer:ht,primaries:Gr,luminanceCoefficients:[.2289,.6917,.0793],toReference:i=>i.convertSRGBToLinear().applyMatrix3(Qc),fromReference:i=>i.applyMatrix3(Jc).convertLinearToSRGB()}},pf=new Set([ni,Qr]),tt={enabled:!0,_workingColorSpace:ni,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(i){if(!pf.has(i))throw new Error(`Unsupported working color space, "${i}".`);this._workingColorSpace=i},convert:function(i,e,t){if(this.enabled===!1||e===t||!e||!t)return i;const n=fs[e].toReference,s=fs[t].fromReference;return s(n(i))},fromWorkingColorSpace:function(i,e){return this.convert(i,this._workingColorSpace,e)},toWorkingColorSpace:function(i,e){return this.convert(i,e,this._workingColorSpace)},getPrimaries:function(i){return fs[i].primaries},getTransfer:function(i){return i===Yn?Br:fs[i].transfer},getLuminanceCoefficients:function(i,e=this._workingColorSpace){return i.fromArray(fs[e].luminanceCoefficients)}};function es(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function ya(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let Pi;class mf{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{Pi===void 0&&(Pi=Wr("canvas")),Pi.width=e.width,Pi.height=e.height;const n=Pi.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=Pi}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Wr("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=es(r[a]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(es(t[n]/255)*255):t[n]=es(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let gf=0;class $h{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:gf++}),this.uuid=Jn(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(Ma(s[a].image)):r.push(Ma(s[a]))}else r=Ma(s);n.url=r}return t||(e.images[this.uuid]=n),n}}function Ma(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?mf.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let _f=0;class Bt extends Ti{constructor(e=Bt.DEFAULT_IMAGE,t=Bt.DEFAULT_MAPPING,n=vi,s=vi,r=nn,a=xi,o=pn,c=zn,l=Bt.DEFAULT_ANISOTROPY,h=Yn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:_f++}),this.uuid=Jn(),this.name="",this.source=new $h(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new ke(0,0),this.repeat=new ke(1,1),this.center=new ke(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ye,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Uh)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case _o:e.x=e.x-Math.floor(e.x);break;case vi:e.x=e.x<0?0:1;break;case vo:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case _o:e.y=e.y-Math.floor(e.y);break;case vi:e.y=e.y<0?0:1;break;case vo:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Bt.DEFAULT_IMAGE=null;Bt.DEFAULT_MAPPING=Uh;Bt.DEFAULT_ANISOTROPY=1;class vt{constructor(e=0,t=0,n=0,s=1){vt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*s+a[15]*r,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r;const c=e.elements,l=c[0],h=c[4],f=c[8],d=c[1],p=c[5],g=c[9],x=c[2],u=c[6],m=c[10];if(Math.abs(h-d)<.01&&Math.abs(f-x)<.01&&Math.abs(g-u)<.01){if(Math.abs(h+d)<.1&&Math.abs(f+x)<.1&&Math.abs(g+u)<.1&&Math.abs(l+p+m-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const S=(l+1)/2,y=(p+1)/2,L=(m+1)/2,C=(h+d)/4,R=(f+x)/4,z=(g+u)/4;return S>y&&S>L?S<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(S),s=C/n,r=R/n):y>L?y<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(y),n=C/s,r=z/s):L<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(L),n=R/r,s=z/r),this.set(n,s,r,t),this}let w=Math.sqrt((u-g)*(u-g)+(f-x)*(f-x)+(d-h)*(d-h));return Math.abs(w)<.001&&(w=1),this.x=(u-g)/w,this.y=(f-x)/w,this.z=(d-h)/w,this.w=Math.acos((l+p+m-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class vf extends Ti{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new vt(0,0,e,t),this.scissorTest=!1,this.viewport=new vt(0,0,e,t);const s={width:e,height:t,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:nn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const r=new Bt(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);r.flipY=!1,r.generateMipmaps=n.generateMipmaps,r.internalFormat=n.internalFormat,this.textures=[];const a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let n=0,s=e.textures.length;n<s;n++)this.textures[n]=e.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new $h(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Si extends vf{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class Yh extends Bt{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=rn,this.minFilter=rn,this.wrapR=vi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class xf extends Bt{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=rn,this.minFilter=rn,this.wrapR=vi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class It{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,a,o){let c=n[s+0],l=n[s+1],h=n[s+2],f=n[s+3];const d=r[a+0],p=r[a+1],g=r[a+2],x=r[a+3];if(o===0){e[t+0]=c,e[t+1]=l,e[t+2]=h,e[t+3]=f;return}if(o===1){e[t+0]=d,e[t+1]=p,e[t+2]=g,e[t+3]=x;return}if(f!==x||c!==d||l!==p||h!==g){let u=1-o;const m=c*d+l*p+h*g+f*x,w=m>=0?1:-1,S=1-m*m;if(S>Number.EPSILON){const L=Math.sqrt(S),C=Math.atan2(L,m*w);u=Math.sin(u*C)/L,o=Math.sin(o*C)/L}const y=o*w;if(c=c*u+d*y,l=l*u+p*y,h=h*u+g*y,f=f*u+x*y,u===1-o){const L=1/Math.sqrt(c*c+l*l+h*h+f*f);c*=L,l*=L,h*=L,f*=L}}e[t]=c,e[t+1]=l,e[t+2]=h,e[t+3]=f}static multiplyQuaternionsFlat(e,t,n,s,r,a){const o=n[s],c=n[s+1],l=n[s+2],h=n[s+3],f=r[a],d=r[a+1],p=r[a+2],g=r[a+3];return e[t]=o*g+h*f+c*p-l*d,e[t+1]=c*g+h*d+l*f-o*p,e[t+2]=l*g+h*p+o*d-c*f,e[t+3]=h*g-o*f-c*d-l*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,c=Math.sin,l=o(n/2),h=o(s/2),f=o(r/2),d=c(n/2),p=c(s/2),g=c(r/2);switch(a){case"XYZ":this._x=d*h*f+l*p*g,this._y=l*p*f-d*h*g,this._z=l*h*g+d*p*f,this._w=l*h*f-d*p*g;break;case"YXZ":this._x=d*h*f+l*p*g,this._y=l*p*f-d*h*g,this._z=l*h*g-d*p*f,this._w=l*h*f+d*p*g;break;case"ZXY":this._x=d*h*f-l*p*g,this._y=l*p*f+d*h*g,this._z=l*h*g+d*p*f,this._w=l*h*f-d*p*g;break;case"ZYX":this._x=d*h*f-l*p*g,this._y=l*p*f+d*h*g,this._z=l*h*g-d*p*f,this._w=l*h*f+d*p*g;break;case"YZX":this._x=d*h*f+l*p*g,this._y=l*p*f+d*h*g,this._z=l*h*g-d*p*f,this._w=l*h*f-d*p*g;break;case"XZY":this._x=d*h*f-l*p*g,this._y=l*p*f-d*h*g,this._z=l*h*g+d*p*f,this._w=l*h*f+d*p*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],s=t[4],r=t[8],a=t[1],o=t[5],c=t[9],l=t[2],h=t[6],f=t[10],d=n+o+f;if(d>0){const p=.5/Math.sqrt(d+1);this._w=.25/p,this._x=(h-c)*p,this._y=(r-l)*p,this._z=(a-s)*p}else if(n>o&&n>f){const p=2*Math.sqrt(1+n-o-f);this._w=(h-c)/p,this._x=.25*p,this._y=(s+a)/p,this._z=(r+l)/p}else if(o>f){const p=2*Math.sqrt(1+o-n-f);this._w=(r-l)/p,this._x=(s+a)/p,this._y=.25*p,this._z=(c+h)/p}else{const p=2*Math.sqrt(1+f-n-o);this._w=(a-s)/p,this._x=(r+l)/p,this._y=(c+h)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Ft(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,s=e._y,r=e._z,a=e._w,o=t._x,c=t._y,l=t._z,h=t._w;return this._x=n*h+a*o+s*l-r*c,this._y=s*h+a*c+r*o-n*l,this._z=r*h+a*l+n*c-s*o,this._w=a*h-n*o-s*c-r*l,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,s=this._y,r=this._z,a=this._w;let o=a*e._w+n*e._x+s*e._y+r*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=n,this._y=s,this._z=r,this;const c=1-o*o;if(c<=Number.EPSILON){const p=1-t;return this._w=p*a+t*this._w,this._x=p*n+t*this._x,this._y=p*s+t*this._y,this._z=p*r+t*this._z,this.normalize(),this}const l=Math.sqrt(c),h=Math.atan2(l,o),f=Math.sin((1-t)*h)/l,d=Math.sin(t*h)/l;return this._w=a*f+this._w*d,this._x=n*f+this._x*d,this._y=s*f+this._y*d,this._z=r*f+this._z*d,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class D{constructor(e=0,t=0,n=0){D.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(el.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(el.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,s=this.z,r=e.x,a=e.y,o=e.z,c=e.w,l=2*(a*s-o*n),h=2*(o*t-r*s),f=2*(r*n-a*t);return this.x=t+c*l+a*f-o*h,this.y=n+c*h+o*l-r*f,this.z=s+c*f+r*h-a*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,s=e.y,r=e.z,a=t.x,o=t.y,c=t.z;return this.x=s*c-r*o,this.y=r*a-n*c,this.z=n*o-s*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Sa.copy(this).projectOnVector(e),this.sub(Sa)}reflect(e){return this.sub(Sa.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Ft(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Sa=new D,el=new It;class Ai{constructor(e=new D(1/0,1/0,1/0),t=new D(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(on.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(on.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=on.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,on):on.fromBufferAttribute(r,a),on.applyMatrix4(e.matrixWorld),this.expandByPoint(on);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),qs.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),qs.copy(n.boundingBox)),qs.applyMatrix4(e.matrixWorld),this.union(qs)}const s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,on),on.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ps),$s.subVectors(this.max,ps),Ii.subVectors(e.a,ps),Di.subVectors(e.b,ps),Ui.subVectors(e.c,ps),Hn.subVectors(Di,Ii),Gn.subVectors(Ui,Di),ri.subVectors(Ii,Ui);let t=[0,-Hn.z,Hn.y,0,-Gn.z,Gn.y,0,-ri.z,ri.y,Hn.z,0,-Hn.x,Gn.z,0,-Gn.x,ri.z,0,-ri.x,-Hn.y,Hn.x,0,-Gn.y,Gn.x,0,-ri.y,ri.x,0];return!ba(t,Ii,Di,Ui,$s)||(t=[1,0,0,0,1,0,0,0,1],!ba(t,Ii,Di,Ui,$s))?!1:(Ys.crossVectors(Hn,Gn),t=[Ys.x,Ys.y,Ys.z],ba(t,Ii,Di,Ui,$s))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,on).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(on).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(wn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),wn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),wn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),wn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),wn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),wn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),wn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),wn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(wn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const wn=[new D,new D,new D,new D,new D,new D,new D,new D],on=new D,qs=new Ai,Ii=new D,Di=new D,Ui=new D,Hn=new D,Gn=new D,ri=new D,ps=new D,$s=new D,Ys=new D,ai=new D;function ba(i,e,t,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){ai.fromArray(i,r);const o=s.x*Math.abs(ai.x)+s.y*Math.abs(ai.y)+s.z*Math.abs(ai.z),c=e.dot(ai),l=t.dot(ai),h=n.dot(ai);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>o)return!1}return!0}const yf=new Ai,ms=new D,Ea=new D;class ea{constructor(e=new D,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):yf.setFromPoints(e).getCenter(n);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ms.subVectors(e,this.center);const t=ms.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(ms,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Ea.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ms.copy(e.center).add(Ea)),this.expandByPoint(ms.copy(e.center).sub(Ea))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Tn=new D,wa=new D,Ks=new D,Vn=new D,Ta=new D,Zs=new D,Aa=new D;class ta{constructor(e=new D,t=new D(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Tn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Tn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Tn.copy(this.origin).addScaledVector(this.direction,t),Tn.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){wa.copy(e).add(t).multiplyScalar(.5),Ks.copy(t).sub(e).normalize(),Vn.copy(this.origin).sub(wa);const r=e.distanceTo(t)*.5,a=-this.direction.dot(Ks),o=Vn.dot(this.direction),c=-Vn.dot(Ks),l=Vn.lengthSq(),h=Math.abs(1-a*a);let f,d,p,g;if(h>0)if(f=a*c-o,d=a*o-c,g=r*h,f>=0)if(d>=-g)if(d<=g){const x=1/h;f*=x,d*=x,p=f*(f+a*d+2*o)+d*(a*f+d+2*c)+l}else d=r,f=Math.max(0,-(a*d+o)),p=-f*f+d*(d+2*c)+l;else d=-r,f=Math.max(0,-(a*d+o)),p=-f*f+d*(d+2*c)+l;else d<=-g?(f=Math.max(0,-(-a*r+o)),d=f>0?-r:Math.min(Math.max(-r,-c),r),p=-f*f+d*(d+2*c)+l):d<=g?(f=0,d=Math.min(Math.max(-r,-c),r),p=d*(d+2*c)+l):(f=Math.max(0,-(a*r+o)),d=f>0?r:Math.min(Math.max(-r,-c),r),p=-f*f+d*(d+2*c)+l);else d=a>0?-r:r,f=Math.max(0,-(a*d+o)),p=-f*f+d*(d+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,f),s&&s.copy(wa).addScaledVector(Ks,d),p}intersectSphere(e,t){Tn.subVectors(e.center,this.origin);const n=Tn.dot(this.direction),s=Tn.dot(Tn)-n*n,r=e.radius*e.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=n-a,c=n+a;return c<0?null:o<0?this.at(c,t):this.at(o,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,a,o,c;const l=1/this.direction.x,h=1/this.direction.y,f=1/this.direction.z,d=this.origin;return l>=0?(n=(e.min.x-d.x)*l,s=(e.max.x-d.x)*l):(n=(e.max.x-d.x)*l,s=(e.min.x-d.x)*l),h>=0?(r=(e.min.y-d.y)*h,a=(e.max.y-d.y)*h):(r=(e.max.y-d.y)*h,a=(e.min.y-d.y)*h),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),f>=0?(o=(e.min.z-d.z)*f,c=(e.max.z-d.z)*f):(o=(e.max.z-d.z)*f,c=(e.min.z-d.z)*f),n>c||o>s)||((o>n||n!==n)&&(n=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,Tn)!==null}intersectTriangle(e,t,n,s,r){Ta.subVectors(t,e),Zs.subVectors(n,e),Aa.crossVectors(Ta,Zs);let a=this.direction.dot(Aa),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Vn.subVectors(this.origin,e);const c=o*this.direction.dot(Zs.crossVectors(Vn,Zs));if(c<0)return null;const l=o*this.direction.dot(Ta.cross(Vn));if(l<0||c+l>a)return null;const h=-o*Vn.dot(Aa);return h<0?null:this.at(h/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class at{constructor(e,t,n,s,r,a,o,c,l,h,f,d,p,g,x,u){at.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,c,l,h,f,d,p,g,x,u)}set(e,t,n,s,r,a,o,c,l,h,f,d,p,g,x,u){const m=this.elements;return m[0]=e,m[4]=t,m[8]=n,m[12]=s,m[1]=r,m[5]=a,m[9]=o,m[13]=c,m[2]=l,m[6]=h,m[10]=f,m[14]=d,m[3]=p,m[7]=g,m[11]=x,m[15]=u,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new at().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,s=1/Ni.setFromMatrixColumn(e,0).length(),r=1/Ni.setFromMatrixColumn(e,1).length(),a=1/Ni.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,s=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),c=Math.cos(s),l=Math.sin(s),h=Math.cos(r),f=Math.sin(r);if(e.order==="XYZ"){const d=a*h,p=a*f,g=o*h,x=o*f;t[0]=c*h,t[4]=-c*f,t[8]=l,t[1]=p+g*l,t[5]=d-x*l,t[9]=-o*c,t[2]=x-d*l,t[6]=g+p*l,t[10]=a*c}else if(e.order==="YXZ"){const d=c*h,p=c*f,g=l*h,x=l*f;t[0]=d+x*o,t[4]=g*o-p,t[8]=a*l,t[1]=a*f,t[5]=a*h,t[9]=-o,t[2]=p*o-g,t[6]=x+d*o,t[10]=a*c}else if(e.order==="ZXY"){const d=c*h,p=c*f,g=l*h,x=l*f;t[0]=d-x*o,t[4]=-a*f,t[8]=g+p*o,t[1]=p+g*o,t[5]=a*h,t[9]=x-d*o,t[2]=-a*l,t[6]=o,t[10]=a*c}else if(e.order==="ZYX"){const d=a*h,p=a*f,g=o*h,x=o*f;t[0]=c*h,t[4]=g*l-p,t[8]=d*l+x,t[1]=c*f,t[5]=x*l+d,t[9]=p*l-g,t[2]=-l,t[6]=o*c,t[10]=a*c}else if(e.order==="YZX"){const d=a*c,p=a*l,g=o*c,x=o*l;t[0]=c*h,t[4]=x-d*f,t[8]=g*f+p,t[1]=f,t[5]=a*h,t[9]=-o*h,t[2]=-l*h,t[6]=p*f+g,t[10]=d-x*f}else if(e.order==="XZY"){const d=a*c,p=a*l,g=o*c,x=o*l;t[0]=c*h,t[4]=-f,t[8]=l*h,t[1]=d*f+x,t[5]=a*h,t[9]=p*f-g,t[2]=g*f-p,t[6]=o*h,t[10]=x*f+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Mf,e,Sf)}lookAt(e,t,n){const s=this.elements;return Yt.subVectors(e,t),Yt.lengthSq()===0&&(Yt.z=1),Yt.normalize(),Wn.crossVectors(n,Yt),Wn.lengthSq()===0&&(Math.abs(n.z)===1?Yt.x+=1e-4:Yt.z+=1e-4,Yt.normalize(),Wn.crossVectors(n,Yt)),Wn.normalize(),Js.crossVectors(Yt,Wn),s[0]=Wn.x,s[4]=Js.x,s[8]=Yt.x,s[1]=Wn.y,s[5]=Js.y,s[9]=Yt.y,s[2]=Wn.z,s[6]=Js.z,s[10]=Yt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[4],c=n[8],l=n[12],h=n[1],f=n[5],d=n[9],p=n[13],g=n[2],x=n[6],u=n[10],m=n[14],w=n[3],S=n[7],y=n[11],L=n[15],C=s[0],R=s[4],z=s[8],ne=s[12],_=s[1],M=s[5],O=s[9],k=s[13],q=s[2],W=s[6],V=s[10],ie=s[14],K=s[3],me=s[7],xe=s[11],ve=s[15];return r[0]=a*C+o*_+c*q+l*K,r[4]=a*R+o*M+c*W+l*me,r[8]=a*z+o*O+c*V+l*xe,r[12]=a*ne+o*k+c*ie+l*ve,r[1]=h*C+f*_+d*q+p*K,r[5]=h*R+f*M+d*W+p*me,r[9]=h*z+f*O+d*V+p*xe,r[13]=h*ne+f*k+d*ie+p*ve,r[2]=g*C+x*_+u*q+m*K,r[6]=g*R+x*M+u*W+m*me,r[10]=g*z+x*O+u*V+m*xe,r[14]=g*ne+x*k+u*ie+m*ve,r[3]=w*C+S*_+y*q+L*K,r[7]=w*R+S*M+y*W+L*me,r[11]=w*z+S*O+y*V+L*xe,r[15]=w*ne+S*k+y*ie+L*ve,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],a=e[1],o=e[5],c=e[9],l=e[13],h=e[2],f=e[6],d=e[10],p=e[14],g=e[3],x=e[7],u=e[11],m=e[15];return g*(+r*c*f-s*l*f-r*o*d+n*l*d+s*o*p-n*c*p)+x*(+t*c*p-t*l*d+r*a*d-s*a*p+s*l*h-r*c*h)+u*(+t*l*f-t*o*p-r*a*f+n*a*p+r*o*h-n*l*h)+m*(-s*o*h-t*c*f+t*o*d+s*a*f-n*a*d+n*c*h)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],h=e[8],f=e[9],d=e[10],p=e[11],g=e[12],x=e[13],u=e[14],m=e[15],w=f*u*l-x*d*l+x*c*p-o*u*p-f*c*m+o*d*m,S=g*d*l-h*u*l-g*c*p+a*u*p+h*c*m-a*d*m,y=h*x*l-g*f*l+g*o*p-a*x*p-h*o*m+a*f*m,L=g*f*c-h*x*c-g*o*d+a*x*d+h*o*u-a*f*u,C=t*w+n*S+s*y+r*L;if(C===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const R=1/C;return e[0]=w*R,e[1]=(x*d*r-f*u*r-x*s*p+n*u*p+f*s*m-n*d*m)*R,e[2]=(o*u*r-x*c*r+x*s*l-n*u*l-o*s*m+n*c*m)*R,e[3]=(f*c*r-o*d*r-f*s*l+n*d*l+o*s*p-n*c*p)*R,e[4]=S*R,e[5]=(h*u*r-g*d*r+g*s*p-t*u*p-h*s*m+t*d*m)*R,e[6]=(g*c*r-a*u*r-g*s*l+t*u*l+a*s*m-t*c*m)*R,e[7]=(a*d*r-h*c*r+h*s*l-t*d*l-a*s*p+t*c*p)*R,e[8]=y*R,e[9]=(g*f*r-h*x*r-g*n*p+t*x*p+h*n*m-t*f*m)*R,e[10]=(a*x*r-g*o*r+g*n*l-t*x*l-a*n*m+t*o*m)*R,e[11]=(h*o*r-a*f*r-h*n*l+t*f*l+a*n*p-t*o*p)*R,e[12]=L*R,e[13]=(h*x*s-g*f*s+g*n*d-t*x*d-h*n*u+t*f*u)*R,e[14]=(g*o*s-a*x*s-g*n*c+t*x*c+a*n*u-t*o*u)*R,e[15]=(a*f*s-h*o*s+h*n*c-t*f*c-a*n*d+t*o*d)*R,this}scale(e){const t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),s=Math.sin(t),r=1-n,a=e.x,o=e.y,c=e.z,l=r*a,h=r*o;return this.set(l*a+n,l*o-s*c,l*c+s*o,0,l*o+s*c,h*o+n,h*c-s*a,0,l*c-s*o,h*c+s*a,r*c*c+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,a){return this.set(1,n,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){const s=this.elements,r=t._x,a=t._y,o=t._z,c=t._w,l=r+r,h=a+a,f=o+o,d=r*l,p=r*h,g=r*f,x=a*h,u=a*f,m=o*f,w=c*l,S=c*h,y=c*f,L=n.x,C=n.y,R=n.z;return s[0]=(1-(x+m))*L,s[1]=(p+y)*L,s[2]=(g-S)*L,s[3]=0,s[4]=(p-y)*C,s[5]=(1-(d+m))*C,s[6]=(u+w)*C,s[7]=0,s[8]=(g+S)*R,s[9]=(u-w)*R,s[10]=(1-(d+x))*R,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){const s=this.elements;let r=Ni.set(s[0],s[1],s[2]).length();const a=Ni.set(s[4],s[5],s[6]).length(),o=Ni.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],cn.copy(this);const l=1/r,h=1/a,f=1/o;return cn.elements[0]*=l,cn.elements[1]*=l,cn.elements[2]*=l,cn.elements[4]*=h,cn.elements[5]*=h,cn.elements[6]*=h,cn.elements[8]*=f,cn.elements[9]*=f,cn.elements[10]*=f,t.setFromRotationMatrix(cn),n.x=r,n.y=a,n.z=o,this}makePerspective(e,t,n,s,r,a,o=Un){const c=this.elements,l=2*r/(t-e),h=2*r/(n-s),f=(t+e)/(t-e),d=(n+s)/(n-s);let p,g;if(o===Un)p=-(a+r)/(a-r),g=-2*a*r/(a-r);else if(o===Vr)p=-a/(a-r),g=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=l,c[4]=0,c[8]=f,c[12]=0,c[1]=0,c[5]=h,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,s,r,a,o=Un){const c=this.elements,l=1/(t-e),h=1/(n-s),f=1/(a-r),d=(t+e)*l,p=(n+s)*h;let g,x;if(o===Un)g=(a+r)*f,x=-2*f;else if(o===Vr)g=r*f,x=-1*f;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-d,c[1]=0,c[5]=2*h,c[9]=0,c[13]=-p,c[2]=0,c[6]=0,c[10]=x,c[14]=-g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const Ni=new D,cn=new at,Mf=new D(0,0,0),Sf=new D(1,1,1),Wn=new D,Js=new D,Yt=new D,tl=new at,nl=new It;class _n{constructor(e=0,t=0,n=0,s=_n.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const s=e.elements,r=s[0],a=s[4],o=s[8],c=s[1],l=s[5],h=s[9],f=s[2],d=s[6],p=s[10];switch(t){case"XYZ":this._y=Math.asin(Ft(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,p),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(d,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Ft(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,p),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-f,r),this._z=0);break;case"ZXY":this._x=Math.asin(Ft(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-f,p),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-Ft(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(d,p),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(Ft(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-f,r)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-Ft(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,l),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return tl.makeRotationFromQuaternion(e),this.setFromRotationMatrix(tl,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return nl.setFromEuler(this),this.setFromQuaternion(nl,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}_n.DEFAULT_ORDER="XYZ";class dc{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let bf=0;const il=new D,Oi=new It,An=new at,Qs=new D,gs=new D,Ef=new D,wf=new It,sl=new D(1,0,0),rl=new D(0,1,0),al=new D(0,0,1),ol={type:"added"},Tf={type:"removed"},zi={type:"childadded",child:null},Ra={type:"childremoved",child:null};class xt extends Ti{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:bf++}),this.uuid=Jn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=xt.DEFAULT_UP.clone();const e=new D,t=new _n,n=new It,s=new D(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new at},normalMatrix:{value:new Ye}}),this.matrix=new at,this.matrixWorld=new at,this.matrixAutoUpdate=xt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=xt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new dc,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Oi.setFromAxisAngle(e,t),this.quaternion.multiply(Oi),this}rotateOnWorldAxis(e,t){return Oi.setFromAxisAngle(e,t),this.quaternion.premultiply(Oi),this}rotateX(e){return this.rotateOnAxis(sl,e)}rotateY(e){return this.rotateOnAxis(rl,e)}rotateZ(e){return this.rotateOnAxis(al,e)}translateOnAxis(e,t){return il.copy(e).applyQuaternion(this.quaternion),this.position.add(il.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(sl,e)}translateY(e){return this.translateOnAxis(rl,e)}translateZ(e){return this.translateOnAxis(al,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(An.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Qs.copy(e):Qs.set(e,t,n);const s=this.parent;this.updateWorldMatrix(!0,!1),gs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?An.lookAt(gs,Qs,this.up):An.lookAt(Qs,gs,this.up),this.quaternion.setFromRotationMatrix(An),s&&(An.extractRotation(s.matrixWorld),Oi.setFromRotationMatrix(An),this.quaternion.premultiply(Oi.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(ol),zi.child=e,this.dispatchEvent(zi),zi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Tf),Ra.child=e,this.dispatchEvent(Ra),Ra.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),An.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),An.multiply(e.parent.matrixWorld)),e.applyMatrix4(An),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(ol),zi.child=e,this.dispatchEvent(zi),zi.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(gs,e,Ef),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(gs,wf,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const f=c[l];r(e.shapes,f)}else r(e.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(r(e.materials,this.material[c]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];s.animations.push(r(e.animations,c))}}if(t){const o=a(e.geometries),c=a(e.materials),l=a(e.textures),h=a(e.images),f=a(e.shapes),d=a(e.skeletons),p=a(e.animations),g=a(e.nodes);o.length>0&&(n.geometries=o),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),f.length>0&&(n.shapes=f),d.length>0&&(n.skeletons=d),p.length>0&&(n.animations=p),g.length>0&&(n.nodes=g)}return n.object=s,n;function a(o){const c=[];for(const l in o){const h=o[l];delete h.metadata,c.push(h)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const s=e.children[n];this.add(s.clone())}return this}}xt.DEFAULT_UP=new D(0,1,0);xt.DEFAULT_MATRIX_AUTO_UPDATE=!0;xt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const ln=new D,Rn=new D,Ca=new D,Cn=new D,Fi=new D,ki=new D,cl=new D,La=new D,Pa=new D,Ia=new D,Da=new vt,Ua=new vt,Na=new vt;class sn{constructor(e=new D,t=new D,n=new D){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),ln.subVectors(e,t),s.cross(ln);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){ln.subVectors(s,t),Rn.subVectors(n,t),Ca.subVectors(e,t);const a=ln.dot(ln),o=ln.dot(Rn),c=ln.dot(Ca),l=Rn.dot(Rn),h=Rn.dot(Ca),f=a*l-o*o;if(f===0)return r.set(0,0,0),null;const d=1/f,p=(l*c-o*h)*d,g=(a*h-o*c)*d;return r.set(1-p-g,g,p)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,Cn)===null?!1:Cn.x>=0&&Cn.y>=0&&Cn.x+Cn.y<=1}static getInterpolation(e,t,n,s,r,a,o,c){return this.getBarycoord(e,t,n,s,Cn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,Cn.x),c.addScaledVector(a,Cn.y),c.addScaledVector(o,Cn.z),c)}static getInterpolatedAttribute(e,t,n,s,r,a){return Da.setScalar(0),Ua.setScalar(0),Na.setScalar(0),Da.fromBufferAttribute(e,t),Ua.fromBufferAttribute(e,n),Na.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(Da,r.x),a.addScaledVector(Ua,r.y),a.addScaledVector(Na,r.z),a}static isFrontFacing(e,t,n,s){return ln.subVectors(n,t),Rn.subVectors(e,t),ln.cross(Rn).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return ln.subVectors(this.c,this.b),Rn.subVectors(this.a,this.b),ln.cross(Rn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return sn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return sn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return sn.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return sn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return sn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,s=this.b,r=this.c;let a,o;Fi.subVectors(s,n),ki.subVectors(r,n),La.subVectors(e,n);const c=Fi.dot(La),l=ki.dot(La);if(c<=0&&l<=0)return t.copy(n);Pa.subVectors(e,s);const h=Fi.dot(Pa),f=ki.dot(Pa);if(h>=0&&f<=h)return t.copy(s);const d=c*f-h*l;if(d<=0&&c>=0&&h<=0)return a=c/(c-h),t.copy(n).addScaledVector(Fi,a);Ia.subVectors(e,r);const p=Fi.dot(Ia),g=ki.dot(Ia);if(g>=0&&p<=g)return t.copy(r);const x=p*l-c*g;if(x<=0&&l>=0&&g<=0)return o=l/(l-g),t.copy(n).addScaledVector(ki,o);const u=h*g-p*f;if(u<=0&&f-h>=0&&p-g>=0)return cl.subVectors(r,s),o=(f-h)/(f-h+(p-g)),t.copy(s).addScaledVector(cl,o);const m=1/(u+x+d);return a=x*m,o=d*m,t.copy(n).addScaledVector(Fi,a).addScaledVector(ki,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Kh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},jn={h:0,s:0,l:0},er={h:0,s:0,l:0};function Oa(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}class je{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=xn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,tt.toWorkingColorSpace(this,t),this}setRGB(e,t,n,s=tt.workingColorSpace){return this.r=e,this.g=t,this.b=n,tt.toWorkingColorSpace(this,s),this}setHSL(e,t,n,s=tt.workingColorSpace){if(e=cf(e,1),t=Ft(t,0,1),n=Ft(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=Oa(a,r,e+1/3),this.g=Oa(a,r,e),this.b=Oa(a,r,e-1/3)}return tt.toWorkingColorSpace(this,s),this}setStyle(e,t=xn){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=xn){const n=Kh[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=es(e.r),this.g=es(e.g),this.b=es(e.b),this}copyLinearToSRGB(e){return this.r=ya(e.r),this.g=ya(e.g),this.b=ya(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=xn){return tt.fromWorkingColorSpace(Ut.copy(this),e),Math.round(Ft(Ut.r*255,0,255))*65536+Math.round(Ft(Ut.g*255,0,255))*256+Math.round(Ft(Ut.b*255,0,255))}getHexString(e=xn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=tt.workingColorSpace){tt.fromWorkingColorSpace(Ut.copy(this),t);const n=Ut.r,s=Ut.g,r=Ut.b,a=Math.max(n,s,r),o=Math.min(n,s,r);let c,l;const h=(o+a)/2;if(o===a)c=0,l=0;else{const f=a-o;switch(l=h<=.5?f/(a+o):f/(2-a-o),a){case n:c=(s-r)/f+(s<r?6:0);break;case s:c=(r-n)/f+2;break;case r:c=(n-s)/f+4;break}c/=6}return e.h=c,e.s=l,e.l=h,e}getRGB(e,t=tt.workingColorSpace){return tt.fromWorkingColorSpace(Ut.copy(this),t),e.r=Ut.r,e.g=Ut.g,e.b=Ut.b,e}getStyle(e=xn){tt.fromWorkingColorSpace(Ut.copy(this),e);const t=Ut.r,n=Ut.g,s=Ut.b;return e!==xn?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(jn),this.setHSL(jn.h+e,jn.s+t,jn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(jn),e.getHSL(er);const n=va(jn.h,er.h,t),s=va(jn.s,er.s,t),r=va(jn.l,er.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ut=new je;je.NAMES=Kh;let Af=0;class Ri extends Ti{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Af++}),this.uuid=Jn(),this.name="",this.type="Material",this.blending=Ji,this.side=Qn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ro,this.blendDst=ao,this.blendEquation=mi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new je(0,0,0),this.blendAlpha=0,this.depthFunc=ts,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Yc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Li,this.stencilZFail=Li,this.stencilZPass=Li,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Ji&&(n.blending=this.blending),this.side!==Qn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==ro&&(n.blendSrc=this.blendSrc),this.blendDst!==ao&&(n.blendDst=this.blendDst),this.blendEquation!==mi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==ts&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Yc&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Li&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Li&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Li&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const a=[];for(const o in r){const c=r[o];delete c.metadata,a.push(c)}return a}if(t){const r=s(e.textures),a=s(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class as extends Ri{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new je(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new _n,this.combine=Dh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const St=new D,tr=new ke;class Lt{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=jo,this.updateRanges=[],this.gpuType=Dn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)tr.fromBufferAttribute(this,t),tr.applyMatrix3(e),this.setXY(t,tr.x,tr.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)St.fromBufferAttribute(this,t),St.applyMatrix3(e),this.setXYZ(t,St.x,St.y,St.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)St.fromBufferAttribute(this,t),St.applyMatrix4(e),this.setXYZ(t,St.x,St.y,St.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)St.fromBufferAttribute(this,t),St.applyNormalMatrix(e),this.setXYZ(t,St.x,St.y,St.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)St.fromBufferAttribute(this,t),St.transformDirection(e),this.setXYZ(t,St.x,St.y,St.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Mn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=it(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Mn(t,this.array)),t}setX(e,t){return this.normalized&&(t=it(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Mn(t,this.array)),t}setY(e,t){return this.normalized&&(t=it(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Mn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=it(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Mn(t,this.array)),t}setW(e,t){return this.normalized&&(t=it(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=it(t,this.array),n=it(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=it(t,this.array),n=it(n,this.array),s=it(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=it(t,this.array),n=it(n,this.array),s=it(s,this.array),r=it(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==jo&&(e.usage=this.usage),e}}class Zh extends Lt{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class Jh extends Lt{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class ut extends Lt{constructor(e,t,n){super(new Float32Array(e),t,n)}}let Rf=0;const Qt=new at,za=new xt,Bi=new D,Kt=new Ai,_s=new Ai,Rt=new D;class ct extends Ti{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Rf++}),this.uuid=Jn(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(qh(e)?Jh:Zh)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Ye().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Qt.makeRotationFromQuaternion(e),this.applyMatrix4(Qt),this}rotateX(e){return Qt.makeRotationX(e),this.applyMatrix4(Qt),this}rotateY(e){return Qt.makeRotationY(e),this.applyMatrix4(Qt),this}rotateZ(e){return Qt.makeRotationZ(e),this.applyMatrix4(Qt),this}translate(e,t,n){return Qt.makeTranslation(e,t,n),this.applyMatrix4(Qt),this}scale(e,t,n){return Qt.makeScale(e,t,n),this.applyMatrix4(Qt),this}lookAt(e){return za.lookAt(e),za.updateMatrix(),this.applyMatrix4(za.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Bi).negate(),this.translate(Bi.x,Bi.y,Bi.z),this}setFromPoints(e){const t=[];for(let n=0,s=e.length;n<s;n++){const r=e[n];t.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new ut(t,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ai);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new D(-1/0,-1/0,-1/0),new D(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){const r=t[n];Kt.setFromBufferAttribute(r),this.morphTargetsRelative?(Rt.addVectors(this.boundingBox.min,Kt.min),this.boundingBox.expandByPoint(Rt),Rt.addVectors(this.boundingBox.max,Kt.max),this.boundingBox.expandByPoint(Rt)):(this.boundingBox.expandByPoint(Kt.min),this.boundingBox.expandByPoint(Kt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ea);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new D,1/0);return}if(e){const n=this.boundingSphere.center;if(Kt.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];_s.setFromBufferAttribute(o),this.morphTargetsRelative?(Rt.addVectors(Kt.min,_s.min),Kt.expandByPoint(Rt),Rt.addVectors(Kt.max,_s.max),Kt.expandByPoint(Rt)):(Kt.expandByPoint(_s.min),Kt.expandByPoint(_s.max))}Kt.getCenter(n);let s=0;for(let r=0,a=e.count;r<a;r++)Rt.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(Rt));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],c=this.morphTargetsRelative;for(let l=0,h=o.count;l<h;l++)Rt.fromBufferAttribute(o,l),c&&(Bi.fromBufferAttribute(e,l),Rt.add(Bi)),s=Math.max(s,n.distanceToSquared(Rt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Lt(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),o=[],c=[];for(let z=0;z<n.count;z++)o[z]=new D,c[z]=new D;const l=new D,h=new D,f=new D,d=new ke,p=new ke,g=new ke,x=new D,u=new D;function m(z,ne,_){l.fromBufferAttribute(n,z),h.fromBufferAttribute(n,ne),f.fromBufferAttribute(n,_),d.fromBufferAttribute(r,z),p.fromBufferAttribute(r,ne),g.fromBufferAttribute(r,_),h.sub(l),f.sub(l),p.sub(d),g.sub(d);const M=1/(p.x*g.y-g.x*p.y);isFinite(M)&&(x.copy(h).multiplyScalar(g.y).addScaledVector(f,-p.y).multiplyScalar(M),u.copy(f).multiplyScalar(p.x).addScaledVector(h,-g.x).multiplyScalar(M),o[z].add(x),o[ne].add(x),o[_].add(x),c[z].add(u),c[ne].add(u),c[_].add(u))}let w=this.groups;w.length===0&&(w=[{start:0,count:e.count}]);for(let z=0,ne=w.length;z<ne;++z){const _=w[z],M=_.start,O=_.count;for(let k=M,q=M+O;k<q;k+=3)m(e.getX(k+0),e.getX(k+1),e.getX(k+2))}const S=new D,y=new D,L=new D,C=new D;function R(z){L.fromBufferAttribute(s,z),C.copy(L);const ne=o[z];S.copy(ne),S.sub(L.multiplyScalar(L.dot(ne))).normalize(),y.crossVectors(C,ne);const M=y.dot(c[z])<0?-1:1;a.setXYZW(z,S.x,S.y,S.z,M)}for(let z=0,ne=w.length;z<ne;++z){const _=w[z],M=_.start,O=_.count;for(let k=M,q=M+O;k<q;k+=3)R(e.getX(k+0)),R(e.getX(k+1)),R(e.getX(k+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Lt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,p=n.count;d<p;d++)n.setXYZ(d,0,0,0);const s=new D,r=new D,a=new D,o=new D,c=new D,l=new D,h=new D,f=new D;if(e)for(let d=0,p=e.count;d<p;d+=3){const g=e.getX(d+0),x=e.getX(d+1),u=e.getX(d+2);s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,x),a.fromBufferAttribute(t,u),h.subVectors(a,r),f.subVectors(s,r),h.cross(f),o.fromBufferAttribute(n,g),c.fromBufferAttribute(n,x),l.fromBufferAttribute(n,u),o.add(h),c.add(h),l.add(h),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(x,c.x,c.y,c.z),n.setXYZ(u,l.x,l.y,l.z)}else for(let d=0,p=t.count;d<p;d+=3)s.fromBufferAttribute(t,d+0),r.fromBufferAttribute(t,d+1),a.fromBufferAttribute(t,d+2),h.subVectors(a,r),f.subVectors(s,r),h.cross(f),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Rt.fromBufferAttribute(e,t),Rt.normalize(),e.setXYZ(t,Rt.x,Rt.y,Rt.z)}toNonIndexed(){function e(o,c){const l=o.array,h=o.itemSize,f=o.normalized,d=new l.constructor(c.length*h);let p=0,g=0;for(let x=0,u=c.length;x<u;x++){o.isInterleavedBufferAttribute?p=c[x]*o.data.stride+o.offset:p=c[x]*h;for(let m=0;m<h;m++)d[g++]=l[p++]}return new Lt(d,h,f)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new ct,n=this.index.array,s=this.attributes;for(const o in s){const c=s[o],l=e(c,n);t.setAttribute(o,l)}const r=this.morphAttributes;for(const o in r){const c=[],l=r[o];for(let h=0,f=l.length;h<f;h++){const d=l[h],p=e(d,n);c.push(p)}t.morphAttributes[o]=c}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,c=a.length;o<c;o++){const l=a[o];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const c in n){const l=n[c];e.data.attributes[c]=l.toJSON(e.data)}const s={};let r=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let f=0,d=l.length;f<d;f++){const p=l[f];h.push(p.toJSON(e.data))}h.length>0&&(s[c]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone(t));const s=e.attributes;for(const l in s){const h=s[l];this.setAttribute(l,h.clone(t))}const r=e.morphAttributes;for(const l in r){const h=[],f=r[l];for(let d=0,p=f.length;d<p;d++)h.push(f[d].clone(t));this.morphAttributes[l]=h}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let l=0,h=a.length;l<h;l++){const f=a[l];this.addGroup(f.start,f.count,f.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const ll=new at,oi=new ta,nr=new ea,hl=new D,ir=new D,sr=new D,rr=new D,Fa=new D,ar=new D,dl=new D,or=new D;class Ee extends xt{constructor(e=new ct,t=new as){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(s,e);const o=this.morphTargetInfluences;if(r&&o){ar.set(0,0,0);for(let c=0,l=r.length;c<l;c++){const h=o[c],f=r[c];h!==0&&(Fa.fromBufferAttribute(f,e),a?ar.addScaledVector(Fa,h):ar.addScaledVector(Fa.sub(t),h))}t.add(ar)}return t}raycast(e,t){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),nr.copy(n.boundingSphere),nr.applyMatrix4(r),oi.copy(e.ray).recast(e.near),!(nr.containsPoint(oi.origin)===!1&&(oi.intersectSphere(nr,hl)===null||oi.origin.distanceToSquared(hl)>(e.far-e.near)**2))&&(ll.copy(r).invert(),oi.copy(e.ray).applyMatrix4(ll),!(n.boundingBox!==null&&oi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,oi)))}_computeIntersections(e,t,n){let s;const r=this.geometry,a=this.material,o=r.index,c=r.attributes.position,l=r.attributes.uv,h=r.attributes.uv1,f=r.attributes.normal,d=r.groups,p=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,x=d.length;g<x;g++){const u=d[g],m=a[u.materialIndex],w=Math.max(u.start,p.start),S=Math.min(o.count,Math.min(u.start+u.count,p.start+p.count));for(let y=w,L=S;y<L;y+=3){const C=o.getX(y),R=o.getX(y+1),z=o.getX(y+2);s=cr(this,m,e,n,l,h,f,C,R,z),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=u.materialIndex,t.push(s))}}else{const g=Math.max(0,p.start),x=Math.min(o.count,p.start+p.count);for(let u=g,m=x;u<m;u+=3){const w=o.getX(u),S=o.getX(u+1),y=o.getX(u+2);s=cr(this,a,e,n,l,h,f,w,S,y),s&&(s.faceIndex=Math.floor(u/3),t.push(s))}}else if(c!==void 0)if(Array.isArray(a))for(let g=0,x=d.length;g<x;g++){const u=d[g],m=a[u.materialIndex],w=Math.max(u.start,p.start),S=Math.min(c.count,Math.min(u.start+u.count,p.start+p.count));for(let y=w,L=S;y<L;y+=3){const C=y,R=y+1,z=y+2;s=cr(this,m,e,n,l,h,f,C,R,z),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=u.materialIndex,t.push(s))}}else{const g=Math.max(0,p.start),x=Math.min(c.count,p.start+p.count);for(let u=g,m=x;u<m;u+=3){const w=u,S=u+1,y=u+2;s=cr(this,a,e,n,l,h,f,w,S,y),s&&(s.faceIndex=Math.floor(u/3),t.push(s))}}}}function Cf(i,e,t,n,s,r,a,o){let c;if(e.side===Xt?c=n.intersectTriangle(a,r,s,!0,o):c=n.intersectTriangle(s,r,a,e.side===Qn,o),c===null)return null;or.copy(o),or.applyMatrix4(i.matrixWorld);const l=t.ray.origin.distanceTo(or);return l<t.near||l>t.far?null:{distance:l,point:or.clone(),object:i}}function cr(i,e,t,n,s,r,a,o,c,l){i.getVertexPosition(o,ir),i.getVertexPosition(c,sr),i.getVertexPosition(l,rr);const h=Cf(i,e,t,n,ir,sr,rr,dl);if(h){const f=new D;sn.getBarycoord(dl,ir,sr,rr,f),s&&(h.uv=sn.getInterpolatedAttribute(s,o,c,l,f,new ke)),r&&(h.uv1=sn.getInterpolatedAttribute(r,o,c,l,f,new ke)),a&&(h.normal=sn.getInterpolatedAttribute(a,o,c,l,f,new D),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const d={a:o,b:c,c:l,normal:new D,materialIndex:0};sn.getNormal(ir,sr,rr,d.normal),h.face=d,h.barycoord=f}return h}class _t extends ct{constructor(e=1,t=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const c=[],l=[],h=[],f=[];let d=0,p=0;g("z","y","x",-1,-1,n,t,e,a,r,0),g("z","y","x",1,-1,n,t,-e,a,r,1),g("x","z","y",1,1,e,n,t,s,a,2),g("x","z","y",1,-1,e,n,-t,s,a,3),g("x","y","z",1,-1,e,t,n,s,r,4),g("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new ut(l,3)),this.setAttribute("normal",new ut(h,3)),this.setAttribute("uv",new ut(f,2));function g(x,u,m,w,S,y,L,C,R,z,ne){const _=y/R,M=L/z,O=y/2,k=L/2,q=C/2,W=R+1,V=z+1;let ie=0,K=0;const me=new D;for(let xe=0;xe<V;xe++){const ve=xe*M-k;for(let se=0;se<W;se++){const le=se*_-O;me[x]=le*w,me[u]=ve*S,me[m]=q,l.push(me.x,me.y,me.z),me[x]=0,me[u]=0,me[m]=C>0?1:-1,h.push(me.x,me.y,me.z),f.push(se/R),f.push(1-xe/z),ie+=1}}for(let xe=0;xe<z;xe++)for(let ve=0;ve<R;ve++){const se=d+ve+W*xe,le=d+ve+W*(xe+1),A=d+(ve+1)+W*(xe+1),I=d+(ve+1)+W*xe;c.push(se,le,I),c.push(le,A,I),K+=6}o.addGroup(p,K,ne),p+=K,d+=ie}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new _t(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function os(i){const e={};for(const t in i){e[t]={};for(const n in i[t]){const s=i[t][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone():Array.isArray(s)?e[t][n]=s.slice():e[t][n]=s}}return e}function zt(i){const e={};for(let t=0;t<i.length;t++){const n=os(i[t]);for(const s in n)e[s]=n[s]}return e}function Lf(i){const e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function Qh(i){const e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:tt.workingColorSpace}const Pf={clone:os,merge:zt};var If=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Df=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class ei extends Ri{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=If,this.fragmentShader=Df,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=os(e.uniforms),this.uniformsGroups=Lf(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class ed extends xt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new at,this.projectionMatrix=new at,this.projectionMatrixInverse=new at,this.coordinateSystem=Un}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Xn=new D,ul=new ke,fl=new ke;class kt extends ed{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Xo*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Cr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Xo*2*Math.atan(Math.tan(Cr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Xn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Xn.x,Xn.y).multiplyScalar(-e/Xn.z),Xn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Xn.x,Xn.y).multiplyScalar(-e/Xn.z)}getViewSize(e,t){return this.getViewBounds(e,ul,fl),t.subVectors(fl,ul)}setViewOffset(e,t,n,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Cr*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,l=a.fullHeight;r+=a.offsetX*s/c,t-=a.offsetY*n/l,s*=a.width/c,n*=a.height/l}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Hi=-90,Gi=1;class Uf extends xt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new kt(Hi,Gi,e,t);s.layers=this.layers,this.add(s);const r=new kt(Hi,Gi,e,t);r.layers=this.layers,this.add(r);const a=new kt(Hi,Gi,e,t);a.layers=this.layers,this.add(a);const o=new kt(Hi,Gi,e,t);o.layers=this.layers,this.add(o);const c=new kt(Hi,Gi,e,t);c.layers=this.layers,this.add(c);const l=new kt(Hi,Gi,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,s,r,a,o,c]=t;for(const l of t)this.remove(l);if(e===Un)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===Vr)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,c,l,h]=this.children,f=e.getRenderTarget(),d=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const x=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,s),e.render(t,r),e.setRenderTarget(n,1,s),e.render(t,a),e.setRenderTarget(n,2,s),e.render(t,o),e.setRenderTarget(n,3,s),e.render(t,c),e.setRenderTarget(n,4,s),e.render(t,l),n.texture.generateMipmaps=x,e.setRenderTarget(n,5,s),e.render(t,h),e.setRenderTarget(f,d,p),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class td extends Bt{constructor(e,t,n,s,r,a,o,c,l,h){e=e!==void 0?e:[],t=t!==void 0?t:ns,super(e,t,n,s,r,a,o,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Nf extends Si{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new td(s,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:nn}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new _t(5,5,5),r=new ei({name:"CubemapFromEquirect",uniforms:os(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Xt,blending:Kn});r.uniforms.tEquirect.value=t;const a=new Ee(s,r),o=t.minFilter;return t.minFilter===xi&&(t.minFilter=nn),new Uf(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t,n,s){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,s);e.setRenderTarget(r)}}const ka=new D,Of=new D,zf=new Ye;class $n{constructor(e=new D(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const s=ka.subVectors(n,t).cross(Of.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(ka),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||zf.getNormalMatrix(e),s=this.coplanarPoint(ka).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const ci=new ea,lr=new D;class uc{constructor(e=new $n,t=new $n,n=new $n,s=new $n,r=new $n,a=new $n){this.planes=[e,t,n,s,r,a]}set(e,t,n,s,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Un){const n=this.planes,s=e.elements,r=s[0],a=s[1],o=s[2],c=s[3],l=s[4],h=s[5],f=s[6],d=s[7],p=s[8],g=s[9],x=s[10],u=s[11],m=s[12],w=s[13],S=s[14],y=s[15];if(n[0].setComponents(c-r,d-l,u-p,y-m).normalize(),n[1].setComponents(c+r,d+l,u+p,y+m).normalize(),n[2].setComponents(c+a,d+h,u+g,y+w).normalize(),n[3].setComponents(c-a,d-h,u-g,y-w).normalize(),n[4].setComponents(c-o,d-f,u-x,y-S).normalize(),t===Un)n[5].setComponents(c+o,d+f,u+x,y+S).normalize();else if(t===Vr)n[5].setComponents(o,f,x,S).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ci.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),ci.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ci)}intersectsSprite(e){return ci.center.set(0,0,0),ci.radius=.7071067811865476,ci.applyMatrix4(e.matrixWorld),this.intersectsSphere(ci)}intersectsSphere(e){const t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const s=t[n];if(lr.x=s.normal.x>0?e.max.x:e.min.x,lr.y=s.normal.y>0?e.max.y:e.min.y,lr.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(lr)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function nd(){let i=null,e=!1,t=null,n=null;function s(r,a){t(r,a),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function Ff(i){const e=new WeakMap;function t(o,c){const l=o.array,h=o.usage,f=l.byteLength,d=i.createBuffer();i.bindBuffer(c,d),i.bufferData(c,l,h),o.onUploadCallback();let p;if(l instanceof Float32Array)p=i.FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?p=i.HALF_FLOAT:p=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)p=i.SHORT;else if(l instanceof Uint32Array)p=i.UNSIGNED_INT;else if(l instanceof Int32Array)p=i.INT;else if(l instanceof Int8Array)p=i.BYTE;else if(l instanceof Uint8Array)p=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)p=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:d,type:p,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:f}}function n(o,c,l){const h=c.array,f=c.updateRanges;if(i.bindBuffer(l,o),f.length===0)i.bufferSubData(l,0,h);else{f.sort((p,g)=>p.start-g.start);let d=0;for(let p=1;p<f.length;p++){const g=f[d],x=f[p];x.start<=g.start+g.count+1?g.count=Math.max(g.count,x.start+x.count-g.start):(++d,f[d]=x)}f.length=d+1;for(let p=0,g=f.length;p<g;p++){const x=f[p];i.bufferSubData(l,x.start*h.BYTES_PER_ELEMENT,h,x.start,x.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=e.get(o);c&&(i.deleteBuffer(c.buffer),e.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const l=e.get(o);if(l===void 0)e.set(o,t(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,o,c),l.version=o.version}}return{get:s,remove:r,update:a}}class kn extends ct{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};const r=e/2,a=t/2,o=Math.floor(n),c=Math.floor(s),l=o+1,h=c+1,f=e/o,d=t/c,p=[],g=[],x=[],u=[];for(let m=0;m<h;m++){const w=m*d-a;for(let S=0;S<l;S++){const y=S*f-r;g.push(y,-w,0),x.push(0,0,1),u.push(S/o),u.push(1-m/c)}}for(let m=0;m<c;m++)for(let w=0;w<o;w++){const S=w+l*m,y=w+l*(m+1),L=w+1+l*(m+1),C=w+1+l*m;p.push(S,y,C),p.push(y,L,C)}this.setIndex(p),this.setAttribute("position",new ut(g,3)),this.setAttribute("normal",new ut(x,3)),this.setAttribute("uv",new ut(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new kn(e.width,e.height,e.widthSegments,e.heightSegments)}}var kf=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Bf=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Hf=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Gf=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Vf=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Wf=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,jf=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Xf=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,qf=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,$f=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Yf=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Kf=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Zf=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Jf=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Qf=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,ep=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,tp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,np=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,ip=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,sp=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,rp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,ap=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,op=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,cp=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,lp=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,hp=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,dp=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,up=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,fp=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,pp=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,mp="gl_FragColor = linearToOutputTexel( gl_FragColor );",gp=`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,_p=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,vp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,xp=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,yp=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Mp=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Sp=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,bp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Ep=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,wp=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Tp=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Ap=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Rp=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Cp=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Lp=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Pp=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Ip=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Dp=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Up=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Np=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Op=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,zp=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Fp=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,kp=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Bp=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Hp=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Gp=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Vp=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Wp=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,jp=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Xp=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,qp=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,$p=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Yp=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Kp=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Zp=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Jp=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Qp=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,em=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,tm=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,nm=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,im=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,sm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,rm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,am=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,om=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,cm=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,lm=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,hm=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,dm=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,um=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,fm=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,pm=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,mm=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,gm=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,_m=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,vm=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,xm=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,ym=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,Mm=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Sm=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,bm=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Em=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,wm=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Tm=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Am=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Rm=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Cm=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Lm=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Pm=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Im=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Dm=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Um=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Nm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Om=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,zm=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Fm=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,km=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Bm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Hm=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Gm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Vm=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Wm=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,jm=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Xm=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,qm=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,$m=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Ym=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Km=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Zm=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Jm=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Qm=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,e0=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,t0=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,n0=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,i0=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,s0=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,r0=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,a0=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,o0=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,c0=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,l0=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,h0=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,d0=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,u0=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,f0=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,p0=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,m0=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,g0=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,_0=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,$e={alphahash_fragment:kf,alphahash_pars_fragment:Bf,alphamap_fragment:Hf,alphamap_pars_fragment:Gf,alphatest_fragment:Vf,alphatest_pars_fragment:Wf,aomap_fragment:jf,aomap_pars_fragment:Xf,batching_pars_vertex:qf,batching_vertex:$f,begin_vertex:Yf,beginnormal_vertex:Kf,bsdfs:Zf,iridescence_fragment:Jf,bumpmap_pars_fragment:Qf,clipping_planes_fragment:ep,clipping_planes_pars_fragment:tp,clipping_planes_pars_vertex:np,clipping_planes_vertex:ip,color_fragment:sp,color_pars_fragment:rp,color_pars_vertex:ap,color_vertex:op,common:cp,cube_uv_reflection_fragment:lp,defaultnormal_vertex:hp,displacementmap_pars_vertex:dp,displacementmap_vertex:up,emissivemap_fragment:fp,emissivemap_pars_fragment:pp,colorspace_fragment:mp,colorspace_pars_fragment:gp,envmap_fragment:_p,envmap_common_pars_fragment:vp,envmap_pars_fragment:xp,envmap_pars_vertex:yp,envmap_physical_pars_fragment:Pp,envmap_vertex:Mp,fog_vertex:Sp,fog_pars_vertex:bp,fog_fragment:Ep,fog_pars_fragment:wp,gradientmap_pars_fragment:Tp,lightmap_pars_fragment:Ap,lights_lambert_fragment:Rp,lights_lambert_pars_fragment:Cp,lights_pars_begin:Lp,lights_toon_fragment:Ip,lights_toon_pars_fragment:Dp,lights_phong_fragment:Up,lights_phong_pars_fragment:Np,lights_physical_fragment:Op,lights_physical_pars_fragment:zp,lights_fragment_begin:Fp,lights_fragment_maps:kp,lights_fragment_end:Bp,logdepthbuf_fragment:Hp,logdepthbuf_pars_fragment:Gp,logdepthbuf_pars_vertex:Vp,logdepthbuf_vertex:Wp,map_fragment:jp,map_pars_fragment:Xp,map_particle_fragment:qp,map_particle_pars_fragment:$p,metalnessmap_fragment:Yp,metalnessmap_pars_fragment:Kp,morphinstance_vertex:Zp,morphcolor_vertex:Jp,morphnormal_vertex:Qp,morphtarget_pars_vertex:em,morphtarget_vertex:tm,normal_fragment_begin:nm,normal_fragment_maps:im,normal_pars_fragment:sm,normal_pars_vertex:rm,normal_vertex:am,normalmap_pars_fragment:om,clearcoat_normal_fragment_begin:cm,clearcoat_normal_fragment_maps:lm,clearcoat_pars_fragment:hm,iridescence_pars_fragment:dm,opaque_fragment:um,packing:fm,premultiplied_alpha_fragment:pm,project_vertex:mm,dithering_fragment:gm,dithering_pars_fragment:_m,roughnessmap_fragment:vm,roughnessmap_pars_fragment:xm,shadowmap_pars_fragment:ym,shadowmap_pars_vertex:Mm,shadowmap_vertex:Sm,shadowmask_pars_fragment:bm,skinbase_vertex:Em,skinning_pars_vertex:wm,skinning_vertex:Tm,skinnormal_vertex:Am,specularmap_fragment:Rm,specularmap_pars_fragment:Cm,tonemapping_fragment:Lm,tonemapping_pars_fragment:Pm,transmission_fragment:Im,transmission_pars_fragment:Dm,uv_pars_fragment:Um,uv_pars_vertex:Nm,uv_vertex:Om,worldpos_vertex:zm,background_vert:Fm,background_frag:km,backgroundCube_vert:Bm,backgroundCube_frag:Hm,cube_vert:Gm,cube_frag:Vm,depth_vert:Wm,depth_frag:jm,distanceRGBA_vert:Xm,distanceRGBA_frag:qm,equirect_vert:$m,equirect_frag:Ym,linedashed_vert:Km,linedashed_frag:Zm,meshbasic_vert:Jm,meshbasic_frag:Qm,meshlambert_vert:e0,meshlambert_frag:t0,meshmatcap_vert:n0,meshmatcap_frag:i0,meshnormal_vert:s0,meshnormal_frag:r0,meshphong_vert:a0,meshphong_frag:o0,meshphysical_vert:c0,meshphysical_frag:l0,meshtoon_vert:h0,meshtoon_frag:d0,points_vert:u0,points_frag:f0,shadow_vert:p0,shadow_frag:m0,sprite_vert:g0,sprite_frag:_0},Te={common:{diffuse:{value:new je(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ye},alphaMap:{value:null},alphaMapTransform:{value:new Ye},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ye}},envmap:{envMap:{value:null},envMapRotation:{value:new Ye},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ye}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ye}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ye},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ye},normalScale:{value:new ke(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ye},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ye}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ye}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ye}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new je(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new je(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ye},alphaTest:{value:0},uvTransform:{value:new Ye}},sprite:{diffuse:{value:new je(16777215)},opacity:{value:1},center:{value:new ke(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ye},alphaMap:{value:null},alphaMapTransform:{value:new Ye},alphaTest:{value:0}}},yn={basic:{uniforms:zt([Te.common,Te.specularmap,Te.envmap,Te.aomap,Te.lightmap,Te.fog]),vertexShader:$e.meshbasic_vert,fragmentShader:$e.meshbasic_frag},lambert:{uniforms:zt([Te.common,Te.specularmap,Te.envmap,Te.aomap,Te.lightmap,Te.emissivemap,Te.bumpmap,Te.normalmap,Te.displacementmap,Te.fog,Te.lights,{emissive:{value:new je(0)}}]),vertexShader:$e.meshlambert_vert,fragmentShader:$e.meshlambert_frag},phong:{uniforms:zt([Te.common,Te.specularmap,Te.envmap,Te.aomap,Te.lightmap,Te.emissivemap,Te.bumpmap,Te.normalmap,Te.displacementmap,Te.fog,Te.lights,{emissive:{value:new je(0)},specular:{value:new je(1118481)},shininess:{value:30}}]),vertexShader:$e.meshphong_vert,fragmentShader:$e.meshphong_frag},standard:{uniforms:zt([Te.common,Te.envmap,Te.aomap,Te.lightmap,Te.emissivemap,Te.bumpmap,Te.normalmap,Te.displacementmap,Te.roughnessmap,Te.metalnessmap,Te.fog,Te.lights,{emissive:{value:new je(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:$e.meshphysical_vert,fragmentShader:$e.meshphysical_frag},toon:{uniforms:zt([Te.common,Te.aomap,Te.lightmap,Te.emissivemap,Te.bumpmap,Te.normalmap,Te.displacementmap,Te.gradientmap,Te.fog,Te.lights,{emissive:{value:new je(0)}}]),vertexShader:$e.meshtoon_vert,fragmentShader:$e.meshtoon_frag},matcap:{uniforms:zt([Te.common,Te.bumpmap,Te.normalmap,Te.displacementmap,Te.fog,{matcap:{value:null}}]),vertexShader:$e.meshmatcap_vert,fragmentShader:$e.meshmatcap_frag},points:{uniforms:zt([Te.points,Te.fog]),vertexShader:$e.points_vert,fragmentShader:$e.points_frag},dashed:{uniforms:zt([Te.common,Te.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:$e.linedashed_vert,fragmentShader:$e.linedashed_frag},depth:{uniforms:zt([Te.common,Te.displacementmap]),vertexShader:$e.depth_vert,fragmentShader:$e.depth_frag},normal:{uniforms:zt([Te.common,Te.bumpmap,Te.normalmap,Te.displacementmap,{opacity:{value:1}}]),vertexShader:$e.meshnormal_vert,fragmentShader:$e.meshnormal_frag},sprite:{uniforms:zt([Te.sprite,Te.fog]),vertexShader:$e.sprite_vert,fragmentShader:$e.sprite_frag},background:{uniforms:{uvTransform:{value:new Ye},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:$e.background_vert,fragmentShader:$e.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ye}},vertexShader:$e.backgroundCube_vert,fragmentShader:$e.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:$e.cube_vert,fragmentShader:$e.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:$e.equirect_vert,fragmentShader:$e.equirect_frag},distanceRGBA:{uniforms:zt([Te.common,Te.displacementmap,{referencePosition:{value:new D},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:$e.distanceRGBA_vert,fragmentShader:$e.distanceRGBA_frag},shadow:{uniforms:zt([Te.lights,Te.fog,{color:{value:new je(0)},opacity:{value:1}}]),vertexShader:$e.shadow_vert,fragmentShader:$e.shadow_frag}};yn.physical={uniforms:zt([yn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ye},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ye},clearcoatNormalScale:{value:new ke(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ye},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ye},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ye},sheen:{value:0},sheenColor:{value:new je(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ye},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ye},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ye},transmissionSamplerSize:{value:new ke},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ye},attenuationDistance:{value:0},attenuationColor:{value:new je(0)},specularColor:{value:new je(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ye},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ye},anisotropyVector:{value:new ke},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ye}}]),vertexShader:$e.meshphysical_vert,fragmentShader:$e.meshphysical_frag};const hr={r:0,b:0,g:0},li=new _n,v0=new at;function x0(i,e,t,n,s,r,a){const o=new je(0);let c=r===!0?0:1,l,h,f=null,d=0,p=null;function g(w){let S=w.isScene===!0?w.background:null;return S&&S.isTexture&&(S=(w.backgroundBlurriness>0?t:e).get(S)),S}function x(w){let S=!1;const y=g(w);y===null?m(o,c):y&&y.isColor&&(m(y,1),S=!0);const L=i.xr.getEnvironmentBlendMode();L==="additive"?n.buffers.color.setClear(0,0,0,1,a):L==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||S)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function u(w,S){const y=g(S);y&&(y.isCubeTexture||y.mapping===Jr)?(h===void 0&&(h=new Ee(new _t(1,1,1),new ei({name:"BackgroundCubeMaterial",uniforms:os(yn.backgroundCube.uniforms),vertexShader:yn.backgroundCube.vertexShader,fragmentShader:yn.backgroundCube.fragmentShader,side:Xt,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(L,C,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),li.copy(S.backgroundRotation),li.x*=-1,li.y*=-1,li.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(li.y*=-1,li.z*=-1),h.material.uniforms.envMap.value=y,h.material.uniforms.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=S.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(v0.makeRotationFromEuler(li)),h.material.toneMapped=tt.getTransfer(y.colorSpace)!==ht,(f!==y||d!==y.version||p!==i.toneMapping)&&(h.material.needsUpdate=!0,f=y,d=y.version,p=i.toneMapping),h.layers.enableAll(),w.unshift(h,h.geometry,h.material,0,0,null)):y&&y.isTexture&&(l===void 0&&(l=new Ee(new kn(2,2),new ei({name:"BackgroundMaterial",uniforms:os(yn.background.uniforms),vertexShader:yn.background.vertexShader,fragmentShader:yn.background.fragmentShader,side:Qn,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=y,l.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,l.material.toneMapped=tt.getTransfer(y.colorSpace)!==ht,y.matrixAutoUpdate===!0&&y.updateMatrix(),l.material.uniforms.uvTransform.value.copy(y.matrix),(f!==y||d!==y.version||p!==i.toneMapping)&&(l.material.needsUpdate=!0,f=y,d=y.version,p=i.toneMapping),l.layers.enableAll(),w.unshift(l,l.geometry,l.material,0,0,null))}function m(w,S){w.getRGB(hr,Qh(i)),n.buffers.color.setClear(hr.r,hr.g,hr.b,S,a)}return{getClearColor:function(){return o},setClearColor:function(w,S=1){o.set(w),c=S,m(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(w){c=w,m(o,c)},render:x,addToRenderList:u}}function y0(i,e){const t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=d(null);let r=s,a=!1;function o(_,M,O,k,q){let W=!1;const V=f(k,O,M);r!==V&&(r=V,l(r.object)),W=p(_,k,O,q),W&&g(_,k,O,q),q!==null&&e.update(q,i.ELEMENT_ARRAY_BUFFER),(W||a)&&(a=!1,y(_,M,O,k),q!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(q).buffer))}function c(){return i.createVertexArray()}function l(_){return i.bindVertexArray(_)}function h(_){return i.deleteVertexArray(_)}function f(_,M,O){const k=O.wireframe===!0;let q=n[_.id];q===void 0&&(q={},n[_.id]=q);let W=q[M.id];W===void 0&&(W={},q[M.id]=W);let V=W[k];return V===void 0&&(V=d(c()),W[k]=V),V}function d(_){const M=[],O=[],k=[];for(let q=0;q<t;q++)M[q]=0,O[q]=0,k[q]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:M,enabledAttributes:O,attributeDivisors:k,object:_,attributes:{},index:null}}function p(_,M,O,k){const q=r.attributes,W=M.attributes;let V=0;const ie=O.getAttributes();for(const K in ie)if(ie[K].location>=0){const xe=q[K];let ve=W[K];if(ve===void 0&&(K==="instanceMatrix"&&_.instanceMatrix&&(ve=_.instanceMatrix),K==="instanceColor"&&_.instanceColor&&(ve=_.instanceColor)),xe===void 0||xe.attribute!==ve||ve&&xe.data!==ve.data)return!0;V++}return r.attributesNum!==V||r.index!==k}function g(_,M,O,k){const q={},W=M.attributes;let V=0;const ie=O.getAttributes();for(const K in ie)if(ie[K].location>=0){let xe=W[K];xe===void 0&&(K==="instanceMatrix"&&_.instanceMatrix&&(xe=_.instanceMatrix),K==="instanceColor"&&_.instanceColor&&(xe=_.instanceColor));const ve={};ve.attribute=xe,xe&&xe.data&&(ve.data=xe.data),q[K]=ve,V++}r.attributes=q,r.attributesNum=V,r.index=k}function x(){const _=r.newAttributes;for(let M=0,O=_.length;M<O;M++)_[M]=0}function u(_){m(_,0)}function m(_,M){const O=r.newAttributes,k=r.enabledAttributes,q=r.attributeDivisors;O[_]=1,k[_]===0&&(i.enableVertexAttribArray(_),k[_]=1),q[_]!==M&&(i.vertexAttribDivisor(_,M),q[_]=M)}function w(){const _=r.newAttributes,M=r.enabledAttributes;for(let O=0,k=M.length;O<k;O++)M[O]!==_[O]&&(i.disableVertexAttribArray(O),M[O]=0)}function S(_,M,O,k,q,W,V){V===!0?i.vertexAttribIPointer(_,M,O,q,W):i.vertexAttribPointer(_,M,O,k,q,W)}function y(_,M,O,k){x();const q=k.attributes,W=O.getAttributes(),V=M.defaultAttributeValues;for(const ie in W){const K=W[ie];if(K.location>=0){let me=q[ie];if(me===void 0&&(ie==="instanceMatrix"&&_.instanceMatrix&&(me=_.instanceMatrix),ie==="instanceColor"&&_.instanceColor&&(me=_.instanceColor)),me!==void 0){const xe=me.normalized,ve=me.itemSize,se=e.get(me);if(se===void 0)continue;const le=se.buffer,A=se.type,I=se.bytesPerElement,X=A===i.INT||A===i.UNSIGNED_INT||me.gpuType===sc;if(me.isInterleavedBufferAttribute){const Y=me.data,fe=Y.stride,U=me.offset;if(Y.isInstancedInterleavedBuffer){for(let te=0;te<K.locationSize;te++)m(K.location+te,Y.meshPerAttribute);_.isInstancedMesh!==!0&&k._maxInstanceCount===void 0&&(k._maxInstanceCount=Y.meshPerAttribute*Y.count)}else for(let te=0;te<K.locationSize;te++)u(K.location+te);i.bindBuffer(i.ARRAY_BUFFER,le);for(let te=0;te<K.locationSize;te++)S(K.location+te,ve/K.locationSize,A,xe,fe*I,(U+ve/K.locationSize*te)*I,X)}else{if(me.isInstancedBufferAttribute){for(let Y=0;Y<K.locationSize;Y++)m(K.location+Y,me.meshPerAttribute);_.isInstancedMesh!==!0&&k._maxInstanceCount===void 0&&(k._maxInstanceCount=me.meshPerAttribute*me.count)}else for(let Y=0;Y<K.locationSize;Y++)u(K.location+Y);i.bindBuffer(i.ARRAY_BUFFER,le);for(let Y=0;Y<K.locationSize;Y++)S(K.location+Y,ve/K.locationSize,A,xe,ve*I,ve/K.locationSize*Y*I,X)}}else if(V!==void 0){const xe=V[ie];if(xe!==void 0)switch(xe.length){case 2:i.vertexAttrib2fv(K.location,xe);break;case 3:i.vertexAttrib3fv(K.location,xe);break;case 4:i.vertexAttrib4fv(K.location,xe);break;default:i.vertexAttrib1fv(K.location,xe)}}}}w()}function L(){z();for(const _ in n){const M=n[_];for(const O in M){const k=M[O];for(const q in k)h(k[q].object),delete k[q];delete M[O]}delete n[_]}}function C(_){if(n[_.id]===void 0)return;const M=n[_.id];for(const O in M){const k=M[O];for(const q in k)h(k[q].object),delete k[q];delete M[O]}delete n[_.id]}function R(_){for(const M in n){const O=n[M];if(O[_.id]===void 0)continue;const k=O[_.id];for(const q in k)h(k[q].object),delete k[q];delete O[_.id]}}function z(){ne(),a=!0,r!==s&&(r=s,l(r.object))}function ne(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:z,resetDefaultState:ne,dispose:L,releaseStatesOfGeometry:C,releaseStatesOfProgram:R,initAttributes:x,enableAttribute:u,disableUnusedAttributes:w}}function M0(i,e,t){let n;function s(l){n=l}function r(l,h){i.drawArrays(n,l,h),t.update(h,n,1)}function a(l,h,f){f!==0&&(i.drawArraysInstanced(n,l,h,f),t.update(h,n,f))}function o(l,h,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,h,0,f);let p=0;for(let g=0;g<f;g++)p+=h[g];t.update(p,n,1)}function c(l,h,f,d){if(f===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let g=0;g<l.length;g++)a(l[g],h[g],d[g]);else{p.multiDrawArraysInstancedWEBGL(n,l,0,h,0,d,0,f);let g=0;for(let x=0;x<f;x++)g+=h[x];for(let x=0;x<d.length;x++)t.update(g,n,d[x])}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=c}function S0(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const R=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(R){return!(R!==pn&&n.convert(R)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(R){const z=R===Fs&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(R!==zn&&n.convert(R)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&R!==Dn&&!z)}function c(R){if(R==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp";const h=c(l);h!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);const f=t.logarithmicDepthBuffer===!0,d=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control");if(d===!0){const R=e.get("EXT_clip_control");R.clipControlEXT(R.LOWER_LEFT_EXT,R.ZERO_TO_ONE_EXT)}const p=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=i.getParameter(i.MAX_TEXTURE_SIZE),u=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),m=i.getParameter(i.MAX_VERTEX_ATTRIBS),w=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),S=i.getParameter(i.MAX_VARYING_VECTORS),y=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),L=g>0,C=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:f,reverseDepthBuffer:d,maxTextures:p,maxVertexTextures:g,maxTextureSize:x,maxCubemapSize:u,maxAttributes:m,maxVertexUniforms:w,maxVaryings:S,maxFragmentUniforms:y,vertexTextures:L,maxSamples:C}}function b0(i){const e=this;let t=null,n=0,s=!1,r=!1;const a=new $n,o=new Ye,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(f,d){const p=f.length!==0||d||n!==0||s;return s=d,n=f.length,p},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(f,d){t=h(f,d,0)},this.setState=function(f,d,p){const g=f.clippingPlanes,x=f.clipIntersection,u=f.clipShadows,m=i.get(f);if(!s||g===null||g.length===0||r&&!u)r?h(null):l();else{const w=r?0:n,S=w*4;let y=m.clippingState||null;c.value=y,y=h(g,d,S,p);for(let L=0;L!==S;++L)y[L]=t[L];m.clippingState=y,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=w}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(f,d,p,g){const x=f!==null?f.length:0;let u=null;if(x!==0){if(u=c.value,g!==!0||u===null){const m=p+x*4,w=d.matrixWorldInverse;o.getNormalMatrix(w),(u===null||u.length<m)&&(u=new Float32Array(m));for(let S=0,y=p;S!==x;++S,y+=4)a.copy(f[S]).applyMatrix4(w,o),a.normal.toArray(u,y),u[y+3]=a.constant}c.value=u,c.needsUpdate=!0}return e.numPlanes=x,e.numIntersection=0,u}}function E0(i){let e=new WeakMap;function t(a,o){return o===mo?a.mapping=ns:o===go&&(a.mapping=is),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===mo||o===go)if(e.has(a)){const c=e.get(a).texture;return t(c,a.mapping)}else{const c=a.image;if(c&&c.height>0){const l=new Nf(c.height);return l.fromEquirectangularTexture(i,a),e.set(a,l),a.addEventListener("dispose",s),t(l.texture,a.mapping)}else return null}}return a}function s(a){const o=a.target;o.removeEventListener("dispose",s);const c=e.get(o);c!==void 0&&(e.delete(o),c.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}class id extends ed{constructor(e=-1,t=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-e,a=n+e,o=s+t,c=s-t;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,a=r+l*this.view.width,o-=h*this.view.offsetY,c=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const Yi=4,pl=[.125,.215,.35,.446,.526,.582],gi=20,Ba=new id,ml=new je;let Ha=null,Ga=0,Va=0,Wa=!1;const fi=(1+Math.sqrt(5))/2,Vi=1/fi,gl=[new D(-fi,Vi,0),new D(fi,Vi,0),new D(-Vi,0,fi),new D(Vi,0,fi),new D(0,fi,-Vi),new D(0,fi,Vi),new D(-1,1,-1),new D(1,1,-1),new D(-1,1,1),new D(1,1,1)];class _l{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,s=100){Ha=this._renderer.getRenderTarget(),Ga=this._renderer.getActiveCubeFace(),Va=this._renderer.getActiveMipmapLevel(),Wa=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(e,n,s,r),t>0&&this._blur(r,0,0,t),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=yl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=xl(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Ha,Ga,Va),this._renderer.xr.enabled=Wa,e.scissorTest=!1,dr(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===ns||e.mapping===is?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Ha=this._renderer.getRenderTarget(),Ga=this._renderer.getActiveCubeFace(),Va=this._renderer.getActiveMipmapLevel(),Wa=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:nn,minFilter:nn,generateMipmaps:!1,type:Fs,format:pn,colorSpace:ni,depthBuffer:!1},s=vl(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=vl(e,t,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=w0(r)),this._blurMaterial=T0(r,e,t)}return s}_compileMaterial(e){const t=new Ee(this._lodPlanes[0],e);this._renderer.compile(t,Ba)}_sceneToCubeUV(e,t,n,s){const o=new kt(90,1,t,n),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],h=this._renderer,f=h.autoClear,d=h.toneMapping;h.getClearColor(ml),h.toneMapping=Zn,h.autoClear=!1;const p=new as({name:"PMREM.Background",side:Xt,depthWrite:!1,depthTest:!1}),g=new Ee(new _t,p);let x=!1;const u=e.background;u?u.isColor&&(p.color.copy(u),e.background=null,x=!0):(p.color.copy(ml),x=!0);for(let m=0;m<6;m++){const w=m%3;w===0?(o.up.set(0,c[m],0),o.lookAt(l[m],0,0)):w===1?(o.up.set(0,0,c[m]),o.lookAt(0,l[m],0)):(o.up.set(0,c[m],0),o.lookAt(0,0,l[m]));const S=this._cubeSize;dr(s,w*S,m>2?S:0,S,S),h.setRenderTarget(s),x&&h.render(g,o),h.render(e,o)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=d,h.autoClear=f,e.background=u}_textureToCubeUV(e,t){const n=this._renderer,s=e.mapping===ns||e.mapping===is;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=yl()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=xl());const r=s?this._cubemapMaterial:this._equirectMaterial,a=new Ee(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=e;const c=this._cubeSize;dr(t,0,0,3*c,2*c),n.setRenderTarget(t),n.render(a,Ba)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const a=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),o=gl[(s-r-1)%gl.length];this._blur(e,r-1,r,a,o)}t.autoClear=n}_blur(e,t,n,s,r){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,s,"latitudinal",r),this._halfBlur(a,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,a,o){const c=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,f=new Ee(this._lodPlanes[s],l),d=l.uniforms,p=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*gi-1),x=r/g,u=isFinite(r)?1+Math.floor(h*x):gi;u>gi&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${u} samples when the maximum is set to ${gi}`);const m=[];let w=0;for(let R=0;R<gi;++R){const z=R/x,ne=Math.exp(-z*z/2);m.push(ne),R===0?w+=ne:R<u&&(w+=2*ne)}for(let R=0;R<m.length;R++)m[R]=m[R]/w;d.envMap.value=e.texture,d.samples.value=u,d.weights.value=m,d.latitudinal.value=a==="latitudinal",o&&(d.poleAxis.value=o);const{_lodMax:S}=this;d.dTheta.value=g,d.mipInt.value=S-n;const y=this._sizeLods[s],L=3*y*(s>S-Yi?s-S+Yi:0),C=4*(this._cubeSize-y);dr(t,L,C,3*y,2*y),c.setRenderTarget(t),c.render(f,Ba)}}function w0(i){const e=[],t=[],n=[];let s=i;const r=i-Yi+1+pl.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);t.push(o);let c=1/o;a>i-Yi?c=pl[a-i+Yi-1]:a===0&&(c=0),n.push(c);const l=1/(o-2),h=-l,f=1+l,d=[h,h,f,h,f,f,h,h,f,f,h,f],p=6,g=6,x=3,u=2,m=1,w=new Float32Array(x*g*p),S=new Float32Array(u*g*p),y=new Float32Array(m*g*p);for(let C=0;C<p;C++){const R=C%3*2/3-1,z=C>2?0:-1,ne=[R,z,0,R+2/3,z,0,R+2/3,z+1,0,R,z,0,R+2/3,z+1,0,R,z+1,0];w.set(ne,x*g*C),S.set(d,u*g*C);const _=[C,C,C,C,C,C];y.set(_,m*g*C)}const L=new ct;L.setAttribute("position",new Lt(w,x)),L.setAttribute("uv",new Lt(S,u)),L.setAttribute("faceIndex",new Lt(y,m)),e.push(L),s>Yi&&s--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function vl(i,e,t){const n=new Si(i,e,t);return n.texture.mapping=Jr,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function dr(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function T0(i,e,t){const n=new Float32Array(gi),s=new D(0,1,0);return new ei({name:"SphericalGaussianBlur",defines:{n:gi,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:fc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Kn,depthTest:!1,depthWrite:!1})}function xl(){return new ei({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:fc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Kn,depthTest:!1,depthWrite:!1})}function yl(){return new ei({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:fc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Kn,depthTest:!1,depthWrite:!1})}function fc(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function A0(i){let e=new WeakMap,t=null;function n(o){if(o&&o.isTexture){const c=o.mapping,l=c===mo||c===go,h=c===ns||c===is;if(l||h){let f=e.get(o);const d=f!==void 0?f.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==d)return t===null&&(t=new _l(i)),f=l?t.fromEquirectangular(o,f):t.fromCubemap(o,f),f.texture.pmremVersion=o.pmremVersion,e.set(o,f),f.texture;if(f!==void 0)return f.texture;{const p=o.image;return l&&p&&p.height>0||h&&p&&s(p)?(t===null&&(t=new _l(i)),f=l?t.fromEquirectangular(o):t.fromCubemap(o),f.texture.pmremVersion=o.pmremVersion,e.set(o,f),o.addEventListener("dispose",r),f.texture):null}}}return o}function s(o){let c=0;const l=6;for(let h=0;h<l;h++)o[h]!==void 0&&c++;return c===l}function r(o){const c=o.target;c.removeEventListener("dispose",r);const l=e.get(c);l!==void 0&&(e.delete(c),l.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:a}}function R0(i){const e={};function t(n){if(e[n]!==void 0)return e[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const s=t(n);return s===null&&Lr("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function C0(i,e,t,n){const s={},r=new WeakMap;function a(f){const d=f.target;d.index!==null&&e.remove(d.index);for(const g in d.attributes)e.remove(d.attributes[g]);for(const g in d.morphAttributes){const x=d.morphAttributes[g];for(let u=0,m=x.length;u<m;u++)e.remove(x[u])}d.removeEventListener("dispose",a),delete s[d.id];const p=r.get(d);p&&(e.remove(p),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function o(f,d){return s[d.id]===!0||(d.addEventListener("dispose",a),s[d.id]=!0,t.memory.geometries++),d}function c(f){const d=f.attributes;for(const g in d)e.update(d[g],i.ARRAY_BUFFER);const p=f.morphAttributes;for(const g in p){const x=p[g];for(let u=0,m=x.length;u<m;u++)e.update(x[u],i.ARRAY_BUFFER)}}function l(f){const d=[],p=f.index,g=f.attributes.position;let x=0;if(p!==null){const w=p.array;x=p.version;for(let S=0,y=w.length;S<y;S+=3){const L=w[S+0],C=w[S+1],R=w[S+2];d.push(L,C,C,R,R,L)}}else if(g!==void 0){const w=g.array;x=g.version;for(let S=0,y=w.length/3-1;S<y;S+=3){const L=S+0,C=S+1,R=S+2;d.push(L,C,C,R,R,L)}}else return;const u=new(qh(d)?Jh:Zh)(d,1);u.version=x;const m=r.get(f);m&&e.remove(m),r.set(f,u)}function h(f){const d=r.get(f);if(d){const p=f.index;p!==null&&d.version<p.version&&l(f)}else l(f);return r.get(f)}return{get:o,update:c,getWireframeAttribute:h}}function L0(i,e,t){let n;function s(d){n=d}let r,a;function o(d){r=d.type,a=d.bytesPerElement}function c(d,p){i.drawElements(n,p,r,d*a),t.update(p,n,1)}function l(d,p,g){g!==0&&(i.drawElementsInstanced(n,p,r,d*a,g),t.update(p,n,g))}function h(d,p,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,p,0,r,d,0,g);let u=0;for(let m=0;m<g;m++)u+=p[m];t.update(u,n,1)}function f(d,p,g,x){if(g===0)return;const u=e.get("WEBGL_multi_draw");if(u===null)for(let m=0;m<d.length;m++)l(d[m]/a,p[m],x[m]);else{u.multiDrawElementsInstancedWEBGL(n,p,0,r,d,0,x,0,g);let m=0;for(let w=0;w<g;w++)m+=p[w];for(let w=0;w<x.length;w++)t.update(m,n,x[w])}}this.setMode=s,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=f}function P0(i){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(r/3);break;case i.LINES:t.lines+=o*(r/2);break;case i.LINE_STRIP:t.lines+=o*(r-1);break;case i.LINE_LOOP:t.lines+=o*r;break;case i.POINTS:t.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function I0(i,e,t){const n=new WeakMap,s=new vt;function r(a,o,c){const l=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,f=h!==void 0?h.length:0;let d=n.get(o);if(d===void 0||d.count!==f){let _=function(){z.dispose(),n.delete(o),o.removeEventListener("dispose",_)};var p=_;d!==void 0&&d.texture.dispose();const g=o.morphAttributes.position!==void 0,x=o.morphAttributes.normal!==void 0,u=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],w=o.morphAttributes.normal||[],S=o.morphAttributes.color||[];let y=0;g===!0&&(y=1),x===!0&&(y=2),u===!0&&(y=3);let L=o.attributes.position.count*y,C=1;L>e.maxTextureSize&&(C=Math.ceil(L/e.maxTextureSize),L=e.maxTextureSize);const R=new Float32Array(L*C*4*f),z=new Yh(R,L,C,f);z.type=Dn,z.needsUpdate=!0;const ne=y*4;for(let M=0;M<f;M++){const O=m[M],k=w[M],q=S[M],W=L*C*4*M;for(let V=0;V<O.count;V++){const ie=V*ne;g===!0&&(s.fromBufferAttribute(O,V),R[W+ie+0]=s.x,R[W+ie+1]=s.y,R[W+ie+2]=s.z,R[W+ie+3]=0),x===!0&&(s.fromBufferAttribute(k,V),R[W+ie+4]=s.x,R[W+ie+5]=s.y,R[W+ie+6]=s.z,R[W+ie+7]=0),u===!0&&(s.fromBufferAttribute(q,V),R[W+ie+8]=s.x,R[W+ie+9]=s.y,R[W+ie+10]=s.z,R[W+ie+11]=q.itemSize===4?s.w:1)}}d={count:f,texture:z,size:new ke(L,C)},n.set(o,d),o.addEventListener("dispose",_)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",a.morphTexture,t);else{let g=0;for(let u=0;u<l.length;u++)g+=l[u];const x=o.morphTargetsRelative?1:1-g;c.getUniforms().setValue(i,"morphTargetBaseInfluence",x),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",d.texture,t),c.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:r}}function D0(i,e,t,n){let s=new WeakMap;function r(c){const l=n.render.frame,h=c.geometry,f=e.get(c,h);if(s.get(f)!==l&&(e.update(f),s.set(f,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),s.get(c)!==l&&(t.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){const d=c.skeleton;s.get(d)!==l&&(d.update(),s.set(d,l))}return f}function a(){s=new WeakMap}function o(c){const l=c.target;l.removeEventListener("dispose",o),t.remove(l.instanceMatrix),l.instanceColor!==null&&t.remove(l.instanceColor)}return{update:r,dispose:a}}class sd extends Bt{constructor(e,t,n,s,r,a,o,c,l,h=Qi){if(h!==Qi&&h!==rs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===Qi&&(n=Mi),n===void 0&&h===rs&&(n=ss),super(null,s,r,a,o,c,h,n,l),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=o!==void 0?o:rn,this.minFilter=c!==void 0?c:rn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const rd=new Bt,Ml=new sd(1,1),ad=new Yh,od=new xf,cd=new td,Sl=[],bl=[],El=new Float32Array(16),wl=new Float32Array(9),Tl=new Float32Array(4);function ds(i,e,t){const n=i[0];if(n<=0||n>0)return i;const s=e*t;let r=Sl[s];if(r===void 0&&(r=new Float32Array(s),Sl[s]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(r,o)}return r}function Tt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function At(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function na(i,e){let t=bl[e];t===void 0&&(t=new Int32Array(e),bl[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function U0(i,e){const t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function N0(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Tt(t,e))return;i.uniform2fv(this.addr,e),At(t,e)}}function O0(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Tt(t,e))return;i.uniform3fv(this.addr,e),At(t,e)}}function z0(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Tt(t,e))return;i.uniform4fv(this.addr,e),At(t,e)}}function F0(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Tt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),At(t,e)}else{if(Tt(t,n))return;Tl.set(n),i.uniformMatrix2fv(this.addr,!1,Tl),At(t,n)}}function k0(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Tt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),At(t,e)}else{if(Tt(t,n))return;wl.set(n),i.uniformMatrix3fv(this.addr,!1,wl),At(t,n)}}function B0(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Tt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),At(t,e)}else{if(Tt(t,n))return;El.set(n),i.uniformMatrix4fv(this.addr,!1,El),At(t,n)}}function H0(i,e){const t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function G0(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Tt(t,e))return;i.uniform2iv(this.addr,e),At(t,e)}}function V0(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Tt(t,e))return;i.uniform3iv(this.addr,e),At(t,e)}}function W0(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Tt(t,e))return;i.uniform4iv(this.addr,e),At(t,e)}}function j0(i,e){const t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function X0(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Tt(t,e))return;i.uniform2uiv(this.addr,e),At(t,e)}}function q0(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Tt(t,e))return;i.uniform3uiv(this.addr,e),At(t,e)}}function $0(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Tt(t,e))return;i.uniform4uiv(this.addr,e),At(t,e)}}function Y0(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Ml.compareFunction=Xh,r=Ml):r=rd,t.setTexture2D(e||r,s)}function K0(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||od,s)}function Z0(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||cd,s)}function J0(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||ad,s)}function Q0(i){switch(i){case 5126:return U0;case 35664:return N0;case 35665:return O0;case 35666:return z0;case 35674:return F0;case 35675:return k0;case 35676:return B0;case 5124:case 35670:return H0;case 35667:case 35671:return G0;case 35668:case 35672:return V0;case 35669:case 35673:return W0;case 5125:return j0;case 36294:return X0;case 36295:return q0;case 36296:return $0;case 35678:case 36198:case 36298:case 36306:case 35682:return Y0;case 35679:case 36299:case 36307:return K0;case 35680:case 36300:case 36308:case 36293:return Z0;case 36289:case 36303:case 36311:case 36292:return J0}}function eg(i,e){i.uniform1fv(this.addr,e)}function tg(i,e){const t=ds(e,this.size,2);i.uniform2fv(this.addr,t)}function ng(i,e){const t=ds(e,this.size,3);i.uniform3fv(this.addr,t)}function ig(i,e){const t=ds(e,this.size,4);i.uniform4fv(this.addr,t)}function sg(i,e){const t=ds(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function rg(i,e){const t=ds(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function ag(i,e){const t=ds(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function og(i,e){i.uniform1iv(this.addr,e)}function cg(i,e){i.uniform2iv(this.addr,e)}function lg(i,e){i.uniform3iv(this.addr,e)}function hg(i,e){i.uniform4iv(this.addr,e)}function dg(i,e){i.uniform1uiv(this.addr,e)}function ug(i,e){i.uniform2uiv(this.addr,e)}function fg(i,e){i.uniform3uiv(this.addr,e)}function pg(i,e){i.uniform4uiv(this.addr,e)}function mg(i,e,t){const n=this.cache,s=e.length,r=na(t,s);Tt(n,r)||(i.uniform1iv(this.addr,r),At(n,r));for(let a=0;a!==s;++a)t.setTexture2D(e[a]||rd,r[a])}function gg(i,e,t){const n=this.cache,s=e.length,r=na(t,s);Tt(n,r)||(i.uniform1iv(this.addr,r),At(n,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||od,r[a])}function _g(i,e,t){const n=this.cache,s=e.length,r=na(t,s);Tt(n,r)||(i.uniform1iv(this.addr,r),At(n,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||cd,r[a])}function vg(i,e,t){const n=this.cache,s=e.length,r=na(t,s);Tt(n,r)||(i.uniform1iv(this.addr,r),At(n,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||ad,r[a])}function xg(i){switch(i){case 5126:return eg;case 35664:return tg;case 35665:return ng;case 35666:return ig;case 35674:return sg;case 35675:return rg;case 35676:return ag;case 5124:case 35670:return og;case 35667:case 35671:return cg;case 35668:case 35672:return lg;case 35669:case 35673:return hg;case 5125:return dg;case 36294:return ug;case 36295:return fg;case 36296:return pg;case 35678:case 36198:case 36298:case 36306:case 35682:return mg;case 35679:case 36299:case 36307:return gg;case 35680:case 36300:case 36308:case 36293:return _g;case 36289:case 36303:case 36311:case 36292:return vg}}class yg{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Q0(t.type)}}class Mg{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=xg(t.type)}}class Sg{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(e,t[o.id],n)}}}const ja=/(\w+)(\])?(\[|\.)?/g;function Al(i,e){i.seq.push(e),i.map[e.id]=e}function bg(i,e,t){const n=i.name,s=n.length;for(ja.lastIndex=0;;){const r=ja.exec(n),a=ja.lastIndex;let o=r[1];const c=r[2]==="]",l=r[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===s){Al(t,l===void 0?new yg(o,i,e):new Mg(o,i,e));break}else{let f=t.map[o];f===void 0&&(f=new Sg(o),Al(t,f)),t=f}}}class Pr{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=e.getActiveUniform(t,s),a=e.getUniformLocation(t,r.name);bg(r,a,this)}}setValue(e,t,n,s){const r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){const s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,a=t.length;r!==a;++r){const o=t[r],c=n[o.id];c.needsUpdate!==!1&&o.setValue(e,c.value,s)}}static seqWithValue(e,t){const n=[];for(let s=0,r=e.length;s!==r;++s){const a=e[s];a.id in t&&n.push(a)}return n}}function Rl(i,e,t){const n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}const Eg=37297;let wg=0;function Tg(i,e){const t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){const o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}function Ag(i){const e=tt.getPrimaries(tt.workingColorSpace),t=tt.getPrimaries(i);let n;switch(e===t?n="":e===Gr&&t===Hr?n="LinearDisplayP3ToLinearSRGB":e===Hr&&t===Gr&&(n="LinearSRGBToLinearDisplayP3"),i){case ni:case Qr:return[n,"LinearTransferOETF"];case xn:case hc:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",i),[n,"LinearTransferOETF"]}}function Cl(i,e,t){const n=i.getShaderParameter(e,i.COMPILE_STATUS),s=i.getShaderInfoLog(e).trim();if(n&&s==="")return"";const r=/ERROR: 0:(\d+)/.exec(s);if(r){const a=parseInt(r[1]);return t.toUpperCase()+`

`+s+`

`+Tg(i.getShaderSource(e),a)}else return s}function Rg(i,e){const t=Ag(e);return`vec4 ${i}( vec4 value ) { return ${t[0]}( ${t[1]}( value ) ); }`}function Cg(i,e){let t;switch(e){case Vu:t="Linear";break;case Wu:t="Reinhard";break;case ju:t="Cineon";break;case Xu:t="ACESFilmic";break;case $u:t="AgX";break;case Yu:t="Neutral";break;case qu:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const ur=new D;function Lg(){tt.getLuminanceCoefficients(ur);const i=ur.x.toFixed(4),e=ur.y.toFixed(4),t=ur.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Pg(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ws).join(`
`)}function Ig(i){const e=[];for(const t in i){const n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function Dg(i,e){const t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(e,s),a=r.name;let o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function ws(i){return i!==""}function Ll(i,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Pl(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Ug=/^[ \t]*#include +<([\w\d./]+)>/gm;function qo(i){return i.replace(Ug,Og)}const Ng=new Map;function Og(i,e){let t=$e[e];if(t===void 0){const n=Ng.get(e);if(n!==void 0)t=$e[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return qo(t)}const zg=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Il(i){return i.replace(zg,Fg)}function Fg(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Dl(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function kg(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Ih?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===Su?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===In&&(e="SHADOWMAP_TYPE_VSM"),e}function Bg(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case ns:case is:e="ENVMAP_TYPE_CUBE";break;case Jr:e="ENVMAP_TYPE_CUBE_UV";break}return e}function Hg(i){let e="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case is:e="ENVMAP_MODE_REFRACTION";break}return e}function Gg(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Dh:e="ENVMAP_BLENDING_MULTIPLY";break;case Hu:e="ENVMAP_BLENDING_MIX";break;case Gu:e="ENVMAP_BLENDING_ADD";break}return e}function Vg(i){const e=i.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:n,maxMip:t}}function Wg(i,e,t,n){const s=i.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const c=kg(t),l=Bg(t),h=Hg(t),f=Gg(t),d=Vg(t),p=Pg(t),g=Ig(r),x=s.createProgram();let u,m,w=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(u=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(ws).join(`
`),u.length>0&&(u+=`
`),m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(ws).join(`
`),m.length>0&&(m+=`
`)):(u=[Dl(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ws).join(`
`),m=[Dl(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+h:"",t.envMap?"#define "+f:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Zn?"#define TONE_MAPPING":"",t.toneMapping!==Zn?$e.tonemapping_pars_fragment:"",t.toneMapping!==Zn?Cg("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",$e.colorspace_pars_fragment,Rg("linearToOutputTexel",t.outputColorSpace),Lg(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(ws).join(`
`)),a=qo(a),a=Ll(a,t),a=Pl(a,t),o=qo(o),o=Ll(o,t),o=Pl(o,t),a=Il(a),o=Il(o),t.isRawShaderMaterial!==!0&&(w=`#version 300 es
`,u=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+u,m=["#define varying in",t.glslVersion===Kc?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Kc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);const S=w+u+a,y=w+m+o,L=Rl(s,s.VERTEX_SHADER,S),C=Rl(s,s.FRAGMENT_SHADER,y);s.attachShader(x,L),s.attachShader(x,C),t.index0AttributeName!==void 0?s.bindAttribLocation(x,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(x,0,"position"),s.linkProgram(x);function R(M){if(i.debug.checkShaderErrors){const O=s.getProgramInfoLog(x).trim(),k=s.getShaderInfoLog(L).trim(),q=s.getShaderInfoLog(C).trim();let W=!0,V=!0;if(s.getProgramParameter(x,s.LINK_STATUS)===!1)if(W=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,x,L,C);else{const ie=Cl(s,L,"vertex"),K=Cl(s,C,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(x,s.VALIDATE_STATUS)+`

Material Name: `+M.name+`
Material Type: `+M.type+`

Program Info Log: `+O+`
`+ie+`
`+K)}else O!==""?console.warn("THREE.WebGLProgram: Program Info Log:",O):(k===""||q==="")&&(V=!1);V&&(M.diagnostics={runnable:W,programLog:O,vertexShader:{log:k,prefix:u},fragmentShader:{log:q,prefix:m}})}s.deleteShader(L),s.deleteShader(C),z=new Pr(s,x),ne=Dg(s,x)}let z;this.getUniforms=function(){return z===void 0&&R(this),z};let ne;this.getAttributes=function(){return ne===void 0&&R(this),ne};let _=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return _===!1&&(_=s.getProgramParameter(x,Eg)),_},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(x),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=wg++,this.cacheKey=e,this.usedTimes=1,this.program=x,this.vertexShader=L,this.fragmentShader=C,this}let jg=0;class Xg{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new qg(e),t.set(e,n)),n}}class qg{constructor(e){this.id=jg++,this.code=e,this.usedTimes=0}}function $g(i,e,t,n,s,r,a){const o=new dc,c=new Xg,l=new Set,h=[],f=s.logarithmicDepthBuffer,d=s.reverseDepthBuffer,p=s.vertexTextures;let g=s.precision;const x={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function u(_){return l.add(_),_===0?"uv":`uv${_}`}function m(_,M,O,k,q){const W=k.fog,V=q.geometry,ie=_.isMeshStandardMaterial?k.environment:null,K=(_.isMeshStandardMaterial?t:e).get(_.envMap||ie),me=K&&K.mapping===Jr?K.image.height:null,xe=x[_.type];_.precision!==null&&(g=s.getMaxPrecision(_.precision),g!==_.precision&&console.warn("THREE.WebGLProgram.getParameters:",_.precision,"not supported, using",g,"instead."));const ve=V.morphAttributes.position||V.morphAttributes.normal||V.morphAttributes.color,se=ve!==void 0?ve.length:0;let le=0;V.morphAttributes.position!==void 0&&(le=1),V.morphAttributes.normal!==void 0&&(le=2),V.morphAttributes.color!==void 0&&(le=3);let A,I,X,Y;if(xe){const Gt=yn[xe];A=Gt.vertexShader,I=Gt.fragmentShader}else A=_.vertexShader,I=_.fragmentShader,c.update(_),X=c.getVertexShaderID(_),Y=c.getFragmentShaderID(_);const fe=i.getRenderTarget(),U=q.isInstancedMesh===!0,te=q.isBatchedMesh===!0,ye=!!_.map,de=!!_.matcap,E=!!K,B=!!_.aoMap,ae=!!_.lightMap,pe=!!_.bumpMap,ge=!!_.normalMap,De=!!_.displacementMap,he=!!_.emissiveMap,b=!!_.metalnessMap,v=!!_.roughnessMap,N=_.anisotropy>0,J=_.clearcoat>0,ce=_.dispersion>0,oe=_.iridescence>0,Ae=_.sheen>0,be=_.transmission>0,we=N&&!!_.anisotropyMap,qe=J&&!!_.clearcoatMap,Me=J&&!!_.clearcoatNormalMap,Ie=J&&!!_.clearcoatRoughnessMap,He=oe&&!!_.iridescenceMap,We=oe&&!!_.iridescenceThicknessMap,Ue=Ae&&!!_.sheenColorMap,Ke=Ae&&!!_.sheenRoughnessMap,Xe=!!_.specularMap,ot=!!_.specularColorMap,F=!!_.specularIntensityMap,Le=be&&!!_.transmissionMap,re=be&&!!_.thicknessMap,_e=!!_.gradientMap,Re=!!_.alphaMap,Pe=_.alphaTest>0,Ze=!!_.alphaHash,Mt=!!_.extensions;let Ht=Zn;_.toneMapped&&(fe===null||fe.isXRRenderTarget===!0)&&(Ht=i.toneMapping);const Je={shaderID:xe,shaderType:_.type,shaderName:_.name,vertexShader:A,fragmentShader:I,defines:_.defines,customVertexShaderID:X,customFragmentShaderID:Y,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:g,batching:te,batchingColor:te&&q._colorsTexture!==null,instancing:U,instancingColor:U&&q.instanceColor!==null,instancingMorph:U&&q.morphTexture!==null,supportsVertexTextures:p,outputColorSpace:fe===null?i.outputColorSpace:fe.isXRRenderTarget===!0?fe.texture.colorSpace:ni,alphaToCoverage:!!_.alphaToCoverage,map:ye,matcap:de,envMap:E,envMapMode:E&&K.mapping,envMapCubeUVHeight:me,aoMap:B,lightMap:ae,bumpMap:pe,normalMap:ge,displacementMap:p&&De,emissiveMap:he,normalMapObjectSpace:ge&&_.normalMapType===Qu,normalMapTangentSpace:ge&&_.normalMapType===jh,metalnessMap:b,roughnessMap:v,anisotropy:N,anisotropyMap:we,clearcoat:J,clearcoatMap:qe,clearcoatNormalMap:Me,clearcoatRoughnessMap:Ie,dispersion:ce,iridescence:oe,iridescenceMap:He,iridescenceThicknessMap:We,sheen:Ae,sheenColorMap:Ue,sheenRoughnessMap:Ke,specularMap:Xe,specularColorMap:ot,specularIntensityMap:F,transmission:be,transmissionMap:Le,thicknessMap:re,gradientMap:_e,opaque:_.transparent===!1&&_.blending===Ji&&_.alphaToCoverage===!1,alphaMap:Re,alphaTest:Pe,alphaHash:Ze,combine:_.combine,mapUv:ye&&u(_.map.channel),aoMapUv:B&&u(_.aoMap.channel),lightMapUv:ae&&u(_.lightMap.channel),bumpMapUv:pe&&u(_.bumpMap.channel),normalMapUv:ge&&u(_.normalMap.channel),displacementMapUv:De&&u(_.displacementMap.channel),emissiveMapUv:he&&u(_.emissiveMap.channel),metalnessMapUv:b&&u(_.metalnessMap.channel),roughnessMapUv:v&&u(_.roughnessMap.channel),anisotropyMapUv:we&&u(_.anisotropyMap.channel),clearcoatMapUv:qe&&u(_.clearcoatMap.channel),clearcoatNormalMapUv:Me&&u(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Ie&&u(_.clearcoatRoughnessMap.channel),iridescenceMapUv:He&&u(_.iridescenceMap.channel),iridescenceThicknessMapUv:We&&u(_.iridescenceThicknessMap.channel),sheenColorMapUv:Ue&&u(_.sheenColorMap.channel),sheenRoughnessMapUv:Ke&&u(_.sheenRoughnessMap.channel),specularMapUv:Xe&&u(_.specularMap.channel),specularColorMapUv:ot&&u(_.specularColorMap.channel),specularIntensityMapUv:F&&u(_.specularIntensityMap.channel),transmissionMapUv:Le&&u(_.transmissionMap.channel),thicknessMapUv:re&&u(_.thicknessMap.channel),alphaMapUv:Re&&u(_.alphaMap.channel),vertexTangents:!!V.attributes.tangent&&(ge||N),vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!V.attributes.color&&V.attributes.color.itemSize===4,pointsUvs:q.isPoints===!0&&!!V.attributes.uv&&(ye||Re),fog:!!W,useFog:_.fog===!0,fogExp2:!!W&&W.isFogExp2,flatShading:_.flatShading===!0,sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:f,reverseDepthBuffer:d,skinning:q.isSkinnedMesh===!0,morphTargets:V.morphAttributes.position!==void 0,morphNormals:V.morphAttributes.normal!==void 0,morphColors:V.morphAttributes.color!==void 0,morphTargetsCount:se,morphTextureStride:le,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:_.dithering,shadowMapEnabled:i.shadowMap.enabled&&O.length>0,shadowMapType:i.shadowMap.type,toneMapping:Ht,decodeVideoTexture:ye&&_.map.isVideoTexture===!0&&tt.getTransfer(_.map.colorSpace)===ht,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===jt,flipSided:_.side===Xt,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionClipCullDistance:Mt&&_.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Mt&&_.extensions.multiDraw===!0||te)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()};return Je.vertexUv1s=l.has(1),Je.vertexUv2s=l.has(2),Je.vertexUv3s=l.has(3),l.clear(),Je}function w(_){const M=[];if(_.shaderID?M.push(_.shaderID):(M.push(_.customVertexShaderID),M.push(_.customFragmentShaderID)),_.defines!==void 0)for(const O in _.defines)M.push(O),M.push(_.defines[O]);return _.isRawShaderMaterial===!1&&(S(M,_),y(M,_),M.push(i.outputColorSpace)),M.push(_.customProgramCacheKey),M.join()}function S(_,M){_.push(M.precision),_.push(M.outputColorSpace),_.push(M.envMapMode),_.push(M.envMapCubeUVHeight),_.push(M.mapUv),_.push(M.alphaMapUv),_.push(M.lightMapUv),_.push(M.aoMapUv),_.push(M.bumpMapUv),_.push(M.normalMapUv),_.push(M.displacementMapUv),_.push(M.emissiveMapUv),_.push(M.metalnessMapUv),_.push(M.roughnessMapUv),_.push(M.anisotropyMapUv),_.push(M.clearcoatMapUv),_.push(M.clearcoatNormalMapUv),_.push(M.clearcoatRoughnessMapUv),_.push(M.iridescenceMapUv),_.push(M.iridescenceThicknessMapUv),_.push(M.sheenColorMapUv),_.push(M.sheenRoughnessMapUv),_.push(M.specularMapUv),_.push(M.specularColorMapUv),_.push(M.specularIntensityMapUv),_.push(M.transmissionMapUv),_.push(M.thicknessMapUv),_.push(M.combine),_.push(M.fogExp2),_.push(M.sizeAttenuation),_.push(M.morphTargetsCount),_.push(M.morphAttributeCount),_.push(M.numDirLights),_.push(M.numPointLights),_.push(M.numSpotLights),_.push(M.numSpotLightMaps),_.push(M.numHemiLights),_.push(M.numRectAreaLights),_.push(M.numDirLightShadows),_.push(M.numPointLightShadows),_.push(M.numSpotLightShadows),_.push(M.numSpotLightShadowsWithMaps),_.push(M.numLightProbes),_.push(M.shadowMapType),_.push(M.toneMapping),_.push(M.numClippingPlanes),_.push(M.numClipIntersection),_.push(M.depthPacking)}function y(_,M){o.disableAll(),M.supportsVertexTextures&&o.enable(0),M.instancing&&o.enable(1),M.instancingColor&&o.enable(2),M.instancingMorph&&o.enable(3),M.matcap&&o.enable(4),M.envMap&&o.enable(5),M.normalMapObjectSpace&&o.enable(6),M.normalMapTangentSpace&&o.enable(7),M.clearcoat&&o.enable(8),M.iridescence&&o.enable(9),M.alphaTest&&o.enable(10),M.vertexColors&&o.enable(11),M.vertexAlphas&&o.enable(12),M.vertexUv1s&&o.enable(13),M.vertexUv2s&&o.enable(14),M.vertexUv3s&&o.enable(15),M.vertexTangents&&o.enable(16),M.anisotropy&&o.enable(17),M.alphaHash&&o.enable(18),M.batching&&o.enable(19),M.dispersion&&o.enable(20),M.batchingColor&&o.enable(21),_.push(o.mask),o.disableAll(),M.fog&&o.enable(0),M.useFog&&o.enable(1),M.flatShading&&o.enable(2),M.logarithmicDepthBuffer&&o.enable(3),M.reverseDepthBuffer&&o.enable(4),M.skinning&&o.enable(5),M.morphTargets&&o.enable(6),M.morphNormals&&o.enable(7),M.morphColors&&o.enable(8),M.premultipliedAlpha&&o.enable(9),M.shadowMapEnabled&&o.enable(10),M.doubleSided&&o.enable(11),M.flipSided&&o.enable(12),M.useDepthPacking&&o.enable(13),M.dithering&&o.enable(14),M.transmission&&o.enable(15),M.sheen&&o.enable(16),M.opaque&&o.enable(17),M.pointsUvs&&o.enable(18),M.decodeVideoTexture&&o.enable(19),M.alphaToCoverage&&o.enable(20),_.push(o.mask)}function L(_){const M=x[_.type];let O;if(M){const k=yn[M];O=Pf.clone(k.uniforms)}else O=_.uniforms;return O}function C(_,M){let O;for(let k=0,q=h.length;k<q;k++){const W=h[k];if(W.cacheKey===M){O=W,++O.usedTimes;break}}return O===void 0&&(O=new Wg(i,M,_,r),h.push(O)),O}function R(_){if(--_.usedTimes===0){const M=h.indexOf(_);h[M]=h[h.length-1],h.pop(),_.destroy()}}function z(_){c.remove(_)}function ne(){c.dispose()}return{getParameters:m,getProgramCacheKey:w,getUniforms:L,acquireProgram:C,releaseProgram:R,releaseShaderCache:z,programs:h,dispose:ne}}function Yg(){let i=new WeakMap;function e(a){return i.has(a)}function t(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,c){i.get(a)[o]=c}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function Kg(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function Ul(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function Nl(){const i=[];let e=0;const t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function a(f,d,p,g,x,u){let m=i[e];return m===void 0?(m={id:f.id,object:f,geometry:d,material:p,groupOrder:g,renderOrder:f.renderOrder,z:x,group:u},i[e]=m):(m.id=f.id,m.object=f,m.geometry=d,m.material=p,m.groupOrder=g,m.renderOrder=f.renderOrder,m.z=x,m.group=u),e++,m}function o(f,d,p,g,x,u){const m=a(f,d,p,g,x,u);p.transmission>0?n.push(m):p.transparent===!0?s.push(m):t.push(m)}function c(f,d,p,g,x,u){const m=a(f,d,p,g,x,u);p.transmission>0?n.unshift(m):p.transparent===!0?s.unshift(m):t.unshift(m)}function l(f,d){t.length>1&&t.sort(f||Kg),n.length>1&&n.sort(d||Ul),s.length>1&&s.sort(d||Ul)}function h(){for(let f=e,d=i.length;f<d;f++){const p=i[f];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:o,unshift:c,finish:h,sort:l}}function Zg(){let i=new WeakMap;function e(n,s){const r=i.get(n);let a;return r===void 0?(a=new Nl,i.set(n,[a])):s>=r.length?(a=new Nl,r.push(a)):a=r[s],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function Jg(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new D,color:new je};break;case"SpotLight":t={position:new D,direction:new D,color:new je,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new D,color:new je,distance:0,decay:0};break;case"HemisphereLight":t={direction:new D,skyColor:new je,groundColor:new je};break;case"RectAreaLight":t={color:new je,position:new D,halfWidth:new D,halfHeight:new D};break}return i[e.id]=t,t}}}function Qg(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ke};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ke};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ke,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}let e_=0;function t_(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function n_(i){const e=new Jg,t=Qg(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new D);const s=new D,r=new at,a=new at;function o(l){let h=0,f=0,d=0;for(let ne=0;ne<9;ne++)n.probe[ne].set(0,0,0);let p=0,g=0,x=0,u=0,m=0,w=0,S=0,y=0,L=0,C=0,R=0;l.sort(t_);for(let ne=0,_=l.length;ne<_;ne++){const M=l[ne],O=M.color,k=M.intensity,q=M.distance,W=M.shadow&&M.shadow.map?M.shadow.map.texture:null;if(M.isAmbientLight)h+=O.r*k,f+=O.g*k,d+=O.b*k;else if(M.isLightProbe){for(let V=0;V<9;V++)n.probe[V].addScaledVector(M.sh.coefficients[V],k);R++}else if(M.isDirectionalLight){const V=e.get(M);if(V.color.copy(M.color).multiplyScalar(M.intensity),M.castShadow){const ie=M.shadow,K=t.get(M);K.shadowIntensity=ie.intensity,K.shadowBias=ie.bias,K.shadowNormalBias=ie.normalBias,K.shadowRadius=ie.radius,K.shadowMapSize=ie.mapSize,n.directionalShadow[p]=K,n.directionalShadowMap[p]=W,n.directionalShadowMatrix[p]=M.shadow.matrix,w++}n.directional[p]=V,p++}else if(M.isSpotLight){const V=e.get(M);V.position.setFromMatrixPosition(M.matrixWorld),V.color.copy(O).multiplyScalar(k),V.distance=q,V.coneCos=Math.cos(M.angle),V.penumbraCos=Math.cos(M.angle*(1-M.penumbra)),V.decay=M.decay,n.spot[x]=V;const ie=M.shadow;if(M.map&&(n.spotLightMap[L]=M.map,L++,ie.updateMatrices(M),M.castShadow&&C++),n.spotLightMatrix[x]=ie.matrix,M.castShadow){const K=t.get(M);K.shadowIntensity=ie.intensity,K.shadowBias=ie.bias,K.shadowNormalBias=ie.normalBias,K.shadowRadius=ie.radius,K.shadowMapSize=ie.mapSize,n.spotShadow[x]=K,n.spotShadowMap[x]=W,y++}x++}else if(M.isRectAreaLight){const V=e.get(M);V.color.copy(O).multiplyScalar(k),V.halfWidth.set(M.width*.5,0,0),V.halfHeight.set(0,M.height*.5,0),n.rectArea[u]=V,u++}else if(M.isPointLight){const V=e.get(M);if(V.color.copy(M.color).multiplyScalar(M.intensity),V.distance=M.distance,V.decay=M.decay,M.castShadow){const ie=M.shadow,K=t.get(M);K.shadowIntensity=ie.intensity,K.shadowBias=ie.bias,K.shadowNormalBias=ie.normalBias,K.shadowRadius=ie.radius,K.shadowMapSize=ie.mapSize,K.shadowCameraNear=ie.camera.near,K.shadowCameraFar=ie.camera.far,n.pointShadow[g]=K,n.pointShadowMap[g]=W,n.pointShadowMatrix[g]=M.shadow.matrix,S++}n.point[g]=V,g++}else if(M.isHemisphereLight){const V=e.get(M);V.skyColor.copy(M.color).multiplyScalar(k),V.groundColor.copy(M.groundColor).multiplyScalar(k),n.hemi[m]=V,m++}}u>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Te.LTC_FLOAT_1,n.rectAreaLTC2=Te.LTC_FLOAT_2):(n.rectAreaLTC1=Te.LTC_HALF_1,n.rectAreaLTC2=Te.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=f,n.ambient[2]=d;const z=n.hash;(z.directionalLength!==p||z.pointLength!==g||z.spotLength!==x||z.rectAreaLength!==u||z.hemiLength!==m||z.numDirectionalShadows!==w||z.numPointShadows!==S||z.numSpotShadows!==y||z.numSpotMaps!==L||z.numLightProbes!==R)&&(n.directional.length=p,n.spot.length=x,n.rectArea.length=u,n.point.length=g,n.hemi.length=m,n.directionalShadow.length=w,n.directionalShadowMap.length=w,n.pointShadow.length=S,n.pointShadowMap.length=S,n.spotShadow.length=y,n.spotShadowMap.length=y,n.directionalShadowMatrix.length=w,n.pointShadowMatrix.length=S,n.spotLightMatrix.length=y+L-C,n.spotLightMap.length=L,n.numSpotLightShadowsWithMaps=C,n.numLightProbes=R,z.directionalLength=p,z.pointLength=g,z.spotLength=x,z.rectAreaLength=u,z.hemiLength=m,z.numDirectionalShadows=w,z.numPointShadows=S,z.numSpotShadows=y,z.numSpotMaps=L,z.numLightProbes=R,n.version=e_++)}function c(l,h){let f=0,d=0,p=0,g=0,x=0;const u=h.matrixWorldInverse;for(let m=0,w=l.length;m<w;m++){const S=l[m];if(S.isDirectionalLight){const y=n.directional[f];y.direction.setFromMatrixPosition(S.matrixWorld),s.setFromMatrixPosition(S.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(u),f++}else if(S.isSpotLight){const y=n.spot[p];y.position.setFromMatrixPosition(S.matrixWorld),y.position.applyMatrix4(u),y.direction.setFromMatrixPosition(S.matrixWorld),s.setFromMatrixPosition(S.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(u),p++}else if(S.isRectAreaLight){const y=n.rectArea[g];y.position.setFromMatrixPosition(S.matrixWorld),y.position.applyMatrix4(u),a.identity(),r.copy(S.matrixWorld),r.premultiply(u),a.extractRotation(r),y.halfWidth.set(S.width*.5,0,0),y.halfHeight.set(0,S.height*.5,0),y.halfWidth.applyMatrix4(a),y.halfHeight.applyMatrix4(a),g++}else if(S.isPointLight){const y=n.point[d];y.position.setFromMatrixPosition(S.matrixWorld),y.position.applyMatrix4(u),d++}else if(S.isHemisphereLight){const y=n.hemi[x];y.direction.setFromMatrixPosition(S.matrixWorld),y.direction.transformDirection(u),x++}}}return{setup:o,setupView:c,state:n}}function Ol(i){const e=new n_(i),t=[],n=[];function s(h){l.camera=h,t.length=0,n.length=0}function r(h){t.push(h)}function a(h){n.push(h)}function o(){e.setup(t)}function c(h){e.setupView(t,h)}const l={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:l,setupLights:o,setupLightsView:c,pushLight:r,pushShadow:a}}function i_(i){let e=new WeakMap;function t(s,r=0){const a=e.get(s);let o;return a===void 0?(o=new Ol(i),e.set(s,[o])):r>=a.length?(o=new Ol(i),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}class s_ extends Ri{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Zu,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class r_ extends Ri{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const a_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,o_=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function c_(i,e,t){let n=new uc;const s=new ke,r=new ke,a=new vt,o=new s_({depthPacking:Ju}),c=new r_,l={},h=t.maxTextureSize,f={[Qn]:Xt,[Xt]:Qn,[jt]:jt},d=new ei({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ke},radius:{value:4}},vertexShader:a_,fragmentShader:o_}),p=d.clone();p.defines.HORIZONTAL_PASS=1;const g=new ct;g.setAttribute("position",new Lt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const x=new Ee(g,d),u=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Ih;let m=this.type;this.render=function(C,R,z){if(u.enabled===!1||u.autoUpdate===!1&&u.needsUpdate===!1||C.length===0)return;const ne=i.getRenderTarget(),_=i.getActiveCubeFace(),M=i.getActiveMipmapLevel(),O=i.state;O.setBlending(Kn),O.buffers.color.setClear(1,1,1,1),O.buffers.depth.setTest(!0),O.setScissorTest(!1);const k=m!==In&&this.type===In,q=m===In&&this.type!==In;for(let W=0,V=C.length;W<V;W++){const ie=C[W],K=ie.shadow;if(K===void 0){console.warn("THREE.WebGLShadowMap:",ie,"has no shadow.");continue}if(K.autoUpdate===!1&&K.needsUpdate===!1)continue;s.copy(K.mapSize);const me=K.getFrameExtents();if(s.multiply(me),r.copy(K.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/me.x),s.x=r.x*me.x,K.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/me.y),s.y=r.y*me.y,K.mapSize.y=r.y)),K.map===null||k===!0||q===!0){const ve=this.type!==In?{minFilter:rn,magFilter:rn}:{};K.map!==null&&K.map.dispose(),K.map=new Si(s.x,s.y,ve),K.map.texture.name=ie.name+".shadowMap",K.camera.updateProjectionMatrix()}i.setRenderTarget(K.map),i.clear();const xe=K.getViewportCount();for(let ve=0;ve<xe;ve++){const se=K.getViewport(ve);a.set(r.x*se.x,r.y*se.y,r.x*se.z,r.y*se.w),O.viewport(a),K.updateMatrices(ie,ve),n=K.getFrustum(),y(R,z,K.camera,ie,this.type)}K.isPointLightShadow!==!0&&this.type===In&&w(K,z),K.needsUpdate=!1}m=this.type,u.needsUpdate=!1,i.setRenderTarget(ne,_,M)};function w(C,R){const z=e.update(x);d.defines.VSM_SAMPLES!==C.blurSamples&&(d.defines.VSM_SAMPLES=C.blurSamples,p.defines.VSM_SAMPLES=C.blurSamples,d.needsUpdate=!0,p.needsUpdate=!0),C.mapPass===null&&(C.mapPass=new Si(s.x,s.y)),d.uniforms.shadow_pass.value=C.map.texture,d.uniforms.resolution.value=C.mapSize,d.uniforms.radius.value=C.radius,i.setRenderTarget(C.mapPass),i.clear(),i.renderBufferDirect(R,null,z,d,x,null),p.uniforms.shadow_pass.value=C.mapPass.texture,p.uniforms.resolution.value=C.mapSize,p.uniforms.radius.value=C.radius,i.setRenderTarget(C.map),i.clear(),i.renderBufferDirect(R,null,z,p,x,null)}function S(C,R,z,ne){let _=null;const M=z.isPointLight===!0?C.customDistanceMaterial:C.customDepthMaterial;if(M!==void 0)_=M;else if(_=z.isPointLight===!0?c:o,i.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0){const O=_.uuid,k=R.uuid;let q=l[O];q===void 0&&(q={},l[O]=q);let W=q[k];W===void 0&&(W=_.clone(),q[k]=W,R.addEventListener("dispose",L)),_=W}if(_.visible=R.visible,_.wireframe=R.wireframe,ne===In?_.side=R.shadowSide!==null?R.shadowSide:R.side:_.side=R.shadowSide!==null?R.shadowSide:f[R.side],_.alphaMap=R.alphaMap,_.alphaTest=R.alphaTest,_.map=R.map,_.clipShadows=R.clipShadows,_.clippingPlanes=R.clippingPlanes,_.clipIntersection=R.clipIntersection,_.displacementMap=R.displacementMap,_.displacementScale=R.displacementScale,_.displacementBias=R.displacementBias,_.wireframeLinewidth=R.wireframeLinewidth,_.linewidth=R.linewidth,z.isPointLight===!0&&_.isMeshDistanceMaterial===!0){const O=i.properties.get(_);O.light=z}return _}function y(C,R,z,ne,_){if(C.visible===!1)return;if(C.layers.test(R.layers)&&(C.isMesh||C.isLine||C.isPoints)&&(C.castShadow||C.receiveShadow&&_===In)&&(!C.frustumCulled||n.intersectsObject(C))){C.modelViewMatrix.multiplyMatrices(z.matrixWorldInverse,C.matrixWorld);const k=e.update(C),q=C.material;if(Array.isArray(q)){const W=k.groups;for(let V=0,ie=W.length;V<ie;V++){const K=W[V],me=q[K.materialIndex];if(me&&me.visible){const xe=S(C,me,ne,_);C.onBeforeShadow(i,C,R,z,k,xe,K),i.renderBufferDirect(z,null,k,xe,C,K),C.onAfterShadow(i,C,R,z,k,xe,K)}}}else if(q.visible){const W=S(C,q,ne,_);C.onBeforeShadow(i,C,R,z,k,W,null),i.renderBufferDirect(z,null,k,W,C,null),C.onAfterShadow(i,C,R,z,k,W,null)}}const O=C.children;for(let k=0,q=O.length;k<q;k++)y(O[k],R,z,ne,_)}function L(C){C.target.removeEventListener("dispose",L);for(const z in l){const ne=l[z],_=C.target.uuid;_ in ne&&(ne[_].dispose(),delete ne[_])}}}const l_={[oo]:co,[lo]:fo,[ho]:po,[ts]:uo,[co]:oo,[fo]:lo,[po]:ho,[uo]:ts};function h_(i){function e(){let F=!1;const Le=new vt;let re=null;const _e=new vt(0,0,0,0);return{setMask:function(Re){re!==Re&&!F&&(i.colorMask(Re,Re,Re,Re),re=Re)},setLocked:function(Re){F=Re},setClear:function(Re,Pe,Ze,Mt,Ht){Ht===!0&&(Re*=Mt,Pe*=Mt,Ze*=Mt),Le.set(Re,Pe,Ze,Mt),_e.equals(Le)===!1&&(i.clearColor(Re,Pe,Ze,Mt),_e.copy(Le))},reset:function(){F=!1,re=null,_e.set(-1,0,0,0)}}}function t(){let F=!1,Le=!1,re=null,_e=null,Re=null;return{setReversed:function(Pe){Le=Pe},setTest:function(Pe){Pe?X(i.DEPTH_TEST):Y(i.DEPTH_TEST)},setMask:function(Pe){re!==Pe&&!F&&(i.depthMask(Pe),re=Pe)},setFunc:function(Pe){if(Le&&(Pe=l_[Pe]),_e!==Pe){switch(Pe){case oo:i.depthFunc(i.NEVER);break;case co:i.depthFunc(i.ALWAYS);break;case lo:i.depthFunc(i.LESS);break;case ts:i.depthFunc(i.LEQUAL);break;case ho:i.depthFunc(i.EQUAL);break;case uo:i.depthFunc(i.GEQUAL);break;case fo:i.depthFunc(i.GREATER);break;case po:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}_e=Pe}},setLocked:function(Pe){F=Pe},setClear:function(Pe){Re!==Pe&&(i.clearDepth(Pe),Re=Pe)},reset:function(){F=!1,re=null,_e=null,Re=null}}}function n(){let F=!1,Le=null,re=null,_e=null,Re=null,Pe=null,Ze=null,Mt=null,Ht=null;return{setTest:function(Je){F||(Je?X(i.STENCIL_TEST):Y(i.STENCIL_TEST))},setMask:function(Je){Le!==Je&&!F&&(i.stencilMask(Je),Le=Je)},setFunc:function(Je,Gt,bn){(re!==Je||_e!==Gt||Re!==bn)&&(i.stencilFunc(Je,Gt,bn),re=Je,_e=Gt,Re=bn)},setOp:function(Je,Gt,bn){(Pe!==Je||Ze!==Gt||Mt!==bn)&&(i.stencilOp(Je,Gt,bn),Pe=Je,Ze=Gt,Mt=bn)},setLocked:function(Je){F=Je},setClear:function(Je){Ht!==Je&&(i.clearStencil(Je),Ht=Je)},reset:function(){F=!1,Le=null,re=null,_e=null,Re=null,Pe=null,Ze=null,Mt=null,Ht=null}}}const s=new e,r=new t,a=new n,o=new WeakMap,c=new WeakMap;let l={},h={},f=new WeakMap,d=[],p=null,g=!1,x=null,u=null,m=null,w=null,S=null,y=null,L=null,C=new je(0,0,0),R=0,z=!1,ne=null,_=null,M=null,O=null,k=null;const q=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let W=!1,V=0;const ie=i.getParameter(i.VERSION);ie.indexOf("WebGL")!==-1?(V=parseFloat(/^WebGL (\d)/.exec(ie)[1]),W=V>=1):ie.indexOf("OpenGL ES")!==-1&&(V=parseFloat(/^OpenGL ES (\d)/.exec(ie)[1]),W=V>=2);let K=null,me={};const xe=i.getParameter(i.SCISSOR_BOX),ve=i.getParameter(i.VIEWPORT),se=new vt().fromArray(xe),le=new vt().fromArray(ve);function A(F,Le,re,_e){const Re=new Uint8Array(4),Pe=i.createTexture();i.bindTexture(F,Pe),i.texParameteri(F,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(F,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Ze=0;Ze<re;Ze++)F===i.TEXTURE_3D||F===i.TEXTURE_2D_ARRAY?i.texImage3D(Le,0,i.RGBA,1,1,_e,0,i.RGBA,i.UNSIGNED_BYTE,Re):i.texImage2D(Le+Ze,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,Re);return Pe}const I={};I[i.TEXTURE_2D]=A(i.TEXTURE_2D,i.TEXTURE_2D,1),I[i.TEXTURE_CUBE_MAP]=A(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),I[i.TEXTURE_2D_ARRAY]=A(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),I[i.TEXTURE_3D]=A(i.TEXTURE_3D,i.TEXTURE_3D,1,1),s.setClear(0,0,0,1),r.setClear(1),a.setClear(0),X(i.DEPTH_TEST),r.setFunc(ts),ae(!1),pe(jc),X(i.CULL_FACE),E(Kn);function X(F){l[F]!==!0&&(i.enable(F),l[F]=!0)}function Y(F){l[F]!==!1&&(i.disable(F),l[F]=!1)}function fe(F,Le){return h[F]!==Le?(i.bindFramebuffer(F,Le),h[F]=Le,F===i.DRAW_FRAMEBUFFER&&(h[i.FRAMEBUFFER]=Le),F===i.FRAMEBUFFER&&(h[i.DRAW_FRAMEBUFFER]=Le),!0):!1}function U(F,Le){let re=d,_e=!1;if(F){re=f.get(Le),re===void 0&&(re=[],f.set(Le,re));const Re=F.textures;if(re.length!==Re.length||re[0]!==i.COLOR_ATTACHMENT0){for(let Pe=0,Ze=Re.length;Pe<Ze;Pe++)re[Pe]=i.COLOR_ATTACHMENT0+Pe;re.length=Re.length,_e=!0}}else re[0]!==i.BACK&&(re[0]=i.BACK,_e=!0);_e&&i.drawBuffers(re)}function te(F){return p!==F?(i.useProgram(F),p=F,!0):!1}const ye={[mi]:i.FUNC_ADD,[Eu]:i.FUNC_SUBTRACT,[wu]:i.FUNC_REVERSE_SUBTRACT};ye[Tu]=i.MIN,ye[Au]=i.MAX;const de={[Ru]:i.ZERO,[Cu]:i.ONE,[Lu]:i.SRC_COLOR,[ro]:i.SRC_ALPHA,[Ou]:i.SRC_ALPHA_SATURATE,[Uu]:i.DST_COLOR,[Iu]:i.DST_ALPHA,[Pu]:i.ONE_MINUS_SRC_COLOR,[ao]:i.ONE_MINUS_SRC_ALPHA,[Nu]:i.ONE_MINUS_DST_COLOR,[Du]:i.ONE_MINUS_DST_ALPHA,[zu]:i.CONSTANT_COLOR,[Fu]:i.ONE_MINUS_CONSTANT_COLOR,[ku]:i.CONSTANT_ALPHA,[Bu]:i.ONE_MINUS_CONSTANT_ALPHA};function E(F,Le,re,_e,Re,Pe,Ze,Mt,Ht,Je){if(F===Kn){g===!0&&(Y(i.BLEND),g=!1);return}if(g===!1&&(X(i.BLEND),g=!0),F!==bu){if(F!==x||Je!==z){if((u!==mi||S!==mi)&&(i.blendEquation(i.FUNC_ADD),u=mi,S=mi),Je)switch(F){case Ji:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Xc:i.blendFunc(i.ONE,i.ONE);break;case qc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case $c:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",F);break}else switch(F){case Ji:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Xc:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case qc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case $c:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",F);break}m=null,w=null,y=null,L=null,C.set(0,0,0),R=0,x=F,z=Je}return}Re=Re||Le,Pe=Pe||re,Ze=Ze||_e,(Le!==u||Re!==S)&&(i.blendEquationSeparate(ye[Le],ye[Re]),u=Le,S=Re),(re!==m||_e!==w||Pe!==y||Ze!==L)&&(i.blendFuncSeparate(de[re],de[_e],de[Pe],de[Ze]),m=re,w=_e,y=Pe,L=Ze),(Mt.equals(C)===!1||Ht!==R)&&(i.blendColor(Mt.r,Mt.g,Mt.b,Ht),C.copy(Mt),R=Ht),x=F,z=!1}function B(F,Le){F.side===jt?Y(i.CULL_FACE):X(i.CULL_FACE);let re=F.side===Xt;Le&&(re=!re),ae(re),F.blending===Ji&&F.transparent===!1?E(Kn):E(F.blending,F.blendEquation,F.blendSrc,F.blendDst,F.blendEquationAlpha,F.blendSrcAlpha,F.blendDstAlpha,F.blendColor,F.blendAlpha,F.premultipliedAlpha),r.setFunc(F.depthFunc),r.setTest(F.depthTest),r.setMask(F.depthWrite),s.setMask(F.colorWrite);const _e=F.stencilWrite;a.setTest(_e),_e&&(a.setMask(F.stencilWriteMask),a.setFunc(F.stencilFunc,F.stencilRef,F.stencilFuncMask),a.setOp(F.stencilFail,F.stencilZFail,F.stencilZPass)),De(F.polygonOffset,F.polygonOffsetFactor,F.polygonOffsetUnits),F.alphaToCoverage===!0?X(i.SAMPLE_ALPHA_TO_COVERAGE):Y(i.SAMPLE_ALPHA_TO_COVERAGE)}function ae(F){ne!==F&&(F?i.frontFace(i.CW):i.frontFace(i.CCW),ne=F)}function pe(F){F!==yu?(X(i.CULL_FACE),F!==_&&(F===jc?i.cullFace(i.BACK):F===Mu?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Y(i.CULL_FACE),_=F}function ge(F){F!==M&&(W&&i.lineWidth(F),M=F)}function De(F,Le,re){F?(X(i.POLYGON_OFFSET_FILL),(O!==Le||k!==re)&&(i.polygonOffset(Le,re),O=Le,k=re)):Y(i.POLYGON_OFFSET_FILL)}function he(F){F?X(i.SCISSOR_TEST):Y(i.SCISSOR_TEST)}function b(F){F===void 0&&(F=i.TEXTURE0+q-1),K!==F&&(i.activeTexture(F),K=F)}function v(F,Le,re){re===void 0&&(K===null?re=i.TEXTURE0+q-1:re=K);let _e=me[re];_e===void 0&&(_e={type:void 0,texture:void 0},me[re]=_e),(_e.type!==F||_e.texture!==Le)&&(K!==re&&(i.activeTexture(re),K=re),i.bindTexture(F,Le||I[F]),_e.type=F,_e.texture=Le)}function N(){const F=me[K];F!==void 0&&F.type!==void 0&&(i.bindTexture(F.type,null),F.type=void 0,F.texture=void 0)}function J(){try{i.compressedTexImage2D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function ce(){try{i.compressedTexImage3D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function oe(){try{i.texSubImage2D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Ae(){try{i.texSubImage3D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function be(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function we(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function qe(){try{i.texStorage2D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Me(){try{i.texStorage3D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Ie(){try{i.texImage2D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function He(){try{i.texImage3D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function We(F){se.equals(F)===!1&&(i.scissor(F.x,F.y,F.z,F.w),se.copy(F))}function Ue(F){le.equals(F)===!1&&(i.viewport(F.x,F.y,F.z,F.w),le.copy(F))}function Ke(F,Le){let re=c.get(Le);re===void 0&&(re=new WeakMap,c.set(Le,re));let _e=re.get(F);_e===void 0&&(_e=i.getUniformBlockIndex(Le,F.name),re.set(F,_e))}function Xe(F,Le){const _e=c.get(Le).get(F);o.get(Le)!==_e&&(i.uniformBlockBinding(Le,_e,F.__bindingPointIndex),o.set(Le,_e))}function ot(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),l={},K=null,me={},h={},f=new WeakMap,d=[],p=null,g=!1,x=null,u=null,m=null,w=null,S=null,y=null,L=null,C=new je(0,0,0),R=0,z=!1,ne=null,_=null,M=null,O=null,k=null,se.set(0,0,i.canvas.width,i.canvas.height),le.set(0,0,i.canvas.width,i.canvas.height),s.reset(),r.reset(),a.reset()}return{buffers:{color:s,depth:r,stencil:a},enable:X,disable:Y,bindFramebuffer:fe,drawBuffers:U,useProgram:te,setBlending:E,setMaterial:B,setFlipSided:ae,setCullFace:pe,setLineWidth:ge,setPolygonOffset:De,setScissorTest:he,activeTexture:b,bindTexture:v,unbindTexture:N,compressedTexImage2D:J,compressedTexImage3D:ce,texImage2D:Ie,texImage3D:He,updateUBOMapping:Ke,uniformBlockBinding:Xe,texStorage2D:qe,texStorage3D:Me,texSubImage2D:oe,texSubImage3D:Ae,compressedTexSubImage2D:be,compressedTexSubImage3D:we,scissor:We,viewport:Ue,reset:ot}}function zl(i,e,t,n){const s=d_(n);switch(t){case Fh:return i*e;case Bh:return i*e;case Hh:return i*e*2;case Gh:return i*e/s.components*s.byteLength;case oc:return i*e/s.components*s.byteLength;case Vh:return i*e*2/s.components*s.byteLength;case cc:return i*e*2/s.components*s.byteLength;case kh:return i*e*3/s.components*s.byteLength;case pn:return i*e*4/s.components*s.byteLength;case lc:return i*e*4/s.components*s.byteLength;case Er:case wr:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Tr:case Ar:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case yo:case So:return Math.max(i,16)*Math.max(e,8)/4;case xo:case Mo:return Math.max(i,8)*Math.max(e,8)/2;case bo:case Eo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case wo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case To:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Ao:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case Ro:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case Co:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case Lo:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case Po:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case Io:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case Do:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case Uo:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case No:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case Oo:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case zo:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case Fo:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case ko:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case Rr:case Bo:case Ho:return Math.ceil(i/4)*Math.ceil(e/4)*16;case Wh:case Go:return Math.ceil(i/4)*Math.ceil(e/4)*8;case Vo:case Wo:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function d_(i){switch(i){case zn:case Nh:return{byteLength:1,components:1};case Ps:case Oh:case Fs:return{byteLength:2,components:1};case rc:case ac:return{byteLength:2,components:4};case Mi:case sc:case Dn:return{byteLength:4,components:1};case zh:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}function u_(i,e,t,n,s,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new ke,h=new WeakMap;let f;const d=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(b,v){return p?new OffscreenCanvas(b,v):Wr("canvas")}function x(b,v,N){let J=1;const ce=he(b);if((ce.width>N||ce.height>N)&&(J=N/Math.max(ce.width,ce.height)),J<1)if(typeof HTMLImageElement<"u"&&b instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&b instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&b instanceof ImageBitmap||typeof VideoFrame<"u"&&b instanceof VideoFrame){const oe=Math.floor(J*ce.width),Ae=Math.floor(J*ce.height);f===void 0&&(f=g(oe,Ae));const be=v?g(oe,Ae):f;return be.width=oe,be.height=Ae,be.getContext("2d").drawImage(b,0,0,oe,Ae),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+ce.width+"x"+ce.height+") to ("+oe+"x"+Ae+")."),be}else return"data"in b&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+ce.width+"x"+ce.height+")."),b;return b}function u(b){return b.generateMipmaps&&b.minFilter!==rn&&b.minFilter!==nn}function m(b){i.generateMipmap(b)}function w(b,v,N,J,ce=!1){if(b!==null){if(i[b]!==void 0)return i[b];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+b+"'")}let oe=v;if(v===i.RED&&(N===i.FLOAT&&(oe=i.R32F),N===i.HALF_FLOAT&&(oe=i.R16F),N===i.UNSIGNED_BYTE&&(oe=i.R8)),v===i.RED_INTEGER&&(N===i.UNSIGNED_BYTE&&(oe=i.R8UI),N===i.UNSIGNED_SHORT&&(oe=i.R16UI),N===i.UNSIGNED_INT&&(oe=i.R32UI),N===i.BYTE&&(oe=i.R8I),N===i.SHORT&&(oe=i.R16I),N===i.INT&&(oe=i.R32I)),v===i.RG&&(N===i.FLOAT&&(oe=i.RG32F),N===i.HALF_FLOAT&&(oe=i.RG16F),N===i.UNSIGNED_BYTE&&(oe=i.RG8)),v===i.RG_INTEGER&&(N===i.UNSIGNED_BYTE&&(oe=i.RG8UI),N===i.UNSIGNED_SHORT&&(oe=i.RG16UI),N===i.UNSIGNED_INT&&(oe=i.RG32UI),N===i.BYTE&&(oe=i.RG8I),N===i.SHORT&&(oe=i.RG16I),N===i.INT&&(oe=i.RG32I)),v===i.RGB_INTEGER&&(N===i.UNSIGNED_BYTE&&(oe=i.RGB8UI),N===i.UNSIGNED_SHORT&&(oe=i.RGB16UI),N===i.UNSIGNED_INT&&(oe=i.RGB32UI),N===i.BYTE&&(oe=i.RGB8I),N===i.SHORT&&(oe=i.RGB16I),N===i.INT&&(oe=i.RGB32I)),v===i.RGBA_INTEGER&&(N===i.UNSIGNED_BYTE&&(oe=i.RGBA8UI),N===i.UNSIGNED_SHORT&&(oe=i.RGBA16UI),N===i.UNSIGNED_INT&&(oe=i.RGBA32UI),N===i.BYTE&&(oe=i.RGBA8I),N===i.SHORT&&(oe=i.RGBA16I),N===i.INT&&(oe=i.RGBA32I)),v===i.RGB&&N===i.UNSIGNED_INT_5_9_9_9_REV&&(oe=i.RGB9_E5),v===i.RGBA){const Ae=ce?Br:tt.getTransfer(J);N===i.FLOAT&&(oe=i.RGBA32F),N===i.HALF_FLOAT&&(oe=i.RGBA16F),N===i.UNSIGNED_BYTE&&(oe=Ae===ht?i.SRGB8_ALPHA8:i.RGBA8),N===i.UNSIGNED_SHORT_4_4_4_4&&(oe=i.RGBA4),N===i.UNSIGNED_SHORT_5_5_5_1&&(oe=i.RGB5_A1)}return(oe===i.R16F||oe===i.R32F||oe===i.RG16F||oe===i.RG32F||oe===i.RGBA16F||oe===i.RGBA32F)&&e.get("EXT_color_buffer_float"),oe}function S(b,v){let N;return b?v===null||v===Mi||v===ss?N=i.DEPTH24_STENCIL8:v===Dn?N=i.DEPTH32F_STENCIL8:v===Ps&&(N=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):v===null||v===Mi||v===ss?N=i.DEPTH_COMPONENT24:v===Dn?N=i.DEPTH_COMPONENT32F:v===Ps&&(N=i.DEPTH_COMPONENT16),N}function y(b,v){return u(b)===!0||b.isFramebufferTexture&&b.minFilter!==rn&&b.minFilter!==nn?Math.log2(Math.max(v.width,v.height))+1:b.mipmaps!==void 0&&b.mipmaps.length>0?b.mipmaps.length:b.isCompressedTexture&&Array.isArray(b.image)?v.mipmaps.length:1}function L(b){const v=b.target;v.removeEventListener("dispose",L),R(v),v.isVideoTexture&&h.delete(v)}function C(b){const v=b.target;v.removeEventListener("dispose",C),ne(v)}function R(b){const v=n.get(b);if(v.__webglInit===void 0)return;const N=b.source,J=d.get(N);if(J){const ce=J[v.__cacheKey];ce.usedTimes--,ce.usedTimes===0&&z(b),Object.keys(J).length===0&&d.delete(N)}n.remove(b)}function z(b){const v=n.get(b);i.deleteTexture(v.__webglTexture);const N=b.source,J=d.get(N);delete J[v.__cacheKey],a.memory.textures--}function ne(b){const v=n.get(b);if(b.depthTexture&&b.depthTexture.dispose(),b.isWebGLCubeRenderTarget)for(let J=0;J<6;J++){if(Array.isArray(v.__webglFramebuffer[J]))for(let ce=0;ce<v.__webglFramebuffer[J].length;ce++)i.deleteFramebuffer(v.__webglFramebuffer[J][ce]);else i.deleteFramebuffer(v.__webglFramebuffer[J]);v.__webglDepthbuffer&&i.deleteRenderbuffer(v.__webglDepthbuffer[J])}else{if(Array.isArray(v.__webglFramebuffer))for(let J=0;J<v.__webglFramebuffer.length;J++)i.deleteFramebuffer(v.__webglFramebuffer[J]);else i.deleteFramebuffer(v.__webglFramebuffer);if(v.__webglDepthbuffer&&i.deleteRenderbuffer(v.__webglDepthbuffer),v.__webglMultisampledFramebuffer&&i.deleteFramebuffer(v.__webglMultisampledFramebuffer),v.__webglColorRenderbuffer)for(let J=0;J<v.__webglColorRenderbuffer.length;J++)v.__webglColorRenderbuffer[J]&&i.deleteRenderbuffer(v.__webglColorRenderbuffer[J]);v.__webglDepthRenderbuffer&&i.deleteRenderbuffer(v.__webglDepthRenderbuffer)}const N=b.textures;for(let J=0,ce=N.length;J<ce;J++){const oe=n.get(N[J]);oe.__webglTexture&&(i.deleteTexture(oe.__webglTexture),a.memory.textures--),n.remove(N[J])}n.remove(b)}let _=0;function M(){_=0}function O(){const b=_;return b>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+b+" texture units while this GPU supports only "+s.maxTextures),_+=1,b}function k(b){const v=[];return v.push(b.wrapS),v.push(b.wrapT),v.push(b.wrapR||0),v.push(b.magFilter),v.push(b.minFilter),v.push(b.anisotropy),v.push(b.internalFormat),v.push(b.format),v.push(b.type),v.push(b.generateMipmaps),v.push(b.premultiplyAlpha),v.push(b.flipY),v.push(b.unpackAlignment),v.push(b.colorSpace),v.join()}function q(b,v){const N=n.get(b);if(b.isVideoTexture&&ge(b),b.isRenderTargetTexture===!1&&b.version>0&&N.__version!==b.version){const J=b.image;if(J===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(J.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{le(N,b,v);return}}t.bindTexture(i.TEXTURE_2D,N.__webglTexture,i.TEXTURE0+v)}function W(b,v){const N=n.get(b);if(b.version>0&&N.__version!==b.version){le(N,b,v);return}t.bindTexture(i.TEXTURE_2D_ARRAY,N.__webglTexture,i.TEXTURE0+v)}function V(b,v){const N=n.get(b);if(b.version>0&&N.__version!==b.version){le(N,b,v);return}t.bindTexture(i.TEXTURE_3D,N.__webglTexture,i.TEXTURE0+v)}function ie(b,v){const N=n.get(b);if(b.version>0&&N.__version!==b.version){A(N,b,v);return}t.bindTexture(i.TEXTURE_CUBE_MAP,N.__webglTexture,i.TEXTURE0+v)}const K={[_o]:i.REPEAT,[vi]:i.CLAMP_TO_EDGE,[vo]:i.MIRRORED_REPEAT},me={[rn]:i.NEAREST,[Ku]:i.NEAREST_MIPMAP_NEAREST,[Xs]:i.NEAREST_MIPMAP_LINEAR,[nn]:i.LINEAR,[_a]:i.LINEAR_MIPMAP_NEAREST,[xi]:i.LINEAR_MIPMAP_LINEAR},xe={[ef]:i.NEVER,[of]:i.ALWAYS,[tf]:i.LESS,[Xh]:i.LEQUAL,[nf]:i.EQUAL,[af]:i.GEQUAL,[sf]:i.GREATER,[rf]:i.NOTEQUAL};function ve(b,v){if(v.type===Dn&&e.has("OES_texture_float_linear")===!1&&(v.magFilter===nn||v.magFilter===_a||v.magFilter===Xs||v.magFilter===xi||v.minFilter===nn||v.minFilter===_a||v.minFilter===Xs||v.minFilter===xi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(b,i.TEXTURE_WRAP_S,K[v.wrapS]),i.texParameteri(b,i.TEXTURE_WRAP_T,K[v.wrapT]),(b===i.TEXTURE_3D||b===i.TEXTURE_2D_ARRAY)&&i.texParameteri(b,i.TEXTURE_WRAP_R,K[v.wrapR]),i.texParameteri(b,i.TEXTURE_MAG_FILTER,me[v.magFilter]),i.texParameteri(b,i.TEXTURE_MIN_FILTER,me[v.minFilter]),v.compareFunction&&(i.texParameteri(b,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(b,i.TEXTURE_COMPARE_FUNC,xe[v.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(v.magFilter===rn||v.minFilter!==Xs&&v.minFilter!==xi||v.type===Dn&&e.has("OES_texture_float_linear")===!1)return;if(v.anisotropy>1||n.get(v).__currentAnisotropy){const N=e.get("EXT_texture_filter_anisotropic");i.texParameterf(b,N.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(v.anisotropy,s.getMaxAnisotropy())),n.get(v).__currentAnisotropy=v.anisotropy}}}function se(b,v){let N=!1;b.__webglInit===void 0&&(b.__webglInit=!0,v.addEventListener("dispose",L));const J=v.source;let ce=d.get(J);ce===void 0&&(ce={},d.set(J,ce));const oe=k(v);if(oe!==b.__cacheKey){ce[oe]===void 0&&(ce[oe]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,N=!0),ce[oe].usedTimes++;const Ae=ce[b.__cacheKey];Ae!==void 0&&(ce[b.__cacheKey].usedTimes--,Ae.usedTimes===0&&z(v)),b.__cacheKey=oe,b.__webglTexture=ce[oe].texture}return N}function le(b,v,N){let J=i.TEXTURE_2D;(v.isDataArrayTexture||v.isCompressedArrayTexture)&&(J=i.TEXTURE_2D_ARRAY),v.isData3DTexture&&(J=i.TEXTURE_3D);const ce=se(b,v),oe=v.source;t.bindTexture(J,b.__webglTexture,i.TEXTURE0+N);const Ae=n.get(oe);if(oe.version!==Ae.__version||ce===!0){t.activeTexture(i.TEXTURE0+N);const be=tt.getPrimaries(tt.workingColorSpace),we=v.colorSpace===Yn?null:tt.getPrimaries(v.colorSpace),qe=v.colorSpace===Yn||be===we?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,v.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,v.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,qe);let Me=x(v.image,!1,s.maxTextureSize);Me=De(v,Me);const Ie=r.convert(v.format,v.colorSpace),He=r.convert(v.type);let We=w(v.internalFormat,Ie,He,v.colorSpace,v.isVideoTexture);ve(J,v);let Ue;const Ke=v.mipmaps,Xe=v.isVideoTexture!==!0,ot=Ae.__version===void 0||ce===!0,F=oe.dataReady,Le=y(v,Me);if(v.isDepthTexture)We=S(v.format===rs,v.type),ot&&(Xe?t.texStorage2D(i.TEXTURE_2D,1,We,Me.width,Me.height):t.texImage2D(i.TEXTURE_2D,0,We,Me.width,Me.height,0,Ie,He,null));else if(v.isDataTexture)if(Ke.length>0){Xe&&ot&&t.texStorage2D(i.TEXTURE_2D,Le,We,Ke[0].width,Ke[0].height);for(let re=0,_e=Ke.length;re<_e;re++)Ue=Ke[re],Xe?F&&t.texSubImage2D(i.TEXTURE_2D,re,0,0,Ue.width,Ue.height,Ie,He,Ue.data):t.texImage2D(i.TEXTURE_2D,re,We,Ue.width,Ue.height,0,Ie,He,Ue.data);v.generateMipmaps=!1}else Xe?(ot&&t.texStorage2D(i.TEXTURE_2D,Le,We,Me.width,Me.height),F&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,Me.width,Me.height,Ie,He,Me.data)):t.texImage2D(i.TEXTURE_2D,0,We,Me.width,Me.height,0,Ie,He,Me.data);else if(v.isCompressedTexture)if(v.isCompressedArrayTexture){Xe&&ot&&t.texStorage3D(i.TEXTURE_2D_ARRAY,Le,We,Ke[0].width,Ke[0].height,Me.depth);for(let re=0,_e=Ke.length;re<_e;re++)if(Ue=Ke[re],v.format!==pn)if(Ie!==null)if(Xe){if(F)if(v.layerUpdates.size>0){const Re=zl(Ue.width,Ue.height,v.format,v.type);for(const Pe of v.layerUpdates){const Ze=Ue.data.subarray(Pe*Re/Ue.data.BYTES_PER_ELEMENT,(Pe+1)*Re/Ue.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,re,0,0,Pe,Ue.width,Ue.height,1,Ie,Ze,0,0)}v.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,re,0,0,0,Ue.width,Ue.height,Me.depth,Ie,Ue.data,0,0)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,re,We,Ue.width,Ue.height,Me.depth,0,Ue.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Xe?F&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,re,0,0,0,Ue.width,Ue.height,Me.depth,Ie,He,Ue.data):t.texImage3D(i.TEXTURE_2D_ARRAY,re,We,Ue.width,Ue.height,Me.depth,0,Ie,He,Ue.data)}else{Xe&&ot&&t.texStorage2D(i.TEXTURE_2D,Le,We,Ke[0].width,Ke[0].height);for(let re=0,_e=Ke.length;re<_e;re++)Ue=Ke[re],v.format!==pn?Ie!==null?Xe?F&&t.compressedTexSubImage2D(i.TEXTURE_2D,re,0,0,Ue.width,Ue.height,Ie,Ue.data):t.compressedTexImage2D(i.TEXTURE_2D,re,We,Ue.width,Ue.height,0,Ue.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Xe?F&&t.texSubImage2D(i.TEXTURE_2D,re,0,0,Ue.width,Ue.height,Ie,He,Ue.data):t.texImage2D(i.TEXTURE_2D,re,We,Ue.width,Ue.height,0,Ie,He,Ue.data)}else if(v.isDataArrayTexture)if(Xe){if(ot&&t.texStorage3D(i.TEXTURE_2D_ARRAY,Le,We,Me.width,Me.height,Me.depth),F)if(v.layerUpdates.size>0){const re=zl(Me.width,Me.height,v.format,v.type);for(const _e of v.layerUpdates){const Re=Me.data.subarray(_e*re/Me.data.BYTES_PER_ELEMENT,(_e+1)*re/Me.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,_e,Me.width,Me.height,1,Ie,He,Re)}v.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,Me.width,Me.height,Me.depth,Ie,He,Me.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,We,Me.width,Me.height,Me.depth,0,Ie,He,Me.data);else if(v.isData3DTexture)Xe?(ot&&t.texStorage3D(i.TEXTURE_3D,Le,We,Me.width,Me.height,Me.depth),F&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,Me.width,Me.height,Me.depth,Ie,He,Me.data)):t.texImage3D(i.TEXTURE_3D,0,We,Me.width,Me.height,Me.depth,0,Ie,He,Me.data);else if(v.isFramebufferTexture){if(ot)if(Xe)t.texStorage2D(i.TEXTURE_2D,Le,We,Me.width,Me.height);else{let re=Me.width,_e=Me.height;for(let Re=0;Re<Le;Re++)t.texImage2D(i.TEXTURE_2D,Re,We,re,_e,0,Ie,He,null),re>>=1,_e>>=1}}else if(Ke.length>0){if(Xe&&ot){const re=he(Ke[0]);t.texStorage2D(i.TEXTURE_2D,Le,We,re.width,re.height)}for(let re=0,_e=Ke.length;re<_e;re++)Ue=Ke[re],Xe?F&&t.texSubImage2D(i.TEXTURE_2D,re,0,0,Ie,He,Ue):t.texImage2D(i.TEXTURE_2D,re,We,Ie,He,Ue);v.generateMipmaps=!1}else if(Xe){if(ot){const re=he(Me);t.texStorage2D(i.TEXTURE_2D,Le,We,re.width,re.height)}F&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,Ie,He,Me)}else t.texImage2D(i.TEXTURE_2D,0,We,Ie,He,Me);u(v)&&m(J),Ae.__version=oe.version,v.onUpdate&&v.onUpdate(v)}b.__version=v.version}function A(b,v,N){if(v.image.length!==6)return;const J=se(b,v),ce=v.source;t.bindTexture(i.TEXTURE_CUBE_MAP,b.__webglTexture,i.TEXTURE0+N);const oe=n.get(ce);if(ce.version!==oe.__version||J===!0){t.activeTexture(i.TEXTURE0+N);const Ae=tt.getPrimaries(tt.workingColorSpace),be=v.colorSpace===Yn?null:tt.getPrimaries(v.colorSpace),we=v.colorSpace===Yn||Ae===be?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,v.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,v.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,we);const qe=v.isCompressedTexture||v.image[0].isCompressedTexture,Me=v.image[0]&&v.image[0].isDataTexture,Ie=[];for(let _e=0;_e<6;_e++)!qe&&!Me?Ie[_e]=x(v.image[_e],!0,s.maxCubemapSize):Ie[_e]=Me?v.image[_e].image:v.image[_e],Ie[_e]=De(v,Ie[_e]);const He=Ie[0],We=r.convert(v.format,v.colorSpace),Ue=r.convert(v.type),Ke=w(v.internalFormat,We,Ue,v.colorSpace),Xe=v.isVideoTexture!==!0,ot=oe.__version===void 0||J===!0,F=ce.dataReady;let Le=y(v,He);ve(i.TEXTURE_CUBE_MAP,v);let re;if(qe){Xe&&ot&&t.texStorage2D(i.TEXTURE_CUBE_MAP,Le,Ke,He.width,He.height);for(let _e=0;_e<6;_e++){re=Ie[_e].mipmaps;for(let Re=0;Re<re.length;Re++){const Pe=re[Re];v.format!==pn?We!==null?Xe?F&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+_e,Re,0,0,Pe.width,Pe.height,We,Pe.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+_e,Re,Ke,Pe.width,Pe.height,0,Pe.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Xe?F&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+_e,Re,0,0,Pe.width,Pe.height,We,Ue,Pe.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+_e,Re,Ke,Pe.width,Pe.height,0,We,Ue,Pe.data)}}}else{if(re=v.mipmaps,Xe&&ot){re.length>0&&Le++;const _e=he(Ie[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,Le,Ke,_e.width,_e.height)}for(let _e=0;_e<6;_e++)if(Me){Xe?F&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+_e,0,0,0,Ie[_e].width,Ie[_e].height,We,Ue,Ie[_e].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+_e,0,Ke,Ie[_e].width,Ie[_e].height,0,We,Ue,Ie[_e].data);for(let Re=0;Re<re.length;Re++){const Ze=re[Re].image[_e].image;Xe?F&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+_e,Re+1,0,0,Ze.width,Ze.height,We,Ue,Ze.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+_e,Re+1,Ke,Ze.width,Ze.height,0,We,Ue,Ze.data)}}else{Xe?F&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+_e,0,0,0,We,Ue,Ie[_e]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+_e,0,Ke,We,Ue,Ie[_e]);for(let Re=0;Re<re.length;Re++){const Pe=re[Re];Xe?F&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+_e,Re+1,0,0,We,Ue,Pe.image[_e]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+_e,Re+1,Ke,We,Ue,Pe.image[_e])}}}u(v)&&m(i.TEXTURE_CUBE_MAP),oe.__version=ce.version,v.onUpdate&&v.onUpdate(v)}b.__version=v.version}function I(b,v,N,J,ce,oe){const Ae=r.convert(N.format,N.colorSpace),be=r.convert(N.type),we=w(N.internalFormat,Ae,be,N.colorSpace);if(!n.get(v).__hasExternalTextures){const Me=Math.max(1,v.width>>oe),Ie=Math.max(1,v.height>>oe);ce===i.TEXTURE_3D||ce===i.TEXTURE_2D_ARRAY?t.texImage3D(ce,oe,we,Me,Ie,v.depth,0,Ae,be,null):t.texImage2D(ce,oe,we,Me,Ie,0,Ae,be,null)}t.bindFramebuffer(i.FRAMEBUFFER,b),pe(v)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,J,ce,n.get(N).__webglTexture,0,ae(v)):(ce===i.TEXTURE_2D||ce>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&ce<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,J,ce,n.get(N).__webglTexture,oe),t.bindFramebuffer(i.FRAMEBUFFER,null)}function X(b,v,N){if(i.bindRenderbuffer(i.RENDERBUFFER,b),v.depthBuffer){const J=v.depthTexture,ce=J&&J.isDepthTexture?J.type:null,oe=S(v.stencilBuffer,ce),Ae=v.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,be=ae(v);pe(v)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,be,oe,v.width,v.height):N?i.renderbufferStorageMultisample(i.RENDERBUFFER,be,oe,v.width,v.height):i.renderbufferStorage(i.RENDERBUFFER,oe,v.width,v.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Ae,i.RENDERBUFFER,b)}else{const J=v.textures;for(let ce=0;ce<J.length;ce++){const oe=J[ce],Ae=r.convert(oe.format,oe.colorSpace),be=r.convert(oe.type),we=w(oe.internalFormat,Ae,be,oe.colorSpace),qe=ae(v);N&&pe(v)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,qe,we,v.width,v.height):pe(v)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,qe,we,v.width,v.height):i.renderbufferStorage(i.RENDERBUFFER,we,v.width,v.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Y(b,v){if(v&&v.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,b),!(v.depthTexture&&v.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(v.depthTexture).__webglTexture||v.depthTexture.image.width!==v.width||v.depthTexture.image.height!==v.height)&&(v.depthTexture.image.width=v.width,v.depthTexture.image.height=v.height,v.depthTexture.needsUpdate=!0),q(v.depthTexture,0);const J=n.get(v.depthTexture).__webglTexture,ce=ae(v);if(v.depthTexture.format===Qi)pe(v)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,J,0,ce):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,J,0);else if(v.depthTexture.format===rs)pe(v)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,J,0,ce):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,J,0);else throw new Error("Unknown depthTexture format")}function fe(b){const v=n.get(b),N=b.isWebGLCubeRenderTarget===!0;if(v.__boundDepthTexture!==b.depthTexture){const J=b.depthTexture;if(v.__depthDisposeCallback&&v.__depthDisposeCallback(),J){const ce=()=>{delete v.__boundDepthTexture,delete v.__depthDisposeCallback,J.removeEventListener("dispose",ce)};J.addEventListener("dispose",ce),v.__depthDisposeCallback=ce}v.__boundDepthTexture=J}if(b.depthTexture&&!v.__autoAllocateDepthBuffer){if(N)throw new Error("target.depthTexture not supported in Cube render targets");Y(v.__webglFramebuffer,b)}else if(N){v.__webglDepthbuffer=[];for(let J=0;J<6;J++)if(t.bindFramebuffer(i.FRAMEBUFFER,v.__webglFramebuffer[J]),v.__webglDepthbuffer[J]===void 0)v.__webglDepthbuffer[J]=i.createRenderbuffer(),X(v.__webglDepthbuffer[J],b,!1);else{const ce=b.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,oe=v.__webglDepthbuffer[J];i.bindRenderbuffer(i.RENDERBUFFER,oe),i.framebufferRenderbuffer(i.FRAMEBUFFER,ce,i.RENDERBUFFER,oe)}}else if(t.bindFramebuffer(i.FRAMEBUFFER,v.__webglFramebuffer),v.__webglDepthbuffer===void 0)v.__webglDepthbuffer=i.createRenderbuffer(),X(v.__webglDepthbuffer,b,!1);else{const J=b.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ce=v.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,ce),i.framebufferRenderbuffer(i.FRAMEBUFFER,J,i.RENDERBUFFER,ce)}t.bindFramebuffer(i.FRAMEBUFFER,null)}function U(b,v,N){const J=n.get(b);v!==void 0&&I(J.__webglFramebuffer,b,b.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),N!==void 0&&fe(b)}function te(b){const v=b.texture,N=n.get(b),J=n.get(v);b.addEventListener("dispose",C);const ce=b.textures,oe=b.isWebGLCubeRenderTarget===!0,Ae=ce.length>1;if(Ae||(J.__webglTexture===void 0&&(J.__webglTexture=i.createTexture()),J.__version=v.version,a.memory.textures++),oe){N.__webglFramebuffer=[];for(let be=0;be<6;be++)if(v.mipmaps&&v.mipmaps.length>0){N.__webglFramebuffer[be]=[];for(let we=0;we<v.mipmaps.length;we++)N.__webglFramebuffer[be][we]=i.createFramebuffer()}else N.__webglFramebuffer[be]=i.createFramebuffer()}else{if(v.mipmaps&&v.mipmaps.length>0){N.__webglFramebuffer=[];for(let be=0;be<v.mipmaps.length;be++)N.__webglFramebuffer[be]=i.createFramebuffer()}else N.__webglFramebuffer=i.createFramebuffer();if(Ae)for(let be=0,we=ce.length;be<we;be++){const qe=n.get(ce[be]);qe.__webglTexture===void 0&&(qe.__webglTexture=i.createTexture(),a.memory.textures++)}if(b.samples>0&&pe(b)===!1){N.__webglMultisampledFramebuffer=i.createFramebuffer(),N.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,N.__webglMultisampledFramebuffer);for(let be=0;be<ce.length;be++){const we=ce[be];N.__webglColorRenderbuffer[be]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,N.__webglColorRenderbuffer[be]);const qe=r.convert(we.format,we.colorSpace),Me=r.convert(we.type),Ie=w(we.internalFormat,qe,Me,we.colorSpace,b.isXRRenderTarget===!0),He=ae(b);i.renderbufferStorageMultisample(i.RENDERBUFFER,He,Ie,b.width,b.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+be,i.RENDERBUFFER,N.__webglColorRenderbuffer[be])}i.bindRenderbuffer(i.RENDERBUFFER,null),b.depthBuffer&&(N.__webglDepthRenderbuffer=i.createRenderbuffer(),X(N.__webglDepthRenderbuffer,b,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(oe){t.bindTexture(i.TEXTURE_CUBE_MAP,J.__webglTexture),ve(i.TEXTURE_CUBE_MAP,v);for(let be=0;be<6;be++)if(v.mipmaps&&v.mipmaps.length>0)for(let we=0;we<v.mipmaps.length;we++)I(N.__webglFramebuffer[be][we],b,v,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+be,we);else I(N.__webglFramebuffer[be],b,v,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+be,0);u(v)&&m(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Ae){for(let be=0,we=ce.length;be<we;be++){const qe=ce[be],Me=n.get(qe);t.bindTexture(i.TEXTURE_2D,Me.__webglTexture),ve(i.TEXTURE_2D,qe),I(N.__webglFramebuffer,b,qe,i.COLOR_ATTACHMENT0+be,i.TEXTURE_2D,0),u(qe)&&m(i.TEXTURE_2D)}t.unbindTexture()}else{let be=i.TEXTURE_2D;if((b.isWebGL3DRenderTarget||b.isWebGLArrayRenderTarget)&&(be=b.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(be,J.__webglTexture),ve(be,v),v.mipmaps&&v.mipmaps.length>0)for(let we=0;we<v.mipmaps.length;we++)I(N.__webglFramebuffer[we],b,v,i.COLOR_ATTACHMENT0,be,we);else I(N.__webglFramebuffer,b,v,i.COLOR_ATTACHMENT0,be,0);u(v)&&m(be),t.unbindTexture()}b.depthBuffer&&fe(b)}function ye(b){const v=b.textures;for(let N=0,J=v.length;N<J;N++){const ce=v[N];if(u(ce)){const oe=b.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:i.TEXTURE_2D,Ae=n.get(ce).__webglTexture;t.bindTexture(oe,Ae),m(oe),t.unbindTexture()}}}const de=[],E=[];function B(b){if(b.samples>0){if(pe(b)===!1){const v=b.textures,N=b.width,J=b.height;let ce=i.COLOR_BUFFER_BIT;const oe=b.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Ae=n.get(b),be=v.length>1;if(be)for(let we=0;we<v.length;we++)t.bindFramebuffer(i.FRAMEBUFFER,Ae.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+we,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,Ae.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+we,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,Ae.__webglMultisampledFramebuffer),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ae.__webglFramebuffer);for(let we=0;we<v.length;we++){if(b.resolveDepthBuffer&&(b.depthBuffer&&(ce|=i.DEPTH_BUFFER_BIT),b.stencilBuffer&&b.resolveStencilBuffer&&(ce|=i.STENCIL_BUFFER_BIT)),be){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Ae.__webglColorRenderbuffer[we]);const qe=n.get(v[we]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,qe,0)}i.blitFramebuffer(0,0,N,J,0,0,N,J,ce,i.NEAREST),c===!0&&(de.length=0,E.length=0,de.push(i.COLOR_ATTACHMENT0+we),b.depthBuffer&&b.resolveDepthBuffer===!1&&(de.push(oe),E.push(oe),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,E)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,de))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),be)for(let we=0;we<v.length;we++){t.bindFramebuffer(i.FRAMEBUFFER,Ae.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+we,i.RENDERBUFFER,Ae.__webglColorRenderbuffer[we]);const qe=n.get(v[we]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,Ae.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+we,i.TEXTURE_2D,qe,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ae.__webglMultisampledFramebuffer)}else if(b.depthBuffer&&b.resolveDepthBuffer===!1&&c){const v=b.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[v])}}}function ae(b){return Math.min(s.maxSamples,b.samples)}function pe(b){const v=n.get(b);return b.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&v.__useRenderToTexture!==!1}function ge(b){const v=a.render.frame;h.get(b)!==v&&(h.set(b,v),b.update())}function De(b,v){const N=b.colorSpace,J=b.format,ce=b.type;return b.isCompressedTexture===!0||b.isVideoTexture===!0||N!==ni&&N!==Yn&&(tt.getTransfer(N)===ht?(J!==pn||ce!==zn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",N)),v}function he(b){return typeof HTMLImageElement<"u"&&b instanceof HTMLImageElement?(l.width=b.naturalWidth||b.width,l.height=b.naturalHeight||b.height):typeof VideoFrame<"u"&&b instanceof VideoFrame?(l.width=b.displayWidth,l.height=b.displayHeight):(l.width=b.width,l.height=b.height),l}this.allocateTextureUnit=O,this.resetTextureUnits=M,this.setTexture2D=q,this.setTexture2DArray=W,this.setTexture3D=V,this.setTextureCube=ie,this.rebindTextures=U,this.setupRenderTarget=te,this.updateRenderTargetMipmap=ye,this.updateMultisampleRenderTarget=B,this.setupDepthRenderbuffer=fe,this.setupFrameBufferTexture=I,this.useMultisampledRTT=pe}function f_(i,e){function t(n,s=Yn){let r;const a=tt.getTransfer(s);if(n===zn)return i.UNSIGNED_BYTE;if(n===rc)return i.UNSIGNED_SHORT_4_4_4_4;if(n===ac)return i.UNSIGNED_SHORT_5_5_5_1;if(n===zh)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Nh)return i.BYTE;if(n===Oh)return i.SHORT;if(n===Ps)return i.UNSIGNED_SHORT;if(n===sc)return i.INT;if(n===Mi)return i.UNSIGNED_INT;if(n===Dn)return i.FLOAT;if(n===Fs)return i.HALF_FLOAT;if(n===Fh)return i.ALPHA;if(n===kh)return i.RGB;if(n===pn)return i.RGBA;if(n===Bh)return i.LUMINANCE;if(n===Hh)return i.LUMINANCE_ALPHA;if(n===Qi)return i.DEPTH_COMPONENT;if(n===rs)return i.DEPTH_STENCIL;if(n===Gh)return i.RED;if(n===oc)return i.RED_INTEGER;if(n===Vh)return i.RG;if(n===cc)return i.RG_INTEGER;if(n===lc)return i.RGBA_INTEGER;if(n===Er||n===wr||n===Tr||n===Ar)if(a===ht)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Er)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===wr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Tr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Ar)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Er)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===wr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Tr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Ar)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===xo||n===yo||n===Mo||n===So)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===xo)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===yo)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Mo)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===So)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===bo||n===Eo||n===wo)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===bo||n===Eo)return a===ht?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===wo)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===To||n===Ao||n===Ro||n===Co||n===Lo||n===Po||n===Io||n===Do||n===Uo||n===No||n===Oo||n===zo||n===Fo||n===ko)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===To)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Ao)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Ro)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Co)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Lo)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Po)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Io)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Do)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Uo)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===No)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Oo)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===zo)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Fo)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===ko)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Rr||n===Bo||n===Ho)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===Rr)return a===ht?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Bo)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Ho)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Wh||n===Go||n===Vo||n===Wo)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===Rr)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Go)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Vo)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Wo)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===ss?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}class p_ extends kt{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class mn extends xt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const m_={type:"move"};class Xa{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new mn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new mn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new D,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new D),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new mn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new D,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new D),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,a=null;const o=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){a=!0;for(const x of e.hand.values()){const u=t.getJointPose(x,n),m=this._getHandJoint(l,x);u!==null&&(m.matrix.fromArray(u.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=u.radius),m.visible=u!==null}const h=l.joints["index-finger-tip"],f=l.joints["thumb-tip"],d=h.position.distanceTo(f.position),p=.02,g=.005;l.inputState.pinching&&d>p+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&d<=p-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(m_)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new mn;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}const g_=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,__=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class v_{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,n){if(this.texture===null){const s=new Bt,r=e.properties.get(s);r.__webglTexture=t.texture,(t.depthNear!=n.depthNear||t.depthFar!=n.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=s}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new ei({vertexShader:g_,fragmentShader:__,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Ee(new kn(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class x_ extends Ti{constructor(e,t){super();const n=this;let s=null,r=1,a=null,o="local-floor",c=1,l=null,h=null,f=null,d=null,p=null,g=null;const x=new v_,u=t.getContextAttributes();let m=null,w=null;const S=[],y=[],L=new ke;let C=null;const R=new kt;R.layers.enable(1),R.viewport=new vt;const z=new kt;z.layers.enable(2),z.viewport=new vt;const ne=[R,z],_=new p_;_.layers.enable(1),_.layers.enable(2);let M=null,O=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(A){let I=S[A];return I===void 0&&(I=new Xa,S[A]=I),I.getTargetRaySpace()},this.getControllerGrip=function(A){let I=S[A];return I===void 0&&(I=new Xa,S[A]=I),I.getGripSpace()},this.getHand=function(A){let I=S[A];return I===void 0&&(I=new Xa,S[A]=I),I.getHandSpace()};function k(A){const I=y.indexOf(A.inputSource);if(I===-1)return;const X=S[I];X!==void 0&&(X.update(A.inputSource,A.frame,l||a),X.dispatchEvent({type:A.type,data:A.inputSource}))}function q(){s.removeEventListener("select",k),s.removeEventListener("selectstart",k),s.removeEventListener("selectend",k),s.removeEventListener("squeeze",k),s.removeEventListener("squeezestart",k),s.removeEventListener("squeezeend",k),s.removeEventListener("end",q),s.removeEventListener("inputsourceschange",W);for(let A=0;A<S.length;A++){const I=y[A];I!==null&&(y[A]=null,S[A].disconnect(I))}M=null,O=null,x.reset(),e.setRenderTarget(m),p=null,d=null,f=null,s=null,w=null,le.stop(),n.isPresenting=!1,e.setPixelRatio(C),e.setSize(L.width,L.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(A){r=A,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(A){o=A,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(A){l=A},this.getBaseLayer=function(){return d!==null?d:p},this.getBinding=function(){return f},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(A){if(s=A,s!==null){if(m=e.getRenderTarget(),s.addEventListener("select",k),s.addEventListener("selectstart",k),s.addEventListener("selectend",k),s.addEventListener("squeeze",k),s.addEventListener("squeezestart",k),s.addEventListener("squeezeend",k),s.addEventListener("end",q),s.addEventListener("inputsourceschange",W),u.xrCompatible!==!0&&await t.makeXRCompatible(),C=e.getPixelRatio(),e.getSize(L),s.renderState.layers===void 0){const I={antialias:u.antialias,alpha:!0,depth:u.depth,stencil:u.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(s,t,I),s.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),w=new Si(p.framebufferWidth,p.framebufferHeight,{format:pn,type:zn,colorSpace:e.outputColorSpace,stencilBuffer:u.stencil})}else{let I=null,X=null,Y=null;u.depth&&(Y=u.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,I=u.stencil?rs:Qi,X=u.stencil?ss:Mi);const fe={colorFormat:t.RGBA8,depthFormat:Y,scaleFactor:r};f=new XRWebGLBinding(s,t),d=f.createProjectionLayer(fe),s.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),w=new Si(d.textureWidth,d.textureHeight,{format:pn,type:zn,depthTexture:new sd(d.textureWidth,d.textureHeight,X,void 0,void 0,void 0,void 0,void 0,void 0,I),stencilBuffer:u.stencil,colorSpace:e.outputColorSpace,samples:u.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1})}w.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await s.requestReferenceSpace(o),le.setContext(s),le.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return x.getDepthTexture()};function W(A){for(let I=0;I<A.removed.length;I++){const X=A.removed[I],Y=y.indexOf(X);Y>=0&&(y[Y]=null,S[Y].disconnect(X))}for(let I=0;I<A.added.length;I++){const X=A.added[I];let Y=y.indexOf(X);if(Y===-1){for(let U=0;U<S.length;U++)if(U>=y.length){y.push(X),Y=U;break}else if(y[U]===null){y[U]=X,Y=U;break}if(Y===-1)break}const fe=S[Y];fe&&fe.connect(X)}}const V=new D,ie=new D;function K(A,I,X){V.setFromMatrixPosition(I.matrixWorld),ie.setFromMatrixPosition(X.matrixWorld);const Y=V.distanceTo(ie),fe=I.projectionMatrix.elements,U=X.projectionMatrix.elements,te=fe[14]/(fe[10]-1),ye=fe[14]/(fe[10]+1),de=(fe[9]+1)/fe[5],E=(fe[9]-1)/fe[5],B=(fe[8]-1)/fe[0],ae=(U[8]+1)/U[0],pe=te*B,ge=te*ae,De=Y/(-B+ae),he=De*-B;if(I.matrixWorld.decompose(A.position,A.quaternion,A.scale),A.translateX(he),A.translateZ(De),A.matrixWorld.compose(A.position,A.quaternion,A.scale),A.matrixWorldInverse.copy(A.matrixWorld).invert(),fe[10]===-1)A.projectionMatrix.copy(I.projectionMatrix),A.projectionMatrixInverse.copy(I.projectionMatrixInverse);else{const b=te+De,v=ye+De,N=pe-he,J=ge+(Y-he),ce=de*ye/v*b,oe=E*ye/v*b;A.projectionMatrix.makePerspective(N,J,ce,oe,b,v),A.projectionMatrixInverse.copy(A.projectionMatrix).invert()}}function me(A,I){I===null?A.matrixWorld.copy(A.matrix):A.matrixWorld.multiplyMatrices(I.matrixWorld,A.matrix),A.matrixWorldInverse.copy(A.matrixWorld).invert()}this.updateCamera=function(A){if(s===null)return;let I=A.near,X=A.far;x.texture!==null&&(x.depthNear>0&&(I=x.depthNear),x.depthFar>0&&(X=x.depthFar)),_.near=z.near=R.near=I,_.far=z.far=R.far=X,(M!==_.near||O!==_.far)&&(s.updateRenderState({depthNear:_.near,depthFar:_.far}),M=_.near,O=_.far);const Y=A.parent,fe=_.cameras;me(_,Y);for(let U=0;U<fe.length;U++)me(fe[U],Y);fe.length===2?K(_,R,z):_.projectionMatrix.copy(R.projectionMatrix),xe(A,_,Y)};function xe(A,I,X){X===null?A.matrix.copy(I.matrixWorld):(A.matrix.copy(X.matrixWorld),A.matrix.invert(),A.matrix.multiply(I.matrixWorld)),A.matrix.decompose(A.position,A.quaternion,A.scale),A.updateMatrixWorld(!0),A.projectionMatrix.copy(I.projectionMatrix),A.projectionMatrixInverse.copy(I.projectionMatrixInverse),A.isPerspectiveCamera&&(A.fov=Xo*2*Math.atan(1/A.projectionMatrix.elements[5]),A.zoom=1)}this.getCamera=function(){return _},this.getFoveation=function(){if(!(d===null&&p===null))return c},this.setFoveation=function(A){c=A,d!==null&&(d.fixedFoveation=A),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=A)},this.hasDepthSensing=function(){return x.texture!==null},this.getDepthSensingMesh=function(){return x.getMesh(_)};let ve=null;function se(A,I){if(h=I.getViewerPose(l||a),g=I,h!==null){const X=h.views;p!==null&&(e.setRenderTargetFramebuffer(w,p.framebuffer),e.setRenderTarget(w));let Y=!1;X.length!==_.cameras.length&&(_.cameras.length=0,Y=!0);for(let U=0;U<X.length;U++){const te=X[U];let ye=null;if(p!==null)ye=p.getViewport(te);else{const E=f.getViewSubImage(d,te);ye=E.viewport,U===0&&(e.setRenderTargetTextures(w,E.colorTexture,d.ignoreDepthValues?void 0:E.depthStencilTexture),e.setRenderTarget(w))}let de=ne[U];de===void 0&&(de=new kt,de.layers.enable(U),de.viewport=new vt,ne[U]=de),de.matrix.fromArray(te.transform.matrix),de.matrix.decompose(de.position,de.quaternion,de.scale),de.projectionMatrix.fromArray(te.projectionMatrix),de.projectionMatrixInverse.copy(de.projectionMatrix).invert(),de.viewport.set(ye.x,ye.y,ye.width,ye.height),U===0&&(_.matrix.copy(de.matrix),_.matrix.decompose(_.position,_.quaternion,_.scale)),Y===!0&&_.cameras.push(de)}const fe=s.enabledFeatures;if(fe&&fe.includes("depth-sensing")){const U=f.getDepthInformation(X[0]);U&&U.isValid&&U.texture&&x.init(e,U,s.renderState)}}for(let X=0;X<S.length;X++){const Y=y[X],fe=S[X];Y!==null&&fe!==void 0&&fe.update(Y,I,l||a)}ve&&ve(A,I),I.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:I}),g=null}const le=new nd;le.setAnimationLoop(se),this.setAnimationLoop=function(A){ve=A},this.dispose=function(){}}}const hi=new _n,y_=new at;function M_(i,e){function t(u,m){u.matrixAutoUpdate===!0&&u.updateMatrix(),m.value.copy(u.matrix)}function n(u,m){m.color.getRGB(u.fogColor.value,Qh(i)),m.isFog?(u.fogNear.value=m.near,u.fogFar.value=m.far):m.isFogExp2&&(u.fogDensity.value=m.density)}function s(u,m,w,S,y){m.isMeshBasicMaterial||m.isMeshLambertMaterial?r(u,m):m.isMeshToonMaterial?(r(u,m),f(u,m)):m.isMeshPhongMaterial?(r(u,m),h(u,m)):m.isMeshStandardMaterial?(r(u,m),d(u,m),m.isMeshPhysicalMaterial&&p(u,m,y)):m.isMeshMatcapMaterial?(r(u,m),g(u,m)):m.isMeshDepthMaterial?r(u,m):m.isMeshDistanceMaterial?(r(u,m),x(u,m)):m.isMeshNormalMaterial?r(u,m):m.isLineBasicMaterial?(a(u,m),m.isLineDashedMaterial&&o(u,m)):m.isPointsMaterial?c(u,m,w,S):m.isSpriteMaterial?l(u,m):m.isShadowMaterial?(u.color.value.copy(m.color),u.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function r(u,m){u.opacity.value=m.opacity,m.color&&u.diffuse.value.copy(m.color),m.emissive&&u.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(u.map.value=m.map,t(m.map,u.mapTransform)),m.alphaMap&&(u.alphaMap.value=m.alphaMap,t(m.alphaMap,u.alphaMapTransform)),m.bumpMap&&(u.bumpMap.value=m.bumpMap,t(m.bumpMap,u.bumpMapTransform),u.bumpScale.value=m.bumpScale,m.side===Xt&&(u.bumpScale.value*=-1)),m.normalMap&&(u.normalMap.value=m.normalMap,t(m.normalMap,u.normalMapTransform),u.normalScale.value.copy(m.normalScale),m.side===Xt&&u.normalScale.value.negate()),m.displacementMap&&(u.displacementMap.value=m.displacementMap,t(m.displacementMap,u.displacementMapTransform),u.displacementScale.value=m.displacementScale,u.displacementBias.value=m.displacementBias),m.emissiveMap&&(u.emissiveMap.value=m.emissiveMap,t(m.emissiveMap,u.emissiveMapTransform)),m.specularMap&&(u.specularMap.value=m.specularMap,t(m.specularMap,u.specularMapTransform)),m.alphaTest>0&&(u.alphaTest.value=m.alphaTest);const w=e.get(m),S=w.envMap,y=w.envMapRotation;S&&(u.envMap.value=S,hi.copy(y),hi.x*=-1,hi.y*=-1,hi.z*=-1,S.isCubeTexture&&S.isRenderTargetTexture===!1&&(hi.y*=-1,hi.z*=-1),u.envMapRotation.value.setFromMatrix4(y_.makeRotationFromEuler(hi)),u.flipEnvMap.value=S.isCubeTexture&&S.isRenderTargetTexture===!1?-1:1,u.reflectivity.value=m.reflectivity,u.ior.value=m.ior,u.refractionRatio.value=m.refractionRatio),m.lightMap&&(u.lightMap.value=m.lightMap,u.lightMapIntensity.value=m.lightMapIntensity,t(m.lightMap,u.lightMapTransform)),m.aoMap&&(u.aoMap.value=m.aoMap,u.aoMapIntensity.value=m.aoMapIntensity,t(m.aoMap,u.aoMapTransform))}function a(u,m){u.diffuse.value.copy(m.color),u.opacity.value=m.opacity,m.map&&(u.map.value=m.map,t(m.map,u.mapTransform))}function o(u,m){u.dashSize.value=m.dashSize,u.totalSize.value=m.dashSize+m.gapSize,u.scale.value=m.scale}function c(u,m,w,S){u.diffuse.value.copy(m.color),u.opacity.value=m.opacity,u.size.value=m.size*w,u.scale.value=S*.5,m.map&&(u.map.value=m.map,t(m.map,u.uvTransform)),m.alphaMap&&(u.alphaMap.value=m.alphaMap,t(m.alphaMap,u.alphaMapTransform)),m.alphaTest>0&&(u.alphaTest.value=m.alphaTest)}function l(u,m){u.diffuse.value.copy(m.color),u.opacity.value=m.opacity,u.rotation.value=m.rotation,m.map&&(u.map.value=m.map,t(m.map,u.mapTransform)),m.alphaMap&&(u.alphaMap.value=m.alphaMap,t(m.alphaMap,u.alphaMapTransform)),m.alphaTest>0&&(u.alphaTest.value=m.alphaTest)}function h(u,m){u.specular.value.copy(m.specular),u.shininess.value=Math.max(m.shininess,1e-4)}function f(u,m){m.gradientMap&&(u.gradientMap.value=m.gradientMap)}function d(u,m){u.metalness.value=m.metalness,m.metalnessMap&&(u.metalnessMap.value=m.metalnessMap,t(m.metalnessMap,u.metalnessMapTransform)),u.roughness.value=m.roughness,m.roughnessMap&&(u.roughnessMap.value=m.roughnessMap,t(m.roughnessMap,u.roughnessMapTransform)),m.envMap&&(u.envMapIntensity.value=m.envMapIntensity)}function p(u,m,w){u.ior.value=m.ior,m.sheen>0&&(u.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),u.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(u.sheenColorMap.value=m.sheenColorMap,t(m.sheenColorMap,u.sheenColorMapTransform)),m.sheenRoughnessMap&&(u.sheenRoughnessMap.value=m.sheenRoughnessMap,t(m.sheenRoughnessMap,u.sheenRoughnessMapTransform))),m.clearcoat>0&&(u.clearcoat.value=m.clearcoat,u.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(u.clearcoatMap.value=m.clearcoatMap,t(m.clearcoatMap,u.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(u.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,t(m.clearcoatRoughnessMap,u.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(u.clearcoatNormalMap.value=m.clearcoatNormalMap,t(m.clearcoatNormalMap,u.clearcoatNormalMapTransform),u.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===Xt&&u.clearcoatNormalScale.value.negate())),m.dispersion>0&&(u.dispersion.value=m.dispersion),m.iridescence>0&&(u.iridescence.value=m.iridescence,u.iridescenceIOR.value=m.iridescenceIOR,u.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],u.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(u.iridescenceMap.value=m.iridescenceMap,t(m.iridescenceMap,u.iridescenceMapTransform)),m.iridescenceThicknessMap&&(u.iridescenceThicknessMap.value=m.iridescenceThicknessMap,t(m.iridescenceThicknessMap,u.iridescenceThicknessMapTransform))),m.transmission>0&&(u.transmission.value=m.transmission,u.transmissionSamplerMap.value=w.texture,u.transmissionSamplerSize.value.set(w.width,w.height),m.transmissionMap&&(u.transmissionMap.value=m.transmissionMap,t(m.transmissionMap,u.transmissionMapTransform)),u.thickness.value=m.thickness,m.thicknessMap&&(u.thicknessMap.value=m.thicknessMap,t(m.thicknessMap,u.thicknessMapTransform)),u.attenuationDistance.value=m.attenuationDistance,u.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(u.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(u.anisotropyMap.value=m.anisotropyMap,t(m.anisotropyMap,u.anisotropyMapTransform))),u.specularIntensity.value=m.specularIntensity,u.specularColor.value.copy(m.specularColor),m.specularColorMap&&(u.specularColorMap.value=m.specularColorMap,t(m.specularColorMap,u.specularColorMapTransform)),m.specularIntensityMap&&(u.specularIntensityMap.value=m.specularIntensityMap,t(m.specularIntensityMap,u.specularIntensityMapTransform))}function g(u,m){m.matcap&&(u.matcap.value=m.matcap)}function x(u,m){const w=e.get(m).light;u.referencePosition.value.setFromMatrixPosition(w.matrixWorld),u.nearDistance.value=w.shadow.camera.near,u.farDistance.value=w.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function S_(i,e,t,n){let s={},r={},a=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(w,S){const y=S.program;n.uniformBlockBinding(w,y)}function l(w,S){let y=s[w.id];y===void 0&&(g(w),y=h(w),s[w.id]=y,w.addEventListener("dispose",u));const L=S.program;n.updateUBOMapping(w,L);const C=e.render.frame;r[w.id]!==C&&(d(w),r[w.id]=C)}function h(w){const S=f();w.__bindingPointIndex=S;const y=i.createBuffer(),L=w.__size,C=w.usage;return i.bindBuffer(i.UNIFORM_BUFFER,y),i.bufferData(i.UNIFORM_BUFFER,L,C),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,S,y),y}function f(){for(let w=0;w<o;w++)if(a.indexOf(w)===-1)return a.push(w),w;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(w){const S=s[w.id],y=w.uniforms,L=w.__cache;i.bindBuffer(i.UNIFORM_BUFFER,S);for(let C=0,R=y.length;C<R;C++){const z=Array.isArray(y[C])?y[C]:[y[C]];for(let ne=0,_=z.length;ne<_;ne++){const M=z[ne];if(p(M,C,ne,L)===!0){const O=M.__offset,k=Array.isArray(M.value)?M.value:[M.value];let q=0;for(let W=0;W<k.length;W++){const V=k[W],ie=x(V);typeof V=="number"||typeof V=="boolean"?(M.__data[0]=V,i.bufferSubData(i.UNIFORM_BUFFER,O+q,M.__data)):V.isMatrix3?(M.__data[0]=V.elements[0],M.__data[1]=V.elements[1],M.__data[2]=V.elements[2],M.__data[3]=0,M.__data[4]=V.elements[3],M.__data[5]=V.elements[4],M.__data[6]=V.elements[5],M.__data[7]=0,M.__data[8]=V.elements[6],M.__data[9]=V.elements[7],M.__data[10]=V.elements[8],M.__data[11]=0):(V.toArray(M.__data,q),q+=ie.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,O,M.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function p(w,S,y,L){const C=w.value,R=S+"_"+y;if(L[R]===void 0)return typeof C=="number"||typeof C=="boolean"?L[R]=C:L[R]=C.clone(),!0;{const z=L[R];if(typeof C=="number"||typeof C=="boolean"){if(z!==C)return L[R]=C,!0}else if(z.equals(C)===!1)return z.copy(C),!0}return!1}function g(w){const S=w.uniforms;let y=0;const L=16;for(let R=0,z=S.length;R<z;R++){const ne=Array.isArray(S[R])?S[R]:[S[R]];for(let _=0,M=ne.length;_<M;_++){const O=ne[_],k=Array.isArray(O.value)?O.value:[O.value];for(let q=0,W=k.length;q<W;q++){const V=k[q],ie=x(V),K=y%L,me=K%ie.boundary,xe=K+me;y+=me,xe!==0&&L-xe<ie.storage&&(y+=L-xe),O.__data=new Float32Array(ie.storage/Float32Array.BYTES_PER_ELEMENT),O.__offset=y,y+=ie.storage}}}const C=y%L;return C>0&&(y+=L-C),w.__size=y,w.__cache={},this}function x(w){const S={boundary:0,storage:0};return typeof w=="number"||typeof w=="boolean"?(S.boundary=4,S.storage=4):w.isVector2?(S.boundary=8,S.storage=8):w.isVector3||w.isColor?(S.boundary=16,S.storage=12):w.isVector4?(S.boundary=16,S.storage=16):w.isMatrix3?(S.boundary=48,S.storage=48):w.isMatrix4?(S.boundary=64,S.storage=64):w.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",w),S}function u(w){const S=w.target;S.removeEventListener("dispose",u);const y=a.indexOf(S.__bindingPointIndex);a.splice(y,1),i.deleteBuffer(s[S.id]),delete s[S.id],delete r[S.id]}function m(){for(const w in s)i.deleteBuffer(s[w]);a=[],s={},r={}}return{bind:c,update:l,dispose:m}}class ia{constructor(e={}){const{canvas:t=hf(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:f=!1}=e;this.isWebGLRenderer=!0;let d;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");d=n.getContextAttributes().alpha}else d=a;const p=new Uint32Array(4),g=new Int32Array(4);let x=null,u=null;const m=[],w=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=xn,this.toneMapping=Zn,this.toneMappingExposure=1;const S=this;let y=!1,L=0,C=0,R=null,z=-1,ne=null;const _=new vt,M=new vt;let O=null;const k=new je(0);let q=0,W=t.width,V=t.height,ie=1,K=null,me=null;const xe=new vt(0,0,W,V),ve=new vt(0,0,W,V);let se=!1;const le=new uc;let A=!1,I=!1;const X=new at,Y=new at,fe=new D,U=new vt,te={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let ye=!1;function de(){return R===null?ie:1}let E=n;function B(T,H){return t.getContext(T,H)}try{const T={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:f};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${ic}`),t.addEventListener("webglcontextlost",_e,!1),t.addEventListener("webglcontextrestored",Re,!1),t.addEventListener("webglcontextcreationerror",Pe,!1),E===null){const H="webgl2";if(E=B(H,T),E===null)throw B(H)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(T){throw console.error("THREE.WebGLRenderer: "+T.message),T}let ae,pe,ge,De,he,b,v,N,J,ce,oe,Ae,be,we,qe,Me,Ie,He,We,Ue,Ke,Xe,ot,F;function Le(){ae=new R0(E),ae.init(),Xe=new f_(E,ae),pe=new S0(E,ae,e,Xe),ge=new h_(E),pe.reverseDepthBuffer&&ge.buffers.depth.setReversed(!0),De=new P0(E),he=new Yg,b=new u_(E,ae,ge,he,pe,Xe,De),v=new E0(S),N=new A0(S),J=new Ff(E),ot=new y0(E,J),ce=new C0(E,J,De,ot),oe=new D0(E,ce,J,De),We=new I0(E,pe,b),Me=new b0(he),Ae=new $g(S,v,N,ae,pe,ot,Me),be=new M_(S,he),we=new Zg,qe=new i_(ae),He=new x0(S,v,N,ge,oe,d,c),Ie=new c_(S,oe,pe),F=new S_(E,De,pe,ge),Ue=new M0(E,ae,De),Ke=new L0(E,ae,De),De.programs=Ae.programs,S.capabilities=pe,S.extensions=ae,S.properties=he,S.renderLists=we,S.shadowMap=Ie,S.state=ge,S.info=De}Le();const re=new x_(S,E);this.xr=re,this.getContext=function(){return E},this.getContextAttributes=function(){return E.getContextAttributes()},this.forceContextLoss=function(){const T=ae.get("WEBGL_lose_context");T&&T.loseContext()},this.forceContextRestore=function(){const T=ae.get("WEBGL_lose_context");T&&T.restoreContext()},this.getPixelRatio=function(){return ie},this.setPixelRatio=function(T){T!==void 0&&(ie=T,this.setSize(W,V,!1))},this.getSize=function(T){return T.set(W,V)},this.setSize=function(T,H,Z=!0){if(re.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}W=T,V=H,t.width=Math.floor(T*ie),t.height=Math.floor(H*ie),Z===!0&&(t.style.width=T+"px",t.style.height=H+"px"),this.setViewport(0,0,T,H)},this.getDrawingBufferSize=function(T){return T.set(W*ie,V*ie).floor()},this.setDrawingBufferSize=function(T,H,Z){W=T,V=H,ie=Z,t.width=Math.floor(T*Z),t.height=Math.floor(H*Z),this.setViewport(0,0,T,H)},this.getCurrentViewport=function(T){return T.copy(_)},this.getViewport=function(T){return T.copy(xe)},this.setViewport=function(T,H,Z,Q){T.isVector4?xe.set(T.x,T.y,T.z,T.w):xe.set(T,H,Z,Q),ge.viewport(_.copy(xe).multiplyScalar(ie).round())},this.getScissor=function(T){return T.copy(ve)},this.setScissor=function(T,H,Z,Q){T.isVector4?ve.set(T.x,T.y,T.z,T.w):ve.set(T,H,Z,Q),ge.scissor(M.copy(ve).multiplyScalar(ie).round())},this.getScissorTest=function(){return se},this.setScissorTest=function(T){ge.setScissorTest(se=T)},this.setOpaqueSort=function(T){K=T},this.setTransparentSort=function(T){me=T},this.getClearColor=function(T){return T.copy(He.getClearColor())},this.setClearColor=function(){He.setClearColor.apply(He,arguments)},this.getClearAlpha=function(){return He.getClearAlpha()},this.setClearAlpha=function(){He.setClearAlpha.apply(He,arguments)},this.clear=function(T=!0,H=!0,Z=!0){let Q=0;if(T){let G=!1;if(R!==null){const Se=R.texture.format;G=Se===lc||Se===cc||Se===oc}if(G){const Se=R.texture.type,Ce=Se===zn||Se===Mi||Se===Ps||Se===ss||Se===rc||Se===ac,Ne=He.getClearColor(),Oe=He.getClearAlpha(),Ge=Ne.r,Ve=Ne.g,ze=Ne.b;Ce?(p[0]=Ge,p[1]=Ve,p[2]=ze,p[3]=Oe,E.clearBufferuiv(E.COLOR,0,p)):(g[0]=Ge,g[1]=Ve,g[2]=ze,g[3]=Oe,E.clearBufferiv(E.COLOR,0,g))}else Q|=E.COLOR_BUFFER_BIT}H&&(Q|=E.DEPTH_BUFFER_BIT,E.clearDepth(this.capabilities.reverseDepthBuffer?0:1)),Z&&(Q|=E.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),E.clear(Q)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",_e,!1),t.removeEventListener("webglcontextrestored",Re,!1),t.removeEventListener("webglcontextcreationerror",Pe,!1),we.dispose(),qe.dispose(),he.dispose(),v.dispose(),N.dispose(),oe.dispose(),ot.dispose(),F.dispose(),Ae.dispose(),re.dispose(),re.removeEventListener("sessionstart",Rc),re.removeEventListener("sessionend",Cc),ii.stop()};function _e(T){T.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),y=!0}function Re(){console.log("THREE.WebGLRenderer: Context Restored."),y=!1;const T=De.autoReset,H=Ie.enabled,Z=Ie.autoUpdate,Q=Ie.needsUpdate,G=Ie.type;Le(),De.autoReset=T,Ie.enabled=H,Ie.autoUpdate=Z,Ie.needsUpdate=Q,Ie.type=G}function Pe(T){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",T.statusMessage)}function Ze(T){const H=T.target;H.removeEventListener("dispose",Ze),Mt(H)}function Mt(T){Ht(T),he.remove(T)}function Ht(T){const H=he.get(T).programs;H!==void 0&&(H.forEach(function(Z){Ae.releaseProgram(Z)}),T.isShaderMaterial&&Ae.releaseShaderCache(T))}this.renderBufferDirect=function(T,H,Z,Q,G,Se){H===null&&(H=te);const Ce=G.isMesh&&G.matrixWorld.determinant()<0,Ne=Ld(T,H,Z,Q,G);ge.setMaterial(Q,Ce);let Oe=Z.index,Ge=1;if(Q.wireframe===!0){if(Oe=ce.getWireframeAttribute(Z),Oe===void 0)return;Ge=2}const Ve=Z.drawRange,ze=Z.attributes.position;let nt=Ve.start*Ge,lt=(Ve.start+Ve.count)*Ge;Se!==null&&(nt=Math.max(nt,Se.start*Ge),lt=Math.min(lt,(Se.start+Se.count)*Ge)),Oe!==null?(nt=Math.max(nt,0),lt=Math.min(lt,Oe.count)):ze!=null&&(nt=Math.max(nt,0),lt=Math.min(lt,ze.count));const gt=lt-nt;if(gt<0||gt===1/0)return;ot.setup(G,Q,Ne,Z,Oe);let qt,Qe=Ue;if(Oe!==null&&(qt=J.get(Oe),Qe=Ke,Qe.setIndex(qt)),G.isMesh)Q.wireframe===!0?(ge.setLineWidth(Q.wireframeLinewidth*de()),Qe.setMode(E.LINES)):Qe.setMode(E.TRIANGLES);else if(G.isLine){let Fe=Q.linewidth;Fe===void 0&&(Fe=1),ge.setLineWidth(Fe*de()),G.isLineSegments?Qe.setMode(E.LINES):G.isLineLoop?Qe.setMode(E.LINE_LOOP):Qe.setMode(E.LINE_STRIP)}else G.isPoints?Qe.setMode(E.POINTS):G.isSprite&&Qe.setMode(E.TRIANGLES);if(G.isBatchedMesh)if(G._multiDrawInstances!==null)Qe.renderMultiDrawInstances(G._multiDrawStarts,G._multiDrawCounts,G._multiDrawCount,G._multiDrawInstances);else if(ae.get("WEBGL_multi_draw"))Qe.renderMultiDraw(G._multiDrawStarts,G._multiDrawCounts,G._multiDrawCount);else{const Fe=G._multiDrawStarts,Pt=G._multiDrawCounts,et=G._multiDrawCount,an=Oe?J.get(Oe).bytesPerElement:1,Ci=he.get(Q).currentProgram.getUniforms();for(let $t=0;$t<et;$t++)Ci.setValue(E,"_gl_DrawID",$t),Qe.render(Fe[$t]/an,Pt[$t])}else if(G.isInstancedMesh)Qe.renderInstances(nt,gt,G.count);else if(Z.isInstancedBufferGeometry){const Fe=Z._maxInstanceCount!==void 0?Z._maxInstanceCount:1/0,Pt=Math.min(Z.instanceCount,Fe);Qe.renderInstances(nt,gt,Pt)}else Qe.render(nt,gt)};function Je(T,H,Z){T.transparent===!0&&T.side===jt&&T.forceSinglePass===!1?(T.side=Xt,T.needsUpdate=!0,js(T,H,Z),T.side=Qn,T.needsUpdate=!0,js(T,H,Z),T.side=jt):js(T,H,Z)}this.compile=function(T,H,Z=null){Z===null&&(Z=T),u=qe.get(Z),u.init(H),w.push(u),Z.traverseVisible(function(G){G.isLight&&G.layers.test(H.layers)&&(u.pushLight(G),G.castShadow&&u.pushShadow(G))}),T!==Z&&T.traverseVisible(function(G){G.isLight&&G.layers.test(H.layers)&&(u.pushLight(G),G.castShadow&&u.pushShadow(G))}),u.setupLights();const Q=new Set;return T.traverse(function(G){if(!(G.isMesh||G.isPoints||G.isLine||G.isSprite))return;const Se=G.material;if(Se)if(Array.isArray(Se))for(let Ce=0;Ce<Se.length;Ce++){const Ne=Se[Ce];Je(Ne,Z,G),Q.add(Ne)}else Je(Se,Z,G),Q.add(Se)}),w.pop(),u=null,Q},this.compileAsync=function(T,H,Z=null){const Q=this.compile(T,H,Z);return new Promise(G=>{function Se(){if(Q.forEach(function(Ce){he.get(Ce).currentProgram.isReady()&&Q.delete(Ce)}),Q.size===0){G(T);return}setTimeout(Se,10)}ae.get("KHR_parallel_shader_compile")!==null?Se():setTimeout(Se,10)})};let Gt=null;function bn(T){Gt&&Gt(T)}function Rc(){ii.stop()}function Cc(){ii.start()}const ii=new nd;ii.setAnimationLoop(bn),typeof self<"u"&&ii.setContext(self),this.setAnimationLoop=function(T){Gt=T,re.setAnimationLoop(T),T===null?ii.stop():ii.start()},re.addEventListener("sessionstart",Rc),re.addEventListener("sessionend",Cc),this.render=function(T,H){if(H!==void 0&&H.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(y===!0)return;if(T.matrixWorldAutoUpdate===!0&&T.updateMatrixWorld(),H.parent===null&&H.matrixWorldAutoUpdate===!0&&H.updateMatrixWorld(),re.enabled===!0&&re.isPresenting===!0&&(re.cameraAutoUpdate===!0&&re.updateCamera(H),H=re.getCamera()),T.isScene===!0&&T.onBeforeRender(S,T,H,R),u=qe.get(T,w.length),u.init(H),w.push(u),Y.multiplyMatrices(H.projectionMatrix,H.matrixWorldInverse),le.setFromProjectionMatrix(Y),I=this.localClippingEnabled,A=Me.init(this.clippingPlanes,I),x=we.get(T,m.length),x.init(),m.push(x),re.enabled===!0&&re.isPresenting===!0){const Se=S.xr.getDepthSensingMesh();Se!==null&&ha(Se,H,-1/0,S.sortObjects)}ha(T,H,0,S.sortObjects),x.finish(),S.sortObjects===!0&&x.sort(K,me),ye=re.enabled===!1||re.isPresenting===!1||re.hasDepthSensing()===!1,ye&&He.addToRenderList(x,T),this.info.render.frame++,A===!0&&Me.beginShadows();const Z=u.state.shadowsArray;Ie.render(Z,T,H),A===!0&&Me.endShadows(),this.info.autoReset===!0&&this.info.reset();const Q=x.opaque,G=x.transmissive;if(u.setupLights(),H.isArrayCamera){const Se=H.cameras;if(G.length>0)for(let Ce=0,Ne=Se.length;Ce<Ne;Ce++){const Oe=Se[Ce];Pc(Q,G,T,Oe)}ye&&He.render(T);for(let Ce=0,Ne=Se.length;Ce<Ne;Ce++){const Oe=Se[Ce];Lc(x,T,Oe,Oe.viewport)}}else G.length>0&&Pc(Q,G,T,H),ye&&He.render(T),Lc(x,T,H);R!==null&&(b.updateMultisampleRenderTarget(R),b.updateRenderTargetMipmap(R)),T.isScene===!0&&T.onAfterRender(S,T,H),ot.resetDefaultState(),z=-1,ne=null,w.pop(),w.length>0?(u=w[w.length-1],A===!0&&Me.setGlobalState(S.clippingPlanes,u.state.camera)):u=null,m.pop(),m.length>0?x=m[m.length-1]:x=null};function ha(T,H,Z,Q){if(T.visible===!1)return;if(T.layers.test(H.layers)){if(T.isGroup)Z=T.renderOrder;else if(T.isLOD)T.autoUpdate===!0&&T.update(H);else if(T.isLight)u.pushLight(T),T.castShadow&&u.pushShadow(T);else if(T.isSprite){if(!T.frustumCulled||le.intersectsSprite(T)){Q&&U.setFromMatrixPosition(T.matrixWorld).applyMatrix4(Y);const Ce=oe.update(T),Ne=T.material;Ne.visible&&x.push(T,Ce,Ne,Z,U.z,null)}}else if((T.isMesh||T.isLine||T.isPoints)&&(!T.frustumCulled||le.intersectsObject(T))){const Ce=oe.update(T),Ne=T.material;if(Q&&(T.boundingSphere!==void 0?(T.boundingSphere===null&&T.computeBoundingSphere(),U.copy(T.boundingSphere.center)):(Ce.boundingSphere===null&&Ce.computeBoundingSphere(),U.copy(Ce.boundingSphere.center)),U.applyMatrix4(T.matrixWorld).applyMatrix4(Y)),Array.isArray(Ne)){const Oe=Ce.groups;for(let Ge=0,Ve=Oe.length;Ge<Ve;Ge++){const ze=Oe[Ge],nt=Ne[ze.materialIndex];nt&&nt.visible&&x.push(T,Ce,nt,Z,U.z,ze)}}else Ne.visible&&x.push(T,Ce,Ne,Z,U.z,null)}}const Se=T.children;for(let Ce=0,Ne=Se.length;Ce<Ne;Ce++)ha(Se[Ce],H,Z,Q)}function Lc(T,H,Z,Q){const G=T.opaque,Se=T.transmissive,Ce=T.transparent;u.setupLightsView(Z),A===!0&&Me.setGlobalState(S.clippingPlanes,Z),Q&&ge.viewport(_.copy(Q)),G.length>0&&Ws(G,H,Z),Se.length>0&&Ws(Se,H,Z),Ce.length>0&&Ws(Ce,H,Z),ge.buffers.depth.setTest(!0),ge.buffers.depth.setMask(!0),ge.buffers.color.setMask(!0),ge.setPolygonOffset(!1)}function Pc(T,H,Z,Q){if((Z.isScene===!0?Z.overrideMaterial:null)!==null)return;u.state.transmissionRenderTarget[Q.id]===void 0&&(u.state.transmissionRenderTarget[Q.id]=new Si(1,1,{generateMipmaps:!0,type:ae.has("EXT_color_buffer_half_float")||ae.has("EXT_color_buffer_float")?Fs:zn,minFilter:xi,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:tt.workingColorSpace}));const Se=u.state.transmissionRenderTarget[Q.id],Ce=Q.viewport||_;Se.setSize(Ce.z,Ce.w);const Ne=S.getRenderTarget();S.setRenderTarget(Se),S.getClearColor(k),q=S.getClearAlpha(),q<1&&S.setClearColor(16777215,.5),S.clear(),ye&&He.render(Z);const Oe=S.toneMapping;S.toneMapping=Zn;const Ge=Q.viewport;if(Q.viewport!==void 0&&(Q.viewport=void 0),u.setupLightsView(Q),A===!0&&Me.setGlobalState(S.clippingPlanes,Q),Ws(T,Z,Q),b.updateMultisampleRenderTarget(Se),b.updateRenderTargetMipmap(Se),ae.has("WEBGL_multisampled_render_to_texture")===!1){let Ve=!1;for(let ze=0,nt=H.length;ze<nt;ze++){const lt=H[ze],gt=lt.object,qt=lt.geometry,Qe=lt.material,Fe=lt.group;if(Qe.side===jt&&gt.layers.test(Q.layers)){const Pt=Qe.side;Qe.side=Xt,Qe.needsUpdate=!0,Ic(gt,Z,Q,qt,Qe,Fe),Qe.side=Pt,Qe.needsUpdate=!0,Ve=!0}}Ve===!0&&(b.updateMultisampleRenderTarget(Se),b.updateRenderTargetMipmap(Se))}S.setRenderTarget(Ne),S.setClearColor(k,q),Ge!==void 0&&(Q.viewport=Ge),S.toneMapping=Oe}function Ws(T,H,Z){const Q=H.isScene===!0?H.overrideMaterial:null;for(let G=0,Se=T.length;G<Se;G++){const Ce=T[G],Ne=Ce.object,Oe=Ce.geometry,Ge=Q===null?Ce.material:Q,Ve=Ce.group;Ne.layers.test(Z.layers)&&Ic(Ne,H,Z,Oe,Ge,Ve)}}function Ic(T,H,Z,Q,G,Se){T.onBeforeRender(S,H,Z,Q,G,Se),T.modelViewMatrix.multiplyMatrices(Z.matrixWorldInverse,T.matrixWorld),T.normalMatrix.getNormalMatrix(T.modelViewMatrix),G.onBeforeRender(S,H,Z,Q,T,Se),G.transparent===!0&&G.side===jt&&G.forceSinglePass===!1?(G.side=Xt,G.needsUpdate=!0,S.renderBufferDirect(Z,H,Q,G,T,Se),G.side=Qn,G.needsUpdate=!0,S.renderBufferDirect(Z,H,Q,G,T,Se),G.side=jt):S.renderBufferDirect(Z,H,Q,G,T,Se),T.onAfterRender(S,H,Z,Q,G,Se)}function js(T,H,Z){H.isScene!==!0&&(H=te);const Q=he.get(T),G=u.state.lights,Se=u.state.shadowsArray,Ce=G.state.version,Ne=Ae.getParameters(T,G.state,Se,H,Z),Oe=Ae.getProgramCacheKey(Ne);let Ge=Q.programs;Q.environment=T.isMeshStandardMaterial?H.environment:null,Q.fog=H.fog,Q.envMap=(T.isMeshStandardMaterial?N:v).get(T.envMap||Q.environment),Q.envMapRotation=Q.environment!==null&&T.envMap===null?H.environmentRotation:T.envMapRotation,Ge===void 0&&(T.addEventListener("dispose",Ze),Ge=new Map,Q.programs=Ge);let Ve=Ge.get(Oe);if(Ve!==void 0){if(Q.currentProgram===Ve&&Q.lightsStateVersion===Ce)return Uc(T,Ne),Ve}else Ne.uniforms=Ae.getUniforms(T),T.onBeforeCompile(Ne,S),Ve=Ae.acquireProgram(Ne,Oe),Ge.set(Oe,Ve),Q.uniforms=Ne.uniforms;const ze=Q.uniforms;return(!T.isShaderMaterial&&!T.isRawShaderMaterial||T.clipping===!0)&&(ze.clippingPlanes=Me.uniform),Uc(T,Ne),Q.needsLights=Id(T),Q.lightsStateVersion=Ce,Q.needsLights&&(ze.ambientLightColor.value=G.state.ambient,ze.lightProbe.value=G.state.probe,ze.directionalLights.value=G.state.directional,ze.directionalLightShadows.value=G.state.directionalShadow,ze.spotLights.value=G.state.spot,ze.spotLightShadows.value=G.state.spotShadow,ze.rectAreaLights.value=G.state.rectArea,ze.ltc_1.value=G.state.rectAreaLTC1,ze.ltc_2.value=G.state.rectAreaLTC2,ze.pointLights.value=G.state.point,ze.pointLightShadows.value=G.state.pointShadow,ze.hemisphereLights.value=G.state.hemi,ze.directionalShadowMap.value=G.state.directionalShadowMap,ze.directionalShadowMatrix.value=G.state.directionalShadowMatrix,ze.spotShadowMap.value=G.state.spotShadowMap,ze.spotLightMatrix.value=G.state.spotLightMatrix,ze.spotLightMap.value=G.state.spotLightMap,ze.pointShadowMap.value=G.state.pointShadowMap,ze.pointShadowMatrix.value=G.state.pointShadowMatrix),Q.currentProgram=Ve,Q.uniformsList=null,Ve}function Dc(T){if(T.uniformsList===null){const H=T.currentProgram.getUniforms();T.uniformsList=Pr.seqWithValue(H.seq,T.uniforms)}return T.uniformsList}function Uc(T,H){const Z=he.get(T);Z.outputColorSpace=H.outputColorSpace,Z.batching=H.batching,Z.batchingColor=H.batchingColor,Z.instancing=H.instancing,Z.instancingColor=H.instancingColor,Z.instancingMorph=H.instancingMorph,Z.skinning=H.skinning,Z.morphTargets=H.morphTargets,Z.morphNormals=H.morphNormals,Z.morphColors=H.morphColors,Z.morphTargetsCount=H.morphTargetsCount,Z.numClippingPlanes=H.numClippingPlanes,Z.numIntersection=H.numClipIntersection,Z.vertexAlphas=H.vertexAlphas,Z.vertexTangents=H.vertexTangents,Z.toneMapping=H.toneMapping}function Ld(T,H,Z,Q,G){H.isScene!==!0&&(H=te),b.resetTextureUnits();const Se=H.fog,Ce=Q.isMeshStandardMaterial?H.environment:null,Ne=R===null?S.outputColorSpace:R.isXRRenderTarget===!0?R.texture.colorSpace:ni,Oe=(Q.isMeshStandardMaterial?N:v).get(Q.envMap||Ce),Ge=Q.vertexColors===!0&&!!Z.attributes.color&&Z.attributes.color.itemSize===4,Ve=!!Z.attributes.tangent&&(!!Q.normalMap||Q.anisotropy>0),ze=!!Z.morphAttributes.position,nt=!!Z.morphAttributes.normal,lt=!!Z.morphAttributes.color;let gt=Zn;Q.toneMapped&&(R===null||R.isXRRenderTarget===!0)&&(gt=S.toneMapping);const qt=Z.morphAttributes.position||Z.morphAttributes.normal||Z.morphAttributes.color,Qe=qt!==void 0?qt.length:0,Fe=he.get(Q),Pt=u.state.lights;if(A===!0&&(I===!0||T!==ne)){const Jt=T===ne&&Q.id===z;Me.setState(Q,T,Jt)}let et=!1;Q.version===Fe.__version?(Fe.needsLights&&Fe.lightsStateVersion!==Pt.state.version||Fe.outputColorSpace!==Ne||G.isBatchedMesh&&Fe.batching===!1||!G.isBatchedMesh&&Fe.batching===!0||G.isBatchedMesh&&Fe.batchingColor===!0&&G.colorTexture===null||G.isBatchedMesh&&Fe.batchingColor===!1&&G.colorTexture!==null||G.isInstancedMesh&&Fe.instancing===!1||!G.isInstancedMesh&&Fe.instancing===!0||G.isSkinnedMesh&&Fe.skinning===!1||!G.isSkinnedMesh&&Fe.skinning===!0||G.isInstancedMesh&&Fe.instancingColor===!0&&G.instanceColor===null||G.isInstancedMesh&&Fe.instancingColor===!1&&G.instanceColor!==null||G.isInstancedMesh&&Fe.instancingMorph===!0&&G.morphTexture===null||G.isInstancedMesh&&Fe.instancingMorph===!1&&G.morphTexture!==null||Fe.envMap!==Oe||Q.fog===!0&&Fe.fog!==Se||Fe.numClippingPlanes!==void 0&&(Fe.numClippingPlanes!==Me.numPlanes||Fe.numIntersection!==Me.numIntersection)||Fe.vertexAlphas!==Ge||Fe.vertexTangents!==Ve||Fe.morphTargets!==ze||Fe.morphNormals!==nt||Fe.morphColors!==lt||Fe.toneMapping!==gt||Fe.morphTargetsCount!==Qe)&&(et=!0):(et=!0,Fe.__version=Q.version);let an=Fe.currentProgram;et===!0&&(an=js(Q,H,G));let Ci=!1,$t=!1,da=!1;const yt=an.getUniforms(),Bn=Fe.uniforms;if(ge.useProgram(an.program)&&(Ci=!0,$t=!0,da=!0),Q.id!==z&&(z=Q.id,$t=!0),Ci||ne!==T){pe.reverseDepthBuffer?(X.copy(T.projectionMatrix),uf(X),ff(X),yt.setValue(E,"projectionMatrix",X)):yt.setValue(E,"projectionMatrix",T.projectionMatrix),yt.setValue(E,"viewMatrix",T.matrixWorldInverse);const Jt=yt.map.cameraPosition;Jt!==void 0&&Jt.setValue(E,fe.setFromMatrixPosition(T.matrixWorld)),pe.logarithmicDepthBuffer&&yt.setValue(E,"logDepthBufFC",2/(Math.log(T.far+1)/Math.LN2)),(Q.isMeshPhongMaterial||Q.isMeshToonMaterial||Q.isMeshLambertMaterial||Q.isMeshBasicMaterial||Q.isMeshStandardMaterial||Q.isShaderMaterial)&&yt.setValue(E,"isOrthographic",T.isOrthographicCamera===!0),ne!==T&&(ne=T,$t=!0,da=!0)}if(G.isSkinnedMesh){yt.setOptional(E,G,"bindMatrix"),yt.setOptional(E,G,"bindMatrixInverse");const Jt=G.skeleton;Jt&&(Jt.boneTexture===null&&Jt.computeBoneTexture(),yt.setValue(E,"boneTexture",Jt.boneTexture,b))}G.isBatchedMesh&&(yt.setOptional(E,G,"batchingTexture"),yt.setValue(E,"batchingTexture",G._matricesTexture,b),yt.setOptional(E,G,"batchingIdTexture"),yt.setValue(E,"batchingIdTexture",G._indirectTexture,b),yt.setOptional(E,G,"batchingColorTexture"),G._colorsTexture!==null&&yt.setValue(E,"batchingColorTexture",G._colorsTexture,b));const ua=Z.morphAttributes;if((ua.position!==void 0||ua.normal!==void 0||ua.color!==void 0)&&We.update(G,Z,an),($t||Fe.receiveShadow!==G.receiveShadow)&&(Fe.receiveShadow=G.receiveShadow,yt.setValue(E,"receiveShadow",G.receiveShadow)),Q.isMeshGouraudMaterial&&Q.envMap!==null&&(Bn.envMap.value=Oe,Bn.flipEnvMap.value=Oe.isCubeTexture&&Oe.isRenderTargetTexture===!1?-1:1),Q.isMeshStandardMaterial&&Q.envMap===null&&H.environment!==null&&(Bn.envMapIntensity.value=H.environmentIntensity),$t&&(yt.setValue(E,"toneMappingExposure",S.toneMappingExposure),Fe.needsLights&&Pd(Bn,da),Se&&Q.fog===!0&&be.refreshFogUniforms(Bn,Se),be.refreshMaterialUniforms(Bn,Q,ie,V,u.state.transmissionRenderTarget[T.id]),Pr.upload(E,Dc(Fe),Bn,b)),Q.isShaderMaterial&&Q.uniformsNeedUpdate===!0&&(Pr.upload(E,Dc(Fe),Bn,b),Q.uniformsNeedUpdate=!1),Q.isSpriteMaterial&&yt.setValue(E,"center",G.center),yt.setValue(E,"modelViewMatrix",G.modelViewMatrix),yt.setValue(E,"normalMatrix",G.normalMatrix),yt.setValue(E,"modelMatrix",G.matrixWorld),Q.isShaderMaterial||Q.isRawShaderMaterial){const Jt=Q.uniformsGroups;for(let fa=0,Dd=Jt.length;fa<Dd;fa++){const Nc=Jt[fa];F.update(Nc,an),F.bind(Nc,an)}}return an}function Pd(T,H){T.ambientLightColor.needsUpdate=H,T.lightProbe.needsUpdate=H,T.directionalLights.needsUpdate=H,T.directionalLightShadows.needsUpdate=H,T.pointLights.needsUpdate=H,T.pointLightShadows.needsUpdate=H,T.spotLights.needsUpdate=H,T.spotLightShadows.needsUpdate=H,T.rectAreaLights.needsUpdate=H,T.hemisphereLights.needsUpdate=H}function Id(T){return T.isMeshLambertMaterial||T.isMeshToonMaterial||T.isMeshPhongMaterial||T.isMeshStandardMaterial||T.isShadowMaterial||T.isShaderMaterial&&T.lights===!0}this.getActiveCubeFace=function(){return L},this.getActiveMipmapLevel=function(){return C},this.getRenderTarget=function(){return R},this.setRenderTargetTextures=function(T,H,Z){he.get(T.texture).__webglTexture=H,he.get(T.depthTexture).__webglTexture=Z;const Q=he.get(T);Q.__hasExternalTextures=!0,Q.__autoAllocateDepthBuffer=Z===void 0,Q.__autoAllocateDepthBuffer||ae.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),Q.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(T,H){const Z=he.get(T);Z.__webglFramebuffer=H,Z.__useDefaultFramebuffer=H===void 0},this.setRenderTarget=function(T,H=0,Z=0){R=T,L=H,C=Z;let Q=!0,G=null,Se=!1,Ce=!1;if(T){const Oe=he.get(T);if(Oe.__useDefaultFramebuffer!==void 0)ge.bindFramebuffer(E.FRAMEBUFFER,null),Q=!1;else if(Oe.__webglFramebuffer===void 0)b.setupRenderTarget(T);else if(Oe.__hasExternalTextures)b.rebindTextures(T,he.get(T.texture).__webglTexture,he.get(T.depthTexture).__webglTexture);else if(T.depthBuffer){const ze=T.depthTexture;if(Oe.__boundDepthTexture!==ze){if(ze!==null&&he.has(ze)&&(T.width!==ze.image.width||T.height!==ze.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");b.setupDepthRenderbuffer(T)}}const Ge=T.texture;(Ge.isData3DTexture||Ge.isDataArrayTexture||Ge.isCompressedArrayTexture)&&(Ce=!0);const Ve=he.get(T).__webglFramebuffer;T.isWebGLCubeRenderTarget?(Array.isArray(Ve[H])?G=Ve[H][Z]:G=Ve[H],Se=!0):T.samples>0&&b.useMultisampledRTT(T)===!1?G=he.get(T).__webglMultisampledFramebuffer:Array.isArray(Ve)?G=Ve[Z]:G=Ve,_.copy(T.viewport),M.copy(T.scissor),O=T.scissorTest}else _.copy(xe).multiplyScalar(ie).floor(),M.copy(ve).multiplyScalar(ie).floor(),O=se;if(ge.bindFramebuffer(E.FRAMEBUFFER,G)&&Q&&ge.drawBuffers(T,G),ge.viewport(_),ge.scissor(M),ge.setScissorTest(O),Se){const Oe=he.get(T.texture);E.framebufferTexture2D(E.FRAMEBUFFER,E.COLOR_ATTACHMENT0,E.TEXTURE_CUBE_MAP_POSITIVE_X+H,Oe.__webglTexture,Z)}else if(Ce){const Oe=he.get(T.texture),Ge=H||0;E.framebufferTextureLayer(E.FRAMEBUFFER,E.COLOR_ATTACHMENT0,Oe.__webglTexture,Z||0,Ge)}z=-1},this.readRenderTargetPixels=function(T,H,Z,Q,G,Se,Ce){if(!(T&&T.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ne=he.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&Ce!==void 0&&(Ne=Ne[Ce]),Ne){ge.bindFramebuffer(E.FRAMEBUFFER,Ne);try{const Oe=T.texture,Ge=Oe.format,Ve=Oe.type;if(!pe.textureFormatReadable(Ge)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!pe.textureTypeReadable(Ve)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}H>=0&&H<=T.width-Q&&Z>=0&&Z<=T.height-G&&E.readPixels(H,Z,Q,G,Xe.convert(Ge),Xe.convert(Ve),Se)}finally{const Oe=R!==null?he.get(R).__webglFramebuffer:null;ge.bindFramebuffer(E.FRAMEBUFFER,Oe)}}},this.readRenderTargetPixelsAsync=async function(T,H,Z,Q,G,Se,Ce){if(!(T&&T.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ne=he.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&Ce!==void 0&&(Ne=Ne[Ce]),Ne){const Oe=T.texture,Ge=Oe.format,Ve=Oe.type;if(!pe.textureFormatReadable(Ge))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!pe.textureTypeReadable(Ve))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(H>=0&&H<=T.width-Q&&Z>=0&&Z<=T.height-G){ge.bindFramebuffer(E.FRAMEBUFFER,Ne);const ze=E.createBuffer();E.bindBuffer(E.PIXEL_PACK_BUFFER,ze),E.bufferData(E.PIXEL_PACK_BUFFER,Se.byteLength,E.STREAM_READ),E.readPixels(H,Z,Q,G,Xe.convert(Ge),Xe.convert(Ve),0);const nt=R!==null?he.get(R).__webglFramebuffer:null;ge.bindFramebuffer(E.FRAMEBUFFER,nt);const lt=E.fenceSync(E.SYNC_GPU_COMMANDS_COMPLETE,0);return E.flush(),await df(E,lt,4),E.bindBuffer(E.PIXEL_PACK_BUFFER,ze),E.getBufferSubData(E.PIXEL_PACK_BUFFER,0,Se),E.deleteBuffer(ze),E.deleteSync(lt),Se}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(T,H=null,Z=0){T.isTexture!==!0&&(Lr("WebGLRenderer: copyFramebufferToTexture function signature has changed."),H=arguments[0]||null,T=arguments[1]);const Q=Math.pow(2,-Z),G=Math.floor(T.image.width*Q),Se=Math.floor(T.image.height*Q),Ce=H!==null?H.x:0,Ne=H!==null?H.y:0;b.setTexture2D(T,0),E.copyTexSubImage2D(E.TEXTURE_2D,Z,0,0,Ce,Ne,G,Se),ge.unbindTexture()},this.copyTextureToTexture=function(T,H,Z=null,Q=null,G=0){T.isTexture!==!0&&(Lr("WebGLRenderer: copyTextureToTexture function signature has changed."),Q=arguments[0]||null,T=arguments[1],H=arguments[2],G=arguments[3]||0,Z=null);let Se,Ce,Ne,Oe,Ge,Ve;Z!==null?(Se=Z.max.x-Z.min.x,Ce=Z.max.y-Z.min.y,Ne=Z.min.x,Oe=Z.min.y):(Se=T.image.width,Ce=T.image.height,Ne=0,Oe=0),Q!==null?(Ge=Q.x,Ve=Q.y):(Ge=0,Ve=0);const ze=Xe.convert(H.format),nt=Xe.convert(H.type);b.setTexture2D(H,0),E.pixelStorei(E.UNPACK_FLIP_Y_WEBGL,H.flipY),E.pixelStorei(E.UNPACK_PREMULTIPLY_ALPHA_WEBGL,H.premultiplyAlpha),E.pixelStorei(E.UNPACK_ALIGNMENT,H.unpackAlignment);const lt=E.getParameter(E.UNPACK_ROW_LENGTH),gt=E.getParameter(E.UNPACK_IMAGE_HEIGHT),qt=E.getParameter(E.UNPACK_SKIP_PIXELS),Qe=E.getParameter(E.UNPACK_SKIP_ROWS),Fe=E.getParameter(E.UNPACK_SKIP_IMAGES),Pt=T.isCompressedTexture?T.mipmaps[G]:T.image;E.pixelStorei(E.UNPACK_ROW_LENGTH,Pt.width),E.pixelStorei(E.UNPACK_IMAGE_HEIGHT,Pt.height),E.pixelStorei(E.UNPACK_SKIP_PIXELS,Ne),E.pixelStorei(E.UNPACK_SKIP_ROWS,Oe),T.isDataTexture?E.texSubImage2D(E.TEXTURE_2D,G,Ge,Ve,Se,Ce,ze,nt,Pt.data):T.isCompressedTexture?E.compressedTexSubImage2D(E.TEXTURE_2D,G,Ge,Ve,Pt.width,Pt.height,ze,Pt.data):E.texSubImage2D(E.TEXTURE_2D,G,Ge,Ve,Se,Ce,ze,nt,Pt),E.pixelStorei(E.UNPACK_ROW_LENGTH,lt),E.pixelStorei(E.UNPACK_IMAGE_HEIGHT,gt),E.pixelStorei(E.UNPACK_SKIP_PIXELS,qt),E.pixelStorei(E.UNPACK_SKIP_ROWS,Qe),E.pixelStorei(E.UNPACK_SKIP_IMAGES,Fe),G===0&&H.generateMipmaps&&E.generateMipmap(E.TEXTURE_2D),ge.unbindTexture()},this.copyTextureToTexture3D=function(T,H,Z=null,Q=null,G=0){T.isTexture!==!0&&(Lr("WebGLRenderer: copyTextureToTexture3D function signature has changed."),Z=arguments[0]||null,Q=arguments[1]||null,T=arguments[2],H=arguments[3],G=arguments[4]||0);let Se,Ce,Ne,Oe,Ge,Ve,ze,nt,lt;const gt=T.isCompressedTexture?T.mipmaps[G]:T.image;Z!==null?(Se=Z.max.x-Z.min.x,Ce=Z.max.y-Z.min.y,Ne=Z.max.z-Z.min.z,Oe=Z.min.x,Ge=Z.min.y,Ve=Z.min.z):(Se=gt.width,Ce=gt.height,Ne=gt.depth,Oe=0,Ge=0,Ve=0),Q!==null?(ze=Q.x,nt=Q.y,lt=Q.z):(ze=0,nt=0,lt=0);const qt=Xe.convert(H.format),Qe=Xe.convert(H.type);let Fe;if(H.isData3DTexture)b.setTexture3D(H,0),Fe=E.TEXTURE_3D;else if(H.isDataArrayTexture||H.isCompressedArrayTexture)b.setTexture2DArray(H,0),Fe=E.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}E.pixelStorei(E.UNPACK_FLIP_Y_WEBGL,H.flipY),E.pixelStorei(E.UNPACK_PREMULTIPLY_ALPHA_WEBGL,H.premultiplyAlpha),E.pixelStorei(E.UNPACK_ALIGNMENT,H.unpackAlignment);const Pt=E.getParameter(E.UNPACK_ROW_LENGTH),et=E.getParameter(E.UNPACK_IMAGE_HEIGHT),an=E.getParameter(E.UNPACK_SKIP_PIXELS),Ci=E.getParameter(E.UNPACK_SKIP_ROWS),$t=E.getParameter(E.UNPACK_SKIP_IMAGES);E.pixelStorei(E.UNPACK_ROW_LENGTH,gt.width),E.pixelStorei(E.UNPACK_IMAGE_HEIGHT,gt.height),E.pixelStorei(E.UNPACK_SKIP_PIXELS,Oe),E.pixelStorei(E.UNPACK_SKIP_ROWS,Ge),E.pixelStorei(E.UNPACK_SKIP_IMAGES,Ve),T.isDataTexture||T.isData3DTexture?E.texSubImage3D(Fe,G,ze,nt,lt,Se,Ce,Ne,qt,Qe,gt.data):H.isCompressedArrayTexture?E.compressedTexSubImage3D(Fe,G,ze,nt,lt,Se,Ce,Ne,qt,gt.data):E.texSubImage3D(Fe,G,ze,nt,lt,Se,Ce,Ne,qt,Qe,gt),E.pixelStorei(E.UNPACK_ROW_LENGTH,Pt),E.pixelStorei(E.UNPACK_IMAGE_HEIGHT,et),E.pixelStorei(E.UNPACK_SKIP_PIXELS,an),E.pixelStorei(E.UNPACK_SKIP_ROWS,Ci),E.pixelStorei(E.UNPACK_SKIP_IMAGES,$t),G===0&&H.generateMipmaps&&E.generateMipmap(Fe),ge.unbindTexture()},this.initRenderTarget=function(T){he.get(T).__webglFramebuffer===void 0&&b.setupRenderTarget(T)},this.initTexture=function(T){T.isCubeTexture?b.setTextureCube(T,0):T.isData3DTexture?b.setTexture3D(T,0):T.isDataArrayTexture||T.isCompressedArrayTexture?b.setTexture2DArray(T,0):b.setTexture2D(T,0),ge.unbindTexture()},this.resetState=function(){L=0,C=0,R=null,ge.reset(),ot.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Un}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=e===hc?"display-p3":"srgb",t.unpackColorSpace=tt.workingColorSpace===Qr?"display-p3":"srgb"}}class pc{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new je(e),this.near=t,this.far=n}clone(){return new pc(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class sa extends xt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new _n,this.environmentIntensity=1,this.environmentRotation=new _n,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class b_{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=jo,this.updateRanges=[],this.version=0,this.uuid=Jn()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[n+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Jn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Jn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Ot=new D;class jr{constructor(e,t,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)Ot.fromBufferAttribute(this,t),Ot.applyMatrix4(e),this.setXYZ(t,Ot.x,Ot.y,Ot.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Ot.fromBufferAttribute(this,t),Ot.applyNormalMatrix(e),this.setXYZ(t,Ot.x,Ot.y,Ot.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Ot.fromBufferAttribute(this,t),Ot.transformDirection(e),this.setXYZ(t,Ot.x,Ot.y,Ot.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=Mn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=it(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=it(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=it(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=it(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=it(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Mn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Mn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Mn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Mn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=it(t,this.array),n=it(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=it(t,this.array),n=it(n,this.array),s=it(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=it(t,this.array),n=it(n,this.array),s=it(s,this.array),r=it(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new Lt(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new jr(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class ld extends Ri{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new je(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let Wi;const vs=new D,ji=new D,Xi=new D,qi=new ke,xs=new ke,hd=new at,fr=new D,ys=new D,pr=new D,Fl=new ke,qa=new ke,kl=new ke;class E_ extends xt{constructor(e=new ld){if(super(),this.isSprite=!0,this.type="Sprite",Wi===void 0){Wi=new ct;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new b_(t,5);Wi.setIndex([0,1,2,0,2,3]),Wi.setAttribute("position",new jr(n,3,0,!1)),Wi.setAttribute("uv",new jr(n,2,3,!1))}this.geometry=Wi,this.material=e,this.center=new ke(.5,.5)}raycast(e,t){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),ji.setFromMatrixScale(this.matrixWorld),hd.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),Xi.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&ji.multiplyScalar(-Xi.z);const n=this.material.rotation;let s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));const a=this.center;mr(fr.set(-.5,-.5,0),Xi,a,ji,s,r),mr(ys.set(.5,-.5,0),Xi,a,ji,s,r),mr(pr.set(.5,.5,0),Xi,a,ji,s,r),Fl.set(0,0),qa.set(1,0),kl.set(1,1);let o=e.ray.intersectTriangle(fr,ys,pr,!1,vs);if(o===null&&(mr(ys.set(-.5,.5,0),Xi,a,ji,s,r),qa.set(0,1),o=e.ray.intersectTriangle(fr,pr,ys,!1,vs),o===null))return;const c=e.ray.origin.distanceTo(vs);c<e.near||c>e.far||t.push({distance:c,point:vs.clone(),uv:sn.getInterpolation(vs,fr,ys,pr,Fl,qa,kl,new ke),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function mr(i,e,t,n,s,r){qi.subVectors(i,t).addScalar(.5).multiply(n),s!==void 0?(xs.x=r*qi.x-s*qi.y,xs.y=s*qi.x+r*qi.y):xs.copy(qi),i.copy(e),i.x+=xs.x,i.y+=xs.y,i.applyMatrix4(hd)}class cs extends Ri{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new je(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Xr=new D,qr=new D,Bl=new at,Ms=new ta,gr=new ea,$a=new D,Hl=new D;class tn extends xt{constructor(e=new ct,t=new cs){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)Xr.fromBufferAttribute(t,s-1),qr.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=Xr.distanceTo(qr);e.setAttribute("lineDistance",new ut(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),gr.copy(n.boundingSphere),gr.applyMatrix4(s),gr.radius+=r,e.ray.intersectsSphere(gr)===!1)return;Bl.copy(s).invert(),Ms.copy(e.ray).applyMatrix4(Bl);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=this.isLineSegments?2:1,h=n.index,d=n.attributes.position;if(h!==null){const p=Math.max(0,a.start),g=Math.min(h.count,a.start+a.count);for(let x=p,u=g-1;x<u;x+=l){const m=h.getX(x),w=h.getX(x+1),S=_r(this,e,Ms,c,m,w);S&&t.push(S)}if(this.isLineLoop){const x=h.getX(g-1),u=h.getX(p),m=_r(this,e,Ms,c,x,u);m&&t.push(m)}}else{const p=Math.max(0,a.start),g=Math.min(d.count,a.start+a.count);for(let x=p,u=g-1;x<u;x+=l){const m=_r(this,e,Ms,c,x,x+1);m&&t.push(m)}if(this.isLineLoop){const x=_r(this,e,Ms,c,g-1,p);x&&t.push(x)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function _r(i,e,t,n,s,r){const a=i.geometry.attributes.position;if(Xr.fromBufferAttribute(a,s),qr.fromBufferAttribute(a,r),t.distanceSqToSegment(Xr,qr,$a,Hl)>n)return;$a.applyMatrix4(i.matrixWorld);const c=e.ray.origin.distanceTo($a);if(!(c<e.near||c>e.far))return{distance:c,point:Hl.clone().applyMatrix4(i.matrixWorld),index:s,face:null,faceIndex:null,barycoord:null,object:i}}const Gl=new D,Vl=new D;class w_ extends tn{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[];for(let s=0,r=t.count;s<r;s+=2)Gl.fromBufferAttribute(t,s),Vl.fromBufferAttribute(t,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+Gl.distanceTo(Vl);e.setAttribute("lineDistance",new ut(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class T_ extends Bt{constructor(e,t,n,s,r,a,o,c,l){super(e,t,n,s,r,a,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Ct extends ct{constructor(e=1,t=1,n=1,s=32,r=1,a=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:c};const l=this;s=Math.floor(s),r=Math.floor(r);const h=[],f=[],d=[],p=[];let g=0;const x=[],u=n/2;let m=0;w(),a===!1&&(e>0&&S(!0),t>0&&S(!1)),this.setIndex(h),this.setAttribute("position",new ut(f,3)),this.setAttribute("normal",new ut(d,3)),this.setAttribute("uv",new ut(p,2));function w(){const y=new D,L=new D;let C=0;const R=(t-e)/n;for(let z=0;z<=r;z++){const ne=[],_=z/r,M=_*(t-e)+e;for(let O=0;O<=s;O++){const k=O/s,q=k*c+o,W=Math.sin(q),V=Math.cos(q);L.x=M*W,L.y=-_*n+u,L.z=M*V,f.push(L.x,L.y,L.z),y.set(W,R,V).normalize(),d.push(y.x,y.y,y.z),p.push(k,1-_),ne.push(g++)}x.push(ne)}for(let z=0;z<s;z++)for(let ne=0;ne<r;ne++){const _=x[ne][z],M=x[ne+1][z],O=x[ne+1][z+1],k=x[ne][z+1];e>0&&(h.push(_,M,k),C+=3),t>0&&(h.push(M,O,k),C+=3)}l.addGroup(m,C,0),m+=C}function S(y){const L=g,C=new ke,R=new D;let z=0;const ne=y===!0?e:t,_=y===!0?1:-1;for(let O=1;O<=s;O++)f.push(0,u*_,0),d.push(0,_,0),p.push(.5,.5),g++;const M=g;for(let O=0;O<=s;O++){const q=O/s*c+o,W=Math.cos(q),V=Math.sin(q);R.x=ne*V,R.y=u*_,R.z=ne*W,f.push(R.x,R.y,R.z),d.push(0,_,0),C.x=W*.5+.5,C.y=V*.5*_+.5,p.push(C.x,C.y),g++}for(let O=0;O<s;O++){const k=L+O,q=M+O;y===!0?h.push(q,q+1,k):h.push(q+1,q,k),z+=3}l.addGroup(m,z,y===!0?1:2),m+=z}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ct(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class ra extends Ct{constructor(e=1,t=1,n=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,e,t,n,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(e){return new ra(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class mc extends ct{constructor(e=[],t=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:s};const r=[],a=[];o(s),l(n),h(),this.setAttribute("position",new ut(r,3)),this.setAttribute("normal",new ut(r.slice(),3)),this.setAttribute("uv",new ut(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(w){const S=new D,y=new D,L=new D;for(let C=0;C<t.length;C+=3)p(t[C+0],S),p(t[C+1],y),p(t[C+2],L),c(S,y,L,w)}function c(w,S,y,L){const C=L+1,R=[];for(let z=0;z<=C;z++){R[z]=[];const ne=w.clone().lerp(y,z/C),_=S.clone().lerp(y,z/C),M=C-z;for(let O=0;O<=M;O++)O===0&&z===C?R[z][O]=ne:R[z][O]=ne.clone().lerp(_,O/M)}for(let z=0;z<C;z++)for(let ne=0;ne<2*(C-z)-1;ne++){const _=Math.floor(ne/2);ne%2===0?(d(R[z][_+1]),d(R[z+1][_]),d(R[z][_])):(d(R[z][_+1]),d(R[z+1][_+1]),d(R[z+1][_]))}}function l(w){const S=new D;for(let y=0;y<r.length;y+=3)S.x=r[y+0],S.y=r[y+1],S.z=r[y+2],S.normalize().multiplyScalar(w),r[y+0]=S.x,r[y+1]=S.y,r[y+2]=S.z}function h(){const w=new D;for(let S=0;S<r.length;S+=3){w.x=r[S+0],w.y=r[S+1],w.z=r[S+2];const y=u(w)/2/Math.PI+.5,L=m(w)/Math.PI+.5;a.push(y,1-L)}g(),f()}function f(){for(let w=0;w<a.length;w+=6){const S=a[w+0],y=a[w+2],L=a[w+4],C=Math.max(S,y,L),R=Math.min(S,y,L);C>.9&&R<.1&&(S<.2&&(a[w+0]+=1),y<.2&&(a[w+2]+=1),L<.2&&(a[w+4]+=1))}}function d(w){r.push(w.x,w.y,w.z)}function p(w,S){const y=w*3;S.x=e[y+0],S.y=e[y+1],S.z=e[y+2]}function g(){const w=new D,S=new D,y=new D,L=new D,C=new ke,R=new ke,z=new ke;for(let ne=0,_=0;ne<r.length;ne+=9,_+=6){w.set(r[ne+0],r[ne+1],r[ne+2]),S.set(r[ne+3],r[ne+4],r[ne+5]),y.set(r[ne+6],r[ne+7],r[ne+8]),C.set(a[_+0],a[_+1]),R.set(a[_+2],a[_+3]),z.set(a[_+4],a[_+5]),L.copy(w).add(S).add(y).divideScalar(3);const M=u(L);x(C,_+0,w,M),x(R,_+2,S,M),x(z,_+4,y,M)}}function x(w,S,y,L){L<0&&w.x===1&&(a[S]=w.x-1),y.x===0&&y.z===0&&(a[S]=L/2/Math.PI+.5)}function u(w){return Math.atan2(w.z,-w.x)}function m(w){return Math.atan2(-w.y,Math.sqrt(w.x*w.x+w.z*w.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new mc(e.vertices,e.indices,e.radius,e.details)}}class Ki extends mc{constructor(e=1,t=0){const n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],s=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,s,e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Ki(e.radius,e.detail)}}class ls extends ct{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const c=Math.min(a+o,Math.PI);let l=0;const h=[],f=new D,d=new D,p=[],g=[],x=[],u=[];for(let m=0;m<=n;m++){const w=[],S=m/n;let y=0;m===0&&a===0?y=.5/t:m===n&&c===Math.PI&&(y=-.5/t);for(let L=0;L<=t;L++){const C=L/t;f.x=-e*Math.cos(s+C*r)*Math.sin(a+S*o),f.y=e*Math.cos(a+S*o),f.z=e*Math.sin(s+C*r)*Math.sin(a+S*o),g.push(f.x,f.y,f.z),d.copy(f).normalize(),x.push(d.x,d.y,d.z),u.push(C+y,1-S),w.push(l++)}h.push(w)}for(let m=0;m<n;m++)for(let w=0;w<t;w++){const S=h[m][w+1],y=h[m][w],L=h[m+1][w],C=h[m+1][w+1];(m!==0||a>0)&&p.push(S,y,C),(m!==n-1||c<Math.PI)&&p.push(y,L,C)}this.setIndex(p),this.setAttribute("position",new ut(g,3)),this.setAttribute("normal",new ut(x,3)),this.setAttribute("uv",new ut(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ls(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class _i extends ct{constructor(e=1,t=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);const a=[],o=[],c=[],l=[],h=new D,f=new D,d=new D;for(let p=0;p<=n;p++)for(let g=0;g<=s;g++){const x=g/s*r,u=p/n*Math.PI*2;f.x=(e+t*Math.cos(u))*Math.cos(x),f.y=(e+t*Math.cos(u))*Math.sin(x),f.z=t*Math.sin(u),o.push(f.x,f.y,f.z),h.x=e*Math.cos(x),h.y=e*Math.sin(x),d.subVectors(f,h).normalize(),c.push(d.x,d.y,d.z),l.push(g/s),l.push(p/n)}for(let p=1;p<=n;p++)for(let g=1;g<=s;g++){const x=(s+1)*p+g-1,u=(s+1)*(p-1)+g-1,m=(s+1)*(p-1)+g,w=(s+1)*p+g;a.push(x,u,w),a.push(u,m,w)}this.setIndex(a),this.setAttribute("position",new ut(o,3)),this.setAttribute("normal",new ut(c,3)),this.setAttribute("uv",new ut(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new _i(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class gn extends Ri{constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new je(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new je(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=jh,this.normalScale=new ke(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new _n,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class dd extends xt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new je(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class aa extends dd{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(xt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new je(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const Ya=new at,Wl=new D,jl=new D;class A_{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ke(512,512),this.map=null,this.mapPass=null,this.matrix=new at,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new uc,this._frameExtents=new ke(1,1),this._viewportCount=1,this._viewports=[new vt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;Wl.setFromMatrixPosition(e.matrixWorld),t.position.copy(Wl),jl.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(jl),t.updateMatrixWorld(),Ya.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ya),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Ya)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class R_ extends A_{constructor(){super(new id(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class oa extends dd{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(xt.DEFAULT_UP),this.updateMatrix(),this.target=new xt,this.shadow=new R_}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class ca{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=Xl(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=Xl();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}function Xl(){return performance.now()}const ql=new at;class $r{constructor(e,t,n=0,s=1/0){this.ray=new ta(e,t),this.near=n,this.far=s,this.camera=null,this.layers=new dc,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return ql.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(ql),this}intersectObject(e,t=!0,n=[]){return $o(e,this,n,t),n.sort($l),n}intersectObjects(e,t=!0,n=[]){for(let s=0,r=e.length;s<r;s++)$o(e[s],this,n,t);return n.sort($l),n}}function $l(i,e){return i.distance-e.distance}function $o(i,e,t,n){let s=!0;if(i.layers.test(e.layers)&&i.raycast(e,t)===!1&&(s=!1),s===!0&&n===!0){const r=i.children;for(let a=0,o=r.length;a<o;a++)$o(r[a],e,t,!0)}}class Yl{constructor(e=1,t=0,n=0){return this.radius=e,this.phi=t,this.theta=n,this}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(Ft(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}class C_ extends w_{constructor(e=10,t=10,n=4473924,s=8947848){n=new je(n),s=new je(s);const r=t/2,a=e/t,o=e/2,c=[],l=[];for(let d=0,p=0,g=-o;d<=t;d++,g+=a){c.push(-o,0,g,o,0,g),c.push(g,0,-o,g,0,o);const x=d===r?n:s;x.toArray(l,p),p+=3,x.toArray(l,p),p+=3,x.toArray(l,p),p+=3,x.toArray(l,p),p+=3}const h=new ct;h.setAttribute("position",new ut(c,3)),h.setAttribute("color",new ut(l,3));const f=new cs({vertexColors:!0,toneMapped:!1});super(h,f),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}class ud extends Ti{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(){}disconnect(){}dispose(){}update(){}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:ic}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=ic);const Kl={type:"change"},gc={type:"start"},fd={type:"end"},vr=new ta,Zl=new $n,L_=Math.cos(70*lf.DEG2RAD),Et=new D,Vt=2*Math.PI,st={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},Ka=1e-6;class _c extends ud{constructor(e,t=null){super(e,t),this.state=st.NONE,this.enabled=!0,this.target=new D,this.cursor=new D,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Wt.ROTATE,MIDDLE:Wt.DOLLY,RIGHT:Wt.PAN},this.touches={ONE:$i.ROTATE,TWO:$i.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new D,this._lastQuaternion=new It,this._lastTargetPosition=new D,this._quat=new It().setFromUnitVectors(e.up,new D(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Yl,this._sphericalDelta=new Yl,this._scale=1,this._panOffset=new D,this._rotateStart=new ke,this._rotateEnd=new ke,this._rotateDelta=new ke,this._panStart=new ke,this._panEnd=new ke,this._panDelta=new ke,this._dollyStart=new ke,this._dollyEnd=new ke,this._dollyDelta=new ke,this._dollyDirection=new D,this._mouse=new ke,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=I_.bind(this),this._onPointerDown=P_.bind(this),this._onPointerUp=D_.bind(this),this._onContextMenu=B_.bind(this),this._onMouseWheel=O_.bind(this),this._onKeyDown=z_.bind(this),this._onTouchStart=F_.bind(this),this._onTouchMove=k_.bind(this),this._onMouseDown=U_.bind(this),this._onMouseMove=N_.bind(this),this._interceptControlDown=H_.bind(this),this._interceptControlUp=G_.bind(this),this.domElement!==null&&this.connect(),this.update()}connect(){this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(Kl),this.update(),this.state=st.NONE}update(e=null){const t=this.object.position;Et.copy(t).sub(this.target),Et.applyQuaternion(this._quat),this._spherical.setFromVector3(Et),this.autoRotate&&this.state===st.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(n)&&isFinite(s)&&(n<-Math.PI?n+=Vt:n>Math.PI&&(n-=Vt),s<-Math.PI?s+=Vt:s>Math.PI&&(s-=Vt),n<=s?this._spherical.theta=Math.max(n,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+s)/2?Math.max(n,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const a=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=a!=this._spherical.radius}if(Et.setFromSpherical(this._spherical),Et.applyQuaternion(this._quatInverse),t.copy(this.target).add(Et),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let a=null;if(this.object.isPerspectiveCamera){const o=Et.length();a=this._clampDistance(o*this._scale);const c=o-a;this.object.position.addScaledVector(this._dollyDirection,c),this.object.updateMatrixWorld(),r=!!c}else if(this.object.isOrthographicCamera){const o=new D(this._mouse.x,this._mouse.y,0);o.unproject(this.object);const c=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=c!==this.object.zoom;const l=new D(this._mouse.x,this._mouse.y,0);l.unproject(this.object),this.object.position.sub(l).add(o),this.object.updateMatrixWorld(),a=Et.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;a!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(a).add(this.object.position):(vr.origin.copy(this.object.position),vr.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(vr.direction))<L_?this.object.lookAt(this.target):(Zl.setFromNormalAndCoplanarPoint(this.object.up,this.target),vr.intersectPlane(Zl,this.target))))}else if(this.object.isOrthographicCamera){const a=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),a!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>Ka||8*(1-this._lastQuaternion.dot(this.object.quaternion))>Ka||this._lastTargetPosition.distanceToSquared(this.target)>Ka?(this.dispatchEvent(Kl),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?Vt/60*this.autoRotateSpeed*e:Vt/60/60*this.autoRotateSpeed}_getZoomScale(e){const t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){Et.setFromMatrixColumn(t,0),Et.multiplyScalar(-e),this._panOffset.add(Et)}_panUp(e,t){this.screenSpacePanning===!0?Et.setFromMatrixColumn(t,1):(Et.setFromMatrixColumn(t,0),Et.crossVectors(this.object.up,Et)),Et.multiplyScalar(e),this._panOffset.add(Et)}_pan(e,t){const n=this.domElement;if(this.object.isPerspectiveCamera){const s=this.object.position;Et.copy(s).sub(this.target);let r=Et.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*r/n.clientHeight,this.object.matrix),this._panUp(2*t*r/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const n=this.domElement.getBoundingClientRect(),s=e-n.left,r=t-n.top,a=n.width,o=n.height;this._mouse.x=s/a*2-1,this._mouse.y=-(r/o)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(Vt*this._rotateDelta.x/t.clientHeight),this._rotateUp(Vt*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateUp(Vt*this.rotateSpeed/this.domElement.clientHeight):this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateUp(-Vt*this.rotateSpeed/this.domElement.clientHeight):this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateLeft(Vt*this.rotateSpeed/this.domElement.clientHeight):this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateLeft(-Vt*this.rotateSpeed/this.domElement.clientHeight):this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._rotateStart.set(n,s)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panStart.set(n,s)}}_handleTouchStartDolly(e){const t=this._getSecondPointerPosition(e),n=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(n*n+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),s=.5*(e.pageX+n.x),r=.5*(e.pageY+n.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(Vt*this._rotateDelta.x/t.clientHeight),this._rotateUp(Vt*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panEnd.set(n,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){const t=this._getSecondPointerPosition(e),n=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(n*n+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const a=(e.pageX+t.x)*.5,o=(e.pageY+t.y)*.5;this._updateZoomParameters(a,o)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new ke,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){const t=e.deltaMode,n={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}}function P_(i){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(i.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(i)&&(this._addPointer(i),i.pointerType==="touch"?this._onTouchStart(i):this._onMouseDown(i)))}function I_(i){this.enabled!==!1&&(i.pointerType==="touch"?this._onTouchMove(i):this._onMouseMove(i))}function D_(i){switch(this._removePointer(i),this._pointers.length){case 0:this.domElement.releasePointerCapture(i.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(fd),this.state=st.NONE;break;case 1:const e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function U_(i){let e;switch(i.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case Wt.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(i),this.state=st.DOLLY;break;case Wt.ROTATE:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=st.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=st.ROTATE}break;case Wt.PAN:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=st.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=st.PAN}break;default:this.state=st.NONE}this.state!==st.NONE&&this.dispatchEvent(gc)}function N_(i){switch(this.state){case st.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(i);break;case st.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(i);break;case st.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(i);break}}function O_(i){this.enabled===!1||this.enableZoom===!1||this.state!==st.NONE||(i.preventDefault(),this.dispatchEvent(gc),this._handleMouseWheel(this._customWheelEvent(i)),this.dispatchEvent(fd))}function z_(i){this.enabled===!1||this.enablePan===!1||this._handleKeyDown(i)}function F_(i){switch(this._trackPointer(i),this._pointers.length){case 1:switch(this.touches.ONE){case $i.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(i),this.state=st.TOUCH_ROTATE;break;case $i.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(i),this.state=st.TOUCH_PAN;break;default:this.state=st.NONE}break;case 2:switch(this.touches.TWO){case $i.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(i),this.state=st.TOUCH_DOLLY_PAN;break;case $i.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(i),this.state=st.TOUCH_DOLLY_ROTATE;break;default:this.state=st.NONE}break;default:this.state=st.NONE}this.state!==st.NONE&&this.dispatchEvent(gc)}function k_(i){switch(this._trackPointer(i),this.state){case st.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(i),this.update();break;case st.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(i),this.update();break;case st.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(i),this.update();break;case st.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(i),this.update();break;default:this.state=st.NONE}}function B_(i){this.enabled!==!1&&i.preventDefault()}function H_(i){i.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function G_(i){i.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}const di=new $r,Nt=new D,qn=new D,pt=new It,Jl={X:new D(1,0,0),Y:new D(0,1,0),Z:new D(0,0,1)},Za={type:"change"},Ql={type:"mouseDown",mode:null},eh={type:"mouseUp",mode:null},th={type:"objectChange"};class vc extends ud{constructor(e,t=null){super(void 0,t);const n=new $_(this);this._root=n;const s=new Y_;this._gizmo=s,n.add(s);const r=new K_;this._plane=r,n.add(r);const a=this;function o(S,y){let L=y;Object.defineProperty(a,S,{get:function(){return L!==void 0?L:y},set:function(C){L!==C&&(L=C,r[S]=C,s[S]=C,a.dispatchEvent({type:S+"-changed",value:C}),a.dispatchEvent(Za))}}),a[S]=y,r[S]=y,s[S]=y}o("camera",e),o("object",void 0),o("enabled",!0),o("axis",null),o("mode","translate"),o("translationSnap",null),o("rotationSnap",null),o("scaleSnap",null),o("space","world"),o("size",1),o("dragging",!1),o("showX",!0),o("showY",!0),o("showZ",!0);const c=new D,l=new D,h=new It,f=new It,d=new D,p=new It,g=new D,x=new D,u=new D,m=0,w=new D;o("worldPosition",c),o("worldPositionStart",l),o("worldQuaternion",h),o("worldQuaternionStart",f),o("cameraPosition",d),o("cameraQuaternion",p),o("pointStart",g),o("pointEnd",x),o("rotationAxis",u),o("rotationAngle",m),o("eye",w),this._offset=new D,this._startNorm=new D,this._endNorm=new D,this._cameraScale=new D,this._parentPosition=new D,this._parentQuaternion=new It,this._parentQuaternionInv=new It,this._parentScale=new D,this._worldScaleStart=new D,this._worldQuaternionInv=new It,this._worldScale=new D,this._positionStart=new D,this._quaternionStart=new It,this._scaleStart=new D,this._getPointer=V_.bind(this),this._onPointerDown=j_.bind(this),this._onPointerHover=W_.bind(this),this._onPointerMove=X_.bind(this),this._onPointerUp=q_.bind(this),t!==null&&this.connect()}connect(){this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointermove",this._onPointerHover),this.domElement.addEventListener("pointerup",this._onPointerUp),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerHover),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.style.touchAction="auto"}getHelper(){return this._root}pointerHover(e){if(this.object===void 0||this.dragging===!0)return;e!==null&&di.setFromCamera(e,this.camera);const t=Ja(this._gizmo.picker[this.mode],di);t?this.axis=t.object.name:this.axis=null}pointerDown(e){if(!(this.object===void 0||this.dragging===!0||e!=null&&e.button!==0)&&this.axis!==null){e!==null&&di.setFromCamera(e,this.camera);const t=Ja(this._plane,di,!0);t&&(this.object.updateMatrixWorld(),this.object.parent.updateMatrixWorld(),this._positionStart.copy(this.object.position),this._quaternionStart.copy(this.object.quaternion),this._scaleStart.copy(this.object.scale),this.object.matrixWorld.decompose(this.worldPositionStart,this.worldQuaternionStart,this._worldScaleStart),this.pointStart.copy(t.point).sub(this.worldPositionStart)),this.dragging=!0,Ql.mode=this.mode,this.dispatchEvent(Ql)}}pointerMove(e){const t=this.axis,n=this.mode,s=this.object;let r=this.space;if(n==="scale"?r="local":(t==="E"||t==="XYZE"||t==="XYZ")&&(r="world"),s===void 0||t===null||this.dragging===!1||e!==null&&e.button!==-1)return;e!==null&&di.setFromCamera(e,this.camera);const a=Ja(this._plane,di,!0);if(a){if(this.pointEnd.copy(a.point).sub(this.worldPositionStart),n==="translate")this._offset.copy(this.pointEnd).sub(this.pointStart),r==="local"&&t!=="XYZ"&&this._offset.applyQuaternion(this._worldQuaternionInv),t.indexOf("X")===-1&&(this._offset.x=0),t.indexOf("Y")===-1&&(this._offset.y=0),t.indexOf("Z")===-1&&(this._offset.z=0),r==="local"&&t!=="XYZ"?this._offset.applyQuaternion(this._quaternionStart).divide(this._parentScale):this._offset.applyQuaternion(this._parentQuaternionInv).divide(this._parentScale),s.position.copy(this._offset).add(this._positionStart),this.translationSnap&&(r==="local"&&(s.position.applyQuaternion(pt.copy(this._quaternionStart).invert()),t.search("X")!==-1&&(s.position.x=Math.round(s.position.x/this.translationSnap)*this.translationSnap),t.search("Y")!==-1&&(s.position.y=Math.round(s.position.y/this.translationSnap)*this.translationSnap),t.search("Z")!==-1&&(s.position.z=Math.round(s.position.z/this.translationSnap)*this.translationSnap),s.position.applyQuaternion(this._quaternionStart)),r==="world"&&(s.parent&&s.position.add(Nt.setFromMatrixPosition(s.parent.matrixWorld)),t.search("X")!==-1&&(s.position.x=Math.round(s.position.x/this.translationSnap)*this.translationSnap),t.search("Y")!==-1&&(s.position.y=Math.round(s.position.y/this.translationSnap)*this.translationSnap),t.search("Z")!==-1&&(s.position.z=Math.round(s.position.z/this.translationSnap)*this.translationSnap),s.parent&&s.position.sub(Nt.setFromMatrixPosition(s.parent.matrixWorld))));else if(n==="scale"){if(t.search("XYZ")!==-1){let o=this.pointEnd.length()/this.pointStart.length();this.pointEnd.dot(this.pointStart)<0&&(o*=-1),qn.set(o,o,o)}else Nt.copy(this.pointStart),qn.copy(this.pointEnd),Nt.applyQuaternion(this._worldQuaternionInv),qn.applyQuaternion(this._worldQuaternionInv),qn.divide(Nt),t.search("X")===-1&&(qn.x=1),t.search("Y")===-1&&(qn.y=1),t.search("Z")===-1&&(qn.z=1);s.scale.copy(this._scaleStart).multiply(qn),this.scaleSnap&&(t.search("X")!==-1&&(s.scale.x=Math.round(s.scale.x/this.scaleSnap)*this.scaleSnap||this.scaleSnap),t.search("Y")!==-1&&(s.scale.y=Math.round(s.scale.y/this.scaleSnap)*this.scaleSnap||this.scaleSnap),t.search("Z")!==-1&&(s.scale.z=Math.round(s.scale.z/this.scaleSnap)*this.scaleSnap||this.scaleSnap))}else if(n==="rotate"){this._offset.copy(this.pointEnd).sub(this.pointStart);const o=20/this.worldPosition.distanceTo(Nt.setFromMatrixPosition(this.camera.matrixWorld));let c=!1;t==="XYZE"?(this.rotationAxis.copy(this._offset).cross(this.eye).normalize(),this.rotationAngle=this._offset.dot(Nt.copy(this.rotationAxis).cross(this.eye))*o):(t==="X"||t==="Y"||t==="Z")&&(this.rotationAxis.copy(Jl[t]),Nt.copy(Jl[t]),r==="local"&&Nt.applyQuaternion(this.worldQuaternion),Nt.cross(this.eye),Nt.length()===0?c=!0:this.rotationAngle=this._offset.dot(Nt.normalize())*o),(t==="E"||c)&&(this.rotationAxis.copy(this.eye),this.rotationAngle=this.pointEnd.angleTo(this.pointStart),this._startNorm.copy(this.pointStart).normalize(),this._endNorm.copy(this.pointEnd).normalize(),this.rotationAngle*=this._endNorm.cross(this._startNorm).dot(this.eye)<0?1:-1),this.rotationSnap&&(this.rotationAngle=Math.round(this.rotationAngle/this.rotationSnap)*this.rotationSnap),r==="local"&&t!=="E"&&t!=="XYZE"?(s.quaternion.copy(this._quaternionStart),s.quaternion.multiply(pt.setFromAxisAngle(this.rotationAxis,this.rotationAngle)).normalize()):(this.rotationAxis.applyQuaternion(this._parentQuaternionInv),s.quaternion.copy(pt.setFromAxisAngle(this.rotationAxis,this.rotationAngle)),s.quaternion.multiply(this._quaternionStart).normalize())}this.dispatchEvent(Za),this.dispatchEvent(th)}}pointerUp(e){e!==null&&e.button!==0||(this.dragging&&this.axis!==null&&(eh.mode=this.mode,this.dispatchEvent(eh)),this.dragging=!1,this.axis=null)}dispose(){this.disconnect(),this.traverse(function(e){e.geometry&&e.geometry.dispose(),e.material&&e.material.dispose()})}attach(e){return this.object=e,this._root.visible=!0,this}detach(){return this.object=void 0,this.axis=null,this._root.visible=!1,this}reset(){this.enabled&&this.dragging&&(this.object.position.copy(this._positionStart),this.object.quaternion.copy(this._quaternionStart),this.object.scale.copy(this._scaleStart),this.dispatchEvent(Za),this.dispatchEvent(th),this.pointStart.copy(this.pointEnd))}getRaycaster(){return di}getMode(){return this.mode}setMode(e){this.mode=e}setTranslationSnap(e){this.translationSnap=e}setRotationSnap(e){this.rotationSnap=e}setScaleSnap(e){this.scaleSnap=e}setSize(e){this.size=e}setSpace(e){this.space=e}}function V_(i){if(this.domElement.ownerDocument.pointerLockElement)return{x:0,y:0,button:i.button};{const e=this.domElement.getBoundingClientRect();return{x:(i.clientX-e.left)/e.width*2-1,y:-(i.clientY-e.top)/e.height*2+1,button:i.button}}}function W_(i){if(this.enabled)switch(i.pointerType){case"mouse":case"pen":this.pointerHover(this._getPointer(i));break}}function j_(i){this.enabled&&(document.pointerLockElement||this.domElement.setPointerCapture(i.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.pointerHover(this._getPointer(i)),this.pointerDown(this._getPointer(i)))}function X_(i){this.enabled&&this.pointerMove(this._getPointer(i))}function q_(i){this.enabled&&(this.domElement.releasePointerCapture(i.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.pointerUp(this._getPointer(i)))}function Ja(i,e,t){const n=e.intersectObject(i,!0);for(let s=0;s<n.length;s++)if(n[s].object.visible||t)return n[s];return!1}const xr=new _n,rt=new D(0,1,0),nh=new D(0,0,0),ih=new at,yr=new It,Ir=new It,vn=new D,sh=new at,Ts=new D(1,0,0),pi=new D(0,1,0),As=new D(0,0,1),Mr=new D,Ss=new D,bs=new D;class $_ extends xt{constructor(e){super(),this.isTransformControlsRoot=!0,this.controls=e,this.visible=!1}updateMatrixWorld(e){const t=this.controls;t.object!==void 0&&(t.object.updateMatrixWorld(),t.object.parent===null?console.error("TransformControls: The attached 3D object must be a part of the scene graph."):t.object.parent.matrixWorld.decompose(t._parentPosition,t._parentQuaternion,t._parentScale),t.object.matrixWorld.decompose(t.worldPosition,t.worldQuaternion,t._worldScale),t._parentQuaternionInv.copy(t._parentQuaternion).invert(),t._worldQuaternionInv.copy(t.worldQuaternion).invert()),t.camera.updateMatrixWorld(),t.camera.matrixWorld.decompose(t.cameraPosition,t.cameraQuaternion,t._cameraScale),t.camera.isOrthographicCamera?t.camera.getWorldDirection(t.eye).negate():t.eye.copy(t.cameraPosition).sub(t.worldPosition).normalize(),super.updateMatrixWorld(e)}}class Y_ extends xt{constructor(){super(),this.isTransformControlsGizmo=!0,this.type="TransformControlsGizmo";const e=new as({depthTest:!1,depthWrite:!1,fog:!1,toneMapped:!1,transparent:!0}),t=new cs({depthTest:!1,depthWrite:!1,fog:!1,toneMapped:!1,transparent:!0}),n=e.clone();n.opacity=.15;const s=t.clone();s.opacity=.5;const r=e.clone();r.color.setHex(16711680);const a=e.clone();a.color.setHex(65280);const o=e.clone();o.color.setHex(255);const c=e.clone();c.color.setHex(16711680),c.opacity=.5;const l=e.clone();l.color.setHex(65280),l.opacity=.5;const h=e.clone();h.color.setHex(255),h.opacity=.5;const f=e.clone();f.opacity=.25;const d=e.clone();d.color.setHex(16776960),d.opacity=.25,e.clone().color.setHex(16776960);const g=e.clone();g.color.setHex(7895160);const x=new Ct(0,.04,.1,12);x.translate(0,.05,0);const u=new _t(.08,.08,.08);u.translate(0,.04,0);const m=new ct;m.setAttribute("position",new ut([0,0,0,1,0,0],3));const w=new Ct(.0075,.0075,.5,3);w.translate(0,.25,0);function S(W,V){const ie=new _i(W,.0075,3,64,V*Math.PI*2);return ie.rotateY(Math.PI/2),ie.rotateX(Math.PI/2),ie}function y(){const W=new ct;return W.setAttribute("position",new ut([0,0,0,1,1,1],3)),W}const L={X:[[new Ee(x,r),[.5,0,0],[0,0,-Math.PI/2]],[new Ee(x,r),[-.5,0,0],[0,0,Math.PI/2]],[new Ee(w,r),[0,0,0],[0,0,-Math.PI/2]]],Y:[[new Ee(x,a),[0,.5,0]],[new Ee(x,a),[0,-.5,0],[Math.PI,0,0]],[new Ee(w,a)]],Z:[[new Ee(x,o),[0,0,.5],[Math.PI/2,0,0]],[new Ee(x,o),[0,0,-.5],[-Math.PI/2,0,0]],[new Ee(w,o),null,[Math.PI/2,0,0]]],XYZ:[[new Ee(new Ki(.1,0),f.clone()),[0,0,0]]],XY:[[new Ee(new _t(.15,.15,.01),h.clone()),[.15,.15,0]]],YZ:[[new Ee(new _t(.15,.15,.01),c.clone()),[0,.15,.15],[0,Math.PI/2,0]]],XZ:[[new Ee(new _t(.15,.15,.01),l.clone()),[.15,0,.15],[-Math.PI/2,0,0]]]},C={X:[[new Ee(new Ct(.2,0,.6,4),n),[.3,0,0],[0,0,-Math.PI/2]],[new Ee(new Ct(.2,0,.6,4),n),[-.3,0,0],[0,0,Math.PI/2]]],Y:[[new Ee(new Ct(.2,0,.6,4),n),[0,.3,0]],[new Ee(new Ct(.2,0,.6,4),n),[0,-.3,0],[0,0,Math.PI]]],Z:[[new Ee(new Ct(.2,0,.6,4),n),[0,0,.3],[Math.PI/2,0,0]],[new Ee(new Ct(.2,0,.6,4),n),[0,0,-.3],[-Math.PI/2,0,0]]],XYZ:[[new Ee(new Ki(.2,0),n)]],XY:[[new Ee(new _t(.2,.2,.01),n),[.15,.15,0]]],YZ:[[new Ee(new _t(.2,.2,.01),n),[0,.15,.15],[0,Math.PI/2,0]]],XZ:[[new Ee(new _t(.2,.2,.01),n),[.15,0,.15],[-Math.PI/2,0,0]]]},R={START:[[new Ee(new Ki(.01,2),s),null,null,null,"helper"]],END:[[new Ee(new Ki(.01,2),s),null,null,null,"helper"]],DELTA:[[new tn(y(),s),null,null,null,"helper"]],X:[[new tn(m,s.clone()),[-1e3,0,0],null,[1e6,1,1],"helper"]],Y:[[new tn(m,s.clone()),[0,-1e3,0],[0,0,Math.PI/2],[1e6,1,1],"helper"]],Z:[[new tn(m,s.clone()),[0,0,-1e3],[0,-Math.PI/2,0],[1e6,1,1],"helper"]]},z={XYZE:[[new Ee(S(.5,1),g),null,[0,Math.PI/2,0]]],X:[[new Ee(S(.5,.5),r)]],Y:[[new Ee(S(.5,.5),a),null,[0,0,-Math.PI/2]]],Z:[[new Ee(S(.5,.5),o),null,[0,Math.PI/2,0]]],E:[[new Ee(S(.75,1),d),null,[0,Math.PI/2,0]]]},ne={AXIS:[[new tn(m,s.clone()),[-1e3,0,0],null,[1e6,1,1],"helper"]]},_={XYZE:[[new Ee(new ls(.25,10,8),n)]],X:[[new Ee(new _i(.5,.1,4,24),n),[0,0,0],[0,-Math.PI/2,-Math.PI/2]]],Y:[[new Ee(new _i(.5,.1,4,24),n),[0,0,0],[Math.PI/2,0,0]]],Z:[[new Ee(new _i(.5,.1,4,24),n),[0,0,0],[0,0,-Math.PI/2]]],E:[[new Ee(new _i(.75,.1,2,24),n)]]},M={X:[[new Ee(u,r),[.5,0,0],[0,0,-Math.PI/2]],[new Ee(w,r),[0,0,0],[0,0,-Math.PI/2]],[new Ee(u,r),[-.5,0,0],[0,0,Math.PI/2]]],Y:[[new Ee(u,a),[0,.5,0]],[new Ee(w,a)],[new Ee(u,a),[0,-.5,0],[0,0,Math.PI]]],Z:[[new Ee(u,o),[0,0,.5],[Math.PI/2,0,0]],[new Ee(w,o),[0,0,0],[Math.PI/2,0,0]],[new Ee(u,o),[0,0,-.5],[-Math.PI/2,0,0]]],XY:[[new Ee(new _t(.15,.15,.01),h),[.15,.15,0]]],YZ:[[new Ee(new _t(.15,.15,.01),c),[0,.15,.15],[0,Math.PI/2,0]]],XZ:[[new Ee(new _t(.15,.15,.01),l),[.15,0,.15],[-Math.PI/2,0,0]]],XYZ:[[new Ee(new _t(.1,.1,.1),f.clone())]]},O={X:[[new Ee(new Ct(.2,0,.6,4),n),[.3,0,0],[0,0,-Math.PI/2]],[new Ee(new Ct(.2,0,.6,4),n),[-.3,0,0],[0,0,Math.PI/2]]],Y:[[new Ee(new Ct(.2,0,.6,4),n),[0,.3,0]],[new Ee(new Ct(.2,0,.6,4),n),[0,-.3,0],[0,0,Math.PI]]],Z:[[new Ee(new Ct(.2,0,.6,4),n),[0,0,.3],[Math.PI/2,0,0]],[new Ee(new Ct(.2,0,.6,4),n),[0,0,-.3],[-Math.PI/2,0,0]]],XY:[[new Ee(new _t(.2,.2,.01),n),[.15,.15,0]]],YZ:[[new Ee(new _t(.2,.2,.01),n),[0,.15,.15],[0,Math.PI/2,0]]],XZ:[[new Ee(new _t(.2,.2,.01),n),[.15,0,.15],[-Math.PI/2,0,0]]],XYZ:[[new Ee(new _t(.2,.2,.2),n),[0,0,0]]]},k={X:[[new tn(m,s.clone()),[-1e3,0,0],null,[1e6,1,1],"helper"]],Y:[[new tn(m,s.clone()),[0,-1e3,0],[0,0,Math.PI/2],[1e6,1,1],"helper"]],Z:[[new tn(m,s.clone()),[0,0,-1e3],[0,-Math.PI/2,0],[1e6,1,1],"helper"]]};function q(W){const V=new xt;for(const ie in W)for(let K=W[ie].length;K--;){const me=W[ie][K][0].clone(),xe=W[ie][K][1],ve=W[ie][K][2],se=W[ie][K][3],le=W[ie][K][4];me.name=ie,me.tag=le,xe&&me.position.set(xe[0],xe[1],xe[2]),ve&&me.rotation.set(ve[0],ve[1],ve[2]),se&&me.scale.set(se[0],se[1],se[2]),me.updateMatrix();const A=me.geometry.clone();A.applyMatrix4(me.matrix),me.geometry=A,me.renderOrder=1/0,me.position.set(0,0,0),me.rotation.set(0,0,0),me.scale.set(1,1,1),V.add(me)}return V}this.gizmo={},this.picker={},this.helper={},this.add(this.gizmo.translate=q(L)),this.add(this.gizmo.rotate=q(z)),this.add(this.gizmo.scale=q(M)),this.add(this.picker.translate=q(C)),this.add(this.picker.rotate=q(_)),this.add(this.picker.scale=q(O)),this.add(this.helper.translate=q(R)),this.add(this.helper.rotate=q(ne)),this.add(this.helper.scale=q(k)),this.picker.translate.visible=!1,this.picker.rotate.visible=!1,this.picker.scale.visible=!1}updateMatrixWorld(e){const n=(this.mode==="scale"?"local":this.space)==="local"?this.worldQuaternion:Ir;this.gizmo.translate.visible=this.mode==="translate",this.gizmo.rotate.visible=this.mode==="rotate",this.gizmo.scale.visible=this.mode==="scale",this.helper.translate.visible=this.mode==="translate",this.helper.rotate.visible=this.mode==="rotate",this.helper.scale.visible=this.mode==="scale";let s=[];s=s.concat(this.picker[this.mode].children),s=s.concat(this.gizmo[this.mode].children),s=s.concat(this.helper[this.mode].children);for(let r=0;r<s.length;r++){const a=s[r];a.visible=!0,a.rotation.set(0,0,0),a.position.copy(this.worldPosition);let o;if(this.camera.isOrthographicCamera?o=(this.camera.top-this.camera.bottom)/this.camera.zoom:o=this.worldPosition.distanceTo(this.cameraPosition)*Math.min(1.9*Math.tan(Math.PI*this.camera.fov/360)/this.camera.zoom,7),a.scale.set(1,1,1).multiplyScalar(o*this.size/4),a.tag==="helper"){a.visible=!1,a.name==="AXIS"?(a.visible=!!this.axis,this.axis==="X"&&(pt.setFromEuler(xr.set(0,0,0)),a.quaternion.copy(n).multiply(pt),Math.abs(rt.copy(Ts).applyQuaternion(n).dot(this.eye))>.9&&(a.visible=!1)),this.axis==="Y"&&(pt.setFromEuler(xr.set(0,0,Math.PI/2)),a.quaternion.copy(n).multiply(pt),Math.abs(rt.copy(pi).applyQuaternion(n).dot(this.eye))>.9&&(a.visible=!1)),this.axis==="Z"&&(pt.setFromEuler(xr.set(0,Math.PI/2,0)),a.quaternion.copy(n).multiply(pt),Math.abs(rt.copy(As).applyQuaternion(n).dot(this.eye))>.9&&(a.visible=!1)),this.axis==="XYZE"&&(pt.setFromEuler(xr.set(0,Math.PI/2,0)),rt.copy(this.rotationAxis),a.quaternion.setFromRotationMatrix(ih.lookAt(nh,rt,pi)),a.quaternion.multiply(pt),a.visible=this.dragging),this.axis==="E"&&(a.visible=!1)):a.name==="START"?(a.position.copy(this.worldPositionStart),a.visible=this.dragging):a.name==="END"?(a.position.copy(this.worldPosition),a.visible=this.dragging):a.name==="DELTA"?(a.position.copy(this.worldPositionStart),a.quaternion.copy(this.worldQuaternionStart),Nt.set(1e-10,1e-10,1e-10).add(this.worldPositionStart).sub(this.worldPosition).multiplyScalar(-1),Nt.applyQuaternion(this.worldQuaternionStart.clone().invert()),a.scale.copy(Nt),a.visible=this.dragging):(a.quaternion.copy(n),this.dragging?a.position.copy(this.worldPositionStart):a.position.copy(this.worldPosition),this.axis&&(a.visible=this.axis.search(a.name)!==-1));continue}a.quaternion.copy(n),this.mode==="translate"||this.mode==="scale"?(a.name==="X"&&Math.abs(rt.copy(Ts).applyQuaternion(n).dot(this.eye))>.99&&(a.scale.set(1e-10,1e-10,1e-10),a.visible=!1),a.name==="Y"&&Math.abs(rt.copy(pi).applyQuaternion(n).dot(this.eye))>.99&&(a.scale.set(1e-10,1e-10,1e-10),a.visible=!1),a.name==="Z"&&Math.abs(rt.copy(As).applyQuaternion(n).dot(this.eye))>.99&&(a.scale.set(1e-10,1e-10,1e-10),a.visible=!1),a.name==="XY"&&Math.abs(rt.copy(As).applyQuaternion(n).dot(this.eye))<.2&&(a.scale.set(1e-10,1e-10,1e-10),a.visible=!1),a.name==="YZ"&&Math.abs(rt.copy(Ts).applyQuaternion(n).dot(this.eye))<.2&&(a.scale.set(1e-10,1e-10,1e-10),a.visible=!1),a.name==="XZ"&&Math.abs(rt.copy(pi).applyQuaternion(n).dot(this.eye))<.2&&(a.scale.set(1e-10,1e-10,1e-10),a.visible=!1)):this.mode==="rotate"&&(yr.copy(n),rt.copy(this.eye).applyQuaternion(pt.copy(n).invert()),a.name.search("E")!==-1&&a.quaternion.setFromRotationMatrix(ih.lookAt(this.eye,nh,pi)),a.name==="X"&&(pt.setFromAxisAngle(Ts,Math.atan2(-rt.y,rt.z)),pt.multiplyQuaternions(yr,pt),a.quaternion.copy(pt)),a.name==="Y"&&(pt.setFromAxisAngle(pi,Math.atan2(rt.x,rt.z)),pt.multiplyQuaternions(yr,pt),a.quaternion.copy(pt)),a.name==="Z"&&(pt.setFromAxisAngle(As,Math.atan2(rt.y,rt.x)),pt.multiplyQuaternions(yr,pt),a.quaternion.copy(pt))),a.visible=a.visible&&(a.name.indexOf("X")===-1||this.showX),a.visible=a.visible&&(a.name.indexOf("Y")===-1||this.showY),a.visible=a.visible&&(a.name.indexOf("Z")===-1||this.showZ),a.visible=a.visible&&(a.name.indexOf("E")===-1||this.showX&&this.showY&&this.showZ),a.material._color=a.material._color||a.material.color.clone(),a.material._opacity=a.material._opacity||a.material.opacity,a.material.color.copy(a.material._color),a.material.opacity=a.material._opacity,this.enabled&&this.axis&&(a.name===this.axis||this.axis.split("").some(function(c){return a.name===c}))&&(a.material.color.setHex(16776960),a.material.opacity=1)}super.updateMatrixWorld(e)}}class K_ extends Ee{constructor(){super(new kn(1e5,1e5,2,2),new as({visible:!1,wireframe:!0,side:jt,transparent:!0,opacity:.1,toneMapped:!1})),this.isTransformControlsPlane=!0,this.type="TransformControlsPlane"}updateMatrixWorld(e){let t=this.space;switch(this.position.copy(this.worldPosition),this.mode==="scale"&&(t="local"),Mr.copy(Ts).applyQuaternion(t==="local"?this.worldQuaternion:Ir),Ss.copy(pi).applyQuaternion(t==="local"?this.worldQuaternion:Ir),bs.copy(As).applyQuaternion(t==="local"?this.worldQuaternion:Ir),rt.copy(Ss),this.mode){case"translate":case"scale":switch(this.axis){case"X":rt.copy(this.eye).cross(Mr),vn.copy(Mr).cross(rt);break;case"Y":rt.copy(this.eye).cross(Ss),vn.copy(Ss).cross(rt);break;case"Z":rt.copy(this.eye).cross(bs),vn.copy(bs).cross(rt);break;case"XY":vn.copy(bs);break;case"YZ":vn.copy(Mr);break;case"XZ":rt.copy(bs),vn.copy(Ss);break;case"XYZ":case"E":vn.set(0,0,0);break}break;case"rotate":default:vn.set(0,0,0)}vn.length()===0?this.quaternion.copy(this.cameraQuaternion):(sh.lookAt(Nt.set(0,0,0),vn,rt),this.quaternion.setFromRotationMatrix(sh)),super.updateMatrixWorld(e)}}function Z_(i,e){if(i==="node"||i==="instance")return null;switch(i){case"box":return new _t(e.x,e.y,e.z);case"sphere":return new ls(e.x,32,16);case"cylinder":return new Ct(e.x,e.x,e.y,24);case"cone":return new ra(e.x,e.y,24);case"plane":return new kn(e.x,e.y);case"triangle":{const t=e.x,n=e.y,s=new ct,r=new Float32Array([-t/2,0,0,t/2,0,0,0,n,0,t/2,0,0,-t/2,0,0,0,n,0]);return s.setAttribute("position",new Lt(r,3)),s.computeVertexNormals(),s}}}function hs(i,e=()=>null,t){const n=new mn;if(n.userData.partId=t??i.id,n.userData.partName=i.name,n.userData.locked=!!t,n.position.set(i.position.x,i.position.y,i.position.z),n.rotation.set(i.rotation.x,i.rotation.y,i.rotation.z),n.scale.set(i.scale.x,i.scale.y,i.scale.z),i.shape==="instance"&&i.refId){const r=e(i.refId);if(r)console.log("[build] instance",i.id,"refId=",i.refId,"resolved -> refRoot shape=",r.shape,"children=",r.children.length),n.add(hs(r,e,i.id));else{console.log("[build] instance",i.id,"refId=",i.refId,"UNRESOLVED -> placeholder");const a=new Ee(new _t(.4,.4,.4),new gn({color:"#ff5555",wireframe:!0}));a.userData.partId=i.id,n.add(a)}return n}const s=Z_(i.shape,i.size);if(s){const r=i.material.opacity??1,a=new gn({color:new je(i.material.color),roughness:i.material.roughness,metalness:i.material.metalness,side:jt,transparent:r<1,opacity:r}),o=new Ee(s,a);o.name=i.name,o.userData.partId=n.userData.partId,n.add(o)}for(const r of i.children)n.add(hs(r,e,t));return n}function pd(i=10,e=1,t=.12){const n=new mn;n.name="axis-ruler";const s=[{color:15026253,dir:new D(1,0,0),text:r=>`${r}m`},{color:4630360,dir:new D(0,1,0),text:r=>`${r}m`},{color:5213439,dir:new D(0,0,1),text:r=>`${r}m`}];for(const r of s){const a=new tn(new ct().setFromPoints([new D(0,0,0),r.dir.clone().multiplyScalar(i)]),new cs({color:r.color,transparent:!0,opacity:.85}));n.add(a);for(let o=e;o<=i+1e-6;o+=e){const c=r.dir.clone().multiplyScalar(o),l=r.dir.clone().cross(new D(1,1,1));l.lengthSq()<1e-6&&l.set(1,0,0),l.normalize();const h=r.dir.clone().cross(l).normalize(),f=new tn(new ct().setFromPoints([c.clone().add(l.clone().multiplyScalar(-t)),c.clone().add(l.clone().multiplyScalar(t)),c.clone().add(h.clone().multiplyScalar(-t)),c.clone().add(h.clone().multiplyScalar(t))]),new cs({color:r.color,transparent:!0,opacity:.7}));n.add(f);const d=J_(r.text(o),r.color);d.position.copy(c).add(r.dir.clone().multiplyScalar(0)),d.position.add(l.clone().multiplyScalar(t*1.6)),d.position.add(h.clone().multiplyScalar(t*1.6)),n.add(d)}}return n}function J_(i,e){const n=document.createElement("canvas");n.width=128,n.height=128;const s=n.getContext("2d");s.clearRect(0,0,128,128),s.font="bold 64px system-ui, sans-serif",s.textAlign="center",s.textBaseline="middle",s.fillStyle="#"+e.toString(16).padStart(6,"0"),s.fillText(i,128/2,128/2);const r=new T_(n);r.minFilter=nn;const a=new ld({map:r,transparent:!0,depthTest:!1}),o=new E_(a);return o.scale.set(.5,.5,.5),o}function xc(i){const e=document.createElement("div");return e.className="dimension-overlay",i.appendChild(e),t=>{const n=s=>Number.isFinite(s)?s.toFixed(2):"0.00";e.innerHTML=`<span class="dim dim-x">X ${n(t.x)}m</span><span class="dim dim-y">Y ${n(t.y)}m</span><span class="dim dim-z">Z ${n(t.z)}m</span>`}}class md{constructor(e,t,n){ue(this,"container");ue(this,"renderer");ue(this,"scene");ue(this,"camera");ue(this,"controls");ue(this,"transform");ue(this,"rootGroup",new mn);ue(this,"selectedId",null);ue(this,"selectedHolder",null);ue(this,"onSelect");ue(this,"onTransform");ue(this,"grid");ue(this,"ruler");ue(this,"frameCallbacks",[]);ue(this,"clock",new ca);ue(this,"animate",()=>{requestAnimationFrame(this.animate);const e=this.clock.getDelta();for(const t of this.frameCallbacks)t(e);this.controls.update(),this.renderer.render(this.scene,this.camera)});this.container=e,this.onSelect=t,this.onTransform=n,this.scene=new sa,this.scene.background=new je("#1b1d23"),this.camera=new kt(50,1,.1,1e3),this.camera.position.set(4,3,5),this.renderer=new ia({antialias:!0,preserveDrawingBuffer:!0}),this.renderer.setPixelRatio(window.devicePixelRatio),e.appendChild(this.renderer.domElement),this.controls=new _c(this.camera,this.renderer.domElement),this.controls.enableDamping=!0,this.controls.target.set(0,1,0),this.transform=new vc(this.camera,this.renderer.domElement),this.transform.setSize(.8),this.transform.addEventListener("dragging-changed",o=>{this.controls.enabled=!o.value}),this.transform.addEventListener("objectChange",()=>this.emitTransform()),this.scene.add(this.transform.getHelper());const s=new aa("#ffffff","#444455",1.1);this.scene.add(s);const r=new oa("#ffffff",1.4);r.position.set(5,8,4),this.scene.add(r),this.grid=new C_(20,20,"#3a3d47","#2a2c33"),this.scene.add(this.grid),this.ruler=pd(10,1),this.scene.add(this.ruler),this.scene.add(this.rootGroup),this.renderer.domElement.addEventListener("pointerdown",o=>this.handlePick(o)),window.addEventListener("resize",()=>this.resize()),new ResizeObserver(()=>this.resize()).observe(this.container),this.resize(),this.animate()}resize(){const e=this.container.clientWidth||600,t=this.container.clientHeight||400;this.renderer.setSize(e,t);const n=this.renderer.domElement;n.style.display="block",n.style.width="100%",n.style.height="100%",this.camera.aspect=e/t,this.camera.updateProjectionMatrix()}handlePick(e){if(this.transform.dragging||this.transform.axis)return;const t=this.renderer.domElement.getBoundingClientRect(),n=new ke((e.clientX-t.left)/t.width*2-1,-((e.clientY-t.top)/t.height)*2+1),s=new $r;s.setFromCamera(n,this.camera);const r=s.intersectObjects(this.rootGroup.children,!0);if(r.length===0){this.onSelect(null);return}let a=r[0].object;for(;a&&!a.userData.partId;)a=a.parent;this.onSelect((a==null?void 0:a.userData.partId)??null)}setRoot(e,t=()=>null){this.rootGroup.clear(),this.rootGroup.add(hs(e,t));let n=0;this.rootGroup.traverse(s=>{s.isMesh&&n++}),console.log("[viewport] setRoot done, meshes in scene=",n),this.refreshSelection(),this.attachGizmo(this.selectedId)}setSelected(e){this.selectedId=e,this.refreshSelection(),this.attachGizmo(e)}setTransformMode(e){this.transform.setMode(e)}getTransformMode(){return this.transform.getMode()}findHolder(e){let t=null;return this.rootGroup.traverse(n=>{!t&&n.userData.partId===e&&n.isGroup&&(t=n)}),t}attachGizmo(e){if(!e){this.transform.detach(),this.selectedHolder=null;return}const t=this.findHolder(e);t?(this.transform.attach(t),this.selectedHolder=t):(this.transform.detach(),this.selectedHolder=null)}emitTransform(){const e=this.selectedHolder;!e||!this.selectedId||this.onTransform(this.selectedId,{position:{x:e.position.x,y:e.position.y,z:e.position.z},rotation:{x:e.rotation.x,y:e.rotation.y,z:e.rotation.z},scale:{x:e.scale.x,y:e.scale.y,z:e.scale.z}})}refreshSelection(){const e=this.selectedId;this.rootGroup.traverse(t=>{if(t.isMesh){const n=t.material;if(n&&"emissive"in n){let s=!1,r=t;for(;r;){if(r.userData.partId===e){s=!0;break}r=r.parent}n.emissive=new je(s?"#ffb300":"#000000"),n.emissiveIntensity=s?.6:0}}})}getSelectedId(){return this.selectedId}getDimensions(){const e=new Ai().setFromObject(this.rootGroup);if(e.isEmpty())return{x:0,y:0,z:0};const t=new D;return e.getSize(t),{x:t.x,y:t.y,z:t.z}}getRootGroup(){return this.rootGroup}onFrame(e){return this.frameCallbacks.push(e),()=>{this.frameCallbacks=this.frameCallbacks.filter(t=>t!==e)}}captureThumbnail(){return this.renderer.render(this.scene,this.camera),this.renderer.domElement.toDataURL("image/png")}dispose(){this.renderer.dispose(),this.controls.dispose(),this.transform.detach(),this.transform.dispose(),window.removeEventListener("resize",()=>this.resize())}}function Nn(i,e){if(i.id===e)return i;for(const t of i.children){const n=Nn(t,e);if(n)return n}return null}function Yo(i){const t=(i.selectedId?Nn(i.root,i.selectedId):null)??i.root,n=t.shape==="instance"?i.root:t,s=n.children.filter(a=>a.shape==="instance").length,r=Be({shape:"instance",name:i.refName??"Instance",refId:i.refId,position:P(.9+s*.6,.2,.9)});return n.children.push(r),r}function gd(i,e=[]){i.shape==="instance"&&e.push(i);for(const t of i.children)gd(t,e);return e}async function us(i,e=new Map){const t=new Set,n=gd(i);for(const s of n){const r=s.refId;if(!r||e.has(r)||t.has(r))continue;const a=await zs(r);if(!a){t.add(r),console.log("[ref] MISSING asset for refId=",r);continue}console.log("[ref] resolved refId=",r,"-> root shape=",a.root.shape,"children=",a.root.children.length),e.set(r,a.root),await us(a.root,e)}return console.log("[ref] resolveRefs done, map size=",e.size),e}function Q_(i){return{message:"未启用 AI。可在「设置」中配置 OpenAI 兼容接口后，用自然语言自由生成与修改元件（如“加一扇门”“把屋顶改成红色”），也可直接从工具栏添加基础形状 / 插入引用。"}}const ev=`You are a 3D modeling assistant for ShapeCraft. A component is a JSON tree of primitive parts.

SCHEMA (strict JSON shape):
Component = { "name": string, "category": "tree"|"flower"|"grass"|"house"|"rock"|"road"|"decor"|"other", "description": string, "root": Part }
Part = {
  "name": string,
  "shape": "box"|"sphere"|"cylinder"|"cone"|"plane"|"triangle",
  "size": {"x":number,"y":number,"z":number},
  "position": {"x":number,"y":number,"z":number},
  "rotation": {"x":number,"y":number,"z":number},
  "scale": {"x":number,"y":number,"z":number},
  "material": {"color":"#rrggbb","roughness":number0to1,"metalness":number0to1},
  "children": [Part]
}
Geometry notes:
- box: size = width/height/depth
- sphere: size.x = radius
- cylinder: size.x = radius, size.y = height
- cone: size.x = radius, size.y = height
- plane: size.x = width, size.y = height (flat quad)
  - triangle: a flat, double-sided triangle; size.x = width, size.y = height
  - instance: a reference to another saved component (prefab/character). It has
    NO children and NO own geometry; instead set "refId" to the id of the asset
    to embed. The referenced subtree renders as one locked, indivisible unit —
    like a primitive shape — so you can reuse a component without duplicating it.

  SCENE GRAPH / TRANSFORMS:
  - The part tree is a REAL scene graph. Each part's "position", "rotation", and
    "scale" are RELATIVE TO ITS PARENT, and a parent's transform is applied
    (accumulated) to its entire subtree. So to put a leaf on a branch, give the
    leaf a position RELATIVE TO THE BRANCH NODE — never a world coordinate.
    If you need to group several children under a shared local origin, insert an
    invisible container part (a tiny box, e.g. size {x:0.01,y:0.01,z:0.01},
    color "#000000") as their parent.
  - Do NOT center the model at the world origin (do NOT make the object span
    above AND below y=0). Always use a GROUND-BASED coordinate system: the center
    of the object's BASE / FOOTPRINT is (0,0,0) and the whole object sits ON the
    ground — i.e. the bottom of every part rests at y >= 0 and the object grows
    UPWARD (positive y). For example, a trunk of height h sits at position.y = h/2
    so its bottom touches 0 and its top reaches h.

  REAL-WORLD SIZE (always consider real dimensions):
  - Work in METERS and model the object at its real-world size. Before building,
    decide the actual dimensions of the thing it represents (e.g. an oak tree is
    ~8–12 m tall, a chair ~0.45 m seat height, a door ~2 m tall, a cat ~0.3 m at
    the shoulder) and scale every part's size/position to match those measurements.
    Keep the overall footprint and proportions believable, and keep the base
    centered at (0,0,0) as described above.
  - IDs are generated and managed by the system automatically (always unique).
    Do NOT use ids to express parent/child relationships — those come purely
    from the tree nesting. You may omit "id" entirely; any "id" you include
    will be ignored and replaced.

  GENERAL RULES:
- Always respond with ONLY the JSON object, no markdown or prose.
- When CREATING, return the COMPLETE Component (the entire root tree).
- When the user asks to MODIFY an existing component, edit the provided JSON IN PLACE and return the COMPLETE updated Component.
- When MODIFYING, transform the existing relevant parts in the returned tree (resize / recolor / replace shape / move). The returned Component must reflect the change WITHOUT leaving both the old and the new version behind — no redundant duplicates.
- You have full freedom to add, remove, recolor, rescale, rotate, or restructure parts to satisfy the request. Follow the user's intent.
- Keep it coherent and reasonably sized (prefer <= 40 parts). Use pleasing basic materials.
- ALWAYS write your conversational reply in your streamed TEXT (it is shown to the user live). Never put user-facing prose inside the tool arguments.

TOOL USAGE:
- ALWAYS write your natural-language reply to the user as your NORMAL text message (it is streamed to the user live, so they see it immediately). Do NOT put user-facing prose inside the tool arguments.
- Use the \`create_component\` tool ONLY for the structured component data (name / category / description / root / update).
- Set \`update: true\` whenever you actually create or modify a component (it will be saved). Set \`update: false\` when you need MORE information from the user before making any change — then ask your question in the normal text reply and DO NOT include a real component (nothing will be saved).
- Always reply in the SAME language as the user's request.`,tv={name:"Oak Tree",category:"tree",description:"A ~9 m tall stylized oak tree: a 5 m brown trunk standing on the ground, with a flat-triangular-leaf canopy centered on top.",root:{name:"Tree",shape:"box",size:{x:.01,y:.01,z:.01},position:{x:0,y:0,z:0},rotation:{x:0,y:0,z:0},scale:{x:1,y:1,z:1},material:{color:"#000000",roughness:.8,metalness:.05},children:[{name:"Trunk",shape:"cylinder",size:{x:.35,y:5,z:.35},position:{x:0,y:2.5,z:0},rotation:{x:0,y:0,z:0},scale:{x:1,y:1,z:1},material:{color:"#7a4f2a",roughness:.9,metalness:0},children:[]},{name:"Canopy",shape:"box",size:{x:.01,y:.01,z:.01},position:{x:0,y:7,z:0},rotation:{x:0,y:0,z:0},scale:{x:1,y:1,z:1},material:{color:"#000000",roughness:.8,metalness:.05},children:[{name:"Leaf1",shape:"triangle",size:{x:3,y:3,z:.01},position:{x:2,y:.5,z:0},rotation:{x:0,y:0,z:1.2},scale:{x:1,y:1,z:1},material:{color:"#3f8f3a",roughness:.8,metalness:.05},children:[]},{name:"Leaf2",shape:"triangle",size:{x:3,y:3,z:.01},position:{x:-2,y:.5,z:0},rotation:{x:0,y:0,z:-1.2},scale:{x:1,y:1,z:1},material:{color:"#4caf50",roughness:.8,metalness:.05},children:[]},{name:"Leaf3",shape:"triangle",size:{x:3,y:3,z:.01},position:{x:0,y:1,z:2},rotation:{x:1.2,y:0,z:0},scale:{x:1,y:1,z:1},material:{color:"#4caf50",roughness:.8,metalness:.05},children:[]}]}]}},yc=["box","sphere","cylinder","cone","plane","triangle","node","instance"],nv={name:{type:"string"},shape:{type:"string",enum:yc},size:{type:"object",properties:{x:{type:"number"},y:{type:"number"},z:{type:"number"}},additionalProperties:!0},position:{type:"object",properties:{x:{type:"number"},y:{type:"number"},z:{type:"number"}},additionalProperties:!0},rotation:{type:"object",properties:{x:{type:"number"},y:{type:"number"},z:{type:"number"}},additionalProperties:!0},scale:{type:"object",properties:{x:{type:"number"},y:{type:"number"},z:{type:"number"}},additionalProperties:!0},material:{type:"object",properties:{color:{type:"string"},roughness:{type:"number"},metalness:{type:"number"}},additionalProperties:!0},children:{type:"array",items:{type:"object",additionalProperties:!0}}},iv={type:"function",function:{name:"create_component",description:"Build or modify a 3D component as a tree of primitive parts. Call this whenever you actually create or change a component.",parameters:{type:"object",properties:{name:{type:"string"},category:{type:"string",enum:["tree","flower","grass","house","rock","road","decor","other"]},description:{type:"string"},update:{type:"boolean",description:"Set true when you create/modify the component and want it saved. Set false when you need MORE information from the user before making any change — then no component is produced and nothing is saved."},root:{type:"object",description:"Root part of the component tree (each part may contain children parts).",properties:nv,additionalProperties:!0}},required:["name","category","update","root"]}}};function Cs(i,e){return typeof i=="number"&&isFinite(i)?i:e}function Sr(i,e,t,n){return{x:Cs(i==null?void 0:i.x,e),y:Cs(i==null?void 0:i.y,t),z:Cs(i==null?void 0:i.z,n)}}function _d(i,e){var r,a,o;e.i+=1;const t=yc.includes(i==null?void 0:i.shape)?i.shape:"box",n=typeof((r=i==null?void 0:i.material)==null?void 0:r.color)=="string"?i.material.color:"#cccccc",s=t==="instance"?[]:Array.isArray(i==null?void 0:i.children)?i.children.map(c=>_d(c,e)):[];return{id:Is(),name:typeof(i==null?void 0:i.name)=="string"?i.name:`Part${e.i}`,shape:t,size:Sr(i==null?void 0:i.size,1,1,1),position:Sr(i==null?void 0:i.position,0,0,0),rotation:Sr(i==null?void 0:i.rotation,0,0,0),scale:Sr(i==null?void 0:i.scale,1,1,1),material:{color:n,roughness:Math.max(0,Math.min(1,Cs((a=i==null?void 0:i.material)==null?void 0:a.roughness,.8))),metalness:Math.max(0,Math.min(1,Cs((o=i==null?void 0:i.material)==null?void 0:o.metalness,.05)))},children:s,...t==="instance"&&typeof(i==null?void 0:i.refId)=="string"?{refId:i.refId}:{}}}function sv(i){if(!(i!=null&&i.asset))return null;const e=i.asset;return{name:e.name,category:e.category,description:e.description,root:e.root}}async function vd(i,e,t,n){var ne,_,M,O,k,q;const s=Us(),r=`${s.baseUrl.replace(/\/+$/,"")}/chat/completions`,a=sv(e),o=a?`Current component (modify it as requested, return the FULL updated JSON):
${JSON.stringify(a)}

Request: ${i}`:`Create a new 3D component for: ${i}`;let c;if(n!=null&&n.verify){const V=[{type:"text",text:"Below is a rendered preview image of the current component. Visually verify whether it achieves the user’s intent (correct shapes, structure, proportions, colors, no obvious errors). If there is still something to improve or finish, return the COMPLETE updated component via the create_component tool (update:true). If it already satisfies the requirement, simply reply with the word “完成” in text — do NOT call the tool and do NOT return a component (update:false)."}];a&&V.push({type:"text",text:`Current component JSON:
${JSON.stringify(a)}`});for(const ie of n.images??[])V.push({type:"image_url",image_url:{url:ie}});c={role:"user",content:V}}else c={role:"user",content:o};const l={model:s.model,temperature:.6,stream:!0,tools:[iv],tool_choice:"auto",messages:[{role:"system",content:ev},{role:"assistant",content:`Understood. Here is an example component in the expected format:
`+JSON.stringify(tv)},c]};console.log("[agent] AI request ->",r,JSON.stringify(l,null,2));const h=await fetch(r,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${s.apiKey}`},body:JSON.stringify(l)});if(!h.ok){const W=await h.text().catch(()=>"");throw console.error("[agent] AI request failed",h.status,W.slice(0,200)),new Error(`HTTP ${h.status} ${W.slice(0,120)}`)}const f=h.body.getReader(),d=new TextDecoder;let p="",g="",x="",u="",m="";const w=W=>{W&&W!==m&&(m=W,t==null||t(W))};for(;;){const{done:W,value:V}=await f.read();if(W)break;p+=d.decode(V,{stream:!0});let ie;for(;(ie=p.indexOf(`
`))>=0;){const K=p.slice(0,ie).trim();if(p=p.slice(ie+1),!K.startsWith("data:"))continue;const me=K.slice(5).trim();if(me==="[DONE]")continue;u+=me+`
`;let xe;try{xe=JSON.parse(me)}catch{continue}const ve=((_=(ne=xe==null?void 0:xe.choices)==null?void 0:ne[0])==null?void 0:_.delta)??{};typeof ve.content=="string"?(g+=ve.content,w(g)):x&&w(x);const se=(M=ve.tool_calls)==null?void 0:M[0];(O=se==null?void 0:se.function)!=null&&O.arguments&&(x+=se.function.arguments,g||w(x))}}const S=u.trim()||g||x;if(!S)throw new Error("模型未返回任何内容");if(console.log("[agent] AI raw response ->",S),!x){const W=g.trim();if(!W)throw new Error("模型未返回任何内容");return{message:W,usedLLM:!0,raw:S}}let y;try{y=JSON.parse(x)}catch{throw new Error(`模型未返回合法的 JSON（收到：${x.slice(0,80)}）`)}const L=g.trim()||(typeof(y==null?void 0:y.description)=="string"?y.description.trim():"");if((y==null?void 0:y.update)===!1)return{message:L||"需要更多信息后再修改（未更新数据）。",usedLLM:!0,raw:S};const C=_d((y==null?void 0:y.root)??y,{i:0});if(!C.children.length&&C.shape==="box"&&C.size.x===1&&C.size.y===1)throw new Error("模型未返回有效的元件结构");const R=Rs(typeof(y==null?void 0:y.name)=="string"?y.name:((k=e==null?void 0:e.asset)==null?void 0:k.name)??"AI Component",yc.includes(y==null?void 0:y.category)?y.category:((q=e==null?void 0:e.asset)==null?void 0:q.category)??"other");return R.root=C,R.description=typeof(y==null?void 0:y.description)=="string"?y.description:`由 AI 生成：${i}`,{message:L||`已更新「${R.name}」`,asset:R,usedLLM:!0,raw:S}}async function rv(i,e,t){const n=Us();if(!n.enabled||!n.apiKey)return Q_();try{return await vd(i,e,t)}catch(s){return{message:`AI 调用失败：${s.message}`,usedLLM:!0}}}async function av(i,e,t){const n=Us();if(!n.enabled||!n.apiKey)return{message:"未启用 AI，跳过可视化验证。",usedLLM:!1};try{return await vd("",{asset:i},t,{images:[e],verify:!0})}catch(s){return{message:`AI 验证失败：${s.message}`,usedLLM:!0}}}const ov="shape-craft:chat-history:",rh=100;function cv(i){const e=ov+i;let t=[],n=0;try{const r=localStorage.getItem(e),a=r?JSON.parse(r):[];Array.isArray(a)&&(t=a.filter(o=>typeof o=="string"))}catch{}n=t.length;const s=()=>{try{localStorage.setItem(e,JSON.stringify(t))}catch{}};return{push(r){t.push(r),t.length>rh&&(t=t.slice(-rh)),s(),n=t.length},prev(){return n<=0?null:(n--,t[n])},next(){return n<t.length-1?(n++,t[n]):(n=t.length,"")},reset(){n=t.length}}}async function lv(i,e){var le;const t=document.createElement("div");t.className="page editor-page",t.appendChild(Fn("library")),i.appendChild(t);let n,s=e;if(e){const A=await zs(e);if(!A){t.innerHTML+='<p class="empty">未找到该元件。</p>';return}n=A}else n=Rs("Untitled","other");const r=document.createElement("div");r.className="editor-layout";const a=document.createElement("div");a.className="panel hierarchy";const o=document.createElement("div");o.className="panel viewport-panel";const c=document.createElement("div");c.className="panel inspector",r.append(a,o,c),t.appendChild(r);const l=document.createElement("div");l.className="toolbar",l.innerHTML=`
    <div class="toolbar-row">
      <span class="muted">基础形状：</span>
      <button class="btn small" data-add="box">Box</button>
      <button class="btn small" data-add="sphere">Sphere</button>
      <button class="btn small" data-add="cylinder">Cylinder</button>
      <button class="btn small" data-add="cone">Cone</button>
      <button class="btn small" data-add="plane">Plane</button>
      <button class="btn small" data-add="node">Node 节点</button>
    </div>
    <div class="toolbar-row">
      <span class="muted">引用：</span>
      <div class="ref-combo" data-ref-combo>
        <input class="ref-search" data-ref-search placeholder="搜索元件…" autocomplete="off" />
        <div class="ref-list" data-ref-list hidden></div>
      </div>
      <button class="btn small" data-insert-ref>插入引用</button>
    </div>
    <div class="toolbar-row">
      <span class="muted">变换：</span>
      <button class="btn small mode active" data-mode="translate">拖拽</button>
      <button class="btn small mode" data-mode="rotate">旋转</button>
      <button class="btn small mode" data-mode="scale">缩放</button>
      <span class="sep"></span>
      <button class="btn small" data-shot>📷 截图</button>
    </div>
  `,o.appendChild(l);let h=[],f=null;const d=l.querySelector("[data-ref-search]"),p=l.querySelector("[data-ref-list]");function g(A){const I=A.trim().toLowerCase(),X=h.filter(Y=>!I||Y.name.toLowerCase().includes(I)||Y.category.toLowerCase().includes(I));X.length?p.innerHTML=X.slice(0,8).map(Y=>`<div class="ref-item${Y.id===f?" active":""}" data-ref-id="${Y.id}">${Y.name} · ${Y.category}</div>`).join(""):p.innerHTML='<div class="ref-empty">无匹配元件</div>',p.hidden=!1}d.addEventListener("focus",async()=>{h.length||await ie(),g(d.value)}),d.addEventListener("input",()=>{f=null,g(d.value)}),d.addEventListener("keydown",A=>{if(A.key==="Enter"){const I=p.querySelector(".ref-item");I&&I.click()}else A.key==="Escape"&&(p.hidden=!0)}),t.addEventListener("click",A=>{l.querySelector("[data-ref-combo]").contains(A.target)||(p.hidden=!0)});const x=document.createElement("div");x.className="viewport-host",o.appendChild(x);const u=new md(x,A=>C(A),(A,I)=>R(A,I)),m=xc(x),w=document.createElement("div");w.className="editor-topbar",w.innerHTML=`
    <a class="btn small" href="#/library">← 返回</a>
    <input class="name-input" type="text" value="${n.name}" />
    <select class="cat-input">${du(n.category)}</select>
    <button class="btn primary" data-save>保存</button>
    ${s?'<button class="btn danger" data-del>删除</button>':""}
    <span class="save-state"></span>
  `,t.insertBefore(w,r),a.addEventListener("click",A=>{const I=A.target.closest(".row-del");if(!I)return;const X=I.getAttribute("data-del-id");X&&(Dr(n.root,X),L===X&&(L=null),V())});function S(){a.innerHTML='<h4>层级结构</h4><div class="tree"></div>',a.querySelector(".tree").appendChild(y(n.root,!0))}function y(A,I){const X=document.createElement("div");X.className="tree-row"+(u.getSelectedId()===A.id?" selected":"");const Y=A.shape==="instance"?'<span class="lock" title="实例引用（整体锁定）">🔒</span>':"";X.innerHTML=`<span class="dot ${A.shape}"></span><span class="pname">${A.name}</span><span class="pshape">${A.shape}</span>${Y}<button class="row-del" title="删除该部件及其子级" data-del-id="${A.id}">×</button>`,X.addEventListener("click",U=>{U.target.classList.contains("row-del")||C(A.id)});const fe=document.createElement("div");if(fe.appendChild(X),A.children.length){const U=document.createElement("div");U.className="tree-kids";for(const te of A.children)U.appendChild(y(te,!1));fe.appendChild(U)}return I&&fe.classList.add("root-node"),fe}let L=null;function C(A){L=A,u.setSelected(A),S(),ne()}function R(A,I){const X=Nn(n.root,A);X&&(X.position=I.position,X.rotation=I.rotation,X.scale=I.scale,ne())}function z(){c.innerHTML='<h4>属性</h4><div class="inspector-body"></div><h4 class="chat-title">聊天建造</h4><div class="chat"></div>',q(c.querySelector(".chat"),`asset:${s??"new"}`),ne()}function ne(){const A=c.querySelector(".inspector-body"),I=L?Nn(n.root,L):null;A.innerHTML="",I?A.appendChild(O(I)):A.innerHTML='<p class="muted">在视图或层级中选中一个部件以编辑其变换与材质。</p>'}function _(A,I,X){const Y=document.createElement("label");Y.className="field",Y.innerHTML=`<span>${A}</span>`;const fe=document.createElement("input");return fe.type="number",fe.step="0.1",fe.value=String(I),fe.addEventListener("input",()=>X(parseFloat(fe.value)||0)),Y.appendChild(fe),Y}function M(A,I,X){const Y=document.createElement("div");Y.className="vec3";const fe=["X","Y","Z"];return["x","y","z"].forEach((U,te)=>{Y.appendChild(_(`${A} ${fe[te]}`,I[U],ye=>X({...I,[U]:ye})))}),Y}function O(A){if(A.shape==="instance")return k(A);const I=document.createElement("div");I.className="inspector-form";const X=document.createElement("label");X.className="field full",X.innerHTML="<span>名称</span>";const Y=document.createElement("input");Y.value=A.name,Y.addEventListener("input",()=>{A.name=Y.value,S()}),X.appendChild(Y),I.appendChild(X);const fe=document.createElement("label");fe.className="field full",fe.innerHTML="<span>形状</span>";const U=document.createElement("select");["box","sphere","cylinder","cone","plane","triangle","node"].forEach(ae=>{const pe=document.createElement("option");pe.value=ae,pe.textContent=ae,ae===A.shape&&(pe.selected=!0),U.appendChild(pe)}),U.addEventListener("change",()=>{A.shape=U.value,W()}),fe.appendChild(U),I.appendChild(fe);const te=(ae,pe,ge)=>{const De=document.createElement("div");return De.className="group",De.innerHTML=`<div class="group-title">${ae}</div>`,De.appendChild(M(ae,pe,ge)),De};I.appendChild(te("尺寸 Size",A.size,ae=>{A.size=ae,W()})),I.appendChild(te("位置 Position",A.position,ae=>{A.position=ae,W()})),I.appendChild(te("旋转 Rotation (rad)",A.rotation,ae=>{A.rotation=ae,W()})),I.appendChild(te("缩放 Scale",A.scale,ae=>{A.scale=ae,W()}));const ye=document.createElement("div");ye.className="group",ye.innerHTML='<div class="group-title">材质 Material</div>';const de=document.createElement("label");de.className="field",de.innerHTML="<span>颜色</span>";const E=document.createElement("input");E.type="color",E.value=A.material.color,E.addEventListener("input",()=>{A.material.color=E.value,W()}),de.appendChild(E),ye.appendChild(de),ye.appendChild(_("Roughness",A.material.roughness,ae=>{A.material.roughness=ah(ae),W()})),ye.appendChild(_("Metalness",A.material.metalness,ae=>{A.material.metalness=ah(ae),W()})),I.appendChild(ye);const B=document.createElement("button");return B.className="btn small danger full",B.textContent="删除此部件",B.addEventListener("click",()=>{Dr(n.root,A.id),L=null,V()}),I.appendChild(B),I}function k(A){const I=document.createElement("div");I.className="inspector-form",I.innerHTML=`
      <div class="group">
        <div class="group-title">实例引用 Instance</div>
        <p class="muted">该部件整体引用了另一个元件，内部细节不可在此编辑。</p>
        <label class="field full"><span>名称</span></label>
        <input class="inst-name" type="text" value="${A.name}" />
        <label class="field full"><span>引用 ID</span></label>
        <input class="inst-ref" type="text" value="${A.refId??""}" readonly />
      </div>
    `;const X=I.querySelector(".inst-name");X.addEventListener("input",()=>{A.name=X.value,S()});const Y=document.createElement("a");Y.className="btn small full",Y.textContent="打开原件编辑器 →",Y.href=`#/editor/${A.refId}`,I.appendChild(Y);const fe=document.createElement("button");return fe.className="btn small danger full",fe.textContent="删除此引用",fe.addEventListener("click",()=>{Dr(n.root,A.id),L=null,V()}),I.appendChild(fe),I}function q(A,I){A.innerHTML=`
      <div class="chat-log"></div>
      <div class="chat-input">
        <input type="text" placeholder="例如：帮我造一棵树 / 给这棵树添加叶子 / 把屋顶改成红色" />
        <button class="btn small primary">发送</button>
      </div>
      <div class="chat-status">
        <span class="dot"></span><span class="dot"></span><span class="dot"></span>
        <span class="chat-status-text"></span>
      </div>
    `;const X=A.querySelector(".chat-log"),Y=A.querySelector("input"),fe=A.querySelector("button"),U=A.querySelector(".chat-status"),te=A.querySelector(".chat-status-text");let ye=0;const de=(pe,ge="AI 正在思考…")=>{ye=Math.max(0,ye+(pe?1:-1)),ye>0?(te.textContent=ge,U.classList.add("active")):(U.classList.remove("active"),te.textContent="")},E=cv(I),B=(pe,ge)=>{const De=document.createElement("div");return De.className=`chat-msg ${ge}`,De.textContent=pe,X.appendChild(De),X.scrollTop=X.scrollHeight,De},ae=async()=>{var v;const pe=Y.value.trim();if(!pe)return;E.push(pe),B(pe,"user"),Y.value="",fe.disabled=!0,de(!0,"AI 正在思考…");const ge=B("","bot");ge.classList.add("thinking"),ge.innerHTML='<span class="dot"></span><span class="dot"></span><span class="dot"></span>';const De=N=>{ge.classList.remove("thinking"),ge.classList.add("editing"),ge.textContent=N,X.scrollTop=X.scrollHeight},he=async(N,J)=>{var be;const ce=B("","bot");ce.classList.add("thinking"),ce.innerHTML='<span class="dot"></span><span class="dot"></span><span class="dot"></span>';const Ae=await av(N,J,we=>{ce.classList.remove("thinking"),ce.classList.add("editing"),ce.textContent=we,X.scrollTop=X.scrollHeight});if(ce.classList.remove("thinking","editing"),(!((be=ce.textContent)!=null&&be.trim())||Ae.message)&&(ce.textContent=Ae.message),X.scrollTop=X.scrollHeight,Ae.raw){const we=document.createElement("details");we.className="chat-raw";const qe=document.createElement("summary");qe.textContent="查看 AI 完整返回";const Me=document.createElement("pre");Me.textContent=Ae.raw,we.append(qe,Me),X.appendChild(we),X.scrollTop=X.scrollHeight}return Ae},b=await rv(pe,{asset:n,selectedId:L,isNew:!s},De);if(fe.disabled=!1,ge.classList.remove("thinking","editing"),(!((v=ge.textContent)!=null&&v.trim())||b.message)&&(ge.textContent=b.message),X.scrollTop=X.scrollHeight,b.raw){const N=document.createElement("details");N.className="chat-raw";const J=document.createElement("summary");J.textContent="查看 AI 完整返回";const ce=document.createElement("pre");ce.textContent=b.raw,N.append(J,ce),X.appendChild(N),X.scrollTop=X.scrollHeight}if(b.asset){let J=0,ce=b.asset;for(;ce;){n=ce,w.querySelector(".name-input").value=n.name,w.querySelector(".cat-input").value=n.category,L&&!Nn(n.root,L)&&(L=null);const oe=await se();if(me(oe==="failed"?"AI 结果已载入，但自动保存失败（可手动保存）":"AI 已修改并保存 ✓"),V(),J>=3)break;J++;const Ae=Us();if(!Ae.enabled||!Ae.apiKey)break;if(!Ae.supportsVision){B("（当前接口未启用图片验证，跳过自动校验）","bot");break}const be=u.captureThumbnail();B("（已渲染预览，发送给模型校验是否仍需修改…）","bot"),de(!0,"AI 正在编辑…");const we=await he(n,be);if(de(!1),ce=we.asset,!ce)break}}de(!1)};fe.addEventListener("click",ae),Y.addEventListener("keydown",pe=>{if(pe.key==="Enter")ae();else if(pe.key==="ArrowUp"){pe.preventDefault();const ge=E.prev();ge!==null&&(Y.value=ge,Y.setSelectionRange(Y.value.length,Y.value.length))}else pe.key==="ArrowDown"&&(pe.preventDefault(),Y.value=E.next(),Y.setSelectionRange(Y.value.length,Y.value.length))}),B("你好！我可以修改当前元件（如“把屋顶改成红色”“加一扇门”），也能插入引用其它元件，并自动保存。","bot")}async function W(){const A=await us(n.root),I=function X(Y){let fe=Y.shape==="instance"?1:0;for(const U of Y.children)fe+=X(U);return fe}(n.root);console.log("[editor] refresh: instances in asset.root=",I,"refs.size=",A.size),u.setRoot(n.root,X=>A.get(X)??null),L&&u.setSelected(L)}function V(){W(),m(u.getDimensions()),S(),ne()}async function ie(){h=(await On()).filter(A=>A.id!==s),f&&!h.some(A=>A.id===f)&&(f=null,d.value="")}function K(A){let I=L&&Nn(n.root,L)||n.root;I.shape==="instance"&&(I=n.root);const X=A==="node",Y=Be({shape:A,name:X?`Node ${I.children.length+1}`:`${A[0].toUpperCase()}${A.slice(1)} ${I.children.length+1}`,material:fn(A==="sphere"||A==="cone"?"#4caf50":"#cccccc"),size:A==="box"?P(.6,.6,.6):A==="sphere"?P(.4,.4,.4):A==="plane"?P(1,1,1):P(.3,.8,.3),position:P(0,X?0:A==="cylinder"||A==="cone"?.4:.3,0)});I.children.push(Y),C(Y.id),W()}l.addEventListener("click",async A=>{var ye,de,E,B,ae;const I=A.target,X=(ye=I.getAttribute)==null?void 0:ye.call(I,"data-add"),Y=(de=I.hasAttribute)==null?void 0:de.call(I,"data-shot"),fe=(E=I.getAttribute)==null?void 0:E.call(I,"data-mode");X&&K(X);const U=(B=I.getAttribute)==null?void 0:B.call(I,"data-ref-id");if(U){f=U;const pe=h.find(ge=>ge.id===U);d.value=(pe==null?void 0:pe.name)??"",p.hidden=!0,g(d.value)}if(fe&&(u.setTransformMode(fe),l.querySelectorAll(".mode").forEach(pe=>pe.classList.remove("active")),I.classList.add("active")),(ae=I.hasAttribute)==null?void 0:ae.call(I,"data-insert-ref")){const pe=f;if(!pe)return;const ge=h.find(he=>he.id===pe),De=Yo({root:n.root,selectedId:L,refId:pe,refName:(ge==null?void 0:ge.name)??"Instance"});C(De.id),V()}Y&&(n.thumbnail=u.captureThumbnail(),s?(await Ls(s,ve()),me("已截图并保存 ✓")):me("已截图（保存后将按当前视图刷新）"))});function me(A){const I=w.querySelector(".save-state");I.textContent=A}function xe(){if(!w.querySelector("[data-del]")){const I=document.createElement("button");I.className="btn danger",I.setAttribute("data-del",""),I.textContent="删除",w.insertBefore(I,w.querySelector(".save-state"))}}function ve(){return{name:n.name,category:n.category,description:n.description,root:n.root,thumbnail:n.thumbnail}}async function se(){const A=w.querySelector(".name-input").value||"Untitled",I=w.querySelector(".cat-input").value;n.name=A,n.category=I,n.thumbnail=u.captureThumbnail();try{if(s)return await Ls(s,ve()),"updated";const X=await dn(ve());return s=X.id,n.id=X.id,n.createdAt=X.updatedAt,xe(),ie(),"created"}catch(X){return me("保存失败："+X.message),"failed"}}w.querySelector("[data-save]").addEventListener("click",async()=>{await se()!=="failed"&&me("已保存 ✓")}),(le=w.querySelector("[data-del]"))==null||le.addEventListener("click",async()=>{s&&confirm("确定删除该元件？")&&(await nc(s),location.hash="#/library")}),z(),ie(),V(),new URLSearchParams(location.hash.split("?")[1]||"").has("ref")&&(async()=>{if(await ie(),h.length){const A=h[0],I=Yo({root:n.root,selectedId:L,refId:A.id,refName:A.name});C(I.id),V()}})()}function Dr(i,e){const t=i.children.findIndex(n=>n.id===e);if(t!==-1)return i.children.splice(t,1),!0;for(const n of i.children)if(Dr(n,e))return!0;return!1}function ah(i){return Math.max(0,Math.min(1,i))}const Mc="shapecraft.scenes.v1",hv="/api/scenes",dv=new Set;function bi(){dv.forEach(i=>i())}let oh=class extends Error{constructor(t,n){super(t);ue(this,"status");this.name="HttpError",this.status=n}};async function ks(i,e){if(Ds())return null;try{const t=await fetch(`${hv}${i}`,{headers:{"Content-Type":"application/json"},...e});if(!t.ok){let n=t.statusText;try{const s=await t.json();s!=null&&s.message&&(n=s.message)}catch{}throw new oh(n,t.status)}return await t.json()}catch(t){if(t instanceof oh)throw t;return null}}function Bs(){try{const i=localStorage.getItem(Mc);return i?JSON.parse(i):[]}catch{return[]}}function Sc(i){localStorage.setItem(Mc,JSON.stringify(i))}async function la(){const i=await ks("");return i||Bs()}async function Yr(i){const e=await ks(`/${i}`);return e||(Bs().find(t=>t.id===i)??null)}async function bc(i){const e=await ks("",{method:"POST",body:JSON.stringify(i)});if(e)return bi(),e;const t=Bs(),n=new Date().toISOString(),s={id:`scene_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,8)}`,...i,createdAt:n,updatedAt:n};return t.push(s),Sc(t),bi(),s}async function uv(i,e){const t=await ks(`/${i}`,{method:"PUT",body:JSON.stringify({id:i,...e})});if(t)return bi(),t;const n=Bs(),s=n.findIndex(a=>a.id===i);if(s===-1)throw new Error("Scene not found");const r={...n[s],...e,id:n[s].id,createdAt:n[s].createdAt,updatedAt:new Date().toISOString()};return n[s]=r,Sc(n),bi(),r}async function xd(i){const e=await ks(`/${i}`,{method:"DELETE"});if(e&&e.deleted){bi();return}const t=Bs().filter(n=>n.id!==i);Sc(t),bi()}function fv(){bi()}const Ec="shapecraft.animations.v1",pv="/api/animations",mv=new Set;function Ei(){mv.forEach(i=>i())}class ch extends Error{constructor(t,n){super(t);ue(this,"status");this.name="HttpError",this.status=n}}async function Hs(i,e){if(Ds())return null;try{const t=await fetch(`${pv}${i}`,{headers:{"Content-Type":"application/json"},...e});if(!t.ok){let n=t.statusText;try{const s=await t.json();s!=null&&s.message&&(n=s.message)}catch{}throw new ch(n,t.status)}return await t.json()}catch(t){if(t instanceof ch)throw t;return null}}function Gs(){try{const i=localStorage.getItem(Ec);return i?JSON.parse(i):[]}catch{return[]}}function wc(i){localStorage.setItem(Ec,JSON.stringify(i))}async function Tc(i){const e=await Hs(`/scene/${i}`);return e||Gs().filter(t=>t.sceneId===i)}async function yd(i){const e=await Hs(`/${i}`);return e||(Gs().find(t=>t.id===i)??null)}async function Ac(i){const e=await Hs("",{method:"POST",body:JSON.stringify(i)});if(e)return Ei(),e;const t=Gs(),n=new Date().toISOString(),s={id:`anim_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,8)}`,...i,createdAt:n,updatedAt:n};return t.push(s),wc(t),Ei(),s}async function Md(i,e){const t=await Hs(`/${i}`,{method:"PUT",body:JSON.stringify({id:i,...e})});if(t)return Ei(),t;const n=Gs(),s=n.findIndex(a=>a.id===i);if(s===-1)throw new Error("Animation not found");const r={...n[s],...e,id:n[s].id,createdAt:n[s].createdAt,updatedAt:new Date().toISOString()};return n[s]=r,wc(n),Ei(),r}async function Sd(i){const e=await Hs(`/${i}`,{method:"DELETE"});if(e&&e.deleted){Ei();return}const t=Gs().filter(n=>n.id!==i);wc(t),Ei()}function gv(){Ei()}const _v="shapecraft.maps.v1",vv=new Set;function xv(){vv.forEach(i=>i())}function yv(){xv()}const Mv=(()=>{const i=new Uint32Array(256);for(let e=0;e<256;e++){let t=e;for(let n=0;n<8;n++)t=t&1?3988292384^t>>>1:t>>>1;i[e]=t>>>0}return i})();function bd(i){let e=4294967295;for(let t=0;t<i.length;t++)e=Mv[(e^i[t])&255]^e>>>8;return(e^4294967295)>>>0}function Sv(i){return new TextEncoder().encode(i)}async function bv(i){const e=globalThis.CompressionStream;if(!e)return i;try{const t=new Response(new Blob([i]).stream().pipeThrough(new e("deflate-raw")));return new Uint8Array(await t.arrayBuffer())}catch{return i}}async function Ev(i){const e=globalThis.DecompressionStream;if(!e)throw new Error("当前浏览器不支持 DecompressionStream，无法解压 ZIP");const t=new Response(new Blob([i]).stream().pipeThrough(new e("deflate-raw")));return new Uint8Array(await t.arrayBuffer())}function mt(i,e){i.push(e&255,e>>>8&255)}function Zt(i,e){i.push(e&255,e>>>8&255,e>>>16&255,e>>>24&255)}const wv=67324752,Ed=33639248,Tv=101010256;async function Av(i){const e=[],t=[];let n=0;for(const a of i){const o=Sv(a.name),c=bd(a.data),l=await bv(a.data),h=l.length<a.data.length?8:0,f=h===8?l:a.data,d=n;Zt(e,wv),mt(e,20),mt(e,0),mt(e,h),mt(e,0),mt(e,0),Zt(e,c),Zt(e,f.length),Zt(e,a.data.length),mt(e,o.length),mt(e,0);for(const p of o)e.push(p);for(const p of f)e.push(p);n+=30+o.length+f.length,Zt(t,Ed),mt(t,20),mt(t,20),mt(t,0),mt(t,h),mt(t,0),mt(t,0),Zt(t,c),Zt(t,f.length),Zt(t,a.data.length),mt(t,o.length),mt(t,0),mt(t,0),mt(t,0),mt(t,0),Zt(t,0),Zt(t,d);for(const p of o)t.push(p)}const s=t.length,r=n;for(const a of t)e.push(a);return Zt(e,Tv),mt(e,0),mt(e,0),mt(e,i.length),mt(e,i.length),Zt(e,s),Zt(e,r),mt(e,0),new Blob([new Uint8Array(e)],{type:"application/zip"})}async function Rv(i){const e=new Uint8Array(await i.arrayBuffer()),t=new DataView(e.buffer,e.byteOffset,e.byteLength);let n=-1;const s=Math.max(0,e.length-22-65535);for(let l=e.length-22;l>=s;l--)if(e[l]===80&&e[l+1]===75&&e[l+2]===5&&e[l+3]===6){n=l;break}if(n<0)throw new Error("无效的 ZIP 文件（找不到目录结尾）");const r=t.getUint16(n+10,!0),a=t.getUint32(n+16,!0),o=[];let c=a;for(let l=0;l<r;l++){if(t.getUint32(c,!0)!==Ed)throw new Error("损坏的 ZIP 目录");const h=t.getUint16(c+10,!0),f=t.getUint32(c+16,!0),d=t.getUint32(c+20,!0),p=t.getUint16(c+28,!0),g=t.getUint16(c+30,!0),x=t.getUint16(c+32,!0),u=t.getUint32(c+42,!0),m=e.subarray(c+46,c+46+p),w=new TextDecoder().decode(m),S=t.getUint16(u+26,!0),y=t.getUint16(u+28,!0),L=u+30+S+y,C=e.subarray(L,L+d);let R;if(h===0)R=C;else if(h===8)R=await Ev(C);else throw new Error(`ZIP 使用了不支持的压缩方式：${h}`);if(bd(R)!==f)throw new Error(`ZIP 文件校验失败：${w}`);o.push({name:w,data:R}),c+=46+p+g+x}return o}const Ko=[{lsKey:ec,file:"assets.json"},{lsKey:Mc,file:"scenes.json"},{lsKey:_v,file:"maps.json"},{lsKey:Ec,file:"animations.json"}],Cv="meta.json",Ur="settings.json";function lh(i){try{return localStorage.getItem(i)??""}catch{return""}}async function Lv(){const i=Ko.map(e=>({name:e.file,data:new TextEncoder().encode(lh(e.lsKey)||"[]")}));return i.push({name:Ur,data:new TextEncoder().encode(lh(Zr)||"{}")}),i.push({name:Cv,data:new TextEncoder().encode(JSON.stringify({app:"ShapeCraft",format:1,exportedAt:new Date().toISOString(),localMode:Ds(),collections:Ko.map(e=>e.file)}))}),Av(i)}async function Pv(i){const e=await Rv(i),t=new Map(e.map(r=>[r.name,r])),n={imported:[],skipped:[],errors:[]};for(const r of Ko){const a=t.get(r.file);if(!a){n.skipped.push(r.file);continue}const o=new TextDecoder().decode(a.data);try{const c=JSON.parse(o);if(!Array.isArray(c))throw new Error("collection must be a JSON array");localStorage.setItem(r.lsKey,o),n.imported.push(r.file)}catch{n.errors.push(r.file)}}const s=t.get(Ur);if(s){const r=new TextDecoder().decode(s.data);try{const a=JSON.parse(r);if(a===null||typeof a!="object"||Array.isArray(a))throw new Error("settings must be a JSON object");localStorage.setItem(Zr,r),n.imported.push(Ur)}catch{n.errors.push(Ur)}}return Iv(),n}function Iv(){vu(),fv(),yv(),gv()}function Dv(i){var l,h,f;const e=document.createElement("div");e.className="page",e.appendChild(Fn("settings"));const t=document.createElement("div");t.className="settings-page",e.appendChild(t);const n=Us(),s=Ds();t.innerHTML=`
    <section class="settings-card">
      <h2>设置 · OpenAI 兼容接口</h2>
      <p class="muted">配置后，聊天框将调用真实大模型自动创建元件；未启用时回退到内置规则生成。可指向任意 OpenAI 兼容服务，包括本地模型（如 Ollama）。</p>
      <form class="settings-form">
        <label class="field full">
          <span>启用 AI 生成</span>
          <input type="checkbox" class="enabled" ${n.enabled?"checked":""} />
        </label>
        <label class="field full">
          <span>API Key</span>
          <input type="password" class="apiKey" value="${n.apiKey}" placeholder="sk-..." />
        </label>
        <label class="field full">
          <span>Model</span>
          <input type="text" class="model" value="${n.model}" placeholder="gpt-4o-mini" />
        </label>
        <label class="field full">
          <span>Base URL（OpenAI 兼容）</span>
          <input type="text" class="baseUrl" value="${n.baseUrl}" placeholder="https://api.openai.com/v1" />
        </label>
        <label class="field full">
          <span>支持图片输入（视觉校验）</span>
          <input type="checkbox" class="supportsVision" ${n.supportsVision?"checked":""} />
          <small class="muted">开启后，AI 改完元件会自动渲染预览图发给模型，校验是否仍需继续修改。需接口支持 vision。</small>
        </label>
        <div class="settings-actions">
          <button type="button" class="btn ghost preset-ollama">加载本地模型预设 (Ollama)</button>
          <span class="save-state"></span>
          <button type="submit" class="btn primary">保存</button>
        </div>
      </form>
    </section>

    <section class="settings-card">
      <h2>数据库 · 本地优先</h2>
      <p class="muted">所有数据默认保存在浏览器本地（localStorage），不依赖后端服务器。可把整个数据库导出为 ZIP 备份或迁移，再导入恢复。</p>
      <div class="settings-form">
        <label class="field full">
          <span>本地模式（不连接后端服务器）</span>
          <input type="checkbox" class="localMode" ${s?"checked":""} />
          <small class="muted">开启后，所有读写都使用本地存储，完全离线可用。关闭则尝试连接后端 /api 服务。</small>
        </label>
        <div class="settings-actions db-actions">
          <button type="button" class="btn primary export-db">导出数据库 (ZIP)</button>
          <button type="button" class="btn import-db">导入数据库 (ZIP)</button>
          <input type="file" class="import-file" accept=".zip,application/zip" hidden />
        </div>
        <p class="db-status muted"></p>
      </div>
    </section>
  `,t.querySelector("form").addEventListener("submit",d=>{d.preventDefault();const p={enabled:t.querySelector(".enabled").checked,apiKey:t.querySelector(".apiKey").value.trim(),model:t.querySelector(".model").value.trim()||"gpt-4o-mini",baseUrl:t.querySelector(".baseUrl").value.trim()||"https://api.openai.com/v1",supportsVision:t.querySelector(".supportsVision").checked};fu(p),t.querySelector(".save-state").textContent="已保存 ✓"}),(l=t.querySelector(".preset-ollama"))==null||l.addEventListener("click",()=>{t.querySelector(".baseUrl").value="http://localhost:11434/v1",t.querySelector(".model").value="llama3",t.querySelector(".apiKey").value="ollama",t.querySelector(".enabled").checked=!0,t.querySelector(".save-state").textContent="已填入本地模型预设，请点「保存」"});const a=t.querySelector(".localMode");a.addEventListener("change",()=>{uu(a.checked)});const o=t.querySelector(".db-status");(h=t.querySelector(".export-db"))==null||h.addEventListener("click",async()=>{o.textContent="正在导出…";try{const d=await Lv(),p=URL.createObjectURL(d),g=document.createElement("a"),x=new Date().toISOString().slice(0,19).replace(/[:T]/g,"-");g.href=p,g.download=`shapecraft-db-${x}.zip`,document.body.appendChild(g),g.click(),g.remove(),URL.revokeObjectURL(p),o.textContent="已导出 ✓"}catch(d){o.textContent=`导出失败：${d.message}`}});const c=t.querySelector(".import-file");(f=t.querySelector(".import-db"))==null||f.addEventListener("click",()=>{confirm("导入将覆盖当前整个数据库（元件 / 场景 / 动画 / 地图 / 设置）。确定继续？")&&c.click()}),c.addEventListener("change",async()=>{var p;const d=(p=c.files)==null?void 0:p[0];if(d){o.textContent="正在导入…";try{const g=await Pv(d);g.errors.length?o.textContent=`导入完成，但以下文件损坏：${g.errors.join(", ")}`:o.textContent=`已导入：${g.imported.join(", ")}${g.skipped.length?`（缺失：${g.skipped.join(", ")}）`:""}`,setTimeout(()=>location.reload(),400)}catch(g){o.textContent=`导入失败：${g.message}`}finally{c.value=""}}}),i.appendChild(e)}class wd{constructor(e){ue(this,"clips",new Map);ue(this,"restRot",new Map);ue(this,"bones",new Map);ue(this,"current",null);ue(this,"time",0);ue(this,"playing",!0);ue(this,"speed",1);this.rebind(e)}rebind(e){this.bones.clear(),this.restRot.clear(),e.traverse(t=>{const n=t.userData.partName;n&&t.isGroup&&(this.bones.set(n,t),this.restRot.set(n,t.rotation.clone()))}),this.current&&(this.current=this.clips.get(this.current.name)??this.current)}setClips(e){this.clips.clear();for(const t of e)this.clips.set(t.name,t)}addClip(e){this.clips.set(e.name,e)}getClipNames(){return[...this.clips.keys()]}play(e,t=!0){const n=this.clips.get(e)??null;n&&n!==this.current?(this.current=n,t&&(this.time=0)):n&&(this.current=n),this.playing=!0}applyRest(){for(const[e,t]of this.restRot){const n=this.bones.get(e);n&&n.rotation.copy(t)}this.current=null,this.playing=!1,this.time=0}setPlaying(e){this.playing=e}isPlaying(){return this.playing}setSpeed(e){this.speed=Math.max(.05,e)}getSpeed(){return this.speed}update(e){this.current&&(this.playing&&(this.time+=e*this.speed),this.apply(this.current,this.time))}apply(e,t){const n=new Map,s=(t%e.duration+e.duration)%e.duration;for(const r of e.tracks){const a=Uv(r,s,e.duration);let o=n.get(r.joint);o||(o={x:0,y:0,z:0},n.set(r.joint,o)),o[r.axis]+=a}for(const[r,a]of n){const o=this.bones.get(r),c=this.restRot.get(r);!o||!c||o.rotation.set(c.x+a.x,c.y+a.y,c.z+a.z)}}}function Uv(i,e,t){const n=i.keyframes;if(n.length===0)return 0;if(n.length===1)return n[0].value;const s=e,r=n[0],a=n[n.length-1],o=r.t*t,c=a.t*t;if(s<=o)return r.value;if(s>=c)return a.value;for(let l=0;l<n.length-1;l++){const h=n[l],f=n[l+1],d=h.t*t,p=f.t*t;if(s>=d&&s<=p){const g=p-d||1,x=(s-d)/g;return h.value+(f.value-h.value)*x}}return a.value}async function Nv(i,e,t){var fe;const n=document.createElement("div");n.className="page editor-page",n.appendChild(Fn("characters")),i.appendChild(n);let s,r=t,a=Oc.includes(e??"")?e:"humanoid";if(t){const U=await zs(t);U?(s=U,U.characterType&&(a=U.characterType)):s=Rs("Untitled","character")}else s={...Rs(a,"character"),...zc(a)};const o=document.createElement("div");o.className="editor-layout";const c=document.createElement("div");c.className="panel hierarchy";const l=document.createElement("div");l.className="panel viewport-panel";const h=document.createElement("div");h.className="panel inspector",o.append(c,l,h),n.appendChild(o);const f=document.createElement("div");f.className="toolbar",f.innerHTML=`
    <div class="toolbar-row">
      <span class="muted">类别：</span>
      ${Oc.map(U=>`<button class="chip ${U===a?"active":""}" data-type="${U}">${zd[U]}</button>`).join("")}
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
  `,l.appendChild(f);const d=document.createElement("div");d.className="viewport-host",l.appendChild(d);const p=new md(d,U=>_(U),(U,te)=>M(U,te)),g=new wd(p.getRootGroup());g.setClips(L()),p.onFrame(U=>g.update(U));const x=xc(d),u=document.createElement("div");u.className="editor-topbar",u.innerHTML=`
    <a class="btn small" href="#/library">← 返回</a>
    <input class="name-input" type="text" value="${s.name}" />
    <span class="badge">${kr("character")}</span>
    <button class="btn primary" data-save>保存</button>
    ${r?'<button class="btn danger" data-del>删除</button>':""}
    <span class="save-state"></span>
  `,n.insertBefore(u,o);let m=null,w=null;const S=new Set;let y=null;function L(){return s.animClips||(s.animClips=Ov(vh[a])),s.animClips}function C(){g.setClips(L()),g.rebind(p.getRootGroup()),w&&g.play(w)}function R(){const U=[],te=ye=>{ye.shape==="node"&&U.push(ye.name),ye.children.forEach(te)};return te(s.root),U}c.addEventListener("click",U=>{const te=U.target.closest(".row-del");if(!te)return;const ye=te.getAttribute("data-del-id");ye&&(Nr(s.root,ye),m===ye&&(m=null),ve())});function z(){c.innerHTML='<h4>骨架层级</h4><div class="tree"></div>',c.querySelector(".tree").appendChild(ne(s.root,!0))}function ne(U,te){const ye=document.createElement("div");ye.className="tree-row"+(p.getSelectedId()===U.id?" selected":"");const de=U.shape==="instance"?'<span class="lock" title="实例引用（整体锁定）">🔒</span>':"";ye.innerHTML=`<span class="dot ${U.shape}"></span><span class="pname">${U.name}</span><span class="pshape">${U.shape}</span>${de}<button class="row-del" title="删除" data-del-id="${U.id}">×</button>`,ye.addEventListener("click",B=>{B.target.classList.contains("row-del")||_(U.id)});const E=document.createElement("div");if(E.appendChild(ye),U.children.length){const B=document.createElement("div");B.className="tree-kids";for(const ae of U.children)B.appendChild(ne(ae,!1));E.appendChild(B)}return te&&E.classList.add("root-node"),E}function _(U){m=U,p.setSelected(U),z(),q()}function M(U,te){const ye=Nn(s.root,U);ye&&(ye.position=te.position,ye.rotation=te.rotation,ye.scale=te.scale,q())}function O(){h.innerHTML=`
      <h4>动画 Animation</h4>
      <div class="anim-panel"></div>
      <h4>属性 Inspector</h4>
      <div class="inspector-body"></div>
    `,k(h.querySelector(".anim-panel")),q()}function k(U){const te=L(),ye=R(),de=b=>Math.round(b*180/Math.PI),E=(b,v,N,J)=>`<span class="kf-dot${y&&y.clip===b&&y.track===v&&y.kf===J?" selected":""}" style="left:${(N.t*100).toFixed(2)}%" data-kf="${b}:${v}:${J}" title="t=${N.t.toFixed(2)} · ${de(N.value)}°"></span>`,B=(b,v,N)=>`
      <div class="track-row">
        <span class="track-label" title="${v.joint}">${v.joint}·${v.axis}</span>
        <div class="timeline" data-timeline="${b}:${N}">
          ${v.keyframes.map((J,ce)=>E(b,N,J,ce)).join("")}
          <span class="tl-zero">0</span><span class="tl-one">1</span>
        </div>
        <button class="row-del" title="删除轨道" data-del-track="${b}:${N}">×</button>
      </div>`,ae=b=>{if(!y||y.clip!==b)return"";const v=te[b].tracks[y.track],N=v.keyframes[y.kf];return`<div class="kf-editor">
        <span class="kf-tag">选中关键帧：${v.joint} · ${v.axis}</span>
        <label class="mini">值°<input type="number" step="1" value="${de(N.value)}" data-kf-val="${b}:${y.track}:${y.kf}"/></label>
        <button class="btn tiny danger" data-kf-del="${b}:${y.track}:${y.kf}">删除关键帧</button>
      </div>`},pe=(b,v)=>`
      <div class="clip-body">
        <label class="mini">时长(s)<input type="number" step="0.1" min="0.1" value="${v.duration}" data-clip-dur="${b}"/></label>
        <div class="track-builder">
          <label class="mini">引用节点<input list="bone-list" value="${ye[0]??""}" data-builder-joint="${b}"/></label>
          <span class="axis-checks">
            ${["x","y","z"].map(N=>`<label><input type="checkbox" data-builder-axis="${b}:${N}"/>${N.toUpperCase()}</label>`).join("")}
          </span>
          <button class="btn tiny" data-add-tracks="${b}">＋ 添加轨道</button>
          <span class="muted tiny-hint">勾选轴后，为该节点一次生成多条轨道</span>
        </div>
        <div class="tracks">${v.tracks.map((N,J)=>B(b,N,J)).join("")}</div>
        ${ae(b)}
      </div>`,ge=te.map((b,v)=>{const N=!S.has(v);return`
        <div class="clip-card ${w===b.name?"active":""}" data-clip="${v}">
          <div class="clip-head">
            <button class="btn tiny play-clip" data-play-clip="${v}">▶</button>
            <input class="clip-label" type="text" value="${b.label}" data-clip-label="${v}"/>
            <input class="clip-name" type="text" value="${b.name}" data-clip-name="${v}" title="槽位标识"/>
            <button class="row-del" title="删除槽位" data-del-clip="${v}">×</button>
            <button class="btn tiny" data-toggle-clip="${v}">${N?"收起":"展开"}</button>
          </div>
          ${N?pe(v,b):""}
        </div>`}).join("");U.innerHTML=`
      <datalist id="bone-list">${ye.map(b=>`<option value="${b}">`).join("")}</datalist>
      <div class="anim-buttons">
        <button class="btn small primary" data-add-clip>+ 新增槽位</button>
      </div>
      <div class="clip-list">${ge}</div>
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
    `,U.querySelectorAll("[data-play-clip]").forEach(b=>b.addEventListener("click",()=>{const v=Number(b.getAttribute("data-play-clip")),N=L()[v];N&&(w=N.name,g.play(N.name),U.querySelectorAll(".clip-card").forEach(J=>J.classList.remove("active")),b.closest(".clip-card").classList.add("active"),U.querySelector("[data-play]").textContent="⏸ 暂停")})),U.querySelector("[data-play]").addEventListener("click",b=>{const v=b.target,N=!g.isPlaying();g.setPlaying(N),v.textContent=N?"⏸ 暂停":"▶ 播放"});const De=U.querySelector("[data-speed]");De.addEventListener("input",()=>g.setSpeed(parseFloat(De.value)||1));const he=U.querySelector("[data-yaw]");he.addEventListener("input",()=>{const b=parseFloat(he.value)*Math.PI/180;p.getRootGroup().rotation.y=b}),U.querySelectorAll("[data-clip-label]").forEach(b=>b.addEventListener("input",()=>{L()[Number(b.getAttribute("data-clip-label"))].label=b.value})),U.querySelectorAll("[data-clip-name]").forEach(b=>b.addEventListener("input",()=>{L()[Number(b.getAttribute("data-clip-name"))].name=b.value})),U.querySelectorAll("[data-clip-dur]").forEach(b=>b.addEventListener("input",()=>{const v=Number(b.getAttribute("data-clip-dur"));L()[v].duration=Math.max(.1,parseFloat(b.value)||1),C()})),U.querySelectorAll("[data-timeline]").forEach(b=>b.addEventListener("pointerdown",v=>{v.preventDefault();const[N,J]=b.getAttribute("data-timeline").split(":").map(Number),ce=v.target.closest(".kf-dot");let oe;if(ce)oe=Number(ce.getAttribute("data-kf").split(":")[2]);else{const we=b.getBoundingClientRect(),qe=Math.min(1,Math.max(0,(v.clientX-we.left)/we.width)),Me=L()[N].tracks[J].keyframes;Me.push({t:qe,value:0}),oe=Me.length-1}y={clip:N,track:J,kf:oe};const Ae=we=>{const qe=U.querySelector(`[data-timeline="${N}:${J}"]`);if(!qe)return;const Me=qe.getBoundingClientRect(),Ie=Math.min(1,Math.max(0,(we.clientX-Me.left)/Me.width));L()[N].tracks[J].keyframes[oe].t=Ie;const He=qe.querySelector(`[data-kf="${N}:${J}:${oe}"]`);He&&(He.style.left=(Ie*100).toFixed(2)+"%"),C()},be=()=>{window.removeEventListener("pointermove",Ae),window.removeEventListener("pointerup",be),k(U)};window.addEventListener("pointermove",Ae),window.addEventListener("pointerup",be),k(U)})),U.querySelectorAll("[data-add-tracks]").forEach(b=>b.addEventListener("click",()=>{const v=Number(b.getAttribute("data-add-tracks")),J=U.querySelector(`[data-builder-joint="${v}"]`).value.trim()||ye[0]||"joint.root",ce=L()[v].tracks;for(const oe of["x","y","z"]){const Ae=U.querySelector(`[data-builder-axis="${v}:${oe}"]`);Ae!=null&&Ae.checked&&!ce.some(be=>be.joint===J&&be.axis===oe)&&ce.push({joint:J,axis:oe,keyframes:[{t:0,value:0},{t:1,value:0}]})}C(),k(U)})),U.querySelectorAll("[data-kf-val]").forEach(b=>b.addEventListener("input",()=>{const[v,N,J]=b.getAttribute("data-kf-val").split(":").map(Number);L()[v].tracks[N].keyframes[J].value=(parseFloat(b.value)||0)*(Math.PI/180),C()})),U.querySelectorAll("[data-kf-del]").forEach(b=>b.addEventListener("click",()=>{const[v,N,J]=b.getAttribute("data-kf-del").split(":").map(Number),ce=L()[v].tracks[N].keyframes;ce.length>1&&ce.splice(J,1),y&&y.clip===v&&y.track===N&&y.kf===J&&(y=null),C(),k(U)})),U.querySelectorAll("[data-del-track]").forEach(b=>b.addEventListener("click",()=>{const[v,N]=b.getAttribute("data-del-track").split(":").map(Number);L()[v].tracks.splice(N,1),y&&y.clip===v&&y.track===N&&(y=null),C(),k(U)})),U.querySelectorAll("[data-del-clip]").forEach(b=>b.addEventListener("click",()=>{const v=Number(b.getAttribute("data-del-clip"));L().splice(v,1),y&&y.clip===v&&(y=null),C(),k(U)})),U.querySelectorAll("[data-toggle-clip]").forEach(b=>b.addEventListener("click",()=>{const v=Number(b.getAttribute("data-toggle-clip"));S.has(v)?S.delete(v):S.add(v),k(U)})),U.querySelector("[data-add-clip]").addEventListener("click",()=>{const b=L(),v=b.filter(N=>N.name.startsWith("custom")).length+1;b.push({name:`custom${v}`,label:`Custom ${v}`,duration:1,tracks:[]}),C(),k(U)})}function q(){const U=h.querySelector(".inspector-body"),te=m?Nn(s.root,m):null;if(U.innerHTML="",!te){U.innerHTML='<p class="muted">在视图或骨架中选中一个节点以编辑其变换与材质。</p>';return}U.appendChild(ie(te))}function W(U,te,ye){const de=document.createElement("label");de.className="field",de.innerHTML=`<span>${U}</span>`;const E=document.createElement("input");return E.type="number",E.step="0.1",E.value=String(te),E.addEventListener("input",()=>ye(parseFloat(E.value)||0)),de.appendChild(E),de}function V(U,te,ye){const de=document.createElement("div");de.className="vec3";const E=["X","Y","Z"];return["x","y","z"].forEach((B,ae)=>{de.appendChild(W(`${U} ${E[ae]}`,te[B],pe=>ye({...te,[B]:pe})))}),de}function ie(U){if(U.shape==="instance")return K(U);const te=document.createElement("div");te.className="inspector-form";const ye=document.createElement("label");ye.className="field full",ye.innerHTML="<span>名称</span>";const de=document.createElement("input");de.value=U.name,de.addEventListener("input",()=>{U.name=de.value,z()}),ye.appendChild(de),te.appendChild(ye);const E=(ae,pe,ge)=>{const De=document.createElement("div");return De.className="group",De.innerHTML=`<div class="group-title">${ae}</div>`,De.appendChild(V(ae,pe,ge)),De};te.appendChild(E("位置 Position",U.position,ae=>{U.position=ae,xe()})),te.appendChild(E("旋转 Rotation (rad)",U.rotation,ae=>{U.rotation=ae,xe()})),te.appendChild(E("缩放 Scale",U.scale,ae=>{U.scale=ae,xe()}));const B=document.createElement("button");return B.className="btn small danger full",B.textContent="删除此部件",B.addEventListener("click",()=>{Nr(s.root,U.id),m=null,ve()}),te.appendChild(B),te}function K(U){const te=document.createElement("div");te.className="inspector-form",te.innerHTML=`
      <div class="group">
        <div class="group-title">实例引用 Instance</div>
        <p class="muted">该部件整体引用了另一个元件，内部细节不可在此编辑。</p>
        <label class="field full"><span>名称</span></label>
        <input class="inst-name" type="text" value="${U.name}" />
        <label class="field full"><span>引用 ID</span></label>
        <input class="inst-ref" type="text" value="${U.refId??""}" readonly />
      </div>
    `;const ye=te.querySelector(".inst-name");ye.addEventListener("input",()=>{U.name=ye.value,z()});const de=document.createElement("a");de.className="btn small full",de.textContent="打开原件编辑器 →",de.href=`#/editor/${U.refId}`,te.appendChild(de);const E=document.createElement("button");return E.className="btn small danger full",E.textContent="删除此引用",E.addEventListener("click",()=>{Nr(s.root,U.id),m=null,ve()}),te.appendChild(E),te}function me(U){let te=m&&Nn(s.root,m)||s.root;te.shape==="instance"&&(te=s.root);const ye=U==="node",de=Be({shape:U,name:ye?`Node ${te.children.length+1}`:`${U[0].toUpperCase()}${U.slice(1)} ${te.children.length+1}`,material:fn(U==="sphere"||U==="cone"?"#4caf50":"#cccccc"),size:U==="box"?P(.3,.3,.3):U==="sphere"?P(.2,.2,.2):U==="plane"?P(.5,.5,1):P(.15,.5,.15),position:P(0,ye?0:.2,0)});te.children.push(de),_(de.id),xe()}function xe(){return us(s.root).then(U=>{p.setRoot(s.root,te=>U.get(te)??null),g.rebind(p.getRootGroup()),m&&p.setSelected(m)})}function ve(){xe(),x(p.getDimensions()),z(),q()}async function se(){const U=f.querySelector("[data-ref-select]");if(!U)return;const te=await On(),ye=U.value;U.innerHTML='<option value="">选择元件…</option>'+te.filter(de=>de.id!==r).map(de=>`<option value="${de.id}">${de.name} · ${de.category}</option>`).join(""),te.some(de=>de.id===ye)&&(U.value=ye)}f.addEventListener("click",async U=>{var pe,ge,De,he,b;const te=U.target,ye=(pe=te.getAttribute)==null?void 0:pe.call(te,"data-type"),de=(ge=te.getAttribute)==null?void 0:ge.call(te,"data-mode"),E=(De=te.hasAttribute)==null?void 0:De.call(te,"data-shot"),B=(he=te.getAttribute)==null?void 0:he.call(te,"data-add");if(B){me(B);return}if((b=te.hasAttribute)==null?void 0:b.call(te,"data-insert-ref")){const v=f.querySelector("[data-ref-select]"),N=v==null?void 0:v.value;if(!N)return;const J=(await On()).find(oe=>oe.id===N),ce=Yo({root:s.root,selectedId:m,refId:N,refName:(J==null?void 0:J.name)??"Instance"});_(ce.id),ve();return}if(ye&&ye!==a){a=ye,s={...Rs(a,"character"),...zc(a)},r=void 0,S.clear();const v=L()[0];w=v?v.name:null,C(),u.querySelector(".name-input").value=s.name,_(null),ve(),O();return}de&&(p.setTransformMode(de),f.querySelectorAll(".mode").forEach(v=>v.classList.remove("active")),te.classList.add("active")),E&&(s.thumbnail=p.captureThumbnail(),r?(Ls(r,I()),le("已截图并保存 ✓")):le("已截图（保存后将按当前视图刷新）"))});function le(U){u.querySelector(".save-state").textContent=U}function A(){if(!u.querySelector("[data-del]")){const U=document.createElement("button");U.className="btn danger",U.setAttribute("data-del",""),U.textContent="删除",u.insertBefore(U,u.querySelector(".save-state"))}}function I(){return{name:s.name,category:s.category,description:s.description,root:s.root,thumbnail:s.thumbnail,characterType:a,animClips:L()}}async function X(){const U=u.querySelector(".name-input").value||"Untitled";s.name=U,s.category="character",s.thumbnail=p.captureThumbnail();try{if(r)return await Ls(r,I()),"updated";const te=await dn(I());return r=te.id,s.id=te.id,s.createdAt=te.createdAt,s.updatedAt=te.updatedAt,A(),se(),"created"}catch(te){return le("保存失败："+te.message),"failed"}}u.querySelector("[data-save]").addEventListener("click",async()=>{await X()!=="failed"&&le("已保存到元件库 ✓")}),(fe=u.querySelector("[data-del]"))==null||fe.addEventListener("click",async()=>{r&&confirm("确定删除该角色？")&&(await nc(r),location.hash="#/library")}),O(),se();const Y=L()[0];Y&&(w=Y.name,g.play(Y.name)),ve()}function Ov(i){return i.map(e=>({...e,tracks:e.tracks.map(t=>({...t,keyframes:t.keyframes.map(n=>({...n}))}))}))}function Nr(i,e){const t=i.children.findIndex(n=>n.id===e);if(t!==-1)return i.children.splice(t,1),!0;for(const n of i.children)if(Nr(n,e))return!0;return!1}class zv{constructor(e,t){ue(this,"container");ue(this,"renderer");ue(this,"scene",new sa);ue(this,"camera");ue(this,"controls");ue(this,"transform");ue(this,"clock",new ca);ue(this,"frameCallbacks",[]);ue(this,"cb");ue(this,"sceneModel",null);ue(this,"assets",new Map);ue(this,"terrainMesh",null);ue(this,"waterMesh",null);ue(this,"waterLocalMesh",null);ue(this,"objectsGroup",new mn);ue(this,"objectGroups",new Map);ue(this,"ruler",null);ue(this,"updateDimensions");ue(this,"mode","terrain");ue(this,"terrainTool","raise");ue(this,"brushSize",3);ue(this,"brushStrength",.6);ue(this,"painting",!1);ue(this,"pointerDownPos",{x:0,y:0});ue(this,"downOnGizmo",!1);ue(this,"armedAssetId",null);ue(this,"selectedId",null);ue(this,"resize",()=>{const e=this.container.clientWidth||600,t=this.container.clientHeight||400;this.renderer.setSize(e,t);const n=this.renderer.domElement;n.style.display="block",n.style.width="100%",n.style.height="100%",this.camera.aspect=e/t,this.camera.updateProjectionMatrix()});ue(this,"animate",()=>{requestAnimationFrame(this.animate);const e=this.clock.getDelta();for(const t of this.frameCallbacks)t(e);this.controls.update(),this.renderer.render(this.scene,this.camera)});this.container=e,this.cb=t,this.scene.background=new je("#10131a"),this.camera=new kt(50,1,.1,2e3),this.camera.position.set(18,16,18),this.renderer=new ia({antialias:!0,preserveDrawingBuffer:!0}),this.renderer.setPixelRatio(window.devicePixelRatio),e.appendChild(this.renderer.domElement),this.controls=new _c(this.camera,this.renderer.domElement),this.controls.enableDamping=!0,this.controls.target.set(0,0,0),this.controls.maxPolarAngle=Math.PI/2.05,this.transform=new vc(this.camera,this.renderer.domElement),this.transform.setSize(.9),this.transform.addEventListener("dragging-changed",a=>{this.downOnGizmo=a.value,this.controls.enabled=!this.downOnGizmo}),this.transform.addEventListener("objectChange",()=>this.emitObjectTransform()),this.scene.add(this.transform.getHelper()),this.scene.add(new aa("#ffffff","#3a3f4b",1));const n=new oa("#ffffff",1.5);n.position.set(10,18,8),this.scene.add(n),this.scene.add(this.objectsGroup),this.updateDimensions=xc(e);const s=this.renderer.domElement;s.addEventListener("pointerdown",a=>this.onPointerDown(a)),s.addEventListener("pointermove",a=>this.onPointerMove(a)),window.addEventListener("pointerup",a=>this.onPointerUp(a)),window.addEventListener("resize",()=>this.resize()),new ResizeObserver(()=>this.resize()).observe(this.container),this.resize(),this.animate()}async setScene(e,t){this.sceneModel=e,this.assets=new Map(t.map(r=>[r.id,r])),e.terrain&&Qo(e.terrain),this.rebuildTerrain(),this.rebuildWater(),this.rebuildWaterLocal(),this.rebuildObjects(),this.applyMouseButtons(),this.ruler&&this.scene.remove(this.ruler);const n=e.size,s=Math.max(1,Math.round(n/10));this.ruler=pd(n,s),this.ruler.position.set(-n/2,0,-n/2),this.scene.add(this.ruler),this.updateDimensions(this.getDimensions()),this.camera.position.set(n*.75,n*.65,n*.75),this.controls.target.set(0,0,0)}setAssets(e){this.assets=new Map(e.map(t=>[t.id,t])),this.sceneModel&&this.rebuildObjects()}setMode(e){this.mode=e,this.armedAssetId=null,e!=="object"&&this.select(null),this.applyMouseButtons()}getMode(){return this.mode}getDimensions(){var n;const e=new Ai().setFromObject(this.objectsGroup);if(!e.isEmpty()){const s=new D;return e.getSize(s),{x:s.x,y:s.y,z:s.z}}const t=((n=this.sceneModel)==null?void 0:n.size)??0;return{x:t,y:0,z:t}}setTerrainTool(e){this.terrainTool=e}setBrush(e,t){this.brushSize=e,this.brushStrength=t}setWaterLevel(e){this.sceneModel&&(this.sceneModel.waterLevel=e,this.waterMesh&&(this.waterMesh.position.y=e))}setTransformMode(e){this.transform.setMode(e)}armPlacement(e){this.armedAssetId=e}getArmed(){return this.armedAssetId}syncTransform(e){const t=this.objectGroups.get(e.id);t&&(t.position.set(e.position.x,e.position.y,e.position.z),t.rotation.set(e.rotation.x,e.rotation.y,e.rotation.z),t.scale.set(e.scale.x,e.scale.y,e.scale.z))}select(e){this.selectedId=e,this.refreshSelection(),this.attachGizmo(e),this.cb.onSelect(e)}getSelectedId(){return this.selectedId}deleteSelected(){if(!this.sceneModel||!this.selectedId)return;const e=this.selectedId;this.sceneModel.objects=this.sceneModel.objects.filter(n=>n.id!==e);const t=this.objectGroups.get(e);t&&(this.objectsGroup.remove(t),this.objectGroups.delete(e)),this.select(null)}captureThumbnail(){return this.renderer.render(this.scene,this.camera),this.renderer.domElement.toDataURL("image/png")}dispose(){this.renderer.dispose(),this.controls.dispose(),this.transform.detach(),this.transform.dispose(),window.removeEventListener("pointerup",this.onPointerUp),window.removeEventListener("resize",this.resize)}onFrame(e){return this.frameCallbacks.push(e),()=>{this.frameCallbacks=this.frameCallbacks.filter(t=>t!==e)}}rebuildTerrain(){if(this.terrainMesh&&(this.scene.remove(this.terrainMesh),this.terrainMesh.geometry.dispose(),this.terrainMesh.material.dispose()),!this.sceneModel)return;const e=this.buildTerrainGeometry(this.sceneModel.terrain),t=new gn({color:this.sceneModel.terrain.color,roughness:.95,metalness:0,flatShading:!1});this.terrainMesh=new Ee(e,t),this.terrainMesh.receiveShadow=!0,this.scene.add(this.terrainMesh)}buildTerrainGeometry(e){const t=Sn(e.segments),n=new Float32Array(t*t*3);let s=0;for(let o=0;o<t;o++)for(let c=0;c<t;c++){const l=-e.size/2+c/e.segments*e.size,h=-e.size/2+o/e.segments*e.size,f=e.heights[o*t+c]??0;n[s++]=l,n[s++]=f,n[s++]=h}const r=[];for(let o=0;o<e.segments;o++)for(let c=0;c<e.segments;c++){const l=o*t+c,h=o*t+c+1,f=(o+1)*t+c,d=(o+1)*t+c+1;r.push(l,f,h),r.push(h,f,d)}const a=new ct;return a.setAttribute("position",new Lt(n,3)),a.setIndex(r),a.computeVertexNormals(),a}rebuildWater(){if(this.waterMesh&&(this.scene.remove(this.waterMesh),this.waterMesh.geometry.dispose(),this.waterMesh.material.dispose()),!this.sceneModel)return;const e=new kn(this.sceneModel.size,this.sceneModel.size);e.rotateX(-Math.PI/2);const t=new gn({color:"#2f7fbf",transparent:!0,opacity:.55,roughness:.2,metalness:.1});this.waterMesh=new Ee(e,t),this.waterMesh.position.y=this.sceneModel.waterLevel,this.scene.add(this.waterMesh)}rebuildWaterLocal(){if(this.waterLocalMesh&&(this.scene.remove(this.waterLocalMesh),this.waterLocalMesh.geometry.dispose(),this.waterLocalMesh.material.dispose(),this.waterLocalMesh=null),!this.sceneModel)return;const e=this.sceneModel.terrain,t=this.buildWaterGeometry(e),n=new gn({color:"#3a93d6",transparent:!0,opacity:.6,roughness:.15,metalness:.1,side:jt});this.waterLocalMesh=new Ee(t,n),this.scene.add(this.waterLocalMesh)}waterLocalY(e,t){const n=e.water[t]??0,s=e.heights[t]??0;return n>.001?s+n:s-.02}buildWaterGeometry(e){const t=Sn(e.segments),n=new Float32Array(t*t*3);let s=0;for(let o=0;o<t;o++)for(let c=0;c<t;c++){const l=-e.size/2+c/e.segments*e.size,h=-e.size/2+o/e.segments*e.size,f=o*t+c;n[s++]=l,n[s++]=this.waterLocalY(e,f),n[s++]=h}const r=[];for(let o=0;o<e.segments;o++)for(let c=0;c<e.segments;c++){const l=o*t+c,h=o*t+c+1,f=(o+1)*t+c,d=(o+1)*t+c+1;r.push(l,f,h),r.push(h,f,d)}const a=new ct;return a.setAttribute("position",new Lt(n,3)),a.setIndex(r),a.computeVertexNormals(),a}rebuildObjects(){if(this.objectGroups.forEach(e=>this.objectsGroup.remove(e)),this.objectGroups.clear(),!!this.sceneModel){for(const e of this.sceneModel.objects)this.buildObject(e);this.updateDimensions(this.getDimensions())}}async buildObject(e){const t=this.assets.get(e.assetId);if(!t)return;const n=await us(t.root),s=a=>n.get(a)??null,r=hs(t.root,s);r.userData.sceneObjId=e.id,r.position.set(e.position.x,e.position.y,e.position.z),r.rotation.set(e.rotation.x,e.rotation.y,e.rotation.z),r.scale.set(e.scale.x,e.scale.y,e.scale.z),this.objectGroups.set(e.id,r),this.objectsGroup.add(r),e.id===this.selectedId&&this.attachGizmo(e.id)}applyMouseButtons(){this.mode==="terrain"?this.controls.mouseButtons={LEFT:null,MIDDLE:Wt.DOLLY,RIGHT:Wt.ROTATE}:this.controls.mouseButtons={LEFT:Wt.ROTATE,MIDDLE:Wt.DOLLY,RIGHT:Wt.PAN}}raycastTerrain(e){if(!this.terrainMesh)return null;const t=this.renderer.domElement.getBoundingClientRect(),n=new ke((e.clientX-t.left)/t.width*2-1,-((e.clientY-t.top)/t.height)*2+1),s=new $r;s.setFromCamera(n,this.camera);const r=s.intersectObject(this.terrainMesh,!1);return r.length?r[0].point:null}onPointerDown(e){this.mode==="terrain"&&e.button===0&&(this.painting=!0,this.paintAt(e)),this.pointerDownPos={x:e.clientX,y:e.clientY}}onPointerMove(e){this.painting&&this.mode==="terrain"&&this.paintAt(e)}onPointerUp(e){const t=this.painting;if(this.painting=!1,!(t||this.mode!=="object"||Math.abs(e.clientX-this.pointerDownPos.x)+Math.abs(e.clientY-this.pointerDownPos.y)>5)&&!this.downOnGizmo){if(this.armedAssetId){const s=this.raycastTerrain(e);s&&this.placeArmed(s);return}this.pickObject(e)}}paintAt(e){if(!this.sceneModel||!this.terrainMesh)return;const t=this.raycastTerrain(e);if(!t)return;const n=this.sceneModel.terrain,s=Sn(n.segments),r=this.terrainMesh.geometry.getAttribute("position"),a=n.heights,o=this.brushSize,c=o*o;let l=!1;const h=Math.round((t.x+n.size/2)/n.size*n.segments),f=Math.round((t.z+n.size/2)/n.size*n.segments),d=Math.ceil(o/(n.size/n.segments))+1;for(let p=f-d;p<=f+d;p++)for(let g=h-d;g<=h+d;g++){if(g<0||p<0||g>=s||p>=s)continue;const x=-n.size/2+g/n.segments*n.size,u=-n.size/2+p/n.segments*n.size,m=x-t.x,w=u-t.z,S=m*m+w*w;if(S>c)continue;const y=1-Math.sqrt(S)/o,L=p*s+g;if(this.terrainTool==="water"||this.terrainTool==="dry"){const C=n.water[L]??0,R=this.brushStrength*y*.25,z=this.terrainTool==="water"?Math.min(Qd,C+R):Math.max(0,C-R);z!==C&&(n.water[L]=z,l=!0)}else{const C=a[L];let R=C;this.terrainTool==="raise"?R=C+this.brushStrength*y:this.terrainTool==="lower"?R=C-this.brushStrength*y:R=C+(t.y-C)*Math.min(1,y),a[L]=R,r.setY(L,R),l=!0}}l&&(this.terrainTool==="water"||this.terrainTool==="dry"?this.refreshWaterLocal():(r.needsUpdate=!0,this.terrainMesh.geometry.computeVertexNormals(),this.refreshWaterLocal()),this.cb.onTerrainChange())}refreshWaterLocal(){if(!this.waterLocalMesh||!this.sceneModel)return;const e=this.sceneModel.terrain,t=Sn(e.segments),n=this.waterLocalMesh.geometry.getAttribute("position");for(let s=0;s<t*t;s++)n.setY(s,this.waterLocalY(e,s));n.needsUpdate=!0,this.waterLocalMesh.geometry.computeVertexNormals()}async placeArmed(e){const t=this.armedAssetId,n=this.assets.get(t);if(this.armedAssetId=null,!n||!this.sceneModel)return;const s=io(this.sceneModel.terrain,e.x,e.z),r={id:`obj_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,6)}`,assetId:t,name:n.name,position:{x:e.x,y:s,z:e.z},rotation:{x:0,y:0,z:0},scale:{x:1,y:1,z:1}};r.position.y=s+ui(n.root),this.sceneModel.objects.push(r),await this.buildObject(r),this.cb.onObjectAdd(r),this.select(r.id)}pickObject(e){const t=this.renderer.domElement.getBoundingClientRect(),n=new ke((e.clientX-t.left)/t.width*2-1,-((e.clientY-t.top)/t.height)*2+1),s=new $r;s.setFromCamera(n,this.camera);const r=s.intersectObjects(this.objectsGroup.children,!0);if(r.length===0){this.select(null);return}let a=r[0].object;for(;a&&!a.userData.sceneObjId;)a=a.parent;this.select((a==null?void 0:a.userData.sceneObjId)??null)}findObjectGroup(e){return this.objectGroups.get(e)??null}attachGizmo(e){if(!e||this.mode!=="object"){this.transform.detach();return}const t=this.findObjectGroup(e);t?this.transform.attach(t):this.transform.detach()}emitObjectTransform(){const e=this.selectedId;if(!e||!this.sceneModel)return;const t=this.objectGroups.get(e),n=this.sceneModel.objects.find(s=>s.id===e);!t||!n||(n.position={x:t.position.x,y:t.position.y,z:t.position.z},n.rotation={x:t.rotation.x,y:t.rotation.y,z:t.rotation.z},n.scale={x:t.scale.x,y:t.scale.y,z:t.scale.z},this.cb.onObjectChange(n))}refreshSelection(){const e=this.selectedId;this.objectsGroup.traverse(t=>{const n=t.material;if(n&&n.isMeshStandardMaterial&&"emissive"in n){let s=!1,r=t;for(;r;){if(r.userData.sceneObjId===e){s=!0;break}r=r.parent}n.emissive=new je(s?"#ffb300":"#000000"),n.emissiveIntensity=s?.5:0}})}}async function Fv(i,e){const t=document.createElement("div");t.className="page scene-page",t.appendChild(Fn("scene")),i.appendChild(t);const n=document.createElement("div");n.className="editor-layout scene-layout";const s=document.createElement("div");s.className="panel scene-list";const r=document.createElement("div");r.className="panel viewport-panel";const a=document.createElement("div");a.className="panel inspector",n.append(s,r,a),t.appendChild(n);const o=document.createElement("div");o.className="mode-tabs",o.innerHTML=`
    <button class="tab active" data-mode="terrain">⛰️ 地形 Terrain</button>
    <button class="tab" data-mode="object">📦 物件 Object</button>
  `,r.appendChild(o);const c=document.createElement("div");c.className="toolbar scene-toolbar",r.appendChild(c);const l=document.createElement("div");l.className="viewport-host",r.appendChild(l);const h=new zv(l,{onTerrainChange:()=>u("地形已修改"),onObjectAdd:()=>u("已放置物件"),onObjectChange:()=>u("物件已移动"),onSelect:M=>R(M)}),f=document.createElement("div");f.className="editor-topbar",f.innerHTML=`
    <a class="btn small" href="#/scenes">← 返回</a>
    <input class="name-input" type="text" value="Untitled Scene" />
    <button class="btn primary" data-save>保存</button>
    <span class="save-state"></span>
  `,t.insertBefore(f,n);let d=no(),p=e,g=!1,x=[];window.addEventListener("beforeunload",M=>{g&&(M.preventDefault(),M.returnValue="")});function u(M){g=!0,m(M+"（未保存）")}function m(M){f.querySelector(".save-state").textContent=M}async function w(){const M=await la();s.innerHTML="<h4>场景 Scenes</h4>";const O=document.createElement("button");O.className="btn small full",O.textContent="+ 新建场景",O.addEventListener("click",()=>{p=void 0,d=no(),f.querySelector(".name-input").value=d.name,g=!1,m(""),h.setScene(d,x),R(null)}),s.appendChild(O);const k=document.createElement("div");k.className="scene-items";for(const q of M){const W=document.createElement("div");W.className="scene-item"+(q.id===p?" active":""),W.innerHTML=`<span class="sname">${q.name}</span><button class="sdel" title="删除">×</button>`,W.addEventListener("click",async V=>{if(V.target.classList.contains("sdel")){confirm(`删除场景「${q.name}」？`)&&(await xd(q.id),p===q.id&&(p=void 0),w());return}await S(q.id)}),k.appendChild(W)}s.appendChild(k)}async function S(M){const O=await Yr(M);O&&(p=M,d=O,f.querySelector(".name-input").value=d.name,g=!1,m(""),await h.setScene(d,x),R(null),w())}function y(){c.innerHTML=`
      <span class="muted">笔刷：</span>
      <button class="btn small mode active" data-tool="raise">抬高 ▲</button>
      <button class="btn small mode" data-tool="lower">降低 ▼</button>
      <button class="btn small mode" data-tool="flatten">平整 ⬌</button>
      <span class="sep"></span>
      <span class="muted">水体：</span>
      <button class="btn small mode" data-tool="water">💧 注水</button>
      <button class="btn small mode" data-tool="dry">🚫 排水</button>
      <span class="sep"></span>
      <label class="field inline">半径 <input type="range" min="1" max="10" step="0.5" value="3" data-brush-size /><span data-brush-size-v>3</span></label>
      <label class="field inline">强度 <input type="range" min="0.1" max="2" step="0.1" value="0.6" data-brush-strength /><span data-brush-strength-v>0.6</span></label>
      <span class="sep"></span>
      <label class="field inline">水位 <input type="range" min="${-d.size/2}" max="${d.size/2}" step="0.1" value="${d.waterLevel}" data-water /><span data-water-v>${d.waterLevel.toFixed(1)}</span></label>
      <span class="sep"></span>
      <button class="btn small danger" data-reset>重置地形</button>
    `,c.querySelectorAll("[data-tool]").forEach(ie=>ie.addEventListener("click",()=>{const K=ie.getAttribute("data-tool");h.setTerrainTool(K),c.querySelectorAll("[data-tool]").forEach(me=>me.classList.remove("active")),ie.classList.add("active")}));const M=c.querySelector("[data-brush-size]"),O=c.querySelector("[data-brush-size-v]");M.addEventListener("input",()=>{O.textContent=M.value,L()});const k=c.querySelector("[data-brush-strength]"),q=c.querySelector("[data-brush-strength-v]");k.addEventListener("input",()=>{q.textContent=k.value,L()});const W=c.querySelector("[data-water]"),V=c.querySelector("[data-water-v]");W.addEventListener("input",()=>{V.textContent=parseFloat(W.value).toFixed(1),h.setWaterLevel(parseFloat(W.value)),u("水位已调整")}),c.querySelector("[data-reset]").addEventListener("click",()=>{d.terrain.heights=d.terrain.heights.map(()=>0),d.terrain.water=d.terrain.water.map(()=>0),h.setScene(d,x),u("地形已重置")}),L()}function L(){const M=parseFloat(c.querySelector("[data-brush-size]").value),O=parseFloat(c.querySelector("[data-brush-strength]").value);h.setBrush(M,O)}async function C(){c.innerHTML=`
      <span class="muted">放置元件：</span>
      <select class="asset-select" data-asset><option value="">选择元件…</option></select>
      <button class="btn small primary" data-place>放置（点击地形）</button>
      <span class="sep"></span>
      <span class="muted">变换：</span>
      <button class="btn small mode active" data-xmode="translate">移动</button>
      <button class="btn small mode" data-xmode="rotate">旋转</button>
      <button class="btn small mode" data-xmode="scale">缩放</button>
      <span class="sep"></span>
      <button class="btn small danger" data-del-obj>删除选中</button>
    `;const M=c.querySelector("[data-asset]");M.innerHTML='<option value="">选择元件…</option>'+x.map(O=>`<option value="${O.id}">${O.name} · ${O.category}</option>`).join(""),M.addEventListener("change",()=>{h.armPlacement(M.value||null)}),c.querySelector("[data-place]").addEventListener("click",()=>{M.value&&h.armPlacement(M.value)}),c.querySelectorAll("[data-xmode]").forEach(O=>O.addEventListener("click",()=>{h.setTransformMode(O.getAttribute("data-xmode")),c.querySelectorAll("[data-xmode]").forEach(k=>k.classList.remove("active")),O.classList.add("active")})),c.querySelector("[data-del-obj]").addEventListener("click",()=>{h.deleteSelected(),u("已删除物件"),R(null)})}o.addEventListener("click",M=>{const O=M.target.closest(".tab");if(!O)return;const k=O.getAttribute("data-mode");o.querySelectorAll(".tab").forEach(q=>q.classList.remove("active")),O.classList.add("active"),h.setMode(k),k==="terrain"?y():C()});function R(M){a.innerHTML='<h4>属性 Inspector</h4><div class="inspector-body"></div>';const O=a.querySelector(".inspector-body");if(M){const k=d.objects.find(q=>q.id===M);k&&O.appendChild(ne(k));return}h.getMode()==="object"?O.innerHTML='<p class="muted">选择「放置」后点击地形放置元件；点击已放置的元件可在此调整变换。</p>':O.innerHTML='<p class="muted">地形模式：左键拖动笔刷抬高/降低地形，右键拖动旋转视角，滚轮缩放。用「注水/排水」笔刷在地形上画局部河流与池塘，用水位滑块控制全局水面高度。</p>'}function z(M,O,k){const q=document.createElement("label");q.className="field",q.innerHTML=`<span>${M}</span>`;const W=document.createElement("input");return W.type="number",W.step="0.1",W.value=String(O),W.addEventListener("input",()=>k(parseFloat(W.value)||0)),q.appendChild(W),q}function ne(M){const O=document.createElement("div");O.className="inspector-form";const k=document.createElement("div");k.className="group-title",k.textContent=`物件：${M.name}`,O.appendChild(k);const q=["x","y","z"],W=(V,ie,K)=>{const me=document.createElement("div");me.className="group",me.innerHTML=`<div class="group-title">${V}</div>`;const xe=document.createElement("div");xe.className="vec3",q.forEach((ve,se)=>{xe.appendChild(z(["X","Y","Z"][se],ie[ve],le=>{K({...ie,[ve]:le}),_(M)}))}),me.appendChild(xe),O.appendChild(me)};return W("位置 Position",M.position,V=>M.position=V),W("旋转 Rotation (rad)",M.rotation,V=>M.rotation=V),W("缩放 Scale",M.scale,V=>M.scale=V),O}function _(M){h.syncTransform(M),u("物件已调整")}f.querySelector("[data-save]").addEventListener("click",async()=>{d.name=f.querySelector(".name-input").value||"Untitled Scene",d.thumbnail=h.captureThumbnail();const M={name:d.name,size:d.size,waterLevel:d.waterLevel,terrain:d.terrain,objects:d.objects,thumbnail:d.thumbnail};try{p?await uv(p,M):p=(await bc(M)).id,g=!1,m("已保存 ✓"),await w()}catch(O){m("保存失败："+O.message)}}),x=await On(),f.querySelector(".name-input").value=d.name,await w(),await h.setScene(d,x),y(),R(null)}function hh(i){switch(i){case"walk":return"walk";case"fly":return"fly";case"idle":return"idle";case"sit":return"sit";default:return null}}class kv{constructor(e){ue(this,"container");ue(this,"renderer");ue(this,"scene",new sa);ue(this,"camera");ue(this,"controls");ue(this,"transform");ue(this,"clock",new ca);ue(this,"sceneModel",null);ue(this,"assets",new Map);ue(this,"anim",null);ue(this,"terrainMesh",null);ue(this,"waterMesh",null);ue(this,"waterLocalMesh",null);ue(this,"objectsGroup",new mn);ue(this,"objectGroups",new Map);ue(this,"charAnimators",new Map);ue(this,"charState",new Map);ue(this,"markersGroup",new mn);ue(this,"targetMarker",null);ue(this,"playing",!1);ue(this,"time",0);ue(this,"speed",1);ue(this,"duration",8);ue(this,"selectedTrackId",null);ue(this,"draggingGizmo",!1);ue(this,"resize",()=>{const e=this.container.clientWidth||600,t=this.container.clientHeight||400;this.renderer.setSize(e,t);const n=this.renderer.domElement;n.style.display="block",n.style.width="100%",n.style.height="100%",this.camera.aspect=e/t,this.camera.updateProjectionMatrix()});ue(this,"animate",()=>{var t;requestAnimationFrame(this.animate);const e=this.clock.getDelta();this.playing&&this.anim&&(this.time+=e*this.speed,this.time>this.duration&&(this.time-=this.duration),this.applyCameraPose(),this.applyObjectPoses(),(t=this.onTimeTick)==null||t.call(this,this.time)),this.charAnimators.forEach((n,s)=>{const r=this.charState.get(s)??"none",a=hh(r);a&&n.getClipNames().includes(a)&&n.update(e*this.speed)}),this.controls.update(),this.renderer.render(this.scene,this.camera)});ue(this,"onTimeTick");this.container=e,this.scene.background=new je("#10131a"),this.camera=new kt(50,1,.1,2e3),this.camera.position.set(18,16,18),this.renderer=new ia({antialias:!0,preserveDrawingBuffer:!0}),this.renderer.setPixelRatio(window.devicePixelRatio),e.appendChild(this.renderer.domElement),this.controls=new _c(this.camera,this.renderer.domElement),this.controls.enableDamping=!0,this.controls.target.set(0,0,0),this.controls.maxPolarAngle=Math.PI/2.05,this.transform=new vc(this.camera,this.renderer.domElement),this.transform.setSize(.9),this.transform.addEventListener("dragging-changed",r=>{this.draggingGizmo=r.value,this.controls.enabled=!this.draggingGizmo}),this.transform.addEventListener("objectChange",()=>{this.selectedTrackId&&this.onGizmoChange()}),this.transform.addEventListener("mouseUp",()=>{this.selectedTrackId&&this.onGizmoChange(!0)}),this.scene.add(this.transform.getHelper()),this.scene.add(new aa("#ffffff","#3a3f4b",1));const t=new oa("#ffffff",1.5);t.position.set(10,18,8),this.scene.add(t),this.scene.add(this.objectsGroup),this.scene.add(this.markersGroup),this.renderer.domElement.addEventListener("pointerdown",()=>this.applyMouseButtons()),window.addEventListener("resize",()=>this.resize()),new ResizeObserver(()=>this.resize()).observe(this.container),this.resize(),this.animate()}async setScene(e,t){this.sceneModel=e,this.assets=new Map(t.map(n=>[n.id,n])),e.terrain&&Qo(e.terrain),this.rebuildTerrain(),this.rebuildWater(),this.rebuildWaterLocal(),this.rebuildObjects(),this.camera.position.set(e.size*.75,e.size*.65,e.size*.75),this.controls.target.set(0,0,0)}setAnimation(e){this.anim=e,this.duration=e.duration,this.time=0,this.rebuildMarkers(),this.applyCameraPose(),this.applyObjectPoses()}refresh(){this.anim&&(this.duration=this.anim.duration,this.rebuildMarkers(),this.applyCameraPose(),this.playing||this.applyObjectPoses(),this.selectedTrackId&&this.selectTrack(this.selectedTrackId))}setTime(e){this.time=Math.max(0,Math.min(this.duration,e)),this.applyCameraPose(),this.applyObjectPoses(),this.rebuildMarkers()}getTime(){return this.time}getDuration(){return this.duration}setPlaying(e){this.playing=e,e&&this.transform.detach()}isPlaying(){return this.playing}setSpeed(e){this.speed=Math.max(.05,e)}setTransformMode(e){this.transform.setMode(e)}selectTrack(e){if(this.selectedTrackId=e,!e||this.playing){this.transform.detach();return}const t=this.findTrack(e);if((t==null?void 0:t.kind)==="object"&&t.objectId){const n=this.objectGroups.get(t.objectId);n?this.transform.attach(n):this.transform.detach()}else this.transform.detach()}recordCamera(){if(!this.anim)return;const e=this.findTrackByKind("camera"),t=this.findTrackByKind("cameraTarget");e&&this.writeKeyframe(e,this.time,this.camera.position,void 0,void 0),t&&this.writeKeyframe(t,this.time,this.controls.target,void 0,void 0),this.rebuildMarkers()}recordSelectedObject(){if(!this.anim||!this.selectedTrackId)return;const e=this.findTrack(this.selectedTrackId);if(!e||e.kind!=="object"||!e.objectId)return;const t=this.objectGroups.get(e.objectId);t&&(this.writeKeyframe(e,this.time,{x:t.position.x,y:t.position.y,z:t.position.z},{x:t.rotation.x,y:t.rotation.y,z:t.rotation.z},{x:t.scale.x,y:t.scale.y,z:t.scale.z}),this.rebuildMarkers())}getSelectedObject(){const e=this.selectedTrackId?this.findTrack(this.selectedTrackId):null;return!e||e.kind!=="object"||!e.objectId||!this.sceneModel?null:this.sceneModel.objects.find(t=>t.id===e.objectId)??null}setSelectedObjectTransform(e){const t=e&&this.objectGroups.get(e.id);t&&(t.position.set(e.position.x,e.position.y,e.position.z),t.rotation.set(e.rotation.x,e.rotation.y,e.rotation.z),t.scale.set(e.scale.x,e.scale.y,e.scale.z))}syncObjectTransform(e){const t=this.objectGroups.get(e.id);t&&(e.position={x:t.position.x,y:t.position.y,z:t.position.z},e.rotation={x:t.rotation.x,y:t.rotation.y,z:t.rotation.z},e.scale={x:t.scale.x,y:t.scale.y,z:t.scale.z})}captureThumbnail(){return this.renderer.render(this.scene,this.camera),this.renderer.domElement.toDataURL("image/png")}dispose(){this.renderer.dispose(),this.controls.dispose(),this.transform.detach(),this.transform.dispose(),window.removeEventListener("resize",this.resize)}rebuildTerrain(){if(this.terrainMesh&&(this.scene.remove(this.terrainMesh),this.terrainMesh.geometry.dispose(),this.terrainMesh.material.dispose()),!this.sceneModel)return;const e=this.sceneModel.terrain,t=Sn(e.segments),n=new Float32Array(t*t*3);let s=0;for(let c=0;c<t;c++)for(let l=0;l<t;l++)n[s++]=-e.size/2+l/e.segments*e.size,n[s++]=e.heights[c*t+l]??0,n[s++]=-e.size/2+c/e.segments*e.size;const r=[];for(let c=0;c<e.segments;c++)for(let l=0;l<e.segments;l++){const h=c*t+l,f=c*t+l+1,d=(c+1)*t+l,p=(c+1)*t+l+1;r.push(h,d,f),r.push(f,d,p)}const a=new ct;a.setAttribute("position",new Lt(n,3)),a.setIndex(r),a.computeVertexNormals();const o=new gn({color:e.color,roughness:.95,metalness:0,flatShading:!1});this.terrainMesh=new Ee(a,o),this.scene.add(this.terrainMesh)}rebuildWater(){if(this.waterMesh&&(this.scene.remove(this.waterMesh),this.waterMesh.geometry.dispose(),this.waterMesh.material.dispose()),!this.sceneModel)return;const e=new kn(this.sceneModel.size,this.sceneModel.size);e.rotateX(-Math.PI/2);const t=new gn({color:"#2f7fbf",transparent:!0,opacity:.55,roughness:.2,metalness:.1});this.waterMesh=new Ee(e,t),this.waterMesh.position.y=this.sceneModel.waterLevel,this.scene.add(this.waterMesh)}rebuildWaterLocal(){if(this.waterLocalMesh&&(this.scene.remove(this.waterLocalMesh),this.waterLocalMesh.geometry.dispose(),this.waterLocalMesh.material.dispose(),this.waterLocalMesh=null),!this.sceneModel)return;const e=this.sceneModel.terrain,t=Sn(e.segments),n=new Float32Array(t*t*3);let s=0;const r=l=>{const h=e.water[l]??0,f=e.heights[l]??0;return h>.001?f+h:f-.02};for(let l=0;l<t;l++)for(let h=0;h<t;h++){const f=l*t+h;n[s++]=-e.size/2+h/e.segments*e.size,n[s++]=r(f),n[s++]=-e.size/2+l/e.segments*e.size}const a=[];for(let l=0;l<e.segments;l++)for(let h=0;h<e.segments;h++){const f=l*t+h,d=l*t+h+1,p=(l+1)*t+h,g=(l+1)*t+h+1;a.push(f,p,d),a.push(d,p,g)}const o=new ct;o.setAttribute("position",new Lt(n,3)),o.setIndex(a),o.computeVertexNormals();const c=new gn({color:"#3a93d6",transparent:!0,opacity:.6,roughness:.15,metalness:.1,side:jt});this.waterLocalMesh=new Ee(o,c),this.scene.add(this.waterLocalMesh)}rebuildObjects(){if(this.objectGroups.forEach(e=>this.objectsGroup.remove(e)),this.objectGroups.clear(),this.charAnimators.clear(),this.charState.clear(),!!this.sceneModel)for(const e of this.sceneModel.objects)this.buildObject(e)}async buildObject(e){const t=this.assets.get(e.assetId);if(!t)return;const n=await us(t.root),s=a=>n.get(a)??null,r=hs(t.root,s);if(r.userData.sceneObjId=e.id,r.position.set(e.position.x,e.position.y,e.position.z),r.rotation.set(e.rotation.x,e.rotation.y,e.rotation.z),r.scale.set(e.scale.x,e.scale.y,e.scale.z),this.objectGroups.set(e.id,r),this.objectsGroup.add(r),t.characterType){const a=vh[t.characterType]??[],o=new wd(r);o.setClips(a),o.rebind(r),this.charAnimators.set(e.id,o)}this.selectedTrackId&&this.selectTrack(this.selectedTrackId)}applyCameraPose(){if(!this.anim)return;const e=this.findTrackByKind("camera"),t=this.findTrackByKind("cameraTarget");if(e){const n=Zi(e,this.time);this.camera.position.set(n.position.x,n.position.y,n.position.z)}if(t){const n=Zi(t,this.time);this.controls.target.set(n.position.x,n.position.y,n.position.z)}this.controls.update(),this.targetMarker||(this.targetMarker=new Ee(new ls(.4,12,12),new as({color:"#ffb300",wireframe:!0})),this.scene.add(this.targetMarker)),this.targetMarker.position.copy(this.controls.target)}applyObjectPoses(){if(!(!this.anim||!this.sceneModel))for(const e of this.anim.tracks){if(e.kind!=="object"||!e.objectId)continue;const t=this.objectGroups.get(e.objectId);if(!t)continue;const n=Zi(e,this.time);t.position.set(n.position.x,n.position.y,n.position.z),t.rotation.set(n.rotation.x,n.rotation.y,n.rotation.z),t.scale.set(n.scale.x,n.scale.y,n.scale.z);const s=this.charAnimators.get(e.objectId);if(s){const r=hh(n.state);this.charState.set(e.objectId,n.state),r&&s.getClipNames().includes(r)?s.play(r,!1):s.applyRest()}}}findTrack(e){var t;return((t=this.anim)==null?void 0:t.tracks.find(n=>n.id===e))??null}findTrackByKind(e){var t;return((t=this.anim)==null?void 0:t.tracks.find(n=>n.kind===e))??null}writeKeyframe(e,t,n,s,r){const a=e.keyframes.find(o=>Math.abs(o.time-t)<.001);a?(a.position={...n},s&&(a.rotation={...s}),r&&(a.scale={...r})):(e.keyframes.push({time:t,position:{...n},rotation:s??{x:0,y:0,z:0},scale:r??{x:1,y:1,z:1}}),e.keyframes.sort((o,c)=>o.time-c.time))}onGizmoChange(e=!1){if(!this.anim||!this.selectedTrackId)return;const t=this.findTrack(this.selectedTrackId);if(!t||t.kind!=="object"||!t.objectId)return;const n=this.objectGroups.get(t.objectId);if(!n)return;const s={x:n.position.x,y:n.position.y,z:n.position.z},r={x:n.rotation.x,y:n.rotation.y,z:n.rotation.z},a={x:n.scale.x,y:n.scale.y,z:n.scale.z};if(e?(this.writeKeyframe(t,this.time,s,r,a),this.rebuildMarkers()):this.writeKeyframe(t,this.time,s,r,a),this.sceneModel){const o=this.sceneModel.objects.find(c=>c.id===t.objectId);o&&(o.position=s,o.rotation=r,o.scale=a)}}rebuildMarkers(){if(!this.anim)return;this.markersGroup.clear();const e=this.findTrackByKind("camera"),t=this.findTrackByKind("cameraTarget");e&&this.addTrackMarkers(e,"#5fd0ff",!0),t&&this.addTrackMarkers(t,"#ffb300",!1)}addTrackMarkers(e,t,n){const s=[...e.keyframes].sort((a,o)=>a.time-o.time),r=[];for(const a of s){const o=new Ee(n?new ra(.35,.9,10):new ls(.35,10,10),new as({color:t}));o.position.set(a.position.x,a.position.y,a.position.z),this.markersGroup.add(o),r.push(new D(a.position.x,a.position.y,a.position.z))}if(r.length>=2){const a=new ct().setFromPoints(r),o=new tn(a,new cs({color:t,transparent:!0,opacity:.5}));this.markersGroup.add(o)}}applyMouseButtons(){this.controls.mouseButtons={LEFT:Wt.ROTATE,MIDDLE:Wt.DOLLY,RIGHT:Wt.PAN}}}const dh=[{value:"none",label:"无 / 仅位移"},{value:"walk",label:"走 Walk"},{value:"fly",label:"飞 Fly"},{value:"idle",label:"站立 Idle"},{value:"sit",label:"坐 Sit"}];let uh=0;function Bv(){return uh+=1,`track_${Date.now().toString(36)}_${uh.toString(36)}`}async function Hv(i,e){const t=document.createElement("div");t.className="page editor-page",t.appendChild(Fn("animation")),i.appendChild(t);const n=document.createElement("div");n.className="editor-layout";const s=document.createElement("div");s.className="panel anim-list";const r=document.createElement("div");r.className="panel viewport-panel";const a=document.createElement("div");a.className="panel inspector",n.append(s,r,a),t.appendChild(n);const o=document.createElement("div");o.className="toolbar anim-toolbar",r.appendChild(o);const c=document.createElement("div");c.className="viewport-host",r.appendChild(c);const l=new kv(c);l.onTimeTick=se=>{u&&(u.value=String(se)),m&&(m.textContent=se.toFixed(2)+"s"),ve(se)};const h=document.createElement("div");h.className="editor-topbar",h.innerHTML=`
    <a class="btn small" href="#/scenes">← 返回</a>
    <input class="name-input" type="text" value="Untitled Animation" />
    <button class="btn primary" data-save>保存</button>
    <span class="save-state"></span>
  `,t.insertBefore(h,n);let f=null,d=[],p=null,g=e,x=null,u=null,m=null;function w(se){h.querySelector(".save-state").textContent=se}function S(se){w(se+"（未保存）")}async function y(){const se=await la();s.innerHTML='<h4>场景 Scenes</h4><div class="scene-items"></div>';const le=s.querySelector(".scene-items");for(const A of se){const I=document.createElement("div");I.className="scene-item"+(f&&f.id===A.id?" active":""),I.innerHTML=`<span class="sname">${A.name}</span>`,I.addEventListener("click",()=>L(A.id)),le.appendChild(I)}}async function L(se){const le=await Yr(se);le&&(f=le,d=await On(),await l.setScene(f,d),h.querySelector(".name-input").value=f.name+" 动画",g=void 0,p=null,x=null,await C(se))}async function C(se){const le=await Tc(se);let A=s.querySelector(".anim-items-box");A||(A=document.createElement("div"),A.className="anim-items-box",s.appendChild(A)),A.innerHTML="<h4>动画 Animations</h4>";const I=document.createElement("button");I.className="btn small full",I.textContent="＋ 从场景创建动画",I.addEventListener("click",()=>R(se)),A.appendChild(I);const X=document.createElement("div");X.className="anim-items";for(const Y of le){const fe=document.createElement("div");fe.className="anim-item"+(g===Y.id?" active":""),fe.innerHTML=`<span class="aname">${Y.name}</span><button class="sdel" title="删除">×</button>`,fe.addEventListener("click",U=>{if(U.target.classList.contains("sdel")){confirm(`删除动画「${Y.name}」？`)&&Sd(Y.id).then(()=>{g===Y.id&&(p=null,g=void 0),C(se)});return}z(Y.id)}),X.appendChild(fe)}A.appendChild(X)}async function R(se){const le=f;p=Kr(se,le.name,le.size),g=void 0,x=null,h.querySelector(".name-input").value=p.name,l.setAnimation(p),ne(),_(),await C(se),S("已新建（未保存）")}async function z(se){const le=await yd(se);if(le){if(!f||f.id!==le.sceneId){const A=await Yr(le.sceneId);A&&(f=A,d=await On(),await l.setScene(f,d))}p=le,g=se,x=null,h.querySelector(".name-input").value=p.name,l.setAnimation(p),ne(),_(),await C(le.sceneId),w("")}}function ne(){o.innerHTML=`
      <button class="btn small" data-play>⏸ 暂停</button>
      <label class="field inline">时间 <input type="range" min="0" max="${(p==null?void 0:p.duration)??8}" step="0.01" value="0" data-scrub /><span data-time>0.00s</span></label>
      <label class="field inline">速度 <input type="range" min="0.1" max="3" step="0.1" value="1" data-speed /><span data-speed-v>1.0</span></label>
      <label class="field inline">时长(s) <input type="number" min="0.1" step="0.1" value="${(p==null?void 0:p.duration)??8}" data-dur style="width:60px"/></label>
      <span class="sep"></span>
      <button class="btn small primary" data-rec-cam>📷 记录相机/目标关键帧</button>
      <button class="btn small" data-rec-obj>🎯 记录选中物件关键帧</button>
    `,u=o.querySelector("[data-scrub]"),m=o.querySelector("[data-time]");const se=o.querySelector("[data-play]");se.addEventListener("click",()=>{const X=!l.isPlaying();l.setPlaying(X),se.textContent=X?"⏸ 暂停":"▶ 播放",X||l.selectTrack(x)}),u.addEventListener("input",()=>{l.setTime(parseFloat(u.value))});const le=o.querySelector("[data-speed]"),A=o.querySelector("[data-speed-v]");le.addEventListener("input",()=>{l.setSpeed(parseFloat(le.value)||1),A.textContent=parseFloat(le.value).toFixed(1)});const I=o.querySelector("[data-dur]");I.addEventListener("input",()=>{p&&(p.duration=Math.max(.1,parseFloat(I.value)||1),l.refresh(),S("时长已调整"))}),o.querySelector("[data-rec-cam]").addEventListener("click",()=>{l.recordCamera(),S("已记录相机关键帧"),_()}),o.querySelector("[data-rec-obj]").addEventListener("click",()=>{x&&(l.recordSelectedObject(),S("已记录物件关键帧"),_())})}function _(){a.innerHTML=`
      <h4>轨道 Tracks</h4>
      <div class="track-list"></div>
      <div class="add-track"></div>
      <div class="inspector-body"></div>
      <h4>时间轴 Timeline</h4>
      <div class="timeline-list"></div>
    `,O(),k(),V(),xe()}function M(){const se=new Set;return p==null||p.tracks.forEach(le=>{le.kind==="object"&&le.objectId&&se.add(le.objectId)}),se}function O(){const se=a.querySelector(".track-list");if(!p){se.innerHTML='<p class="muted">先选择一个场景并创建 / 加载动画。</p>';return}se.innerHTML="";for(const le of p.tracks){const A=document.createElement("div");A.className="track-row"+(le.id===x?" selected":"");const I=le.kind==="camera"?"🎥":le.kind==="cameraTarget"?"🎯":"📦",X=le.kind==="camera"?"相机 Camera":le.kind==="cameraTarget"?"相机目标 Target":le.label??"物件",Y=le.kind==="object"?`<button class="row-del" data-del-track="${le.id}" title="删除轨道">×</button>`:"";A.innerHTML=`<span class="ticon">${I}</span><span class="tname">${X}</span>${Y}`,A.addEventListener("click",fe=>{fe.target.classList.contains("row-del")||(x=le.id,l.selectTrack(le.id),O(),V())}),se.appendChild(A)}}function k(){const se=a.querySelector(".add-track");if(!f){se.innerHTML="";return}const le=M(),A=f.objects.filter(I=>!le.has(I.id));if(A.length===0){se.innerHTML='<p class="muted tiny">场景中所有物件已绑定轨道（每个物件最多一个）。</p>';return}se.innerHTML=`
      <div class="add-track-row">
        <select class="obj-select" data-obj><option value="">绑定物件…</option>${A.map(I=>`<option value="${I.id}">${I.name}</option>`).join("")}</select>
        <button class="btn tiny primary" data-add-track>＋ 添加轨道</button>
      </div>
      <p class="muted tiny">自定义轨道绑定场景中的角色 / 元件，可调整其位置并设区段动画状态（走 / 飞）。</p>
    `,se.querySelector("[data-add-track]").addEventListener("click",()=>{const X=se.querySelector("[data-obj]").value;!X||!p||W(X)})}function q(se){return f==null?void 0:f.objects.find(le=>le.id===se)}function W(se){const le=q(se);if(!le||!p)return;const A={id:Bv(),kind:"object",objectId:se,label:le.name,keyframes:[{time:0,position:{...le.position},rotation:{...le.rotation},scale:{...le.scale}}]};p.tracks.push(A),x=A.id,l.refresh(),l.selectTrack(A.id),O(),k(),V(),xe(),S("已添加轨道")}function V(){const se=a.querySelector(".inspector-body");if(se.innerHTML="",!p||!x){se.innerHTML='<p class="muted">在上方选择一个轨道进行编辑；相机 / 目标轨道可用「记录关键帧」在时间轴上取景。</p>';return}const le=p.tracks.find(de=>de.id===x);if(!le)return;if(le.kind==="camera"||le.kind==="cameraTarget"){se.innerHTML=`<div class="group"><div class="group-title">${le.kind==="camera"?"相机":"相机目标"} 轨道</div>
        <p class="muted">移动视角后用工具栏「记录相机/目标关键帧」在当前时间写入关键帧（空 node）。关键帧之间线性插值。</p></div>`;return}const A=le.objectId?q(le.objectId):void 0;if(!A){se.innerHTML='<p class="muted">绑定的物件不存在。</p>';return}const I=document.createElement("div");I.className="group-title",I.textContent=`物件轨道：${le.label??A.name}`,se.appendChild(I);const X=document.createElement("div");X.className="toolbar-row",X.innerHTML=`
      <span class="muted">变换：</span>
      <button class="btn tiny mode active" data-xmode="translate">移动</button>
      <button class="btn tiny mode" data-xmode="rotate">旋转</button>
      <button class="btn tiny mode" data-xmode="scale">缩放</button>`,X.querySelectorAll("[data-xmode]").forEach(de=>de.addEventListener("click",()=>{l.setTransformMode(de.getAttribute("data-xmode")),X.querySelectorAll(".mode").forEach(E=>E.classList.remove("active")),de.classList.add("active")})),se.appendChild(X);const Y=K(le),fe=(de,E,B)=>{const ae=document.createElement("div");ae.className="group",ae.innerHTML=`<div class="group-title">${de}</div>`;const pe=document.createElement("div");pe.className="vec3",["x","y","z"].forEach((ge,De)=>{const he=document.createElement("label");he.className="field",he.innerHTML=`<span>${["X","Y","Z"][De]}</span>`;const b=document.createElement("input");b.type="number",b.step="0.1",b.value=String(E[ge]),b.addEventListener("input",()=>{B({...E,[ge]:parseFloat(b.value)||0})}),he.appendChild(b),pe.appendChild(he)}),ae.appendChild(pe),se.appendChild(ae)};fe("位置 Position",Y.position,de=>{me(le,l.getTime(),de,Y.rotation,Y.scale),ie(A,le)}),fe("旋转 Rotation (rad)",Y.rotation,de=>{me(le,l.getTime(),Y.position,de,Y.scale),ie(A,le)}),fe("缩放 Scale",Y.scale,de=>{me(le,l.getTime(),Y.position,Y.rotation,de),ie(A,le)});const U=document.createElement("div");U.className="group",U.innerHTML='<div class="group-title">区段动画状态 Segment State</div>';const te=document.createElement("select");te.className="state-select",te.innerHTML=dh.map(de=>`<option value="${de.value}" ${Y.state===de.value?"selected":""}>${de.label}</option>`).join(""),te.addEventListener("change",()=>{const de=K(le,!0);de.state=te.value,l.refresh(),S("状态已设置"),xe()}),U.appendChild(te),se.appendChild(U);const ye=document.createElement("div");ye.className="group",ye.innerHTML='<div class="group-title">关键帧 Keyframes</div>',le.keyframes.forEach((de,E)=>{const B=document.createElement("div");B.className="kf-row",B.innerHTML='<span class="kf-time">t</span>';const ae=document.createElement("input");ae.type="number",ae.step="0.1",ae.min="0",ae.value=de.time.toFixed(2),ae.addEventListener("input",()=>{de.time=Math.max(0,Math.min(p.duration,parseFloat(ae.value)||0)),le.keyframes.sort((De,he)=>De.time-he.time),l.refresh(),xe()});const pe=document.createElement("select");pe.innerHTML=dh.map(De=>`<option value="${De.value}" ${de.state===De.value?"selected":""}>${De.label}</option>`).join(""),pe.addEventListener("change",()=>{de.state=pe.value,l.refresh(),xe()});const ge=document.createElement("button");ge.className="row-del",ge.textContent="×",ge.addEventListener("click",()=>{le.keyframes.splice(E,1),l.refresh(),V(),xe(),S("已删除关键帧")}),B.append(ae,pe,ge),ye.appendChild(B)}),se.appendChild(ye)}function ie(se,le){const A=K(le);se.position={...A.position},se.rotation={...A.rotation},se.scale={...A.scale},l.setSelectedObjectTransform(se),S("已调整关键帧")}function K(se,le=!1){const A=l.getTime();let I=se.keyframes.find(X=>Math.abs(X.time-A)<.001);if(!I&&le){const X=se.objectId?q(se.objectId):void 0;I={time:A,position:X?{...X.position}:P(),rotation:X?{...X.rotation}:P(),scale:X?{...X.scale}:P(1,1,1)},se.keyframes.push(I),se.keyframes.sort((Y,fe)=>Y.time-fe.time)}return I||(I=se.keyframes[0]??{time:A,position:P(),rotation:P(),scale:P(1,1,1)}),I}function me(se,le,A,I,X){let Y=se.keyframes.find(fe=>Math.abs(fe.time-le)<.001);Y||(Y={time:le,position:{...A},rotation:I??P(),scale:X??P(1,1,1)},se.keyframes.push(Y),se.keyframes.sort((fe,U)=>fe.time-U.time)),Y.position={...A},I&&(Y.rotation={...I}),X&&(Y.scale={...X}),l.refresh(),S("已调整关键帧")}function xe(){const se=a.querySelector(".timeline-list");if(!p){se.innerHTML="";return}const le=p.duration;se.innerHTML="";for(const A of p.tracks){const I=document.createElement("div");I.className="tl-track"+(A.id===x?" selected":"");const X=A.kind==="camera"?"🎥":A.kind==="cameraTarget"?"🎯":"📦";I.innerHTML=`<span class="tl-label">${X}</span><div class="tl-bar" data-track="${A.id}"></div>`;const Y=I.querySelector(".tl-bar");for(const U of A.keyframes){const te=document.createElement("span");te.className="tl-dot"+(U.state&&U.state!=="none"?" has-state":""),te.style.left=(U.time/le*100).toFixed(2)+"%",te.title=`t=${U.time.toFixed(2)}s${U.state&&U.state!=="none"?" · "+U.state:""}`,te.addEventListener("click",ye=>{ye.stopPropagation(),l.setTime(U.time),A.kind==="object"&&(x=A.id,l.selectTrack(A.id),O())}),Y.appendChild(te)}const fe=document.createElement("span");fe.className="tl-playhead",Y.appendChild(fe),Y.addEventListener("click",U=>{const te=Y.getBoundingClientRect(),ye=Math.max(0,Math.min(le,(U.clientX-te.left)/te.width*le));l.setTime(ye)}),I.addEventListener("click",()=>{A.kind==="object"&&(x=A.id,l.selectTrack(A.id),O(),V())}),se.appendChild(I)}ve(l.getTime())}function ve(se){if(!p)return;const le=p.duration;a.querySelectorAll(".tl-bar").forEach(A=>{const I=A.querySelector(".tl-playhead");I&&(I.style.left=(se/le*100).toFixed(2)+"%")})}h.querySelector("[data-save]").addEventListener("click",async()=>{if(!p||!f){w("请先选择场景");return}const se=h.querySelector(".name-input").value||"Untitled Animation";p.name=se,p.thumbnail=l.captureThumbnail();const le={name:p.name,sceneId:f.id,duration:p.duration,tracks:p.tracks,thumbnail:p.thumbnail};try{g?await Md(g,le):g=(await Ac(le)).id,w("已保存 ✓")}catch(A){w("保存失败："+A.message)}}),await y(),e?await z(e):(ne(),_())}const Td="火车大劫案 Train Robbery",bt=40,Ln=15,Gv=96,Vv=64,ft=Math.PI/2;let fh=0;function Wv(i){return fh+=1,`${i}_${Date.now().toString(36)}_${fh.toString(36)}`}function $(i,e,t){return{x:i,y:e,z:t}}function Pn(i,e,t){return{id:Wv("track"),kind:"object",objectId:i,label:e,keyframes:t.map(n=>({time:n.t,position:{...n.pos},rotation:n.rot??$(0,0,0),scale:$(1,1,1),...n.state?{state:n.state}:{}}))}}function Es(i,e,t){return i+(e-i)*t}function br(i,e){return Math.atan2(e.x-i.x,e.z-i.z)}function en(i,e){let t=0;return t+=Math.max(0,Math.abs(i)-34)*.28,t+=Math.max(0,Math.abs(e)-30)*.22,t>0&&(t+=Math.sin(i*.22)*Math.cos(e*.18)*.6),t}async function jv(){const e=(await la()).find(t=>t.name===Td);if(e){const t=await Tc(e.id);if(t.length)return{sceneId:e.id,animationId:t[0].id}}return Xv()}async function Xv(){const i=await dn(nu()),e=await dn(iu()),t=await dn(su()),n=await dn(ru()),s=await dn(au()),r=await dn(ou()),a=await dn(cu()),o=ui(i.root),c=ui(e.root),l=ui(n.root),h=ui(s.root),f=ui(a.root),p=2.51+f,g=E=>Es(-12,40,E/bt),x=(E,B)=>g(B)-7*E,u=(E,B)=>h+en(E,B),m=E=>o+en(g(E),0),w=(E,B)=>c+en(x(E,B),0),S=(E,B)=>p+en(x(E,B),0),y=(E,B,ae,pe)=>{if(pe<=Ln){const De=pe/Ln;return{x:Es(E.x,B.x,De),z:Es(E.z,B.z,De)}}const ge=(pe-Ln)/(bt-Ln);return{x:Es(B.x,ae.x,ge),z:Es(B.z,ae.z,ge)}},L=[{s:{x:-42,z:24},m:{x:-3,z:4},e:{x:40,z:8}},{s:{x:-44,z:27},m:{x:2,z:3},e:{x:40,z:6}},{s:{x:-40,z:29},m:{x:5,z:6},e:{x:26,z:16}},{s:{x:-45,z:22},m:{x:-5,z:5},e:{x:36,z:9}},{s:{x:-43,z:26},m:{x:7,z:3},e:{x:40,z:7}},{s:{x:-41,z:30},m:{x:1,z:7},e:{x:32,z:17}},{s:{x:-39,z:23},m:{x:-6,z:4},e:{x:42,z:6}}],C=1,R=4,z={2:26,5:37},ne=[{s:{x:-43,z:20},m:{x:-1,z:3},e:{x:44,z:6}},{s:{x:-45,z:23},m:{x:3,z:2},e:{x:44,z:5}}],_=[],M=si(t.id,"铁轨 Rail");M.position=$(0,ui(t.root),0),_.push(M);const O=si(i.id,"火车头 Locomotive");O.position=$(g(0),m(0),0),_.push(O);const k=[];for(let E=1;E<=3;E++){const B=si(e.id,`车厢 Car ${E}`);B.position=$(x(E,0),w(E,0),0),k.push(B),_.push(B)}const q=[];for(let E=1;E<=3;E++){const B=si(a.id,`护卫 Defender ${E}`);B.position=$(x(E,0),S(E,0),0),q.push(B),_.push(B)}const W=[];for(let E=0;E<L.length;E++){const B=L[E],ae=si(s.id,`劫匪 Bandit ${E+1}`);ae.position=$(B.s.x,u(B.s.x,B.s.z),B.s.z),ae.rotation=$(0,br(B.s,B.m),0),W.push(ae),_.push(ae)}const V=[];for(let E=0;E<ne.length;E++){const B=ne[E],ae=si(r.id,`护卫骑兵 Defender Rider ${E+1}`);ae.position=$(B.s.x,u(B.s.x,B.s.z),B.s.z),ae.rotation=$(0,br(B.s,B.m),0),V.push(ae),_.push(ae)}const ie=[[-22,20,.9],[14,22,1.1],[-8,24,.8],[20,19,1],[-30,23,1.2],[4,26,.85],[-16,22,1],[26,21,1.05],[-2,-22,.95],[10,-21,1.1],[-26,-22,1],[30,-20,.9],[-40,18,1.15],[38,16,1.2],[-38,-16,1],[40,-18,1.1],[-14,-26,.9],[22,-25,1.05],[-34,30,1.3],[34,28,1.25],[0,30,.9],[-44,-4,1.1],[44,2,1.1],[-6,28,.8]];for(let E=0;E<ie.length;E++){const[B,ae,pe]=ie[E],ge=si(n.id,`树 Tree ${E+1}`);ge.position=$(B,l+en(B,ae),ae),ge.rotation=$(0,E*1.3%(Math.PI*2),0),ge.scale=$(pe,pe,pe),_.push(ge)}const K=Mh(Gv,Vv,"#c2a878"),me=K.segments+1;for(let E=0;E<me;E++)for(let B=0;B<me;B++){const ae=-K.size/2+B/K.segments*K.size,pe=-K.size/2+E/K.segments*K.size;K.heights[E*me+B]=en(ae,pe)}const xe=await bc({name:Td,size:K.size,waterLevel:-4,terrain:K,objects:_}),ve=Kr(xe.id,xe.name,xe.size,"火车大劫案 · 动画");ve.duration=bt;const se=(E,B)=>y(L[E].s,L[E].m,L[E].e,B),le=ve.tracks.find(E=>E.kind==="camera"),A=ve.tracks.find(E=>E.kind==="cameraTarget"),I=se(0,0),X=se(0,8),Y=L[C].m,fe=y(L[2].s,L[2].m,L[2].e,26),U=y(L[R].s,L[R].m,L[R].e,31),te=en(U.x,U.z);le.keyframes=[{time:0,position:$(I.x-14,14,I.z-18),rotation:$(0,0,0),scale:$(1,1,1)},{time:8,position:$(X.x-12,8,X.z-14),rotation:$(0,0,0),scale:$(1,1,1)},{time:15,position:$(-2,20,34),rotation:$(0,0,0),scale:$(1,1,1)},{time:17,position:$(Y.x+3,3,Y.z+6),rotation:$(0,0,0),scale:$(1,1,1)},{time:20,position:$(Y.x+3,3,Y.z+6),rotation:$(0,0,0),scale:$(1,1,1)},{time:21,position:$(x(1,21)-1,3.5,7),rotation:$(0,0,0),scale:$(1,1,1)},{time:25,position:$(x(1,21)-1,3.5,7),rotation:$(0,0,0),scale:$(1,1,1)},{time:26,position:$(fe.x-3,3,fe.z+8),rotation:$(0,0,0),scale:$(1,1,1)},{time:30,position:$(fe.x-3,3,fe.z+8),rotation:$(0,0,0),scale:$(1,1,1)},{time:31,position:$(U.x+2.5,te+3,U.z+5),rotation:$(0,0,0),scale:$(1,1,1)},{time:36,position:$(U.x+2.5,te+3,U.z+5),rotation:$(0,0,0),scale:$(1,1,1)},{time:bt,position:$(52,20,30),rotation:$(0,0,0),scale:$(1,1,1)}],A.keyframes=[{time:0,position:$(I.x,en(I.x,I.z)+2,I.z),rotation:$(0,0,0),scale:$(1,1,1)},{time:8,position:$(X.x,en(X.x,X.z)+2,X.z),rotation:$(0,0,0),scale:$(1,1,1)},{time:15,position:$(0,2,0),rotation:$(0,0,0),scale:$(1,1,1)},{time:17,position:$(Y.x,2.2,Y.z),rotation:$(0,0,0),scale:$(1,1,1)},{time:20,position:$(Y.x,2.2,Y.z),rotation:$(0,0,0),scale:$(1,1,1)},{time:21,position:$(x(1,21),2,2),rotation:$(0,0,0),scale:$(1,1,1)},{time:25,position:$(x(1,21),1.5,3),rotation:$(0,0,0),scale:$(1,1,1)},{time:26,position:$(fe.x,2,fe.z),rotation:$(0,0,0),scale:$(1,1,1)},{time:30,position:$(fe.x,1.5,fe.z),rotation:$(0,0,0),scale:$(1,1,1)},{time:31,position:$(U.x,te+2.8,U.z),rotation:$(0,0,0),scale:$(1,1,1)},{time:36,position:$(U.x,te+1.4,U.z+1),rotation:$(0,0,0),scale:$(1,1,1)},{time:bt,position:$(42,2,0),rotation:$(0,0,0),scale:$(1,1,1)}],ve.tracks.push(Pn(O.id,"火车头",[{t:0,pos:$(g(0),m(0),0)},{t:bt,pos:$(g(bt),m(bt),0)}]));for(let E=1;E<=3;E++)ve.tracks.push(Pn(k[E-1].id,`车厢 ${E}`,[{t:0,pos:$(x(E,0),w(E,0),0)},{t:bt,pos:$(x(E,bt),w(E,bt),0)}]));const ye=[{idx:0,Te:21,Fd:4},{idx:1,Te:27,Fd:2.5}];for(let E=1;E<=3;E++){const B=q[E-1],ae=ye.find(pe=>pe.idx===E-1);if(ae){const pe=x(E,ae.Te),ge=en(pe,3)+f;ve.tracks.push(Pn(B.id,`护卫 ${E}（中枪坠车）`,[{t:0,pos:$(x(E,0),S(E,0),0),state:"idle"},{t:ae.Te-.5,pos:$(x(E,ae.Te-.5),S(E,ae.Te-.5),0),state:"idle"},{t:ae.Te,pos:$(pe,S(E,ae.Te)-.2,.6),rot:$(0,0,.4),state:"idle"},{t:ae.Te+.5,pos:$(pe,S(E,ae.Te)-.8,1.5),rot:$(0,0,.9),state:"idle"},{t:ae.Te+1.5,pos:$(pe,ge+.6,2.5),rot:$(0,0,1.3),state:"idle"},{t:ae.Te+ae.Fd,pos:$(pe-.5,ge,3),rot:$(0,0,Math.PI/2),state:"idle"},{t:bt,pos:$(pe-1.5,ge,3),rot:$(0,0,Math.PI/2),state:"idle"}]))}else ve.tracks.push(Pn(B.id,`护卫 ${E}`,[{t:0,pos:$(x(E,0),S(E,0),0),state:"idle"},{t:bt,pos:$(x(E,bt),S(E,bt),0),state:"idle"}]))}for(let E=0;E<L.length;E++){const B=L[E],ae=W[E],pe=br(B.s,B.m);if(E===C)ve.tracks.push(Pn(ae.id,`劫匪 ${E+1}（假装攻击·慢放）`,[{t:0,pos:$(B.s.x,u(B.s.x,B.s.z),B.s.z),rot:$(0,pe,0),state:"walk"},{t:Ln,pos:$(B.m.x,u(B.m.x,B.m.z),B.m.z),rot:$(0,ft,0),state:"walk"},{t:17,pos:$(B.m.x+.5,u(B.m.x+.5,B.m.z),B.m.z),rot:$(.22,ft,0),state:"walk"},{t:19,pos:$(B.m.x+1.5,u(B.m.x+1.5,B.m.z),B.m.z),rot:$(.35,ft,0),state:"walk"},{t:20,pos:$(B.m.x+2.5,u(B.m.x+2.5,B.m.z),B.m.z),rot:$(0,ft,0),state:"walk"},{t:bt,pos:$(B.e.x,u(B.e.x,B.e.z),B.e.z),rot:$(0,ft,0),state:"walk"}]));else if(z[E]!==void 0){const ge=z[E],De=E===2?4:2,he=y(B.s,B.m,B.e,ge),b=(v,N)=>en(v,N);ve.tracks.push(Pn(ae.id,`劫匪 ${E+1}（中枪翻倒·慢放）`,[{t:0,pos:$(B.s.x,u(B.s.x,B.s.z),B.s.z),rot:$(0,pe,0),state:"walk"},{t:Ln,pos:$(B.m.x,u(B.m.x,B.m.z),B.m.z),rot:$(0,ft,0),state:"walk"},{t:ge-.6,pos:$(he.x,u(he.x,he.z),he.z),rot:$(0,ft,0),state:"walk"},{t:ge,pos:$(he.x,u(he.x,he.z+.5),he.z+.5),rot:$(0,ft,-.3),state:"none"},{t:ge+1,pos:$(he.x+1.5,b(he.x+1.5,he.z+2)+h*.8,he.z+2),rot:$(0,ft,-.9),state:"none"},{t:ge+2.5,pos:$(he.x+3,b(he.x+3,he.z+3.5)+h*.5,he.z+3.5),rot:$(0,ft,-1.6),state:"none"},{t:ge+De,pos:$(he.x+3,b(he.x+3,he.z+4)+h*.45,he.z+4),rot:$(0,ft,Math.PI),state:"none"},{t:bt,pos:$(he.x+3,b(he.x+3,he.z+4)+h*.45,he.z+4),rot:$(0,ft,Math.PI),state:"none"}]))}else if(E===R){const he=y(B.s,B.m,B.e,31),b=(v,N)=>en(v,N);ve.tracks.push(Pn(ae.id,`劫匪 ${E+1}（骑手中枪坠马·慢放）`,[{t:0,pos:$(B.s.x,u(B.s.x,B.s.z),B.s.z),rot:$(0,pe,0),state:"walk"},{t:Ln,pos:$(B.m.x,u(B.m.x,B.m.z),B.m.z),rot:$(0,ft,0),state:"walk"},{t:31-.6,pos:$(he.x,u(he.x,he.z),he.z),rot:$(0,ft,0),state:"walk"},{t:31,pos:$(he.x,u(he.x,he.z),he.z),rot:$(-.45,ft,0),state:"idle"},{t:31+.6,pos:$(he.x,u(he.x,he.z),he.z),rot:$(-.3,ft,.15),state:"idle"},{t:31+1.6,pos:$(he.x+.4,u(he.x,he.z+.6)-.2,he.z+.6),rot:$(.5,ft,.5),state:"none"},{t:34,pos:$(he.x+.8,b(he.x,he.z+1.6)+h*.7,he.z+1.6),rot:$(.3,ft,1.1),state:"none"},{t:36,pos:$(he.x+1,b(he.x,he.z+2.6)+h*.5,he.z+2.6),rot:$(0,ft,Math.PI/2),state:"none"},{t:bt,pos:$(he.x+1,b(he.x,he.z+2.6)+h*.5,he.z+2.6),rot:$(0,ft,Math.PI/2),state:"none"}]))}else ve.tracks.push(Pn(ae.id,`劫匪 ${E+1}`,[{t:0,pos:$(B.s.x,u(B.s.x,B.s.z),B.s.z),rot:$(0,pe,0),state:"walk"},{t:Ln,pos:$(B.m.x,u(B.m.x,B.m.z),B.m.z),rot:$(0,ft,0),state:"walk"},{t:bt,pos:$(B.e.x,u(B.e.x,B.e.z),B.e.z),rot:$(0,ft,0),state:"walk"}]))}for(let E=0;E<ne.length;E++){const B=ne[E],ae=V[E],pe=br(B.s,B.m);ve.tracks.push(Pn(ae.id,`护卫骑兵 ${E+1}`,[{t:0,pos:$(B.s.x,u(B.s.x,B.s.z),B.s.z),rot:$(0,pe,0),state:"walk"},{t:Ln,pos:$(B.m.x,u(B.m.x,B.m.z),B.m.z),rot:$(0,ft,0),state:"walk"},{t:bt,pos:$(B.e.x,u(B.e.x,B.e.z),B.e.z),rot:$(0,ft,0),state:"walk"}]))}const de=await Ac({name:ve.name,sceneId:xe.id,duration:ve.duration,tracks:ve.tracks});return{sceneId:xe.id,animationId:de.id}}async function qv(i){const e=document.createElement("div");e.className="page",e.appendChild(Fn("home"));const t=document.createElement("section");t.className="hero",t.innerHTML=`
    <h1>火车大劫案</h1>
    <p class="tagline">正在生成场景与动画…</p>
    <div class="cta">
      <button class="btn accent" disabled>⏳ 正在生成…</button>
    </div>
  `,e.appendChild(t),i.appendChild(e);try{const n=await jv();location.hash=`#/animations/${n.animationId}`}catch(n){t.innerHTML=`
      <h1>火车大劫案</h1>
      <p class="tagline">生成失败：${n.message}</p>
      <div class="cta"><a class="btn" href="#/library">返回元件库</a></div>
    `}}function wt(i,e,t,n){const s={name:e,group:i.group,ok:t,detail:n};i.results.push(s),console.log(`[selftest] ${t?"PASS":"FAIL"} · ${i.group} · ${e}${n?" — "+n:""}`)}function Qa(i,e,t=1e-6){return Math.abs(i-e)<=t}function $v(i){var a;i.group="schema";const e=Kr("scene_x","Demo",24);wt(i,"auto camera+target tracks",e.tracks.length===2),wt(i,"has camera track",e.tracks.some(o=>o.kind==="camera")),wt(i,"has cameraTarget track (empty node)",e.tracks.some(o=>o.kind==="cameraTarget")),wt(i,"target starts at origin",(()=>{const c=e.tracks.find(l=>l.kind==="cameraTarget").keyframes[0].position;return c.x===0&&c.y===0&&c.z===0})());const t={id:"t1",kind:"object",objectId:"obj1",keyframes:[{time:0,position:P(0,0,0),rotation:P(),scale:P(1,1,1)},{time:2,position:P(10,0,0),rotation:P(),scale:P(1,1,1),state:"walk"}]},n=Zi(t,1);wt(i,"midpoint interpolation (x≈5)",Qa(n.position.x,5),`x=${n.position.x}`),wt(i,"segment state carried (walk)",n.state==="walk",`state=${n.state}`);const s=Zi(t,-1);wt(i,"clamp before first kf",Qa(s.position.x,0));const r=Zi(t,99);wt(i,"clamp after last kf",Qa(r.position.x,10)),e.tracks.push(t),wt(i,"trackForObject finds bound track",((a=Hc(e,"obj1"))==null?void 0:a.id)==="t1"),wt(i,"trackForObject null for unbound",Hc(e,"nope")===null)}async function Yv(i){i.group="api";let e,t;try{const n=await bc({...no("SelfTest Scene")});e=n.id,wt(i,"create scene",!!n.id);const s=Kr(n.id,n.name,n.size,"SelfTest Anim"),r=await Ac({name:s.name,sceneId:s.sceneId,duration:s.duration,tracks:s.tracks});t=r.id,wt(i,"create animation",!!r.id),wt(i,"animation bound to scene",r.sceneId===n.id),wt(i,"persisted camera+target tracks",r.tracks.length===2);const a=await Tc(n.id);wt(i,"listByScene returns it",a.some(l=>l.id===r.id));const o=await Md(r.id,{name:"SelfTest Anim v2",sceneId:n.id,duration:12,tracks:r.tracks});wt(i,"update duration",o.duration===12,`duration=${o.duration}`);const c=await yd(r.id);wt(i,"get after update",(c==null?void 0:c.name)==="SelfTest Anim v2")}catch(n){wt(i,"api round-trip (no exception)",!1,String(n))}finally{t&&await Sd(t).catch(()=>{}),e&&await xd(e).catch(()=>{}),wt(i,"cleanup done",!0)}}function Kv(){const i=(location.hash.split("?")[1]||"")+"&"+(location.search.replace(/^\?/,"")||""),e=/(?:^|&)test=([^&]+)/.exec(i);if(!e)return[];const n=decodeURIComponent(e[1]).toLowerCase().split(",").map(s=>s.trim()).filter(Boolean);return n.includes("all")?["schema","api"]:n}async function Zv(i){const e={results:[],group:""};console.log(`[selftest] START groups=[${i.join(", ")}]`),i.includes("schema")&&$v(e),i.includes("api")&&await Yv(e);const t=e.results.filter(s=>s.ok).length,n=e.results.length-t;return console.log(`[selftest] DONE total=${e.results.length} passed=${t} failed=${n}`),window.__selftest={groups:i,total:e.results.length,passed:t,failed:n,results:e.results},e.results}function Jv(){const i=Kv();return i.length===0?!1:(Zv(i),!0)}const eo=1.7,ph=.0022,mh=Math.PI/2-.05;class Qv{constructor(e,t={}){ue(this,"container");ue(this,"renderer");ue(this,"scene",new sa);ue(this,"camera");ue(this,"clock",new ca);ue(this,"cb");ue(this,"sceneModel",null);ue(this,"assets",new Map);ue(this,"terrainMesh",null);ue(this,"waterMesh",null);ue(this,"waterLocalMesh",null);ue(this,"objectsGroup",new mn);ue(this,"mode","fly");ue(this,"speed",5);ue(this,"yaw",0);ue(this,"pitch",0);ue(this,"keys",new Set);ue(this,"locked",!1);ue(this,"recorder",null);ue(this,"chunks",[]);ue(this,"recording",!1);ue(this,"onPointerLockChange",()=>{var e,t;this.locked=document.pointerLockElement===this.renderer.domElement,(t=(e=this.cb).onLockChange)==null||t.call(e,this.locked)});ue(this,"onMouseMove",e=>{this.locked&&(this.yaw-=e.movementX*ph,this.pitch-=e.movementY*ph,this.pitch=Math.max(-mh,Math.min(mh,this.pitch)),this.applyRotation())});ue(this,"onKey",(e,t)=>{const n=e.key.toLowerCase();["w","a","s","d"," ","shift","control","q","e"].includes(n)&&(t?this.keys.add(n):this.keys.delete(n),n===" "&&e.preventDefault())});ue(this,"onKeyBound",e=>this.onKey(e,e.type==="keydown"));ue(this,"resize",()=>{const e=this.container.clientWidth||600,t=this.container.clientHeight||400;this.renderer.setSize(e,t),this.camera.aspect=e/t,this.camera.updateProjectionMatrix()});ue(this,"animate",()=>{requestAnimationFrame(this.animate);const e=this.clock.getDelta();this.move(e),this.renderer.render(this.scene,this.camera)});this.container=e,this.cb=t,this.scene.background=new je("#10131a"),this.scene.fog=new pc("#10131a",40,220),this.camera=new kt(60,1,.1,2e3),this.camera.rotation.order="YXZ",this.camera.position.set(0,eo,.01),this.renderer=new ia({antialias:!0,preserveDrawingBuffer:!0}),this.renderer.setPixelRatio(window.devicePixelRatio),e.appendChild(this.renderer.domElement);const n=this.renderer.domElement;n.style.display="block",n.style.width="100%",n.style.height="100%",n.style.cursor="pointer",this.scene.add(new aa("#ffffff","#3a3f4b",1));const s=new oa("#ffffff",1.5);s.position.set(10,18,8),this.scene.add(s),this.scene.add(this.objectsGroup),n.addEventListener("click",()=>this.requestLock()),document.addEventListener("pointerlockchange",this.onPointerLockChange),document.addEventListener("mousemove",this.onMouseMove),window.addEventListener("keydown",this.onKeyBound),window.addEventListener("keyup",this.onKeyBound),window.addEventListener("resize",()=>this.resize()),new ResizeObserver(()=>this.resize()).observe(this.container),this.resize(),this.animate()}async setScene(e,t){this.sceneModel=e,this.assets=new Map(t.map(r=>[r.id,r])),e.terrain&&Qo(e.terrain),this.rebuildTerrain(),this.rebuildWater(),this.rebuildWaterLocal(),await this.rebuildObjects();const n=io(e.terrain,0,0),s=e.size;this.camera.position.set(0,n+Math.max(eo+6,s*.45),0),this.yaw=0,this.pitch=-.4,this.applyRotation()}setMode(e){this.mode=e}getMode(){return this.mode}setSpeed(e){this.speed=Math.max(.5,e)}getSpeed(){return this.speed}isLocked(){return this.locked}exitLock(){document.pointerLockElement&&document.exitPointerLock()}isRecording(){return this.recording}requestMic(e){const t=new Promise((n,s)=>setTimeout(()=>s(new Error("mic timeout")),1500));return Promise.race([navigator.mediaDevices.getUserMedia({audio:!0}).then(n=>(n.getAudioTracks().forEach(s=>e.addTrack(s)),n)),t])}async startRecording(){var s,r;if(this.recording)return;const t=this.renderer.domElement.captureStream(30);await this.requestMic(t).catch(()=>null);const n=["video/webm;codecs=vp9","video/webm;codecs=vp8","video/webm"].find(a=>MediaRecorder.isTypeSupported(a));this.recorder=new MediaRecorder(t,n?{mimeType:n}:void 0),this.chunks=[],this.recorder.ondataavailable=a=>{a.data.size>0&&this.chunks.push(a.data)},this.recorder.onstop=()=>{const a=new Blob(this.chunks,{type:"video/webm"}),o=URL.createObjectURL(a),c=document.createElement("a");c.href=o,c.download=`roam-${Date.now()}.webm`,c.click(),setTimeout(()=>URL.revokeObjectURL(o),1e3)},this.recorder.start(),this.recording=!0,(r=(s=this.cb).onRecordingChange)==null||r.call(s,!0)}stopRecording(){var e,t;!this.recording||!this.recorder||(this.recorder.stop(),this.recorder=null,this.recording=!1,(t=(e=this.cb).onRecordingChange)==null||t.call(e,!1))}dispose(){this.stopRecording(),this.exitLock(),document.removeEventListener("pointerlockchange",this.onPointerLockChange),document.removeEventListener("mousemove",this.onMouseMove),window.removeEventListener("keydown",this.onKeyBound),window.removeEventListener("keyup",this.onKeyBound),window.removeEventListener("resize",this.resize),this.renderer.dispose()}rebuildTerrain(){if(this.terrainMesh&&(this.scene.remove(this.terrainMesh),this.terrainMesh.geometry.dispose(),this.terrainMesh.material.dispose()),!this.sceneModel)return;const e=this.buildTerrainGeometry(this.sceneModel.terrain),t=new gn({color:this.sceneModel.terrain.color,roughness:.95,metalness:0});this.terrainMesh=new Ee(e,t),this.scene.add(this.terrainMesh)}buildTerrainGeometry(e){const t=Sn(e.segments),n=new Float32Array(t*t*3);let s=0;for(let o=0;o<t;o++)for(let c=0;c<t;c++){const l=-e.size/2+c/e.segments*e.size,h=-e.size/2+o/e.segments*e.size,f=e.heights[o*t+c]??0;n[s++]=l,n[s++]=f,n[s++]=h}const r=[];for(let o=0;o<e.segments;o++)for(let c=0;c<e.segments;c++){const l=o*t+c,h=o*t+c+1,f=(o+1)*t+c,d=(o+1)*t+c+1;r.push(l,f,h),r.push(h,f,d)}const a=new ct;return a.setAttribute("position",new Lt(n,3)),a.setIndex(r),a.computeVertexNormals(),a}rebuildWater(){if(this.waterMesh&&(this.scene.remove(this.waterMesh),this.waterMesh.geometry.dispose(),this.waterMesh.material.dispose()),!this.sceneModel)return;const e=new kn(this.sceneModel.size,this.sceneModel.size);e.rotateX(-Math.PI/2);const t=new gn({color:"#2f7fbf",transparent:!0,opacity:.55,roughness:.2,metalness:.1});this.waterMesh=new Ee(e,t),this.waterMesh.position.y=this.sceneModel.waterLevel,this.scene.add(this.waterMesh)}rebuildWaterLocal(){if(this.waterLocalMesh&&(this.scene.remove(this.waterLocalMesh),this.waterLocalMesh.geometry.dispose(),this.waterLocalMesh.material.dispose(),this.waterLocalMesh=null),!this.sceneModel)return;const e=this.sceneModel.terrain,t=this.buildWaterGeometry(e),n=new gn({color:"#3a93d6",transparent:!0,opacity:.6,roughness:.15,metalness:.1,side:jt});this.waterLocalMesh=new Ee(t,n),this.scene.add(this.waterLocalMesh)}waterLocalY(e,t){const n=e.water[t]??0,s=e.heights[t]??0;return n>.001?s+n:s-.02}buildWaterGeometry(e){const t=Sn(e.segments),n=new Float32Array(t*t*3);let s=0;for(let o=0;o<t;o++)for(let c=0;c<t;c++){const l=-e.size/2+c/e.segments*e.size,h=-e.size/2+o/e.segments*e.size,f=o*t+c;n[s++]=l,n[s++]=this.waterLocalY(e,f),n[s++]=h}const r=[];for(let o=0;o<e.segments;o++)for(let c=0;c<e.segments;c++){const l=o*t+c,h=o*t+c+1,f=(o+1)*t+c,d=(o+1)*t+c+1;r.push(l,f,h),r.push(h,f,d)}const a=new ct;return a.setAttribute("position",new Lt(n,3)),a.setIndex(r),a.computeVertexNormals(),a}async rebuildObjects(){if(this.objectsGroup.clear(),!!this.sceneModel)for(const e of this.sceneModel.objects)await this.buildObject(e)}async buildObject(e){const t=this.assets.get(e.assetId);if(!t)return;const n=await us(t.root),s=a=>n.get(a)??null,r=hs(t.root,s);r.position.set(e.position.x,e.position.y,e.position.z),r.rotation.set(e.rotation.x,e.rotation.y,e.rotation.z),r.scale.set(e.scale.x,e.scale.y,e.scale.z),this.objectsGroup.add(r)}requestLock(){var e,t;(t=(e=this.renderer.domElement).requestPointerLock)==null||t.call(e)}applyRotation(){this.camera.rotation.set(this.pitch,this.yaw,0,"YXZ")}move(e){if(!this.locked)return;const t=new D(-Math.sin(this.yaw),0,-Math.cos(this.yaw)),n=new D(Math.cos(this.yaw),0,-Math.sin(this.yaw)),s=new D;this.keys.has("w")&&s.add(t),this.keys.has("s")&&s.sub(t),this.keys.has("d")&&s.add(n),this.keys.has("a")&&s.sub(n);let r=0;this.keys.has(" ")&&(r+=1),this.keys.has("shift")&&(r-=1);const a=this.speed*e;if(this.mode==="fly"){const o=new D;this.camera.getWorldDirection(o),o.y=0,o.normalize();const c=new D;this.keys.has("w")&&c.add(o),this.keys.has("s")&&c.sub(o);const l=new D(o.z,0,-o.x);this.keys.has("d")&&c.add(l),this.keys.has("a")&&c.sub(l),c.normalize().multiplyScalar(a),this.camera.position.x+=c.x,this.camera.position.z+=c.z,this.camera.position.y+=r*a}else if(s.lengthSq()>0&&s.normalize().multiplyScalar(a),this.camera.position.x+=s.x,this.camera.position.z+=s.z,this.sceneModel){const o=io(this.sceneModel.terrain,this.camera.position.x,this.camera.position.z);this.camera.position.y=o+eo}}}async function ex(i,e){const t=document.createElement("div");t.className="page roam-page",t.appendChild(Fn("roam"));const n=document.createElement("div");n.className="editor-topbar roam-topbar",n.innerHTML=`
    <a class="btn small" href="#/scenes">← 场景</a>
    <span class="muted">选择场景：</span>
    <select class="scene-select" data-scene></select>
    <span class="roam-state"></span>
  `,t.appendChild(n);const s=document.createElement("div");s.className="roam-stage",t.appendChild(s);const r=document.createElement("div");r.className="viewport-host roam-host",s.appendChild(r);const a=document.createElement("div");a.className="roam-help",a.innerHTML=`
    <div class="roam-help-title">🎮 漫游操作 Roam Controls</div>
    <ul>
      <li>点击画面进入漫游（锁定鼠标）</li>
      <li><b>W/A/S/D</b> 前后左右移动</li>
      <li><b>鼠标</b> 转动视角</li>
      <li><b>空格 / Shift</b> 上升 / 下降（飞行模式）</li>
      <li><b>Esc</b> 释放鼠标</li>
    </ul>
    <button class="btn small" data-help-close>知道了</button>
  `,s.appendChild(a);const o=document.createElement("div");o.className="roam-bar",o.innerHTML=`
    <div class="roam-mode">
      <button class="btn small mode" data-mode="walk">🚶 行走 Walk</button>
      <button class="btn small mode active" data-mode="fly">🦅 飞行 Fly</button>
    </div>
    <label class="roam-speed">
      速度 Speed
      <input type="range" min="1" max="40" step="1" value="5" data-speed />
      <span data-speed-v>5</span>
    </label>
    <button class="btn small danger" data-record>● 录制 Record</button>
  `,s.appendChild(o);const c=document.createElement("div");c.className="roam-rec",c.innerHTML='<span class="dot"></span><span class="rec-time">REC 00:00</span>',c.hidden=!0,s.appendChild(c),i.appendChild(t);let l=[],h=e,f=0,d=0;const p=new Qv(r,{onRecordingChange:y=>{s.classList.toggle("roam-recording",y),c.hidden=!y;const L=o.querySelector("[data-record]");y?(L.textContent="■ 停止 Stop",L.classList.add("active"),f=Date.now(),d=window.setInterval(g,500),g()):(L.textContent="● 录制 Record",L.classList.remove("active"),window.clearInterval(d))}});function g(){const y=Math.floor((Date.now()-f)/1e3),L=String(Math.floor(y/60)).padStart(2,"0"),C=String(y%60).padStart(2,"0");c.querySelector(".rec-time").textContent=`REC ${L}:${C}`}const x=y=>{n.querySelector(".roam-state").textContent=y};async function u(y){const L=await Yr(y);if(!L){x("场景不存在");return}await p.setScene(L,l),h=y,x(`已载入：${L.name}`)}async function m(){const y=await la(),L=n.querySelector("[data-scene]");L.innerHTML='<option value="">— 请选择场景 —</option>'+y.map(C=>`<option value="${C.id}">${C.name}</option>`).join(""),h&&(L.value=h),L.addEventListener("change",()=>{L.value&&u(L.value)})}o.querySelectorAll("[data-mode]").forEach(y=>y.addEventListener("click",()=>{const L=y.getAttribute("data-mode");p.setMode(L),o.querySelectorAll("[data-mode]").forEach(C=>C.classList.remove("active")),y.classList.add("active")}));const w=o.querySelector("[data-speed]"),S=o.querySelector("[data-speed-v]");w.addEventListener("input",()=>{S.textContent=w.value,p.setSpeed(parseFloat(w.value))}),o.querySelector("[data-record]").addEventListener("click",async()=>{p.isRecording()?p.stopRecording():await p.startRecording()}),a.querySelector("[data-help-close]").addEventListener("click",()=>{a.hidden=!0}),l=await On(),await m(),h?await u(h):x("请选择一个场景开始漫游")}const tx="modulepreload",nx=function(i){return"/"+i},gh={},ix=function(e,t,n){let s=Promise.resolve();if(t&&t.length>0){document.getElementsByTagName("link");const a=document.querySelector("meta[property=csp-nonce]"),o=(a==null?void 0:a.nonce)||(a==null?void 0:a.getAttribute("nonce"));s=Promise.allSettled(t.map(c=>{if(c=nx(c),c in gh)return;gh[c]=!0;const l=c.endsWith(".css"),h=l?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${h}`))return;const f=document.createElement("link");if(f.rel=l?"stylesheet":tx,l||(f.as="script"),f.crossOrigin="",f.href=c,o&&f.setAttribute("nonce",o),document.head.appendChild(f),l)return new Promise((d,p)=>{f.addEventListener("load",d),f.addEventListener("error",()=>p(new Error(`Unable to preload CSS for ${c}`)))})}))}function r(a){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=a,window.dispatchEvent(o),!o.defaultPrevented)throw a}return s.then(a=>{for(const o of a||[])o.status==="rejected"&&r(o.reason);return e().catch(r)})};function sx(i={}){const{immediate:e=!1,onNeedRefresh:t,onOfflineReady:n,onRegistered:s,onRegisteredSW:r,onRegisterError:a}=i;let o,c,l;const h=async(d=!0)=>{await c,await(l==null?void 0:l())};async function f(){if("serviceWorker"in navigator){if(o=await ix(async()=>{const{Workbox:d}=await import("./workbox-window.prod.es5-BqEJf4Xk.js");return{Workbox:d}},[]).then(({Workbox:d})=>new d("/sw.js",{scope:"/",type:"classic"})).catch(d=>{a==null||a(d)}),!o)return;l=async()=>{await(o==null?void 0:o.messageSkipWaiting())};{let d=!1;const p=()=>{d=!0,o==null||o.addEventListener("controlling",g=>{g.isUpdate&&window.location.reload()}),t==null||t()};o.addEventListener("installed",g=>{typeof g.isUpdate>"u"?typeof g.isExternal<"u"?g.isExternal?p():!d&&(n==null||n()):g.isExternal?window.location.reload():!d&&(n==null||n()):g.isUpdate||n==null||n()}),o.addEventListener("waiting",p),o.addEventListener("externalwaiting",p)}o.register({immediate:e}).then(d=>{r?r("/sw.js",d):s==null||s(d)}).catch(d=>{a==null||a(d)})}}return c=f(),h}let to=null;function rx(){const i=document.createElement("style");i.textContent=`
    #pwa-update {
      position: fixed; left: 50%; bottom: 20px; transform: translateX(-50%);
      z-index: 100000; display: none; align-items: center; gap: 12px;
      background: var(--panel); color: var(--text);
      border: 1px solid var(--border); border-radius: var(--radius);
      box-shadow: var(--shadow); padding: 10px 14px; font-size: 14px;
      max-width: calc(100vw - 32px);
    }
    #pwa-update.show { display: flex; }
    #pwa-update button {
      cursor: pointer; border: none; border-radius: 6px; padding: 6px 12px;
      font-size: 13px; font-weight: 600;
    }
    #pwa-update .refresh { background: var(--accent); color: #fff; }
    #pwa-update .dismiss { background: var(--panel-2); color: var(--muted); }
  `,document.head.appendChild(i);const e=document.createElement("div");e.id="pwa-update";const t=document.createElement("span");t.textContent="有新版本可用 · Update available";const n=document.createElement("button");n.className="refresh",n.textContent="刷新 / Refresh";const s=document.createElement("button");s.className="dismiss",s.textContent="稍后 / Later",e.append(t,n,s),document.body.appendChild(e);const r={el:e,message:t,refresh:n,dismiss:s};return n.addEventListener("click",()=>{r.el.classList.remove("show"),Ad(!0)}),s.addEventListener("click",()=>r.el.classList.remove("show")),r}function ax(){to||(to=rx()),to.el.classList.add("show")}let Ad=async()=>{};function ox(){Ad=sx({onNeedRefresh(){ax()},onOfflineReady(){console.log("[pwa] offline ready")},onRegisterError(i){console.error("[pwa] SW registration failed",i)}})}const hn=document.querySelector("#app");function Rd(){const i=(location.hash.split("?")[1]||"")+"&"+(location.search.replace(/^\?/,"")||"");return/(^|&)log=1(\b|&|$)/.test(i)}const wi=document.createElement("div");wi.id="__console";Object.assign(wi.style,{position:"fixed",bottom:"0",left:"0",right:"0",maxHeight:"40%",overflow:"auto",background:"rgba(0,0,0,0.82)",color:"#9fe",font:"11px/1.4 monospace",padding:"6px 8px",zIndex:"99999",whiteSpace:"pre-wrap",borderTop:"1px solid #2a2c33",display:Rd()?"block":"none"});document.body.appendChild(wi);function Vs(i,e){if(wi.style.display==="none")return;const t=`[${i}] `+e.map(s=>typeof s=="object"?JSON.stringify(s):String(s)).join(" "),n=document.createElement("div");n.textContent=t,wi.appendChild(n)}window.addEventListener("error",i=>Vs("error",[i.message,i.filename+":"+i.lineno]));window.addEventListener("unhandledrejection",i=>Vs("reject",[String(i.reason)]));const cx=console.log.bind(console),lx=console.warn.bind(console),hx=console.error.bind(console);console.log=(...i)=>{Vs("log",i),cx(...i)};console.warn=(...i)=>{Vs("warn",i),lx(...i)};console.error=(...i)=>{Vs("error",i),hx(...i)};window.__dbg=wi;function Cd(){const t=(location.hash||"#/").split("?")[0].replace(/^#\//,"").split("/").filter(Boolean);if(hn.innerHTML="",t.length===0)Vc(hn);else if(t[0]==="library")xu(hn);else if(t[0]==="editor"){const n=t[1];lv(hn,n)}else if(t[0]==="characters"){const n=t[1],s=t[2];Nv(hn,n,s)}else if(t[0]==="settings")Dv(hn);else if(t[0]==="scenes"){const n=t[1];Fv(hn,n)}else if(t[0]==="roam"){const n=t[1];ex(hn,n)}else if(t[0]==="animations"){const n=t[1];Hv(hn,n)}else t[0]==="demo"?qv(hn):Vc(hn);Jv()}window.addEventListener("hashchange",()=>{wi.style.display=Rd()?"block":"none"});window.addEventListener("hashchange",Cd);Cd();ox();
