'use strict';
const $=s=>document.querySelector(s);
const S={get(k,d){try{return JSON.parse(localStorage.getItem('ps_'+k))??d}catch{return d}},set(k,v){localStorage.setItem('ps_'+k,JSON.stringify(v))}};
const hoy=()=>new Date().toLocaleDateString('en-CA');
const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

const FRASES=["No tienes que hacerlo perfecto, solo no fallar dos días seguidos.","Cada licuado es un voto por la persona que quieres ser.","Pequeño y diario le gana a grande y a veces.","Tu meta: promociones y becas. Hoy sumas un paso.","Cuando estés cansada, haz la versión corta. Cuenta igual.","Celebra cada palomita: así se construye el hábito.","El músculo se gana comiendo y descansando, no solo entrenando."];

// ---------- HOY ----------
const ITEMS=[["licuado","Licuado de la mañana (≈650 kcal)"],["c1","Snack 9:30"],["c2","Comida"],["c3","Snack 17:30"],["c4","Pre-entreno o snack"],["c5","Cena con proteína"],["gym","Gym (o descanso planeado)"],["sueno","Dormí 7 h o más"],["crea","Creatina 5 g"]];
function dia(d=hoy()){return S.get('d_'+d,{})}
function setDia(o,d=hoy()){S.set('d_'+d,o)}
function puntos(d){const o=dia(d);return ITEMS.filter(([k])=>o[k]).length+((o.agua||0)>=8?1:0)}
function racha(){let n=0,t=new Date();for(;;){const d=t.toLocaleDateString('en-CA');if(puntos(d)>=6)n++;else if(d!==hoy())break;t.setDate(t.getDate()-1);if(n>400)break}return n}
function vHoy(){const o=dia(),agua=o.agua||0,modo=S.get('modo','m');
 return `<div class="card quote">${FRASES[new Date().getDate()%FRASES.length]}</div>
 <div class="card"><div class="row" style="justify-content:space-between"><h2>Hoy</h2><span class="badge">🔥 Racha: ${racha()} días</span></div>
 <div class="row"><button class="sm ${modo==='m'?'':'btn2'}" onclick="setModo('m')">Gym 5:10</button><button class="sm ${modo==='n'?'':'btn2'}" onclick="setModo('n')">Gym 20:00</button></div>
 ${ITEMS.map(([k,l])=>`<div class="chk ${o[k]?'on':''}" onclick="tog('${k}')"><div class="box">${o[k]?'✓':''}</div><span class="l">${l}</span></div>`).join('')}
 <h3>Agua: ${agua} de 8 vasos</h3><div class="bar"><i style="width:${Math.min(100,agua/8*100)}%"></i></div>
 <div class="row" style="margin-top:8px"><button onclick="agua(1)">+ 1 vaso</button><button class="btn2" onclick="agua(-1)">−</button></div>
 <p class="muted">Un toque por hábito. Con 6 o más palomitas el día cuenta para tu racha.</p></div>
 <div class="card"><h2>Horario sugerido</h2>${horario(modo)}</div>`}
function horario(m){const H=m==='n'?[["5:30","Licuado"],["9:30","Snack"],["13:00-15:30","Comida + siesta máx. 30 min"],["17:30","Snack"],["19:00","Pre-entreno ligero (sin cafeína)"],["20:00-20:40","Gym"],["20:45","Batido + cena ligera"],["21:15","Relajación"],["22:30","Dormir"]]:[["5:00","Licuado"],["5:10-5:50","Gym"],["9:30","Snack"],["13:00","Comida"],["15:30","App + siesta máx. 30 min"],["17:30","Snack"],["21:00","Cena con proteína"],["21:30","Rutina de sueño"],["22:00","Dormir"]];
 return `<table>${H.map(r=>`<tr><td><b>${r[0]}</b></td><td>${r[1]}</td></tr>`).join('')}</table>`}
