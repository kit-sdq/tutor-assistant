import uuid
from typing import Optional

from langchain_core.document_loaders import BaseLoader
from langchain_core.documents import Document
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate

from tutor_assistant.domain.domain_config import DomainConfig


class DocumentService:
    def __init__(self, config: DomainConfig):
        self._config = config

    def add(self, loader: BaseLoader, original_key: str, summarize_documents_count: int) -> list[str]:
        documents = loader.load()
        ids: list[str] = []
        for i, doc in enumerate(documents):
            doc.id = str(uuid.uuid4())
            doc.metadata['id'] = doc.id
            doc.metadata['originalKey'] = original_key
            ids.append(doc.id)

        # if len(documents) <= summarize_documents_count:
        #     self._summarize_documents(documents)

        meta_docs = self._handle_meta_docs(documents)

        store = self._config.vector_store_manager.load()
        store_ids = store.add_documents(documents)

        if store_ids != ids:
            raise RuntimeError(
                f'ids and store_ids should be equal, but got ids={ids} and store_ids={store_ids}')

        meta_doc_ids = store.add_documents(meta_docs)
        store_ids.extend(meta_doc_ids)

        self._config.vector_store_manager.save(store)

        return store_ids

    def delete(self, ids: list[str]) -> Optional[bool]:
        store = self._config.vector_store_manager.load()
        success = store.delete(ids)
        self._config.vector_store_manager.save(store)

        return success

    @staticmethod
    def _handle_meta_docs(docs: list[Document]) -> list[Document]:
        meta_docs = []
        for doc in docs:
            if 'headings' in doc.metadata:
                meta_doc = Document(
                    doc.metadata['headings'],
                    metadata={'references': doc.metadata['id']}
                )
                meta_docs.append(meta_doc)
                del doc.metadata['headings']

        return meta_docs

    def _summarize_documents(self, documents: list[Document]):
        template = self._config.resources['prompt_templates']['document_summary_2.txt']

        prompt_template = ChatPromptTemplate.from_template(template)
        chat_model = self._config.chat_model
        chain = prompt_template | chat_model | StrOutputParser()

        for document in documents:
            document_values = {
                "metadata": document.metadata,
                "content": document.page_content,
            }

            document.metadata['summary'] = chain.invoke(document_values)
