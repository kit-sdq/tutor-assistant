from typing import Any

from langchain_core.callbacks import CallbackManagerForRetrieverRun
from langchain_core.documents import Document
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.retrievers import BaseRetriever

from tutor_assistant.domain.documents.retrievers.with_references_retriever import WithReferencesRetriever
from tutor_assistant.domain.domain_config import DomainConfig


class QueriesLoaderRetriever(BaseRetriever):
    def __init__(self, config: DomainConfig, *args: Any, **kwargs: Any):
        super().__init__(*args, **kwargs)
        self._chat_model = config.chat_model
        self._vector_store = config.vector_store_manager.load()
        self._config = config

    def _get_relevant_documents(
            self, messages: list[tuple[str, str]], *, run_manager: CallbackManagerForRetrieverRun
    ) -> list[Document]:
        pass
        # queries = self._get_queries(messages)
        # return WithReferencesRetriever(self._config).search(queries)

    def _get_queries(self, messages: list[tuple[str, str]]) -> list[str]:
        chain = self._get_chat_prompt(messages) | self._chat_model
        content = chain.invoke({}).content
        print('content', content)
        queries = content.split(';')

        return queries

    def _get_chat_prompt(self, messages: list[tuple[str, str]]) -> ChatPromptTemplate:
        multiple_prompts = self._config.resources['prompt_templates']['hybrid_retriever'][
            'multiple_retriever_queries_3.txt']
        prompt_messages = messages + [('system', multiple_prompts)]
        return ChatPromptTemplate.from_messages(prompt_messages)
