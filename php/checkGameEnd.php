<?php
require_once("dbconnection.php");
require_once("session_manager.php");

function isBoardEmpty(array $boardData): bool {
    return count($boardData) === 0;
}

function playerHasNoPieces(array $board1, array $board2): bool {
    // Adjust depending on your exact rule:
    return (isBoardEmpty($board1) || isBoardEmpty($board2));
}

function rotateCells90(array $cells): array {
    $minRow = PHP_INT_MAX;
    $minCol = PHP_INT_MAX;
    foreach ($cells as $c) {
        if ($c['row'] < $minRow) $minRow = $c['row'];
        if ($c['col'] < $minCol) $minCol = $c['col'];
    }

    $shifted = [];
    foreach ($cells as $c) {
        $shifted[] = [
            'row' => $c['row'] - $minRow,
            'col' => $c['col'] - $minCol,
        ];
    }

    $rotated = [];
    foreach ($shifted as $c) {
        $rotated[] = [
            'row' => $c['col'], 
            'col' => -$c['row']
        ];
    }

    $minRow2 = PHP_INT_MAX;
    $minCol2 = PHP_INT_MAX;
    foreach ($rotated as $c) {
        if ($c['row'] < $minRow2) $minRow2 = $c['row'];
        if ($c['col'] < $minCol2) $minCol2 = $c['col'];
    }

    $final = [];
    foreach ($rotated as $c) {
        $final[] = [
            'row' => $c['row'] - $minRow2,
            'col' => $c['col'] - $minCol2
        ];
    }

    return $final;
}

function flipCellsHorizontally(array $cells): array {
    $minCol = PHP_INT_MAX;
    $maxCol = PHP_INT_MIN;
    foreach ($cells as $c) {
        if ($c['col'] < $minCol) $minCol = $c['col'];
        if ($c['col'] > $maxCol) $maxCol = $c['col'];
    }

    $flipped = [];
    foreach ($cells as $c) {
        $newCol = $maxCol - ($c['col'] - $minCol);
        $flipped[] = [
            'row' => $c['row'],
            'col' => $newCol
        ];
    }

    return $flipped;
}

