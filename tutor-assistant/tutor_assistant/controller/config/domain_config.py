import os

from langchain_openai import ChatOpenAI, OpenAIEmbeddings

from tutor_assistant.controller.config._logging_config import get_logger
from tutor_assistant.controller.utils.resource_utils import load_resources
from tutor_assistant.domain.domain_config import DomainConfig
from tutor_assistant.domain.vector_stores.chroma_repo import ChromaRepo

_use_base_retriever = True

_embeddings = OpenAIEmbeddings(model='text-embedding-3-large')

_store = ChromaRepo(f"{os.getenv('DATA_DIR')}/chroma_ws2324_with_meta_docs_index", _embeddings)

if _use_base_retriever:
    _store = ChromaRepo(f"{os.getenv('DATA_DIR')}/chroma_ws2324_no_meta_docs_index", _embeddings)

config = DomainConfig(
    ChatOpenAI(model='gpt-4o', temperature=0),
    # get_remote_ollama_chat_model('llama3.1:8b'),
    _embeddings,
    _store,
    load_resources(f'{os.getcwd()}/resources'),
    get_logger(),
    "Deutsch",
    _use_base_retriever
)
