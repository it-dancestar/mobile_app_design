const profileMenu = document.querySelector('.profile-menu');
const menuToggle = profileMenu.querySelector('.profile-menu-toggle');
const menuOptions = profileMenu.querySelector('.profile-menu-options');

function closeProfileMenu() {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuOptions.hidden = true;
}

menuToggle.addEventListener('click', () => {
  const opening = menuOptions.hidden;
  menuToggle.setAttribute('aria-expanded', String(opening));
  menuOptions.hidden = !opening;
});

document.addEventListener('click', (event) => {
  if (!profileMenu.contains(event.target)) closeProfileMenu();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !menuOptions.hidden) {
    closeProfileMenu();
    menuToggle.focus();
  }
});

profileMenu.addEventListener('focusout', (event) => {
  if (!profileMenu.contains(event.relatedTarget)) closeProfileMenu();
});

menuOptions.addEventListener('click', (event) => {
  const option = event.target.closest('button[data-action]');
  if (!option) return;
  closeProfileMenu();
  menuToggle.focus();
  if (option.dataset.action === 'profile-information') {
    window.location.assign('profile-information.html');
    return;
  }
  // Authentication can listen for the logout action when added.
  profileMenu.dispatchEvent(new CustomEvent(option.dataset.action, { bubbles: true }));
});
