def get_embedding(text: str):
    import hashlib
    h = hashlib.sha256(text.encode("utf-8")).hexdigest()
    return [(int(h[i % len(h)], 16) / 15.0) - 0.5 for i in range(1024)]
