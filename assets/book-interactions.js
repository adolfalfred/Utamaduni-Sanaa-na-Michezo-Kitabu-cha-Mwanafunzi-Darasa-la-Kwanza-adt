(function () {
  "use strict";

  function storageKey(control) {
    var pageName = window.location.pathname.split("/").pop().replace(/\.html?$/i, "");
    return pageName + "_" + control.getAttribute("data-aria-id");
  }

  function resetNoticeKey(activity) {
    var pageName = window.location.pathname.split("/").pop().replace(/\.html?$/i, "");
    return "adt-reset:" + pageName + ":" + activity.getAttribute("data-activity-id");
  }

  function setFeedback(activity, message, state) {
    var feedback = activity.querySelector("[data-activity-feedback]");
    if (!feedback) return;
    feedback.textContent = message;
    feedback.dataset.state = state || "";
  }

  function initialiseActivity(activity) {
    var responses = Array.prototype.slice.call(activity.querySelectorAll("[data-response]"));
    try {
      if (window.sessionStorage.getItem(resetNoticeKey(activity))) {
        window.sessionStorage.removeItem(resetNoticeKey(activity));
        setFeedback(activity, "Majibu yamefutwa. Unaweza kuanza tena.", "");
      }
    } catch (_error) {
      // The activity remains usable when browser storage is unavailable.
    }

    var reset = activity.querySelector("[data-reset-activity]");
    if (reset) {
      reset.addEventListener("click", function () {
        responses.forEach(function (control) {
          control.value = "";
          try {
            window.localStorage.removeItem(storageKey(control));
          } catch (_error) {
            // Nothing else is required when browser storage is unavailable.
          }
          control.dispatchEvent(new Event("input", { bubbles: true }));
          control.dispatchEvent(new Event("change", { bubbles: true }));
        });
        try {
          window.sessionStorage.setItem(resetNoticeKey(activity), "1");
        } catch (_error) {
          // The page can still reload into its cleared state without a notice.
        }
        window.location.reload();
      });
    }
  }

  function initialise(root) {
    root.querySelectorAll("[data-activity-id]").forEach(initialiseActivity);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      initialise(document);
    });
  } else {
    initialise(document);
  }
})();
