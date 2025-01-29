import { useState, useEffect } from 'react'
import './App.css'
import { FiSave, FiCopy } from 'react-icons/fi'
import { RiHistoryLine, RiCloseLine } from 'react-icons/ri'
import { BiError } from 'react-icons/bi'
import Welcome from './components/Welcome'

function App() {
  const [prompt, setPrompt] = useState('')
  const [response, setResponse] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([])
  const [showHistory, setShowHistory] = useState(false)
  const [error, setError] = useState(null)
  const [notification, setNotification] = useState(null)
  const [showWelcome, setShowWelcome] = useState(true)

  // 从localStorage加载历史记录
  useEffect(() => {
    const savedHistory = localStorage.getItem('meowHistory')
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory))
    }
  }, [])

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const saveToHistory = (newItem) => {
    const updatedHistory = [newItem, ...history].slice(0, 10) // 只保留最近10条记录
    setHistory(updatedHistory)
    localStorage.setItem('meowHistory', JSON.stringify(updatedHistory))
  }

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      showNotification('已复制到剪贴板喵~')
    } catch (err) {
      showNotification('复制失败了喵~', 'error')
    }
  }

  const generateContent = async () => {
    if (!prompt.trim()) {
      showNotification('请输入描述内容喵~', 'warning')
      return
    }
    
    setLoading(true)
    setError(null)
    try {
      const chatResponse = await fetch('https://gemini.chaohua.me/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer AIzaSyDdgdnKMJJHwgVZms1WkeTaI_0Vu_lYq7Q',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: "你是一个可爱的猫咪助手，请用活泼可爱的语气回答问题。"
            },
            {
              role: "user",
              content: prompt
            }
          ],
          model: "gemini-2.0-flash-exp"
        })
      })
      
      if (!chatResponse.ok) {
        throw new Error('AI 服务器出错了喵~')
      }

      const chatData = await chatResponse.json()
      const aiResponse = chatData.choices[0].message.content
      setResponse(aiResponse)
      
      const encodedPrompt = encodeURIComponent(prompt)
      const newImageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}`
      setImageUrl(newImageUrl)

      // 保存到历史记录
      saveToHistory({
        prompt,
        response: aiResponse,
        imageUrl: newImageUrl,
        timestamp: new Date().toLocaleString()
      })
      
      showNotification('创作完成喵~')
    } catch (error) {
      console.error('Error:', error)
      setError(error.message || '发生错误了喵~')
      showNotification(error.message || '发生错误了喵~', 'error')
    } finally {
      setLoading(false)
    }
  }

  const saveImage = async () => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `meow-planet-${Date.now()}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      showNotification('图片保存成功喵~')
    } catch (error) {
      console.error('保存图片失败:', error)
      showNotification('图片保存失败了喵~', 'error')
    }
  }

  const loadHistoryItem = (item) => {
    setPrompt(item.prompt)
    setResponse(item.response)
    setImageUrl(item.imageUrl)
    setShowHistory(false)
  }

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem('meowHistory')
    showNotification('历史记录已清空喵~')
  }

  return (
    <>
      {showWelcome ? (
        <Welcome onStart={() => setShowWelcome(false)} />
      ) : (
        <div className="app-container">
          <div className="app-header">
            <h1>喵绘星球</h1>
            <p className="subtitle">AI 创作助手 - 让创作充满趣味</p>
          </div>

          <div className="toolbar">
            <button 
              className="history-btn"
              onClick={() => setShowHistory(!showHistory)}
            >
              <RiHistoryLine /> 历史记录
            </button>
          </div>

          <div className="input-section">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="请输入你想要的场景描述..."
              disabled={loading}
            />
            <div className="button-group">
              <button 
                className={`generate-btn ${loading ? 'loading' : ''}`}
                onClick={generateContent} 
                disabled={loading}
              >
                <span className="button-text">{loading ? '创作中...' : '开始创作'}</span>
                {loading && <div className="loader"></div>}
              </button>
              {prompt && (
                <button 
                  className="clear-btn"
                  onClick={() => setPrompt('')}
                  disabled={loading}
                >
                  <RiCloseLine /> 清空
                </button>
              )}
            </div>
          </div>
          
          {showHistory && (
            <div className="history-panel">
              <div className="history-header">
                <h3>历史记录</h3>
                {history.length > 0 && (
                  <button className="clear-history-btn" onClick={clearHistory}>
                    清空历史
                  </button>
                )}
              </div>
              {history.length === 0 ? (
                <p className="empty-history">暂无历史记录喵~</p>
              ) : (
                <div className="history-list">
                  {history.map((item, index) => (
                    <div 
                      key={index} 
                      className="history-item"
                      onClick={() => loadHistoryItem(item)}
                    >
                      <p className="history-prompt">{item.prompt}</p>
                      <span className="history-time">{item.timestamp}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {error && (
            <div className="error-message">
              <BiError /> {error}
            </div>
          )}

          {notification && (
            <div className={`notification ${notification.type}`}>
              {notification.message}
            </div>
          )}
          
          {response && (
            <div className="response-section">
              <div className="section-header">
                <h2>AI回应：</h2>
                <button 
                  className="copy-btn"
                  onClick={() => copyToClipboard(response)}
                >
                  <FiCopy /> 复制
                </button>
              </div>
              <p>{response}</p>
            </div>
          )}
          
          {imageUrl && (
            <div className="image-section">
              <div className="image-header">
                <h2>生成的图片：</h2>
                <button className="save-btn" onClick={saveImage}>
                  <FiSave /> 保存图片
                </button>
              </div>
              <div className="image-container">
                <img src={imageUrl} alt="生成的图片" loading="lazy" />
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default App 