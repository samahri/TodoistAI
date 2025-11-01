import { Avatar } from './ui/avatar';
import { Bot } from 'lucide-react';

export function TypingIndicator() {
  return (
    <div className="flex gap-3 p-4">
      <Avatar className="w-8 h-8 shrink-0">
        <div className="w-full h-full bg-muted rounded-full flex items-center justify-center">
          <Bot className="w-4 h-4 text-muted-foreground" />
        </div>
      </Avatar>
      
      <div className="flex flex-col gap-1">
        <div className="bg-muted text-muted-foreground px-4 py-2 rounded-2xl rounded-bl-md">
          <div className="flex gap-1 items-center">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}