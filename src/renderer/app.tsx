import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Session, SessionInfo } from '../models/chat';

const App = () => {
  const [sessions, setSessions] = React.useState<SessionInfo[]>([]);
  const [activeSession, setActiveSession] = React.useState<Session | null>(null);
  const [newSession, setNewSession] = React.useState<Session | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

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
      setActiveSession(result);
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
      console.log('New session created:', result);
    } catch (err) {
      setError(`Error creating new session: ${(err as Error).message}`);
      console.error('Error creating new session:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Electron API Test Page</h1>
      
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
                    backgroundColor: '#f5f5f5', 
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
                backgroundColor: '#e3f2fd', 
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
                backgroundColor: '#e8f5e8', 
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
    </div>
  );
};

const root = createRoot(document.body);
root.render(<App />);