window.tog=k=>{const o=dia();o[k]=!o[k];setDia(o);if(o[k]&&navigator.vibrate)navigator.vibrate(30);render()};
window.agua=n=>{const o=dia();o.agua=Math.max(0,(o.agua||0)+n);setDia(o);render()};
window.setModo=m=>{S.set('modo',m);render()};

// ---------- ENTRENO ----------
const BLOQ=[{n:"Semanas 1-4 · Aprender",sr:"2-3 series × 12-15 · descanso 60-90 s",dias:{"Día A":["prensa","jalon","pecho","hip","plancha"],"Día B":["goblet","remo","hombro","femoral","biceps"]},nota:"3 días (L-Mi-V) alternando A-B-A / B-A-B."},
{n:"Semanas 5-8 · Construir",sr:"3 × 10-12 · 90 s (semana 8 ligera: 2 series)",dias:{"Pierna 1":["prensa","rdl","extension","hip","plancha"],"Torso 1":["pecho","jalon","remo","hombro","triceps"],"Pierna 2":["goblet","femoral","rdl","hip","plancha"],"Torso 2":["jalon","pecho","remo","biceps","triceps"]},nota:"4 días: L, Ma, J, V."},
{n:"Semanas 9-12 · Más fuerza",sr:"3-4 × 8-10 · 90-120 s",dias:{"Pierna 1":["prensa","rdl","extension","hip","plancha"],"Torso 1":["pecho","jalon","remo","hombro","triceps"],"Pierna 2":["goblet","femoral","rdl","hip","plancha"],"Torso 2":["jalon","pecho","remo","biceps","triceps"]},nota:"Mismos ejercicios, más peso. Puente → hip thrust en banco."}];
let bSel=S.get('bloque',0),dSel=null;
function vEntreno(){const b=BLOQ[bSel],ds=Object.keys(b.dias);if(!dSel||!b.dias[dSel])dSel=ds[0];
 return `<div class="card"><h2>Rutina de 12 semanas</h2><select onchange="setB(this.value)">${BLOQ.map((x,i)=>`<option value="${i}" ${i==bSel?'selected':''}>${x.n}</option>`).join('')}</select>
 <p><b>${b.sr}</b><br><span class="muted">${b.nota} Calienta 5 min en escaladora. Cardio limitado.</span></p>
 <div class="row">${ds.map(d=>`<button class="sm ${d===dSel?'':'btn2'}" onclick="setD('${d}')">${d}</button>`).join('')}</div></div>
 <div class="card"><h2>Temporizador de descanso</h2><div class="big" id="tt">${fmt(tLeft)}</div>
 <div class="row" style="justify-content:center">${[60,90,120].map(s=>`<button class="sm" onclick="timer(${s})">${s} s</button>`).join('')}<button class="sm btn2" onclick="timer(0)">Parar</button></div>
 <p class="muted">Suena y vibra al terminar (mantén la pantalla abierta).</p></div>
 <div class="card"><h2>Versión 20:00 (cansada)</h2><p>Misma rutina. Si estás cansada: 1 serie menos o −10-20 % de peso y deja 3-4 repeticiones “en reserva”. Agotada: solo los 3 primeros ejercicios. Termina ~2 h antes de dormir (MedlinePlus).</p></div>
 ${b.dias[dSel].map(exCard).join('')}`}