function isValidPlacement(array $pieceCells, array $mainBoard, bool $isFirstMove, string $playerField): bool {

    $usedCoords = [];
    $sameColorCoords = [];
    foreach ($mainBoard as $element) {
        $someField = $element['player_field'];
        foreach ($element['main_board'] as $cell) {
            $usedCoords[sprintf('%d,%d', $cell['row'], $cell['col'])] = true;
        }
        // same color?
        if ($someField === $playerField) {
            foreach ($element['main_board'] as $cell) {
                $sameColorCoords[] = $cell; 
            }
        }
    }

    return false;

function checkNoValidMovesForPlayer(
    array $playerBoards, 
    array $mainBoard, 
    bool $isFirstMove, 
    string $playerField
): bool {

    $allPieces = $playerBoards;

    if (count($allPieces) === 0) {
        return true;
    }

    forEach ($allPieces as $block) {
        $originalCells = $block['cells'] ?? null;
        if (!$originalCells || count($originalCells) === 0) {
            continue;
        }

        $transformations = [];

        function rotateNTimes($cells, $n) {
            $rotated = $cells;
            for ($i = 0; $i < $n; $i++) {
                $rotated = rotateCells90($rotated);
            }
            return $rotated;
        }

        for ($r = 0; $r < 4; $r++) {
            $rot = rotateNTimes($originalCells, $r);
            $flip = flipCellsHorizontally($rot);
            $transformations[] = $rot;
            $transformations[] = $flip;
        }

        forEach ($transformations as $cells) {
            for ($row = 1; $row <= 20; $row++) {
                for ($col = 1; $col <= 20; $col++) {

                    $shiftedCells = shiftPiece($cells, $row, $col);

                    if (checkSinglePlacement($shiftedCells, $mainBoard, $isFirstMove, $playerField)) {
                        return false;
                    }
                }
            }
        }
    }

    return true;
}

function shiftPiece(array $cells, int $anchorRow, int $anchorCol): array {
    $minRow = PHP_INT_MAX;
    $minCol = PHP_INT_MAX;
    foreach ($cells as $c) {
        if ($c['row'] < $minRow) $minRow = $c['row'];
        if ($c['col'] < $minCol) $minCol = $c['col'];
    }
    $rowOffset = $anchorRow - $minRow;
    $colOffset = $anchorCol - $minCol;
    
    $shifted = [];
    foreach ($cells as $c) {
        $shifted[] = [
            'row' => $c['row'] + $rowOffset,
            'col' => $c['col'] + $colOffset
        ];
    }
    return $shifted;
}

function checkSinglePlacement(array $placedCells, array $mainBoard, bool $isFirstMove, string $playerField): bool {
    foreach ($placedCells as $pc) {
        if ($pc['row'] < 1 || $pc['row'] > 20 || $pc['col'] < 1 || $pc['col'] > 20) {
            return false;
        }
    }

    $occupied = [];
    $sameColorCells = [];
    foreach ($mainBoard as $element) {
        foreach ($element['main_board'] as $cell) {
            $occupied[sprintf('%d,%d',$cell['row'],$cell['col'])] = true;
        }
        if ($element['player_field'] === $playerField) {
            foreach ($element['main_board'] as $cell) {
                $sameColorCells[] = $cell;
            }
        }
    }

    foreach ($placedCells as $pc) {
        if (isset($occupied[sprintf('%d,%d',$pc['row'],$pc['col'])])) {
            return false;
        }
    }

    if ($isFirstMove) {
        $inCorner = false;
        foreach ($placedCells as $pc) {
            $r = $pc['row']; $c = $pc['col'];
            if (($r === 1 && $c === 1) ||
                ($r === 1 && $c === 20) ||
                ($r === 20 && $c === 1) ||
                ($r === 20 && $c === 20)) {
                $inCorner = true;
                break;
            }
        }
        return $inCorner;
    } else {
        if (!touchesCorner($placedCells, $sameColorCells)) {
            return false;
        }
        if (sharesSide($placedCells, $sameColorCells)) {
            return false;
        }
    }

    return true;
}

function touchesCorner(array $newCells, array $sameColorCells): bool {
    foreach ($newCells as $nc) {
        foreach ($sameColorCells as $sc) {
            if (abs($nc['row'] - $sc['row']) == 1 && abs($nc['col'] - $sc['col']) == 1) {
                return true;
            }
        }
    }
    return false;
}

function sharesSide(array $newCells, array $sameColorCells): bool {
    foreach ($newCells as $nc) {
        foreach ($sameColorCells as $sc) {
            $sameRow = ($nc['row'] === $sc['row']) && (abs($nc['col'] - $sc['col']) === 1);
            $sameCol = ($nc['col'] === $sc['col']) && (abs($nc['row'] - $sc['row']) === 1);
            if ($sameRow || $sameCol) {
                return true;
            }
        }
    }
    return false;
}

function checkGameEndFunction($board_id, $mysqli) {
    $stmt = $mysqli->prepare("SELECT * FROM boards WHERE board_id = ?");
    $stmt->bind_param("i", $board_id);
    $stmt->execute();
    $res = $stmt->get_result();
    $board = $res->fetch_assoc();
    $stmt->close();

    if (!$board) {
        return [
            "error" => "Board not found",
            "isGameOver" => false
        ];
    }

    $board_p1_1     = json_decode($board['board_p1_1'], true) ?: [];
    $board_p1_2     = json_decode($board['board_p1_2'], true) ?: [];
    $board_p2_1     = json_decode($board['board_p2_1'], true) ?: [];
    $board_p2_2     = json_decode($board['board_p2_2'], true) ?: [];
    $main_board     = json_decode($board['board_main'], true)  ?: [];
    $player1_points = (int) $board['player1_points'];
    $player2_points = (int) $board['player2_points'];

    $player1OutOfPieces = (count($board_p1_1) === 0 || count($board_p1_2) === 0);
    $player2OutOfPieces = (count($board_p2_1) === 0 || count($board_p2_2) === 0);

    if ($player1OutOfPieces || $player2OutOfPieces) {
        if ($player1_points < $player2_points) {
            $winner = "player1";
        } elseif ($player2_points < $player1_points) {
            $winner = "player2";
        } else {
            $winner = "tie";
        }
        return [
            "isGameOver" => true,
            "reason"     => "No more pieces",
            "winner"     => $winner,
            "p1_points"  => $player1_points,
            "p2_points"  => $player2_points
        ];
    }
    return [
        "isGameOver" => false,
        "p1_points" => $player1_points,
        "p2_points" => $player2_points
    ];
}
?>