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
        $phone = $_POST['user_phone'] ?? '';
        $message = $_POST['user_message'] ?? '';

        $sql = "INSERT INTO contact_questions (user_name, user_email, user_phone, user_message) VALUES (?, ?, ?, ?)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$name, $email, $phone, $message]);
        echo "<h1>Заявка отправлена!</h1>";
    }
} catch (PDOException $e) {
    die("Ошибка подключения: " . $e->getMessage());
}