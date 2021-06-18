import { LitElement, html } from "lit-element";
import { createCard } from "card-tools/src/lovelace-element";
import { hass } from "card-tools/src/hass";
const NO_STYLE = `
ha-card {
  background: none;
  box-shadow: none;
}`;
class ModCard extends LitElement {
    static get properties() {
        return {
            hass: {},
        };
    }
    setConfig(config) {
        var _a;
        this._config = JSON.parse(JSON.stringify(config));
        let style = ((_a = this._config.card_mod) === null || _a === void 0 ? void 0 : _a.style) || this._config.style;
        if (style === undefined) {
            style = NO_STYLE;
        }
        else if (typeof style === "string") {
            style = NO_STYLE + style;
        }
        else if (style["."]) {
            style["."] = NO_STYLE + style["."];
        }
        else {
            style["."] = NO_STYLE;
        }
        this._config.card_mod = { style };
        this.card = createCard(config.card);
        this.card.hass = hass();
    }
    firstUpdated() {
        window.setTimeout(() => {
            var _a, _b;
            if ((_b = (_a = this.card) === null || _a === void 0 ? void 0 : _a.shadowRoot) === null || _b === void 0 ? void 0 : _b.querySelector("ha-card")) {
                console.info("%cYou are doing it wrong!", "color: red; font-weight: bold", "");
                let cardName = this.card.localName.replace(/hui-(.*)-card/, "$1");
                console.info(`mod-card should NEVER be used with a card that already has a ha-card element, such as ${cardName}`);
            }
        }, 3000);
    }
    render() {
        return html ` <ha-card modcard> ${this.card} </ha-card> `;
    }
    set hass(hass) {
        if (!this.card)
            return;
        this.card.hass = hass;
    }
    getCardSize() {
        if (this._config.report_size)
            return this._config.report_size;
        let ret = this.shadowRoot;
        if (ret)
            ret = ret.querySelector("ha-card card-maker");
        if (ret)
            ret = ret.getCardSize;
        if (ret)
            ret = ret();
        if (ret)
            return ret;
        return 1;
    }
}
customElements.define("mod-card", ModCard);
