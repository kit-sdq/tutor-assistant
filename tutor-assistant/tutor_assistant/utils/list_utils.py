from typing import List, Callable, TypeVar

T = TypeVar("T")


def distinct_by(get_distinct_key: Callable[[T], object], items: List[T]) -> List[T]:
    seen = set()
    result = []
    for item in items:
        key = get_distinct_key(item)
        if key not in seen:
            seen.add(key)
            result.append(item)
    return result
