// Portugal qualifier: midnight in Europe/Zagreb (CET, UTC+01:00).
const countdownTarget = new Date('2027-02-13T00:00:00+01:00').getTime();
const countdownCard = document.querySelector('.countdown-card');
const countdownDays = countdownCard.querySelector('.countdown-values strong');
const countdownClock = countdownCard.querySelector('.countdown-clock');
const countdownLabel = countdownCard.querySelector('.countdown-label');

function updateCountdown() {
  const remaining = Math.max(0, Math.ceil((countdownTarget - Date.now()) / 1000));
  const days = Math.floor(remaining / 86400);
  const hours = Math.floor(remaining % 86400 / 3600);
  const minutes = Math.floor(remaining % 3600 / 60);
  const seconds = remaining % 60;
  countdownDays.textContent = days;
  countdownClock.textContent = [hours, minutes, seconds].map(value => String(value).padStart(2, '0')).join(':');
  countdownLabel.textContent = remaining > 0 ? 'Starts in' : 'Started';
  countdownCard.setAttribute('aria-label', remaining > 0
    ? `Portugal Qualifier starts in ${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`
    : 'Portugal Qualifier has started');
}

updateCountdown();
setInterval(updateCountdown, 1000);
window.addEventListener('pageshow', updateCountdown);
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) updateCountdown();
});
