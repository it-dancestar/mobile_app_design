// Placeholder routines rendered with their own compact button template.
const routines = [
  { ageDivision: 'Junior', danceStyle: 'Urban styles', discipline: 'Group', title: 'Routine 1', date: 'Portugal Qualifier', competition: 'portugal', href: 'event-portugal-2027-02-13-urban-styles-group-junior.html?from=profile.html' },
  { ageDivision: 'Youth', danceStyle: 'Commercial dance', discipline: 'Formation', title: 'Routine 2', date: 'Slovakia Qualifier', competition: 'slovakia', href: 'event-slovakia-2027-03-07-commercial-dance-formation-youth.html?from=profile.html' },
];

const routineTemplate = document.querySelector('#routine-button-template');
const routineList = document.querySelector('#routines-content');

for (const routine of routines) {
  const card = routineTemplate.content.firstElementChild.cloneNode(true);
  card.dataset.competition = routine.competition;
  card.querySelector('.routine-category').textContent = [routine.ageDivision, routine.danceStyle, routine.discipline].join(' · ');
  card.querySelector('.routine-title').textContent = routine.title;
  card.querySelector('.routine-date').textContent = routine.date;
  card.addEventListener('click', () => {
    if (routine.href) window.location.assign(routine.href);
    else card.dispatchEvent(new CustomEvent('event-select', { bubbles: true, detail: routine }));
  });
  routineList.append(card);
}
