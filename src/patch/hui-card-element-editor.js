customElements.whenDefined("hui-card-element-editor").then(() => {
    const HuiCardElementEditor = customElements.get("hui-card-element-editor");
    if (HuiCardElementEditor.prototype.cardmod_patched)
        return;
    HuiCardElementEditor.prototype.cardmod_patched = true;
    const _getConfigElement = HuiCardElementEditor.prototype.getConfigElement;
    HuiCardElementEditor.prototype.getConfigElement = async function () {
        const retval = await _getConfigElement.bind(this)();
        // Catch and patch the configElement
        if (retval) {
            const _setConfig = retval.setConfig;
            retval.setConfig = function (config) {
                var _a, _b;
                // Strip card_mod from the data that's sent to the config element
                // and put it back after the config has been checked
                const newConfig = JSON.parse(JSON.stringify(config));
                this._cardModData = {
                    card: newConfig.card_mod,
                    entities: [],
                };
                if (newConfig.entities) {
                    for (const [i, e] of (_a = newConfig.entities) === null || _a === void 0 ? void 0 : _a.entries()) {
                        this._cardModData.entities[i] = e.card_mod;
                        delete e.card_mod;
                    }
                }
                delete newConfig.card_mod;
                _setConfig.bind(this)(newConfig);
                if (newConfig.entities) {
                    for (const [i, e] of (_b = newConfig.entities) === null || _b === void 0 ? void 0 : _b.entries()) {
                        if (this._cardModData.entities[i])
                            e.card_mod = this._cardModData.entities[i];
                    }
                }
            };
        }
        return retval;
    };
    const _handleUIConfigChanged = HuiCardElementEditor.prototype._handleUIConfigChanged;
    HuiCardElementEditor.prototype._handleUIConfigChanged = function (ev) {
        if (this._configElement && this._configElement._cardModData) {
            const cardMod = this._configElement._cardModData;
            if (cardMod.card)
                ev.detail.config.card_mod = cardMod.card;
        }
        _handleUIConfigChanged.bind(this)(ev);
    };
});
customElements.whenDefined("hui-dialog-edit-card").then(() => {
    const HuiDialogEditCard = customElements.get("hui-dialog-edit-card");
    if (HuiDialogEditCard.prototype.cardmod_patched)
        return;
    HuiDialogEditCard.prototype.cardmod_patched = true;
    const _updated = HuiDialogEditCard.prototype.updated;
    HuiDialogEditCard.prototype.updated = function (changedProps) {
        _updated === null || _updated === void 0 ? void 0 : _updated.bind(this)(changedProps);
        this.updateComplete.then(async () => {
            var _a, _b, _c;
            if (!this._cardModIcon) {
                this._cardModIcon = document.createElement("ha-icon");
                this._cardModIcon.icon = "mdi:brush";
            }
            const button = this.shadowRoot.querySelector("mwc-button[slot=secondaryAction]");
            if (!button)
                return;
            button.appendChild(this._cardModIcon);
            if (((_a = this._cardConfig) === null || _a === void 0 ? void 0 : _a.card_mod) ||
                ((_c = (_b = this._cardConfig) === null || _b === void 0 ? void 0 : _b.entities) === null || _c === void 0 ? void 0 : _c.some((e) => e.card_mod))) {
                this._cardModIcon.style.visibility = "visible";
            }
            else {
                this._cardModIcon.style.visibility = "hidden";
            }
        });
    };
});
export {};
