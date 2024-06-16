/** @odoo-module **/

import { patch } from "@web/core/utils/patch";
import {FormController} from "@web/views/form/form_controller"
import { Component, onRendered, useEffect, useRef, useState } from "@odoo/owl";

patch(FormController.prototype, {
    /**
     * @override
     */
    setup() {
        super.setup(...arguments);
        onRendered(() => {
//        DA CAPIRE SE DEVO RISCRIVERE QUESTA RIGA O VIENE ESEGUITA PRIMA DEL MIO PATCH e QUINDI NON HA SENSO RISCRIVERLA QUI
            this.env.config.setDisplayName(this.displayName());
            this.currentViewId = this.env.config.viewId
            // Additional custom logic
            this.disableForm();
        });
        // Patch onNotebookPageChange method
        this.onNotebookPageChange = (notebookId, page) => {
            this.disableForm();
        };

    },

    async fetchDisableFormDomain() {
        return await this.orm.call("disable.form.config", "get_disable_form_domain", [[this.currentViewId]]);
    },

    async disableForm() {
        let currentRecordId = this.model.root.resId;
        if (!currentRecordId) {
            currentRecordId = this.props.resId;
        }
        if (!currentRecordId) return;

        const results = await this.fetchDisableFormDomain();

        if (results.includes(currentRecordId)) {
            const inputElements = document.querySelectorAll(".o_form_sheet input");
            const fieldWidgets = document.querySelectorAll(".o_form_sheet .o_field_widget");

            if (inputElements) inputElements.forEach(e => e.setAttribute("disabled", true));
            if (fieldWidgets) fieldWidgets.forEach(e => e.classList.add("pe-none"));
            this.canEdit = false;
        } else {
            const inputElements = document.querySelectorAll(".o_form_sheet input");
            const fieldWidgets = document.querySelectorAll(".o_form_sheet .o_field_widget");

            if (inputElements) inputElements.forEach(e => e.removeAttribute("disabled"));
            if (fieldWidgets) fieldWidgets.forEach(e => e.classList.remove("pe-none"));
            this.canEdit = true;
        }
    },

//    async beforeLeave() {
//        this.disableForm();
//        super.beforeLeave(...arguments)
//    },
//
//    async beforeUnload(ev) {
//        this.disableForm();
//        super.beforeUnload(...arguments)
//    }
});
