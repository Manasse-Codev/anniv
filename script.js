(() => {
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const darkTheme = window.matchMedia('(prefers-color-scheme: dark)');
  const content = window.CONTENU;

  function syncThemeColor(isDark) {
    if (themeMeta) themeMeta.content = isDark ? '#0B1E63' : '#BBD1F3';
  }

  syncThemeColor(darkTheme.matches);
  darkTheme.addEventListener('change', (event) => syncThemeColor(event.matches));

  function renderAboutContent() {
    if (!content) return;
    const bio = document.querySelector('#bio-paragraphs');
    const motto = document.querySelector('#about-motto');
    const interests = document.querySelector('#interest-list');
    const ambition = document.querySelector('#ambition-text');
    if (bio) {
      bio.innerHTML = content.bioParagraphes.map((paragraph, index) => {
        if (index !== 0) return `<p>${paragraph}</p>`;
        const name = 'Amani Kouadio Christ-Manassé';
        const opening = `Je m'appelle ${name}`;
        return `<p>Je m'appelle <strong>${name}</strong>${paragraph.slice(opening.length)}</p>`;
      }).join('');
    }
    if (motto) motto.textContent = content.devise;
    if (interests) interests.innerHTML = content.centresInteret.map((interest) => `<li>${interest}</li>`).join('');
    if (ambition) ambition.textContent = content.ambition;
  }

  renderAboutContent();

  function initializeCinemaIntro() {
    const dialog = document.querySelector('#cinema-intro');
    const scenes = [...document.querySelectorAll('[data-cinema-scene]')];
    const replayButton = document.querySelector('#replay-intro');
    const skipButton = document.querySelector('#cinema-skip');
    const soundButton = document.querySelector('#cinema-sound');
    const volumeControl = document.querySelector('#cinema-volume');
    const progress = document.querySelector('.cinema-progress');
    const progressBar = document.querySelector('#cinema-progress-bar');
    const timecode = document.querySelector('#cinema-timecode');
    const canvas = document.querySelector('#cinema-particles');
    const status = document.querySelector('#cinema-status');
    if (!dialog || !scenes.length || !window.gsap) return;

    const reduceMotionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const lowPower = (navigator.deviceMemory && navigator.deviceMemory <= 4)
      || navigator.hardwareConcurrency <= 4
      || window.matchMedia('(max-width: 700px)').matches;
    if (lowPower) dialog.classList.add('cinema--lightweight');

    const sceneDurations = [4.1, 5.2, 4.8, 5.1, 5.1, 5.1, 6.6];
    const totalDuration = sceneDurations.reduce((sum, duration) => sum + duration, 0);
    const sequenceDuration = totalDuration * (lowPower ? .72 : 1);
    const sceneNames = ['Yamoussoukro', 'Bonoufla', 'Daloa', 'Soubré'];
    let timeline;
    let particleFrame = 0;
    let particles = [];
    let audioContext;
    let soundtrackGain;
    let scoreOscillators = [];
    let suspendAudioTimer = 0;
    let introWasClosed = false;

    function setActiveScene(scene) {
      const sceneAnnouncements = {
        origin: 'Le commencement. Chaque histoire commence quelque part.',
        map: 'Mes origines : Yamoussoukro, Bonoufla, Daloa et Soubré.',
        timeline: 'Mon parcours scolaire, de Bonoufla à l’Université Virtuelle de Côte d’Ivoire.',
        vision: 'Mes passions : développement logiciel, science des données, intelligence artificielle et innovation numérique.',
        people: 'Les rencontres qui m’ont marqué, avec un hommage à mon mentor KEBE Kader, Kvdev.',
        future: 'Ma vision : contribuer à la transformation numérique en Afrique.',
        final: 'Amani Kouadio Christ-Manassé. Mon histoire ne fait que commencer.',
        summary: 'Présentation sans animation : étudiant en développement d’applications et e-services, passionné par les technologies et la transformation numérique en Afrique.'
      };
      scenes.forEach((item) => {
        const active = item === scene;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-hidden', String(!active));
      });
      if (status && scene) status.textContent = sceneAnnouncements[scene.dataset.cinemaScene] || '';
    }

    function setProgress(value) {
      const percent = Math.max(0, Math.min(100, Math.round(value * 100)));
      if (progressBar) progressBar.style.transform = `scaleX(${percent / 100})`;
      if (progress) progress.setAttribute('aria-valuenow', String(percent));
      if (timecode) {
        const seconds = Math.floor(Math.min(sequenceDuration, sequenceDuration * value));
        timecode.textContent = `00:${String(seconds).padStart(2, '0')}`;
      }
    }

    function stopParticles() {
      cancelAnimationFrame(particleFrame);
      particleFrame = 0;
    }

    function drawParticles() {
      if (!canvas || !dialog.open) return;
      const rect = canvas.getBoundingClientRect();
      const context = canvas.getContext('2d');
      if (!context) return;
      const scale = Math.min(window.devicePixelRatio || 1, 1.5);
      context.clearRect(0, 0, rect.width * scale, rect.height * scale);
      const time = performance.now() * .00045;
      particles.forEach((particle, index) => {
        const driftX = reduceMotionPreference.matches ? 0 : Math.sin(time + particle.phase) * particle.drift;
        const driftY = reduceMotionPreference.matches ? 0 : Math.cos(time * .8 + particle.phase) * particle.drift;
        const pulse = .35 + (Math.sin(time * 2 + particle.phase) + 1) * .28;
        context.beginPath();
        context.arc((particle.x + driftX) * scale, (particle.y + driftY) * scale, particle.radius * scale, 0, Math.PI * 2);
        context.fillStyle = index % 9 === 0 ? `rgba(242,139,109,${pulse})` : `rgba(169,198,255,${pulse * .65})`;
        context.fill();
      });
      if (!reduceMotionPreference.matches) particleFrame = requestAnimationFrame(drawParticles);
    }

    function resizeParticles() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const scale = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(rect.width * scale);
      canvas.height = Math.round(rect.height * scale);
      const count = reduceMotionPreference.matches ? 0 : (lowPower ? 18 : 42);
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        radius: .45 + Math.random() * 1.4,
        drift: 2 + Math.random() * 8,
        phase: Math.random() * Math.PI * 2
      }));
      stopParticles();
      drawParticles();
    }

    function scoreChord(sceneIndex) {
      if (!audioContext || !scoreOscillators.length) return;
      const roots = [65.41, 73.42, 82.41, 73.42, 87.31, 65.41, 98];
      const root = roots[sceneIndex] || roots[0];
      scoreOscillators.forEach((oscillator, index) => {
        oscillator.frequency.setTargetAtTime(root * [1, 1.5, 2.003][index], audioContext.currentTime, .85);
      });
      const soundOn = soundButton?.getAttribute('aria-pressed') === 'true';
      if (soundOn) playCue(sceneIndex === 0 ? 660 : 440 + sceneIndex * 38);
    }

    function initializeSoundtrack() {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return false;
      if (!audioContext) {
        audioContext = new AudioContextClass();
        soundtrackGain = audioContext.createGain();
        soundtrackGain.gain.value = Number(volumeControl?.value || .32) * .17;
        soundtrackGain.connect(audioContext.destination);
        [65.41, 98.12, 130.95].forEach((frequency, index) => {
          const oscillator = audioContext.createOscillator();
          const voiceGain = audioContext.createGain();
          oscillator.type = index === 1 ? 'sine' : 'triangle';
          oscillator.frequency.value = frequency;
          voiceGain.gain.value = [0.3, 0.15, 0.07][index];
          oscillator.connect(voiceGain);
          voiceGain.connect(soundtrackGain);
          oscillator.start();
          scoreOscillators.push(oscillator);
        });
      }
      if (audioContext.state === 'suspended') audioContext.resume();
      soundtrackGain.gain.setTargetAtTime(Number(volumeControl?.value || .32) * .17, audioContext.currentTime, .25);
      return true;
    }

    function playCue(frequency) {
      if (!audioContext || soundButton?.getAttribute('aria-pressed') !== 'true') return;
      const oscillator = audioContext.createOscillator();
      const envelope = audioContext.createGain();
      const now = audioContext.currentTime;
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, now);
      oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.42, now + .28);
      envelope.gain.setValueAtTime(.0001, now);
      envelope.gain.exponentialRampToValueAtTime(.045, now + .055);
      envelope.gain.exponentialRampToValueAtTime(.0001, now + .62);
      oscillator.connect(envelope);
      envelope.connect(soundtrackGain);
      oscillator.start(now);
      oscillator.stop(now + .65);
    }

    function setSoundEnabled(enabled) {
      if (!soundButton) return;
      if (enabled && !initializeSoundtrack()) {
        soundButton.textContent = 'Son indisponible';
        soundButton.setAttribute('aria-label', 'Son indisponible sur cet appareil');
        return;
      }
      soundButton.setAttribute('aria-pressed', String(enabled));
      soundButton.textContent = enabled ? 'Son activé' : 'Son désactivé';
      soundButton.setAttribute('aria-label', enabled ? 'Désactiver le son' : 'Activer le son');
      window.clearTimeout(suspendAudioTimer);
      if (soundtrackGain && audioContext) soundtrackGain.gain.setTargetAtTime(enabled ? Number(volumeControl?.value || .32) * .17 : .0001, audioContext.currentTime, .2);
      if (!enabled && audioContext) {
        suspendAudioTimer = window.setTimeout(() => {
          if (soundButton.getAttribute('aria-pressed') === 'false' && audioContext?.state === 'running') audioContext.suspend();
        }, 350);
      }
      if (enabled) playCue(660);
    }

    function buildTimeline() {
      timeline?.kill();
      setProgress(0);
      scenes.forEach((scene) => scene.classList.remove('is-active'));
      const cinematicScenes = scenes.filter((scene) => scene.dataset.cinemaScene !== 'summary');
      const motion = lowPower ? .72 : 1;
      const sequence = gsap.timeline({
        paused: true,
        onUpdate: () => setProgress(sequence.progress()),
        onComplete: () => finishIntro()
      });
      let cursor = 0;
      const isVertical = window.matchMedia('(max-width: 700px)').matches;
      const schoolFill = document.querySelector('.school-track__fill');
      const finalPortrait = document.querySelector('.final-image');
      if (schoolFill) gsap.set(schoolFill, { width: isVertical ? '100%' : '0%', height: isVertical ? '0%' : '1px' });
      if (finalPortrait) gsap.set(finalPortrait, { scale: 1.12 });

      cinematicScenes.forEach((scene, index) => {
        const duration = sceneDurations[index] * motion;
        const name = scene.dataset.cinemaScene;
        const contentSelectors = {
          origin: '.cinema-kicker, .origin-title, .origin-line, .origin-coordinate',
          map: '.cinema-copy--map > *, .map-index',
          timeline: '.cinema-kicker, .cinema-scene--timeline > h2, .school-stop, .timeline-note',
          vision: '.vision-heading > *, .vision-code, .vision-orbit, .vision-tags span, .vision-footer',
          people: '.cinema-kicker, .cinema-scene--people > h2, .reel-portrait, .people-names',
          future: '.future-map, .future-word, .future-copy > *',
          final: '.final-image, .final-copy > *'
        }[name];

        sequence.call(() => {
          setActiveScene(scene);
          scoreChord(index);
        }, null, cursor);
        sequence.fromTo(scene,
          { autoAlpha: 0, scale: lowPower ? 1 : .985, filter: lowPower ? 'blur(0px)' : 'blur(7px)' },
          { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: .62, ease: 'power2.out' },
          cursor
        );
        if (contentSelectors) {
          const nodes = scene.querySelectorAll(contentSelectors);
          sequence.fromTo(nodes,
            { autoAlpha: 0, y: lowPower ? 0 : 13 },
            { autoAlpha: 1, y: 0, duration: .52, stagger: lowPower ? .035 : .085, ease: 'power2.out' },
            cursor + .25
          );
        }
        if (name === 'map') {
          sequence.fromTo(scene.querySelector('.cinema-map'),
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: .8, ease: 'power2.out' },
            cursor + .18
          );
        }

        if (name === 'map') {
          const path = scene.querySelector('#cinema-map-route');
          const traveler = scene.querySelector('#map-traveler');
          const caption = scene.querySelector('#map-caption-name');
          const length = path.getTotalLength();
          sequence.set(traveler, { clearProps: 'transform' }, cursor);
          sequence.set(path, { strokeDasharray: length, strokeDashoffset: length }, cursor + .7);
          sequence.to(path, { strokeDashoffset: 0, duration: duration - 1.25, ease: 'power1.inOut' }, cursor + .72);
          if (window.MotionPathPlugin) {
            sequence.to(traveler, { motionPath: { path, align: path, alignOrigin: [.5, .5] }, duration: duration - 1.25, ease: 'power1.inOut' }, cursor + .72);
          }
          sequence.to({ point: 0 }, {
            point: 3,
            duration: duration - 1.25,
            ease: 'none',
            onUpdate() {
              const place = scene.querySelector(`[data-place="${sceneNames[Math.min(3, Math.floor(this.targets()[0].point))]}"]`);
              if (caption && place) caption.textContent = place.dataset.place;
            }
          }, cursor + .72);
        }
        if (name === 'timeline') {
          const points = scene.querySelectorAll('.school-stop');
          const fill = scene.querySelector('.school-track__fill');
          sequence.set(fill, { [isVertical ? 'height' : 'width']: '0%' }, cursor + .64);
          sequence.to(fill, { [isVertical ? 'height' : 'width']: '100%', duration: duration - 1.2, ease: 'power1.inOut' }, cursor + .65);
          sequence.to(points, { autoAlpha: 1, y: 0, duration: .5, stagger: .62, ease: 'power2.out' }, cursor + .85);
        }
        if (name === 'vision') {
          sequence.fromTo(scene.querySelectorAll('.vision-network circle'),
            { scale: 0, transformOrigin: 'center' },
            { scale: 1, duration: .35, stagger: .12, ease: 'back.out(1.7)' },
            cursor + .85
          );
        }
        if (name === 'people') {
          sequence.to(scene.querySelectorAll('.reel-portrait'), { autoAlpha: 1, y: 0, scale: 1, duration: .55, stagger: .18, ease: 'power2.out' }, cursor + .72);
        }
        if (name === 'future') {
          sequence.fromTo(scene.querySelectorAll('.future-connections path'), { strokeDasharray: 260, strokeDashoffset: 260 }, { strokeDashoffset: 0, duration: 1.1, stagger: .14, ease: 'power1.out' }, cursor + .4);
        }
        if (name === 'final') {
          sequence.to(scene.querySelector('.final-image'), { scale: 1, duration: duration - .2, ease: 'none' }, cursor);
        }

        sequence.to(scene, { autoAlpha: 0, scale: lowPower ? 1 : 1.014, filter: lowPower ? 'blur(0px)' : 'blur(5px)', duration: .46, ease: 'power1.in' }, cursor + duration - .46);
        cursor += duration;
      });
      sequence.eventCallback('onComplete', () => finishIntro());
      timeline = sequence;
      if (progress) progress.setAttribute('aria-valuemax', '100');
      timeline.timeScale(1);
    }

    function finishIntro(goToContent = false) {
      if (!dialog.open) return;
      timeline?.pause(0);
      stopParticles();
      setSoundEnabled(false);
      try { sessionStorage.setItem('amani-cinema-seen', 'true'); } catch { /* Le stockage peut être désactivé. */ }
      dialog.close();
      introWasClosed = true;
      if (goToContent) {
        const target = document.querySelector('#a-propos');
        target?.scrollIntoView({ behavior: reduceMotionPreference.matches ? 'auto' : 'smooth' });
        target?.focus({ preventScroll: true });
      }
    }

    function startIntro() {
      if (dialog.open) return;
      buildTimeline();
      if (reduceMotionPreference.matches) {
        const summary = document.querySelector('[data-cinema-scene="summary"]');
        setActiveScene(summary);
        gsap.set(summary, { autoAlpha: 1, clearProps: 'filter,transform' });
        setProgress(1);
      } else {
        setActiveScene(document.querySelector('[data-cinema-scene="origin"]'));
        timeline.play(0);
      }
      if (typeof dialog.showModal === 'function') dialog.showModal();
      else dialog.setAttribute('open', '');
      document.documentElement.classList.add('cinema-open');
      if (!reduceMotionPreference.matches) skipButton?.focus({ preventScroll: true });
      resizeParticles();
    }

    dialog.addEventListener('cancel', (event) => {
      event.preventDefault();
      finishIntro();
    });
    dialog.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      finishIntro();
    });
    skipButton?.addEventListener('click', () => finishIntro());
    soundButton?.addEventListener('click', () => setSoundEnabled(soundButton.getAttribute('aria-pressed') !== 'true'));
    volumeControl?.addEventListener('input', () => {
      if (soundtrackGain && audioContext && soundButton?.getAttribute('aria-pressed') === 'true') {
        soundtrackGain.gain.setTargetAtTime(Number(volumeControl.value) * .17, audioContext.currentTime, .08);
      }
    });
    replayButton?.addEventListener('click', startIntro);
    document.querySelectorAll('.cinema-cta').forEach((link) => link.addEventListener('click', (event) => {
      event.preventDefault();
      window.history.pushState(null, '', link.getAttribute('href'));
      finishIntro(true);
    }));
    window.addEventListener('resize', () => { if (dialog.open) resizeParticles(); }, { passive: true });
    reduceMotionPreference.addEventListener('change', () => {
      if (dialog.open) finishIntro();
    });
    dialog.addEventListener('close', () => {
      document.documentElement.classList.remove('cinema-open');
      if (!introWasClosed) finishIntro();
      introWasClosed = false;
    });

    let hasSeenIntro = false;
    try { hasSeenIntro = sessionStorage.getItem('amani-cinema-seen') === 'true'; } catch { /* Le stockage peut être désactivé. */ }
    if (!hasSeenIntro && !reduceMotionPreference.matches) requestAnimationFrame(startIntro);
  }

  initializeCinemaIntro();

  const revealItems = document.querySelectorAll('.reveal');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let revealObserver = null;
  if (!reduceMotion && 'IntersectionObserver' in window) {
    revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  const data = window.RENCONTRES;
  const journey = document.querySelector('.journey');
  const route = document.querySelector('#journey-route');
  const traveler = document.querySelector('#traveler');
  const journeyArt = document.querySelector('.journey-art');

  if (!data || !journey || !route || !traveler || !journeyArt) return;

  const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character]);

  function avatarMarkup(person, sizeClass = '') {
    const image = person.image
      ? `<img src="${escapeHTML(person.image)}" alt="${escapeHTML(person.name)}" loading="lazy" width="64" height="64">`
      : '';
    const fallbackHidden = person.image ? ' hidden' : '';
    return `<span class="person-avatar ${sizeClass}">${image}<span class="person-initials"${fallbackHidden} aria-hidden="true">${escapeHTML(person.initials)}</span></span>`;
  }

  function personCardMarkup(person, side = 'left', quiet = false, dialog = false) {
    const classes = [
      'person-card',
      dialog ? 'person-card--dialog' : `person-card--${side}`,
      quiet ? 'person-card--quiet' : ''
    ].filter(Boolean).join(' ');
    return `<article class="${classes}" data-person-id="${escapeHTML(person.id)}">
      <div class="person-card-header">
        ${avatarMarkup(person, dialog ? 'person-avatar--dialog' : '')}
        <div class="person-card-heading">
          <h4>${escapeHTML(person.name)}</h4>
          <p class="person-period">${escapeHTML(person.period)}</p>
        </div>
      </div>
      <p class="person-text">${escapeHTML(person.text)}</p>
      ${dialog && person.texteLong ? `<p class="person-long-text">${escapeHTML(person.texteLong)}</p>` : ''}
    </article>`;
  }

  function renderPersonCards() {
    const introduction = document.querySelector('#encounter-introduction');
    const conclusion = document.querySelector('#encounter-conclusion');
    if (introduction) introduction.textContent = data.introduction;
    if (conclusion) conclusion.textContent = data.conclusion;

    const daloaList = document.querySelector('[data-stage="daloa"].person-list');
    const daloaPeople = data.personnes.filter((person) => person.stage === 'daloa');
    if (daloaList) {
      daloaList.innerHTML = daloaPeople
        .map((person, index) => personCardMarkup(person, index % 2 ? 'right' : 'left'))
        .join('');
    }

    const soubreGroups = document.querySelector('[data-stage="soubre"].person-groups');
    const soubrePeople = data.personnes.filter((person) => person.stage === 'soubre');
    if (soubreGroups) {
      const groups = new Map();
      soubrePeople.forEach((person) => {
        if (!groups.has(person.period)) groups.set(person.period, []);
        groups.get(person.period).push(person);
      });
      let index = 0;
      soubreGroups.innerHTML = [...groups.entries()].map(([period, people]) => {
        const cards = people.map((person) => {
          const side = index++ % 2 ? 'right' : 'left';
          return personCardMarkup(person, side, person.id === 'boka-grace');
        }).join('');
        return `<section class="person-class-group">
          <h4 class="class-group-label">${escapeHTML(period)}</h4>
          <div class="person-list">${cards}</div>
        </section>`;
      }).join('');
    }

    const globalBeacons = document.querySelector('#global-beacons');
    const globalPeople = data.personnes.filter((person) => person.stage === 'ailleurs' && person.beacon);
    if (globalBeacons) {
      globalBeacons.innerHTML = globalPeople.map((person) => {
        const { x, y } = person.beacon;
        return `<button class="global-beacon" type="button"
          style="--map-x:${Number(x)};--map-y:${Number(y)}"
          data-person-id="${escapeHTML(person.id)}"
          aria-label="${escapeHTML(person.name)}"
          aria-pressed="false"
          aria-haspopup="dialog">
          ${avatarMarkup(person, 'beacon-avatar')}
        </button>`;
      }).join('');
    }

    const globalPeopleList = document.querySelector('#global-people-list');
    if (globalPeopleList) {
      const chronological = data.personnes.filter((person) => person.stage === 'ailleurs');
      globalPeopleList.innerHTML = chronological.map((person, index) => {
        if (person.id === 'kader') {
          return `<article class="mentor-tribute reveal" aria-labelledby="mentor-name">
            <div class="mentor-portrait-frame">
              <img src="${escapeHTML(person.image)}" alt="${escapeHTML(person.name)}" width="220" height="280" loading="lazy">
              <span class="mentor-photo-mark" aria-hidden="true">Kvdev</span>
            </div>
            <div class="mentor-copy">
              <p class="mentor-eyebrow">Mon mentor <span aria-hidden="true">·</span> ${escapeHTML(person.period)}</p>
              <h4 id="mentor-name">${escapeHTML(person.honorName)}</h4>
              <p class="mentor-alias">Signature : <span>${escapeHTML(person.alias)}</span></p>
              <p class="mentor-recognition">${escapeHTML(person.texteLong)}</p>
            </div>
          </article>`;
        }
        const avatar = avatarMarkup(person, 'global-story-avatar');
        return `<article class="person-card global-story-card${index % 2 ? ' global-story-card--alternate' : ''}" data-person-id="${escapeHTML(person.id)}">
          <div class="person-card-header">
            ${avatar}
            <div class="person-card-heading">
              <h4>${escapeHTML(person.name)}</h4>
              <p class="person-period">${escapeHTML(person.period)}</p>
            </div>
          </div>
          <p class="person-text">${escapeHTML(person.text)}</p>
        </article>`;
      }).join('');
      const tribute = globalPeopleList.querySelector('.mentor-tribute');
      if (tribute) {
        if (reduceMotion || !('IntersectionObserver' in window)) tribute.classList.add('is-visible');
        else revealObserver?.observe(tribute);
      }
    }
  }

  renderPersonCards();

  document.addEventListener('error', (event) => {
    const image = event.target;
    if (!(image instanceof HTMLImageElement) || !image.matches('.person-avatar img')) return;
    image.hidden = true;
    const fallback = image.parentElement.querySelector('.person-initials');
    if (fallback) fallback.hidden = false;
  }, true);

  const dialog = document.querySelector('#person-dialog');
  const dialogPerson = document.querySelector('#dialog-person');
  const closeDialogButton = document.querySelector('.dialog-close');
  let lastBeacon = null;

  function closePersonDialog() {
    if (dialog?.open) dialog.close();
  }

  document.querySelector('#global-beacons')?.addEventListener('click', (event) => {
    const beacon = event.target.closest('.global-beacon');
    if (!beacon || !dialog || !dialogPerson) return;
    const person = data.personnes.find((entry) => entry.id === beacon.dataset.personId);
    if (!person) return;
    lastBeacon = beacon;
    document.querySelectorAll('.global-beacon[aria-pressed="true"]').forEach((item) => item.setAttribute('aria-pressed', 'false'));
    beacon.setAttribute('aria-pressed', 'true');
    dialogPerson.innerHTML = personCardMarkup(person, 'left', false, true);
    dialog.showModal();
  });

  closeDialogButton?.addEventListener('click', closePersonDialog);
  dialog?.addEventListener('click', (event) => {
    if (event.target === dialog) closePersonDialog();
  });
  dialog?.addEventListener('close', () => {
    lastBeacon?.setAttribute('aria-pressed', 'false');
    lastBeacon?.focus();
  });

  function updateJourneyRoute() {
    const svgRect = journeyArt.getBoundingClientRect();
    const journeyRect = journey.getBoundingClientRect();
    if (!svgRect.width || !svgRect.height) return [];

    const scaleY = 3120 / svgRect.height;
    const stops = [...journey.querySelectorAll('.journey-stop')];
    const points = stops.map((stop) => {
      const anchor = stop.dataset.stage === 'ailleurs'
        ? stop.querySelector('.country-map')
        : stop.querySelector('.stop-title');
      const bounds = (anchor || stop).getBoundingClientRect();
      const x = Math.max(24, Math.min(366, Number(stop.dataset.routeX) * 390));
      const y = Math.max(40, Math.min(3080, (bounds.top + bounds.height / 2 - journeyRect.top) * scaleY));
      return { x, y };
    });

    const pathData = points.reduce((path, point, index) => {
      if (index === 0) return `M${point.x} ${point.y}`;
      const previous = points[index - 1];
      const distance = point.y - previous.y;
      return `${path} C${previous.x} ${previous.y + distance * 0.55}, ${point.x} ${point.y - distance * 0.55}, ${point.x} ${point.y}`;
    }, '');
    route.setAttribute('d', pathData);

    const dots = document.querySelector('#waypoints');
    const rings = document.querySelector('#waypoint-rings');
    dots.replaceChildren();
    rings.replaceChildren();
    points.forEach(({ x, y }, index) => {
      const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot.setAttribute('cx', x);
      dot.setAttribute('cy', y);
      dot.setAttribute('r', '6');
      dots.append(dot);

      const ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      ring.setAttribute('cx', x);
      ring.setAttribute('cy', y);
      ring.setAttribute('r', '15');
      ring.style.animationDelay = `${index * 0.4}s`;
      rings.append(ring);
    });

    if (points.length) traveler.setAttribute('transform', `translate(${points[0].x} ${points[0].y})`);
    return points;
  }

  updateJourneyRoute();

  function initializeBirthdayScene() {
    const scene = document.querySelector('#happy-birthday');
    const confettiContainer = document.querySelector('#birthday-confetti');
    const audio = document.querySelector('#birthday-audio');
    const musicToggle = document.querySelector('#birthday-music-toggle');
    const startButton = document.querySelector('#birthday-start');
    const replayButton = document.querySelector('#birthday-replay');
    const volume = document.querySelector('#birthday-volume');
    const visualizer = document.querySelector('#birthday-visualizer');
    const credit = document.querySelector('#birthday-credit');
    if (!scene || !audio || !musicToggle || !startButton || !replayButton || !volume || !visualizer) return;

    const birthdayData = content?.anniversaire;
    if (birthdayData?.audioSource) audio.src = birthdayData.audioSource;
    if (credit && birthdayData) {
      const creditLink = document.createElement('a');
      creditLink.href = birthdayData.audioSourceUrl;
      creditLink.target = '_blank';
      creditLink.rel = 'noreferrer';
      creditLink.textContent = `${birthdayData.audioTitle} · ${birthdayData.audioAuthor} · ${birthdayData.audioLicense}`;
      credit.append(creditLink);
    }

    let sequence = 0;
    function scatterConfetti() {
      if (!confettiContainer) return;
      confettiContainer.replaceChildren();
      if (reduceMotion) return;
      const fragment = document.createDocumentFragment();
      for (let index = 0; index < 58; index += 1) {
        const piece = document.createElement('span');
        piece.className = `confetti-piece confetti-piece--${index % 6}`;
        piece.style.setProperty('--confetti-left', `${Math.random() * 100}%`);
        piece.style.setProperty('--confetti-delay', `${Math.random() * 4}s`);
        piece.style.setProperty('--confetti-duration', `${5 + Math.random() * 6}s`);
        piece.style.setProperty('--confetti-drift', `${Math.round(Math.random() * 150 - 75)}px`);
        piece.style.setProperty('--confetti-turn', `${Math.round(Math.random() * 900 - 450)}deg`);
        piece.style.setProperty('--confetti-size', `${6 + Math.round(Math.random() * 7)}px`);
        fragment.append(piece);
      }
      confettiContainer.append(fragment);
    }

    function replayScene() {
      sequence += 1;
      delete scene.dataset.paused;
      scene.classList.remove('is-celebrating');
      scatterConfetti();
      void scene.offsetWidth;
      scene.dataset.replay = String(sequence);
      scene.classList.add('is-celebrating');
    }

    const sceneObserver = 'IntersectionObserver' in window
      ? new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              if (!scene.classList.contains('is-celebrating')) replayScene();
              else delete scene.dataset.paused;
            } else if (scene.classList.contains('is-celebrating')) {
              scene.dataset.paused = 'true';
            }
          });
        }, { threshold: 0.18 })
      : null;
    if (sceneObserver) sceneObserver.observe(scene);
    else replayScene();

    let audioContext;
    let analyser;
    let frequencyData;
    let animationFrame = 0;
    let audioSource;
    const visualizerBars = [...visualizer.querySelectorAll('span')];

    function updateMusicUI(isPlaying) {
      musicToggle.setAttribute('aria-pressed', String(isPlaying));
      musicToggle.textContent = isPlaying ? 'Mettre la musique en pause' : 'Activer la musique';
      startButton.textContent = isPlaying ? 'Rejouer la célébration' : 'Célébrer mon anniversaire';
      visualizer.classList.toggle('is-playing', isPlaying);
      visualizer.setAttribute('aria-label', isPlaying ? 'Visualisation audio, musique en lecture' : 'Visualisation audio, inactive');
      if (!isPlaying) {
        cancelAnimationFrame(animationFrame);
        visualizerBars.forEach((bar) => bar.style.removeProperty('--bar-level'));
      }
    }

    function animateVisualizer() {
      if (!analyser || !frequencyData || audio.paused || reduceMotion) return;
      analyser.getByteFrequencyData(frequencyData);
      visualizerBars.forEach((bar, index) => {
        const band = Math.floor(index * (frequencyData.length / visualizerBars.length));
        const level = Math.max(.14, frequencyData[band] / 255);
        bar.style.setProperty('--bar-level', level.toFixed(2));
      });
      animationFrame = requestAnimationFrame(animateVisualizer);
    }

    async function playBirthdayMusic() {
      if (!audio.src) return;
      try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass && !audioContext) {
          audioContext = new AudioContextClass();
          analyser = audioContext.createAnalyser();
          analyser.fftSize = 64;
          frequencyData = new Uint8Array(analyser.frequencyBinCount);
          audioSource = audioContext.createMediaElementSource(audio);
          audioSource.connect(analyser);
          analyser.connect(audioContext.destination);
        }
        if (audioContext?.state === 'suspended') await audioContext.resume();
        audio.volume = Number(volume.value);
        await audio.play();
      } catch {
        musicToggle.textContent = 'La musique n’a pas pu démarrer';
        updateMusicUI(false);
      }
    }

    musicToggle.addEventListener('click', () => {
      if (audio.paused) playBirthdayMusic();
      else audio.pause();
    });
    startButton.addEventListener('click', () => {
      replayScene();
      if (audio.paused) playBirthdayMusic();
    });
    replayButton.addEventListener('click', replayScene);
    volume.addEventListener('input', () => { audio.volume = Number(volume.value); });
    audio.addEventListener('play', () => {
      updateMusicUI(true);
      animateVisualizer();
    });
    audio.addEventListener('pause', () => updateMusicUI(false));
    audio.addEventListener('error', () => { musicToggle.textContent = 'Fichier audio indisponible'; });
  }

  initializeBirthdayScene();

  if (!window.gsap || !window.ScrollTrigger || !window.MotionPathPlugin) return;

  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let motionContext;

  function configureMotion(reduceMotion) {
    if (motionContext) {
      motionContext.revert();
      motionContext = undefined;
    }

    if (reduceMotion) {
      gsap.set(route, { clearProps: 'strokeDasharray,strokeDashoffset' });
      gsap.set(traveler, { opacity: 0 });
      return;
    }

    const routeLength = route.getTotalLength();
    gsap.set(traveler, { opacity: 1 });
    motionContext = gsap.context(() => {
      gsap.fromTo(route,
        { strokeDasharray: `${routeLength} ${routeLength}`, strokeDashoffset: routeLength },
        {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: journey,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
            invalidateOnRefresh: true
          }
        }
      );

      gsap.to(traveler, {
        motionPath: {
          path: route,
          align: route,
          alignOrigin: [0.5, 0.5],
          start: 0,
          end: 1
        },
        ease: 'none',
        scrollTrigger: {
          trigger: journey,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
          invalidateOnRefresh: true
        }
      });

      journey.querySelectorAll('.journey-stop .stop-card').forEach((card) => {
        gsap.fromTo(card,
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card.closest('.journey-stop'),
              start: 'top 78%',
              once: true
            }
          }
        );
      });

      const animatedPeople = [...journey.querySelectorAll('.person-card:not(.person-card--quiet)')];
      gsap.set(animatedPeople, { opacity: 0, y: 16, scale: 0.98 });
      ScrollTrigger.batch(animatedPeople, {
        start: 'top 84%',
        once: true,
        interval: 0.12,
        batchMax: 3,
        onEnter: (batch) => gsap.to(batch, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.48,
          stagger: 0.12,
          ease: 'back.out(1.35)',
          overwrite: true
        })
      });

      journey.querySelectorAll('.person-card--quiet').forEach((card) => {
        gsap.fromTo(card,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.45,
            ease: 'power1.out',
            scrollTrigger: { trigger: card, start: 'top 84%', once: true }
          }
        );
      });

      const beacons = [...journey.querySelectorAll('.global-beacon')];
      gsap.set(beacons, { opacity: 0 });
      ScrollTrigger.batch(beacons, {
        start: 'top 88%',
        once: true,
        interval: 0.12,
        batchMax: 3,
        onEnter: (batch) => gsap.to(batch, {
          opacity: 1,
          duration: 0.45,
          stagger: 0.1,
          ease: 'power1.out',
          overwrite: true
        })
      });
    }, journey);

    requestAnimationFrame(() => ScrollTrigger.refresh());
  }

  configureMotion(motionPreference.matches);
  motionPreference.addEventListener('change', (event) => {
    updateJourneyRoute();
    configureMotion(event.matches);
  });

  let resizeFrame = 0;
  const resizeObserver = new ResizeObserver(() => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(() => {
      if (motionContext) {
        motionContext.revert();
        motionContext = undefined;
      }
      updateJourneyRoute();
      configureMotion(motionPreference.matches);
    });
  });
  resizeObserver.observe(journey);
})();
