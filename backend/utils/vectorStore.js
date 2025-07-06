import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

import { OpenAIEmbeddings } from '@langchain/openai';
import { HuggingFaceTransformersEmbeddings } from '@langchain/community/embeddings/huggingface_transformers';

import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { RedisVectorStore } from '@langchain/redis';
import { Chroma } from '@langchain/community/vectorstores/chroma';

import { Client as PGClient } from 'pg';
import { PGVectorStore } from '@langchain/community/vectorstores/pgvector';

import fs from 'fs/promises';
import { Blob } from 'buffer';

// ✅ Store for in-memory vector store
export const inMemoryStore = {};

const getEmbeddings = (provider, apiKey) => {
  if (provider === 'openai') {
    return new OpenAIEmbeddings({ openAIApiKey: apiKey });
  } else if (provider === 'huggingface') {
    return new HuggingFaceTransformersEmbeddings({
      modelName: 'Xenova/all-MiniLM-L6-v2',
    });
  } else {
    throw new Error(`Unsupported embedding provider: ${provider}`);
  }
};

export const embedAndStore = async ({
  documentPath,
  question,
  embedProvider,
  embedApiKey,
  memory,
  agentId,
}) => {
  console.log('📁 Reading from documentPath:', documentPath);

  const fileBuffer = await fs.readFile(documentPath);
  const loader = new PDFLoader(new Blob([fileBuffer]));
  const rawDocs = await loader.load();

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50,
  });

  const docs = await splitter.splitDocuments(rawDocs);
  const embeddings = getEmbeddings(embedProvider, embedApiKey);

  const namespace = `agent:${agentId}`;
  const tableName = `embeddings_agent_${agentId}`;
  let vectorStore;

  switch (memory) {
    case 'Redis':
      vectorStore = await RedisVectorStore.fromDocuments(docs, embeddings, {
        redisUrl: process.env.REDIS_URL,
        indexName: namespace,
      });
      break;

    case 'PostgreSQL': {
      const pgClient = new PGClient({
        connectionString: process.env.POSTGRES_URL,
      });
      await pgClient.connect();
      vectorStore = await PGVectorStore.fromDocuments(docs, embeddings, {
        pgClient,
        tableName,
        columns: {
          idColumnName: 'id',
          contentColumnName: 'content',
          vectorColumnName: 'embedding',
        },
      });
      break;
    }

    case 'Chroma':
      vectorStore = await Chroma.fromDocuments(docs, embeddings, {
        collectionName: `agent:${agentId}`,
        url: undefined,
        path: './chroma_store',
        collectionMetadata: {
          'hnsw:space': 'cosine',
        },
      });
      break;

    case 'In-Memory':
      vectorStore = await MemoryVectorStore.fromDocuments(docs, embeddings);
      inMemoryStore[agentId] = vectorStore; // ✅ Save in memory
      break;

    default:
      throw new Error(`Unsupported memory type: ${memory}`);
  }

  const results = await vectorStore.similaritySearch(question, 3);
  return results.map((doc) => doc.pageContent).join('\n');
};

export const loadVectorStore = async ({
  embedProvider,
  embedApiKey,
  memory,
  agentId,
}) => {
  const embeddings = getEmbeddings(embedProvider, embedApiKey);
  const namespace = `agent:${agentId}`;
  const tableName = `embeddings_agent_${agentId}`;
  let vectorStore;

  switch (memory) {
    case 'Redis':
      vectorStore = new RedisVectorStore(embeddings, {
        redisUrl: process.env.REDIS_URL,
        indexName: namespace,
      });
      break;

    case 'PostgreSQL': {
      const pgClient = new PGClient({
        connectionString: process.env.POSTGRES_URL,
      });
      await pgClient.connect();
      vectorStore = new PGVectorStore(embeddings, {
        pgClient,
        tableName,
        columns: {
          idColumnName: 'id',
          contentColumnName: 'content',
          vectorColumnName: 'embedding',
        },
      });
      break;
    }

    case 'Chroma':
      vectorStore = new Chroma(embeddings, {
        collectionName: `agent:${agentId}`,
        url: undefined,
        path: './chroma_store',
      });
      break;

    case 'In-Memory':
      if (!inMemoryStore[agentId]) {
        throw new Error(`In-memory store not found for agent: ${agentId}`);
      }
      vectorStore = inMemoryStore[agentId];
      break;

    default:
      throw new Error(`Unsupported memory type: ${memory}`);
  }

  return vectorStore;
};
