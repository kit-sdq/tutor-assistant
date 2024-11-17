import os

from langchain_openai import ChatOpenAI, OpenAIEmbeddings

from tutor_assistant.controller.config._logging_config import get_logger
from tutor_assistant.controller.utils.model_utils import get_remote_ollama_chat_model
from tutor_assistant.controller.utils.resource_utils import load_resources
from tutor_assistant.domain.domain_config import DomainConfig
from tutor_assistant.domain.vector_stores.chroma_repo import ChromaRepo
from tutor_assistant.domain.vector_stores.faiss_repo import FaissRepo

_embeddings = OpenAIEmbeddings(model='text-embedding-3-large')

config = DomainConfig(
    ChatOpenAI(model='gpt-4o', temperature=0),
    # get_remote_ollama_chat_model('llama3.1:8b'),
    _embeddings,
    # FaissRepo(f"{os.getenv('DATA_DIR')}/faiss_index", _embeddings),
    ChromaRepo(f"{os.getenv('DATA_DIR')}/chroma_index", _embeddings),
    load_resources(f'{os.getcwd()}/resources'),
    get_logger(),
    "Deutsch"
)
