from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate

from tutor_assistant.domain.domain_config import DomainConfig
from tutor_assistant.domain.utils.templates import prepend_base_template


class CalendarChainServiceWithImprovement:
    def __init__(self, config: DomainConfig):
        self._config = config

    def load(self):
        retriever_chain = self._get_retriever_chain()
        context = retriever_chain.invoke({})

        self._config.logger.info('retrieved context')

        first_prompt_template = self._get_first_prompt_template()
        first_model_chain = self._get_model_chain(first_prompt_template)

        self._config.logger.info('retrieved context')

        improvement_prompt_template = self._get_improvement_prompt_template()
        improvement_model_chain = self._get_model_chain(improvement_prompt_template)

        first_answer = first_model_chain.invoke({'context': context})
        improved_answer = improvement_model_chain.invoke(
            {'prompt': first_prompt_template, 'first_answer': first_answer}
        )

        return improved_answer

    def _get_model_chain(self, prompt):
        model = self._config.chat_model
        parser = StrOutputParser()

        return prompt | model | parser

    def _get_retriever_chain(self):
        retriever_prompt = self._config.resources['prompt_templates']['calendar_vector_store.txt']
        retriever = self._config.vector_store_manager.load().as_retriever()
        return (lambda _: retriever_prompt) | retriever

    def _get_first_prompt_template(self):
        template = self._config.resources['prompt_templates']['calendar_chat_model_markdown.txt']
        complete_template = prepend_base_template(self._config, template)
        return ChatPromptTemplate.from_template(complete_template)

    def _get_improvement_prompt_template(self):
        template = self._config.resources['prompt_templates']['calendar_chat_model_improvement.txt']
        complete_template = prepend_base_template(self._config, template)
        return ChatPromptTemplate.from_template(complete_template)
