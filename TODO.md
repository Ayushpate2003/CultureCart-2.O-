# TODO: Connect PostgreSQL Database in Docker and Access via pgAdmin4

## Steps to Complete

- [x] Edit docker-compose.yml to add pgAdmin4 service on port 5050
- [x] Run docker-compose up to start PostgreSQL and pgAdmin4 services
- [x] Access pgAdmin4 at http://localhost:5050 (login: admin@admin.com / admin)
- [x] Add server connection in pgAdmin4 to postgres (host: postgres, port: 5432, user: culturecart_user, password: culturecart_password)
- [x] Verify database tables are created from init.sql
- [x] Test backend connection to database

## TODO: Add Support for 8 Additional Indian Languages

## Steps to Complete

- [x] Create translation files for Bengali (bn), Odia (or), Telugu (te), Kannada (kn), Malayalam (ml), Punjabi (pa), Urdu (ur), and Assamese (as)
- [x] Update src/i18n/index.ts to import and include all new language resources
- [x] Update src/hooks/useLanguage.ts to include all new languages in getAvailableLanguages
- [x] Update src/api/geocode.ts to include state-language mappings for all Indian states and new languages
- [x] Verify that the onboarding flow correctly detects and suggests appropriate languages based on user location
