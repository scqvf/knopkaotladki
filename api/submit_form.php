<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

$is_localhost = ($_SERVER['HTTP_HOST'] == 'localhost' || $_SERVER['REMOTE_ADDR'] == '127.0.0.1');

if ($is_localhost) {
    $host = 'localhost';
    $db   = 'maripu6t_diplom';
    $user = 'root';
    $pass = ''; 
} else {
    $host = 'maripu6t.beget.tech'; 
    $db   = 'maripu6t_diplom';
    $user = 'maripu6t_diplom';
    $pass = 'DiplomMaria29';
}

try {
    $dsn = "mysql:host=$host;dbname=$db;charset=utf8mb4";
    $pdo = new PDO($dsn, $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
        $name    = $_POST['user_name'] ?? '';
        $email   = $_POST['user_email'] ?? '';
        $service = $_POST['service_type'] ?? '';
        $message = $_POST['user_message'] ?? '';

        if (empty($name) || empty($email)) {
            die("Ошибка: Поля ФИО и Почта обязательны для заполнения.");
        }

        $sql = "INSERT INTO applications (user_name, user_email, service_type, user_message) VALUES (?, ?, ?, ?)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$name, $email, $service, $message]);

        echo "<!DOCTYPE html>
        <html lang='ru'>
        <head><meta charset='UTF-8'><title>Успех</title></head>
        <body style='font-family: sans-serif; text-align: center; padding-top: 50px;'>
            <h1 style='color: green;'>Заявка успешно отправлена!</h1>
            <p>Спасибо, $name. Мы свяжемся с вами в ближайшее время.</p>
            <a href='/' style='text-decoration: none; color: blue;'>Вернуться на главную</a>
        </body>
        </html>";
    }
} catch (PDOException $e) {
    echo "Ошибка подключения к базе данных: " . $e->getMessage();
}