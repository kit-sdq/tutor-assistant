import os

import uvicorn
from fastapi import FastAPI

from tutor_assistant.controller.api import chats_controller, documents_controller, calendar_controller, demo_controller
from tutor_assistant.controller.config.domain_config import config

_app = FastAPI(
    title='Tutor Assistant',
    version='1.0.0',
    description=''
)


def _main():
    config.vector_store_manager.create_if_not_exists()

    # app.logger = config.logger
    _app.include_router(calendar_controller.router, tags=["calendar"])
    _app.include_router(chats_controller.router, tags=["chats"])
    _app.include_router(demo_controller.router, tags=["demo"])
    _app.include_router(documents_controller.router, tags=["documents"])

    uvicorn.run(_app, host=os.getenv('HOST'), port=8500)


if __name__ == '__main__':
    _main()
