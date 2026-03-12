<?php
$host = 'localhost';
$db   = 'diplombase';
$user = 'db_knopka';
$pass = 'GKSPwBDcl9bdXVFf';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $name = $_POST['user_name'] ?? '';
        $email = $_POST['user_email'] ?? '';
        $service = $_POST['service_type'] ?? 'Не выбрано';
        $message = $_POST['user_message'] ?? '';

        $sql = "INSERT INTO service_requests (user_name, user_email, service_type, user_message) VALUES (?, ?, ?, ?)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$name, $email, $service, $message]);
        // echo "<h1>Заявка отправлена!</h1>";
        http_response_code(200);
        exit;
    }
} catch (PDOException $e) {
    die("Ошибка подключения: " . $e->getMessage());
}