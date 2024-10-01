# Copyright 2024-TODAY Rapsodoo Italia S.r.L. (www.rapsodoo.com)
# License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl).


from datetime import datetime

from odoo import api, fields, models


class LinkTracker(models.Model):
    _inherit = ["link.tracker"]

    is_trap_for_bot = fields.Boolean()

    def create(self, vals):
        record = super().create(vals)
        # url is unique in the trap.link table, we expect only one record
        trap_record = self.env["trap.link"].search([("url", "=", vals.get("url")), ("enable_trap", "=", True)])
        if trap_record:
            record.is_trap_for_bot = True
        return record


class LinkTrackerClick(models.Model):
    _inherit = "link.tracker.click"

    def check_ip_before_add_click(self, click_values):
        if click_values:
            # Have I exposed you yet? Let's find out
            bot_cached = self.env["bot.cached"].search([("ip", "=", click_values["ip"])])
            if bot_cached:
                return False
            # Are you the bot I'm looking for? Let's find out
            trap_link = self.env["link.tracker"].search([("id", "=", click_values["link_id"])])
            if trap_link.is_trap_for_bot:
                self.env["bot.cached"].create(
                    {"ip": click_values["ip"], "url": trap_link.url, "last_connection_date": datetime.now()}
                )
                return False
            # You are good
            return True

    @api.model
    def add_click(self, code, **route_values):
        """OVERRIDE"""
        tracker_code = self.env["link.tracker.code"].search([("code", "=", code)])
        if not tracker_code:
            return None

        route_values["link_id"] = tracker_code.link_id.id
        click_values = self._prepare_click_values_from_route(**route_values)

        can_create = self.check_ip_before_add_click(click_values)
        if can_create:
            return self.create(click_values)
        # if click_values["mailing_trace_id"]:
        #     trace = self.env["mailing.trace"].browse(click_values["mailing_trace_id"])
        #     bot_cached = self.env["bot.cached"].search([("ip", "=", trace.ip)])
        #     if bot_cached:
        #         trace.write({"trace_status": "sent", "open_datetime": ""})
        #     trace.links_click_ids.filtered(lambda click: click.ip == trace.ip).unlink()
        return self.env["link.tracker"]
