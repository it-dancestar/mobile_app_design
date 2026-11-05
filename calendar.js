// Calendar UI: local dates, Monday-first weeks, and no placeholder events.
const calendarContent = document.querySelector('#calendar-content');
const calendarHeading = document.querySelector('#calendar-heading');
const viewButtons = document.querySelectorAll('[data-view]');
const scheduleParams = new URLSearchParams(location.search);
const requestedDate = scheduleParams.get('date');
let selectedDate = requestedDate && /^\d{4}-\d{2}-\d{2}$/.test(requestedDate)
  ? new Date(`${requestedDate}T12:00:00`) : new Date();
if (Number.isNaN(selectedDate.getTime())) selectedDate = new Date();
let calendarView = ['month', 'week', 'day'].includes(scheduleParams.get('view')) ? scheduleParams.get('view') : 'month';
const sameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const addDays = (date, count) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + count);
const weekStart = date => addDays(date, -((date.getDay() + 6) % 7));
const dateLabel = date => date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

// Inclusive local calendar dates for each qualifier.
const qualifiers = [
  { title: 'Portugal Qualifier', competition: 'portugal', start: new Date(2027, 1, 13), end: new Date(2027, 1, 13) },
  { title: 'Slovakia Qualifier', competition: 'slovakia', start: new Date(2027, 2, 5), end: new Date(2027, 2, 7) },
];
function qualifiersOn(date) {
  const day = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return qualifiers.filter(event => day >= event.start && day <= event.end);
}

// Event times are local to the competition, with minute-accurate slot placement.
const scheduleEvents = [
  { competition: 'portugal', date: '2027-02-13', title: 'Urban Styles · Group · Junior', start: '10:15', end: '10:45' },
  { competition: 'slovakia', date: '2027-03-07', title: 'Commercial Dance · Formation · Youth', start: '12:15', end: '13:15' },
  { competition: 'portugal', date: '2027-02-13', title: 'Opening ceremony', start: '09:00', end: '10:00' },
  { competition: 'portugal', date: '2027-02-13', title: 'Workshop 1', start: '12:00', end: '14:00' },
  { competition: 'portugal', date: '2027-02-13', title: 'Workshop 2', start: '14:00', end: '16:00' },
  { competition: 'portugal', date: '2027-02-13', title: 'Award ceremonies', start: '19:00', end: '22:00' },
  { competition: 'slovakia', date: '2027-03-05', title: 'Opening ceremony', start: '13:00', end: '14:00' },
  { competition: 'slovakia', date: '2027-03-05', title: 'Award ceremony day 1', start: '20:30', end: '21:30' },
  { competition: 'slovakia', date: '2027-03-06', title: 'Workshop 1', start: '14:00', end: '16:00' },
  { competition: 'slovakia', date: '2027-03-06', title: 'Award ceremony day 2', start: '18:00', end: '20:30' },
  { competition: 'slovakia', date: '2027-03-06', title: 'Battle', start: '20:30', end: '21:30' },
  { competition: 'slovakia', date: '2027-03-07', title: 'Workshop 2', start: '11:00', end: '12:30' },
  { competition: 'slovakia', date: '2027-03-07', title: 'Workshop 3', start: '13:00', end: '15:00' },
  { competition: 'slovakia', date: '2027-03-07', title: 'Award ceremony day 3 & special awards', start: '18:00', end: '22:00' },
];
const timeMinutes = time => time.split(':').reduce((hours, minutes) => Number(hours) * 60 + Number(minutes));
const localDateKey = date => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

// Photos are shown only in day view; unmatched events keep their color styling.
function eventPhoto(title) {
  if (title === 'Workshop 1') return '../assets/workshop-1.png';
  if (title === 'Workshop 2') return '../assets/workshop-2.png';
  if (title === 'Workshop 3') return '../assets/workshop-3.png';
  if (title === 'Battle') return '../assets/battle.jpg';
  if (title.startsWith('Award ceremon')) return '../assets/award.jpg';
  return null;
}

