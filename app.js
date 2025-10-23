// Rifa Luisito - app.js (v2)
const STORAGE_KEY = 'rifa_luisito_v2';
const PRICE = 1.5;
const DEFAULT_ADMIN_PASS = 'admin123';

function loadState(){
  const raw = localStorage.getItem(STORAGE_KEY);
  if(!raw) return {tickets:{}, users:{}, settings:{adminPass:DEFAULT_ADMIN_PASS, bank:{}}};
  try{ return JSON.parse(raw);}catch(e){return {tickets:{}, users:{}, settings:{adminPass:DEFAULT_ADMIN_PASS, bank:{}}};}
}
function saveState(state){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }

const state = loadState();

// UI refs
const regUser = document.getElementById('regUser');
const regPass = document.getElementById('regPass');
const regBtn = document.getElementById('regBtn');
const loginUser = document.getElementById('loginUser');
const loginPass = document.getElementById('loginPass');
const loginBtn = document.getElementById('loginBtn');
const userInfo = document.getElementById('userInfo');
const currentUser = document.getElementById('currentUser');
const logoutBtn = document.getElementById('logoutBtn');
const buyerContact = document.getElementById('buyerContact');
const numberInput = document.getElementById('numberInput');
const buyBtn = document.getElementById('buyBtn');
const buyMsg = document.getElementById('buyMsg');
const soldCount = document.getElementById('soldCount');
const availCount = document.getElementById('availCount');
const viewSold = document.getElementById('viewSold');
const soldList = document.getElementById('soldList');
const soldSection = document.querySelector('.sold-list');
const closeSold = document.getElementById('closeSold');
const searchInput = document.getElementById('searchInput');
const adminPass = document.getElementById('adminPass');
const drawBtn = document.getElementById('drawBtn');
const winnersDiv = document.getElementById('winners');
const bankName = document.getElementById('bankName');
const bankAccount = document.getElementById('bankAccount');
const bankId = document.getElementById('bankId');
const bankPhone = document.getElementById('bankPhone');
const saveBankBtn = document.getElementById('saveBankBtn');
const bankMsg = document.getElementById('bankMsg');
const bankDetails = document.getElementById('bankDetails');
const copyBankBtn = document.getElementById('copyBankBtn');

let sessionUser = null; // username

function updateStats(){
  const sold = Object.keys(state.tickets).length;
  soldCount.textContent = sold;
  availCount.textContent = 1000 - sold;
}

function isAvailable(num){ return !state.tickets[String(num)]; }

function saveUser(username,password){
  state.users[username] = {password};
  saveState(state);
}
function checkUser(username,password){
  const u = state.users[username];
  return u && u.password === password;
}

function setSession(username){
  sessionUser = username; currentUser.textContent = username;
  userInfo.hidden = false; document.getElementById('authForms').hidden = true;
}
function clearSession(){ sessionUser = null; userInfo.hidden = true; document.getElementById('authForms').hidden = false; }

regBtn.addEventListener('click', ()=>{
  const u = regUser.value.trim(); const p = regPass.value;
  if(!u||!p){ alert('Usuario y contraseña requeridos'); return; }
  if(state.users[u]){ alert('Usuario ya existe'); return; }
  saveUser(u,p);
  regUser.value=''; regPass.value='';
  alert('Usuario creado. Ahora puedes iniciar sesión.');
});

loginBtn.addEventListener('click', ()=>{
  const u = loginUser.value.trim(); const p = loginPass.value;
  if(!u||!p){ alert('Usuario y contraseña requeridos'); return; }
  if(!checkUser(u,p)){ alert('Credenciales incorrectas'); return; }
  setSession(u);
  loginUser.value=''; loginPass.value='';
});

logoutBtn.addEventListener('click', ()=>{ clearSession(); });

function pickRandomAvailable(){
  const avail = [];
  for(let i=1;i<=1000;i++) if(isAvailable(i)) avail.push(i);
  if(avail.length===0) return null;
  return avail[Math.floor(Math.random()*avail.length)];
}

function buyNumber(num, contact, username){
  state.tickets[String(num)] = {owner:username, contact, ts: Date.now(), price: PRICE};
  saveState(state);
  updateStats();
}

buyBtn.addEventListener('click', ()=>{
  buyMsg.textContent=''; buyMsg.className='info';
  if(!sessionUser){ buyMsg.textContent='Debes iniciar sesión para comprar.'; buyMsg.className='error'; return; }
  const contact = buyerContact.value.trim();
  if(!contact){ buyMsg.textContent='Ingresa contacto.'; buyMsg.className='error'; return; }
  let num = parseInt(numberInput.value,10);
  if(!num){ num = pickRandomAvailable(); if(num===null){ buyMsg.textContent='No hay números disponibles.'; buyMsg.className='error'; return; } }
  if(num<1||num>1000){ buyMsg.textContent='Número fuera de rango 1-1000.'; buyMsg.className='error'; return; }
  if(!isAvailable(num)){ buyMsg.textContent='Ese número ya está vendido.'; buyMsg.className='error'; return; }
  // Simular pago: mostrar instrucciones bancarias
  buyMsg.innerHTML = `Para completar el pago de $${PRICE.toFixed(2)} realiza la transferencia. Luego haz clic en "Confirmar pago".`;
  // store a pending purchase temp in sessionStorage
  sessionStorage.setItem('rifa_pending', JSON.stringify({num,contact,username:sessionUser}));
  // show confirm button
  showConfirm();
});

