import json

import numpy as np
from fastapi import APIRouter
from langchain_core.documents import Document

from tutor_assistant.controller.config.domain_config import config
from tutor_assistant.controller.utils.data_transfer_utils import json_output
from tutor_assistant.domain.calendar.calendar_chain_service import CalendarChainService
from tutor_assistant.utils.string_utils import shorten_middle

router = APIRouter()


@router.post('/calendar')
async def _calendar():
    config.logger.info('POST /calendar')

    chain = CalendarChainService(config).create()

    result = chain.invoke({})
    context = result['context']
    answer = result['answer']

    entry: Document
    json_context = json.dumps([json.loads(json.dumps(entry.to_json(), cls=NumpyEncoder)) for entry in context])
    config.logger.info(f'Result: {shorten_middle(answer, 30)}')

    return json_output(answer)


class NumpyEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.float32):
            return float(obj)
        return super().default(obj)
