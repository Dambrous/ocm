# Copyright 2024-TODAY Rapsodoo Italia S.r.L. (www.rapsodoo.com)
# License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl).


from odoo import fields, models


class TrapLink(models.Model):
    _name = "trap.link"

    url = fields.Char(required="True")
    enable_trap = fields.Boolean()
