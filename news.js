const newsStories = [
  { id: 'app', title: 'Dancestar App Now Available', date: '2026-02-24', label: 'FEB 24 2026' },
  { id: 'media', title: '\uD83C\uDFA5 Videos & Media Packages Are Now Available Online!', date: '2026-05-25', label: 'MAY 25 2026' },
  { id: 'season', title: 'The New Season Starts Now! \uD83D\uDD25', date: '2026-09-28', label: 'SEP 28 2026' },
  { id: 'cape-town', title: 'Cape Town, You Were Amazing!', date: '2026-10-04', label: 'OCT 4 2026' },
];
const featuredStory = { id: 'johannesburg', title: 'Johannesburg, You Showed Your Talent! \u2728', label: 'OCT 13 2026' };
const newsList = document.querySelector('.news-list');
for (const story of newsStories) {
  const card = document.createElement('a');
  card.href = `news-${story.id}.html?from=news.html`;
  card.className = 'news-card';
  card.dataset.story = story.id;
  const art = document.createElement('span');
  art.className = 'news-card-art';
  art.setAttribute('aria-hidden', 'true');
  const content = document.createElement('span');
  content.className = 'news-card-content';
  const category = document.createElement('span');
  category.className = 'news-category';
  category.textContent = 'Main / Events';
  const title = document.createElement('strong');
  title.className = 'news-card-title';
  title.textContent = story.title;
  const footer = document.createElement('span');
  footer.className = 'news-card-footer';
  const date = document.createElement('time');
  date.dateTime = story.date;
  date.textContent = story.label;
  const read = document.createElement('span');
  read.textContent = 'Read \u2192';
  footer.append(date, read);
  content.append(category, title, footer);
  card.append(art, content);
  newsList.append(card);
}
for (const filter of document.querySelectorAll('[data-filter]')) {
  filter.addEventListener('click', () => {
    for (const button of document.querySelectorAll('[data-filter]')) button.setAttribute('aria-pressed', String(button === filter));
    // Every supplied story belongs to Main / Events, so both filters include it.
  });
}
