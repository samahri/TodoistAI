'use client'

import { ChatBot } from './components/ChatBot';

export default function App() {
  return (
    <div className="min-h-screen bg-background p-4 flex items-center justify-center">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-6">
          <h1 className="mb-2">Todoist AI Assistant</h1>
          <p className="text-muted-foreground">
            Manage your tasks and productivity with AI assistance
          </p>
        </div>
        <ChatBot />
      </div>
    </div>
  );
}