function showConfirm(){
  let btn = document.getElementById('confirmPay');
  if(!btn){ btn = document.createElement('button'); btn.id='confirmPay'; btn.textContent='Confirmar pago'; buyMsg.after(btn);
    btn.addEventListener('click', confirmPayment);
  }
}

function confirmPayment(){
  const raw = sessionStorage.getItem('rifa_pending');
  if(!raw){ alert('No hay pago pendiente.'); return; }
  const p = JSON.parse(raw);
  // finalize purchase
  if(!isAvailable(p.num)){ alert('Lo siento, el número ya fue vendido.'); sessionStorage.removeItem('rifa_pending'); return; }
  buyNumber(p.num,p.contact,p.username);
  sessionStorage.removeItem('rifa_pending');
  const btn = document.getElementById('confirmPay'); if(btn) btn.remove();
  buyMsg.textContent = `Compra confirmada: ${p.num} — $${PRICE.toFixed(2)}.`;
  buyerContact.value=''; numberInput.value='';
}

viewSold.addEventListener('click', ()=>{ renderSoldList(); soldSection.hidden = false; });
closeSold.addEventListener('click', ()=>{ soldSection.hidden=true; });

function renderSoldList(filter=''){
  soldList.innerHTML = '';
  const items = Object.entries(state.tickets).map(([num,info])=>({num:parseInt(num,10),...info}));
  const q = filter.trim().toLowerCase();
  const filtered = items.filter(it=>!q || it.owner.toLowerCase().includes(q)|| it.contact.toLowerCase().includes(q)|| String(it.num).includes(q));
  if(filtered.length===0){ soldList.innerHTML = '<li>No hay resultados.</li>'; return; }
  filtered.sort((a,b)=>a.num-b.num);
  for(const it of filtered){
    const li = document.createElement('li');
    li.textContent = `${it.num} — ${it.owner} (${it.contact})`;
    soldList.appendChild(li);
  }
}

searchInput.addEventListener('input', ()=> renderSoldList(searchInput.value));

function adminCheck(){ return adminPass.value === state.settings.adminPass; }

saveBankBtn.addEventListener('click', ()=>{
  state.settings.bank = {name: bankName.value, account: bankAccount.value, id: bankId.value, phone: bankPhone.value};
  saveState(state);
  bankMsg.textContent = 'Ajustes guardados.';
  renderBank();
});

function renderBank(){
  const b = state.settings.bank || {};
  bankDetails.textContent = b.name ? `Banco: ${b.name} — Cuenta: ${b.account} — ID: ${b.id} — Teléfono: ${b.phone}` : 'No hay datos bancarios guardados.';
  // fill inputs with saved or defaults
  bankName.value = b.name || 'Banco de Venezuela';
  bankAccount.value = b.account || '';
  bankId.value = b.id || '26196404';
  bankPhone.value = b.phone || '04244451788';
}

if(copyBankBtn){
  copyBankBtn.addEventListener('click', ()=>{
    const text = `Banco: ${bankName.value}\nCuenta: ${bankAccount.value}\nCédula/ID: ${bankId.value}\nTeléfono/Pago móvil: ${bankPhone.value}`;
    navigator.clipboard?.writeText(text).then(()=>{
      bankMsg.textContent = 'Datos de pago copiados al portapapeles.';
    }).catch(()=>{
      bankMsg.textContent = 'No se pudo copiar. Selecciona manualmente los datos.';
    });
  });
}

function drawWinners(){
  winnersDiv.innerHTML='';
  if(!adminCheck()){ winnersDiv.textContent='Contraseña incorrecta.'; return; }
  const soldNums = Object.keys(state.tickets).map(n=>parseInt(n,10));
  if(soldNums.length<5){ winnersDiv.textContent='No hay suficientes participantes (mínimo 5 números vendidos).'; return; }
  const pool = [...soldNums];
  function pick(){ const i = Math.floor(Math.random()*pool.length); return pool.splice(i,1)[0]; }
  const prizes = ['Celular','Moto','TV','Cocina (licuadora)','$1000 efectivo'];
  for(const prize of prizes){
    const num = pick();
    const info = state.tickets[String(num)];
    const el = document.createElement('div');
    el.textContent = `${prize}: ${num} — ${info.owner} (${info.contact})`;
    winnersDiv.appendChild(el);
  }
}

drawBtn.addEventListener('click', drawWinners);

// init
updateStats(); renderBank();

// Expose for debugging
window._rifa = {state, saveState};
