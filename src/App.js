import React, { Component } from 'react'
import { Tooltip, Button } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import "antd/dist/antd.css";
import _ from "lodash";
import "./App.css";
const emojiData = require('./assets/emoji/emoji.json')
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chatContent: "",              // 发出的内容
      showEmojiModal: false,
      emojiIcon: emojiData.icon,    // 导入的emoji表情配置文件内容
      inputRange: '',               // 光标
      showEmotions: true,
      showDingbats: false,
      showPerson: false,
      showUncategorized: false,
    }
    this.saveRangeLocal = this.saveRangeLocal.bind(this);
    this.inputSend = this.inputSend.bind(this);
  }
  // 将输入框中的图片替换为emoji表情
  formatInputCon() {
    let inputValue = document.getElementById('charInput').innerHTML
    inputValue = inputValue.replace(/<div>/g, '')
    inputValue = inputValue.replace(/<\/div>/g, '')
    inputValue = inputValue.replace(/<img.*?(?:>|\/>)/gi, (val) => {
      let unicode = val.match(/unicode=[\'\"]?([^\'\"]*)[\'\"]?/i)[1]
      let icon = this.state.emojiIcon
      let iPic = ''

      // 遍历查找Unicode表情
      for (const key in icon) {
        if (icon.hasOwnProperty(key)) {
          const iType = icon[key]
          let flag = false

          for (let index = 0; index < iType.length; index++) {
            const element = iType[index]

            if (element.unicode == unicode) {
              iPic = element.emoji
              flag = true
              break
            }
          }

          if (flag) { break }
        }
      }

      return iPic
    })
    console.log("inputValue",inputValue)
    this.setState({ chatContent: inputValue })
    return inputValue
  }
  // 发送消息
  inputSend(e) {
    this.state.chatContent = this.formatInputCon().replace(/<br>/g, '\r\n')
    chatContent = chatContent.replace(/&nbsp;/g, '')
    this.setState({showEmojiModal:false,showEmotions: true})
    //发送消息后清空输入框
    let inputValue = document.getElementById('charInput')
    inputValue.innerHTML=""
  }
  // 延时记录光标到位置
  saveRangeLocal() {
    setTimeout(() => {
      this.state.inputRange = window.getSelection().getRangeAt(0)
    }, 0)
  }
  // 点击表情，将表情添加到输入框
  selectEmojiIcon(emoji) {
    this.setState({showEmojiModal:false,showEmotions: true})
    let inputNode = document.getElementById('charInput')
    const imgUrl = './assets/emoji/icon/' + emoji.unicode + '.png'
    let html = "<img src='" + imgUrl + "' unicode = '" + emoji.unicode + "' alt='' class='iconImgDiv'>"
    let sel = window.getSelection()
    let range = this.state.inputRange
    let el = document.createElement("div")
    let frag = document.createDocumentFragment(), node, lastNode

    if (!inputNode) {
      return
    }

    if (!range) {
      inputNode.focus()
      range = window.getSelection().getRangeAt(0)
    }

    range.deleteContents()
    el.innerHTML = html

    while ((node = el.firstChild)) {
      lastNode = frag.appendChild(node)
    }
    range.insertNode(frag)

    if (lastNode) {
      range = range.cloneRange()
      range.setStartAfter(lastNode)
      range.collapse(true)
      sel.removeAllRanges()
      sel.addRange(range)
    }
  }


  // 将emoji表情转换为图片
  changeEmojiCon(str) {
    let patt = /[\ud800-\udbff][\udc00-\udfff]/g    // 检测utf16字符正则

    str = str.replace(patt, (char) => {
      let H, L, code

      if (char.length === 2) {
        H = char.charCodeAt(0)   // 取出高位
        L = char.charCodeAt(1)   // 取出低位
        code = (H - 0xD800) * 0x400 + 0x10000 + L - 0xDC00   // 转换算法
        return "&#" + code + ";"
      } else {
        return char
      }
    })
    str = str.replace(/&#{1}[0-9]+;{1}/ig, (a) => {
      let unicode = a.replace(/^&#{1}/ig, '')
      unicode = unicode.replace(/;{1}$/ig, '')
      unicode = 'U+' + (parseFloat(unicode).toString(16).toUpperCase())
      const imgUrl = './assets/emoji/icon/' + unicode + '.png'
      return "<img src='" + imgUrl + "'/>"
    })
    return str
  }
  render() {
    return (
      <div className="App">
        <div style={{ padding: 15, paddingBottom: 10, cursor: 'pointer' }} onClick={() => this.setState({ showEmojiModal: !this.state.showEmojiModal })}>
          <Tooltip title="表情">
            <SmileOutlined style={{ fontSize: 20, color: '#787878' }} />
          </Tooltip>
        </div>
        <div style={{ display: 'flex', flex: 1, alignItems: 'center', paddingLeft: 10, paddingRight: 10, paddingBottom: 10 }}>
          <div
            id="charInput"
            style={{ display: 'flex', flex: 1, boxShadow: "none", height: '100%', border: "1px solid #eee", fontSize: 16 }}
            className="text_emojs_box"
            contentEditable="true"
            onClick={this.saveRangeLocal}
            onFocus={this.saveRangeLocal}
            onInput={this.saveRangeLocal}
          />
          <Button type="primary" style={{ marginLeft: 10 }} onClick={() => this.inputSend()}>发送</Button>
        </div>
        {this.state.showEmojiModal&&
        <div className="chatframe_input_con scrollbar">
          <div className="chatframe-icon">
            <span className="iconfont emoji_pane_tab"
              onClick={() => this.setState({ showEmotions: true, showDingbats: false, showPerson: false, showUncategorized: false })}
              style={{ color: this.state.showEmotions ? "#333" : "#ccc" }}
            >&#xe612;</span>
            <span className="iconfont emoji_pane_tab"
              onClick={() => this.setState({ showDingbats: true, showEmotions: false, showPerson: false, showUncategorized: false })}
              style={{ color: this.state.showDingbats ? "#333" : "#ccc" }}
            >&#xe609;</span>
            <span className="iconfont emoji_pane_tab"
              onClick={() => this.setState({ showPerson: true, showEmotions: false, showDingbats: false, showUncategorized: false })}
              style={{ color: this.state.showPerson ? "#333" : "#ccc" }}
            >&#xe62d;</span>
            <span className="iconfont emoji_pane_tab"
              onClick={() => this.setState({ showUncategorized: true, showEmotions: false, showDingbats: false, showPerson: false })}
              style={{ color: this.state.showUncategorized ? "#333" : "#ccc" }}
            >&#xe63c;</span>
          </div>
          <ul>
            {this.state.showEmotions && this.state.emojiIcon.Emotions.map((emotions, index) => {
              const imgUrl = './assets/emoji/icon/' + emotions.unicode + '.png'
              return (
                <li key={"emotions" + index} className="chat_emoji_li">
                  <img src={imgUrl} className="chat_emoji_item" onClick={() => this.selectEmojiIcon(emotions)} />
                </li>
              )
            })}
            {this.state.showDingbats && this.state.emojiIcon.Dingbats.map((emotions, index) => {
              const imgUrl = './assets/emoji/icon/' + emotions.unicode + '.png'
              return (
                <li key={"emotions" + index} className="chat_emoji_li">
                  <img src={imgUrl} className="chat_emoji_item" onClick={() => this.selectEmojiIcon(emotions)} />
                </li>
              )
            })}
            {this.state.showPerson && this.state.emojiIcon.Person.map((emotions, index) => {
              const imgUrl = './assets/emoji/icon/' + emotions.unicode + '.png'
              return (
                <li key={"emotions" + index} className="chat_emoji_li">
                  <img src={imgUrl} className="chat_emoji_item" onClick={() => this.selectEmojiIcon(emotions)} />
                </li>
              )
            })}
            {this.state.showUncategorized && this.state.emojiIcon.Uncategorized.map((emotions, index) => {
              const imgUrl = './assets/emoji/icon/' + emotions.unicode + '.png'
              return (
                <li key={"emotions" + index} className="chat_emoji_li">
                  <img src={imgUrl} className="chat_emoji_item" onClick={() => this.selectEmojiIcon(emotions)} />
                </li>
              )
            })}
          </ul>
        </div>}
        {/* <!-- 显示内容区 --> */}
        <div>发送的消息：</div>
        <div className="chatframe-text text_emoji" dangerouslySetInnerHTML={{ __html: this.changeEmojiCon(this.state.chatContent) }}></div>
      </div>
    )
  }
}

export default App;
