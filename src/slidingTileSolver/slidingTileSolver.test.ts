import { strict as assert } from "node:assert"
import { it, describe } from "node:test"

import { solve } from "./slidingTileSolver.js"

let solved = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,0]


describe('End-to-end tests',()=>{
  it("should solve slider in 16 moves", ()=>{
    let puzzleBoard =    [1,2,3,4,5,0,8,12,9,7,10,15,13,11,6,14]
    solve(puzzleBoard, 16)
    assert.deepEqual(puzzleBoard, solved)
  })
  it("should solve slider in 18 moves", ()=>{
    let puzzleBoard =    [5,1,3,8,9,0,2,6,10,7,4,11,13,14,15,12]
    solve(puzzleBoard, 18)
    assert.deepEqual(puzzleBoard, solved)
  })

})