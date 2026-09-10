from services.ai.embeddings.generate import get_embedding

class RAGRetriever:
    def __init__(self):
        self.doc_store = []

    def index_document(self, doc_id: str, title: str, chunks: list):
        for c in chunks:
            emb = get_embedding(c["text"])
            self.doc_store.append({
                "doc_id": doc_id,
                "title": title,
                "chunk_id": c["chunk_id"],
                "text": c["text"],
                "vector": emb
            })

    def search(self, query: str, top_k: int = 3):
        query_vec = get_embedding(f"query: {query}")
        scored = []
        for item in self.doc_store:
            dot_product = sum(a * b for a, b in zip(query_vec[:64], item["vector"][:64]))
            scored.append((dot_product, item))
        scored.sort(key=lambda x: x[0], reverse=True)
        return [item for _, item in scored[:top_k]]

retriever = RAGRetriever()
