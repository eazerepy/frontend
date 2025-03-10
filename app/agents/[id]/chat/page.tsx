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
  sendMessageV2,
  type AIAgent,
  type Conversation,
  type Message,
} from "@/services/aiagentService";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Wallet } from "ethers";
import { use } from "react";

export default function AgentChat({
  params,
}: {
  params: Promise<{ id: Number }>;
}) {
  const router = useRouter();

  const { id } = use(params);
  const agentId = parseInt(String(id), 10);

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
          const fetchedMessages = await getMessages(
            agentId,
            conversations[0].id
          );
          setMessages(fetchedMessages); // Set the messages state with fetched messages
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

    const newMessages = [...messages, userMessage];

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsSending(true);

    console.log("messages before try", messages);

    try {
      // Send user message to the backend
      const sentMessage = await createMessage(agentId, conversation.id, {
        conversation_id: conversation.id,
        role: userMessage.role,
        content: userMessage.content,
      });

      const zerepyResponse = await sendMessageV2(agentId, newMessages);

      await createMessage(agentId, conversation.id, {
        conversation_id: conversation.id,
        role: "assistant",
        content: JSON.stringify(zerepyResponse),
      });

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          conversation_id: conversation.id,
          role: "assistant",
          content: JSON.stringify(zerepyResponse),
          created_at: new Date().toISOString(),
        },
      ]);

      console.log("messages after everything done", messages);
    } catch (err: any) {
      console.error("Failed to send message:", err);
      setError("Failed to send message. Please try again later.");
    } finally {
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
        <div className="header-height bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 shadow-md">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center">
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
        </div>

        {/* Main content with chat and sidebar */}
        <div className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full">
          {/* Sidebar with agent info */}
          <div className="mt-10 w-full lg:w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
            <div className="sticky top-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Agent Information
              </h3>

              {/* Introduction section */}
              <div className="mb-6 bg-purple-50 p-4 rounded-lg border border-purple-100">
                <div className="flex items-center mb-2">
                  <Bot size={20} className="text-purple-600 mr-2" />
                  <h4 className="font-medium text-purple-800">Welcome!</h4>
                </div>
                <p className="text-sm text-purple-700 mb-2">
                  You're chatting with {agent.agent_name}, your AI assistant.
                </p>
                <p className="text-sm text-purple-700">
                  Ask questions or give instructions to interact with this
                  agent.
                </p>
              </div>

              {/* Agent wallet */}
              {wallet && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Wallet Address
                  </h4>
                  <p className="text-xs text-gray-600 break-all">
                    {wallet.address}
                  </p>
                </div>
              )}

              {/* Agent traits */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Traits
                </h4>
                <div className="flex flex-wrap gap-2">
                  {agent.traits.map((trait, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-purple-600 rounded-full text-xs"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>

              {/* Agent bio */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Bio</h4>
                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  {agent.agent_bio.map((sentence, index) => (
                    <p key={index} className="mb-2">
                      {sentence}
                    </p>
                  ))}
                </div>
              </div>

              {/* Agent capabilities */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Capabilities
                </h4>
                <ul className="text-sm text-gray-600 space-y-1 bg-gray-50 p-3 rounded-lg">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Blockchain Interactions
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Natural Language Processing
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Sonic Network Integration
                  </li>
                </ul>
              </div>

              {/* Chat status */}
              <div className="mt-6 p-3 bg-purple-50 rounded-lg border border-purple-100">
                <div className="flex items-center">
                  <div className="relative mr-2">
                    <span className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full"></span>
                    <Bot size={16} className="text-purple-600" />
                  </div>
                  <span className="text-sm font-medium text-purple-700">
                    {isSending ? "Agent is typing..." : "Agent is online"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Chat container */}
          <div className="flex-1 flex flex-col border-r border-gray-200">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="messages-board space-y-6">
                {messages.length > 0 ? (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      } animate-fadeIn`}
                    >
                      {message.role === "assistant" && (
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
                          {message.role === "assistant" &&
                          message.content.startsWith("{")
                            ? JSON.parse(message.content)?.action?.toUpperCase()
                            : message.role === "user"
                            ? "USER"
                            : "AGENT"}
                        </h6>
                        <p className="leading-relaxed">
                          {message.role === "assistant" &&
                          message.content.startsWith("{")
                            ? JSON.parse(message.content)?.result
                            : message.content}
                        </p>
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
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    No messages yet. Start the conversation!
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input form */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <form
                onSubmit={handleSendMessage}
                className="flex items-center gap-2"
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
      </div>
    </ProtectedRoute>
  );
}
