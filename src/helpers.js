import { hass } from "card-tools/src/hass";
import { yaml2json } from "card-tools/src/yaml";
export async function applyToElement(el, type, styles = "", variables = {}, entity_ids = null, // deprecated
shadow = true) {
    var _a;
    if ((_a = el.localName) === null || _a === void 0 ? void 0 : _a.includes("-"))
        await customElements.whenDefined(el.localName);
    if (el.updateComplete)
        await el.updateComplete;
    if (el._cardMod === undefined) {
        el._cardMod = [];
    }
    let cardMod;
    for (const cm of el._cardMod) {
        if (cm.type === type) {
            cardMod = cm;
            break;
        }
    }
    if (!cardMod) {
        cardMod = document.createElement("card-mod");
        cardMod.type = type;
        el._cardMod.push(cardMod);
    }
    queueMicrotask(async () => {
        const target = el.modElement
            ? el.modElement
            : shadow
                ? el.shadowRoot || el
                : el;
        target.appendChild(cardMod);
        cardMod.variables = variables;
        cardMod.styles = styles;
    });
    return cardMod;
}
export async function get_theme(root) {
    if (!root.type)
        return null;
    const el = root.parentElement ? root.parentElement : root;
    const theme = window
        .getComputedStyle(el)
        .getPropertyValue("--card-mod-theme");
    const themes = hass().themes.themes;
    if (!themes[theme])
        return {};
    if (themes[theme][`card-mod-${root.type}-yaml`]) {
        return yaml2json(themes[theme][`card-mod-${root.type}-yaml`]);
    }
    else if (themes[theme][`card-mod-${root.type}`]) {
        return { ".": themes[theme][`card-mod-${root.type}`] };
    }
    else {
        return {};
    }
}
export function merge_deep(target, source) {
    const isObject = (i) => {
        return i && typeof i === "object" && !Array.isArray(i);
    };
    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key])
                    Object.assign(target, { [key]: {} });
                if (typeof target[key] === "string")
                    target[key] = { ".": target[key] };
                merge_deep(target[key], source[key]);
            }
            else {
                if (target[key])
                    target[key] = source[key] + target[key];
                else
                    target[key] = source[key];
            }
        }
    }
    return target;
}
export function compare_deep(a, b) {
    if (a === b)
        return true;
    if (typeof a !== typeof b)
        return false;
    if (!(a instanceof Object && b instanceof Object))
        return false;
    for (const x in a) {
        if (!a.hasOwnProperty(x))
            continue;
        if (!b.hasOwnProperty(x))
            return false;
        if (a[x] === b[x])
            continue;
        if (typeof a[x] !== "object")
            return false;
        if (!compare_deep(a[x], b[x]))
            return false;
    }
    for (const x in b) {
        if (!b.hasOwnProperty(x))
            continue;
        if (!a.hasOwnProperty(x))
            return false;
    }
    return true;
}
export function findConfig(node) {
    if (node.config)
        return node.config;
    if (node._config)
        return node._config;
    if (node.host)
        return findConfig(node.host);
    if (node.parentElement)
        return findConfig(node.parentElement);
    if (node.parentNode)
        return findConfig(node.parentNode);
    return null;
}
function joinSet(dst, src) {
    for (const s of src)
        dst.add(s);
}
export async function findParentCardMod(node, step = 0) {
    let cardMods = new Set();
    if (step == 10)
        return cardMods;
    if (!node)
        return cardMods;
    if (node._cardMod) {
        for (const cm of node._cardMod) {
            if (cm.styles)
                cardMods.add(cm);
        }
    }
    if (node.updateComplete)
        await node.updateComplete;
    if (node.parentElement)
        joinSet(cardMods, await findParentCardMod(node.parentElement, step + 1));
    else if (node.parentNode)
        joinSet(cardMods, await findParentCardMod(node.parentNode, step + 1));
    if (node.host)
        joinSet(cardMods, await findParentCardMod(node.host, step + 1));
    return cardMods;
}
export function parentElement(el) {
    if (!el)
        return undefined;
    const node = el.parentElement || el.parentNode;
    if (!node)
        return undefined;
    return node.host ? node.host : node;
}
