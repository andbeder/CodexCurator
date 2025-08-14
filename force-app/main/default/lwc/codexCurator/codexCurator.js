import { LightningElement } from "lwc";
import getFieldOptions from "@salesforce/apex/CodexCuratorController.getFieldOptions";
import getRecords from "@salesforce/apex/CodexCuratorController.getRecords";

export default class CodexCurator extends LightningElement {
  data = [];
  columns = [{ label: "Name", fieldName: "Name" }];
  allFields = [];
  selectedFields = [];
  modalOpen = false;

  connectedCallback() {
    this.loadFieldOptions();
    this.loadData();
  }

  loadFieldOptions() {
    getFieldOptions()
      .then((result) => {
        this.allFields = result;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  loadData() {
    getRecords({ fields: this.selectedFields })
      .then((result) => {
        this.data = result;
        const cols = [{ label: "Name", fieldName: "Name" }];
        this.selectedFields.forEach((f) => {
          const opt = this.allFields.find((o) => o.apiName === f);
          cols.push({ label: opt ? opt.label : f, fieldName: f });
        });
        this.columns = cols;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  handleConfigure() {
    this.modalOpen = true;
  }

  handleFieldChange(event) {
    this.selectedFields = event.detail.value;
  }

  handleSave() {
    this.modalOpen = false;
    this.loadData();
  }

  handleCancel() {
    this.modalOpen = false;
  }

  get fieldOptions() {
    return this.allFields.map((f) => ({ label: f.label, value: f.apiName }));
  }
}
