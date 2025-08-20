// Prototype app: uses patients.json as initial seed, persists to localStorage for dynamic behavior

const DEMO_USER = { username: 'admin', password: '1234' };
const STORAGE_KEY = 'patient_portal_patients_v1';

// utility
function escapeHtml(s){ return String(s||'').replace(/[&<>"']/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])); }

// load initial list: try localStorage; if empty, fetch patients.json; fallback to empty
async function loadPatients(){
  const raw = localStorage.getItem(STORAGE_KEY);
  if(raw){
    try { return JSON.parse(raw); } catch(e){ localStorage.removeItem(STORAGE_KEY); }
  }
  // fetch seed JSON (works when served via http or Vercel). If fetch fails (file://), use inline fallback.
  try {
    const resp = await fetch('patients.json');
    if(resp.ok){ const data = await resp.json(); localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); return data; }
  } catch(e){}
  // fallback: empty
  const fallback = [];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(fallback));
  return fallback;
}

async function savePatients(list){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

// add a patient (checks duplicate patientId)
async function addPatient(p){
  if(!p.patientId) throw new Error('Patient ID required');
  const list = await loadPatients();
  if(list.some(x=> x.patientId === p.patientId)) throw new Error('Patient ID already exists');
  list.unshift(p);
  await savePatients(list);
  return p;
}

// helpers for login/redirect
function logout(){ localStorage.removeItem('loggedIn'); window.location.href='index.html'; }
function ensureAuth(){ if(!localStorage.getItem('loggedIn')){ window.location.href='index.html'; } }

// attach login handler
(function attachLogin(){
  const form = document.getElementById('loginForm');
  if(!form) return;
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const u = document.getElementById('username').value.trim();
    const p = document.getElementById('password').value.trim();
    if(u === DEMO_USER.username && p === DEMO_USER.password){
      localStorage.setItem('loggedIn', '1');
      window.location.href = 'dashboard.html';
    } else {
      document.getElementById('loginError').textContent = 'Invalid credentials';
    }
  });
})();

// apply auth guard on pages other than index
(function guard(){
  const path = window.location.pathname.split('/').pop();
  if(['index.html',''].includes(path)) return;
  // allow patient.html to be public (RFID)
  if(path === 'patient.html') return;
  ensureAuth();
})();

// expose functions globally
window.loadPatients = loadPatients;
window.addPatient = addPatient;
window.savePatients = savePatients;
window.logout = logout;
window.escapeHtml = escapeHtml;
