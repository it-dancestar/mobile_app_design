// Calendar UI: local dates, Monday-first weeks, and no placeholder events.
const calendarContent = document.querySelector('#calendar-content');
const calendarHeading = document.querySelector('#calendar-heading');
const viewButtons = document.querySelectorAll('[data-view]');
let selectedDate = new Date();
let calendarView = 'month';
const sameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const addDays = (date, count) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + count);
const weekStart = date => addDays(date, -((date.getDay() + 6) % 7));
const dateLabel = date => date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

// Inclusive local calendar dates; no event times have been set yet.
const qualifiers = [
  { title: 'Portugal Qualifier', start: new Date(2027, 1, 13), end: new Date(2027, 1, 13) },
  { title: 'Slovakia Qualifier', start: new Date(2027, 2, 5), end: new Date(2027, 2, 7) },
];
function qualifiersOn(date) {
  const day = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return qualifiers.filter(event => day >= event.start && day <= event.end);
}

function dayButton(date, outside = false) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'calendar-date';
  button.classList.toggle('outside-month', outside);
  button.classList.toggle('is-selected', sameDay(date, selectedDate));
  if (sameDay(date, new Date())) button.setAttribute('aria-current', 'date');
  button.setAttribute('aria-label', dateLabel(date));
  button.setAttribute('aria-pressed', String(sameDay(date, selectedDate)));
  if (calendarView !== 'month') {
    const weekday = document.createElement('span');
    weekday.textContent = date.toLocaleDateString('en-GB', { weekday: 'short' });
    button.append(weekday);
  }
  const number = document.createElement('span');
  number.textContent = date.getDate();
  button.append(number);
  const events = qualifiersOn(date);
  button.classList.toggle('has-qualifier', events.length > 0);
  if (events.length) {
    const titles = events.map(event => event.title).join(', ');
    button.setAttribute('aria-label', `${dateLabel(date)}: ${titles}`);
    button.title = titles;
    const indicator = document.createElement('span');
    indicator.className = 'calendar-event-dot';
    indicator.setAttribute('aria-hidden', 'true');
    button.append(indicator);
  }
  button.addEventListener('click', () => {
    selectedDate = date;
    renderCalendar();
  });
  return button;
}

function renderCalendar() {
  calendarContent.replaceChildren();
  for (const button of viewButtons) button.setAttribute('aria-pressed', String(button.dataset.view === calendarView));
  document.querySelector('#calendar-prev').setAttribute('aria-label', `Previous ${calendarView}`);
  document.querySelector('#calendar-next').setAttribute('aria-label', `Next ${calendarView}`);
  calendarHeading.textContent = calendarView === 'day' ? dateLabel(selectedDate) : selectedDate.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

  if (calendarView === 'month') {
    const grid = document.createElement('div');
    grid.className = 'calendar-month';
    for (const weekday of ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']) {
      const label = document.createElement('span');
      label.className = 'calendar-weekday';
      label.textContent = weekday;
      grid.append(label);
    }
    const first = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    const start = weekStart(first);
    for (let index = 0; index < 42; index++) {
      const date = addDays(start, index);
      grid.append(dayButton(date, date.getMonth() !== selectedDate.getMonth()));
    }
    calendarContent.append(grid);
    const monthEvents = document.createElement('div');
    monthEvents.className = 'calendar-month-events';
    for (const event of qualifiers.filter(event => event.start <= new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0) && event.end >= first)) {
      const entry = document.createElement('button');
      entry.type = 'button';
      entry.className = 'calendar-event-entry';
      const range = sameDay(event.start, event.end) ? dateLabel(event.start) : `${dateLabel(event.start)} – ${dateLabel(event.end)}`;
      entry.textContent = `${event.title} · ${range}`;
      entry.addEventListener('click', () => {
        selectedDate = event.start;
        calendarView = 'day';
        renderCalendar();
      });
      monthEvents.append(entry);
    }
    calendarContent.append(monthEvents);
    return;
  }

  const start = calendarView === 'week' ? weekStart(selectedDate) : selectedDate;
  const days = calendarView === 'week' ? 7 : 1;
  const header = document.createElement('div');
  header.className = 'calendar-day-strip';
  header.style.setProperty('--days', days);
  for (let index = 0; index < days; index++) header.append(dayButton(addDays(start, index)));
  calendarContent.append(header);

  const allDay = document.createElement('div');
  allDay.className = 'calendar-all-day';
  allDay.style.setProperty('--days', days);
  const allDayLabel = document.createElement('span');
  allDayLabel.className = 'calendar-all-day-label';
  allDayLabel.textContent = 'All day';
  allDay.append(allDayLabel);
  for (let index = 0; index < days; index++) {
    const cell = document.createElement('div');
    for (const event of qualifiersOn(addDays(start, index))) {
      const badge = document.createElement('span');
      badge.className = 'calendar-event-badge';
      badge.textContent = event.title;
      cell.append(badge);
    }
    allDay.append(cell);
  }
  calendarContent.append(allDay);

  const timeline = document.createElement('div');
  timeline.className = 'calendar-timeline';
  const now = new Date();
  for (let hour = 0; hour < 24; hour++) {
    const row = document.createElement('div');
    row.className = 'calendar-hour';
    const label = document.createElement('span');
    label.className = 'calendar-hour-label';
    label.textContent = `${String(hour).padStart(2, '0')}:00`;
    row.append(label);
    for (let index = 0; index < days; index++) {
      const cell = document.createElement('div');
      cell.className = 'calendar-time-cell';
      cell.setAttribute('aria-label', `${dateLabel(addDays(start, index))}, ${label.textContent}`);
      if (hour === now.getHours() && sameDay(addDays(start, index), now)) {
        const marker = document.createElement('span');
        marker.className = 'calendar-now';
        marker.style.top = `${now.getMinutes() / 60 * 100}%`;
        marker.setAttribute('aria-label', 'Current time');
        cell.append(marker);
      }
      row.append(cell);
    }
    row.style.setProperty('--days', days);
    timeline.append(row);
  }
  calendarContent.append(timeline);
}

for (const button of viewButtons) button.addEventListener('click', () => {
  calendarView = button.dataset.view;
  renderCalendar();
});
function navigateCalendar(direction) {
  if (calendarView === 'month') {
    const lastDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + direction + 1, 0).getDate();
    selectedDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + direction, Math.min(selectedDate.getDate(), lastDay));
  } else selectedDate = addDays(selectedDate, direction * (calendarView === 'week' ? 7 : 1));
  renderCalendar();
}
document.querySelector('#calendar-prev').addEventListener('click', () => navigateCalendar(-1));
document.querySelector('#calendar-next').addEventListener('click', () => navigateCalendar(1));
document.querySelector('#calendar-today').addEventListener('click', () => {
  selectedDate = new Date();
  renderCalendar();
});
renderCalendar();
// Keep the current-time marker accurate while the page stays open.
setInterval(() => { if (calendarView !== 'month') renderCalendar(); }, 60000);
