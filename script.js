const elements = document.querySelectorAll(".fall");

document.addEventListener("mousemove", (e) => {
  elements.forEach((el) => {
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
  const dummy = document.createElement("span");
  dummy.style.display = "inline-block";
  dummy.style.width = `${rect.width}px`;
  dummy.style.height = `${rect.height}px`;
  el.parentNode.insertBefore(dummy, el);

  // 落下開始位置
  const scrollY = window.scrollY;
  const startTop = rect.top + scrollY;
  const startLeft = rect.left;
  const fallEnd = window.innerHeight - 100;
  const fallDistance = fallEnd - rect.top;

  if (fallDistance <= 0) return;

  // 落下用レイヤーに追加
  document.getElementById("fall-layer").appendChild(el);

  el.style.position = "absolute";
  el.style.left = `${startLeft}px`;
  el.style.top = `${rect.top}px`;
  el.style.margin = "0";
  el.style.width = `${rect.width}px`;
  el.style.height = `${rect.height}px`;
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
      makeDraggable(el);
    }
  }

  requestAnimationFrame(animate);
}

function makeDraggable(el) {
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  el.addEventListener("mousedown", (e) => {
    if (el.dataset.falling !== "done") return; // 落ち切っていない場合は無視
    isDragging = true;
    offsetX = e.clientX - el.offsetLeft;
    offsetY = e.clientY - el.offsetTop;
    el.style.cursor = "grabbing";
  });

  document.addEventListener("mousemove", (e) => {
    if (isDragging) {
      el.style.left = e.clientX - offsetX + "px";
      el.style.top = e.clientY - offsetY + "px";
    }
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
    el.style.cursor = "grab";
  });
}
