import './Footer.scss';
import React from 'react'

function Footer() {
  return (
    <div className="footer container">
      <div className="components">
        <span>新手入门</span>
        <span>Learn EOS with our guides!</span>
      </div>
      <div className="components mida768">
        <span>相关资源</span>
        <span > EOS Glossary →</span>
        <span >Fullnode API endpoints →</span>
      </div>
      <div className="components">
        <span>切换api</span>
        <select >
          <option value="1">someLink</option>
          <option value="2">someLink</option>
          <option value="3">someLink</option>
        </select>
      </div>
      <div className="components">
        <span>EOSX is built by EOS Asia </span>
        <a >报告问题 / 建议功能 →</a>
        <a >Credits & Acknowledgements →</a>

      </div>
    </div>
  )
}

export default Footer
