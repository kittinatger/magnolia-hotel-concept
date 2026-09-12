document.getElementById('year').textContent = new Date().getFullYear();

const header = document.getElementById('siteHeader');
const onScroll = () => {
  if (window.scrollY > 40) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
};
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');
navToggle.addEventListener('click', () => {
  mainNav.classList.toggle('open');
});
mainNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => mainNav.classList.remove('open'));
});

const contactForm = document.getElementById('contactForm');
if (contactForm) {
  const formNote = document.getElementById('formNote');
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    formNote.textContent = 'Thank you — this is a demo form and does not send a real message yet.';
    contactForm.reset();
  });
}

const eventCalendar = document.getElementById('eventCalendar');
if (eventCalendar) {
  const activities = [
    'Paddle Boat', 'Fire Dance', 'Traditional Craft Booths', 'Fashion Show',
    'Traditional Cooking & Baking', 'Art: Paint, Clay & Flower Crafts',
    'Spa', 'Fishing', 'Animal Watching', 'Mini World — Landmarks of the World'
  ];
  const weekdayFmt = new Intl.DateTimeFormat('en-US', { weekday: 'short' });
  const monthFmt = new Intl.DateTimeFormat('en-US', { month: 'short' });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingWeekendDates = [];
  const cursor = new Date(today);
  // Walk forward day by day until we've collected 6 upcoming Sat/Sun dates.
  while (upcomingWeekendDates.length < 6) {
    const day = cursor.getDay();
    if (day === 0 || day === 6) {
      upcomingWeekendDates.push(new Date(cursor));
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  eventCalendar.innerHTML = upcomingWeekendDates
    .map((date, i) => `
      <div class="calendar-card">
        <span class="cal-weekday">${weekdayFmt.format(date)}</span>
        <span class="cal-day">${date.getDate()}</span>
        <span class="cal-month">${monthFmt.format(date)}</span>
        <span class="cal-activity">${activities[i % activities.length]}</span>
      </div>
    `)
    .join('');
}
