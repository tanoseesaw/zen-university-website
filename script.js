const elements = document.querySelectorAll(".fall");

// 1秒後に data-delay 対象を落下可能にする
setTimeout(() => {
  document.querySelectorAll("[data-delay]").forEach(el => {
    el.dataset.delayReady = "true";
  });
}, 1000);

document.addEventListener("mousemove", (e) => {
  elements.forEach((el) => {
    
    if (el.dataset.delay === "true" && el.dataset.delayReady !== "true") return;
    
    if (!el.dataset.falling) {
      const rect = el.getBoundingClientRect();

      // マウスが要素内に重なっているかを正確に判定
      const isHovered =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      if (isHovered) {
        fall(el, rect);
      }
    }
  });
});

function fall(el, rect) {
  el.dataset.falling = "true";

  // プレースホルダーでレイアウト保持（見た目のズレ防止）
const dummy = document.createElement("div");
dummy.style.display = "block";
dummy.style.width = `${rect.width}px`;
dummy.style.height = `${rect.height}px`;
dummy.style.marginTop = window.getComputedStyle(el).marginTop;
dummy.style.marginBottom = window.getComputedStyle(el).marginBottom;
dummy.style.marginLeft = window.getComputedStyle(el).marginLeft;
dummy.style.marginRight = window.getComputedStyle(el).marginRight;
dummy.style.background = "transparent";
el.parentNode.insertBefore(dummy, el);

  const scrollY = window.scrollY;
  const startTop = rect.top + scrollY;
  const startLeft = rect.left;
  const footerHeight = 60; 
  const fallEnd = window.innerHeight - footerHeight - 10;
  const fallDistance = fallEnd - rect.top;
  if (fallDistance <= 0) return;

  // ✅ .fall-static でなければ fall-layer に移動
  if (!el.classList.contains("fall-static")) {
    document.getElementById("fall-layer").appendChild(el);
    el.style.position = "absolute";
    el.style.left = `${startLeft}px`;
    el.style.top = `${rect.top}px`;
    el.style.margin = "0";
    el.style.width = `${rect.width}px`;
    el.style.height = `${rect.height}px`;
  }

  el.style.transform = "none";

  let y = 0;
  let vy = 0;
  let rotation = 0;

  function animate() {
    vy += 0.7;
    y += vy;
    rotation += 1.5;

    if (y < fallDistance) {
      el.style.transform = `translateY(${y}px) rotate(${rotation}deg)`;
      requestAnimationFrame(animate);
    } else {
      el.style.transform = `translateY(${fallDistance}px) rotate(${rotation}deg)`;
      el.dataset.falling = "done";
    }
  }

  requestAnimationFrame(animate);
}

