# Copyright 2026 Tecnativa - Christian Ramos
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl.html).


def post_init_hook(env):
    ids_map = {}
    if isinstance(env.get("knowledge.article", False), bool):
        return
    for article in (
        env["knowledge.article"]
        .with_context(active_test=False)
        .search([("name", "!=", False)])
    ):
        vals = {
            "name": article.name,
            "create_uid": article.create_uid.id,
            "content_uid": article.create_uid.id,
            "create_date": article.create_date,
            "content_date": article.create_date,
            "content": article.body,
            "draft_name": "Init",
            "draft_summary": "Init",
        }
        if article.child_ids:
            vals["type"] = "category"
        page = env["document.page"].create(vals)
        ids_map[article.id] = page.id
    for article in (
        env["knowledge.article"]
        .with_context(active_test=False)
        .search([("name", "!=", False), ("parent_id", "!=", False)])
    ):
        env["document.page"].browse(ids_map[article.id]).write(
            {"parent_id": ids_map[article.parent_id.id]}
        )
