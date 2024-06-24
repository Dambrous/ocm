/** @odoo-module */

import {patch} from "@web/core/utils/patch";
import {ListController} from "@web/views/list/list_controller";

patch(ListController.prototype, {

    toggleGroup(group, type) {
        if (type == 'expand') {
            group.isFolded = false;
        } else {
            group.isFolded = true;
        }
    },

    manageAllGroups(groups, type) {
        if (Array.isArray(groups)) {
            groups.forEach(group => this.toggleGroup(group));
        } else if (typeof groups === 'object') {
            for (let key in groups) {
                if (groups.hasOwnProperty(key)) {
                    let group = groups[key];
                    this.toggleGroup(group, type);
                     if (group.list && group.list.groups) {
                        this.manageAllGroups(group.list.groups, type);
                    }
                }
            }
        } else {
            console.error("Unexpected type for groups: ", typeof groups);
        }
    },

    async expandAllGroups() {
        let groups = this.model.config.groups;
        this.manageAllGroups(groups, "expand")
        await this.model.root.load();
    },

    async collapseAllGroups() {
        let groups = this.model.config.groups;
        this.manageAllGroups(groups, "collapse")
        await this.model.root.load();
    },
});
