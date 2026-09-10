def chunk_text(text: str, chunk_size: int = 500, overlap: int = 75):
    words = text.split()
    chunks = []
    start = 0
    chunk_id = 1

    while start < len(words):
        end = min(start + chunk_size, len(words))
        chunk_content = " ".join(words[start:end])
        chunks.append({
            "chunk_id": chunk_id,
            "text": chunk_content,
            "word_count": end - start
        })
        chunk_id += 1
        if end == len(words):
            break
        start += (chunk_size - overlap)

    return chunks
