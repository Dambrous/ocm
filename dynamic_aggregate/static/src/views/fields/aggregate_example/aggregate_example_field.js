/** @odoo-module **/

import { _t } from "@web/core/l10n/translation";
import { registry } from "@web/core/registry";
import { archParseBoolean } from "@web/views/utils";
import { standardFieldProps } from "@web/views/fields/standard_field_props";

import { Component } from "@odoo/owl";
const formatters = registry.category("formatters");

export class AggregateExampleField extends Component {
    static template = "web.AggregateExample";
    static props = {
        ...standardFieldProps,
        labelField: { type: String, optional: true },
        noLabel: { type: Boolean, optional: true },
        digits: { type: Array, optional: true },
        string: { type: String, optional: true },
//        target_1_value: { type: I}
    };

    get digits() {
        const fieldDigits = this.props.record.fields[this.props.name].digits;
        return !this.props.digits && Array.isArray(fieldDigits) ? fieldDigits : this.props.digits;
    }
    get formattedValue() {
        const formatter = formatters.get(this.props.record.fields[this.props.name].type);
        return formatter(this.props.record.data[this.props.name] || 0, { digits: this.digits });
    }
    get label() {
        return this.props.labelField
            ? this.props.record.data[this.props.labelField]
            : this.props.string;
    }
    get formattedExample() {
        console.log("pipo");
        return "Pippo"
//        const formatterTargetResult = percentageConfigs['format_type'];
//        const formatter = formatters.get(formatterTargetResult);
//        const formatOptions = {
//            digits: [2, percentageConfigs['digits']],
//            currencyId: percentageConfigs['currency_id'],
//        };
//        let target_1 = parser("11.300,00");
//        let target_2 = parser("17.100,00"]);
//        switch (operation) {
//            case "*":
//                result_value = target_1 * target_2;
//                break;
//            case "+":
//                result_value = target_1 + target_2;
//                break;
//            case "-":
//                result_value = target_1 - target_2;
//                break;
//            case "/":
//                if (target_2 !== 0) {
//                    result_value = target_1 / target_2;
//                } else {
//                    result_value = 'NaN'; // or any other value to indicate division by zero
//                }
//                break;
//            case "%":
//                if (target_2 !== 0) {
//                    result_value = (target_1 / target_2);
//                } else {
//                    result_value = 'NaN'; // or any other value to indicate modulo by zero
//                }
//                break;
//        }
//        let formatted_value = formatter(result_value, formatOptions);
//        return target_1, target_2, result_value, formatted_value
    }
}

export const aggregateExampleField = {
    component: AggregateExampleField,
    supportedOptions: [
        {
            label: _t("Label field"),
            name: "label_field",
            type: "field",
            availableTypes: ["char"],
        },
    ],
    supportedTypes: ["char"],
    extractProps: ({ attrs, options, string }) => {
        // Sadly, digits param was available as an option and an attr.
        // The option version could be removed with some xml refactoring.
        let digits;
        if (attrs.digits) {
            digits = JSON.parse(attrs.digits);
        } else if (options.digits) {
            digits = options.digits;
        }

        return {
            digits,
            labelField: options.label_field,
            noLabel: archParseBoolean(attrs.nolabel),
            string,
        };
    },
};

registry.category("fields").add("aggregate_example", aggregateExampleField);
