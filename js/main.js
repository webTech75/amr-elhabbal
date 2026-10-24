function main() {

(function () {
  'use strict';

  // Years of experience (career start: January 2013). Update the year if this changes.
  // Runs first so the counter animates to the right number.
  // Footer copyright year (first published 2024), e.g. "2024–2026"
  (function () {
    var start = 2013, now = new Date().getFullYear();
    var els = document.querySelectorAll('.copyright-year');
    for (var i = 0; i < els.length; i++) els[i].textContent = now > start ? start + '\u2013' + now : start;
  })();

  $('a.page-scroll').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html,body').animate({
          scrollTop: target.offset().top - 40
        }, 900);
        return false;
      }
    }
  });

  // affix the navbar after scroll below header
  $('#nav').affix({
    offset: {
      top: $('header').height()
    }
  });

  // skills chart
  $(document).ready(function(e) {
    var index = 0;
    $(document).scroll(function(){
      var top = $('#skills').height()-$(window).scrollTop();
      if(top<-300){
        if(index==0){
          $('.chart').easyPieChart({
            easing: 'easeOutBounce',
            onStep: function(from, to, percent) {
              $(this.el).find('.percent').text(Math.round(percent));
            }
          });
        }
        index++;
      }
    });
  });

  // Portfolio isotope filter
  $(window).load(function() {
    var $container = $('.portfolio-items');
    $container.isotope({
      filter: '*',
      animationOptions: {
        duration: 750,
        easing: 'linear',
        queue: false
      }
    });
    $('.cat a').click(function() {
      $('.cat .active').removeClass('active');
      $(this).addClass('active');
      var selector = $(this).attr('data-filter');
      $container.isotope({
        filter: selector,
        animationOptions: {
          duration: 750,
          easing: 'linear',
          queue: false
        }
      });
      return false;
    });
  });

  // CounterUp
  $(document).ready(function( $ ) {
    if($("span.count").length > 0){
      $('span.count').counterUp({
        delay: 10, // the delay time in ms
        time: 2000 // the speed time in ms
      });
    }
  });

  // Pretty Photo
  $("a[rel^='prettyPhoto']").prettyPhoto({
    social_tools: false
  });

  // ---------------------------------------------------------
  // Contact form (Web3Forms)
  // ---------------------------------------------------------
  function initContactForm() {
    var form = document.getElementById('contactForm');
    if (!form) return;
    var out = document.getElementById('success');
    var btn = document.getElementById('sendBtn');

    function showMessage(ok, msg) {
      out.innerHTML = '<div class="alert alert-' + (ok ? 'success' : 'danger') + '"></div>';
      out.firstChild.textContent = msg;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      out.innerHTML = '';
      btn.disabled = true;
      var label = btn.textContent;
      btn.textContent = 'Sending...';
      var data = {};
      new FormData(form).forEach(function (v, k) { data[k] = v; });
      fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      })
        .then(function (r) { return r.json(); })
        .then(function (d) {
          if (d.success) { showMessage(true, 'Thanks, your message was sent.'); form.reset(); }
          else { showMessage(false, d.message || 'Sorry, the message could not be sent.'); }
        })
        .catch(function () { showMessage(false, 'Could not reach the server. Please try again.'); })
        .then(function () { btn.disabled = false; btn.textContent = label; });
    });
  }

  // ---------------------------------------------------------
  // Neura featured project (tabs, architecture explorer, example run)
  // ---------------------------------------------------------
  function initNeura() {
    var root = document.querySelector('.nx');
    if (!root) return;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* Tabs */
    var tabs = root.querySelectorAll('.nx-tab');
    function selectTab(tab) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', on);
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      });
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { selectTab(t); });
      t.addEventListener('keydown', function (e) {
        var j = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : null;
        if (j === null) return;
        var n = tabs[(j + tabs.length) % tabs.length];
        n.focus(); selectTab(n); e.preventDefault();
      });
    });

    /* Architecture explorer */
    var info = {
      client: ['React client', 'The user interface, built with React and TypeScript. It calls the REST API and is deployed on Render.'],
      api: ['REST API', 'FastAPI routes for authentication, projects, and AI chat. Protected with JWT and documented with interactive Swagger UI.'],
      services: ['Services', 'Business logic lives here, so route handlers stay thin and easy to test.'],
      repos: ['Repositories', 'All data access sits behind repositories, which keeps the database details out of the rest of the app.'],
      orm: ['SQLAlchemy ORM', 'Models and queries use SQLAlchemy. Alembic manages schema migrations.'],
      db: ['SQLite', 'Stores users and projects.'],
      agent: ['AI agent', 'Sends the conversation to an LLM with function calling, runs the tools the model asks for, and returns an answer grounded in the project.'],
      registry: ['Tool registry', 'A central list of the tools the agent is allowed to call. Only registered tools can run, which keeps the system secure.'],
      tools: ['Project tools', 'Tools that inspect project files and run development tasks on the real project.']
    };
    var detail = document.getElementById('nx-detail');
    var nodes = root.querySelectorAll('.nx-node');
    function showNode(key) {
      nodes.forEach(function (n) { n.setAttribute('aria-pressed', n.dataset.node === key); });
      detail.innerHTML = '<h4></h4><p></p><p class="nx-hint">Select any block to see what it does.</p>';
      detail.querySelector('h4').textContent = info[key][0];
      detail.querySelector('p').textContent = info[key][1];
    }
    nodes.forEach(function (n) { n.addEventListener('click', function () { showNode(n.dataset.node); }); });
    showNode('client');

    /* Example run */
    var steps = [
      ['u', 'You: Where is authentication handled in this project?'],
      ['t', 'agent > tool_call  list_files("app")'],
      ['r', '  api/  core/  services/  repositories/  models/'],
      ['t', 'agent > tool_call  read_file("app/core/security.py")'],
      ['r', '  returned 84 lines'],
      ['a', 'Neura: Authentication uses JWT. Token creation and verification live in app/core, and the login routes are in app/api.']
    ];
    var term = document.getElementById('nx-term');
    var runBtn = document.getElementById('nx-run');
    var timers = [];
    function addLine(step) {
      var d = document.createElement('div');
      d.className = step[0];
      d.textContent = step[1];
      term.appendChild(d);
    }
    runBtn.addEventListener('click', function () {
      timers.forEach(clearTimeout); timers = [];
      term.innerHTML = '';
      if (reduce) { steps.forEach(addLine); return; }
      steps.forEach(function (st, i) { timers.push(setTimeout(function () { addLine(st); }, i * 800)); });
    });
  }

  // ---------------------------------------------------------
  // Interactive hero background (drifting network that reacts to the cursor)
  // ---------------------------------------------------------
  function initHeroNetwork() {
    var canvas = document.getElementById('hero-net');
    if (!canvas || !canvas.getContext) return;
    // Visitors who prefer reduced motion get the static background only.
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      canvas.style.display = 'none';
      return;
    }

    var host = canvas.parentNode;           // the .intro block
    var ctx = canvas.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = 0, h = 0, nodes = [], mouse = null;
    var running = false, visible = true, raf = 0;
    var LINK = 150, REACH = 170, PULL = 16;

    function build() {
      var rect = host.getBoundingClientRect();
      w = Math.max(rect.width, 1);
      h = Math.max(rect.height, 1);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var small = w < 768;
      var count = Math.round(Math.min(Math.max((w * h) / 15000, 24), 100) * (small ? 0.55 : 1));
      LINK = small ? 110 : 150;
      nodes = [];
      for (var i = 0; i < count; i++) {
        var a = Math.random() * Math.PI * 2;
        var sp = 0.12 + Math.random() * 0.22;
        nodes.push({
          x: Math.pow(Math.random(), 0.6) * w,   // denser toward the right
          y: Math.random() * h,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          ox: 0, oy: 0,
          r: 1.3 + Math.random() * 1.4
        });
      }
    }

    function frame() {
      raf = 0;
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      var i, j, n, m;

      for (i = 0; i < nodes.length; i++) {
        n = nodes[i];
        n.x += n.vx; n.y += n.vy;
        if (n.x < -10) n.x = w + 10; else if (n.x > w + 10) n.x = -10;
        if (n.y < -10) n.y = h + 10; else if (n.y > h + 10) n.y = -10;
        // ease toward the cursor, then back when it leaves
        var tx = 0, ty = 0;
        if (mouse) {
          var dx = mouse.x - n.x, dy = mouse.y - n.y, d = Math.sqrt(dx * dx + dy * dy);
          if (d < REACH && d > 0.1) {
            var k = (1 - d / REACH) * PULL;
            tx = (dx / d) * k; ty = (dy / d) * k;
          }
        }
        n.ox += (tx - n.ox) * 0.08;
        n.oy += (ty - n.oy) * 0.08;
      }

      ctx.lineWidth = 1;
      for (i = 0; i < nodes.length; i++) {
        n = nodes[i];
        var nx = n.x + n.ox, ny = n.y + n.oy;
        var wx = 0.12 + 0.88 * Math.pow(Math.min(Math.max(nx / w, 0), 1), 1.5); // quiet on the left
        for (j = i + 1; j < nodes.length; j++) {
          m = nodes[j];
          var ddx = nx - (m.x + m.ox), ddy = ny - (m.y + m.oy);
          var dist = Math.sqrt(ddx * ddx + ddy * ddy);
          if (dist < LINK) {
            ctx.strokeStyle = 'rgba(150,215,228,' + ((1 - dist / LINK) * 0.5 * wx).toFixed(3) + ')';
            ctx.beginPath(); ctx.moveTo(nx, ny); ctx.lineTo(m.x + m.ox, m.y + m.oy); ctx.stroke();
          }
        }
        if (mouse) {
          var mx = mouse.x - nx, my = mouse.y - ny, md = Math.sqrt(mx * mx + my * my);
          if (md < REACH) {
            ctx.strokeStyle = 'rgba(123,195,209,' + ((1 - md / REACH) * 0.7).toFixed(3) + ')';
            ctx.beginPath(); ctx.moveTo(nx, ny); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
          }
        }
        ctx.fillStyle = 'rgba(200,238,246,' + (0.2 + 0.8 * wx).toFixed(3) + ')';
        ctx.beginPath(); ctx.arc(nx, ny, n.r, 0, Math.PI * 2); ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    }

    function start() {
      if (running || !visible || document.hidden) return;
      running = true;
      raf = requestAnimationFrame(frame);
    }
    function stop() {
      running = false;
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
    }

    // Mouse only (touch scrolling is left alone)
    host.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      var r = canvas.getBoundingClientRect();
      mouse = { x: e.clientX - r.left, y: e.clientY - r.top };
    });
    host.addEventListener('pointerleave', function () { mouse = null; });

    // Pause when off screen or the tab is hidden
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        visible ? start() : stop();
      }).observe(host);
    }
    document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });

    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(build, 150);
    });

    build();
    start();
  }

  initHeroNetwork();
  initContactForm();
  initNeura();

}());

}
main();
