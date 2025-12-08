import { describe, test } from "node:test";
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
  const aMaze = new MazeGenerator();
  aMaze.getNextUnvisitedNeighbor = getNextUnvisitedNeighborMock
  test("previously recorded mock should generate expected maze", () => {
    assert.strictEqual(aMaze.generate(), expected);
  })
})