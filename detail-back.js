// Shared Back behavior for event and qualifier details, including local previews.
const detailBack = document.querySelector('.qualifier-back');
const pagesDirectory = new URL('.', location.href);
function appReturnUrl(value) {
  if (!value) return null;
  try {
    const url = new URL(value, location.href);
    if (url.origin !== location.origin || new URL('.', url).href !== pagesDirectory.href) return null;
    if (!/^[a-z0-9-]+\.html$/.test(url.pathname.split('/').pop()) || url.pathname === location.pathname) return null;
    return url;
  } catch { return null; }
}
const explicitReturn = appReturnUrl(new URLSearchParams(location.search).get('from'));
const previousPage = appReturnUrl(document.referrer);
const destination = explicitReturn || previousPage;
if (destination) detailBack.href = destination.href;
detailBack.addEventListener('click', event => {
  if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  if (previousPage && previousPage.href === detailBack.href && history.length > 1) {
    event.preventDefault();
    history.back();
  }
});
