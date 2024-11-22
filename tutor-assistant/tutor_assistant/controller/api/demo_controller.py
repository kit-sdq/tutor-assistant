from fastapi import APIRouter
from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document
from langchain_core.messages import ChatMessage
from langchain_core.prompts import ChatPromptTemplate

from tutor_assistant.controller.config.domain_config import config
from tutor_assistant.domain.chats.message_multi_steps_chain_service import MessageMultiStepsChainService

router = APIRouter()


@router.post('/demo/multi-steps')
async def _get_multi_steps():
    # user_message_content = 'Was mache ich in Artemis bei Exited Prematurely'
    # history = []
    # MessageMultiStepsChainService(config).load_response(user_message_content, history)

    # user_message_content = 'Welches Datum haben wir heute?'
    # history = []
    # MessageMultiStepsChainService(config).create(user_message_content, history)
    #
    # user_message_content = 'Wie viele Übungsblätter gibt es?'
    # history = []
    # MessageMultiStepsChainService(config).create(user_message_content, history)
    #
    user_message_content = 'Was mache ich bei Exited Prematurely'
    history = []
    response = MessageMultiStepsChainService(config).load_response(user_message_content, history)

    for item in response:
        if 'context' in item:
            print(item['context'])
        if 'answer' in item:
            print(item['answer'])


@router.get("/demo/messages")
async def _get_demo_messages():
    template = ChatPromptTemplate.from_messages(
        [
            ('user', 'Hallo?'),
            ('ai', 'Wie kann ich dir helfen?'),
            ('user', 'Mir ist langweilig')
        ]
    )


@router.post('/demo/meta-docs')
async def _meta_docs():
    documents = [
        Document(page_content="Übungsblatt 0, Aufgabe A"),
        Document(page_content="Übungsblatt 0, Aufgabe B"),
        Document(page_content="Übungsblatt 0, Aufgabe C"),
        Document(page_content="Übungsblatt 1, Aufgabe A"),
        Document(page_content="Übungsblatt 1, Aufgabe B"),
        Document(page_content="Übungsblatt 1, Aufgabe C"),
        Document(page_content="Übungsblatt 2, Aufgabe A"),
        Document(page_content="Übungsblatt 2, Aufgabe B"),
        Document(page_content="Übungsblatt 2, Aufgabe C"),
        Document(page_content="Übungsblatt 3, Aufgabe A"),
        Document(page_content="Übungsblatt 3, Aufgabe B"),
        Document(page_content="Übungsblatt 5, Aufgabe A"),
    ]

    queries = [
        'Übungsblatt 2 Aufgabe A',

        'Worum geht es in Aufgabe A auf Übungsblatt 2?',
        'Worum geht es in Aufgabe A auf Übungsblatt zwei?',
        'Worum geht es in Aufgabe A auf dem 2. Übungsblatt?',
        'Worum geht es in Aufgabe A auf dem zweiten Übungsblatt?',

        'Worum geht es in Aufgabe 1 auf Übungsblatt 2?',
        'Worum geht es in Aufgabe 1 auf Übungsblatt zwei?',
        'Worum geht es in Aufgabe 1 auf dem 2. Übungsblatt?',
        'Worum geht es in Aufgabe 1 auf dem zweiten Übungsblatt?',

        'Worum geht es in Aufgabe eins auf Übungsblatt 2?',
        'Worum geht es in Aufgabe eins auf Übungsblatt zwei?',
        'Worum geht es in Aufgabe eins auf dem 2. Übungsblatt?',
        'Worum geht es in Aufgabe eins auf dem zweiten Übungsblatt?',

        'Worum geht es in der ersten Aufgabe auf Übungsblatt 2?',
        'Worum geht es in der ersten Aufgabe auf Übungsblatt zwei?',
        'Worum geht es in der ersten Aufgabe auf dem 2. Übungsblatt?',
        'Worum geht es in der ersten Aufgabe auf dem zweiten Übungsblatt?',
    ]

    vectorstore = FAISS.from_documents(documents, config.embeddings)

    for query in queries:
        result = vectorstore.similarity_search_with_score(query, k=1)
        print(result[0][0], result[0][1])
