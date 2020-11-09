import { applyToElement } from "../card-mod";

customElements.whenDefined("dialog-entity-editor").then(() => {

  const HaEntityDialog = customElements.get("dialog-entity-editor");
  if(HaEntityDialog.prototype.cardmod_patched) return;
  HaEntityDialog.prototype.cardmod_patched = true;
  const original = HaEntityDialog.prototype.showDialog;
  HaEntityDialog.prototype.showDialog = function(params) {
    const apply = () => {applyToElement(this.shadowRoot.querySelector("ha-dialog"), "more-info", "", {config: params}, [params.entityId], false)};

    original.bind(this)(params);

    this.requestUpdate().then( async() => {
      while(this.shadowRoot.querySelector("ha-dialog") == null) {
        await new Promise(r => requestAnimationFrame(r));
      }
      apply();
    });
  };

    let root = document.querySelector("home-assistant");
    root = root && root.shadowRoot;
    root = root && root.querySelector("dialog-entity-editor");

    if(root) {
      root.showDialog = HaEntityDialog.prototype.showDialog.bind(root);
      root.showDialog();
    }
});
