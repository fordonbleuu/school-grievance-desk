document.addEventListener('DOMContentLoaded', function() {
  var form = document.getElementById('grievanceForm');
  var submitBtn = document.getElementById('submitBtn');
  var formSection = document.getElementById('formSection');
  var successSection = document.getElementById('successSection');
  var ticketIdDisplay = document.getElementById('ticketIdDisplay');

  if (!form) return;
  if (!initSupabase()) return;

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    hideAlert('formAlert');

    var data = {
      student_name: document.getElementById('studentName').value.trim(),
      roll_number: document.getElementById('rollNumber').value.trim(),
      class_division: document.getElementById('classDivision').value.trim(),
      category: document.getElementById('category').value,
      description: document.getElementById('description').value.trim(),
      contact: document.getElementById('contact').value.trim()
    };

    if (!data.student_name || !data.roll_number || !data.class_division || !data.category || !data.description) {
      showAlert('formAlert', 'Please fill in all required fields.', 'error');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner spinner-sm"></span> Submitting...';

    try {
      var db = getSupabase();
      var result = await db
        .from('grievances')
        .insert([data])
        .select('ticket_id')
        .single();

      if (result.error) throw result.error;

      formSection.style.display = 'none';
      successSection.style.display = 'block';
      ticketIdDisplay.textContent = result.data.ticket_id;

    } catch (err) {
      showAlert('formAlert', 'Error submitting grievance: ' + err.message, 'error');
      submitBtn.disabled = false;
      var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
      submitBtn.innerHTML = svg + ' Submit Grievance';
    }
  });
});
