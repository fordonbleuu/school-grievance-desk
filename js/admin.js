document.addEventListener('DOMContentLoaded', function() {
  var loginSection = document.getElementById('loginSection');
  var dashboardSection = document.getElementById('dashboardSection');
  var loginForm = document.getElementById('loginForm');
  var loginBtn = document.getElementById('loginBtn');
  var loginError = document.getElementById('loginError');
  var logoutBtn = document.getElementById('logoutBtn');
  var grievanceBody = document.getElementById('grievanceBody');
  var emptyState = document.getElementById('emptyState');
  var detailPanel = document.getElementById('detailPanel');
  var detailCloseBtn = document.getElementById('detailCloseBtn');
  var filterBtns = document.querySelectorAll('.filter-btn');

  if (!initSupabase()) return;

  var db = getSupabase();
  var selectedId = null;
  var currentFilter = 'all';
  var allGrievances = [];

  // Auth state listener
  db.auth.onAuthStateChange(function(event, session) {
    if (session) {
      showDashboard();
      loadGrievances();
    } else {
      showLogin();
    }
  });

  // Check for existing session
  db.auth.getSession().then(function(res) {
    if (res.data.session) {
      showDashboard();
      loadGrievances();
    }
  }).catch(function(err) {
    console.error('Session check failed:', err);
  });

  // Login form
  loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    loginError.classList.remove('visible');

    var email = document.getElementById('email').value.trim();
    var password = document.getElementById('password').value;

    if (!email || !password) {
      loginError.textContent = 'Please enter email and password.';
      loginError.classList.add('visible');
      return;
    }

    loginBtn.disabled = true;
    loginBtn.innerHTML = '<span class="spinner spinner-sm"></span> Signing in...';

    try {
      var authResult = await db.auth.signInWithPassword({ email: email, password: password });
      if (authResult.error) throw authResult.error;
      showDashboard();
      loadGrievances();
    } catch (err) {
      loginError.textContent = err.message || 'Invalid credentials.';
      loginError.classList.add('visible');
      loginBtn.disabled = false;
      var lockSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>';
      loginBtn.innerHTML = lockSvg + ' Sign In';
    }
  });

  // Logout
  logoutBtn.addEventListener('click', async function() {
    await db.auth.signOut();
    showLogin();
  });

  // Close detail panel
  if (detailCloseBtn) {
    detailCloseBtn.addEventListener('click', function() {
      detailPanel.classList.remove('visible');
    });
  }

  // Filter buttons
  filterBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      filterBtns.forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderTable();
    });
  });

  // Load grievances
  async function loadGrievances() {
    try {
      var result = await db
        .from('grievances')
        .select('*')
        .order('created_at', { ascending: false });

      if (result.error) throw result.error;
      allGrievances = result.data || [];
      renderTable();
    } catch (err) {
      showError('Failed to load grievances: ' + err.message);
    }
  }

  // Render table
  function renderTable() {
    var filtered = allGrievances;
    if (currentFilter !== 'all') {
      filtered = allGrievances.filter(function(g) { return g.status === currentFilter; });
    }

    if (filtered.length === 0) {
      grievanceBody.innerHTML = '';
      emptyState.style.display = 'block';
      return;
    }

    emptyState.style.display = 'none';
    var html = '';
    filtered.forEach(function(g) {
      html +=
        '<tr onclick="selectGrievance(' + g.id + ')">' +
          '<td><span class="ticket-id">' + escapeHtml(g.ticket_id) + '</span></td>' +
          '<td>' + escapeHtml(g.student_name) + '</td>' +
          '<td>' + escapeHtml(g.category) + '</td>' +
          '<td>' + getStatusBadgeHTML(g.status) + '</td>' +
          '<td class="date-cell">' + formatDate(g.created_at) + '</td>' +
        '</tr>';
    });
    grievanceBody.innerHTML = html;
  }

  // Select grievance (exposed globally for onclick)
  window.selectGrievance = function(id) {
    selectedId = id;
    var grievance = allGrievances.find(function(g) { return g.id === id; });
    if (!grievance) return;

    detailPanel.classList.add('visible');

    var statusSelect = document.getElementById('updateStatus');
    var notesTextarea = document.getElementById('updateNotes');
    var saveBtn = document.getElementById('saveUpdate');

    statusSelect.value = grievance.status;
    notesTextarea.value = grievance.admin_notes || '';

    document.getElementById('detailTicket').textContent = grievance.ticket_id;
    document.getElementById('detailName').textContent = grievance.student_name;
    document.getElementById('detailRoll').textContent = grievance.roll_number;
    document.getElementById('detailClass').textContent = grievance.class_division;
    document.getElementById('detailCategory').textContent = grievance.category;
    document.getElementById('detailContact').textContent = grievance.contact || '\u2014';
    document.getElementById('detailDate').textContent = formatDate(grievance.created_at);
    document.getElementById('detailDescription').textContent = grievance.description;
    document.getElementById('detailStatus').innerHTML = getStatusBadgeHTML(grievance.status);

    // Clone save button to remove old listeners
    var newSaveBtn = saveBtn.cloneNode(true);
    saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);

    newSaveBtn.addEventListener('click', async function() {
      var newStatus = statusSelect.value;
      var newNotes = notesTextarea.value.trim();

      newSaveBtn.disabled = true;
      newSaveBtn.innerHTML = '<span class="spinner spinner-sm"></span> Saving...';

      try {
        var updateResult = await db
          .from('grievances')
          .update({ status: newStatus, admin_notes: newNotes })
          .eq('id', id);

        if (updateResult.error) throw updateResult.error;

        showAlert('dashboardAlert', 'Grievance ' + grievance.ticket_id + ' updated successfully!', 'success');
        loadGrievances();
        newSaveBtn.disabled = false;
        var checkSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
        newSaveBtn.innerHTML = checkSvg + ' Save Changes';

        document.getElementById('detailStatus').innerHTML = getStatusBadgeHTML(newStatus);
        grievance.status = newStatus;
        grievance.admin_notes = newNotes;

      } catch (err) {
        showAlert('dashboardAlert', 'Error: ' + err.message, 'error');
        newSaveBtn.disabled = false;
        var checkSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
        newSaveBtn.innerHTML = checkSvg + ' Save Changes';
      }
    });

    detailPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  function showDashboard() {
    loginSection.style.display = 'none';
    dashboardSection.style.display = 'block';
  }

  function showLogin() {
    loginSection.style.display = 'block';
    dashboardSection.style.display = 'none';
    loginBtn.disabled = false;
    var lockSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>';
    loginBtn.innerHTML = lockSvg + ' Sign In';
  }
});
