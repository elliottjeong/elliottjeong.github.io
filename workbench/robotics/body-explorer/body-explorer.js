(() => {
  const explorer = document.querySelector("[data-body-explorer]");
  const data = window.BODY_EXPLORER_DATA;

  if (!explorer || !data) {
    return;
  }

  const compactLayout = window.matchMedia("(max-width: 720px)");
  const orientationControls = explorer.querySelector("[data-body-orientation-controls]");
  const orientationButtons = Array.from(explorer.querySelectorAll("[data-orientation]"));
  const bodyViews = Array.from(explorer.querySelectorAll("[data-body-view]"));
  const status = explorer.querySelector("[data-body-status]");
  const selection = explorer.querySelector("[data-body-selection]");
  const state = {
    currentView: "body",
    orientation: "front",
    selectedHotspot: null,
    selectedResource: null,
  };

  const regionById = new Map(data.regions.map((region) => [region.id, region]));
  const bodyRegions = data.regions.filter((region) => region.parentId === "body");

  const makeElement = (name, className, text) => {
    const element = document.createElement(name);

    if (className) {
      element.className = className;
    }

    if (text) {
      element.textContent = text;
    }

    return element;
  };

  const renderDirectory = () => {
    const list = explorer.querySelector("[data-region-list]");

    if (!list) {
      return;
    }

    list.replaceChildren();

    bodyRegions.forEach((region) => {
      const item = makeElement("li", "body-region-directory__item");
      item.id = `region-${region.id}`;
      const label = makeElement("span", "body-region-directory__label", region.label);
      const stateLabel = makeElement("span", "body-region-directory__state", "Planned");
      item.append(label, stateLabel);
      list.append(item);
    });
  };

  const renderBasics = () => {
    const list = explorer.querySelector("[data-basic-resources]");

    if (!list) {
      return;
    }

    list.replaceChildren();

    data.resources.forEach((resource) => {
      const item = makeElement("li", "body-basics__item");
      const link = makeElement("a", "body-basics__link", resource.title);
      const meta = makeElement("span", "body-basics__meta", `${resource.source} · Taping technique`);
      link.href = resource.sourceUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      item.append(link, meta);
      list.append(item);
    });
  };

  const connectHotspotData = () => {
    data.hotspots.forEach((hotspot) => {
      const shape = explorer.querySelector(`[data-hotspot-id="${hotspot.id}"]`);
      const region = regionById.get(hotspot.regionId);

      if (!shape || !region) {
        return;
      }

      shape.classList.toggle("is-unavailable", region.availability !== "available");
      shape.dataset.availability = region.availability;
      shape.setAttribute("aria-pressed", "false");
    });
  };

  const connectHitMaps = () => {
    const setPairHighlight = (hotspotId, highlighted) => {
      const pair = hotspotId.match(/^(front|back)-(left|right)-(.+)$/);

      if (!pair) {
        return;
      }

      const [, orientation, , area] = pair;

      ["left", "right"].forEach((side) => {
        const shape = explorer.querySelector(`[data-hotspot-id="${orientation}-${side}-${area}"]`);
        shape?.classList.toggle("is-pair-highlighted", highlighted);
      });
    };

    const selectHotspot = (hotspotId) => {
      const hotspot = data.hotspots.find((entry) => entry.id === hotspotId);

      if (!hotspot) {
        return;
      }

      state.selectedHotspot = hotspotId;
      explorer.dataset.selectedHotspot = hotspotId;

      explorer.querySelectorAll("[data-hotspot-id]").forEach((shape) => {
        const isSelected = shape.dataset.hotspotId === hotspotId;
        shape.classList.toggle("is-selected", isSelected);
        shape.setAttribute("aria-pressed", String(isSelected));
      });

      explorer.querySelectorAll(".body-region-directory__item").forEach((item) => {
        item.classList.toggle("is-selected", item.id === `region-${hotspot.regionId}`);
      });

      const relatedResources = data.resources.filter((resource) => resource.hotspotIds.includes(hotspotId));
      const resourceMessage = relatedResources.length
        ? `${relatedResources.length} related ${relatedResources.length === 1 ? "resource" : "resources"} ready.`
        : "Related resources are planned.";

      if (selection) {
        selection.textContent = `${hotspot.label} selected. ${resourceMessage}`;
      }

      status.textContent = `${hotspot.label} selected. ${hotspot.description}.`;

      explorer.dispatchEvent(new CustomEvent("bodyexplorer:selectionchange", {
        detail: { hotspot, region: regionById.get(hotspot.regionId), resources: relatedResources },
      }));
    };

    explorer.querySelectorAll("[data-hotspot-id]").forEach((shape) => {
      const activate = () => selectHotspot(shape.dataset.hotspotId);
      const showPair = () => setPairHighlight(shape.dataset.hotspotId, true);
      const hidePair = () => setPairHighlight(shape.dataset.hotspotId, false);

      shape.addEventListener("pointerenter", showPair);
      shape.addEventListener("pointerleave", hidePair);
      shape.addEventListener("focus", showPair);
      shape.addEventListener("blur", hidePair);
      shape.addEventListener("click", activate);
      shape.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          activate();
        }
      });
    });
  };

  const parseHash = () => {
    const value = window.location.hash.slice(1);

    if (!value || value === "body") {
      return { currentView: "body", orientation: "front", canonical: "body" };
    }

    const match = value.match(/^body\/(front|back)$/);

    if (match) {
      return { currentView: "body", orientation: match[1], canonical: value };
    }

    return { currentView: "body", orientation: "front", canonical: "body" };
  };

  const syncViewVisibility = () => {
    const compact = compactLayout.matches;

    bodyViews.forEach((view) => {
      const isCurrent = view.dataset.bodyView === state.orientation;
      view.hidden = compact && !isCurrent;
      view.classList.toggle("is-current", isCurrent);
    });

    orientationControls.hidden = !compact;
  };

  const renderState = (announce = false) => {
    explorer.dataset.currentView = state.currentView;
    explorer.dataset.orientation = state.orientation;

    orientationButtons.forEach((button) => {
      const selected = button.dataset.orientation === state.orientation;
      button.setAttribute("aria-pressed", String(selected));
    });

    syncViewVisibility();

    if (announce) {
      status.textContent = `${state.orientation === "front" ? "Front" : "Back"} body view shown.`;
    }
  };

  const readHash = (announce = false) => {
    const next = parseHash();
    const canonicalHash = `#${next.canonical}`;

    state.currentView = next.currentView;
    state.orientation = next.orientation;
    if (window.location.hash !== canonicalHash) {
      window.history.replaceState(null, "", canonicalHash);
    }

    renderState(announce);
  };

  orientationControls.addEventListener("click", (event) => {
    const button = event.target.closest("[data-orientation]");

    if (!button || button.dataset.orientation === state.orientation) {
      return;
    }

    window.location.hash = `body/${button.dataset.orientation}`;
  });

  window.addEventListener("hashchange", () => readHash(true));

  const handleLayoutChange = () => syncViewVisibility();

  if (typeof compactLayout.addEventListener === "function") {
    compactLayout.addEventListener("change", handleLayoutChange);
  } else {
    compactLayout.addListener(handleLayoutChange);
  }

  renderDirectory();
  renderBasics();
  connectHotspotData();
  connectHitMaps();
  explorer.classList.add("is-enhanced");
  readHash();
})();
