import React, { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Lightbulb, TrendingUp, Search, DollarSign } from 'lucide-react'
import dataService from '../services/dataService'

const AIChat = ({ data, currentContext, contextualSuggestions, isPopup = false }) => {
  const getInitialMessage = () => {
    if (currentContext === 'overview') {
      return "Hi! I can see you're viewing the overview dashboard. I can help you understand these metrics, trends, and identify opportunities. What would you like to know about your performance?"
    } else if (currentContext === 'analytics') {
      return "I can see you're in the analytics section. I can help you understand the detailed performance data, identify patterns, and suggest optimizations. What specific aspect would you like to explore?"
    } else {
      return "Hello! I'm your SEO AI assistant. I can help you analyze your website performance, search rankings, and provide actionable insights. What would you like to know?"
    }
  }

  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: getInitialMessage(),
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Update initial message when context changes
  useEffect(() => {
    if (messages.length === 1) {
      setMessages([{
        id: 1,
        type: 'ai',
        content: getInitialMessage(),
        timestamp: new Date()
      }])
    }
  }, [currentContext])

  const defaultSuggestedQueries = [
    {
      icon: TrendingUp,
      text: "What are my top performing pages?",
      color: "blue"
    },
    {
      icon: Search,
      text: "Which search queries drive the most traffic?",
      color: "green"
    },
    {
      icon: DollarSign,
      text: "How is my revenue performing?",
      color: "purple"
    },
    {
      icon: Lightbulb,
      text: "What optimization opportunities do I have?",
      color: "orange"
    }
  ]

  const suggestedQueries = contextualSuggestions 
    ? contextualSuggestions.map((text, index) => ({
        icon: [TrendingUp, Search, DollarSign, Lightbulb][index % 4],
        text,
        color: ["blue", "green", "purple", "orange"][index % 4]
      }))
    : defaultSuggestedQueries

  const processAIQuery = async (query) => {
    setIsTyping(true)
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Check if query is too vague and user needs context guidance
    const lowerQuery = query.toLowerCase()
    const vagueQueries = ['what', 'how', 'tell me', 'show me', 'explain', 'this', 'that', 'help']
    const isVague = vagueQueries.some(term => lowerQuery === term || lowerQuery.startsWith(term + ' '))
    
    if (isVague && !lowerQuery.includes('page') && !lowerQuery.includes('revenue') && !lowerQuery.includes('traffic')) {
      let contextResponse = ""
      
      if (currentContext === 'overview') {
        contextResponse = `I can see you're asking about the overview dashboard. To give you the most relevant insights, could you be more specific? For example:

• "What's driving the increase in visits shown on this dashboard?"
• "How do the metrics on this overview compare to last period?"
• "Which metric cards should I focus on first?"
• "What do the trends in the overview charts tell me?"

I can help you understand any specific metric, chart, or trend you see on this overview page!`
      } else if (currentContext === 'analytics') {
        contextResponse = `You're in the detailed analytics section. To provide the most helpful analysis, could you specify what you'd like to know? For example:

• "What patterns do you see in the page performance table?"
• "Which queries in this analysis have the biggest opportunity?"
• "How can I improve the CTR for pages shown here?"
• "What does the trends chart suggest for optimization?"

I can dive deep into any specific table, chart, or data point you're viewing!`
      } else {
        contextResponse = `I'd love to help! Could you be more specific about what you'd like to know? I can analyze:

• Your SEO performance metrics and trends
• Page-level and query-level insights
• Optimization opportunities and recommendations
• Traffic patterns and conversion data

What specific aspect of your SEO data interests you most?`
      }
      
      setIsTyping(false)
      
      const aiMessage = {
        id: messages.length + 1,
        type: 'ai',
        content: contextResponse,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, aiMessage])
      return
    }
    
    const insights = dataService.processAIQuery(query)
    
    let response = ""
    
    switch (insights.type) {
      case 'revenue':
        response = `💰 **Revenue Analysis:**

${insights.insights.join('\n')}

**Key Insights:**
• Your top revenue-generating page is ${insights.topRevenuePages[0]?.page}
• ${insights.topRevenueChannels[0]?.name} is your highest revenue channel
• Consider optimizing pages with high traffic but low conversion rates

**Recommendations:**
• Focus on improving conversion rates on high-traffic pages
• Expand successful content themes from top-performing pages
• Test different pricing strategies on underperforming products`
        break
        
      case 'traffic':
        response = `📊 **Traffic Analysis:**

${insights.insights.join('\n')}

**Key Insights:**
• ${insights.deviceBreakdown[0]?.name} devices generate the most traffic
• Your organic search visibility is strong with ${insights.totalClicks.toLocaleString()} clicks
• CTR of ${(insights.avgCTR * 100).toFixed(2)}% indicates good search result relevance

**Recommendations:**
• Optimize for mobile if not already the top device
• Focus on improving CTR for queries with high impressions but low clicks
• Create content targeting high-impression, low-click queries`
        break
        
      case 'conversion':
        response = `🎯 **Conversion Analysis:**

${insights.insights.join('\n')}

**Top Converting Pages:**
${insights.topConvertingPages.slice(0, 3).map(page => 
  `• ${page.page}: ${page.conversionRate.toFixed(2)}% conversion rate`
).join('\n')}

**Recommendations:**
• Analyze what makes your top converting pages successful
• Apply successful conversion elements to underperforming pages
• Test different call-to-action strategies on low-converting pages`
        break
        
      case 'search':
        response = `🔍 **Search Performance Analysis:**

${insights.insights.join('\n')}

**Top Search Queries:**
${insights.topQueries.slice(0, 3).map(query => 
  `• "${query.query}": ${query.clicks} clicks, ${query.impressions} impressions`
).join('\n')}

**Recommendations:**
• Target keywords with high impressions but low CTR
• Create content for high-volume queries you're not ranking for
• Optimize title tags and meta descriptions for better CTR`
        break
        
      default:
        response = `📈 **SEO Performance Overview:**

**Key Metrics:**
• Total Visits: ${insights.totalVisits?.toLocaleString() || 'N/A'}
• Total Revenue: $${insights.totalRevenue?.toLocaleString() || 'N/A'}
• Search Clicks: ${insights.totalClicks?.toLocaleString() || 'N/A'}
• Average Position: ${insights.avgPosition?.toFixed(1) || 'N/A'}

**Quick Insights:**
• You have ${insights.totalPages || 0} pages receiving traffic
• ${insights.totalQueries || 0} unique search queries are driving traffic
• Your conversion rate is ${insights.avgConversionRate?.toFixed(2) || 'N/A'}%

**Next Steps:**
• Focus on improving your search rankings
• Optimize high-traffic pages for better conversions
• Expand content for your best-performing topics`
    }
    
    setIsTyping(false)
    
    const aiMessage = {
      id: messages.length + 1,
      type: 'ai',
      content: response,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, aiMessage])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    
    await processAIQuery(inputValue)
  }

  const handleSuggestedQuery = (query) => {
    setInputValue(query)
  }

  if (isPopup) {
    return (
      <div className="ai-chat-popup">
        <div className="chat-messages">
          {messages.map(message => (
            <div key={message.id} className={`message ${message.type}`}>
              <div className="message-avatar">
                {message.type === 'user' ? (
                  <User size={16} />
                ) : (
                  <Bot size={16} />
                )}
              </div>
              <div className="message-content">
                <div className="message-text">
                  {message.content.split('\n').map((line, index) => (
                    <div key={index}>
                      {line.startsWith('**') && line.endsWith('**') ? (
                        <strong>{line.slice(2, -2)}</strong>
                      ) : line.startsWith('• ') ? (
                        <div className="bullet-point">{line}</div>
                      ) : (
                        line
                      )}
                    </div>
                  ))}
                </div>
                <div className="message-timestamp">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="message ai typing">
              <div className="message-avatar">
                <Bot size={16} />
              </div>
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div className="suggested-queries">
          <div className="suggested-title">Try asking:</div>
          <div className="suggested-grid">
            {suggestedQueries.slice(0, 3).map((query, index) => {
              const Icon = query.icon
              return (
                <button
                  key={index}
                  className={`suggested-query ${query.color}`}
                  onClick={() => handleSuggestedQuery(query.text)}
                >
                  <Icon size={14} />
                  <span>{query.text}</span>
                </button>
              )
            })}
          </div>
        </div>

        <form className="chat-input" onSubmit={handleSubmit}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask me about your SEO data..."
            disabled={isTyping}
          />
          <button type="submit" disabled={isTyping || !inputValue.trim()}>
            <Send size={16} />
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="ai-chat">
      <div className="chat-header">
        <div className="chat-title">
          <Bot size={24} />
          <h2>AI SEO Assistant</h2>
        </div>
        <div className="chat-subtitle">
          Ask me anything about your SEO performance and get actionable insights
        </div>
      </div>

      <div className="chat-messages">
        {messages.map(message => (
          <div key={message.id} className={`message ${message.type}`}>
            <div className="message-avatar">
              {message.type === 'user' ? (
                <User size={20} />
              ) : (
                <Bot size={20} />
              )}
            </div>
            <div className="message-content">
              <div className="message-text">
                {message.content.split('\n').map((line, index) => (
                  <div key={index}>
                    {line.startsWith('**') && line.endsWith('**') ? (
                      <strong>{line.slice(2, -2)}</strong>
                    ) : line.startsWith('• ') ? (
                      <div className="bullet-point">{line}</div>
                    ) : (
                      line
                    )}
                  </div>
                ))}
              </div>
              <div className="message-timestamp">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="message ai typing">
            <div className="message-avatar">
              <Bot size={20} />
            </div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="suggested-queries">
        <div className="suggested-title">Try asking:</div>
        <div className="suggested-grid">
          {suggestedQueries.map((query, index) => {
            const Icon = query.icon
            return (
              <button
                key={index}
                className={`suggested-query ${query.color}`}
                onClick={() => handleSuggestedQuery(query.text)}
              >
                <Icon size={16} />
                <span>{query.text}</span>
              </button>
            )
          })}
        </div>
      </div>

      <form className="chat-input" onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask me about your SEO performance..."
          disabled={isTyping}
        />
        <button type="submit" disabled={isTyping || !inputValue.trim()}>
          <Send size={20} />
        </button>
      </form>
    </div>
  )
}

export default AIChat