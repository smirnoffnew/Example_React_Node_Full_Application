## Definition of environment variables
| name | default value | description | required |
|:---|:---| :---| :---|
|`HOST`|-|url of server running | +|
|`NODE_ENV`|`development`|mode of server run| -|
 # AUTH
 | name | default value | description | required |   
 |:---|:---| :---| :---|
 |`JWT_REFRESH_EXP`| `2592000000` (30d)| time while refresh token is not expired| - |
 |`JWT_ACCESS_EXP`| `3600000` (1h)| time while access token is not expired| - |
 |`JWT_PASSWORD_RESET_EXP`|`3600`  (1m)|time while reset password token is not expired|-|
 |`PASSWORD_RESET_TIMEOUT` |`60000` (10m)| timeout between password reset requests|-|
 |`JWT_SECRET_ACCESS_USER`|-|secret of user access JWT|+|
 |`JWT_SECRET_REFRESH_USER`|-|secret of user refresh JWT|+|
 |`JWT_SECRET_PASSWORD_RESET`|-|secret of user password reset JWT|+|
 | `JWT_SECRET_PASSWORD_RESET_BUSINESS_USER`|-|secret of business user password reset JWT|+|
 |`JWT_SECRET_REFRESH_BUSINESS_USER`|-|secret of business user refresh JWT|+|
 |`JWT_SECRET_ACCESS_BUSINESS_USER`|-|secret of business user access JWT|+|
 |`DEFAULT_ADMIN_EMAIL`|-|predefined email of admin|+|
 |`DEFAULT_ADMIN_PASSWORD`|-|predefined password of admin|+|
 # CRON
 | name | default value | description | required |   
 |:---|:---| :---| :---|
 |`IMAGES_CLEANER_CRON_SCHEDULE`| `0 0 */1 * *` (each day at midnight)|schedule of images cleaner cron|-| 
 |`OFFERS_CLEANER_CRON_SCHEDULE` |`0 */1 * * *` (every hour)|schedule of past offers cleaner cron| -|
 |`CRON_IMAGES_CLEANER_ENABLED` |`true`| is images cleaner cron enabled|-|
 |`CRON_OFFERS_CLEANER_ENABLED` |`true`|is offers cleaner cron enabled|-|
# FIREBASE
| name | default value | description | required |   
|:---|:---| :---| :---|
|`FIREBASE_APP_NAME`| `Offerbrite`|name of Firebase app used by server|-|
|`FIREBASE_SERVICE_ACCOUNT_PATH` |`./firebase.service.account.json`| path to service.accont.json file|+|
# LOG
| name | default value | description | required |   
|:---|:---| :---| :---|
|`LOG_LVL`| `info`| level of logging| -|
|`LOG_TIMESTAMPS`| `true`| is timestamps in logs enabled| -|
|`LOG_EXPRESS` |`false`| should server log all requests|-|
|`ENABLE_LOG` |`true`|is logger enabled|-|
# MAILER
| name | default value | description | required |   
|:---|:---| :---| :---|
|`EMAIL_ADDRESS`|-|email used by mailer|+|
|`EMAIL_PASSWORD`|-|password from email used by mailer|+|
|`EMAIL_SERVICE` |`gmail`|provider of email|+|
# MONGO
| name | default value | description | required |   
|:---|:---| :---| :---|
|`MONGOOSE_DEBUG` false
|`MONGO_HOST`|-| host Mongo instance|+| 
|`MONGO_PSW`|-|password from Mongo instance|+|
|`MONGO_USER`|-|login from Mongo instance|+|
# Offer
| name | default value | description | required |   
|:---|:---| :---| :---|
|`OFFER_TIME_TOLERANCE`  |`864000000` (10d)|tolerance for past offers|-|
# Redis
| name | default value | description | required |   
|:---|:---| :---| :---|
|`REDIS_URL`| -|url of Redis instance|+| 
|`REDIS_PSW`|-|password from Redis instance|+|
# Uploads
| name | default value | description | required |   
|:---|:---| :---| :---|
|`MAX_UPLOADING_FILES_SIZE`| `4 * 1024 * 1024` (4mb)|max allowed size of uploads to server|-| 
|`IMAGES_UPLOADING_DIR` |`images`| default dir in Firebase to upload images in|-|
|`IMAGES_UNUSED_TIME_LATENCY`| `3600000` (1h)|latency for cleaner for delete images|-|
