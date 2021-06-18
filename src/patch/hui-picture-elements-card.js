import { applyToElement } from "../helpers";
customElements.whenDefined("hui-picture-elements-card").then(() => {
    const HuiPictureElementsCard = customElements.get("hui-picture-elements-card");
    if (HuiPictureElementsCard.prototype.cardmod_patched)
        return;
    HuiPictureElementsCard.prototype.cardmod_patched = true;
    const _setConfig = HuiPictureElementsCard.prototype.setConfig;
    HuiPictureElementsCard.prototype.setConfig = function (config) {
        var _a, _b;
        _setConfig === null || _setConfig === void 0 ? void 0 : _setConfig.bind(this)(config);
        for (const [i, el] of this._elements.entries()) {
            const config = this._config.elements[i];
            if ((_a = config === null || config === void 0 ? void 0 : config.card_mod) === null || _a === void 0 ? void 0 : _a.class)
                el.classList.add(config.card_mod.class);
            if (config === null || config === void 0 ? void 0 : config.type)
                el.classList.add(`type-${config.type.replace(":", "-")}`);
            applyToElement(el, "element", (_b = config === null || config === void 0 ? void 0 : config.card_mod) === null || _b === void 0 ? void 0 : _b.style, { config });
        }
    };
});
