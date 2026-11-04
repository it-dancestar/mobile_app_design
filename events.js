// Placeholder routines rendered with their own compact button template.
const routines = [
  { ageDivision: 'Junior', danceStyle: 'Urban styles', discipline: 'Group', title: 'Routine 1', date: 'Portugal Qualifier', accent: '#a16aff' },
  { ageDivision: 'Youth', danceStyle: 'Commercial dance', discipline: 'Formation', title: 'Routine 2', date: 'Slovakia Qualifier', accent: '#519fff' },
];

const routineTemplate = document.querySelector('#routine-button-template');
const routineList = document.querySelector('#routines-content');

for (const routine of routines) {
  const card = routineTemplate.content.firstElementChild.cloneNode(true);
  card.style.setProperty('--accent', routine.accent);
  card.querySelector('.routine-category').textContent = [routine.ageDivision, routine.danceStyle, routine.discipline].join(' · ');
  card.querySelector('.routine-title').textContent = routine.title;
  card.querySelector('.routine-date').textContent = routine.date;
  card.addEventListener('click', () => {
    if (routine.href) window.location.assign(routine.href);
    else card.dispatchEvent(new CustomEvent('event-select', { bubbles: true, detail: routine }));
  });
  routineList.append(card);
}