function exCard(k){const e=EX[k],log=S.get('log_'+k,[]),u=log[log.length-1];
 return `<div class="card ex"><h2>${esc(e.n)}</h2><img loading="lazy" src="img/${k}.jpg" alt="${esc(e.n)}"><div class="muted">Imagen: Wikimedia Commons, ${esc(e.cred)}</div>
 <p><b>Aparato:</b> ${esc(e.ap)}<br><b>Ajuste:</b> ${esc(e.aj)}</p><ol>${e.pasos.map(p=>`<li>${esc(p)}</li>`).join('')}</ol>
 <p><b>Evita:</b> ${esc(e.err)}<br><b>Peso inicial:</b> ${esc(e.peso)}</p>
 <a class="btn btn2 sm" href="https://www.youtube.com/watch?v=${e.vid}" target="_blank" rel="noopener">▶ Ver video</a>
 <h3>Registrar</h3><div class="row"><input id="w_${k}" type="number" step="0.5" inputmode="decimal" placeholder="kg" style="width:90px"><input id="r_${k}" type="number" inputmode="numeric" placeholder="reps" style="width:90px"><button class="sm" onclick="logEx('${k}')">Guardar</button></div>
 <p class="muted">${u?`Último: ${u.w} kg × ${u.r} (${u.d})`:'Aún sin registros'}</p></div>`}
