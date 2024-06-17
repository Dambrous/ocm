# Copyright 2024-TODAY Rapsodoo Italia S.r.L. (www.rapsodoo.com)
# License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl).

from odoo import api, fields, models
from odoo.tools.float_utils import float_repr, float_round


class DynamicAggregateConfig(models.Model):
    _name = "dynamic.aggregate.config"

    name = fields.Char(string="Label", required=True)
    company_currency = fields.Many2one(
        "res.currency",
        string="Company Currency",
        compute="_compute_company_currency",
        compute_sudo=True,
    )
    target_result = fields.Many2one(
        "ir.model.fields",
        string="Target Result",
        required=True,
        domain="[('model_id', '=', model_id)]",
        ondelete="cascade",
    )
    target_1 = fields.Many2one(
        "ir.model.fields",
        string="Target 1",
        required=True,
        domain="[('model_id', '=', model_id), ('ttype', 'in', ('monetary', 'integer', 'float'))]",
        ondelete="cascade",
    )
    target_2 = fields.Many2one(
        "ir.model.fields",
        string="Target 2",
        required=True,
        domain="[('model_id', '=', model_id), ('ttype', 'in', ('monetary', 'integer', 'float'))]",
        ondelete="cascade",
    )
    model_id = fields.Many2one("ir.model", string="Model Name")
    digits = fields.Integer(required=True)
    formatter_type = fields.Selection(
        [
            ("float", "Float"),
            ("monetary", "Monetary"),
            ("integer", "Integer"),
            ("percentage", "Percentage"),
        ],
        required=True,
    )
    parser_type = fields.Selection(
        [
            ("float", "Float"),
            ("monetary", "Monetary"),
            ("integer", "Integer"),
            ("percentage", "Percentage"),
        ],
        required=True,
        default="float"
    )
    operation_type = fields.Selection(
        [("+", "+"), ("-", "-"), ("*", "*"), ("/", "/")], required=True
    )
    model_name = fields.Char(
        related="model_id.model",
        string="Model",
        readonly=True,
        inverse="_inverse_model_name",
    )
    operation_example = fields.Char()

    def _compute_company_currency(self):
        for role in self:
            role.company_currency = self.env.company.currency_id

    def _inverse_model_name(self):
        for rec in self:
            rec.model_id = self.env["ir.model"]._get(rec.model_name)

    def _compute_operation_example(self):
        for config in self:
            value1 = 11.30000
            value2 = 17.10000

            if config.operation_type == "+":
                result = value1 + value2
            elif config.operation_type == "-":
                result = value1 - value2
            elif config.operation_type == "*":
                result = value1 * value2
            elif config.operation_type == "/":
                result = value1 / value2
            result = float_round(result, config.digits)

            # Formattare il risultato in base al formatter_type
            if config.formatter_type == "float":
                formatted_result = float_repr(result, config.digits)
            elif config.formatter_type == "monetary":
                formatted_result = self.env["ir.qweb.field.monetary"].value_to_html(
                    result, {"decimal_precision": config.digits}
                )
            elif config.formatter_type == "integer":
                formatted_result = int(result)
            elif config.formatter_type == "percentage":
                formatted_result = float_repr(result * 100, config.digits) + "%"

            config.operation_example = (
                "11.300,00 "
                + str(config.operation_type)
                + " 17.100,00 = "
                + str(result)
                + " | formatted --> "
                + str(formatted_result)
            )

    @api.model
    def get_configs(self, model_name):
        result_configs = self.env["dynamic.aggregate.config"].search(
            [("model_name", "=", model_name)]
        )
        configs = {
            "currency_id": self.env.company.currency_id.id,
            "operation": result_configs.operation_type,
            "target_result": result_configs.target_result.name,
            "label": result_configs.name,
            "target_1": result_configs.target_1.name,
            "target_2": result_configs.target_2.name,
            "digits": result_configs.digits,
            "format_type": result_configs.formatter_type,
            "parser_type": result_configs.parser_type,
        }
        return configs
