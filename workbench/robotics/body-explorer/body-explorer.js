(() => {
  const explorer = document.querySelector("[data-body-explorer]");
  const data = window.BODY_EXPLORER_DATA;

  if (!explorer || !data) {
    return;
  }

  const compactLayout = window.matchMedia("(max-width: 720px)");
  const status = explorer.querySelector("[data-body-status]");
  const bodySelection = explorer.querySelector("[data-body-selection]");
  const bodyAction = explorer.querySelector("[data-body-action]");
  const detailHeading = explorer.querySelector("[data-resource-heading]");
  const detailDescription = explorer.querySelector("[data-resource-description]");
  const resourceList = explorer.querySelector("[data-resource-list]");
  const resourceEmpty = explorer.querySelector("[data-resource-empty]");
  const backToBodyLinks = Array.from(explorer.querySelectorAll("[data-back-to-body]"));
  const state = {
    currentView: "body",
    orientation: "front",
    selectedHotspot: null,
    selectedResource: null,
    returnBodyHash: "#body/front",
  };

  const regionById = new Map(data.regions.map((region) => [region.id, region]));
  const hotspotById = new Map(data.hotspots.map((hotspot) => [hotspot.id, hotspot]));
  const bodyRegions = data.regions.filter((region) => region.parentId === "body");
  const basicResources = data.resources.filter((resource) => resource.hotspotIds.length === 0);

  const makeElement = (name, className, text) => {
    const element = document.createElement(name);
    if (className) element.className = className;
    if (text) element.textContent = text;
    return element;
  };

  const setHash = (hash) => {
    if (window.location.hash === hash) {
      readHash(true);
      return;
    }
    window.location.hash = hash.slice(1);
  };

  const routeForDetailHotspot = (hotspot) =>
    `#${hotspot.regionId}/${hotspot.orientation}/${hotspot.routeId}`;

  const renderDirectory = () => {
    const list = explorer.querySelector("[data-region-list]");
    if (!list) return;

    list.replaceChildren();
    bodyRegions.forEach((region) => {
      const item = makeElement("li", "body-region-directory__item");
      item.id = `region-${region.id}`;
      const stateLabel = makeElement(
        "span",
        "body-region-directory__state",
        region.availability === "available" ? "Explore" : "Planned",
      );

      if (region.availability === "available") {
        const link = makeElement("a", "body-region-directory__label", region.label);
        link.href = `#${region.id}/${region.orientations[0]}`;
        item.append(link, stateLabel);
      } else {
        const label = makeElement("span", "body-region-directory__label", region.label);
        item.append(label, stateLabel);
      }
      list.append(item);
    });
  };

  const renderBasics = () => {
    const list = explorer.querySelector("[data-basic-resources]");
    if (!list) return;

    list.replaceChildren();
    basicResources.forEach((resource) => {
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
      if (!shape) return;

      shape.dataset.orientation = hotspot.orientation;
      shape.dataset.availability = hotspot.availability;
      if (hotspot.side) shape.dataset.side = hotspot.side;
      if (hotspot.regionId) shape.dataset.regionId = hotspot.regionId;
      if (hotspot.highlightGroupId) shape.dataset.highlightGroupId = hotspot.highlightGroupId;
      shape.classList.toggle("is-planned", hotspot.availability !== "available");
      shape.setAttribute("aria-pressed", "false");
    });
  };

  const setGroupHighlight = (hotspotId, highlighted) => {
    const hotspot = hotspotById.get(hotspotId);
    if (!hotspot?.highlightGroupId) return;

    data.hotspots
      .filter((entry) => entry.highlightGroupId === hotspot.highlightGroupId)
      .forEach((entry) => {
        explorer
          .querySelector(`[data-hotspot-id="${entry.id}"]`)
          ?.classList.toggle("is-pair-highlighted", highlighted);
      });
  };

  const parseHash = () => {
    let value = "";
    try {
      value = decodeURIComponent(window.location.hash.slice(1));
    } catch {
      value = "";
    }
    const segments = value.split("/").filter(Boolean);

    if (segments.length === 0 || segments[0] === "body") {
      const orientation = ["front", "back"].includes(segments[1]) ? segments[1] : "front";
      const hotspot = hotspotById.get(segments[2]);
      const selectedHotspot = hotspot?.viewId === `body-${orientation}` ? hotspot.id : null;
      return {
        currentView: "body",
        orientation,
        selectedHotspot,
        canonical: ["body", orientation, selectedHotspot].filter(Boolean).join("/"),
      };
    }

    if (segments[0] === "hand-wrist") {
      let orientation = ["palm", "dorsal"].includes(segments[1]) ? segments[1] : "palm";
      let routeId = segments[2] || null;

      if (!["palm", "dorsal"].includes(segments[1]) && segments[1]) {
        routeId = segments[1];
        orientation = "palm";
      }

      const hotspot = data.hotspots.find(
        (entry) => entry.regionId === "hand-wrist"
          && entry.orientation === orientation
          && entry.routeId === routeId,
      );
      return {
        currentView: "hand-wrist",
        orientation,
        selectedHotspot: hotspot?.id || null,
        canonical: ["hand-wrist", orientation, hotspot?.routeId].filter(Boolean).join("/"),
      };
    }

    return { currentView: "body", orientation: "front", selectedHotspot: null, canonical: "body/front" };
  };

  const renderOrientationControls = () => {
    explorer.querySelectorAll("[data-orientation-control]").forEach((control) => {
      const scope = control.dataset.orientationControl;
      const isBodyControl = scope === "body";
      control.hidden = isBodyControl
        ? state.currentView !== "body" || !compactLayout.matches
        : state.currentView !== scope;

      control.querySelectorAll("[data-orientation]").forEach((button) => {
        const selected = state.currentView === scope && button.dataset.orientation === state.orientation;
        button.setAttribute("aria-pressed", String(selected));
      });
    });
  };

  const renderViewVisibility = () => {
    explorer.querySelectorAll("[data-explorer-view]").forEach((view) => {
      view.hidden = view.dataset.explorerView !== state.currentView;
    });

    explorer.querySelectorAll("[data-body-view]").forEach((view) => {
      const isCurrent = view.dataset.bodyView === state.orientation;
      view.hidden = state.currentView !== "body" || (compactLayout.matches && !isCurrent);
      view.classList.toggle("is-current", isCurrent);
    });

    explorer.querySelectorAll("[data-detail-view]").forEach((view) => {
      const isCurrent = state.currentView === "hand-wrist" && view.dataset.detailView === state.orientation;
      view.hidden = !isCurrent;
      view.classList.toggle("is-current", isCurrent);
    });
  };

  const renderSelectedShapes = () => {
    explorer.querySelectorAll("[data-hotspot-id]").forEach((shape) => {
      const selected = shape.dataset.hotspotId === state.selectedHotspot;
      shape.classList.toggle("is-selected", selected);
      shape.setAttribute("aria-pressed", String(selected));
    });
  };

  const renderBodySelection = () => {
    if (!bodySelection || !bodyAction) return;

    const hotspot = hotspotById.get(state.selectedHotspot);
    explorer.querySelectorAll(".body-region-directory__item").forEach((item) => {
      item.classList.toggle("is-selected", Boolean(hotspot?.regionId) && item.id === `region-${hotspot.regionId}`);
    });

    bodyAction.hidden = true;
    if (!hotspot || state.currentView !== "body") {
      bodySelection.textContent = "Hover or focus a body area, then select it to see its coverage status.";
      return;
    }

    const region = regionById.get(hotspot.regionId);
    if (hotspot.availability === "available" && region) {
      bodySelection.textContent = `${hotspot.label} selected. The ${region.label} study plate and 2 resources are ready.`;
      bodyAction.href = `#${region.id}/${hotspot.orientation === "back" ? "dorsal" : "palm"}`;
      bodyAction.textContent = `Explore ${region.label}`;
      bodyAction.hidden = false;
    } else if (region) {
      bodySelection.textContent = `${hotspot.label} selected. The ${region.label} detail view is planned and is not available yet.`;
    } else {
      bodySelection.textContent = `${hotspot.label} selected. A matching resource collection is planned for a future release.`;
    }
  };

  const renderResourcePanel = () => {
    if (!detailHeading || !detailDescription || !resourceList || !resourceEmpty) return;
    resourceList.replaceChildren();
    state.selectedResource = null;

    const hotspot = hotspotById.get(state.selectedHotspot);
    if (state.currentView !== "hand-wrist" || !hotspot) {
      detailHeading.textContent = "Choose a wrist area";
      detailDescription.textContent = "Select a highlighted area on the hand illustration to see related learning material.";
      resourceEmpty.hidden = false;
      resourceList.hidden = true;
      return;
    }

    const resources = data.resources.filter((resource) => resource.hotspotIds.includes(hotspot.id));
    detailHeading.textContent = hotspot.label;
    detailDescription.textContent = hotspot.description;
    resourceEmpty.hidden = resources.length > 0;
    resourceList.hidden = resources.length === 0;

    resources.forEach((resource) => {
      const card = makeElement("article", "body-resource-card");
      card.dataset.resourceId = resource.id;

      const media = makeElement("div", "body-resource-card__media");
      const thumbnail = makeElement("img", "body-resource-card__thumbnail");
      thumbnail.src = `https://i.ytimg.com/vi/${resource.videoId}/hqdefault.jpg`;
      thumbnail.alt = "";
      thumbnail.width = 480;
      thumbnail.height = 360;
      thumbnail.loading = "lazy";
      const play = makeElement("button", "body-resource-card__play", "Play video");
      play.type = "button";
      play.dataset.playResource = resource.id;
      play.setAttribute("aria-label", `Play ${resource.title} video`);
      media.append(thumbnail, play);

      const copy = makeElement("div", "body-resource-card__copy");
      const type = makeElement("p", "body-resource-card__type", "Taping technique");
      const title = makeElement("h4", "body-resource-card__title", resource.title);
      const related = makeElement(
        "p",
        "body-resource-card__related",
        `A condition sometimes associated with this region: ${resource.relatedState}`,
      );
      const source = makeElement("p", "body-resource-card__source", `Published by ${resource.source}`);
      const external = makeElement("a", "body-resource-card__external", "Open on YouTube ↗");
      external.href = resource.sourceUrl;
      external.target = "_blank";
      external.rel = "noopener noreferrer";
      copy.append(type, title, related, source, external);
      card.append(media, copy);
      resourceList.append(card);
    });
  };

  const playResource = (resourceId) => {
    const resource = data.resources.find((entry) => entry.id === resourceId);
    const card = resourceList?.querySelector(`[data-resource-id="${resourceId}"]`);
    const media = card?.querySelector(".body-resource-card__media");
    if (!resource || !media || media.querySelector("iframe")) return;

    const frame = document.createElement("iframe");
    frame.className = "body-resource-card__video";
    frame.src = `https://www.youtube-nocookie.com/embed/${resource.videoId}?rel=0`;
    frame.title = `${resource.title} by ${resource.source}`;
    frame.allow = "accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    frame.allowFullscreen = true;
    frame.referrerPolicy = "strict-origin-when-cross-origin";
    media.replaceChildren(frame);
    state.selectedResource = resourceId;
    status.textContent = `${resource.title} video loaded. Playback has not started automatically.`;
  };

  const renderState = (announce = false) => {
    explorer.dataset.currentView = state.currentView;
    explorer.dataset.orientation = state.orientation;
    explorer.dataset.selectedHotspot = state.selectedHotspot || "";
    renderViewVisibility();
    renderOrientationControls();
    renderSelectedShapes();
    renderBodySelection();
    renderResourcePanel();
    backToBodyLinks.forEach((link) => {
      link.href = state.returnBodyHash;
    });

    if (announce) {
      const hotspot = hotspotById.get(state.selectedHotspot);
      if (hotspot) {
        status.textContent = `${hotspot.label} selected. ${hotspot.description}.`;
      } else {
        const label = state.orientation === "dorsal" ? "Back of hand" : state.orientation[0].toUpperCase() + state.orientation.slice(1);
        status.textContent = `${label} view shown.`;
      }
    }
  };

  function readHash(announce = false) {
    const next = parseHash();
    const canonicalHash = `#${next.canonical}`;

    state.currentView = next.currentView;
    state.orientation = next.orientation;
    state.selectedHotspot = next.selectedHotspot;
    if (next.currentView === "body") state.returnBodyHash = canonicalHash;
    if (window.location.hash !== canonicalHash) window.history.replaceState(null, "", canonicalHash);
    renderState(announce);
  }

  explorer.addEventListener("pointerover", (event) => {
    const shape = event.target.closest("[data-hotspot-id]");
    if (shape) setGroupHighlight(shape.dataset.hotspotId, true);
  });

  explorer.addEventListener("pointerout", (event) => {
    const shape = event.target.closest("[data-hotspot-id]");
    if (shape) setGroupHighlight(shape.dataset.hotspotId, false);
  });

  explorer.addEventListener("focusin", (event) => {
    const shape = event.target.closest("[data-hotspot-id]");
    if (shape) setGroupHighlight(shape.dataset.hotspotId, true);
  });

  explorer.addEventListener("focusout", (event) => {
    const shape = event.target.closest("[data-hotspot-id]");
    if (shape) setGroupHighlight(shape.dataset.hotspotId, false);
  });

  const activateShape = (shape) => {
    const hotspot = hotspotById.get(shape.dataset.hotspotId);
    if (!hotspot) return;
    const hash = hotspot.viewId.startsWith("body-")
      ? `#body/${hotspot.orientation}/${hotspot.id}`
      : routeForDetailHotspot(hotspot);
    setHash(hash);
  };

  explorer.addEventListener("click", (event) => {
    const shape = event.target.closest("[data-hotspot-id]");
    if (shape) {
      activateShape(shape);
      return;
    }

    const orientationButton = event.target.closest("[data-orientation]");
    if (orientationButton) {
      const scope = orientationButton.closest("[data-orientation-control]")?.dataset.orientationControl;
      const orientation = orientationButton.dataset.orientation;
      if (scope === "body") {
        setHash(`#body/${orientation}`);
      } else if (scope === "hand-wrist") {
        const currentHotspot = hotspotById.get(state.selectedHotspot);
        const matchingHotspot = currentHotspot && data.hotspots.find(
          (entry) => entry.regionId === "hand-wrist"
            && entry.orientation === orientation
            && entry.routeId === currentHotspot.routeId,
        );
        setHash(matchingHotspot ? routeForDetailHotspot(matchingHotspot) : `#hand-wrist/${orientation}`);
      }
      return;
    }

    const playButton = event.target.closest("[data-play-resource]");
    if (playButton) playResource(playButton.dataset.playResource);
  });

  explorer.addEventListener("keydown", (event) => {
    const shape = event.target.closest("[data-hotspot-id]");
    if (shape && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      activateShape(shape);
    }
  });

  window.addEventListener("hashchange", () => readHash(true));
  const handleLayoutChange = () => {
    renderViewVisibility();
    renderOrientationControls();
  };
  if (typeof compactLayout.addEventListener === "function") {
    compactLayout.addEventListener("change", handleLayoutChange);
  } else {
    compactLayout.addListener(handleLayoutChange);
  }

  renderDirectory();
  renderBasics();
  connectHotspotData();
  explorer.classList.add("is-enhanced");
  readHash();
})();
