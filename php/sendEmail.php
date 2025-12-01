<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'Exception.php';
require 'PHPMailer.php';
require 'SMTP.php';

$name = $_POST['name'];
$phone = $_POST['phone'];
$email = $_POST['email'];
$idCar = $_POST['carId'];


// Для формы на странице товара
$carLink = ($_SERVER['HTTP_REFERER'] && strpos($_SERVER['HTTP_REFERER'], 'product') !== false) ? $_SERVER['HTTP_REFERER'] : '-';
$amount = ($_POST['amount'] ?? '') ?: '-';
$term = ($_POST['term'] ?? '') ?: '-';
$firstPay = ($_POST['firstPay'] ?? '') ?: '-';
$comment = ($_POST['comment'] ?? '') ?: '-';

try {
  $secret = '6LemRborAAAAAKgXpY2kaQA0A3k3IrQbQGQkohIu';
  $response = $_POST['g-recaptcha-response'];
  $remoteip = $_SERVER['REMOTE_ADDR'];

  $url = 'https://www.google.com/recaptcha/api/siteverify';
  $data = array(
    'secret' => $secret,
    'response' => $response,
    'remoteip' => $remoteip
  );

  $options = array(
    'http' => array(
      'header' => "Content-type: application/x-www-form-urlencoded\r\n",
      'method' => 'POST',
      'content' => http_build_query($data),
    ),
  );

  $context = stream_context_create($options);
  $result = file_get_contents($url, false, $context);
  $resultJson = json_decode($result);

  $fromAddress = 'zm3158589525lt@bpauto.lv';
  $recipients = ['mareks.zukurs@gmail.com', 'oskars@elizings.com'];

  $mail = new PHPMailer(true);

  foreach ($recipients as $to) {
    $mail->addAddress($to);
  }

  $mail->setFrom($fromAddress, 'MZ Cars');
  $mail->addReplyTo($email, $name);

  $mail->CharSet = 'utf-8';
  $mail->isHTML(true);

  $mail->Subject = 'Lizing Form (MZ Cars)';
  $mail->Body = '
                            <p><b>Имя: </b>' . htmlspecialchars($name) . '</p>
                            <p><b>Номер телефона: </b> ' . htmlspecialchars($phone) . '</p>
                            <p><b>Адрес эл.почты: </b> ' . htmlspecialchars($email) . '</p>
                            <p><b>Арт. автомобиля: </b>' . htmlspecialchars($idCar) . '</p>
                            <p><b>Ссылка: </b>' . htmlspecialchars($carLink) . '</p>
                            <p><b>Сумма займа: </b>' . htmlspecialchars($amount) . '</p>
                            <p><b>Срок: </b>' . htmlspecialchars($term) . '</p>
                            <p><b>Первый взнос: </b>' . htmlspecialchars($firstPay) . '</p>
                            <p><b>Комментарий: </b>' . htmlspecialchars($comment) . '</p>';

  if ($resultJson->success != true) {
    // Неуспех, reCAPTCHA не пройдена
    echo 'captcha';
  } else {
    $mail->send();

    if ($carLink !== '-') {
      sendToAPI($name, $phone, $email, $carLink, $amount, $term, $firstPay, $comment);
    }

    echo 'success';
  }
} catch (Exception $e) {

  echo 'failed';

}

// Отправка на API

function sendToAPI($name, $phone, $email, $carLink, $amount, $term, $firstPay, $comment)
{
  if ($carLink === '-') {
    return;
  }

  $clientData = [
    'name' => $name,
    'phone' => $phone,
    'email' => $email,
  ];

  $applicationData = [
    'productId' => 1,
    'amount' => preg_replace('/\D/', '', $amount),
    'term' => $term,
    'purchaseAdLink' => $carLink,
    'clientComments' => 'Первый взнос: ' . preg_replace('/\D/', '', $firstPay) . '. ' . $comment,
  ];

  $postData = [
    'application' => $applicationData,
    'client' => $clientData,
  ];
  $postData = json_encode($postData);

  $ch = curl_init();
  curl_setopt($ch, CURLOPT_URL, "https://www.epartneri.lv/partner/form/receive");
  curl_setopt($ch, CURLOPT_POST, 1);
  curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

  $headers = [];
  $headers[] = 'Content-Type: application/json';
  $headers[] = 'Authorization: Bearer 26_dtn7alg3xkvr7x0txcanulizu6asao87';
  curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

  $server_output = curl_exec($ch);

  curl_close($ch);

  return $server_output;
}

?>

