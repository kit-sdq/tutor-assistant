from typing import Any

from langchain.retrievers import SelfQueryRetriever
from langchain_core.documents import Document
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough, RunnableSerializable

from tutor_assistant.controller.utils.data_transfer_utils import messages_from_history
from tutor_assistant.controller.utils.langchain_utils import escape_prompt
from tutor_assistant.domain.documents.retrievers.queries_loader_retriever import QueriesLoaderRetriever
from tutor_assistant.domain.domain_config import DomainConfig
from tutor_assistant.domain.utils.templates import prepend_base_template


class MessageChainService:
    def __init__(self, config: DomainConfig):
        self._config = config

    def create(self, user_message_content: str, history: list[dict[str, str]]) -> RunnableSerializable:
        messages = self._get_all_messages(user_message_content, history)

        chat_prompt = self._get_chat_prompt(messages)

        model_chain = self._get_model_chain(chat_prompt)
        retriever = QueriesLoaderRetriever(self._config)


        retriever_chain = (lambda _: messages) | retriever

        if self._config.use_base_retriever:
            retriever_chain = (lambda _: self._search_with_score(user_message_content))
            # retriever_chain = (lambda _: user_message_content) | self._get_self_query_retriever_chain(user_message_content)


        return (
            RunnablePassthrough
            .assign(context=retriever_chain)
            .assign(answer=model_chain)
        )

    @staticmethod
    def _get_all_messages(user_message_content: str, history) -> list[tuple[str, str]]:
        messages = []
        for msg in messages_from_history(history):
            messages.append(msg)
        messages.append(('user', escape_prompt(user_message_content)))

        return messages

    def _get_chat_prompt(self, messages: list[tuple[str, str]]) -> ChatPromptTemplate:
        template = self._config.resources['prompt_templates']['chat_message.txt']
        complete_template = prepend_base_template(self._config, template)

        prompt_messages = [('system', complete_template)]
        prompt_messages.extend(messages)

        prompt_template = ChatPromptTemplate.from_messages(prompt_messages)

        return prompt_template

    def _get_model_chain(self, prompt) -> RunnableSerializable[Any, str]:
        model = self._config.chat_model
        parser = StrOutputParser()

        return prompt | model | parser

    def _get_base_retriever_chain(self, query: str) -> RunnableSerializable[Any, list[Document]]:
        retriever = self._config.vector_store_manager.load().as_retriever()
        return (lambda _: query) | retriever

    def _get_self_query_retriever_chain(self, query: str) -> RunnableSerializable[Any, list[Document]]:
        metadata_field_info = []
        document_content_description = "Informationen zu Programmieren an der Uni"
        llm = self._config.chat_model
        retriever = SelfQueryRetriever.from_llm(
            llm, self._config.vector_store_manager.load(), document_content_description, metadata_field_info,
            enable_limit=True,
            verbose=True
        )

        # query += " !Gib mir maximal 20 Dokumente!"
        print(retriever.invoke(query))

        return (lambda _: query) | retriever

    def _search_with_score(self, query: str) -> list[Document]:
        self._config.logger.info(f'Base Retriever: Running for "{query}')
        try:
            docs, scores = zip(
                *self._config.vector_store_manager.load().similarity_search_with_score(
                    query,
                    k=4
                )
            )
        except Exception as e:
            print('Exception:', e)
            return []
        result = []
        doc: Document
        for doc, np_score in zip(docs, scores):
            score = float(np_score)
            doc.metadata['score'] = score
            if np_score < 2:
                result.append(doc)

        return result
