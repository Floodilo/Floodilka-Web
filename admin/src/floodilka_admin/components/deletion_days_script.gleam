//// SPDX-License-Identifier: AGPL-3.0-or-later
//// Copyright (C) 2020-2026 Fluxer Contributors
//// Copyright (C) 2026 Floodilka Contributors
//// Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.

import lustre/attribute as a
import lustre/element/html as h

pub fn render() {
  let script =
    "(function(){const configs=[{selectId:'user-deletion-reason',inputId:'user-deletion-days'},{selectId:'bulk-deletion-reason',inputId:'bulk-deletion-days'}];const userReason='1';const userMin=14;const defaultMin=60;const update=(select,input)=>{const min=select.value===userReason?userMin:defaultMin;input.min=min.toString();const current=parseInt(input.value,10);if(isNaN(current)||current<min){input.value=min.toString();}};configs.forEach(({selectId,inputId})=>{const select=document.getElementById(selectId);const input=document.getElementById(inputId);if(!select||!input){return;}select.addEventListener('change',()=>update(select,input));update(select,input);});})();"

  h.script([a.attribute("defer", "defer")], script)
}
