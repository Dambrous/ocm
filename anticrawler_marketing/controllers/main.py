# Copyright 2024-TODAY Rapsodoo Italia S.r.L. (www.rapsodoo.com)
# License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl).


from odoo import http
from odoo.http import request

from odoo.addons.mass_mailing.controllers.main import MassMailController

# class LinkTracker(http.Controller):
#     @http.route("/r/<string:code>", type="http", auth="public", website=True)
#     def full_url_redirect(self, code, **post):
#         if not request.env["ir.http"].is_a_bot() and not request.env["ir.http"].is_crawler():
#             request.env["link.tracker.click"].sudo().add_click(
#                 code,
#                 ip=request.httprequest.remote_addr,
#                 country_code=request.geoip.country_code,
#             )
#         redirect_url = request.env["link.tracker"].get_url_from_code(code)
#         if not redirect_url:
#             raise NotFound()
#         return request.redirect(redirect_url, code=301, local=False)


class MassMailControllerInherit(MassMailController):
    # @http.route("/r/<string:code>/m/<int:mailing_trace_id>", type="http", auth="public")
    # def full_url_redirect(self, code, mailing_trace_id, **post):
    #     if not request.env["ir.http"].is_crawler():
    #         request.env["link.tracker.click"].sudo().add_click(
    #             code,
    #             ip=request.httprequest.remote_addr,
    #             country_code=request.geoip.country_code,
    #             mailing_trace_id=mailing_trace_id,
    #         )
    #     redirect_url = request.env["link.tracker"].get_url_from_code(code)
    #     if not redirect_url:
    #         raise NotFound()
    #     return request.redirect(redirect_url, code=301, local=False)

    @http.route("/mail/track/<int:mail_id>/<string:token>/blank.gif", type="http", auth="public")
    def track_mail_open(self, mail_id, token, **post):
        client_ip = request.httprequest.remote_addr
        context_with_ip = dict(request.env.context, client_ip=client_ip)
        request.env = request.env(context=context_with_ip)
        return super().track_mail_open(mail_id, token, **post)
