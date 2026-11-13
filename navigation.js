(function(){
  var nav=document.querySelector(".site-nav"),btn=nav&&nav.querySelector(".nav-toggle");
  if(!btn)return;
  function set(open){
    nav.classList.toggle("open",open);
    btn.setAttribute("aria-expanded",open?"true":"false");
    btn.setAttribute("aria-label",open?"メニューを閉じる":"メニューを開く");
  }
  btn.addEventListener("click",function(){set(!nav.classList.contains("open"))});
  document.addEventListener("keydown",function(e){if(e.key==="Escape")set(false)});
  window.addEventListener("resize",function(){if(window.innerWidth>760)set(false)});
})();
