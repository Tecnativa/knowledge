/** @odoo-module **/

import {AttachmentBox} from "@mail/components/attachment_box/attachment_box";
import {AttachmentCard} from "@mail/components/attachment_card/attachment_card";
import {patch} from "web.utils";

patch(AttachmentBox.prototype, "document_url/static/src/js/url.js", {
    _onAddUrl() {
        const action = {
            type: "ir.actions.act_window",
            name: "action_ir_attachment_add_url",
            views: [[false, "form"]],
            res_model: "ir.attachment.add_url",
            view_mode: "form",
            target: "new",
        };
        const options = {
            onClose: this._onAddedUrl.bind(this),
        };
        this.env.services.action.doAction(action, options);
    },
    _onAddedUrl() {
        this._reload();
    },
});

patch(AttachmentCard.prototype, "document_url/static/src/js/url.js", {
    /**
     * Return the url of the attachment. Temporary attachments, a.k.a. uploading
     * attachments, do not have an url.
     *
     * @returns {String}
     */
    get attachmentUrl() {
        return this.env.session.url("/web/content", {
            id: this.attachmentCard.attachment.id,
            download: true,
        });
    },
});
