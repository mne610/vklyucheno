/* The Ringo Times — a soft ink-shadow that trails the cursor across the page.
   Pure cosmetic; disabled when the reader prefers reduced motion. */
(function(){
  if(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var el = document.createElement("div");
  el.className = "cursor-shadow";
  function mount(){ if(!el.parentNode && document.body) document.body.appendChild(el); }
  if(document.body){ mount(); } else { document.addEventListener("DOMContentLoaded", mount); }

  var tx = 0, ty = 0, cx = 0, cy = 0, started = false, raf = null;

  function loop(){
    cx += (tx - cx) * 0.16;          // ease toward the pointer → the shadow lags slightly
    cy += (ty - cy) * 0.16;
    el.style.transform = "translate(" + cx.toFixed(1) + "px," + cy.toFixed(1) + "px)";
    if(Math.abs(tx - cx) > 0.4 || Math.abs(ty - cy) > 0.4){
      raf = requestAnimationFrame(loop);
    } else {
      raf = null;
    }
  }

  window.addEventListener("mousemove", function(e){
    tx = e.clientX; ty = e.clientY;
    if(!started){ started = true; cx = tx; cy = ty; el.style.opacity = "1"; }
    if(!raf){ raf = requestAnimationFrame(loop); }
  }, { passive:true });

  document.addEventListener("mouseleave", function(){ el.style.opacity = "0"; });
})();

/* day / night-edition theme, flipped by the masthead toggle */
(function(){
  var KEY = "rt-theme";
  function syncButtons(t){
    var p = t === "dark" ? "true" : "false";
    var b = document.querySelectorAll(".toggle-theme");
    for(var i=0;i<b.length;i++){ b[i].setAttribute("aria-pressed", p); }
  }
  function apply(t){ document.documentElement.setAttribute("data-theme", t); syncButtons(t); }
  function current(){ return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light"; }
  window.toggleTheme = function(){
    var t = current() === "dark" ? "light" : "dark";
    try{ localStorage.setItem(KEY, t); }catch(e){}
    apply(t);
  };
  function init(){
    var b = document.querySelectorAll(".toggle-theme");
    for(var i=0;i<b.length;i++){
      b[i].addEventListener("click", window.toggleTheme);
      b[i].addEventListener("keydown", function(e){ if(e.key === "Enter" || e.key === " "){ e.preventDefault(); window.toggleTheme(); } });
    }
    apply(current());
  }
  if(document.readyState !== "loading"){ init(); } else { document.addEventListener("DOMContentLoaded", init); }
})();
