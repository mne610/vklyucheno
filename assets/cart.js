/* The Ringo Times — tiny localStorage basket (no backend, no payment) */
(function(){
  var KEY = "ringo-times-cart";

  function read(){
    try{ return JSON.parse(localStorage.getItem(KEY)) || {}; }
    catch(e){ return {}; }
  }
  function write(c){ try{ localStorage.setItem(KEY, JSON.stringify(c)); }catch(e){} paintBadges(); }

  window.cart = {
    items: read,
    count: function(){
      var c = read(), n = 0;
      for(var id in c){ n += c[id]; }
      return n;
    },
    add: function(id, qty){
      var c = read();
      c[id] = (c[id] || 0) + (qty || 1);
      write(c);
    },
    setQty: function(id, qty){
      var c = read();
      if(qty <= 0){ delete c[id]; } else { c[id] = qty; }
      write(c);
    },
    remove: function(id){
      var c = read(); delete c[id]; write(c);
    },
    clear: function(){ write({}); },
    total: function(){
      var c = read(), sum = 0;
      for(var id in c){
        var p = window.getProduct && window.getProduct(id);
        if(p){ sum += p.price * c[id]; }
      }
      return sum;
    }
  };

  function paintBadges(){
    var n = window.cart.count();
    document.querySelectorAll("[data-cart-count]").forEach(function(el){ el.textContent = n; });
  }

  // gentle confirmation on "add to basket" clicks
  window.addToBasket = function(id, btn){
    window.cart.add(id, 1);
    if(btn){
      var old = btn.textContent;
      btn.textContent = "Добавлено ✓";
      setTimeout(function(){ btn.textContent = old; }, 1100);
    }
  };

  document.addEventListener("DOMContentLoaded", paintBadges);
})();
