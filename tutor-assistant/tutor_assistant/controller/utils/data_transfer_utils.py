import json
import re
from typing import Any

from tutor_assistant.controller.utils.langchain_utils import escape_prompt


def messages_from_history(history: list[dict[str, str]]) -> list[tuple[str, str]]:
    messages = []

    for message in history:
        content = escape_prompt(message['content'])
        messages.append((message['role'], content))

    return messages


def json_output(text: str) -> dict[str, Any]:
    start_index = text.find('{')
    end_index = text.rfind('}')

    if start_index == -1 or end_index == -1 or start_index > end_index:
        return {}

    return json.loads(text[start_index:end_index + 1])


def clean_markdown_output(text: str) -> str:
    # Entfernt den ersten ```markdown und alles davor
    text = re.sub(r".*?```markdown\s*", "", text, count=1)
    # Entfernt das letzte ``` und alles danach
    text = re.sub(r"```.*$", "", text, count=1)
    return text
