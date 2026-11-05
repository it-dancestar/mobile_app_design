// Explicit origin supports local previews without referrers; direct visits use Home.
const qualifierBack = document.querySelector('.qualifier-back');
const returnPage = new URLSearchParams(location.search).get('from');
if (['index.html', 'profile.html', 'schedule.html', 'news.html', 'live.html'].includes(returnPage)) qualifierBack.href = returnPage;
try {
  const previous = new URL(document.referrer);
  if (previous.origin === location.origin && /\/(index|profile|schedule|news|live)\.html$/.test(previous.pathname)) {
    qualifierBack.href = previous.href;
    qualifierBack.addEventListener('click', event => {
      if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      if (history.length > 1) {
        event.preventDefault();
        history.back();
      }
    });
  }
} catch { /* Retain the explicit return page or Home fallback. */ }
