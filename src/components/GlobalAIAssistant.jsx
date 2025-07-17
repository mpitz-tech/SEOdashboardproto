import React, { useState } from 'react'
import { Bot, X } from 'lucide-react'
import AIChat from './AIChat'

const GlobalAIAssistant = ({ data, currentContext }) => {
  const [isOpen, setIsOpen] = useState(false)

  const getContextDescription = () => {
    switch (currentContext) {
      case 'overview':
        return 'Overview Dashboard - Key metrics and performance summary'
      case 'analytics':
        return 'Analytics Panel - Detailed page and query performance'
      case 'ai-chat':
        return 'AI Assistant - Natural language SEO insights'
      default:
        return 'SEO Dashboard'
    }
  }

  const getContextualSuggestions = () => {
    switch (currentContext) {
      case 'overview':
        return [
          "What's driving the 12.5% increase in visits?",
          "Which metrics need my attention on this overview?",
          "How do my conversion rates compare to industry benchmarks?",
          "What trends do you see in my key performance indicators?"
        ]
      case 'analytics':
        return [
          "Which page in this analysis has the biggest opportunity?",
          "What patterns do you see in my search query performance?",
          "How can I improve the CTR for my top impressions?",
          "Which pages should I optimize first based on this data?"
        ]
      default:
        return [
          "What are my top performing pages?",
          "How is my revenue trending?",
          "Which search queries drive the most traffic?",
          "What optimization opportunities do I have?"
        ]
    }
  }

  return (
    <>
      {/* AI Toggle Button */}
      <div className="ai-toggle">
        <button 
          className="ai-toggle-btn"
          onClick={() => setIsOpen(!isOpen)}
          title="Toggle AI Assistant"
        >
          <Bot size={24} />
        </button>
      </div>

      {/* AI Popup */}
      <div className={`ai-popup ${isOpen ? 'open' : ''}`}>
        <div className="ai-popup-header">
          <div className="ai-popup-title">
            <Bot size={20} />
            <h3>AI Assistant</h3>
          </div>
          <button 
            className="ai-popup-close"
            onClick={() => setIsOpen(false)}
          >
            <X size={18} />
          </button>
        </div>
        
        <div className="context-indicator">
          <strong>Current view:</strong> {getContextDescription()}
        </div>
        
        <div className="ai-popup-content">
          <AIChat 
            data={data} 
            currentContext={currentContext}
            contextualSuggestions={getContextualSuggestions()}
            isPopup={true}
          />
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="ai-backdrop"
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 998
          }}
        />
      )}
    </>
  )
}

export default GlobalAIAssistant