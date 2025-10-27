import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Session, Conversation, Message } from '../models/chat';

const App = () => {
  const [sessions, setSessions] = React.useState<Session[]>([]);
  const [activeSession, setActiveSession] = React.useState<Session | null>(null);
  const [newSession, setNewSession] = React.useState<Session | null>(null);
  const [activeConversation, setActiveConversation] = React.useState<Conversation | null>(null);
  const [conversations, setConversations] = React.useState<Conversation[]>([]);
  const [newMessage, setNewMessage] = React.useState<string>('');
  const [messageRole, setMessageRole] = React.useState<'user' | 'assistant' | 'system'>('user');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState<'session' | 'conversation'>('session');

  // Test listSessions function
  const handleListSessions = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await window.electronAPI.listSessions();
      setSessions(result);
      console.log('Sessions listed:', result);
    } catch (err) {
      setError(`Error listing sessions: ${(err as Error).message}`);
      console.error('Error listing sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  // Test getLastActiveSession function
  const handleGetLastActiveSession = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await window.electronAPI.getLastActiveSession();
      if(result) {
        setActiveSession(result);
        // Load conversations for the active session
        await handleListConversations(result.id);
      }
      else {
        console.log("result is null:");
        console.log(result);
      }
      console.log('Last active session:', result);
    } catch (err) {
      setError(`Error getting last active session: ${(err as Error).message}`);
      console.error('Error getting last active session:', err);
    } finally {
      setLoading(false);
    }
  };

  // Test createNewSession function
  const handleCreateNewSession = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await window.electronAPI.createNewSession();
      setNewSession(result);
      setActiveSession(result);
      console.log('New session created:', result);
    } catch (err) {
      setError(`Error creating new session: ${(err as Error).message}`);
      console.error('Error creating new session:', err);
    } finally {
      setLoading(false);
    }
  };

  // Test createConversation function
  const handleCreateConversation = async () => {
    if (!activeSession) {
      setError('No active session selected');
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const result = await window.electronAPI.createConversation(activeSession.id);
      // Update the active session with the new conversation
      const updatedSession = await window.electronAPI.setActiveConversation(activeSession.id, result.id);
      setActiveSession(updatedSession);
      setActiveConversation(result);
      await handleListConversations(activeSession.id);
      console.log('New conversation created:', result);
    } catch (err) {
      setError(`Error creating conversation: ${(err as Error).message}`);
      console.error('Error creating conversation:', err);
    } finally {
      setLoading(false);
    }
  };

  // Test listConversations function
  const handleListConversations = async (sessionId: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await window.electronAPI.listConversations(sessionId);
      setConversations(result);
      console.log('Conversations listed:', result);
    } catch (err) {
      setError(`Error listing conversations: ${(err as Error).message}`);
      console.error('Error listing conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  // Test readConversation function
  const handleReadConversation = async (conversationId: string) => {
    if (!activeSession) {
      setError('No active session selected');
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const result = await window.electronAPI.readConversation(activeSession.id, conversationId);
      setActiveConversation(result);
      console.log('Conversation read:', result);
    } catch (err) {
      setError(`Error reading conversation: ${(err as Error).message}`);
      console.error('Error reading conversation:', err);
    } finally {
      setLoading(false);
    }
  };

  // Test setActiveConversation function
  const handleSetActiveConversation = async (conversationId: string) => {
    if (!activeSession) {
      setError('No active session selected');
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const result = await window.electronAPI.setActiveConversation(activeSession.id, conversationId);
      setActiveSession(result);
      await handleReadConversation(conversationId);
      console.log('Active conversation set:', result);
    } catch (err) {
      setError(`Error setting active conversation: ${(err as Error).message}`);
      console.error('Error setting active conversation:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add message to conversation using atomic disk writes
  const handleAddMessage = async () => {
    if (!activeConversation || !activeSession || !newMessage.trim()) {
      setError('Please select a conversation and enter a message');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const newMsg: Message = {
        id: Date.now().toString(),
        role: messageRole,
        content: newMessage.trim(),
        timestamp: new Date().toISOString()
      };

      // Create a copy of the conversation with the new message
      const updatedConversation = {
        ...activeConversation,
        messages: [...activeConversation.messages, newMsg],
        updatedAt: new Date().toISOString()
      };

      // Use atomic update by replacing the entire session
      const updatedSession = await window.electronAPI.updateConversation(
        activeSession.id, 
        updatedConversation
      );
      
      const displayResult = await window.electronAPI.readConversation(updatedSession.id, updatedConversation.id);

      setActiveConversation(displayResult);
      setNewMessage('');
      console.log('Message added successfully');
    } catch (err) {
      setError(`Error adding message: ${(err as Error).message}`);
      console.error('Error adding message:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Electron API Test Page</h1>
      
      {/* Tab Navigation */}
      <div style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
        <button 
          onClick={() => setActiveTab('session')}
          style={{ 
            padding: '8px 16px', 
            marginRight: '10px',
            cursor: 'pointer',
            backgroundColor: activeTab === 'session' ? '#4CAF50' : '#f1f1f1',
            color: activeTab === 'session' ? 'white' : '#333',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          Session Management
        </button>
        
        <button 
          onClick={() => setActiveTab('conversation')}
          style={{ 
            padding: '8px 16px', 
            cursor: 'pointer',
            backgroundColor: activeTab === 'conversation' ? '#2196F3' : '#f1f1f1',
            color: activeTab === 'conversation' ? 'white' : '#333',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          Conversation Testing
        </button>
      </div>

      {/* Session Management Tab */}
      {activeTab === 'session' && (
        <div style={{ marginBottom: '20px' }}>
          <h2>Session Management Tests</h2>
          
          <div style={{ marginBottom: '15px' }}>
            <button 
              onClick={handleListSessions}
              disabled={loading}
              style={{ 
                padding: '8px 16px', 
                marginRight: '10px',
                cursor: loading ? 'not-allowed' : 'pointer',
                backgroundColor: loading ? '#ccc' : '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px'
              }}
            >
              {loading ? 'Loading...' : 'List Sessions'}
            </button>
            
            <button 
              onClick={handleGetLastActiveSession}
              disabled={loading}
              style={{ 
                padding: '8px 16px', 
                marginRight: '10px',
                cursor: loading ? 'not-allowed' : 'pointer',
                backgroundColor: loading ? '#ccc' : '#2196F3',
                color: 'white',
                border: 'none',
                borderRadius: '4px'
              }}
            >
              {loading ? 'Loading...' : 'Get Last Active Session'}
            </button>
            
            <button 
              onClick={handleCreateNewSession}
              disabled={loading}
              style={{ 
                padding: '8px 16px', 
                cursor: loading ? 'not-allowed' : 'pointer',
                backgroundColor: loading ? '#ccc' : '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px'
              }}
            >
              {loading ? 'Loading...' : 'Create New Session'}
            </button>
          </div>

          {error && (
            <div style={{ 
              color: '#f44336', 
              padding: '10px', 
              backgroundColor: '#ffebee', 
              border: '1px solid #f44336',
              borderRadius: '4px',
              marginBottom: '15px'
            }}>
              Error: {error}
            </div>
          )}

          <div style={{ marginTop: '20px' }}>
            <h3>Results</h3>
            
            <div style={{ marginBottom: '15px' }}>
              <h4>Sessions List:</h4>
              {sessions.length === 0 ? (
                <p>No sessions found</p>
              ) : (
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                  {sessions.map(session => (
                    <li key={session.id} style={{ 
                      padding: '8px', 
                      backgroundColor: '#323c3dff', 
                      marginBottom: '5px',
                      borderRadius: '4px'
                    }}>
                      <strong>ID:</strong> {session.id}<br />
                      <strong>Created:</strong> {new Date(session.createdAt).toLocaleString()}<br />
                      <strong>Updated:</strong> {new Date(session.updatedAt).toLocaleString()}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div style={{ marginBottom: '15px' }}>
              <h4>Last Active Session:</h4>
              {!activeSession ? (
                <p>No active session retrieved</p>
              ) : (
                <div style={{ 
                  padding: '10px', 
                  backgroundColor: '#323c3dff', 
                  borderRadius: '4px'
                }}>
                  <strong>ID:</strong> {activeSession.id}<br />
                  <strong>Active Conversation ID:</strong> {activeSession.activeConversationId}<br />
                  <strong>Created:</strong> {new Date(activeSession.createdAt).toLocaleString()}<br />
                  <strong>Updated:</strong> {new Date(activeSession.updatedAt).toLocaleString()}<br />
                  <strong>Conversations:</strong> {activeSession.conversations.length}<br />
                  <strong>LLM Config:</strong> Temp: {activeSession.settings.temperature}, Max Tokens: {activeSession.settings.maxTokens}
                </div>
              )}
            </div>

            <div>
              <h4>Newly Created Session:</h4>
              {!newSession ? (
                <p>No new session created</p>
              ) : (
                <div style={{ 
                  padding: '10px', 
                  backgroundColor: '#323c3dff', 
                  borderRadius: '4px'
                }}>
                  <strong>ID:</strong> {newSession.id}<br />
                  <strong>Active Conversation ID:</strong> {newSession.activeConversationId}<br />
                  <strong>Created:</strong> {new Date(newSession.createdAt).toLocaleString()}<br />
                  <strong>Updated:</strong> {new Date(newSession.updatedAt).toLocaleString()}<br />
                  <strong>Conversations:</strong> {newSession.conversations.length}<br />
                  <strong>LLM Config:</strong> Temp: {newSession.settings.temperature}, Max Tokens: {newSession.settings.maxTokens}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Conversation Testing Tab */}
      {activeTab === 'conversation' && (
        <div style={{ marginBottom: '20px' }}>
          <h2>Conversation Testing</h2>
          
          {!activeSession ? (
            <div style={{ 
              padding: '10px', 
              backgroundColor: '#ffebee', 
              border: '1px solid #f44336',
              borderRadius: '4px',
              marginBottom: '15px'
            }}>
              <p style={{ color: '#f44336' }}>Please select or create a session first in the Session Management tab</p>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: '15px' }}>
                <button 
                  onClick={handleCreateConversation}
                  disabled={loading}
                  style={{ 
                    padding: '8px 16px', 
                    marginRight: '10px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    backgroundColor: loading ? '#ccc' : '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px'
                  }}
                >
                  {loading ? 'Loading...' : 'Create New Conversation'}
                </button>
                
                <button 
                  onClick={async () => activeSession.id && handleListConversations(activeSession.id)}
                  disabled={loading}
                  style={{ 
                    padding: '8px 16px', 
                    marginRight: '10px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    backgroundColor: loading ? '#ccc' : '#2196F3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px'
                  }}
                >
                  {loading ? 'Loading...' : 'List Conversations'}
                </button>
              </div>

              {/* Conversation List */}
              <div style={{ marginBottom: '20px' }}>
                <h3>Conversations</h3>
                {conversations.length === 0 ? (
                  <p>No conversations found for this session</p>
                ) : (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {conversations.map(conversation => (
                      <div 
                        key={conversation.id} 
                        style={{ 
                          padding: '10px', 
                          backgroundColor: activeConversation?.id === conversation.id ? '#2196F3' : '#323c3dff',
                          color: activeConversation?.id === conversation.id ? 'white' : 'white',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          flex: '1 1 200px'
                        }}
                        onClick={
                          () => {
                            handleReadConversation(conversation.id);
                            handleSetActiveConversation(conversation.id);
                          }
                        }
                      >
                        <strong>#{conversation.id.substring(0, 6)}</strong><br />
                        <strong>Title:</strong> {conversation.title}<br />
                        <strong>Messages:</strong> {conversation.messages.length}<br />
                        <strong>Updated:</strong> {new Date(conversation.updatedAt).toLocaleString()}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Active Conversation Details */}
              {activeConversation ? (
                <div style={{ marginBottom: '20px', border: '1px solid #ddd', borderRadius: '4px', padding: '15px' }}>
                  <h3>Active Conversation</h3>
                  <div style={{ marginBottom: '15px' }}>
                    <strong>ID:</strong> {activeConversation.id}<br />
                    <strong>Title:</strong> {activeConversation.title}<br />
                    <strong>Created:</strong> {new Date(activeConversation.createdAt).toLocaleString()}<br />
                    <strong>Updated:</strong> {new Date(activeConversation.updatedAt).toLocaleString()}<br />
                    <strong>Messages:</strong> {activeConversation.messages.length}
                  </div>

                  {/* Message List */}
                  <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '15px', padding: '10px', backgroundColor: '#444444ff', borderRadius: '4px' }}>
                    <h4>Messages:</h4>
                    {activeConversation.messages.length === 0 ? (
                      <p>No messages yet</p>
                    ) : (
                      <div style={{ marginTop: '10px' }}>
                        {activeConversation.messages.map((message, index) => (
                          <div 
                            key={message.id} 
                            style={{ 
                              marginBottom: '15px',
                              padding: '10px',
                              backgroundColor: message.role === 'user' ? '#4b4b4bff' : message.role === 'assistant' ? '#e8f5e8' : '#f5f5f5',
                              borderRadius: '4px',
                              borderLeft: `4px solid ${message.role === 'user' ? '#2196F3' : message.role === 'assistant' ? '#4CAF50' : '#9e9e9e'}`
                            }}
                          >
                            <div style={{ fontWeight: 'bold', marginBottom: '5px', color: message.role === 'user' ? '#2196F3' : message.role === 'assistant' ? '#4CAF50' : '#9e9e9e' }}>
                              {message.role.charAt(0).toUpperCase() + message.role.slice(1)}
                              <span style={{ float: 'right', fontSize: '0.8em', color: '#666' }}>
                                {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </span>
                            </div>
                            <div>{message.content}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Add Message Form */}
                  <div style={{ marginTop: '20px' }}>
                    <h4>Add New Message</h4>
                    <div style={{ marginBottom: '10px' }}>
                      <label style={{ marginRight: '10px' }}>Role:</label>
                      <select 
                        value={messageRole} 
                        onChange={(e) => setMessageRole(e.target.value as 'user' | 'assistant' | 'system')}
                        style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ddd' }}
                      >
                        <option value="user">User</option>
                        <option value="assistant">Assistant</option>
                        <option value="system">System</option>
                      </select>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                      <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Enter your message..."
                        style={{ 
                          width: '100%', 
                          padding: '8px', 
                          borderRadius: '4px', 
                          border: '1px solid #ddd',
                          minHeight: '100px'
                        }}
                      />
                    </div>
                    <button 
                      onClick={handleAddMessage}
                      disabled={loading || !newMessage.trim()}
                      style={{ 
                        padding: '8px 16px', 
                        cursor: loading ? 'not-allowed' : 'pointer',
                        backgroundColor: loading ? '#ccc' : '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px'
                      }}
                    >
                      {loading ? 'Adding...' : 'Add Message'}
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '10px', backgroundColor: '#4e4e4eff', border: '1px solid #ddd', borderRadius: '4px' }}>
                  <p>Select a conversation from the list above to view or edit its messages</p>
                </div>
              )}
            </>
          )}

          {error && (
            <div style={{ 
              color: '#f44336', 
              padding: '10px', 
              backgroundColor: '#ffebee', 
              border: '1px solid #f44336',
              borderRadius: '4px',
              marginBottom: '15px'
            }}>
              Error: {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const root = createRoot(document.body);
root.render(<App />);