window.setB=v=>{bSel=+v;S.set('bloque',bSel);dSel=null;render()};window.setD=d=>{dSel=d;render()};
window.logEx=k=>{const w=$('#w_'+k).value,r=$('#r_'+k).value;if(!w)return;const l=S.get('log_'+k,[]);l.push({w:+w,r:+r||0,d:hoy()});S.set('log_'+k,l);render()};
let tLeft=0,tInt=null;const fmt=s=>`${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;
window.timer=s=>{clearInterval(tInt);tLeft=s;const el=$('#tt');if(el)el.textContent=fmt(tLeft);if(!s)return;
 tInt=setInterval(()=>{tLeft--;const el=$('#tt');if(el)el.textContent=fmt(tLeft);if(tLeft<=0){clearInterval(tInt);beep();navigator.vibrate&&navigator.vibrate([300,150,300]);}},1000)};
function beep(){try{const a=new (window.AudioContext||window.webkitAudioContext)();[0,.35,.7].forEach(t=>{const o=a.createOscillator(),g=a.createGain();o.frequency.value=880;o.connect(g);g.connect(a.destination);o.start(a.currentTime+t);o.stop(a.currentTime+t+.2)})}catch(e){}}

// ---------- PROGRESO ----------
function vProg(){const P=S.get('pesos',[]),h=S.get('estatura',''),meta=S.get('meta',50),u=P[P.length-1];
 const imc=u&&h?(u.kg/(h*h)).toFixed(1):'—',ini=P[0];
 const pct=u&&ini&&meta>ini.kg?Math.max(0,Math.min(100,(u.kg-ini.kg)/(meta-ini.kg)*100)):0;
 const logros=[["Primer registro",P.length>=1],["Racha de 3 días",racha()>=3],["Racha de 7 días",racha()>=7],["+1 kg",u&&ini&&u.kg-ini.kg>=1],["+3 kg",u&&ini&&u.kg-ini.kg>=3],["IMC normal (≥18.5)",imc!=='—'&&+imc>=18.5],["¡Meta alcanzada!",u&&u.kg>=meta],["10 entrenos registrados",nEnt()>=10]];
 return `<div class="card"><h2>Mi progreso</h2><p class="muted">Tus datos se guardan solo en este teléfono.</p>
 <div class="row"><label style="flex:1">Estatura (m)<input type="number" step="0.01" inputmode="decimal" value="${h}" onchange="S.set('estatura',+this.value);render()"></label><label style="flex:1">Meta (kg)<input type="number" step="0.5" inputmode="decimal" value="${meta}" onchange="S.set('meta',+this.value);render()"></label></div>
 <h3>Peso de esta semana (domingo, en ayunas)</h3><div class="row"><input id="pkg" type="number" step="0.1" inputmode="decimal" placeholder="kg" style="flex:1"><button onclick="addPeso()">Guardar</button></div>
 <div class="row" style="justify-content:space-around;margin-top:10px;text-align:center"><div><div class="big">${u?u.kg:'—'}</div><span class="muted">kg actual</span></div><div><div class="big">${imc}</div><span class="muted">IMC</span></div></div>
 <h3>Hacia ${meta} kg</h3><div class="bar"><i style="width:${pct}%"></i></div>${chart(P,meta)}
 ${P.length?`<button class="sm btn2" onclick="delPeso()">Borrar último registro</button>`:''}</div>
 <div class="card"><h2>Logros</h2>${logros.map(([n,ok])=>`<span class="badge ${ok?'':'off'}">${ok?'🏅':'🔒'} ${n}</span>`).join('')}</div>
 <div class="card"><h2>Regla de ajuste</h2><p>Sin subir en 2 semanas → +200-300 kcal (un licuado extra). Sin subir en 4-6 semanas, mareos, fatiga extrema o cambios en la menstruación → consulta al servicio médico.</p></div>
 <div class="card"><h2>Respaldo</h2><div class="row"><button class="sm btn2" onclick="exportar()">Exportar mis datos</button><label class="btn sm btn2">Importar<input type="file" accept=".json" hidden onchange="importar(this)"></label></div></div>`}
function nEnt(){return Object.keys(localStorage).filter(k=>k.startsWith('ps_log_')).reduce((a,k)=>a+S.get(k.slice(3),[]).length,0)}
function chart(P,meta){if(P.length<2)return '<p class="muted">La gráfica aparece con 2 o más registros.</p>';
 const W=320,H=150,v=P.map(p=>p.kg).concat(meta),mn=Math.min(...v)-1,mx=Math.max(...v)+1,x=i=>10+i*(W-20)/(P.length-1),y=k=>H-10-(k-mn)/(mx-mn)*(H-20);
 return `<svg viewBox="0 0 ${W} ${H}" style="width:100%;margin-top:8px"><line x1="10" x2="${W-10}" y1="${y(meta)}" y2="${y(meta)}" stroke="#f59e0b" stroke-dasharray="4"/><polyline fill="none" stroke="#0f766e" stroke-width="3" points="${P.map((p,i)=>x(i)+','+y(p.kg)).join(' ')}"/>${P.map((p,i)=>`<circle cx="${x(i)}" cy="${y(p.kg)}" r="4" fill="#0f766e"/>`).join('')}<text x="${W-12}" y="${y(meta)-4}" font-size="11" text-anchor="end" fill="#b45309">meta</text></svg>`}
window.addPeso=()=>{const v=+$('#pkg').value;if(!v)return;const P=S.get('pesos',[]);P.push({kg:v,d:hoy()});S.set('pesos',P);render()};
window.delPeso=()=>{const P=S.get('pesos',[]);P.pop();S.set('pesos',P);render()};
window.exportar=()=>{const o={};Object.keys(localStorage).filter(k=>k.startsWith('ps_')).forEach(k=>o[k]=localStorage.getItem(k));dl('peso-saludable-respaldo.json',JSON.stringify(o),'application/json')};
window.importar=inp=>{const f=inp.files[0];if(!f)return;f.text().then(t=>{const o=JSON.parse(t);Object.entries(o).forEach(([k,v])=>k.startsWith('ps_')&&localStorage.setItem(k,v));render()})};
function dl(n,t,m){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([t],{type:m}));a.download=n;a.click()}

// ---------- COMIDA ----------
const MENU=[["Lun","Nueces 30 g + manzana","Comedor/app: pollo con arroz","Sándwich de atún","Burrito de pollo + leche"],["Mar","Barra de proteína + plátano","Comedor: guisado, frijoles, tortillas","Pan + crema de cacahuate","Torta de pollo + leche"],["Mié","Fruta seca + almendras","App: bowl de arroz con pollo","Atún con galletas","Tacos de bistec + leche"],["Jue","Tacos de huevo (casino)","Comedor","Pan + crema de cacahuate + naranja","Sushi con proteína + leche"],["Vie","Nueces + barra de avena","App: pechuga con papa","Burrito de atún","Pasta con pollo + leche"],["Sáb","Chilaquiles con huevo (casino)","Comedor","Barra + plátano","Hamburguesa sencilla + leche"],["Dom","Pan + crema de cacahuate","Comida libre con proteína","Fruta seca + nueces","Leche con whey + compras"]];
function vComida(){const r=S.get('refri',false);
 return `<div class="card"><h2>Metas diarias</h2><p><b>2,000-2,200 kcal</b> y <b>70-85 g de proteína</b> en 4-5 tomas de 20-25 g.</p>
 <div class="quote">Licuado base: 300 ml leche + 1 scoop whey + 40 g avena + 1 plátano + 1 cda crema de cacahuate ≈ 650 kcal / 40 g proteína.</div></div>
 <div class="card"><div class="row"><button class="sm ${r?'btn2':''}" onclick="S.set('refri',false);render()">Sin refri</button><button class="sm ${r?'':'btn2'}" onclick="S.set('refri',true);render()">Con refri</button></div>
 ${r?'<p>Además puedes sumar: yogur griego (130 g/día), 2 huevos cocidos, queso panela, jamón de pavo y leche fresca.</p>':'<p>Todo aguanta fuera del refri: leche UHT, whey, avena, crema de cacahuate, atún, nueces, fruta seca, barras, pan, plátano/manzana/naranja.</p>'}
 <table><tr><th>Día</th><th>9:30</th><th>Comida</th><th>17:30</th><th>Cena</th></tr>${MENU.map(m=>`<tr>${m.map((c,i)=>`<td>${i?esc(c):'<b>'+c+'</b>'}</td>`).join('')}</tr>`).join('')}</table>
 <p class="muted">Desayuno diario: licuado base. ${r?'Antes de dormir: yogur o leche.':'Antes de dormir: leche UHT.'}</p></div>
 <div class="card"><h2>Horario</h2><div class="row"><button class="sm" onclick="setModo('m');go('comida')">Mañana</button><button class="sm btn2" onclick="setModo('n');go('comida')">20:00</button></div>${horario(S.get('modo','m'))}</div>`}

// ---------- COMPRAS ----------
const AMZ=a=>`https://www.amazon.com.mx/dp/${a}`,CART=a=>`https://www.amazon.com.mx/gp/aws/cart/add.html?ASIN.1=${a}&Quantity.1=1`;
const ML=q=>`https://listado.mercadolibre.com.mx/${encodeURIComponent(q.replace(/ /g,'-'))}`;
const WM=q=>`https://super.walmart.com.mx/search?q=${encodeURIComponent(q)}`;
const UE=q=>`https://www.ubereats.com/mx`;
const COMPRAS=[
["Sin refri","Leche Lala Entera UHT 6×1 L","1 paquete/sem","$165 Amazon","B0GYZQ5MXB"],
["Sin refri","Avena Quaker Old Fashion 2×2.26 kg","280 g/sem","—","B07G31CL8T"],
["Sin refri","Crema de cacahuate ONTOP natural 480 g","1 frasco c/2-3 sem","—","B089MCLT3Y"],
["Sin refri","Atún Dolores en agua 133 g","6-7 latas","$27.90 c/u Amazon · $319 10 latas Costco","B07ZWR8SW1"],
["Sin refri","Almendras Kirkland 1.36 kg","250 g/sem","$329 Amazon","B07913JFQK"],
["Sin refri","Arándanos deshidratados Kirkland 567 g","150 g/sem","$364 Amazon","B08XC7K8MX"],
["Sin refri","Barras Nature Valley Fruit & Nut 24 pzas","5-7","—","B0CKXXNN3G"],
["Sin refri","Barras Quest 12 pzas","3-5","—","B0057RWSZQ"],
["Sin refri","Pan integral Bimbo Cero Cero","1 bolsa","—",null],
["Con refri","Yogur griego Oikos natural sin azúcar 900 g","1 bote","—",null],
["Con refri","Queso panela Lala","1-2 piezas","—",null],
["Con refri","Huevo Bachoco 18 pzas","10-14","—",null],
["Con refri","Jamón de pavo FUD Virginia 290 g","1","$60 Walmart (búsqueda)",null],
["Suplementos","Proteína ON Gold Standard Whey 5 lb vainilla","rinde ~5 sem","$1,469.30 Amazon","B078RPW7Y3"],
["Suplementos","Creatina ON 600 g","5 g/día","$598.65 Amazon","B002DYIZEO"],
["Suplementos","Creatina Birdman 450 g (alternativa)","5 g/día","$479 Amazon","B089ZWVJ2K"],
["Equipo","Licuadora NutriBullet 600 W","1","$1,210 Amazon","B07CTBHQZK"],
["Equipo","Shaker BlenderBottle","1","$218.57 Amazon","B01LZQ8OYE"],
["Equipo","Báscula de cocina Etekcity","1","$327.70 Amazon","B0113UZJE2"]];
function vCompras(){const H=S.get('hechas',{});const g=[...new Set(COMPRAS.map(c=>c[0]))];
 return `<div class="card"><h2>Compras</h2><p class="muted">Precios vistos el 14-oct-2026; pueden cambiar. Revisa registro COFEPRIS en suplementos.</p>
 <details><summary>¿Qué hace el botón “Agregar”?</summary><p><b>Amazon:</b> abre el enlace oficial de agregar al carrito por ASIN (te pide iniciar sesión).<br><b>Uber Eats, Rappi, DiDi Food, Mercado Libre y Walmart:</b> no permiten precargar un carrito con un enlace; la app abre la búsqueda exacta y tú tocas “Agregar” ahí.</p></details></div>
 ${g.map(gr=>`<div class="card"><h2>${gr}</h2>${COMPRAS.filter(c=>c[0]===gr).map((c,i)=>{const id=gr+i,a=c[4];return `<div style="border-bottom:1px solid #eee;padding:8px 0">
 <div class="chk ${H[id]?'on':''}" onclick="hecha('${id}')" style="border:0;min-height:40px"><div class="box">${H[id]?'✓':''}</div><span class="l"><b>${esc(c[1])}</b><br><span class="muted">${esc(c[2])} · ${esc(c[3])}</span></span></div>
 <div class="row">${a?`<a class="btn sm" target="_blank" rel="noopener" href="${CART(a)}">🛒 Agregar (Amazon)</a><a class="btn sm btn2" target="_blank" rel="noopener" href="${AMZ(a)}">Ficha</a>`:`<a class="btn sm" target="_blank" rel="noopener" href="${WM(c[1])}">Walmart Súper</a>`}
 <a class="btn sm btn2" target="_blank" rel="noopener" href="${ML(c[1])}">Mercado Libre</a><a class="btn sm btn2" target="_blank" rel="noopener" href="${UE(c[1])}">Uber Eats (Soriana/Chedraui)</a></div></div>`}).join('')}</div>`).join('')}
 <div class="card"><h2>Apps de súper a domicilio</h2><div class="row"><a class="btn sm btn2" href="https://www.rappi.com.mx/" target="_blank" rel="noopener">Rappi</a><a class="btn sm btn2" href="https://www.didi-food.com/es-MX/food/" target="_blank" rel="noopener">DiDi Food</a><a class="btn sm btn2" href="https://www.ubereats.com/mx" target="_blank" rel="noopener">Uber Eats</a></div><p class="muted">Ábrelas y busca el producto por nombre (no aceptan carrito por enlace).</p><button class="sm btn2" onclick="S.set('hechas',{});render()">Reiniciar lista</button></div>`}
