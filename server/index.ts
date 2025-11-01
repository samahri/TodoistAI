import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import { TodoistApi } from '@doist/todoist-api-typescript';
import { findTasks } from '@doist/todoist-ai';
import { TODOIST_SYSTEM_PROMPT } from './prompts/todoistMCP.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Initialize Todoist client
const getTodoistClient = () => {
  if (!process.env.TODOIST_API_TOKEN) {
    throw new Error('TODOIST_API_TOKEN environment variable is required');
  }
  return new TodoistApi(process.env.TODOIST_API_TOKEN);
};

// Convert findTasks tool to OpenAI function format
const tools = [{
  type: 'function' as const,
  function: {
    name: findTasks.name,
    description: findTasks.description,
    parameters: {
      type: 'object',
      properties: {
        searchText: {
          type: 'string',
          description: 'The text to search for in tasks.'
        },
        projectId: {
          type: 'string',
          description: 'Find tasks in this project.'
        },
        sectionId: {
          type: 'string',
          description: 'Find tasks in this section.'
        },
        parentId: {
          type: 'string',
          description: 'Find subtasks of this parent task.'
        },
        responsibleUser: {
          type: 'string',
          description: 'Find tasks assigned to this user. Can be a user ID, name, or email address.'
        },
        responsibleUserFiltering: {
          type: 'string',
          enum: ['assigned', 'unassignedOrMe', 'all'],
          description: 'How to filter by responsible user when responsibleUser is not provided.'
        },
        limit: {
          type: 'integer',
          minimum: 1,
          maximum: 50,
          description: 'The maximum number of tasks to return.'
        },
        cursor: {
          type: 'string',
          description: 'The cursor to get the next page of tasks.'
        },
        labels: {
          type: 'array',
          items: { type: 'string' },
          description: 'The labels to filter the tasks by'
        },
        labelsOperator: {
          type: 'string',
          enum: ['and', 'or'],
          description: 'The operator to use when filtering by labels.'
        }
      }
    }
  }
}];

// POST endpoint for AI response
app.post('/api/chat', async (req, res) => {
  try {
    // Get message from request body
    const { message: userMessage } = req.body;

    if (!userMessage) {
      return res.status(400).json({ message: 'Message is required in request body' });
    }

    // Check for required environment variables
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }

    if (!process.env.TODOIST_API_TOKEN) {
      throw new Error('TODOIST_API_TOKEN environment variable is required');
    }

    const todoistClient = getTodoistClient();
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: TODOIST_SYSTEM_PROMPT
      },
      {
        role: 'user',
        content: userMessage
      }
    ];

    // Function calling loop
    let response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
      tools
    });

    let assistantMessage = response.choices[0].message;
    messages.push(assistantMessage);

    // Handle tool calls
    while (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
      for (const toolCall of assistantMessage.tool_calls) {
        if (toolCall.type === 'function' && toolCall.function.name === 'find-tasks') {
          const functionArgs = JSON.parse(toolCall.function.arguments);
          const result = await findTasks.execute(functionArgs, todoistClient);

          messages.push({
            role: 'tool',
            tool_call_id: toolCall.id,
            content: JSON.stringify(result)
          });
        }
      }

      // Get next response from OpenAI
      response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages,
        tools
      });

      assistantMessage = response.choices[0].message;
      messages.push(assistantMessage);
    }

    res.json({ message: assistantMessage.content || 'No response generated' });
  } catch (error) {
    console.error('AI Error:', error);
    res.status(500).json({
      message: 'Error processing request',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
