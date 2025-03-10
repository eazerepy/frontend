"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send, Bot, UserIcon } from "lucide-react";
import {
  getAIAgent,
  getConversations,
  createConversation,
  getMessages,
  createMessage,
  sendMessage,
  type AIAgent,
  type Conversation,
  type Message,
} from "@/services/aiagentService";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Wallet } from "ethers";

export default function AgentChat({ params }: { params: { id: string } }) {
  const router = useRouter();
  const agentId = Number.parseInt(params.id);
  const [agent, setAgent] = useState<AIAgent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);

  // Fetch agent details
  useEffect(() => {
    const fetchAgent = async () => {
      try {
        setLoading(true);
        const data = await getAIAgent(agentId);
        setAgent(data);
        setError(null);
      } catch (err: any) {
        console.error(`Failed to fetch agent ${agentId}:`, err);
        if (err.response && err.response.status === 404) {
          setError(
            "Agent not found or you don't have permission to access it."
          );
        } else {
          setError("Failed to load agent details. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAgent();
  }, [agentId]);

  // Fetch conversations and messages
  useEffect(() => {
    const fetchConversationsAndMessages = async () => {
      try {
        const conversations = await getConversations(agentId);
        if (conversations.length > 0) {
          setConversation(conversations[0]);
          const messages = await getMessages(agentId, conversations[0].id);
          //setMessages(messages);
        } else {
          console.log("No conversations found for agent", agentId);
          const newConversation = await createConversation(agentId);
          setConversation(newConversation);
        }
      } catch (err: any) {
        console.error(
          `Failed to fetch conversations or messages for agent ${agentId}:`,
          err
        );
        setError(
          "Failed to load conversations or messages. Please try again later."
        );
      }
    };

    if (agent) {
      fetchConversationsAndMessages();
    }
  }, [agent, agentId]);

  // Focus input field when component loads
  useEffect(() => {
    if (!loading && !error && inputRef.current) {
      inputRef.current.focus();
    }
  }, [loading, error]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    console.log("agent", agent);
    if (!agent) return;
    
    console.log("agent?.evm_private_key", agent?.evm_private_key);
    const wallet = new Wallet(`${agent?.evm_private_key}`);
    console.log("wallet", wallet);
    setWallet(wallet);
  }, [agent]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputMessage.trim() || isSending || !conversation) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      conversation_id: conversation.id,
      role: "user",
      content: inputMessage,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsSending(true);

    try {
      // Send user message to the backend
      await createMessage(agentId, conversation.id, {
        role: userMessage.role,
        content: userMessage.content,
      });

     const zerepyResponse = await sendMessage(agentId, userMessage.content);
     console.log("ZerepyResponse", zerepyResponse);

     await createMessage(agentId, conversation.id, {
      role: "agent",
      content: JSON.stringify(zerepyResponse),
    });

     setMessages((prev) => [...prev, {
      id: Date.now(),
      conversation_id: conversation.id,
      role: "agent",
      content: JSON.stringify(zerepyResponse),
      created_at: new Date().toISOString(),
    }]);

      // Simulate agent response (in a real app, this would call an API)
      setTimeout(async () => {
        // Fetch updated messages from the backend
        const updatedMessages = await getMessages(agentId, conversation.id);
        setMessages(updatedMessages);
        setIsSending(false);
      }, 1000);
    } catch (err: any) {
      console.error("Failed to send message:", err);
      setError("Failed to send message. Please try again later.");
      setIsSending(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !agent) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 py-6 px-4">
          <div className="max-w-4xl mx-auto">
            <div
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6"
              role="alert"
            >
              {error || "Failed to load agent details. Please try again later."}
            </div>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md shadow-sm flex items-center"
            >
              <ArrowLeft size={16} className="mr-2" /> Go Back
            </button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const hasMessages = messages.length > 0;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 shadow-md">
          <div className="max-w-4xl mx-auto flex items-center">
            <div className="flex items-center">
              <div>
                <h1 className="text-xl font-bold">{agent.agent_name}</h1>
                <p className="text-sm text-purple-100">
                  {agent.traits.slice(0, 3).join(" • ")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Chat container */}
        <div className="flex-1 max-w-4xl w-full mx-auto flex flex-col">
          {/* Messages */}
          <div
            className={`flex-1 ${
              hasMessages
                ? "overflow-y-auto p-4"
                : "flex items-center justify-center"
            }`}
          >
            {hasMessages ? (
              <div className="space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    } animate-fadeIn`}
                  >
                    {message.role === "agent" && (
                      <div className="flex-shrink-0 mr-3">
                        <div className="bg-purple-100 p-2 rounded-full">
                          <Bot size={16} className="text-purple-600" />
                        </div>
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
                        message.role === "user"
                          ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                          : "bg-white border border-gray-100 text-gray-800"
                      }`}
                    >
                      <h6 className="font-semibold">
                        {
                          message.role === "agent"
                            ? JSON.parse(message.content)?.action.toUpperCase()
                            : "USER"
                        }
                      
                      </h6>
                      <p className="leading-relaxed">{
                      message.role === "agent" ?
                      JSON.parse(message.content)?.result 
                      : message.content
                    }</p>
                      <p
                        className={`text-xs mt-2 ${
                          message.role === "user"
                            ? "text-purple-200"
                            : "text-gray-500"
                        }`}
                      >
                        {new Date(message.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    {message.role === "user" && (
                      <div className="flex-shrink-0 ml-3">
                        <div className="bg-indigo-100 p-2 rounded-full">
                          <UserIcon size={16} className="text-indigo-600" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            ) : (
              <div className="text-center p-8 max-w-md mx-auto">
                <div className="bg-purple-100 p-4 rounded-full inline-block mb-4">
                  <Bot size={32} className="text-purple-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  Chat with {agent.agent_name}
                  {wallet?.address}
                </h2>
                <p className="text-gray-600 mb-4">
                  Send a message to start a conversation with this AI agent.
                </p>
                <div className="text-sm text-gray-500 bg-gray-100 p-3 rounded-lg">
                  <p className="font-medium mb-1">Agent traits:</p>
                  <div className="flex flex-wrap justify-center gap-2 mt-2">
                    {agent.traits.map((trait, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-white text-purple-600 rounded-full text-xs shadow-sm"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input form - positioned at bottom when there are messages, centered otherwise */}
          <div
            className={`p-4 ${
              hasMessages
                ? "border-t border-gray-200 bg-white"
                : "flex items-center justify-center"
            }`}
          >
            <form
              onSubmit={handleSendMessage}
              className={`flex items-center gap-2 ${
                hasMessages
                  ? ""
                  : "max-w-md w-full bg-white p-2 rounded-lg shadow-md"
              }`}
            >
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={`Message ${agent.agent_name}...`}
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50"
                disabled={isSending}
              />
              <button
                type="submit"
                className="p-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 transition-colors shadow-sm"
                disabled={isSending || !inputMessage.trim()}
                aria-label="Send message"
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