window.hecha=id=>{const H=S.get('hechas',{});H[id]=!H[id];S.set('hechas',H);render()};

// ---------- MÚSICA ----------
const PL=[["Fuerza · español (rap)","mix rap para hacer ejercicio","PLjk-zkH0W0uvFExrmwuCBBtZtR1GYQZ8C"],["Fuerza · español","Playlist para llegar al fallo","PLGZfNaMcAYFNp79OUx0ZzJ8A2Q8X1a64s"],["Fuerza · inglés","Workout Motivation Music Mix 2026","PLkShY3_KwgILykYaCqiBjHOy2rNbOoY8T"],["Fuerza · inglés (hip-hop)","Gym Motivation – No Pain No Gain","PLUXlGtZgQeuJDRV0qH3O9w8B_Sz3P3cg1"],["Relajarte y dormir","Música para dormir en 5 minutos","PL0RF2QP7Dj_0T6q5gd_WbMYxw3nrjPtDp"]];
function vMusica(){return `<div class="card"><h2>Música</h2><p class="muted">Se abren en YouTube Music. Playlists públicas de otros usuarios; su contenido puede cambiar.</p>
 ${PL.map(p=>`<div style="padding:8px 0;border-bottom:1px solid #eee"><b>${p[0]}</b><br><span class="muted">${esc(p[1])}</span><div class="row" style="margin-top:6px"><a class="btn sm" target="_blank" rel="noopener" href="https://music.youtube.com/playlist?list=${p[2]}">♫ YouTube Music</a><a class="btn sm btn2" target="_blank" rel="noopener" href="https://www.youtube.com/playlist?list=${p[2]}">YouTube</a></div></div>`).join('')}</div>`}

