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
        onWillStart(async () => {
            let model = this.props.list.resModel;
            this.configs = await this.orm.call("dynamic.aggregate.config", "get_configs", [[model]]);
        });
    },

    calculateAggregateResult(function_aggregate, fieldValues) {
        let aggregateValue = 0;
        if (function_aggregate === "max") {
            aggregateValue = Math.max(-Infinity, ...fieldValues);
        } else if (function_aggregate === "min") {
            aggregateValue = Math.min(Infinity, ...fieldValues);
        } else if (function_aggregate === "avg") {
            aggregateValue =
                fieldValues.reduce((acc, val) => acc + val) / fieldValues.length;
        } else if (function_aggregate === "sum") {
            aggregateValue = fieldValues.reduce((acc, val) => acc + val);
        }
        return aggregateValue
    },

    getAggregatesValues(configs) {
        let values;
        if (this.props.list.selection && this.props.list.selection.length) {
            values = this.props.list.selection.map((r) => r.data);
        } else if (this.props.list.isGrouped) {
            values = this.props.list.groups.map((g) => g.aggregates);
        } else {
            values = this.props.list.records.map((r) => r.data);
        }
        for (const column of this.allColumns) {
            const fieldName = column['name'];
            if (fieldName === configs.target_1) {
                const fieldValues = values.map((v) => v[fieldName]).filter((v) => v || v === 0);
                this.target_1_result = this.calculateAggregateResult(configs['target_1_function_aggregate'], fieldValues );
            } else if (fieldName === configs.target_2) {
                const fieldValues = values.map((v) => v[fieldName]).filter((v) => v || v === 0);
                this.target_2_result = this.calculateAggregateResult(configs['target_2_function_aggregate'], fieldValues);
            }
        }
    },

    createAggregate(result, aggregateConfigs) {
        let extraResult = {};
        if (aggregateConfigs) {
            let target_result = aggregateConfigs['target_result'];
            if (!target_result) {
                return extraResult
            }
            let label = aggregateConfigs['label'];
            let target_1_key = aggregateConfigs['target_1'];
            let target_2_key = aggregateConfigs['target_2'];
            let operation = aggregateConfigs['operation'];
            let result_value = false;
            const formatOptions = {
                digits: [2, aggregateConfigs['digits']],
                currencyId: aggregateConfigs['currency_id'],
            };
//          required fields
            const formatterTargetResult = aggregateConfigs['format_type'];
            const parserTargetResult = aggregateConfigs['parser_type'];
            const formatter = formatters.get(formatterTargetResult);
            const parser = parsers.get(parserTargetResult);

//            let target_1 = parser(this.target_1_result);
//            let target_2 = parser(this.target_2_result);
            switch (operation) {
                case "*":
                    result_value = this.target_1_result * this.target_2_result;
                    break;
                case "+":
                    result_value = this.target_1_result + this.target_2_result;
                    break;
                case "-":
                    result_value = this.target_1_result - this.target_2_result;
                    break;
                case "/":
                    if (this.target_2_result !== 0) {
                        result_value = this.target_1_result / this.target_2_result;
                    } else {
                        result_value = 'NaN'; // or any other value to indicate division by zero
                    }
                    break;
                case "%":
                    if (this.target_2_result !== 0) {
                        result_value = (this.target_1_result / this.target_2_result);
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
        return extraResult;
    },

    /**
        * @override
    */

    get aggregates() {
        let result = super.aggregates;
        let values = this.getAggregatesValues(this.configs)
        let extra = this.createAggregate(result, this.configs)
        return Object.assign(result, extra);
    }
});
