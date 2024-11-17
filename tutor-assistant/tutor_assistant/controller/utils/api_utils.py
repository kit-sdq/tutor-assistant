from fastapi import HTTPException


def check_request_body(d: dict, keys: list):
    for key in keys:
        if key not in d:
            raise HTTPException(status_code=400, detail='Bad request body')