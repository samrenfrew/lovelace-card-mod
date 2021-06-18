var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, property } from "lit-element";
import { bind_template, unbind_template } from "./templates";
import { hasTemplate } from "card-tools/src/templates";
import pjson from "../package.json";
import { selectTree } from "card-tools/src/helpers";
import { applyToElement, compare_deep, get_theme, merge_deep, parentElement, } from "./helpers";
export class CardMod extends LitElement {
    constructor() {
        super();
        this._rendered_styles = "";
        this._styleChildren = new Set();
        this._observer = new MutationObserver((mutations) => {
            for (const m of mutations) {
                if (m.target.localName === "card-mod")
                    return;
                let stop = true;
                if (m.addedNodes.length)
                    m.addedNodes.forEach((n) => {
                        if (n.localName !== "card-mod")
                            stop = false;
                    });
                if (stop)
                    return;
                stop = true;
                if (m.removedNodes.length)
                    m.removedNodes.forEach((n) => {
                        if (n.localName !== "card-mod")
                            stop = false;
                    });
                if (stop)
                    return;
            }
            this.refresh();
        });
        document.addEventListener("cm_update", () => {
            this.refresh();
        });
    }
    static get applyToElement() {
        return applyToElement;
    }
    connectedCallback() {
        super.connectedCallback();
        this._connect();
        this.setAttribute("slot", "none");
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this._disconnect();
    }
    set styles(stl) {
        if (compare_deep(stl, this._input_styles))
            return;
        this._input_styles = stl;
        this._connect();
    }
    get styles() {
        return this._styles;
    }
    refresh() {
        this._connect();
    }
    async _connect() {
        const stl = this._input_styles;
        // Always work with yaml styles
        let styles = JSON.parse(JSON.stringify(stl || {}));
        if (typeof styles === "string")
            styles = { ".": styles };
        // Merge card_mod styles with theme styles
        const theme_styles = await get_theme(this);
        merge_deep(styles, theme_styles);
        const styleChildren = new Set();
        let thisStyle;
        const parent = this.parentElement || this.parentNode;
        if (!styles["."])
            thisStyle = "";
        for (const [key, value] of Object.entries(styles)) {
            if (key === ".") {
                thisStyle = value;
            }
            else {
                const elements = await selectTree(parent, key, true);
                if (!elements)
                    continue;
                for (const el of elements) {
                    if (el) {
                        const child = await applyToElement(el, `${this.type}-child`, value, this.variables, null, false);
                        child.refresh();
                        styleChildren.add(child);
                    }
                }
            }
        }
        for (const oldCh of this._styleChildren) {
            if (!styleChildren.has(oldCh)) {
                if (oldCh)
                    oldCh.styles = "";
            }
        }
        this._styleChildren = styleChildren;
        if (this._styles === thisStyle)
            return;
        this._styles = thisStyle;
        if (this._styles && hasTemplate(this._styles)) {
            this._renderer = this._renderer || this._style_rendered.bind(this);
            bind_template(this._renderer, this._styles, this.variables);
        }
        else {
            this._style_rendered(this._styles || "");
        }
        this._observer.observe(parentElement(this), { childList: true });
    }
    async _disconnect() {
        this._observer.disconnect();
        this._styles = "";
        await unbind_template(this._renderer);
    }
    _style_rendered(result) {
        this._rendered_styles = result;
        this.dispatchEvent(new Event("card-mod-update"));
    }
    createRenderRoot() {
        return this;
    }
    render() {
        return html `
      <style>
        ${this._rendered_styles}
      </style>
    `;
    }
}
__decorate([
    property()
], CardMod.prototype, "_rendered_styles", void 0);
if (!customElements.get("card-mod")) {
    customElements.define("card-mod", CardMod);
    console.info(`%cCARD-MOD ${pjson.version} IS INSTALLED`, "color: green; font-weight: bold", "");
}
