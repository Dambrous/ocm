# Copyright 2024-TODAY Rapsodoo Italia S.r.L. (www.rapsodoo.com)
# License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl).


import logging

from crawlerdetect import CrawlerDetect

from odoo import models
from odoo.http import request

_logger = logging.getLogger(__name__)


class Http(models.AbstractModel):
    _inherit = "ir.http"

    @classmethod
    def is_crawler(cls):
        crawler_detector = CrawlerDetect()

        user_agent = request.httprequest.headers.get("User-Agent")
        headers = request.httprequest.headers
        _logger.info(f"Request Headers: {headers}")
        _logger.info(f"User-Agent: {user_agent}")

        is_crawler = crawler_detector.isCrawler(user_agent)
        if is_crawler:
            _logger.info(f"ATTENTION: Detected a crawler: User-Agent: {user_agent}")
        else:
            _logger.info(f"No crawler detected: User-Agent: {user_agent}")

        _logger.info("----------------------------------------------------")
        return is_crawler
