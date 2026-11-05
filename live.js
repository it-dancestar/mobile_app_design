// Live-tab mockup content from the supplied references.
const liveEvents = [
  { id: 'opening', title: 'Opening ceremony', category: 'Special event · WDM 2026', date: 'Tue, 12 May · 21:30', color: '#9259f7', photoY: 320 },
  { id: 'battle-qualifier', title: 'Battle qualifier', category: 'Open style battle · WDM 2026', date: 'Wed, 13 May · 12:00 - 15:30', color: '#ff7918', photoY: 650 },
  { id: 'beach-party', title: 'Beach party', category: 'Social · WDM 2026', date: 'Wed, 13 May · 21:00', color: '#21c7dd', photoY: 980 },
  { id: 'battle', title: 'The battle', category: 'Open style battle · WDM 2026', date: 'Thu, 14 May · 21:00', color: '#ff7918', photoY: 1310 },
  { id: 'junior-gala', title: 'Junior gala night', category: 'Special event · WDM 2026', date: 'Fri, 15 May · 21:00', color: '#d5b22d', photoY: 1640 },
  { id: 'senior-gala', title: 'Senior gala night', category: 'Special event · WDM 2026', date: 'Sat, 16 May · 21:30', color: '#d5b22d', photoY: 1970 },
];
const liveQualifiers = [
  { id: 'slovenia', title: 'Slovenia Qualifier', photoY: 433 },
  { id: 'cape-town', title: 'Cape Town Qualifier', photoY: 763, ended: true },
  { id: 'johannesburg', title: 'Johannesburg Qualifier', photoY: 1093, ended: true },
  { id: 'slovakia', title: 'Slovakia Qualifier', photoY: 1423 },
  { id: 'portugal', title: 'Portugal Qualifier', photoY: 1753 },
  { id: 'germany', title: 'Germany Qualifier', photoY: 2083 },
];
function liveCard(item, qualifier = false) {
  const card = document.createElement('a');
  card.className = 'live-card';
  card.href = qualifier ? `${item.id}-qualifier.html?from=live.html` : `live-event-${item.id}.html?from=live.html`;
  card.style.setProperty('--live-accent', item.color || '#fa4447');
  const art = document.createElement('span');
  art.className = `live-card-art ${qualifier ? 'live-qualifier-art' : 'live-event-art'}`;
  art.style.setProperty('--photo-y', `${item.photoY / (2556 - 300) * 100}%`);
  art.setAttribute('aria-hidden', 'true');
  const content = document.createElement('span');
  content.className = 'live-card-content';
  const category = document.createElement('span');
  category.className = 'live-card-category';
  category.textContent = item.category || 'Qualifiers · World Tour 2027';
  const title = document.createElement('strong');
  title.className = 'live-card-title';
  title.textContent = item.title;
  content.append(category, title);
  if (item.date) {
    const date = document.createElement('span');
    date.className = 'live-card-date';
    date.textContent = item.date;
    content.append(date);
  }
  card.append(art, content);
  if (!qualifier || item.ended) {
    const status = document.createElement('span');
    status.className = 'live-card-status';
    status.textContent = 'Ended';
    card.append(status);
  }
  return card;
}
const endedList = document.querySelector('.live-ended-list');
for (const event of liveEvents) endedList.append(liveCard(event));
for (const qualifier of liveQualifiers) {
  const list = qualifier.ended ? endedList : document.querySelector('.live-qualifier-list');
  list.append(liveCard(qualifier, true));
}
