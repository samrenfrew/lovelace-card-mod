import { applyToElement } from "../helpers";
customElements.whenDefined("hui-state-label-badge").then(() => {
    const HuiStateLabelBadge = customElements.get("hui-state-label-badge");
    if (HuiStateLabelBadge.prototype.cardmod_patched)
        return;
    HuiStateLabelBadge.prototype.cardmod_patched = true;
    const _firstUpdated = HuiStateLabelBadge.prototype.firstUpdated;
    HuiStateLabelBadge.prototype.firstUpdated = function (changedProperties) {
        var _a, _b;
        _firstUpdated === null || _firstUpdated === void 0 ? void 0 : _firstUpdated.bind(this)(changedProperties);
        const config = this._config;
        if ((_a = config === null || config === void 0 ? void 0 : config.card_mod) === null || _a === void 0 ? void 0 : _a.class)
            this.classList.add(config.card_mod.class);
        applyToElement(this, "badge", ((_b = config === null || config === void 0 ? void 0 : config.card_mod) === null || _b === void 0 ? void 0 : _b.style) || (config === null || config === void 0 ? void 0 : config.style) || "", {
            config,
        });
    };
});
