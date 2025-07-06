import { ChatGroq } from "@langchain/groq";
import { ChatOpenAI } from "@langchain/openai";
import { ChatOllama } from "@langchain/ollama";

import { embedAndStore, loadVectorStore, inMemoryStore } from "../utils/vectorStore.js";
import fs from "fs";

export const runAgent = async ({
  provider,
  apiKey,
  model,
  prompt,
  question,
  chatHistory,
  useRAG,
  documentPath,
  embedProvider,
  embedApiKey,
  memory,
  agentId
}) => {
  try {
    console.log("🔹 prompt:", prompt);
    console.log("🔹 doc:", documentPath);
    console.log("🔹 provider:", provider);
    console.log("🔹 model:", model);
    console.log("🔹 question:", question);
    console.log("🔹 useRAG:", useRAG);
    console.log("🔹 embedProvider:", embedProvider);
    console.log("🔹 memory:", memory);
    console.log("🔹 agentId:", agentId);
    console.log("🔹 vector:", inMemoryStore);

    if (!question || typeof question !== "string") {
      throw new Error("❌ Question must be a non-empty string.");
    }

    // Step 1: Initialize chat model
    let chatModel;
    switch (provider.toLowerCase()) {
      case "groq":
        chatModel = new ChatGroq({ apiKey, model, temperature: 0.7 });
        break;
      case "ollama":
        chatModel = new ChatOllama({ baseUrl: "http://localhost:11434", model, temperature: 0.7 });
        break;
      case "openai":
        chatModel = new ChatOpenAI({ apiKey, modelName: model, temperature: 0.7 });
        break;
      default:
        throw new Error(`❌ Unsupported provider: ${provider}`);
    }

    // Step 2: Retrieve relevant context if RAG is enabled or if document was uploaded
    let context = "";
    let vectorStore;
    let embeddedThisTime = false;

    const shouldUseRAG = useRAG || (!!documentPath && fs.existsSync(documentPath));
    if (inMemoryStore[agentId]) {
  console.log("✅ Found in-memory vector store. Using it for context.");
  vectorStore = inMemoryStore[agentId];
  const results = await vectorStore.similaritySearch(question, 3);
  context = results.map(doc => doc.pageContent).join("\n");
}
    if (shouldUseRAG && embedProvider && embedApiKey && memory && agentId) {
      try {
        console.log("Logggggghrbfkhwhbv")
        // Try loading from existing vector store
        vectorStore = await loadVectorStore({
          embedProvider,
          embedApiKey,
          memory,
          agentId
        });
        console.log("✅ Loaded vector store");
      } catch (err) {
        // console.log("Logggggghrbfkhwhbv")
        // If no store found and documentPath exists, embed on the fly
        if (documentPath && fs.existsSync(documentPath)) {
          console.log("📥 Embedding new document into vector store");
          context = await embedAndStore({
            documentPath,
            question,
            embedProvider,
            embedApiKey,
            memory,
            agentId
          });
          embeddedThisTime = true;
        } else {
          console.warn("⚠️ No vector store found and no document to embed.");
        }
      }

      if (!embeddedThisTime && vectorStore) {
        console.log("Logggggghrbfkhwhbv")
        const results = await vectorStore.similaritySearch(question, 3);
        context = results.map(doc => doc.pageContent).join("\n");
      }
    }
    // else if(inMemoryStore[agentId]){
    //   console.log("Logggggghrbfkhwhbv")
    //    const results = await vectorStore.similaritySearch(question, 3);
    //     context = results.map(doc => doc.pageContent).join("\n");
    // }

    // Step 3: Build messages list
    const messages = [
      ["system", `${prompt}${context ? "\nRelevant context:\n" + context : ""}`],
      ...(chatHistory || []).map(m => [m.role, typeof m.content === "string" ? m.content : ""]),
      ["human", question]
    ];
     
    // if(inMemoryStore[agentId]){

    // }
    // Step 4: Invoke the model
    const result = await chatModel.invoke(messages);
    return result.content;

  } catch (err) {
    console.error("❌ Error in runAgent:", err);
    throw err;
  }
};