// ---------- RECORDATORIOS ----------
const REC=[["licuado","Licuado",["05:00"],"DAILY"],["agua","Agua",["07:00","09:00","11:00","13:00","15:00","17:00","19:00"],"DAILY"],["gym","Gym",["05:10"],"WEEKLY;BYDAY=MO,TU,TH,FR"],["dormir","Rutina de sueño",["21:30"],"DAILY"]];
function vRec(){const on=S.get('notif',false),perm=('Notification' in window)?Notification.permission:'no';
 return `<div class="card"><h2>Recordatorios en tu calendario (recomendado)</h2><p>Descarga el archivo .ics y ábrelo: tu calendario crea los eventos repetidos con alarma (licuado 5:00, agua cada 2 h de 7 a 19, gym L-Ma-J-V 5:10, dormir 21:30).</p>
 <button onclick="ics()">📅 Crear eventos en mi calendario</button><p class="muted">Funciona aunque la app esté cerrada. Si entrenas a las 20:00, cambia la hora del evento “Gym” en tu calendario.</p></div>
 <div class="card"><h2>Avisos de la app</h2><p>Estado del permiso: <b>${perm}</b></p><div class="row"><button class="sm" onclick="pedir()">Activar avisos</button>${on?'<button class="sm btn2" onclick="S.set(\'notif\',false);render()">Desactivar</button>':''}</div>
 <p class="muted">Honestamente: el navegador solo puede avisar mientras la app está abierta o en segundo plano reciente. Para avisos confiables usa los eventos de calendario.</p></div>`}
