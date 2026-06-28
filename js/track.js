document.addEventListener('DOMContentLoaded', function() {
  var form = document.getElementById('trackForm');
  var trackBtn = document.getElementById('trackBtn');
  var resultDiv = document.getElementById('trackResult');
  var ticketInput = document.getElementById('ticketId');

  if (!form) return;
  if (!initSupabase()) return;

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    hideAlert('trackAlert');

    var ticketId = ticketInput.value.trim().toUpperCase();
    if (!ticketId) {
      showAlert('trackAlert', 'Please enter your Ticket ID.', 'error');
      return;
    }

    trackBtn.disabled = true;
    trackBtn.innerHTML = '<span class="spinner spinner-sm"></span> Searching...';
    resultDiv.innerHTML = '';

    try {
      var db = getSupabase();
      var result = await db
        .from('grievances')
        .select('*')
        .eq('ticket_id', ticketId)
        .maybeSingle();

      if (result.error) throw result.error;

      if (!result.data) {
        showAlert('trackAlert', 'No grievance found with Ticket ID: ' + escapeHtml(ticketId), 'error');
        trackBtn.disabled = false;
        var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>';
        trackBtn.innerHTML = svg + ' Track Status';
        return;
      }

      renderTrackResult(result.data);

    } catch (err) {
      showAlert('trackAlert', 'Error: ' + err.message, 'error');
      trackBtn.disabled = false;
      var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>';
      trackBtn.innerHTML = svg + ' Track Status';
    }
  });

  function renderTrackResult(g) {
    var statusOrder = ['pending', 'under_review', 'resolved'];
    var currentIdx = statusOrder.indexOf(g.status);

    var timelineHtml = '';
    var steps = [
      { key: 'pending', label: 'Grievance Submitted', desc: 'Your grievance has been received and registered.' },
      { key: 'under_review', label: 'Under Review', desc: 'Your grievance is being reviewed by the committee.' },
      { key: 'resolved', label: 'Resolved', desc: g.admin_notes || 'Your grievance has been addressed.' }
    ];

    steps.forEach(function(step, i) {
      var active = i <= currentIdx;
      var dotClass = active ? 'active' : 'inactive';
      timelineHtml +=
        '<div class="timeline-item">' +
          '<div class="timeline-dot ' + dotClass + '">' +
            (active ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>' : '') +
          '</div>' +
          '<div class="timeline-content">' +
            '<h5>' + step.label + '</h5>' +
            '<p>' + (i === currentIdx ? step.desc : (i < currentIdx ? 'Completed' : 'Pending')) + '</p>' +
          '</div>' +
        '</div>';
    });

    resultDiv.innerHTML =
      '<div class="track-result">' +
        '<div class="track-header">' +
          '<h3>Ticket: ' + escapeHtml(g.ticket_id) + '</h3>' +
          getStatusBadgeHTML(g.status) +
        '</div>' +
        '<div class="track-details">' +
          '<div class="detail-row"><span class="detail-label">Student:</span><span class="detail-value">' + escapeHtml(g.student_name) + '</span></div>' +
          '<div class="detail-row"><span class="detail-label">Category:</span><span class="detail-value">' + escapeHtml(g.category) + '</span></div>' +
          '<div class="detail-row"><span class="detail-label">Submitted:</span><span class="detail-value">' + formatDate(g.created_at) + '</span></div>' +
          '<div class="detail-row"><span class="detail-label">Description:</span><span class="detail-value">' + escapeHtml(g.description) + '</span></div>' +
        '</div>' +
        '<div class="track-timeline">' +
          '<h4>Status Timeline</h4>' +
          timelineHtml +
        '</div>' +
      '</div>';

    trackBtn.disabled = false;
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>';
    trackBtn.innerHTML = svg + ' Track Status';
  }
});