// Group connected overlaps and assign the first free lane. Touching endpoints
// do not overlap; every event in a group shares its group's peak lane count.
function layoutDayEvents(events) {
  const sorted = events.map(event => ({ event, start: timeMinutes(event.start), end: timeMinutes(event.end) }))
    .sort((a, b) => a.start - b.start || b.end - a.end);
  const result = [];
  let group = [];
  let groupEnd = -1;
  function flush() {
    const laneEnds = [];
    for (const item of group) {
      let lane = laneEnds.findIndex(end => end <= item.start);
      if (lane === -1) lane = laneEnds.length;
      laneEnds[lane] = item.end;
      item.lane = lane;
    }
    for (const item of group) result.push({ ...item, lanes: laneEnds.length });
    group = [];
  }
  for (const item of sorted) {
    if (item.start >= groupEnd) flush();
    if (!group.length) groupEnd = item.end;
    else groupEnd = Math.max(groupEnd, item.end);
    group.push(item);
  }
  flush();
  return result;
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
    button.dataset.competition = events[0].competition;
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
      entry.dataset.competition = event.competition;
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
      badge.dataset.competition = event.competition;
      badge.textContent = event.title;
      cell.append(badge);
    }
    allDay.append(cell);
  }

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
  const slots = document.createElement('div');
  slots.className = 'calendar-slots';
  slots.style.setProperty('--days', days);
  for (let index = 0; index < days; index++) {
    const column = document.createElement('div');
    column.className = 'calendar-slot-column';
    const date = addDays(start, index);
    const qualifier = qualifiersOn(date)[0];
    if (qualifier) column.dataset.competition = qualifier.competition;
    for (const { event, lane, lanes } of layoutDayEvents(scheduleEvents.filter(event => event.date === localDateKey(date)))) {
      const slot = document.createElement('a');
      slot.className = 'calendar-timed-event';
      const eventSlug = `${event.competition}-${event.date}-${event.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
      const returnTo = `schedule.html?date=${localDateKey(selectedDate)}&view=${calendarView}`;
      slot.href = `event-${eventSlug}.html?from=${encodeURIComponent(returnTo)}`;
      slot.dataset.competition = event.competition;
      // Offset overlapping lanes like stacked calendar cards, retaining readable width.
      const offset = lane * 12;
      slot.style.left = `${offset + 1}px`;
      slot.style.right = 'auto';
      slot.style.width = `calc(100% - ${offset + 2}px)`;
      // Later starts sit above ongoing events so their title is never covered
      // when an overlap group reuses an earlier horizontal lane.
      slot.style.zIndex = String(timeMinutes(event.start) + 2);
      slot.classList.toggle('is-overlapping', lanes > 1);
      slot.style.top = `${timeMinutes(event.start) / 1440 * 100}%`;
      slot.style.height = `${(timeMinutes(event.end) - timeMinutes(event.start)) / 1440 * 100}%`;
      slot.tabIndex = 0;
      slot.setAttribute('aria-label', `${event.title}, ${dateLabel(date)}, ${event.start}–${event.end}`);
      slot.title = `${event.title} · ${event.start}–${event.end}`;
      const photo = calendarView === 'day' ? eventPhoto(event.title) : null;
      if (photo) {
        slot.classList.add('has-event-photo');
        const image = document.createElement('img');
        image.className = 'calendar-event-photo';
        image.src = photo;
        image.alt = '';
        image.loading = 'lazy';
        slot.append(image);
      }
      const title = document.createElement('strong');
      title.textContent = event.title;
      const time = document.createElement('span');
      time.textContent = `${event.start}–${event.end}`;
      slot.append(title, time);
      column.append(slot);
    }
    slots.append(column);
  }
  timeline.append(slots);
  const viewport = document.createElement('div');
  viewport.className = 'calendar-agenda-viewport';
  const agenda = document.createElement('div');
  agenda.className = calendarView === 'week' ? 'calendar-agenda calendar-agenda-week' : 'calendar-agenda';
  const agendaTop = document.createElement('div');
  agendaTop.className = 'calendar-agenda-top';
  agendaTop.append(header, allDay);
  agenda.append(agendaTop, timeline);
  viewport.append(agenda);
  calendarContent.append(viewport);
}

function centerCurrentTime() {
  requestAnimationFrame(() => {
    const timeline = calendarContent.querySelector('.calendar-timeline');
    const stickyTop = calendarContent.querySelector('.calendar-agenda-top');
    if (!timeline) return;
    const now = new Date();
    const fractionOfDay = (now.getHours() * 60 + now.getMinutes()) / 1440;
    const contentTop = timeline.getBoundingClientRect().top - calendarContent.getBoundingClientRect().top + calendarContent.scrollTop;
    const pinnedHeight = stickyTop?.offsetHeight || 0;
    calendarContent.scrollTop = contentTop + timeline.offsetHeight * fractionOfDay
      - pinnedHeight - (calendarContent.clientHeight - pinnedHeight) / 2;
  });
}

for (const button of viewButtons) button.addEventListener('click', () => {
  calendarView = button.dataset.view;
  renderCalendar();
  if (calendarView !== 'month') centerCurrentTime();
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
if (calendarView !== 'month') centerCurrentTime();
// Keep the current-time marker accurate while the page stays open.
setInterval(() => { if (calendarView !== 'month') renderCalendar(); }, 60000);
