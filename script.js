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

const eventModal = document.getElementById('eventModal');
const eventInfo = {};
if (eventModal) {
  const modalEyebrow = document.getElementById('eventModalEyebrow');
  const modalTitle = document.getElementById('eventModalTitle');
  const modalBody = document.getElementById('eventModalBody');
  let lastFocused = null;

  // body can be a plain string (rendered as one paragraph) or an
  // array of strings (rendered as a bullet list) — covers both the
  // one-line event descriptions and the season/room detail lists.
  const openInfoModal = (eyebrow, title, body) => {
    modalEyebrow.textContent = eyebrow || '';
    modalTitle.textContent = title;
    modalBody.innerHTML = '';
    if (Array.isArray(body)) {
      const ul = document.createElement('ul');
      ul.className = 'event-modal-list';
      body.forEach((line) => {
        const li = document.createElement('li');
        li.textContent = line;
        ul.appendChild(li);
      });
      modalBody.appendChild(ul);
    } else {
      const p = document.createElement('p');
      p.textContent = body || '';
      modalBody.appendChild(p);
    }
    lastFocused = document.activeElement;
    eventModal.classList.add('open');
    eventModal.setAttribute('aria-hidden', 'false');
    eventModal.querySelector('.event-modal-close').focus();
  };

  const closeEventModal = () => {
    eventModal.classList.remove('open');
    eventModal.setAttribute('aria-hidden', 'true');
    if (lastFocused) lastFocused.focus();
  };

  eventModal.addEventListener('click', (e) => {
    if (e.target.hasAttribute('data-close')) closeEventModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && eventModal.classList.contains('open')) closeEventModal();
  });

  document.querySelectorAll('.event-pill[data-event]').forEach((pill) => {
    const name = pill.dataset.event;
    const desc = pill.dataset.desc;
    eventInfo[name] = desc;
    pill.addEventListener('click', () => openInfoModal('Weekend Event', name, desc));
  });

  document.querySelectorAll('.season-card').forEach((card) => {
    const title = card.querySelector('h3').textContent;
    const months = card.querySelector('.season-months').textContent;
    const items = Array.from(card.querySelectorAll('li')).map((li) => li.textContent);
    card.addEventListener('click', () => openInfoModal(`Season · ${months}`, title, items));
  });

  document.querySelectorAll('.room-card').forEach((card) => {
    const title = card.querySelector('h3').textContent;
    const tag = card.querySelector('.room-tag').textContent;
    const size = card.querySelector('.room-size').textContent;
    const desc = card.querySelector('.room-body > p:last-child').textContent;
    const note = 'Available in all four wings — South, East, North & West — each priced individually.';
    card.addEventListener('click', () => openInfoModal(tag, title, `${size}\n\n${desc}\n\n${note}`));
  });

  const buildingNarratives = {
    South: "Step through the South Wing's carved lattice screens and the air changes — warmer, greener, closer to the coast. This is Magnolia's tribute to the beach towns and river deltas of Southeast Asia: open-air walkways, dark tropical hardwoods, and gardens that spill right up to the windows.\n\nRooms open onto private courtyards planted with ferns and flowering shrubs, echoing the region's love of bringing the outdoors in. Woven rattan, batik-inspired textiles, and soft brass fixtures carry the palette through every suite, while a rain-shower bathroom nods to the monsoon season the region is built around.\n\nIn the evenings, the wing's ground-floor terrace becomes an informal night market corner during weekend shows — the closest thing on the property to a street food lane in Bangkok or Hoi An, minus the flight.",
    East: "The East Wing slows you down on purpose. Clean timber lines, paper-soft light through shoji-style screens, and long sightlines toward the garden borrow from a design language built around stillness — the kind found in a tea room or a temple courtyard.\n\nInteriors favor restraint over ornament: a single ceramic vessel, a low platform bed, a window framed like a piece of art. Materials are natural and honest — unlacquered wood, stone, washi-textured paper — chosen to age quietly rather than demand attention.\n\nIt's the wing guests return to for the seasonal rituals Magnolia is built around: watching the first snow settle over the pines, or the blueberry bushes ripen in summer, from a room designed to make watching feel like the whole point.",
    North: "The North Wing is built for the mountain — thick felted textiles, deep saturated color, and a hearth-forward layout that makes every room feel like it's facing a fire even when it isn't. It draws on the nomadic craft traditions of North and Central Asia: hand-knotted rugs, embroidered wool, carved wooden furniture with real weight to it.\n\nThis is the wing that leans hardest into Magnolia's winter identity. Rooms are oriented toward the Gunflint Trail views, with boot rooms and gear storage built in rather than bolted on, so the transition from a day of skiing or ice fishing to a warm room is as short as possible.\n\nColor does the work other wings leave to texture — rust, ochre, and deep indigo against pale plaster walls, a palette meant to hold its own against a snow-white world outside the window.",
    West: "The West Wing carries the pattern language of the old spice routes — hand-blocked textiles, geometric tilework underfoot, and archways that turn every hallway into a small procession. It's the most ornamented of Magnolia's four wings, built on the idea that beauty can be structural, not just decorative.\n\nDeep jewel tones sit against whitewashed walls, and courtyard-facing rooms use latticed screens to filter light into shifting geometric patterns through the day — a nod to the region's long history of turning climate control into art.\n\nIn the evenings, the wing's covered walkway is where the weekend market's textile and spice-inspired craft booths tend to gather, keeping the wing's spirit alive outside its own walls."
  };

  document.querySelectorAll('.building-card').forEach((card) => {
    const title = card.querySelector('h3').textContent;
    const narrative = buildingNarratives[title];
    if (!narrative) return;
    card.addEventListener('click', () => openInfoModal('Wing', title, narrative));
  });

  // Expose so the calendar (built below) can reuse the same modal.
  window.__openEventModal = (name, desc) => openInfoModal('Weekend Event', name, desc);
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
  const monthLabelFmt = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Collect every upcoming Saturday/Sunday for the next ~4 months so
  // guests can plan that far ahead. Always computed from "today", so
  // this list is never stale no matter when the page loads.
  const horizonEnd = new Date(today);
  horizonEnd.setMonth(horizonEnd.getMonth() + 4);

  const upcomingWeekendDates = [];
  const cursor = new Date(today);
  while (cursor < horizonEnd) {
    const day = cursor.getDay();
    if (day === 0 || day === 6) {
      upcomingWeekendDates.push(new Date(cursor));
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  // Group into month sections so the calendar reads as a scannable
  // list rather than one giant scrolling row.
  const monthGroups = [];
  upcomingWeekendDates.forEach((date, i) => {
    const label = monthLabelFmt.format(date);
    let group = monthGroups.find((g) => g.label === label);
    if (!group) {
      group = { label, dates: [] };
      monthGroups.push(group);
    }
    group.dates.push({ date, activity: activities[i % activities.length] });
  });

  const monthHtml = (group, hidden) => `
    <div class="calendar-month${hidden ? ' calendar-extra' : ''}"${hidden ? ' hidden' : ''}>
      <p class="calendar-month-label">${group.label}</p>
      <div class="calendar-strip">
        ${group.dates
          .map(
            ({ date, activity }) => `
              <button type="button" class="calendar-card" data-event="${activity}" data-date="${weekdayFmt.format(date)} ${monthFmt.format(date)} ${date.getDate()}">
                <span class="cal-weekday">${weekdayFmt.format(date)}</span>
                <span class="cal-day">${date.getDate()}</span>
                <span class="cal-month">${monthFmt.format(date)}</span>
                <span class="cal-activity">${activity}</span>
              </button>
            `
          )
          .join('')}
      </div>
    </div>
  `;

  // Start collapsed to just the first month; the rest expand on demand.
  const monthsHtml = monthGroups
    .map((group, i) => monthHtml(group, i > 0))
    .join('');

  const hasMore = monthGroups.length > 1;
  const toggleHtml = hasMore
    ? `<button type="button" class="btn btn-ghost calendar-toggle" id="calendarToggle">View More Weekends</button>`
    : '';

  eventCalendar.innerHTML = `<div class="calendar-months">${monthsHtml}</div>${toggleHtml}`;

  eventCalendar.querySelectorAll('.calendar-card[data-event]').forEach((card) => {
    card.addEventListener('click', () => {
      const name = card.dataset.event;
      const desc = eventInfo[name] || '';
      const date = card.dataset.date;
      if (window.__openEventModal) {
        window.__openEventModal(name, date ? `${date} — ${desc}` : desc);
      }
    });
  });

  const calendarToggle = document.getElementById('calendarToggle');
  if (calendarToggle) {
    calendarToggle.addEventListener('click', () => {
      const expanded = eventCalendar.classList.toggle('calendar-expanded');
      eventCalendar.querySelectorAll('.calendar-extra').forEach((el) => {
        el.hidden = !expanded;
      });
      calendarToggle.textContent = expanded ? 'View Fewer Weekends' : 'View More Weekends';
    });
  }
}
