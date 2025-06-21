import os
from flask import Flask, request, jsonify, send_from_directory
from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
CORS(app)

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
CHROMA_PERSIST_DIR = "chroma_db"
DEFAULT_KB_FILE = "KnowledgeBase.pdf"

llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", temperature=0)

system_prompt = (
    "You are an assistant for question-answering tasks. "
    "Use the following pieces of retrieved context to answer the question. "
    "If you don't know the answer, say that you don't know. "
    "Use three sentences max and keep it concise.\n\n{context}"
)

prompt = ChatPromptTemplate.from_messages([
    ("system", system_prompt),
    ("human", "{input}"),
])

def process_pdf(file_path):
    loader = PyPDFLoader(file_path)
    data = loader.load()

    splitter = RecursiveCharacterTextSplitter(chunk_size=1000)
    docs = splitter.split_documents(data)

    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

    if os.path.exists(CHROMA_PERSIST_DIR):
        vectorstore = Chroma(
            persist_directory=CHROMA_PERSIST_DIR,
            embedding_function=embeddings
        )
        vectorstore.add_documents(docs)
    else:
        vectorstore = Chroma.from_documents(
            documents=docs,
            embedding=embeddings,
            persist_directory=CHROMA_PERSIST_DIR
        )

    vectorstore.persist()

@app.route("/api/view_default_file")
def view_default_file():
    return send_from_directory(os.getcwd(), DEFAULT_KB_FILE)

@app.route("/api/ask", methods=["POST"])
def ask():
    data = request.json
    query = data.get("query")

    if not query:
        return jsonify({"error": "Query missing"}), 400

    vectorstore = Chroma(
        persist_directory=CHROMA_PERSIST_DIR,
        embedding_function=GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    )

    retriever = vectorstore.as_retriever(search_type="similarity", search_kwargs={"k": 10})
    qa_chain = create_stuff_documents_chain(llm, prompt)
    rag_chain = create_retrieval_chain(retriever, qa_chain)

    response = rag_chain.invoke({"input": query})
    answer = response.get("answer", "Sorry, I don't have the answer to that.")

    return jsonify({"answer": answer})

@app.route("/api/upload", methods=["POST"])
def upload_file():
    use_default = request.form.get("use_default_file") == "true"

    if use_default:
        path = os.path.join(os.getcwd(), DEFAULT_KB_FILE)
        process_pdf(path)
        return jsonify({"success": True})

    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    filepath = os.path.join(os.getcwd(), file.filename)
    file.save(filepath)
    process_pdf(filepath)

    return jsonify({"success": True})

if __name__ == "__main__":
    app.run(debug=True)