window.pedir=async()=>{if(!('Notification' in window))return alert('Tu navegador no soporta avisos.');const p=await Notification.requestPermission();S.set('notif',p==='granted');if(p==='granted')notif('PESO SALUDABLE','Avisos activados 💪');render()};
function notif(t,b){navigator.serviceWorker?.ready.then(r=>r.showNotification(t,{body:b,icon:'icon-192.png'})).catch(()=>{try{new Notification(t,{body:b})}catch(e){}})}
setInterval(()=>{if(!S.get('notif',false))return;const n=new Date(),hm=n.toTimeString().slice(0,5),key='sent_'+hoy()+hm;if(S.get(key,false))return;
 REC.forEach(([k,l,hs,f])=>{if(hs.includes(hm)&&(f==='DAILY'||[1,2,4,5].includes(n.getDay()))){notif('PESO SALUDABLE',l+' – '+FRASES[n.getMinutes()%FRASES.length]);S.set(key,true)}})},30000);
window.ics=()=>{const d=new Date(),ymd=d.toLocaleDateString('en-CA').replace(/-/g,''),st=new Date().toISOString().replace(/[-:]/g,'').slice(0,15)+'Z';let n=0;
 const ev=REC.flatMap(([k,l,hs,f])=>hs.map(h=>`BEGIN:VEVENT\r\nUID:ps-${k}-${h.replace(':','')}-${ymd}@peso-saludable\r\nDTSTAMP:${st}\r\nDTSTART;TZID=America/Mexico_City:${ymd}T${h.replace(':','')}00\r\nDURATION:PT15M\r\nRRULE:FREQ=${f}\r\nSUMMARY:${l} – PESO SALUDABLE\r\nBEGIN:VALARM\r\nACTION:DISPLAY\r\nDESCRIPTION:${l}\r\nTRIGGER:PT0M\r\nEND:VALARM\r\nEND:VEVENT`)).join('\r\n');
 dl('peso-saludable-recordatorios.ics',`BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//PESO SALUDABLE//ES\r\nCALSCALE:GREGORIAN\r\nBEGIN:VTIMEZONE\r\nTZID:America/Mexico_City\r\nBEGIN:STANDARD\r\nDTSTART:19700101T000000\r\nTZOFFSETFROM:-0600\r\nTZOFFSETTO:-0600\r\nEND:STANDARD\r\nEND:VTIMEZONE\r\n${ev}\r\nEND:VCALENDAR\r\n`,'text/calendar')};

