import { selectTree } from "card-tools/src/helpers";
import { applyToElement } from "../helpers";
customElements.whenDefined("dialog-entity-editor").then(() => {
    const HaDialogEntityEditor = customElements.get("dialog-entity-editor");
    if (HaDialogEntityEditor.prototype.cardmod_patched)
        return;
    HaDialogEntityEditor.prototype.cardmod_patched = true;
    const _showDialog = HaDialogEntityEditor.prototype.showDialog;
    HaDialogEntityEditor.prototype.showDialog = function (params) {
        _showDialog === null || _showDialog === void 0 ? void 0 : _showDialog.bind(this)(params);
        this.requestUpdate();
        this.updateComplete.then(async () => {
            applyToElement(this.shadowRoot.querySelector("ha-dialog"), "dialog-entity-editor", "", { config: params }, null, false);
        });
    };
    selectTree(document, "home-assistant$dialog-entity-editor", false).then((root) => {
        if (root) {
            root.showDialog = HaDialogEntityEditor.prototype.showDialog.bind(root);
            root.showDialog({ entityId: root.entityId });
        }
    });
});
