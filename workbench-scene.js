(() => {
  const scene = document.querySelector("[data-workbench-scene]");

  if (!scene) {
    return;
  }

  const annotation = scene.querySelector("[data-workbench-annotation]");
  const annotationTitle = scene.querySelector("[data-workbench-title]");
  const annotationDescription = scene.querySelector("[data-workbench-description]");
  const annotationLink = scene.querySelector("[data-workbench-link]");
  const annotationLine = scene.querySelector("[data-workbench-line]");
  const annotationPath = scene.querySelector("[data-workbench-path]");
  const status = scene.querySelector("[data-workbench-status]");
  const coarsePointer = window.matchMedia("(hover: none), (pointer: coarse)");
  const mobileLayout = window.matchMedia("(max-width: 620px)");

  let activeItem = null;
  let hoverDismissTimer = 0;
  let lastPointerType = "";

  const clamp = (value, minimum, maximum) =>
    Math.min(Math.max(value, minimum), maximum);

  const clearDismissTimer = () => {
    window.clearTimeout(hoverDismissTimer);
    hoverDismissTimer = 0;
  };

  const getItemName = (item) =>
    item.querySelector(".workbench-object__name").textContent.trim();

  const getSide = (item) => {
    if (mobileLayout.matches && item.dataset.mobileAnnotationSide) {
      return item.dataset.mobileAnnotationSide;
    }

    return item.dataset.annotationSide || "right";
  };

  const setAnnotationPosition = () => {
    if (!activeItem || annotation.hidden) {
      return;
    }

    const sceneRect = scene.getBoundingClientRect();
    const itemRect = activeItem.getBoundingClientRect();
    const annotationRect = annotation.getBoundingClientRect();
    const side = getSide(activeItem);
    const gap = Math.max(14, sceneRect.width * 0.022);
    const inset = Math.max(10, sceneRect.width * 0.014);
    const offsetX = Number(activeItem.dataset.annotationOffsetX || 0) * sceneRect.width / 100;
    const offsetY = Number(activeItem.dataset.annotationOffsetY || 0) * sceneRect.height / 100;
    const object = {
      left: itemRect.left - sceneRect.left,
      right: itemRect.right - sceneRect.left,
      top: itemRect.top - sceneRect.top,
      bottom: itemRect.bottom - sceneRect.top,
      centerX: itemRect.left - sceneRect.left + itemRect.width / 2,
      centerY: itemRect.top - sceneRect.top + itemRect.height / 2,
    };

    let left = object.centerX - annotationRect.width / 2;
    let top = object.centerY - annotationRect.height / 2;

    if (side.includes("right")) {
      left = object.right + gap;
    } else if (side.includes("left")) {
      left = object.left - annotationRect.width - gap;
    }

    if (side.startsWith("top")) {
      top = object.top - annotationRect.height - gap;
    } else if (side.startsWith("bottom")) {
      top = object.bottom + gap;
    } else {
      top = object.centerY - annotationRect.height / 2;
    }

    left = clamp(left + offsetX, inset, sceneRect.width - annotationRect.width - inset);
    top = clamp(top + offsetY, inset, sceneRect.height - annotationRect.height - inset);

    annotation.style.left = `${left}px`;
    annotation.style.top = `${top}px`;

    let startX = object.centerX;
    let startY = object.centerY;
    let endX = left + annotationRect.width / 2;
    let endY = top + annotationRect.height / 2;

    if (side.includes("right")) {
      startX = object.right;
      endX = left;
    } else if (side.includes("left")) {
      startX = object.left;
      endX = left + annotationRect.width;
    }

    if (side.startsWith("top")) {
      startY = object.top;
      endY = top + annotationRect.height;
    } else if (side.startsWith("bottom")) {
      startY = object.bottom;
      endY = top;
    }

    endX = clamp(endX, left, left + annotationRect.width);
    endY = clamp(endY, top, top + annotationRect.height);

    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const bend = Math.min(28, Math.hypot(deltaX, deltaY) * 0.14);
    const controlOneX = startX + deltaX * 0.42;
    const controlOneY = startY + deltaY * 0.2 - bend;
    const controlTwoX = startX + deltaX * 0.62;
    const controlTwoY = startY + deltaY * 0.82 + bend * 0.35;

    annotationLine.setAttribute("viewBox", `0 0 ${sceneRect.width} ${sceneRect.height}`);
    annotationPath.setAttribute(
      "d",
      `M ${startX.toFixed(1)} ${startY.toFixed(1)} C ${controlOneX.toFixed(1)} ${controlOneY.toFixed(1)}, ${controlTwoX.toFixed(1)} ${controlTwoY.toFixed(1)}, ${endX.toFixed(1)} ${endY.toFixed(1)}`,
    );
  };

  const activate = (item, announce = false) => {
    clearDismissTimer();

    if (activeItem === item) {
      setAnnotationPosition();

      if (announce) {
        status.textContent = `${getItemName(item)} selected. ${item.dataset.description}`;
      }

      return;
    }

    if (activeItem && activeItem !== item) {
      activeItem.classList.remove("is-active");
      activeItem.removeAttribute("aria-describedby");
    }

    scene.classList.remove("has-active-item");
    activeItem = item;
    const name = getItemName(item);

    item.classList.add("is-active");
    item.setAttribute("aria-describedby", "workbench-active-description");
    annotationTitle.textContent = name;
    annotationDescription.textContent = item.dataset.description;
    annotationDescription.id = "workbench-active-description";
    annotationLink.href = item.href;
    annotationLink.textContent = `View ${name}`;
    annotation.hidden = false;
    setAnnotationPosition();
    annotationPath.getBoundingClientRect();

    window.requestAnimationFrame(() => {
      if (activeItem === item) {
        scene.classList.add("has-active-item");
      }
    });

    if (announce) {
      status.textContent = `${name} selected. ${item.dataset.description}`;
    }
  };

  const dismiss = () => {
    clearDismissTimer();

    if (!activeItem) {
      return;
    }

    activeItem.classList.remove("is-active");
    activeItem.removeAttribute("aria-describedby");
    activeItem = null;
    scene.classList.remove("has-active-item");
    annotation.hidden = true;
    annotation.removeAttribute("style");
    annotationPath.removeAttribute("d");
    status.textContent = "";
  };

  const scheduleDismiss = () => {
    clearDismissTimer();
    hoverDismissTimer = window.setTimeout(() => {
      const focusedElement = document.activeElement;

      if (
        activeItem === focusedElement ||
        annotation.contains(focusedElement) ||
        (activeItem && activeItem.matches(":hover")) ||
        annotation.matches(":hover")
      ) {
        return;
      }

      dismiss();
    }, 120);
  };

  scene.addEventListener("pointerover", (event) => {
    const item = event.target.closest("[data-workbench-item]");

    if (
      !item ||
      event.pointerType === "touch" ||
      (!event.pointerType && coarsePointer.matches)
    ) {
      return;
    }

    activate(item);
  });

  scene.addEventListener("pointerout", (event) => {
    const item = event.target.closest("[data-workbench-item]");

    if (
      !item ||
      event.pointerType === "touch" ||
      (!event.pointerType && coarsePointer.matches)
    ) {
      return;
    }

    if (item.contains(event.relatedTarget) || annotation.contains(event.relatedTarget)) {
      return;
    }

    scheduleDismiss();
  });

  scene.addEventListener("focusin", (event) => {
    const item = event.target.closest("[data-workbench-item]");

    if (item) {
      activate(item);
    } else if (annotation.contains(event.target)) {
      clearDismissTimer();
    }
  });

  scene.addEventListener("focusout", () => {
    window.setTimeout(() => {
      if (!scene.contains(document.activeElement)) {
        dismiss();
      }
    }, 0);
  });

  scene.addEventListener("pointerdown", (event) => {
    lastPointerType = event.pointerType;
  });

  scene.addEventListener("click", (event) => {
    const item = event.target.closest("[data-workbench-item]");

    if (!item || event.detail === 0) {
      return;
    }

    const usesTouchSelection =
      lastPointerType === "touch" ||
      (lastPointerType !== "mouse" && coarsePointer.matches);
    lastPointerType = "";

    if (usesTouchSelection) {
      event.preventDefault();
      activate(item, true);
    }
  });

  annotation.addEventListener("pointerenter", clearDismissTimer);
  annotation.addEventListener("pointerleave", (event) => {
    if (
      event.pointerType !== "touch" &&
      (event.pointerType === "mouse" || !coarsePointer.matches)
    ) {
      scheduleDismiss();
    }
  });

  document.addEventListener("pointerdown", (event) => {
    if (
      activeItem &&
      (event.pointerType === "touch" ||
        (event.pointerType !== "mouse" && coarsePointer.matches)) &&
      !activeItem.contains(event.target) &&
      !annotation.contains(event.target)
    ) {
      dismiss();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && activeItem) {
      dismiss();
    }
  });

  const refreshPosition = () => window.requestAnimationFrame(setAnnotationPosition);
  window.addEventListener("resize", refreshPosition);

  if (typeof mobileLayout.addEventListener === "function") {
    mobileLayout.addEventListener("change", refreshPosition);
  } else {
    mobileLayout.addListener(refreshPosition);
  }

  if ("ResizeObserver" in window) {
    new ResizeObserver(refreshPosition).observe(scene);
  }

  scene.classList.add("is-enhanced");
})();
