(function () {
  const githubProjectPath = "/real-estate-starter";
  const isGitHubProjectPage = window.location.pathname === githubProjectPath
    || window.location.pathname.startsWith(`${githubProjectPath}/`);

  window.sitePath = function sitePath(path) {
    if (!path || /^(?:[a-z]+:|#|\/\/)/i.test(path)) return path;

    const normalizedPath = String(path).replace(/^\/+/, "");
    return `${isGitHubProjectPage ? githubProjectPath : ""}/${normalizedPath}`;
  };

  if (!isGitHubProjectPage) return;

  const siteAttributes = ["href", "src", "action"];

  function fixElementPath(element) {
    siteAttributes.forEach((attribute) => {
      const value = element.getAttribute?.(attribute);
      if (value?.startsWith("/") && !value.startsWith("//") && !value.startsWith(`${githubProjectPath}/`)) {
        element.setAttribute(attribute, window.sitePath(value));
      }
    });
  }

  function fixPaths(root) {
    if (root.nodeType === Node.ELEMENT_NODE) fixElementPath(root);
    root.querySelectorAll?.('[href^="/"], [src^="/"], [action^="/"]').forEach(fixElementPath);
  }

  new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "attributes") fixElementPath(mutation.target);
      mutation.addedNodes.forEach(fixPaths);
    });
  }).observe(document.documentElement, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: siteAttributes
  });

  document.addEventListener("DOMContentLoaded", () => fixPaths(document));
})();
