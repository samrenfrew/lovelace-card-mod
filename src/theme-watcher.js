import { hass } from "card-tools/src/hass";
function refresh_theme() {
    document.dispatchEvent(new Event("cm_update"));
}
const bases = [
    customElements.whenDefined("home-assistant"),
    customElements.whenDefined("hc-main"),
];
Promise.race(bases).then(() => {
    window.setTimeout(() => {
        var _a, _b;
        hass().connection.subscribeEvents(() => {
            window.setTimeout(refresh_theme, 500);
        }, "themes_updated");
        (_a = document
            .querySelector("home-assistant")) === null || _a === void 0 ? void 0 : _a.addEventListener("settheme", refresh_theme);
        (_b = document
            .querySelector("hc-main")) === null || _b === void 0 ? void 0 : _b.addEventListener("settheme", refresh_theme);
    }, 1000);
});
