//1. index앞부분 커서 위치
// 2. ctrl + alt + 방향키(↓) timestamp까지 선택
// 3. shift + End 키로 맨뒤까지 선택
// 4. ctrl + c, ctrl + v 로 복붙
// 5. constructor 안의 ;선택
// 6. ctrl + d로 다중선택 후 ,로 교체

import * as CryptoJS from "crypto-js"

class Block { 

  static calculateBlockhash = (
    index: number, 
    previousHash: string, 
    timestamp: number, 
    data: string
    ):string => CryptoJS.SHA256(index + previousHash + timestamp + data).toString()

  static validateStructure = (aBlock: Block) : boolean => 
  typeof aBlock.index === "number" && 
  typeof aBlock.hash === "string" && 
  typeof aBlock.previousHash === "string" &&
  typeof aBlock.timestamp === "number" &&
  typeof aBlock.data === "string"

  public index: number
  public hash: string
  public previousHash: string
  public data: string
  public timestamp: number

  constructor(index: number, hash: string, previousHash: string, data: string, timestamp: number,) 
  {
    this.index = index
    this.hash = hash
    this.previousHash = previousHash
    this.data = data
    this.timestamp = timestamp
  }
}

const genesisBlock:Block = new Block(0, "202020202020202","", "Hello", 123456)

let blockchain: Block[] = [genesisBlock]

const getBlockchain = () : Block[] => blockchain
const getLatestBlock = () : Block => blockchain[blockchain.length - 1]
const getNewTimeStamp = () : number => Math.round(new Date().getTime() / 1000)

const createNewBlock = (data: string): Block => {
  const previousBlock: Block = getLatestBlock()
  const newIndex : number = previousBlock.index + 1
  const newTimestamp: number = getNewTimeStamp()
  const newHash: string = Block.calculateBlockhash(newIndex, previousBlock.hash, newTimestamp, data)
  const newBlock : Block = new Block(newIndex, newHash, previousBlock.hash, data, newTimestamp)
  addBlock(newBlock)
  return newBlock
}

const getHashforBlock = (aBlock: Block): string => Block.calculateBlockhash(aBlock.index, aBlock.previousHash, aBlock.timestamp, aBlock.data)

const isBlockValid = (candidateBlock : Block, previousBlock: Block) : boolean => {
  if(!Block.validateStructure(candidateBlock)) {
    return false
  } else if(previousBlock.index + 1 !== candidateBlock.index) {
    return false
  } else if(previousBlock.hash !== candidateBlock.previousHash) {
    return false
  } else if(getHashforBlock(candidateBlock) !== candidateBlock.hash) {
    return false
  } else {
    return true
  }
}

const addBlock = (candidateBlock: Block) : void => {
  if(isBlockValid(candidateBlock, getLatestBlock())) {
    blockchain.push(candidateBlock)
  }
}

createNewBlock("second block")
createNewBlock("third block")
createNewBlock("forth block")

console.log(blockchain)
export {};

