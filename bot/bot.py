"""
Miss Koreya Telegram bot.

- /start: greets the user and shows a "Магазин" button that opens the shop as a Telegram Mini App
- Forwards new orders to the admin chat (the API also notifies via Bot API; the bot
  itself only handles user interaction here so they can be run separately).
"""
import asyncio
import logging
import os
from pathlib import Path

from aiogram import Bot, Dispatcher, F
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode
from aiogram.filters import CommandStart
from aiogram.types import (
    KeyboardButton,
    Message,
    ReplyKeyboardMarkup,
    WebAppInfo,
)
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent.parent / "backend" / ".env")

BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "")
PUBLIC_SITE_URL = os.getenv("PUBLIC_SITE_URL", "")
ADMIN_CHAT_ID = os.getenv("TELEGRAM_ADMIN_CHAT_ID", "")

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger("bot")


def shop_keyboard() -> ReplyKeyboardMarkup:
    if not PUBLIC_SITE_URL:
        return ReplyKeyboardMarkup(keyboard=[], resize_keyboard=True)
    return ReplyKeyboardMarkup(
        keyboard=[[KeyboardButton(
            text="\U0001F6CD Магазин",
            web_app=WebAppInfo(url=PUBLIC_SITE_URL),
        )]],
        resize_keyboard=True,
    )


async def main() -> None:
    if not BOT_TOKEN:
        raise RuntimeError("TELEGRAM_BOT_TOKEN is not set")

    bot = Bot(token=BOT_TOKEN, default=DefaultBotProperties(parse_mode=ParseMode.HTML))
    dp = Dispatcher()

    @dp.message(CommandStart())
    async def start(message: Message) -> None:
        text = (
            "Добро пожаловать в <b>MY Cosmetic</b>! \U0001F338\n\n"
            "Корейская косметика в Бухаре. Откройте магазин и выберите товары — "
            "оформление заказа займёт минуту."
        )
        await message.answer(text, reply_markup=shop_keyboard())

    @dp.message(F.text == "/id")
    async def show_id(message: Message) -> None:
        # Helpful command to find your chat id when configuring TELEGRAM_ADMIN_CHAT_ID
        await message.answer(f"Your chat id: <code>{message.chat.id}</code>")

    @dp.message(F.web_app_data)
    async def web_app_data(message: Message) -> None:
        # Reserved for future: if the mini app uses tg.sendData() we can handle it here.
        await message.answer("Спасибо! Заказ получен.")

    log.info("Bot started")
    await dp.start_polling(bot, allowed_updates=dp.resolve_used_update_types())


if __name__ == "__main__":
    asyncio.run(main())
