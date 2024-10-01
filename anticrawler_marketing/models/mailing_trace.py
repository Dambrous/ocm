# Copyright 2024-TODAY Rapsodoo Italia S.r.L. (www.rapsodoo.com)
# License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl).


from odoo import fields, models


class MailingTrace(models.Model):
    _inherit = "mailing.trace"

    ip = fields.Char()

    def set_clicked(self, domain=None):
        traces = self + (self.search(domain) if domain else self.env["mailing.trace"])
        if self:
            for link_click in self.links_click_ids:
                bot_cached = self.env["bot.cached"].search(
                    [("ip", "=", link_click.ip), ("url", "=", link_click.link_id.url)]
                )
                if bot_cached:
                    return traces
                if link_click.link_id.is_trap_for_bot:
                    self.env["bot.cached"].create({"ip": link_click.ip, "url": link_click.link_id.url})
                    return traces
        traces.write({"links_click_datetime": fields.Datetime.now()})
        return traces

    def set_opened(self, domain=None):
        traces = self + (self.search(domain) if domain else self.env["mailing.trace"])
        # custom
        client_ip = self.env.context.get("client_ip")
        if client_ip:
            bot_cached = self.env["bot.cached"].search([("ip", "=", client_ip)])
            if bot_cached:
                return traces
        for trace in traces:
            trace.write({"ip": client_ip})
        traces.filtered(lambda t: t.trace_status not in ("open", "reply")).write(
            {"trace_status": "open", "open_datetime": fields.Datetime.now()}
        )
        return traces
