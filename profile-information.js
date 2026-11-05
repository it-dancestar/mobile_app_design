const informationForm = document.querySelector('#profile-information-form');
const informationFields = informationForm.querySelector('fieldset');
const editProfile = document.querySelector('#edit-profile');
const informationActions = document.querySelector('.information-actions');
const informationStatus = informationForm.querySelector('.information-status');
let savedInformation = {};
const countryNames = new Intl.DisplayNames(['en'], { type: 'region' });
// ISO country codes keep the menu in English regardless of browser language.
const countryCodes = 'AD AE AF AG AL AM AO AR AT AU AZ BA BB BD BE BF BG BH BI BJ BN BO BR BS BT BW BY BZ CA CD CF CG CH CI CL CM CN CO CR CU CV CY CZ DE DJ DK DM DO DZ EC EE EG ER ES ET FI FJ FM FR GA GB GD GE GH GM GN GQ GR GT GW GY HN HR HT HU ID IE IL IN IQ IR IS IT JM JO JP KE KG KH KI KM KN KP KR KW KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MG MH MK ML MM MN MR MT MU MV MW MX MY MZ NA NE NG NI NL NO NP NR NZ OM PA PE PG PH PK PL PT PW PY QA RO RS RU RW SA SB SC SD SE SG SI SK SL SM SN SO SR SS ST SV SY SZ TD TG TH TJ TL TM TN TO TR TT TV TW TZ UA UG US UY UZ VA VC VE VN VU WS YE ZA ZM ZW'.split(' ');
const countries = countryCodes.map(code => countryNames.of(code)).sort();
const countryInput = informationForm.elements.country;
const countryOptions = document.querySelector('#country-options');
function filterCountries() {
  countryOptions.replaceChildren();
  const prefix = countryInput.value.trim().toLowerCase();
  for (const country of countries.filter(name => name.toLowerCase().startsWith(prefix))) {
    const option = document.createElement('option');
    option.value = country;
    countryOptions.append(option);
  }
  countryInput.setCustomValidity(!prefix || countries.some(name => name.toLowerCase() === prefix) ? '' : 'Choose a country from the list.');
}
countryInput.addEventListener('input', filterCountries);
countryInput.addEventListener('focus', filterCountries);
const phoneInput = informationForm.elements.phone;
phoneInput.addEventListener('input', () => { phoneInput.value = phoneInput.value.replace(/\D/g, ''); });
const birthInput = informationForm.elements.dateOfBirth;
function validateBirthDate() {
  const parts = birthInput.value.split('/').map(Number);
  const [day, month, year] = parts;
  const date = new Date(year, month - 1, day);
  const valid = /^\d{2}\/\d{2}\/\d{4}$/.test(birthInput.value) && year >= 1900 && date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day && date <= new Date();
  birthInput.setCustomValidity(!birthInput.value || valid ? '' : 'Enter a valid birth date as DD/MM/YYYY.');
}
birthInput.addEventListener('input', () => {
  const digits = birthInput.value.replace(/\D/g, '').slice(0, 8);
  birthInput.value = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4)].filter(Boolean).join('/');
  validateBirthDate();
});
try {
  savedInformation = JSON.parse(localStorage.getItem('dancestar-profile') || '{}') || {};
} catch { /* Keep defaults when browser storage is unavailable. */ }

for (const field of informationFields.elements) {
  if (typeof savedInformation[field.name] === 'string') field.value = savedInformation[field.name];
  if (field.name === 'dateOfBirth' && /^\d{4}-\d{2}-\d{2}$/.test(field.value)) field.value = field.value.split('-').reverse().join('/');
  field.defaultValue = field.value;
}

// Mock verification flags; changing contact details requires verification again.
let contactVerification = {
  email: savedInformation.verification?.email !== false,
  phone: savedInformation.verification?.phone !== false,
};
let originalContactValues = {};
function renderVerification() {
  for (const name of ['email', 'phone']) {
    const flag = document.querySelector(`[data-verification="${name}"]`);
    flag.textContent = contactVerification[name] ? 'Verified' : 'Unverified';
    flag.dataset.verified = String(contactVerification[name]);
  }
}
for (const name of ['email', 'phone']) {
  informationForm.elements[name].addEventListener('input', () => {
    if (informationForm.elements[name].value !== originalContactValues[name]) {
      contactVerification[name] = false;
      renderVerification();
    }
  });
}
renderVerification();

function finishEditing() {
  informationFields.disabled = true;
  informationActions.hidden = true;
  editProfile.hidden = false;
  editProfile.focus();
}
editProfile.addEventListener('click', () => {
  originalContactValues = { email: informationForm.elements.email.value, phone: informationForm.elements.phone.value };
  informationFields.disabled = false;
  informationActions.hidden = false;
  editProfile.hidden = true;
  informationStatus.textContent = '';
  informationForm.elements.email.focus();
});
informationForm.addEventListener('submit', event => {
  event.preventDefault();
  // Preserve locked profile values; only contact details can be changed here.
  savedInformation = {
    ...savedInformation,
    email: informationForm.elements.email.value,
    phone: informationForm.elements.phone.value,
    country: informationForm.elements.country.value,
    verification: { ...contactVerification },
  };
  try {
    localStorage.setItem('dancestar-profile', JSON.stringify(savedInformation));
    informationStatus.textContent = '';
  } catch {
    informationStatus.textContent = 'Changes applied for this visit. Browser storage is unavailable.';
  }
  finishEditing();
});
informationActions.querySelector('.information-cancel').addEventListener('click', () => {
  contactVerification = {
    email: savedInformation.verification?.email !== false,
    phone: savedInformation.verification?.phone !== false,
  };
  renderVerification();
  for (const field of informationFields.elements) field.value = savedInformation[field.name] ?? field.defaultValue;
  for (const field of informationFields.elements) field.setCustomValidity('');
  finishEditing();
});
