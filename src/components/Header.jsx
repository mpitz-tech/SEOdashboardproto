import React from 'react'
import { Search, TrendingUp, Brain, User } from 'lucide-react'

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Brain className="logo-icon" />
          <h1>SEO Insight Dashboard</h1>
        </div>
        <nav className="nav">
          <a href="#overview" className="nav-link active">
            <TrendingUp size={16} />
            Overview
          </a>
          <a href="#analytics" className="nav-link">
            <Search size={16} />
            Analytics
          </a>
          <a href="#ai-chat" className="nav-link">
            <Brain size={16} />
            AI Assistant
          </a>
        </nav>
        <div className="header-actions">
          <button className="login-btn">
            <User size={18} />
            <span>Login</span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header