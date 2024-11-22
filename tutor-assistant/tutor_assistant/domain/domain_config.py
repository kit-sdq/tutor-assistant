import logging
from typing import Any

from langchain_core.embeddings import Embeddings
from langchain_core.language_models import BaseChatModel

from tutor_assistant.domain.vector_stores.vector_store_repo import VectorStoreRepo


class DomainConfig:
    def __init__(self,
                 chat_model: BaseChatModel,
                 embeddings: Embeddings,
                 vector_store_manager: VectorStoreRepo,
                 resources: dict[str, Any],
                 logger: logging.Logger,
                 language: str,
                 use_base_retriever: bool = False,
                 ):
        self.chat_model = chat_model
        self.embeddings = embeddings
        self.vector_store_manager = vector_store_manager
        self.resources = resources
        self.logger = logger
        self.language = language
        self.use_base_retriever = use_base_retriever

        logger.info('Application configuration complete.')
        logger.info(f"Using {'base' if use_base_retriever else 'hybrid'} retriever")
