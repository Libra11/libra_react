/*
 * @Author: Libra
 * @Date: 2024-02-26 14:45:41
 * @LastEditors: Libra
 * @Description: 
 */

(function () {
  'use strict'
  window.onload = function () {
    setTimeout(function () {
      const wordInfo = {
        word: '',
        definition: {},
        example: {},
        phrase: {},
        phonetic: ''
      }
      wordInfo.word = getTitle()
      wordInfo.phonetic = getPhonetic()
      wordInfo.definition = getDefinition()
      wordInfo.phrase = getPhrase()
      wordInfo.example = getExample()
      console.log(wordInfo)
    }, 1000)
  }
  // Your code here...
})()

function getTitle() {
  const parentDiv = document.querySelector('.title')
  for (var i = 0; i < parentDiv.childNodes.length; i++) {
    if (parentDiv.childNodes[i].nodeType === Node.TEXT_NODE && parentDiv.childNodes[i].textContent.trim() !== '') {
      return parentDiv.childNodes[i].textContent;
    }
  }
  return ''
}

function getPhonetic() {
  const phonetics = document.querySelectorAll('.per-phone')
  if (!phonetics || !phonetics.length) return ''
  return phonetics[1].querySelector('.phonetic').textContent
}

function getDefinition() {
  const definitions = document.querySelectorAll('.basic .word-exp')
  const definitionArr = Array.from(definitions)
  const res = []
  definitionArr.forEach((item) => {
    const partOfSpeech = item.querySelector('.pos').textContent
    const description = item.querySelector('.trans').textContent
    res.push({
      partOfSpeech: wordMap[partOfSpeech] || partOfSpeech,
      description
    })
  })
  return res
}

function getPhrase() {
  const phrases = document.querySelectorAll('.webPhrase .mcols-layout')
  // phrasea.length > 2 ? 2 : phrasea.length
  const phraseArr = Array.from(phrases)
  const arr = phraseArr.length > 2 ? phraseArr.slice(0, 2) : phraseArr
  const res = []
  arr.forEach((item) => {
    const englishPhrase = item.querySelector('.point').textContent
    const chineseTranslation = item.querySelector('.sen-phrase').textContent
    res.push({
      englishPhrase,
      chineseTranslation
    })
  })
  return res
}

function getExample() {
  const examples = document.querySelectorAll('.catalogue_sentence .dict-book .mcols-layout')
  const exampleArr = Array.from(examples)
  const arr = exampleArr.length > 2 ? exampleArr.slice(0, 2) : exampleArr
  const res = []
  arr.forEach((item) => {
    const words = item.querySelectorAll('.word-exp')
    const sentence = words[0].querySelector('.sen-eng').textContent
    res.push({
      sentence
    })
  })
  return res
}

const wordMap = {
  'n.': 'noun',
  'v.': 'verb',
  'adj.': 'adjective',
  'adv.': 'adverb',
  'pron.': 'pronoun',
  'prep.': 'preposition',
  'conj.': 'conjunction',
  'interj.': 'interjection',
}