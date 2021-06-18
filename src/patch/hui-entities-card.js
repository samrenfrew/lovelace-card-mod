import { applyToElement } from "../helpers";
customElements.whenDefined("hui-entities-card").then(() => {
    const EntitiesCard = customElements.get("hui-entities-card");
    if (EntitiesCard.prototype.cardmod_patched)
        return;
    EntitiesCard.prototype.cardmod_patched = true;
    const _renderEntity = EntitiesCard.prototype.renderEntity;
    EntitiesCard.prototype.renderEntity = function (config) {
        var _a;
        const retval = _renderEntity.bind(this)(config);
        if (!retval || !retval.values)
            return retval;
        const row = retval.values[0];
        if (!row)
            return retval;
        if ((_a = config === null || config === void 0 ? void 0 : config.card_mod) === null || _a === void 0 ? void 0 : _a.class)
            row.classList.add(config.card_mod.class);
        if (config === null || config === void 0 ? void 0 : config.type)
            row.classList.add(`type-${config.type.replace(":", "-")}`);
        const apply = () => {
            var _a;
            return applyToElement(row, "row", ((_a = config === null || config === void 0 ? void 0 : config.card_mod) === null || _a === void 0 ? void 0 : _a.style) || (config === null || config === void 0 ? void 0 : config.style) || "", { config });
        };
        this.updateComplete.then(() => apply());
        if (retval.values[0])
            retval.values[0].addEventListener("ll-rebuild", apply);
        return retval;
    };
});
