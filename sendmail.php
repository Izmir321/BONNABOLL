<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $to = "info@bonnaboll.se";
    $subject = "Nytt meddelande från Bonnaboll";

    $name = trim($_POST["name"] ?? "");
    $email = trim($_POST["email"] ?? "");
    $type = trim($_POST["type"] ?? "");
    $message = trim($_POST["message"] ?? "");

    if ($name === "" || $email === "" || $type === "" || $message === "") {
        exit("Alla fält måste fyllas i.");
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        exit("Ogiltig e-postadress.");
    }

    $body = "Namn: $name\n";
    $body .= "E-post: $email\n";
    $body .= "Typ: $type\n\n";
    $body .= "Meddelande:\n$message\n";

    $headers = [];
    $headers[] = "From: info@bonnaboll.se";
    $headers[] = "Reply-To: $email";
    $headers[] = "Content-Type: text/plain; charset=UTF-8";

    $subject = "Nytt meddelande från $name: $type";

    if (mail($to, $subject, $body, implode("\r\n", $headers))) {
        header("Location: tack.html");
        exit;
    } else {
        echo "Något gick fel. Försök igen senare.";
    }
} else {
    echo "Ogiltig förfrågan.";
}
?>