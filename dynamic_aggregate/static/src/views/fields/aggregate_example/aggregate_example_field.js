/** @odoo-module **/

import { _t } from "@web/core/l10n/translation";
import { registry } from "@web/core/registry";
import { archParseBoolean } from "@web/views/utils";
import { useService } from "@web/core/utils/hooks";
import { standardFieldProps } from "@web/views/fields/standard_field_props";
import { Component, onWillStart } from "@odoo/owl";
const formatters = registry.category("formatters");

export class AggregateExampleField extends Component {
  static template = "web.AggregateExample";
  static props = {
    ...standardFieldProps,
  };

  setup() {
    this.orm = useService("orm"); // Access the ORM service

    onWillStart(async () => {
      const record = this.props.record; // Access the current record
      this.model = record.resModel; // Get the model name
      this.recordId = this.props.record.resId; // Get the record ID
//      this.exampleTarget1 =
//      this.exampleTarget2 =
//      this.formatType = formatter
      if (!model || !recordId) {
        console.warn("Missing record or model information");
        return;
      }

      try {
        const configs = await this.orm.call(model, "fetch_percentage_config", recordId);
        this.formatType = configs?.format_type; // Store the fetched format_type
      } catch (error) {
        console.error("Error fetching configuration:", error);
      }
    });
  }

  get formattedExample() {
    if (!this.formatType) {
      return "No format type available"; // Handle missing format type
    }

    const formatter = formatters.get(this.formatType); // Get the formatter

    // Implement your logic using the fetched format type and record data (if needed)

    return "Formatted value based on format type"; // Replace with your formatted value
  }
}

export const aggregateExampleField = {
  component: AggregateExampleField,
  supportedTypes: ["char"],
};

registry.category("fields").add("aggregate_example", aggregateExampleField);
