/** @odoo-module **/

import { patch } from "@web/core/utils/patch";
import {ListController} from "@web/views/list/list_controller";
import {ListRenderer} from "@web/views/list/list_renderer";
import {registry} from "@web/core/registry";
import {useService} from "@web/core/utils/hooks";
import { Component, onRendered, useEffect, useRef, useState, onWillStart } from "@odoo/owl";
import { formatPercentage } from "@web/views/fields/formatters";
const formatters = registry.category("formatters");
const parsers = registry.category("parsers");

patch(ListRenderer.prototype, {

    async setup() {
        super.setup(...arguments);
        this.orm = useService("orm");
        const self = this;
        onWillStart(async () => {
            let model = self.props.list.resModel;
            self.configs = await this.fetchPercentageConfig(model);
        });
    },

    async fetchPercentageConfig(model) {
        return await this.orm.call("dynamic.aggregate.config", "get_configs", [[model]]);
    },

    createPercentageAggregate(result, percentageConfigs) {
        let extraResult = {};
        if (percentageConfigs) {
            let target_result = percentageConfigs['target_result'];
            if (!target_result) {
                return extraResult
            }
            let label = percentageConfigs['label'];
            let target_1_key = percentageConfigs['target_1'];
            let target_2_key = percentageConfigs['target_2'];
            let operation = percentageConfigs['operation'];
            let result_value = false;
            const formatOptions = {
                digits: [2, percentageConfigs['digits']],
                currencyId: percentageConfigs['currency_id'],
            };
//          required fields
            const formatterTargetResult = percentageConfigs['format_type'];
            const parserTargetResult = percentageConfigs['parser_type'];
            const formatter = formatters.get(formatterTargetResult);
            const parser = parsers.get(parserTargetResult);

            if (result.hasOwnProperty(target_1_key) && result.hasOwnProperty(target_2_key)) {
                let target_1 = parser(result[target_1_key]['value']);
                let target_2 = parser(result[target_2_key]['value']);
                switch (operation) {
                    case "*":
                        result_value = target_1 * target_2;
                        break;
                    case "+":
                        result_value = target_1 + target_2;
                        break;
                    case "-":
                        result_value = target_1 - target_2;
                        break;
                    case "/":
                        if (target_2 !== 0) {
                            result_value = target_1 / target_2;
                        } else {
                            result_value = 'NaN'; // or any other value to indicate division by zero
                        }
                        break;
                    case "%":
                        if (target_2 !== 0) {
                            result_value = (target_1 / target_2);
                        } else {
                            result_value = 'NaN'; // or any other value to indicate modulo by zero
                        }
                        break;
                }
                let formatted_value = formatter(result_value, formatOptions);
                extraResult[target_result] = {
                    'help': label,
                    'value': formatted_value,
                };
            }
        }
        return extraResult;
    },
    /**
        * @override
    */

    async computeAggregates(result) {
        return await this.createPercentageAggregate(result);
    },

    get aggregates() {
        let result = super.aggregates;
        let extra = this.createPercentageAggregate(result, this.configs)
        return Object.assign(result, extra);
    }
});
