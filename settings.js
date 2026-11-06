// Browser-local mockup preference; this does not request system push permission.
const notificationPreference = document.querySelector('#notification-permission');
try { notificationPreference.checked = localStorage.getItem('dancestar-notifications') === 'enabled'; } catch {}
notificationPreference.addEventListener('change', () => {
  try { localStorage.setItem('dancestar-notifications', notificationPreference.checked ? 'enabled' : 'disabled'); } catch {}
});
