// import translate from 'google-translate-open-api';
// const translate = require('google-translate-open-api').default;
const translate = require('@vitalets/google-translate-api');
require("@electron/remote").BrowserWindow;
const { ipcRenderer } = require('electron')
const { dialog } = require('@electron/remote')
const fs = require("fs");
 
window.onload = function () {

  const autoPaste = document.getElementById('autoPaste');
  const titles = document.querySelectorAll('p')
  const autoCopy = document.getElementById('autoCopy')
  let content = document.getElementById('inputContent');
  const startButton = document.getElementById('startTrans');
  const progress = document.getElementById('progress')
  const transResult = document.getElementById('transResult')
  const resultContent = document.getElementById('resultContent')
  let count
  let isRemovedPlaceholder = false

  ipcRenderer.on('changeColor',() => {
    if (document.body.className == 'white_body' || document.body.className == ''){
      document.body.className = 'dark_body'
      content.style.backgroundColor = '#f5f6f7'
      for (let i=0; i<titles.length; i++){
        titles[i].style.color = '#f5f6f7'
        titles[i].style.opacity = '0.9'
      }
    }else {
      document.body.className = 'white_body'
    }
  })
  ipcRenderer.on('importFile', () => {
    dialog.showOpenDialog({
      title: '选择导入的文件',
      buttonLabel: '确认',
      properties: ['openFile'],
      filters: [{
        name: '文本文档',
        extensions: ['txt']
      }]
    }).then(res => {
      if (res.canceled == false){
        fs.readFile(res.filePaths[0], {encoding: 'utf-8'}, (err, data) => {
          if (err) {
            dialog.showMessageBox(null, {
              type: 'error',
              title: '错误!',
              message: '导入文件失败!'
            })
          }else{
            content.innerText += data
          }
        })
      }
    })
  })
  ipcRenderer.on('exportFile', () => {
    dialog.showSaveDialog({
      title: '选择保存的位置',
      buttonLabel: '确认',
      filters: [{
        name: '文本文档',
        extensions: ['txt']
      }]
    }).then(res => {
      console.log(res)
      if (res.canceled == false){
        fs.writeFile(res.filePath, resultContent.innerText, {encoding: 'utf-8'}, (err, data) => {
          if (err){
            dialog.showMessageBox(null, {
              type: 'error',
              title: '错误!',
              message: '文件保存失败!'
            })
          }else{
            dialog.showMessageBox(null, {
              type: 'info',
              title: '成功',
              message: '文件保存成功!'
            })
          }
        })
      }
    })
  })

  content.innerText = '输入点什么..';
  let placeholder = () => {
    content.innerText = '';
    content.removeEventListener('focus', placeholder);
    isRemovedPlaceholder = true
  };

  let transCopy = () => {
    transFn(content.innerText).then(() => {})
  }

  content.addEventListener('focus', placeholder);

  autoPaste.addEventListener('click', () => {
    navigator.clipboard
      .readText()
      .then((v) => {
        content.innerText = content.innerText + v;
      })
      .catch((v) => {
        console.log(v);
      });
  });
  autoCopy.addEventListener('click', () => {
    navigator.clipboard.writeText(resultContent.innerText).then(() => {
      dialog.showMessageBox({
        type: 'info',
        title: '提示',
        message: '复制成功!'
      })
    })
  })

  startButton.addEventListener('click', transCopy);

  function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  async function transFn(content) {
    const langs = {
      "zh-CN": "Chinese (Simplified)",
      "zh-TW": "Chinese (Traditional)",
      af : "Afrikaans",
      am : "Amharic",
      ar : "Arabic",
      az : "Azerbaijani",
      be : "Belarusian",
      bg : "Bulgarian",
      bn :"Bengali",
      bs : "Bosnian",
      ca : "Catalan",
      ceb: "Cebuano",
      co : "Corsican",
      cs : "Czech",
      cy : "Welsh",
      da :"Danish",
      de : "German",
      el : "Greek",
      en : "English",
      eo : "Esperanto",
      es : "Spanish",
      et : "Estonian",
      eu : "Basque",
      fa : "Persian",
      fi : "Finnish",
      fr : "French",
      fy :"Frisian",
      ga : "Irish",
      gd : "Scots Gaelic",
      gl : "Galician",
      gu : "Gujarati",
      ha : "Hausa",
      haw : "Hawaiian",
      he : "Hebrew",
      hi : "Hindi",
      hmn : "Hmong",
      hr : "Croatian",
      ht : "Haitian Creole",
      hu : "Hungarian",
      hy : "Armenian",
      id : "Indonesian",
      ig : "Igbo",
      is : "Icelandic",
      it : "Italian",
      iw : "Hebrew",
      ja : "Japanese",
      jw : "Javanese",
      ka : "Georgian",
      kk : "Kazakh",
      km : "Khmer",
      kn : "Kannada",
      ko : "Korean",
      ku : "Kurdish (Kurmanji)",
      ky : "Kyrgyz",
      la : "Latin",
      lb : "Luxembourgish",
      lo : "Lao",
      lt : "Lithuanian",
      lv : "Latvian",
      mg : "Malagasy",
      mi : "Maori",
      mk : "Macedonian",
      ml : "Malayalam",
      mn : "Mongolian",
      mr : "Marathi",
      ms : "Malay",
      mt : "Maltese",
      my : "Myanmar (Burmese)",
      ne : "Nepali",
      nl : "Dutch",
      no : "Norwegian",
      ny : "Chichewa",
      pa : "Punjabi",
      pl : "Polish",
      ps : "Pashto",
      pt : "Portuguese",
      ro : "Romanian",
      ru : "Russian",
      sd : "Sindhi",
      si : "Sinhala",
      sk : "Slovak",
      sl : "Slovenian",
      sm : "Samoan",
      sn : "Shona",
      so : "Somali",
      sq : "Albanian",
      sr : "Serbian",
      st : "Sesotho",
      su : "Sundanese",
      sv : "Swedish",
      sw : "Swahili",
      ta :  "Tamil",
      te : "Telugu",
      tg :  "Tajik",
      th :  "Thai",
      tl :  "Filipino",
      tr : "Turkish",
      uk :  "Ukrainian",
      ur :  "Urdu",
      uz :  "Uzbek",
      vi :  "Vietnamese",
      xh :  "Xhosa",
      yi :  "Yiddish",
      yo :  "Yoruba",
      zu :  "Zulu",
    };

    async function translateSentence(sentence, languagetranslation) {
      let sentenceTranslated = await translate(sentence, {
        to: languagetranslation,
        client: 't',
        tld: 'cn'
      });
      return sentenceTranslated;
    }

    content = document.getElementById('inputContent').innerText
    let input = content
    if (input === '' || (input === '输入点什么..' && isRemovedPlaceholder === false)){
      await dialog.showMessageBox(null, {
        type: 'error',
        title: '错误!',
        message: '你还未输入任何文本!'
      })
    }else {
      startButton.style.cursor = 'not-allowed'
      startButton.removeEventListener('click', transCopy)
      let keys = [];
      let values = [];
      count = document.getElementById('transCount').value
      if (count == undefined || count == ''){
        count = 1
      }
      for (let i = 0; i < count; i++) {
        const number = random(0, Object.keys(langs).length - 1);
        keys.push(Object.keys(langs)[number]);
        values.push(Object.values(langs)[number]);
      }

      let i = 0
      console.log("Times: ", count)
      async function loop(){
        if (i >= count){
          console.log('Non-CN Result: ', input)
          translateSentence(input, "zh-CN").then(res => {
            console.log("Final Result: ", res.text)
            startButton.style.cursor = 'auto'
            progress.style.width = '0%'
            transResult.style.display = 'block'
            resultContent.innerText = res.text
            startButton.addEventListener('click', transCopy)
          })
        }else {
          translateSentence(input, keys[i]).then(res => {
            input = res.text
            let formula = (i+1)/count*100
            console.log("Progress: ", formula)
            progress.style.width = `${formula}%`
            i++
            console.log("Times: ", i, input)
            return loop(input)
          })
        }
      }
      loop().then(() => {})
    }

  }
};