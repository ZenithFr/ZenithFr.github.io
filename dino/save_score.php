<?php
header('Content-Type: application/json');
$file = 'leaderdino.txt';

// POST: Write a new score line into leaderdino.txt
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    if ($input && isset($input['name']) && isset($input['score'])) {
        // Strip everything except alphanumeric characters
        $name = strtoupper(preg_replace('/[^A-Za-z0-9]/', '', $input['name']));
        $score = (int)$input['score'];
        
        // Append entry to leaderdino.txt inside folder
        file_put_contents($file, "$name,$score\n", FILE_APPEND | LOCK_EX);
    }
    echo json_encode(["status" => "success"]);
    exit;
}

// GET: Load high scores list and output as JSON
$scores = [];
if (file_exists($file)) {
    $lines = file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $parts = explode(',', $line);
        if (count($parts) === 2) {
            $scores[] = [
                "name" => $parts[0],
                "score" => (int)$parts[1]
            ];
        }
    }
}
echo json_encode($scores);