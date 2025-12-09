import { describe, test, mock } from "node:test";
import * as assert from "node:assert/strict";

import { getNextUnvisitedNeighborMock } from './nextUnvisitedNeighborMock.js'
import { MazeGenerator } from "./mazeGenerator.js";

const expected =
`*######################################
# #           #   #           #   #   #
# # # ######### # # ####### ### # # # #
# # #           # # #     #     #   # #
# ############### # # # # ########### #
#               # # # # # #         # #
############### # # # # # ##### ##### #
#       #     # # # # # #       #   # #
# # ##### ### # # # ### ######### # # #
# #     # # # # # #     #         # # #
# ##### # # # # # ##### # ######### # #
# # #   #   # # # #     # #       # # #
# # # ### ### # # # ##### # # ##### # #
# # #     #   # # #   #   # # #   #   #
# # ####### ### # ### # ### ### # ### #
# #   #   #     #     # # #   # #     #
# # # # # ############# # # # # #######
#   #   #               #   #         #
#######################################
`

describe("Maze Generator Snapshot Test", () => {
  const mocked = mock.method(MazeGenerator.prototype, 'getNextUnvisitedNeighbor', getNextUnvisitedNeighborMock)
  const aMaze = new MazeGenerator();
  test("previously recorded mock should generate expected maze", () => {
    assert.strictEqual(aMaze.printMaze(), expected);
    assert.strictEqual(mocked.mock.callCount(), 170)
  })
})