//// SPDX-License-Identifier: AGPL-3.0-or-later
//// Copyright (C) 2020-2026 Fluxer Contributors
//// Copyright (C) 2026 Floodilka Contributors
//// Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.

import lustre/attribute as a
import lustre/element
import lustre/element/html as h

pub fn script_tag() -> element.Element(a) {
  h.script([a.attribute("defer", "defer")], script())
}

pub fn script() -> String {
  "
(function () {
  var globalKeyboardMode = false;
  var activeDeck = null;

  function isEditable(el) {
    if (!el) return false;
    var tag = el.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
    return el.isContentEditable;
  }

  function triggerAction(deck, direction) {
    if (!deck) return;
    var event = new CustomEvent('review:keyboard', {
      detail: { direction: direction },
      bubbles: true,
      cancelable: true
    });
    deck.dispatchEvent(event);
  }

  function onGlobalKeyDown(e) {
    if (!globalKeyboardMode) return;
    if (!activeDeck) return;
    if (isEditable(e.target)) return;

    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      e.stopPropagation();
      triggerAction(activeDeck, 'left');
      return;
    }

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      e.stopPropagation();
      triggerAction(activeDeck, 'right');
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      disableKeyboardMode();
      return;
    }
  }

  function enableKeyboardMode(deckElement) {
    if (!deckElement) return;
    activeDeck = deckElement;
    globalKeyboardMode = true;
    deckElement.setAttribute('data-keyboard-mode', 'true');
  }

  function disableKeyboardMode() {
    if (activeDeck) {
      activeDeck.removeAttribute('data-keyboard-mode');
    }
    globalKeyboardMode = false;
    activeDeck = null;
  }

  window.floodilkaReviewKeyboard = {
    enable: enableKeyboardMode,
    disable: disableKeyboardMode,
    isEnabled: function () { return globalKeyboardMode; },
    getActiveDeck: function () { return activeDeck; }
  };

  document.addEventListener('keydown', onGlobalKeyDown, { capture: true });
})();
"
}
