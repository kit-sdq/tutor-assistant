from typing import Any
from uuid import uuid4

from langchain_core.callbacks import CallbackManagerForRetrieverRun
from langchain_core.documents import Document
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.retrievers import BaseRetriever

from tutor_assistant.domain.domain_config import DomainConfig
from tutor_assistant.utils.list_utils import distinct_by


class HybridRetriever(BaseRetriever):
    def __init__(self, config: DomainConfig, *args: Any, **kwargs: Any):
        super().__init__(*args, **kwargs)
        self._chat_model = config.chat_model
        self._vector_store = config.vector_store_manager.load()
        self._multiple_prompts = (
            config.resources)['prompt_templates']['hybrid_retriever']['multiple_retriever_queries.txt']

    def _get_relevant_documents(
            self, messages: list[tuple[str, str]], *, run_manager: CallbackManagerForRetrieverRun
    ) -> list[Document]:
        queries = self._get_queries(messages)
        docs: list[Document] = []
        for query in queries:
            queried_docs = self._search_with_score(query.strip())
            docs.extend(queried_docs)
            referenced_docs = self._get_referenced_by(query, docs)
            docs.extend(referenced_docs)

        distinct = distinct_by(self._id_or_random, docs)
        filtered = list(filter(lambda x: 'id' in x.metadata, distinct))
        return distinct

    def _get_queries(self, messages: list[tuple[str, str]]) -> list[str]:
        chain = self._get_chat_prompt(messages) | self._chat_model
        content = chain.invoke({}).content
        print('content', content)
        queries = content.split(';')

        return queries

    def _get_chat_prompt(self, messages: list[tuple[str, str]]) -> ChatPromptTemplate:
        prompt_messages = messages + [('system', self._multiple_prompts)]
        return ChatPromptTemplate.from_messages(prompt_messages)

    def _search_with_score(self, query: str) -> list[Document]:
        try:
            docs, scores = zip(
                *self._vector_store.similarity_search_with_score(
                    query,
                    k=5
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
            if np_score < 5:
                result.append(doc)

        return result

    def _get_referenced_by(self, query: str, docs: list[Document]) -> list[Document]:
        referenced_docs: list[Document] = []
        for doc in docs:
            if 'references' in doc.metadata:
                ids: str = doc.metadata['references']
                queried_docs = self._vector_store.similarity_search(
                    query,
                    k=1000,
                    # filter=lambda metadata: (metadata['id'] in ids) if 'id' in metadata else False,
                    # filter={'id__in': ';'.join(ids)},
                )
                filtered_docs: list[Document] = list(filter(
                    lambda d: (d.metadata['id'] in ids) if 'id' in d.metadata else False,
                    queried_docs
                ))
                referenced_docs.extend(filtered_docs)
        return referenced_docs

    @staticmethod
    def _id_or_random(doc: Document) -> Any:
        return doc.metadata['id'] if 'id' in doc.metadata else str(uuid4())
