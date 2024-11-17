from langchain_core.vectorstores import VectorStore


class VectorStoreRepo:

    def create_if_not_exists(self) -> VectorStore:
        raise NotImplementedError()

    def save(self, store) -> None:
        raise NotImplementedError()

    def load(self) -> VectorStore:
        raise NotImplementedError()
