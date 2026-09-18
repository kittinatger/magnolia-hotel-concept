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
  const contactCheckin = document.getElementById('contactCheckin');
  const contactCheckout = document.getElementById('contactCheckout');
  const today = new Date().toISOString().split('T')[0];
  contactCheckin.min = today;
  contactCheckout.min = today;
  contactCheckin.addEventListener('change', () => {
    if (!contactCheckin.value) return;
    const nextDay = new Date(contactCheckin.value);
    nextDay.setDate(nextDay.getDate() + 1);
    contactCheckout.min = nextDay.toISOString().split('T')[0];
    if (contactCheckout.value && contactCheckout.value <= contactCheckin.value) {
      contactCheckout.value = contactCheckout.min;
    }
  });

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    formNote.textContent = 'Thank you — this is a demo reservation request and hasn’t been sent. Our team will follow up by email once bookings go live.';
    contactForm.reset();
  });
}

const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
  const newsletterNote = document.getElementById('newsletterNote');
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    newsletterNote.textContent = 'Thanks for your interest — this is a demo, so no email was sent.';
    newsletterForm.reset();
  });
}

const eventModal = document.getElementById('eventModal');
const eventInfo = {};
if (eventModal) {
  const modalIcon = document.getElementById('eventModalIcon');
  const modalEyebrow = document.getElementById('eventModalEyebrow');
  const modalTitle = document.getElementById('eventModalTitle');
  const modalBody = document.getElementById('eventModalBody');
  let lastFocused = null;

  // body is an array of segments: a string renders as a paragraph,
  // a nested array renders as a bullet list — lets a single modal
  // mix narrative paragraphs with a detail list in any order.
  // icon is an optional inline SVG string shown above the eyebrow.
  const openInfoModal = (eyebrow, title, body, icon) => {
    modalIcon.innerHTML = icon || '';
    modalIcon.classList.toggle('visible', Boolean(icon));
    modalEyebrow.textContent = eyebrow || '';
    modalTitle.textContent = title;
    modalBody.innerHTML = '';
    const segments = Array.isArray(body) ? body : [body];
    segments.forEach((segment) => {
      if (Array.isArray(segment)) {
        const ul = document.createElement('ul');
        ul.className = 'event-modal-list';
        segment.forEach((line) => {
          const li = document.createElement('li');
          li.textContent = line;
          ul.appendChild(li);
        });
        modalBody.appendChild(ul);
      } else if (segment) {
        const p = document.createElement('p');
        p.textContent = segment;
        modalBody.appendChild(p);
      }
    });
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
    const detail = pill.dataset.detail;
    const facts = (pill.dataset.facts || '').split('|').filter(Boolean);
    eventInfo[name] = detail ? `${desc} ${detail}` : desc;
    pill.addEventListener('click', () => openInfoModal('Weekend Event', name, [desc, detail, facts]));
  });

  // The full event list has grown long — show just the first row or
  // two by default and let guests expand to see the rest.
  const eventsGrid = document.querySelector('.events-grid');
  if (eventsGrid) {
    const pills = Array.from(eventsGrid.querySelectorAll('.event-pill'));
    const visibleCount = 8;
    if (pills.length > visibleCount) {
      pills.forEach((pill, i) => {
        if (i >= visibleCount) {
          pill.classList.add('event-pill-extra');
          pill.hidden = true;
        }
      });

      const eventsToggle = document.createElement('button');
      eventsToggle.type = 'button';
      eventsToggle.className = 'btn btn-ghost events-toggle';
      eventsToggle.textContent = 'View More Events';
      eventsGrid.insertAdjacentElement('afterend', eventsToggle);

      eventsToggle.addEventListener('click', () => {
        const expanded = eventsToggle.classList.toggle('expanded');
        pills.forEach((pill, i) => {
          if (i >= visibleCount) pill.hidden = !expanded;
        });
        eventsToggle.textContent = expanded ? 'View Fewer Events' : 'View More Events';
        if (!expanded) {
          eventsToggle.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    }
  }

  const bookableGrounds = {
    'Spa': { cta: 'Reserve a Spa Treatment', countLabel: 'Guests' },
    'Restaurant': { cta: 'Reserve a Table', countLabel: 'Guests' },
    'Indoor Activity Hall': { cta: 'Reserve Activity Hall Time', countLabel: 'Guests' },
    'Art Gallery': { cta: 'Reserve a Gallery Visit', countLabel: 'Guests' },
    'Pool, Sauna & Onsen': { cta: 'Reserve Pool & Onsen Time', countLabel: 'Guests' },
    'Grounds & Parking': { cta: 'Reserve Parking', countLabel: 'Vehicles' }
  };

  const appendBookingForm = (title) => {
    const booking = bookableGrounds[title];
    if (!booking) return;

    modalBody.appendChild(document.createElement('hr')).className = 'modal-divider';

    const wrap = document.createElement('div');
    wrap.className = 'booking-form-wrap';
    wrap.innerHTML = `
      <p class="booking-form-label">${booking.cta}</p>
      <form class="booking-form">
        <label>Name<input type="text" name="name" required></label>
        <label>Email<input type="email" name="email" required></label>
        <label>Preferred Date<input type="date" name="date" required></label>
        <label>${booking.countLabel}<input type="number" name="count" min="1" value="1" required></label>
        <button type="submit" class="btn btn-primary">${booking.cta}</button>
        <p class="booking-note"></p>
      </form>
    `;
    modalBody.appendChild(wrap);

    const dateInput = wrap.querySelector('input[name="date"]');
    dateInput.min = new Date().toISOString().split('T')[0];

    const form = wrap.querySelector('form');
    const note = wrap.querySelector('.booking-note');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      note.textContent = 'Thank you — this is a demo reservation and hasn’t been sent. Our team will follow up by email once bookings go live.';
      form.reset();
    });
  };

  const groundIcons = {
    'Flower Garden Atrium': `<svg viewBox="0 0 220 220">
      <circle class="ill-halo" cx="110" cy="108" r="62"/>
      <circle class="ill-line-soft" cx="110" cy="108" r="46"/>
      <g class="ill-line-soft">
        <path d="M110,58 C116,50 116,40 110,34 C104,40 104,50 110,58 Z"/>
        <path d="M160,108 C168,102 178,102 184,108 C178,114 168,114 160,108 Z"/>
        <path d="M110,158 C116,166 116,176 110,182 C104,176 104,166 110,158 Z"/>
        <path d="M60,108 C52,102 42,102 36,108 C42,114 52,114 60,108 Z"/>
      </g>
      <g class="ill-line" transform="translate(110 108) scale(0.52)">
        <path d="M0,-92 C34,-70 40,-24 0,4 C-40,-24 -34,-70 0,-92 Z"/>
        <path d="M0,-92 C34,-70 40,-24 0,4 C-40,-24 -34,-70 0,-92 Z" transform="rotate(72)"/>
        <path d="M0,-92 C34,-70 40,-24 0,4 C-40,-24 -34,-70 0,-92 Z" transform="rotate(144)"/>
        <path d="M0,-92 C34,-70 40,-24 0,4 C-40,-24 -34,-70 0,-92 Z" transform="rotate(216)"/>
        <path d="M0,-92 C34,-70 40,-24 0,4 C-40,-24 -34,-70 0,-92 Z" transform="rotate(288)"/>
      </g>
      <circle class="ill-accent" cx="110" cy="108" r="7"/>
      <ellipse class="ill-mound" cx="110" cy="188" rx="54" ry="9"/>
    </svg>`,
    'Restaurant': `<svg viewBox="0 0 220 220">
      <circle class="ill-halo" cx="110" cy="90" r="58"/>
      <g class="ill-line-soft">
        <path d="M100,66 C95,58 103,52 99,42"/>
        <path d="M118,64 C113,56 121,50 117,40"/>
      </g>
      <rect class="ill-line-soft" x="52" y="118" width="116" height="56" rx="10"/>
      <circle class="ill-line" cx="110" cy="132" r="36"/>
      <circle class="ill-line-soft" cx="110" cy="132" r="23"/>
      <g class="ill-line">
        <line x1="64" y1="100" x2="64" y2="156"/>
        <line x1="58" y1="100" x2="58" y2="118"/>
        <line x1="64" y1="100" x2="64" y2="118"/>
        <line x1="70" y1="100" x2="70" y2="118"/>
        <path d="M156,100 C164,104 164,116 156,120 L156,156"/>
      </g>
      <path class="ill-accent" d="M132,120 C138,114 148,114 152,120 C148,126 138,126 132,120 Z"/>
    </svg>`,
    'Spa': `<svg viewBox="0 0 220 220">
      <circle class="ill-halo" cx="110" cy="88" r="58"/>
      <g class="ill-line-soft">
        <path d="M92,62 C86,52 96,44 92,32"/>
        <path d="M110,60 C104,48 116,40 110,26"/>
        <path d="M128,62 C122,52 132,44 128,32"/>
      </g>
      <g class="ill-line">
        <ellipse cx="110" cy="150" rx="40" ry="13"/>
        <ellipse cx="110" cy="131" rx="30" ry="11"/>
        <ellipse cx="110" cy="114" rx="21" ry="9"/>
      </g>
      <g class="ill-line">
        <path d="M150,142 C158,134 158,122 150,116 C146,126 146,136 150,142 Z"/>
        <path d="M164,148 C172,142 172,132 164,126 C160,134 160,142 164,148 Z"/>
      </g>
      <g class="ill-line-soft">
        <ellipse cx="110" cy="168" rx="56" ry="8"/>
        <ellipse cx="110" cy="180" rx="70" ry="8"/>
      </g>
    </svg>`,
    'Art Gallery': `<svg viewBox="0 0 220 220">
      <circle class="ill-halo" cx="110" cy="92" r="58"/>
      <path class="ill-line-soft" d="M30,58 L190,58"/>
      <line class="ill-line-soft" x1="96" y1="58" x2="96" y2="46"/>
      <line class="ill-line-soft" x1="154" y1="58" x2="154" y2="46"/>
      <rect class="ill-solid" x="58" y="58" width="76" height="62" rx="2"/>
      <circle class="ill-accent" cx="118" cy="72" r="5"/>
      <path class="ill-line" d="M68,112 L86,88 L100,104 L112,80 L124,112 Z"/>
      <rect class="ill-solid" x="146" y="70" width="40" height="50" rx="2"/>
      <path class="ill-line" d="M152,110 L166,92 L180,110 Z"/>
      <path class="ill-line-soft" d="M20,164 L200,164"/>
      <path class="ill-line" d="M40,164 C40,150 52,144 52,132 C56,144 64,150 64,164"/>
    </svg>`,
    'Indoor Activity Hall': `<svg viewBox="0 0 220 220">
      <circle class="ill-halo" cx="110" cy="90" r="58"/>
      <path class="ill-solid" d="M64,132 C54,112 60,86 84,78 C112,68 142,82 144,108 C146,128 130,140 112,134 C116,144 108,154 96,150 C90,148 88,140 92,134 C76,140 68,140 64,132 Z"/>
      <g class="ill-accent">
        <circle cx="88" cy="100" r="6"/>
        <circle cx="112" cy="96" r="6"/>
        <circle cx="128" cy="112" r="6"/>
      </g>
      <g class="ill-line">
        <path d="M144,72 L168,42"/>
        <path d="M162,36 C168,32 176,36 174,44 C172,50 164,52 160,46 Z"/>
        <path d="M158,86 L184,66"/>
        <path d="M178,60 C184,57 190,62 187,68 C185,73 178,74 175,69 Z"/>
      </g>
      <g class="ill-line-soft">
        <circle cx="52" cy="158" r="16"/>
        <path d="M40,150 C48,154 56,154 64,150"/>
        <path d="M40,166 C48,162 56,162 64,166"/>
        <line x1="60" y1="146" x2="76" y2="132"/>
      </g>
      <path class="ill-line-soft" d="M20,182 L200,182"/>
    </svg>`,
    'Market — Booths & Stalls': `<svg viewBox="0 0 220 220">
      <circle class="ill-halo" cx="110" cy="84" r="58"/>
      <path class="ill-solid" d="M46,90 L110,56 L174,90 L164,95 C154,84 132,84 122,95 C112,84 108,84 98,95 C88,84 66,84 56,95 Z"/>
      <path class="ill-accent" d="M96,95 L96,112 L106,106 L116,112 L116,95 Z"/>
      <g class="ill-line">
        <line x1="62" y1="93" x2="62" y2="162"/>
        <line x1="158" y1="93" x2="158" y2="162"/>
      </g>
      <path class="ill-line" d="M62,126 L158,126"/>
      <g class="ill-line">
        <ellipse cx="86" cy="116" rx="9" ry="7"/>
        <ellipse cx="106" cy="118" rx="8" ry="6"/>
        <ellipse cx="126" cy="115" rx="9" ry="7"/>
      </g>
      <path class="ill-line-soft" d="M30,162 L190,162"/>
    </svg>`,
    'Pool, Sauna & Onsen': `<svg viewBox="0 0 220 220">
      <circle class="ill-halo" cx="110" cy="82" r="58"/>
      <g class="ill-line-soft">
        <path d="M92,56 C86,46 96,38 92,26"/>
        <path d="M128,56 C122,46 132,38 128,26"/>
      </g>
      <path class="ill-mound" d="M40,140 C60,128 80,148 100,136 C120,124 140,144 160,132 C170,128 175,130 180,128 L180,182 L40,182 Z"/>
      <path class="ill-line" d="M40,140 C60,128 80,148 100,136 C120,124 140,144 160,132 C170,128 175,130 180,128"/>
      <g class="ill-line">
        <ellipse cx="52" cy="150" rx="9" ry="6"/>
        <ellipse cx="66" cy="158" rx="7" ry="5"/>
        <ellipse cx="168" cy="150" rx="9" ry="6"/>
        <ellipse cx="154" cy="158" rx="7" ry="5"/>
      </g>
      <g class="ill-line">
        <line x1="186" y1="112" x2="186" y2="150"/>
        <rect x="178" y="120" width="16" height="18" rx="2"/>
      </g>
    </svg>`,
    'Grounds & Parking': `<svg viewBox="0 0 220 220">
      <circle class="ill-halo" cx="110" cy="84" r="58"/>
      <g class="ill-line-soft">
        <line x1="156" y1="150" x2="156" y2="122"/>
        <path d="M156,122 C144,122 138,112 144,102 C140,92 152,84 162,90 C166,82 178,82 180,90 C188,86 196,94 190,102 C196,106 194,116 184,118 C182,120 168,120 156,122 Z"/>
      </g>
      <g class="ill-line">
        <line x1="68" y1="150" x2="68" y2="96"/>
        <path d="M68,96 C48,96 40,80 50,64 C44,50 60,38 74,46 C80,34 98,34 102,48 C116,42 128,56 120,70 C130,76 126,92 112,94 C108,98 88,98 84,96 C80,100 72,100 68,96 Z"/>
      </g>
      <path class="ill-line-soft" d="M20,188 C60,174 100,196 140,182 C160,176 180,184 200,178"/>
      <g class="ill-line" transform="translate(112 168)">
        <path d="M-24,10 L-20,-6 C-18,-13 16,-13 18,-6 L22,10 Z"/>
        <circle cx="-14" cy="10" r="5"/>
        <circle cx="12" cy="10" r="5"/>
      </g>
      <ellipse class="ill-mound" cx="112" cy="184" rx="36" ry="6"/>
      <g class="ill-line">
        <line x1="188" y1="150" x2="188" y2="188"/>
        <rect x="176" y="126" width="24" height="24" rx="2"/>
      </g>
    </svg>`
  };
  document.querySelectorAll('.ground-item[data-desc]').forEach((item) => {
    const title = item.querySelector('h3').textContent;
    const desc = item.dataset.desc;
    const detail = item.dataset.detail;
    const facts = (item.dataset.facts || '').split('|').filter(Boolean);
    item.addEventListener('click', () => {
      openInfoModal('The Grounds', title, [desc, detail, facts], groundIcons[title]);
      appendBookingForm(title);
    });
  });

  const sustainIcons = {
    'Solar Power': `<svg viewBox="0 0 220 220">
      <circle class="ill-halo" cx="110" cy="86" r="62"/>
      <g class="ill-line-soft">
        <line x1="110" y1="12" x2="110" y2="28"/>
        <line x1="68" y1="24" x2="78" y2="36"/>
        <line x1="152" y1="24" x2="142" y2="36"/>
      </g>
      <path class="ill-solid" d="M50,150 L110,88 L170,150 Z"/>
      <g class="ill-line">
        <line x1="70" y1="150" x2="90" y2="108"/>
        <line x1="90" y1="150" x2="103" y2="108"/>
        <line x1="110" y1="150" x2="110" y2="108"/>
        <line x1="130" y1="150" x2="117" y2="108"/>
        <line x1="150" y1="150" x2="130" y2="108"/>
        <line x1="60" y1="129" x2="160" y2="129"/>
      </g>
      <path class="ill-line-soft" d="M30,180 C60,170 90,186 120,176 C150,166 180,182 210,174"/>
    </svg>`,
    'Water Conservation': `<svg viewBox="0 0 220 220">
      <circle class="ill-halo" cx="110" cy="80" r="60"/>
      <path class="ill-solid" d="M70,90 C56,90 48,78 58,68 C54,54 74,46 86,56 C92,44 116,44 122,58 C138,52 152,66 142,78 C152,84 146,98 132,98 L76,98 C62,98 60,92 70,90 Z"/>
      <g class="ill-line">
        <path d="M84,112 C84,120 76,126 76,134 C76,140 82,144 86,140 C90,144 96,140 96,134 C96,126 88,120 88,112 Z"/>
        <path d="M124,118 C124,126 116,132 116,140 C116,146 122,150 126,146 C130,150 136,146 136,140 C136,132 128,126 128,118 Z"/>
      </g>
      <path class="ill-line-soft" d="M30,182 C60,172 90,188 120,178 C150,168 180,184 210,176"/>
    </svg>`,
    'Native Landscaping': `<svg viewBox="0 0 220 220">
      <circle class="ill-halo" cx="110" cy="70" r="58"/>
      <path class="ill-mound" d="M10,190 C50,172 90,196 130,180 C160,168 190,182 210,174 L210,220 L10,220 Z"/>
      <g class="ill-line" transform="translate(80 150) scale(0.55)">
        <path d="M0,-92 C34,-70 40,-24 0,4 C-40,-24 -34,-70 0,-92 Z"/>
        <path d="M0,-92 C34,-70 40,-24 0,4 C-40,-24 -34,-70 0,-92 Z" transform="rotate(72)"/>
        <path d="M0,-92 C34,-70 40,-24 0,4 C-40,-24 -34,-70 0,-92 Z" transform="rotate(144)"/>
        <path d="M0,-92 C34,-70 40,-24 0,4 C-40,-24 -34,-70 0,-92 Z" transform="rotate(216)"/>
        <path d="M0,-92 C34,-70 40,-24 0,4 C-40,-24 -34,-70 0,-92 Z" transform="rotate(288)"/>
      </g>
      <circle class="ill-accent" cx="80" cy="150" r="9"/>
      <g class="ill-line" transform="translate(142 172) scale(0.32)">
        <path d="M0,-92 C34,-70 40,-24 0,4 C-40,-24 -34,-70 0,-92 Z"/>
        <path d="M0,-92 C34,-70 40,-24 0,4 C-40,-24 -34,-70 0,-92 Z" transform="rotate(72)"/>
        <path d="M0,-92 C34,-70 40,-24 0,4 C-40,-24 -34,-70 0,-92 Z" transform="rotate(144)"/>
        <path d="M0,-92 C34,-70 40,-24 0,4 C-40,-24 -34,-70 0,-92 Z" transform="rotate(216)"/>
        <path d="M0,-92 C34,-70 40,-24 0,4 C-40,-24 -34,-70 0,-92 Z" transform="rotate(288)"/>
      </g>
      <circle class="ill-accent" cx="142" cy="172" r="5"/>
      <g class="ill-line">
        <ellipse cx="163" cy="112" rx="14" ry="9" transform="rotate(-30 163 112)"/>
        <ellipse cx="179" cy="122" rx="14" ry="9" transform="rotate(30 179 122)"/>
        <line x1="171" y1="117" x2="171" y2="124"/>
      </g>
    </svg>`,
    'Locally Sourced': `<svg viewBox="0 0 220 220">
      <circle class="ill-halo" cx="110" cy="86" r="58"/>
      <path class="ill-solid" d="M58,118 L162,118 L148,188 L72,188 Z"/>
      <path class="ill-line-soft" d="M72,118 C72,90 148,90 148,118"/>
      <g class="ill-line">
        <circle cx="96" cy="108" r="14"/>
        <line x1="96" y1="98" x2="96" y2="118"/>
        <line x1="88" y1="106" x2="104" y2="110"/>
      </g>
      <path class="ill-line" d="M122,110 C122,96 136,88 150,92 C148,104 136,112 122,110 Z"/>
      <path class="ill-line" d="M78,108 C78,96 68,88 56,90 C56,100 66,108 78,108 Z"/>
    </svg>`
  };
  document.querySelectorAll('.sustain-item[data-desc]').forEach((item) => {
    const title = item.querySelector('h3').textContent;
    const desc = item.dataset.desc;
    const detail = item.dataset.detail;
    const facts = (item.dataset.facts || '').split('|').filter(Boolean);
    item.addEventListener('click', () => openInfoModal('Sustainability', title, [desc, detail, facts], sustainIcons[title]));
  });

  document.querySelectorAll('.activity-item[data-desc]').forEach((item) => {
    const title = item.querySelector('h4').textContent;
    const category = item.closest('.activity-category').querySelector('.activity-category-title').textContent;
    const desc = item.dataset.desc;
    const detail = item.dataset.detail;
    const facts = (item.dataset.facts || '').split('|').filter(Boolean);
    item.addEventListener('click', () => openInfoModal(category, title, [desc, detail, facts]));
  });

  const seasonExtras = {
    Summer: {
      intro: 'Long days on the water and in the pines — Magnolia’s busiest, brightest season, with warm afternoons and cool evenings on the lake.',
      moment: 'Guests linger longest at golden hour, when the paddle boats come out and the light on Lake Conlin turns amber.',
      facts: ['Average highs: 90–95°F (32–35°C)', 'Pack: swimwear, sun hat, insect repellent', 'Signature moment: sunset paddle on the lake']
    },
    Autumn: {
      intro: 'The orange groves turn bright and the humidity finally breaks — a quieter, slower stretch on the grounds.',
      moment: 'The Heron Point overlook is at its best here, with sandhill cranes passing overhead in the evening light.',
      facts: ['Average highs: 82–88°F (28–31°C)', 'Pack: light layers, sun hat', 'Signature moment: evening watch at Heron Point']
    },
    Winter: {
      intro: 'Magnolia’s mildest, most sociable season: cool mornings, warm afternoons, and manatees gathering in the lake\'s warmer coves.',
      moment: 'Evenings end on the water, where lantern-lit pontoon cruises keep running long after the last manatee tour of the day.',
      facts: ['Average highs: 70–75°F (21–24°C)', 'Pack: light layers, a jacket for evenings', 'Signature moment: lantern cruise on Lake Conlin']
    },
    Spring: {
      intro: 'The quietest, greenest season on the grounds, as the wildlife wakes up and the trails empty out.',
      moment: 'Otters are most active in the early morning, playing in the shallows just past the lobby dock.',
      facts: ['Average highs: 80–85°F (27–29°C)', 'Pack: light layers, rain jacket', 'Signature moment: otters at play near the lobby dock']
    }
  };

  document.querySelectorAll('.season-card').forEach((card) => {
    const title = card.querySelector('h3').textContent;
    const months = card.querySelector('.season-months').textContent;
    const items = Array.from(card.querySelectorAll('li')).map((li) => li.textContent);
    const extra = seasonExtras[title] || {};
    card.addEventListener('click', () =>
      openInfoModal(`Season · ${months}`, title, [extra.intro, items, extra.moment, extra.facts])
    );
  });

  const roomAmenities = {
    'Standard Rooms': ['Premium bathroom with rain shower', 'Separate soaking tub in select rooms', 'Small indoor lounge or desk nook', 'Daily housekeeping'],
    'Luxury Suites': ['Distinct, separate living room', 'Private bedroom with enhanced closets', 'Upgraded balcony or terrace', 'Premium bath amenities'],
    'Family Room Suite': ['Two connected sleeping areas', 'Second bathroom', 'Kitchenette', 'Extra floor space for kids & extended family'],
    'Resort Villas & Bungalows': ['Private plunge pool or Jacuzzi', 'Dedicated outdoor seating', 'Sun deck among the pines', 'Expansive indoor-outdoor flow']
  };

  const appendRoomBookingForm = (title) => {
    const cta = `Reserve ${title}`;

    modalBody.appendChild(document.createElement('hr')).className = 'modal-divider';

    const wrap = document.createElement('div');
    wrap.className = 'booking-form-wrap';
    wrap.innerHTML = `
      <p class="booking-form-label">${cta}</p>
      <form class="booking-form">
        <label>Name<input type="text" name="name" required></label>
        <label>Email<input type="email" name="email" required></label>
        <label>Check-in<input type="date" name="checkin" required></label>
        <label>Check-out<input type="date" name="checkout" required></label>
        <label>Guests<input type="number" name="count" min="1" value="2" required></label>
        <label>Wing Preference
          <select name="wing">
            <option value="">No preference</option>
            <option value="South">South</option>
            <option value="East">East</option>
            <option value="North">North</option>
            <option value="West">West</option>
          </select>
        </label>
        <button type="submit" class="btn btn-primary">${cta}</button>
        <p class="booking-note"></p>
      </form>
    `;
    modalBody.appendChild(wrap);

    const today = new Date().toISOString().split('T')[0];
    const checkinInput = wrap.querySelector('input[name="checkin"]');
    const checkoutInput = wrap.querySelector('input[name="checkout"]');
    checkinInput.min = today;
    checkoutInput.min = today;
    checkinInput.addEventListener('change', () => {
      if (!checkinInput.value) return;
      const nextDay = new Date(checkinInput.value);
      nextDay.setDate(nextDay.getDate() + 1);
      checkoutInput.min = nextDay.toISOString().split('T')[0];
      if (checkoutInput.value && checkoutInput.value <= checkinInput.value) {
        checkoutInput.value = checkoutInput.min;
      }
    });

    const form = wrap.querySelector('form');
    const note = wrap.querySelector('.booking-note');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      note.textContent = 'Thank you — this is a demo reservation and hasn’t been sent. Our team will follow up by email once bookings go live.';
      form.reset();
    });
  };

  document.querySelectorAll('.room-card').forEach((card) => {
    const title = card.querySelector('h3').textContent;
    const tag = card.querySelector('.room-tag').textContent;
    const size = card.querySelector('.room-size').textContent;
    const price = card.querySelector('.room-price').textContent;
    const desc = card.querySelector('.room-body > p:last-child').textContent;
    const note = 'Available in all four wings — South, East, North & West — each priced individually. Rates vary by wing and season; contact us for exact pricing.';
    const amenities = roomAmenities[title] || [];
    card.addEventListener('click', () => {
      openInfoModal(tag, title, [size, price, desc, amenities, note]);
      appendRoomBookingForm(title);
    });
  });

  const buildingNarratives = {
    South: {
      paragraphs: [
        "Step through the South Wing's carved lattice screens and the air changes — warmer, greener, closer to the coast. This is Magnolia's tribute to the beach towns and river deltas of Southeast Asia: open-air walkways, dark tropical hardwoods, and gardens that spill right up to the windows.",
        "Rooms open onto private courtyards planted with ferns and flowering shrubs, echoing the region's love of bringing the outdoors in. Woven rattan, batik-inspired textiles, and soft brass fixtures carry the palette through every suite, while a rain-shower bathroom nods to the monsoon season the region is built around.",
        "In the evenings, the wing's ground-floor terrace becomes an informal night market corner during weekend shows — the closest thing on the property to a street food lane in Bangkok or Hoi An, minus the flight."
      ],
      details: ['Open-air lattice screens throughout', 'Private courtyards with rain-shower baths', 'Ground-floor terrace hosts the weekend night market']
    },
    East: {
      paragraphs: [
        "The East Wing slows you down on purpose. Clean timber lines, paper-soft light through shoji-style screens, and long sightlines toward the garden borrow from a design language built around stillness — the kind found in a tea room or a temple courtyard.",
        "Interiors favor restraint over ornament: a single ceramic vessel, a low platform bed, a window framed like a piece of art. Materials are natural and honest — unlacquered wood, stone, washi-textured paper — chosen to age quietly rather than demand attention.",
        "It's the wing guests return to for the seasonal rituals Magnolia is built around: watching the mist lift off Lake Conlin at dawn, or the blueberry bushes ripen in summer, from a room designed to make watching feel like the whole point."
      ],
      details: ['Shoji-style screens and low platform beds', 'Natural, unlacquered materials throughout', 'Long sightlines framed toward the garden']
    },
    North: {
      paragraphs: [
        "The North Wing carries the craft traditions of North and Central Asia — thick felted textiles, deep saturated color, and a hearth-forward layout that makes every room feel gathered around a fire even when it isn't. Hand-knotted rugs, embroidered wool, and carved wooden furniture give it real weight against Magnolia's lighter, garden-facing wings.",
        "This is the wing that leans hardest into Magnolia's cool-season identity. Rooms are oriented toward the Lake Conlin views, with mudrooms and gear storage built in rather than bolted on, so the transition from a day on the water or the trails to a warm room is as short as possible.",
        "Color does the work other wings leave to texture — rust, ochre, and deep indigo against pale plaster walls, a palette meant to hold its own against the pale morning mist over the lake."
      ],
      details: ['Hearth-forward room layouts', 'Built-in mudrooms and gear storage', 'Hand-knotted rugs and embroidered wool textiles']
    },
    West: {
      paragraphs: [
        "The West Wing carries the pattern language of the old spice routes — hand-blocked textiles, geometric tilework underfoot, and archways that turn every hallway into a small procession. It's the most ornamented of Magnolia's four wings, built on the idea that beauty can be structural, not just decorative.",
        "Deep jewel tones sit against whitewashed walls, and courtyard-facing rooms use latticed screens to filter light into shifting geometric patterns through the day — a nod to the region's long history of turning climate control into art.",
        "In the evenings, the wing's covered walkway is where the weekend market's textile and spice-inspired craft booths tend to gather, keeping the wing's spirit alive outside its own walls."
      ],
      details: ['Hand-blocked textiles and geometric tilework', 'Latticed screens filter light into shifting pattern', 'Covered walkway hosts the weekend craft booths']
    }
  };

  document.querySelectorAll('.building-card').forEach((card) => {
    const title = card.querySelector('h3').textContent;
    const wing = buildingNarratives[title];
    if (!wing) return;
    card.addEventListener('click', () =>
      openInfoModal('Wing', title, [...wing.paragraphs, wing.details])
    );
  });

  // Expose so the calendar (built below) can reuse the same modal.
  window.__openEventModal = (name, desc) => openInfoModal('Weekend Event', name, desc);
}

