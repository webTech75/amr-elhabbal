<?php 
error_reporting(-1);

// Check for empty fields
if(empty($_POST['name'])  		||
   empty($_POST['email']) 		||
   empty($_POST['message'])	||
   !filter_var($_POST['email'],FILTER_VALIDATE_EMAIL))
   {
	echo "No arguments Provided!";
	return false;
   }

$name = $_POST['name']; 
$email_address = $_POST['email'];
$message = $_POST['message'];

if(isset($_POST['submit']))
{
$from_add = $email_address; 
$to_add = "elhabbal_amr@yahoo.com"; 
$subject = "Website Contact Form:  $name";
$message = "Name:$name \n Sites: $message";

$headers = 'From: elhabbal_amr@yahoo.com' . "\r\n" .
'Reply-To: $email_address' . "\r\n" .
'X-Mailer: PHP/' . phpversion();

if(mail($to_add,$subject,$message,$headers)) 
{
    $msg = "Mail sent";

echo $msg;

} 
}

print "<p>Thanks $name</p>" ;

?>