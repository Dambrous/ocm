=============
Disable Form
=============

This module disables the form click for any model in Odoo. You can choose the model to disable and specify a domain to restrict form disabling only to records that meet specific data criteria.

Configuration
--------------
After installing the `disable_form` module, follow these steps to configure it:
1. Navigate to `Settings` -> `Disable Form Settings`.
2. Click `Create` to add a new disable configuration.
3. Select the view you want to disable.
4. Define a domain to specify the records for which you want to disable the form.
5. Save your changes.

Usage Example
-------------
Imagine you want to disable the edit form for records in the `res.partner` model where the `customer_rank` field is greater than 0.

1. Navigate to the `Disable Form` module from the homepage.
2. Create a new configuration:
    - Model: `res.partner`
    - Domain: `[('customer_rank', '>', 0)]`
3. Save the configuration.

    .. image:: readme/icon1.png
        :width: 1000

From now on, the edit form will be disabled for all partners who are customers.

Features
--------
- Disables form click for any model.
- Allows specifying a domain to restrict form disabling to specific records.
- Provides a straightforward interface to add, modify, and delete disable configurations.

Maintainers
-----------
This module is maintained by Rapsodoo.

.. image:: rapsodoo_icon.png
    :alt: Rapsodoo
    :target: https://www.rapsodoo.com

| Rapsodoo is one of Odoo Europe's leading partners focusing on large and mid-sized enterprises. It is developed by a team of senior entrepreneurs and investors with the "crazy dream" of bringing together younger entrepreneurs and talented individuals to build a unique, inspired, focused, and enjoyable international group.