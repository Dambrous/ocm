# Copyright 2024-TODAY Rapsodoo Italia S.r.L. (www.rapsodoo.com)
# License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl).


from odoo import fields, models


class BotCached(models.Model):
    _name = "bot.cached"

    url = fields.Char(required="True")
    ip = fields.Char()
    last_connection_date = fields.Datetime()
