# Copyright 2024-TODAY Rapsodoo Italia S.r.L. (www.rapsodoo.com)
# License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl).

from odoo import api, fields, models


class DisableFormConfig(models.Model):
    _name = "disable.form.config"

    name = fields.Char(string="Name", required=True)
    view_type = fields.Selection([("form", "Form")], string="View Type", required=True)
    view_id = fields.Many2one("ir.ui.view", "View", required=True)
    model_id = fields.Many2one("ir.model", string="Model Name", store=True, related="view_id.model_id")
    model_name = fields.Char(
        related="model_id.model",
        string="Model",
        readonly=True,
        inverse="_inverse_model_name",
    )
    xml_id = fields.Char(string="External ID", related="view_id.xml_id", readonly=True)
    disable_form_domain = fields.Char(
        string="Before Update Domain",
        readonly=False,
        store=True,
        help="If present, this condition must be satisfied before the update of the record.",
    )

    @api.onchange("view_id")
    def _onchange_view_id(self):
        for config in self:
            if config.view_id:
                config.model_id = config.view_id.model_id.id
            else:
                config.model_id = False

    def _inverse_model_name(self):
        for rec in self:
            rec.model_id = self.env["ir.model"]._get(rec.model_name)

    @api.model
    def get_disable_form_domain(self, record_id):
        view = self.env["ir.ui.view"].sudo().browse(record_id)
        if not view:
            return []

        model = view.model
        disable_form_configs = self.env["disable.form.config"].search(
            [("view_id", "=", view.id)]
        )
        if disable_form_configs and model:
            if disable_form_configs.disable_form_domain:
                records = self.env[model].search(
                    eval(disable_form_configs.disable_form_domain)
                )
            else:
                records = self.env[model].search([])
            return records.mapped("id")

        return []
