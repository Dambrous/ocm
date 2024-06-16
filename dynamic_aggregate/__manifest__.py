# Copyright 2024-TODAY Rapsodoo Italia S.r.L. (www.rapsodoo.com)
# License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl).

{
    "name": "Dynamic Aggregate",
    "author": "Rapsodoo",
    "website": "http://www.rapsodoo.com",
    "license": "LGPL-3",
    "category": "Owl",
    "version": "17.0.1.0.0",
    "depends": [
        "web",
    ],
    "data": [
        "security/ir.model.access.csv",
        "views/dynamic_aggregate_config_views.xml",
    ],
    "assets": {
        "web.assets_backend": [
            "dynamic_aggregate/static/src/views/**/*",
        ],
    },
}
