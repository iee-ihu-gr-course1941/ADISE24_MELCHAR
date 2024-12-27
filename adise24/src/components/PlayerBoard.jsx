import style from "../styling/PlayerBoard.module.css";

const gridHight = 15;
const gridWidth = 15;
const totalBoxes = gridHight * gridWidth;

const blocks = [
  {
    id: 1,
    cells: [
      {row: 1, col: 1},
    ]
  },
  {
    id: 2,
    cells: [
      {row: 1, col: 3},
      {row: 1, col: 4},
    ],
  },
  {
    id: 3,
    cells: [
      {row: 1, col: 6},
      {row: 1, col: 7},
      {row: 1, col: 8}
    ],
  },
  {
    id: 4,
    cells: [
      {row: 1, col: 10},
      {row: 1, col: 11},
      {row: 1, col: 12},
      {row: 1, col: 13}
    ],
  },
  {
    id: 5,
    cells: [
      {row: 3, col: 2},
      {row: 4, col: 1},
      {row: 4, col: 2},
    ],
  },
  {
    id: 6,
    cells: [
      {row: 2, col: 15},
      {row: 3, col: 15},
      {row: 3, col: 13},
      {row: 3, col: 14}
    ],
  },
  {
    id: 7,
    cells: [
      {row: 3, col: 4},
      {row: 3, col: 5},
      {row: 4, col: 4},
      {row: 4, col: 5}
    ],
  },
  {
    id: 8,
    cells: [
      {row: 3, col: 7},
      {row: 3, col: 8},
      {row: 4, col: 8},
      {row: 4, col: 9}
    ],
  },
  {
    id: 9,
    cells: [
      {row: 3, col: 11},
      {row: 4, col: 11},
      {row: 5, col: 11},
      {row: 6, col: 11},
      {row: 6, col: 12}
    ],
  },
{
    id: 10,
    cells: [
      {row: 6, col: 1},
      {row: 6, col: 2},
      {row: 6, col: 3},
      {row: 7, col: 2}
    ],
  },
  {
    id: 11,
    cells: [
      {row: 6, col: 6},
      {row: 6, col: 7},
      {row: 7, col: 6},
      {row: 7, col: 5},
      {row: 8, col: 6}
    ],
  },
  {
    id: 12,
    cells: [
      {row: 5, col: 14},
      {row: 5, col: 15},
      {row: 6, col: 14},
      {row: 6, col: 15},
      {row: 7, col: 14}
    ],
  },
  {
    id: 13,
    cells: [
      {row: 6, col: 9},
      {row: 7, col: 9},
      {row: 8, col: 9},
      {row: 9, col: 9},
      {row: 10, col: 9}
    ],
  },
  {
    id: 14,
    cells: [
      {row: 8, col: 11},
      {row: 8, col: 12},
      {row: 9, col: 12},
      {row: 10, col: 12},
      {row: 10, col: 13}
    ]
  },
  {
    id: 15,
    cells: [
      {row: 10, col: 15},
      {row: 11, col: 15},
      {row: 12, col: 15},
      {row: 12, col: 14},
      {row: 12, col: 13}
    ]
  },
  {
    id: 16,
    cells: [
      {row: 15, col: 13},
      {row: 15, col: 14},
      {row: 15, col: 15},
      {row: 14, col: 13},
      {row: 14, col: 15}
    ]
  },
  {
    id: 17,
    cells: [
      {row: 15, col: 7},
      {row: 15, col: 8},
      {row: 14, col: 8},
      {row: 14, col: 9},
      {row: 13, col: 9}
    ]
  },
  {
    id: 18,
    cells: [
      {row: 10, col: 1},
      {row: 10, col: 2},
      {row: 9, col: 2},
      {row: 11, col: 2},
      {row: 10, col: 3}

    ]
  },
  {
    id: 19,
    cells: [
      {row: 13, col: 2},
      {row: 13, col: 1},
      {row: 13, col: 3},
      {row: 14, col: 2},
      {row: 15, col: 2}
    ]
  },
  {
    id: 20,
    cells: [
      {row: 15, col: 5},
      {row: 14, col: 5},
      {row: 13, col: 5},
      {row: 13, col: 6},
      {row: 12, col: 6}
    ]
  },
  {
    id: 21,
    cells: [
      {row: 12, col: 10},
      {row: 14, col: 11},
      {row: 13, col: 11},
      {row: 12, col: 11},
      {row: 11, col: 11}
    ]
  },
];

function PlayerBoard({player}) {
  const playerColor = player === 1 ? "blue" : "red";
  return (
    <div className={style.board}>
      {Array.from({ length: totalBoxes }).map((_, index) => {
        const row = Math.floor(index / gridHight) + 1;
        const col = (index % gridWidth) + 1;

        const block = blocks.find((b) =>
          b.cells.some(cell => cell.row === row && cell.col === col)
        );

        return (
          <div
            key={index}
            className={style.box}
            style={{
              backgroundColor: block ? playerColor : "transparent",
              border: block ? "2px solid black" : "none",
            }}
          ></div>
        );
      })}
    </div>
  );
}

export default PlayerBoard;
