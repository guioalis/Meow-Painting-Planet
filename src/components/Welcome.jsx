import { useState, useEffect } from 'react'
import { FiArrowRight, FiStar, FiImage, FiCpu, FiHeart, FiCoffee, FiGithub } from 'react-icons/fi'
import './Welcome.css'

const Welcome = ({ onStart }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [activeFeature, setActiveFeature] = useState(null)

  const features = [
    {
      icon: <FiCpu />,
      title: "智能AI对话",
      description: "智能AI助手，用可爱的语气与你交流，让创作更有趣",
      color: "#4CAF50"
    },
    {
      icon: <FiImage />,
      title: "图片生成",
      description: "将你的想象转化为精美图片，支持多种风格和场景",
      color: "#2196F3"
    },
    {
      icon: <FiStar />,
      title: "创作记录",
      description: "自动保存创作历史，随时回顾和继续你的灵感",
      color: "#FFC107"
    }
  ]

  const stats = [
    { number: "1000+", label: "用户创作" },
    { number: "5000+", label: "生成作品" },
    { number: "4.9", label: "用户评分" }
  ]

  useEffect(() => {
    // 添加打字机效果
    const text = "让创作充满趣味"
    const subtitle = document.querySelector('.welcome-subtitle')
    if (subtitle) {
      subtitle.textContent = ''
      let index = 0
      const typeWriter = () => {
        if (index < text.length) {
          subtitle.textContent += text.charAt(index)
          index++
          setTimeout(typeWriter, 100)
        }
      }
      typeWriter()
    }
  }, [])

  return (
    <div className="welcome-container">
      <nav className="welcome-nav">
        <div className="nav-brand">喵绘星球</div>
        <div className="nav-links">
          <a href="https://github.com/guioalis/Meow-Painting-Planet" target="_blank" rel="noopener noreferrer">
            <FiGithub /> GitHub
          </a>
        </div>
      </nav>

      <div className="welcome-content">
        <h1 className="welcome-title">
          欢迎来到
          <span className="highlight"> 喵绘星球</span>
        </h1>
        
        <p className="welcome-subtitle"></p>

        <div className="stats-container">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item">
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`feature-card ${activeFeature === index ? 'active' : ''}`}
              style={{ 
                animationDelay: `${index * 0.1}s`,
                borderColor: activeFeature === index ? feature.color : 'transparent'
              }}
              onMouseEnter={() => setActiveFeature(index)}
              onMouseLeave={() => setActiveFeature(null)}
            >
              <div className="feature-icon" style={{ color: feature.color }}>
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>

        <button
          className="start-button"
          onClick={onStart}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          开始创作
          <FiArrowRight className={`arrow-icon ${isHovered ? 'arrow-animate' : ''}`} />
        </button>

        <footer className="welcome-footer">
          <p>
            <FiHeart className="heart-icon" /> 
            由 喵哥提供AI技术驱动
          </p>
          <div className="footer-links">
            <a href="#" onClick={(e) => e.preventDefault()}>使用条款</a>
            <a href="#" onClick={(e) => e.preventDefault()}>隐私政策</a>
            <a href="#" onClick={(e) => e.preventDefault()}>联系我们</a>
          </div>
        </footer>
      </div>

      <div className="decoration-elements">
        <div className="floating-circle circle-1"></div>
        <div className="floating-circle circle-2"></div>
        <div className="floating-circle circle-3"></div>
      </div>
    </div>
  )
}

export default Welcome 