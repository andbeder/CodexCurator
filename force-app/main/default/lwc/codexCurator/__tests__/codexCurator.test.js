import { createElement } from "lwc";
import CodexCurator from "c/codexCurator";
import getFieldOptions from "@salesforce/apex/CodexCuratorController.getFieldOptions";
import getRecords from "@salesforce/apex/CodexCuratorController.getRecords";

jest.mock(
  "@salesforce/apex/CodexCuratorController.getFieldOptions",
  () => {
    return { default: jest.fn() };
  },
  { virtual: true }
);

jest.mock(
  "@salesforce/apex/CodexCuratorController.getRecords",
  () => {
    return { default: jest.fn() };
  },
  { virtual: true }
);

function flushPromises() {
  return Promise.resolve();
}

describe("c-codex-curator", () => {
  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
    jest.clearAllMocks();
  });

  it("renders datatable with Name column by default", async () => {
    getFieldOptions.mockResolvedValue([]);
    getRecords.mockResolvedValue([{ Id: "1", Name: "Test" }]);

    const element = createElement("c-codex-curator", {
      is: CodexCurator
    });
    document.body.appendChild(element);

    await flushPromises();
    await flushPromises();

    const datatable = element.shadowRoot.querySelector("lightning-datatable");
    expect(datatable).not.toBeNull();
    expect(datatable.columns[0].label).toBe("Name");
    expect(datatable.data.length).toBe(1);
  });
});
