// Preserve the selected schedule date and view when returning from an event.
const eventBack = document.querySelector('.qualifier-back');
const from = new URLSearchParams(location.search).get('from');
if (from) {
  const returnUrl = new URL(from, location.href);
  if (returnUrl.origin === location.origin && returnUrl.pathname === new URL('schedule.html', location.href).pathname) {
    eventBack.href = returnUrl.href;
  }
}
