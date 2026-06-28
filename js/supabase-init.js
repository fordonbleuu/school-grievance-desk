// ============================================================
// SUPABASE CLIENT INITIALIZATION
// ============================================================

// --- CONFIGURE THESE WITH YOUR SUPABASE PROJECT DETAILS ---
var SUPABASE_URL = 'https://rtunetfbcgcadaonafed.supabase.co';
var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0dW5ldGZiY2djYWRhb25hZmVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI2MjQ3MTYsImV4cCI6MjA5ODIwMDcxNn0.QaQSOeb7GCaAwc9BIqH5zRX3eNthjW8GIP6ruw06XcM';
// ---

var supabaseClient = null;

function initSupabase() {
  if (SUPABASE_URL === 'https://your-project-id.supabase.co' || SUPABASE_ANON_KEY === 'your-anon-key-here') {
    console.error('❌ Supabase not configured! Update SUPABASE_URL and SUPABASE_ANON_KEY in js/supabase-init.js');
    return false;
  }

  if (typeof supabase === 'undefined') {
    console.error('❌ Supabase JS library not loaded. Make sure the script tag for supabase-js is included.');
    return false;
  }

  try {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('✅ Supabase client initialized');
    return true;
  } catch (err) {
    console.error('❌ Failed to initialize Supabase:', err.message);
    return false;
  }
}

function getSupabase() {
  return supabaseClient;
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

function showAlert(elementId, message, type) {
  var el = document.getElementById(elementId);
  if (!el) return;
  el.className = 'alert visible alert-' + type;
  el.innerHTML = getAlertIcon(type) + '<span>' + escapeHtml(message) + '</span>';
}

function hideAlert(elementId) {
  var el = document.getElementById(elementId);
  if (!el) return;
  el.className = 'alert';
  el.innerHTML = '';
}

function showError(message) {
  showAlert('errorAlert', message, 'error');
}

function getAlertIcon(type) {
  if (type === 'success') {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>';
  } else if (type === 'error') {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';
  }
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';
}

function escapeHtml(text) {
  if (!text) return '';
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(text));
  return div.innerHTML;
}

function formatDate(isoString) {
  if (!isoString) return '—';
  try {
    var date = new Date(isoString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  } catch (e) {
    return isoString;
  }
}

function getStatusBadgeHTML(status) {
  var label = status.replace(/_/g, ' ');
  return '<span class="badge badge-' + status.toLowerCase() + '">' + escapeHtml(label) + '</span>';
}
