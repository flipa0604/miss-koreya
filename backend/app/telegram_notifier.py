import logging

import httpx

from .config import settings
from .models import Order

logger = logging.getLogger(__name__)


def _format_order(order: Order) -> str:
    lines = [
        f"\U0001F6CD <b>Yangi buyurtma #{order.id}</b>",
        "",
        f"\U0001F464 <b>Mijoz:</b> {order.customer_name}",
        f"\U0001F4DE <b>Telefon:</b> {order.phone}",
        f"\U0001F4CD <b>Manzil:</b> {order.address}",
    ]
    if order.comment:
        lines.append(f"\U0001F4AC <b>Izoh:</b> {order.comment}")
    if order.telegram_username:
        lines.append(f"\U0001F4F1 <b>TG:</b> @{order.telegram_username}")

    lines.append("")
    lines.append("<b>Tarkibi:</b>")
    for it in order.items:
        sub = it.price * it.quantity
        lines.append(f"  • {it.product_name} × {it.quantity} = {sub:,.0f} so'm")

    lines.append("")
    lines.append(f"\U0001F4B0 <b>Jami:</b> {order.total:,.0f} so'm")
    lines.append(f"\U0001F310 Manba: {order.source}")
    return "\n".join(lines)


async def notify_new_order(order: Order) -> None:
    if not settings.TELEGRAM_BOT_TOKEN or not settings.TELEGRAM_ADMIN_CHAT_ID:
        logger.warning("Telegram bot not configured; skipping notification")
        return

    url = f"https://api.telegram.org/bot{settings.TELEGRAM_BOT_TOKEN}/sendMessage"
    payload = {
        "chat_id": settings.TELEGRAM_ADMIN_CHAT_ID,
        "text": _format_order(order),
        "parse_mode": "HTML",
        "disable_web_page_preview": True,
    }
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            r = await client.post(url, json=payload)
            if r.status_code >= 400:
                logger.error("Telegram notify failed: %s %s", r.status_code, r.text)
    except Exception as e:  # noqa: BLE001
        logger.error("Telegram notify exception: %s", e)
