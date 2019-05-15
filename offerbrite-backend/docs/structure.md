# Structure of created project

- `/config` - contains definition of all configurations of server, this module loads env variables and appends it to export
- `/Dockerfile` - Docker configuration for building images 

- `/.env.example` - sample .env file, you should copy it as .env and reassign variables inside it.

- `/firebase.service.account.json`  - service account file, you can download your [Firebase console](https://console.firebase.google.com/u/0/project/test-3f15c/settings/serviceaccounts/adminsdk)

- `/public` - contains static files for it serving through express

- `/resources` - contains templates for email broadcasting and predefined entities for DB  
    - `/resources/emails-templates` - contains templates for email broadcasting
    - `/resources/predefined-categories.json` - definition of predefined categories, used in app
- `/test/mocha-opts` - Mocha.js configuration
### Cron 
`/cron` - contains definition of cron-jobs, using in scheduled jobs: 
1. cleaner of unused images at Firebase files storage
2. cleaner of past offers.
    - `/cron/jobs/images` - cleaner of unused images
    - `/cron/jobs/offers` - cleaner of past offers
    - `/cron/helpers/TaskRunner` - class, that encapsulates cron-jobs and provides interface for scheduling tasks

### Server
- `/server` - main folder for server instance
- `/server/helpers` - contains useful classes, extensions and functions for its using in program, like passport.js implementation, Joi extensions and sahred DB schemas
    - `/server/param-validation`  - contains validation rules for server API routes

    - `/server/services/` - contains initializations of all external services, used by server
        - `/server/services/firebase` - initializes of Firebase-admin app
        - `/server/services/mailer`  - initializes Mailer instance for emails broadcasting 
        - `/server/services/mongo`  - initializes MongoDB connection
        - `/server/services/redis`  - initializes Redis in-memoty DB connection
    - `/server/tests` - contains useful function, used for server testing
    - `/server/routes.js`  - mounts routes into express route 
    - `/server/express.js` - configures express instance and adds middleware to it   
    - `/server/modules` - contains definition of all API routes and DB models. Each folder has next structure:
    1. `{name}.model.js` - entity MongoDB model definition 
    2. `{name}.redis.js` - entity Redis model definition
    3. `{name}.route.js` - entity route
    4. `{name}.controller.js` - route controller
    5. `{name}.access.js` - definition of access rights checks functions
    6. `{name}.test.js` - route tests
    6. `{name}.query.js` [optional] - route query processor
        - `/server/modules/auth` - plain user authorization API
        - `/server/modules/auth-business` - business user authorization API
        - `/server/modules/business` - business API
        - `/server/modules/business-user` - business user API
        - `/server/modules/category` - categories API
        - `/server/modules/favouriteOffers` - favouriteOffers API
        - `/server/modules/offer` - offer API
        - `/server/modules/storage` - file storage API
        - `/server/modules/user` - user API