// ---------- INFO ----------
function vInfo(){return `<div class="card"><h2>Fuentes</h2><ul>
<li><a href="https://www.who.int/es/news-room/fact-sheets/detail/physical-activity" target="_blank">OMS – Actividad física</a></li>
<li><a href="https://jissn.biomedcentral.com/articles/10.1186/s12970-017-0177-8" target="_blank">ISSN – Proteína y ejercicio</a></li>
<li><a href="https://jissn.biomedcentral.com/articles/10.1186/s12970-017-0173-z" target="_blank">ISSN – Creatina</a></li>
<li><a href="https://www.imss.gob.mx/salud-en-linea/plato-bien-comer" target="_blank">IMSS – Plato del Bien Comer</a></li>
<li><a href="https://medlineplus.gov/spanish/healthysleep.html" target="_blank">MedlinePlus – Sueño saludable</a></li>
<li><a href="https://www.nhlbi.nih.gov/health/sleep-deprivation/how-much-sleep" target="_blank">NIH – Cuánto dormir</a></li>
<li><a href="https://www.gob.mx/cofepris/acciones-y-programas/suplementos-alimenticios" target="_blank">COFEPRIS – Suplementos</a></li></ul>
<p class="muted">Esta app no sustituye la valoración médica. Privacidad: no hay cuentas ni servidores; todo se guarda en este dispositivo (localStorage).</p>
<button class="sm btn2" onclick="if(confirm('¿Borrar todos tus datos de este teléfono?')){Object.keys(localStorage).filter(k=>k.startsWith('ps_')).forEach(k=>localStorage.removeItem(k));render()}">Borrar mis datos</button></div>`}

// ---------- NAV ----------
const TABS=[["hoy","✅","Hoy",vHoy],["entreno","🏋️","Entreno",vEntreno],["progreso","📈","Progreso",vProg],["comida","🍽️","Comida",vComida],["compras","🛒","Compras",vCompras],["musica","🎵","Música",vMusica],["rec","⏰","Avisos",vRec],["info","ℹ️","Info",vInfo]];
let tab=location.hash.slice(1)||'hoy';
window.go=t=>{tab=t;location.hash=t;render();scrollTo(0,0)};
function render(){const T=TABS.find(t=>t[0]===tab)||TABS[0];$('#m').innerHTML=T[3]();$('#nav').innerHTML=TABS.map(t=>`<button class="${t[0]===T[0]?'on':''}" onclick="go('${t[0]}')"><b>${t[1]}</b>${t[2]}</button>`).join('')}
window.S=S;render();
if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js');
