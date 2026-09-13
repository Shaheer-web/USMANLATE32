<?php
// Usman Public School System (Campus 32) - Backend Data API for InfinityFree / Shared Hosting
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$suggestionsFile = __DIR__ . '/data_suggestions.json';
$studentsFile = __DIR__ . '/data_students.json';

// Seed initial suggestions if file does not exist yet
if (!file_exists($suggestionsFile)) {
    $initialSuggestions = [
        [
            "id" => "sug-1",
            "studentName" => "fatima zahra",
            "classSection" => "Class 9-A",
            "category" => "Punctuality",
            "message" => "Can we have a slight grace period of 3 minutes on rainy or high-traffic mornings on Nazimabad road? The van transport gets delayed due to construction.",
            "createdAt" => "2026-09-10",
            "upvotes" => 18
        ],
        [
            "id" => "sug-2",
            "studentName" => "noor ul huda",
            "classSection" => "Class 10-B",
            "category" => "Morning Assembly",
            "message" => "We loved the Hadith recitation on Taqwa in the morning assembly this Thursday. It would be wonderful to have weekly student-led reflections on the Seerat un Nabi ﷺ.",
            "createdAt" => "2026-09-08",
            "upvotes" => 24
        ],
        [
            "id" => "sug-3",
            "studentName" => "rumaisa siddiqui",
            "classSection" => "Class 8-C",
            "category" => "Campus Life",
            "message" => "Organizing a peer-mentor buddy system where senior students encourage junior classes to arrive 10 minutes before the bell would help reduce late entries effectively.",
            "createdAt" => "2026-09-05",
            "upvotes" => 15
        ]
    ];
    file_put_contents($suggestionsFile, json_encode($initialSuggestions, JSON_PRETTY_PRINT));
}

if (!file_exists($studentsFile)) {
    file_put_contents($studentsFile, json_encode([], JSON_PRETTY_PRINT));
}

$action = isset($_GET['action']) ? $_GET['action'] : 'get_all';

// GET DATA
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if ($action === 'get_suggestions') {
        $data = file_get_contents($suggestionsFile);
        echo $data ? $data : '[]';
        exit;
    }

    if ($action === 'get_students') {
        $data = file_get_contents($studentsFile);
        echo $data ? $data : '[]';
        exit;
    }

    // Default: get all
    $sugData = file_get_contents($suggestionsFile);
    $stuData = file_get_contents($studentsFile);

    echo json_encode([
        "status" => "success",
        "suggestions" => $sugData ? json_decode($sugData, true) : [],
        "students" => $stuData ? json_decode($stuData, true) : []
    ]);
    exit;
}

// POST DATA
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $rawInput = file_get_contents('php://input');
    $payload = json_decode($rawInput, true);

    if ($action === 'save_suggestions' || (isset($payload['action']) && $payload['action'] === 'save_suggestions')) {
        $items = isset($payload['suggestions']) ? $payload['suggestions'] : (is_array($payload) ? $payload : []);
        file_put_contents($suggestionsFile, json_encode($items, JSON_PRETTY_PRINT));
        echo json_encode(["status" => "success", "count" => count($items)]);
        exit;
    }

    if ($action === 'save_students' || (isset($payload['action']) && $payload['action'] === 'save_students')) {
        $items = isset($payload['students']) ? $payload['students'] : (is_array($payload) ? $payload : []);
        file_put_contents($studentsFile, json_encode($items, JSON_PRETTY_PRINT));
        echo json_encode(["status" => "success", "count" => count($items)]);
        exit;
    }

    if ($action === 'save_all') {
        if (isset($payload['suggestions'])) {
            file_put_contents($suggestionsFile, json_encode($payload['suggestions'], JSON_PRETTY_PRINT));
        }
        if (isset($payload['students'])) {
            file_put_contents($studentsFile, json_encode($payload['students'], JSON_PRETTY_PRINT));
        }
        echo json_encode(["status" => "success"]);
        exit;
    }

    // Add single suggestion
    if ($action === 'add_suggestion') {
        $current = json_decode(file_get_contents($suggestionsFile), true);
        if (!is_array($current)) $current = [];
        if (!empty($payload)) {
            array_unshift($current, $payload);
            file_put_contents($suggestionsFile, json_encode($current, JSON_PRETTY_PRINT));
            echo json_encode(["status" => "success", "data" => $current]);
            exit;
        }
    }

    // Upvote suggestion
    if ($action === 'upvote_suggestion') {
        $id = isset($payload['id']) ? $payload['id'] : '';
        $current = json_decode(file_get_contents($suggestionsFile), true);
        if (is_array($current) && !empty($id)) {
            foreach ($current as &$sug) {
                if (isset($sug['id']) && $sug['id'] === $id) {
                    $sug['upvotes'] = ($sug['upvotes'] ?? 0) + 1;
                    break;
                }
            }
            file_put_contents($suggestionsFile, json_encode($current, JSON_PRETTY_PRINT));
            echo json_encode(["status" => "success", "data" => $current]);
            exit;
        }
    }

    echo json_encode(["status" => "no_action_taken"]);
    exit;
}