const eventCalendar = document.getElementById('eventCalendar');
if (eventCalendar) {
  const activities = [
    'Fire Dance', 'Fashion Show', 'Community Space', 'Live Folk Music',
    'Night Market', 'Lion Dance Performance', 'Taiko Drum Performance',
    'Moon Viewing & Lantern Festival', 'Shadow Puppet Theatre',
    'Classical Dance Recital', 'Martial Arts Demonstration',
    'Acrobatics & Contortion Show', 'Bamboo Flute Recital',
    'Folk Storytelling Circle', 'Silk Ribbon Dance', 'Dragon Parade',
    'Opera Excerpt Performance', 'Puppet Marionette Show',
    'Whirling Dervish Performance', 'Bhangra Dance Performance',
    'Belly Dance Performance', 'Sitar & Tabla Recital',
    'Qawwali Music Performance', 'Dombra & Central Asian Strings Recital',
    'Oud Recital', 'Silk Road Caravan Storytelling',
    'Henna Art Demonstration', 'Uzbek Folk Dance Performance'
  ];
  const weekdayFmt = new Intl.DateTimeFormat('en-US', { weekday: 'short' });
  const monthFmt = new Intl.DateTimeFormat('en-US', { month: 'short' });
  const monthLabelFmt = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // The calendar starts showing just the current month. Each "View
  // More Weekends" click steps the visible horizon out by 3 more
  // calendar months, up to a maximum of 1 year from today; at that
  // point the button switches to "View Fewer Weekends" and resets
  // back to the current-month-only view.
  const monthAnchor = new Date(today.getFullYear(), today.getMonth(), 1);
  const horizonEnd = new Date(today);
  horizonEnd.setMonth(horizonEnd.getMonth() + 12);
  const stepCutoffs = [0, 1, 2, 3].map(
    (i) => new Date(monthAnchor.getFullYear(), monthAnchor.getMonth() + 1 + i * 3, 0)
  ).concat(horizonEnd);
  let stepIndex = 0;

  // Collect every upcoming Saturday/Sunday for the full 1-year horizon
  // up front so stepping through views is just a matter of showing or
  // hiding month groups — always computed from "today", so this list
  // is never stale no matter when the page loads.

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

  const render = () => {
    const cutoff = stepCutoffs[stepIndex];
    const atMax = stepIndex === stepCutoffs.length - 1;
    const atMin = stepIndex === 0;

    const monthsHtml = monthGroups
      .map((group) => monthHtml(group, group.dates[0].date > cutoff))
      .join('');

    // The "fewer" button only appears once guests have clicked "more"
    // at least once — no point offering to collapse the minimum view.
    const toggleHtml = `
      <div class="calendar-toggles">
        ${!atMax ? '<button type="button" class="btn btn-ghost calendar-toggle" id="calendarMore">View More Weekends</button>' : ''}
        ${!atMin ? '<button type="button" class="btn btn-ghost calendar-toggle" id="calendarFewer">View Fewer Weekends</button>' : ''}
      </div>
    `;

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

    document.getElementById('calendarMore')?.addEventListener('click', () => {
      stepIndex += 1;
      render();
    });
    document.getElementById('calendarFewer')?.addEventListener('click', () => {
      stepIndex -= 1;
      render();
      // Collapsing removes months of content above the buttons, which
      // would otherwise leave the page scrolled past whatever now
      // follows the calendar. Scroll the toggles back into view so
      // guests land where they were, not further down the page.
      document.querySelector('.calendar-toggles')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  };

  render();
}
