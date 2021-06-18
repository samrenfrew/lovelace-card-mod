import { selectTree } from "card-tools/src/helpers";
import { applyToElement } from "../helpers";
customElements.whenDefined("ha-sidebar").then(() => {
    const HaSidebar = customElements.get("ha-sidebar");
    if (HaSidebar.prototype.cardmod_patched)
        return;
    HaSidebar.prototype.cardmod_patched = true;
    const _firstUpdated = HaSidebar.prototype.firstUpdated;
    HaSidebar.prototype.firstUpdated = async function (changedProperties) {
        _firstUpdated === null || _firstUpdated === void 0 ? void 0 : _firstUpdated.bind(this)(changedProperties);
        applyToElement(this, "sidebar");
    };
    selectTree(document, "home-assistant$home-assistant-main$app-drawer-layout app-drawer ha-sidebar", false).then((root) => root === null || root === void 0 ? void 0 : root.firstUpdated());
});
