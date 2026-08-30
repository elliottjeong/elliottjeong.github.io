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

  const connectHotspotData = (root = explorer) => {
    data.hotspots.forEach((hotspot) => {
      const shape = root.querySelector(`[data-hotspot-id="${hotspot.id}"]`);
      const region = regionById.get(hotspot.regionId);

      if (!shape || !region) {
        return;
      }

      shape.classList.toggle("is-unavailable", region.availability !== "available");
      shape.dataset.availability = region.availability;
    });
  };

  const connectEmbeddedMaps = () => {
    const selectHotspot = (hotspotId) => {
      const hotspot = data.hotspots.find((entry) => entry.id === hotspotId);

      if (!hotspot) {
        return;
      }

      state.selectedHotspot = hotspotId;

      explorer.querySelectorAll("[data-body-svg]").forEach((illustration) => {
        illustration.contentDocument?.querySelectorAll("[data-hotspot-id]").forEach((shape) => {
          shape.classList.toggle("is-selected", shape.dataset.hotspotId === hotspotId);
        });
      });

      explorer.querySelectorAll(".body-region-directory__item").forEach((item) => {
        item.classList.toggle("is-selected", item.id === `region-${hotspot.regionId}`);
      });

      status.textContent = `${hotspot.label} selected. ${hotspot.description}.`;
    };

    explorer.querySelectorAll("[data-body-svg]").forEach((illustration) => {
      const connect = () => {
        if (illustration.contentDocument) {
          connectHotspotData(illustration.contentDocument);

          illustration.contentDocument.querySelectorAll("[data-hotspot-id]").forEach((shape) => {
            if (shape.dataset.interactionConnected === "true") {
              return;
            }

            const activate = () => selectHotspot(shape.dataset.hotspotId);
            shape.addEventListener("click", activate);
            shape.addEventListener("keydown", (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                activate();
              }
            });
            shape.dataset.interactionConnected = "true";
          });
        }
      };

      illustration.addEventListener("load", connect);
      connect();
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
    state.selectedHotspot = null;
    state.selectedResource = null;

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
  connectEmbeddedMaps();
  explorer.classList.add("is-enhanced");
  readHash();
})();
