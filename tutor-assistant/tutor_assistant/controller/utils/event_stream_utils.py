def event_output(token: str):
    return f'event: data\ndata: "{token}"\n\n'


def event_end():
    return f'event: end\n\n'
