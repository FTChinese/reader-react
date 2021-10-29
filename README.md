# Endponts

* `/reader/login` Show login page
* `/reader/signup` Show signup page
* `/reader/forgot-password` Show page to request a password reset letter
* `/reader/password-reset/:token` Verify the link contained in the email we sent to user in the above step. If verified, then a passwowrd reset form will be shown.
* `/reader/verification/:token` Verify user's email.
* `/reader/membership` Show user's current membership.

## TODO

* Enable changing username, email, mobile, address, password, link wechat;
* Add  paywall so that user could purchase subscription directly.
