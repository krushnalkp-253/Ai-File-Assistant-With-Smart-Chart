import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, FileText, Bot, User } from "lucide-react";
import Layout from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const Query = () => {
  const [selectedFile, setSelectedFile] = useState<string>("");
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Fetch user's files
  const { data: files } = useQuery({
    queryKey: ['files'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('files')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMessage: Message = { role: 'user', content: query };
    setMessages(prev => [...prev, userMessage]);
    setQuery("");
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      let fileContent = "";
      let fileName = "general query";

      // If a file is selected, fetch its content
      if (selectedFile && files) {
        const file = files.find(f => f.id === selectedFile);
        if (file) {
          fileName = file.filename;
          const { data: fileData, error: downloadError } = await supabase.storage
            .from('uploaded-files')
            .download(file.storage_path);

          if (downloadError) throw downloadError;
          fileContent = await fileData.text();
        }
      }

      // Call the edge function
      const { data, error } = await supabase.functions.invoke('process-file', {
        body: {
          fileContent: fileContent || "No file selected. This is a general query.",
          fileName,
          query: userMessage.content,
        }
      });

      if (error) throw error;

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response
      };
      setMessages(prev => [...prev, assistantMessage]);

      // Save query to database
      await supabase.from('queries').insert({
        user_id: user.id,
        file_id: selectedFile || null,
        query_text: userMessage.content,
        response: data.response,
        chart_data: data.chartData,
      });

    } catch (error: any) {
      toast({
        title: "Error processing query",
        description: error.message,
        variant: "destructive",
      });
      const errorMessage: Message = {
        role: 'assistant',
        content: "Sorry, I encountered an error processing your request. Please try again."
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            AI Chat Interface
          </h1>
          <p className="text-muted-foreground text-lg">
            Ask questions about your files or chat with AI
          </p>
        </div>

        {/* File Selector */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Select a file (optional)</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedFile} onValueChange={setSelectedFile}>
              <SelectTrigger>
                <SelectValue placeholder="No file selected - General chat mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No file - General chat</SelectItem>
                {files?.map((file) => (
                  <SelectItem key={file.id} value={file.id}>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      {file.filename}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Chat Messages */}
        <Card className="min-h-[400px]">
          <CardContent className="p-6">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[400px] text-center">
                <Bot className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <p className="text-lg font-medium text-muted-foreground">
                  Start a conversation
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Ask questions about your files or chat with AI
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex gap-3 ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <Bot className="h-5 w-5 text-white" />
                      </div>
                    )}
                    <div
                      className={`rounded-2xl px-4 py-3 max-w-[80%] ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                    {message.role === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                        <User className="h-5 w-5 text-secondary-foreground" />
                      </div>
                    )}
                  </div>
                ))}
                {loading && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                    <div className="rounded-2xl px-4 py-3 bg-muted">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-foreground/30 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 rounded-full bg-foreground/30 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 rounded-full bg-foreground/30 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Input Form */}
        <Card>
          <CardContent className="p-4">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask a question about your data or chat with AI..."
                className="min-h-[60px] resize-none"
                disabled={loading}
              />
              <Button type="submit" size="icon" className="h-[60px] w-[60px]" disabled={loading || !query.trim()}>
                <Send className="h-5 w-5" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Query;