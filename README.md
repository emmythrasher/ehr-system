# EHR System

A full-stack electronic health record (EHR) development project built with Angular, Java, Spring Boot, and HAPI FHIR.

## Technology Stack

- **Frontend:** Angular, TypeScript, HTML, SCSS
- **Backend:** Java, Spring Boot, HAPI FHIR JPA Server
- **Healthcare Standard:** HL7 FHIR R4
- **Development:** IntelliJ IDEA, Git

## Implemented Features

### Patient Management
- Patient registration
- Patient directory
- Individual patient charts
- Demographic updates
- FHIR REST API integration

### Clinical Problem List
- FHIR Condition resource integration
- Patient-specific problem lists
- Diagnosis entry using ICD-10-CM codes
- Clinical status tracking

*The Problem List module is under development.*

## Architecture

Angular Frontend → HAPI FHIR REST API → FHIR Persistence Layer

The application currently communicates directly with HAPI FHIR through an Angular development proxy. A custom Spring Boot application layer is planned.

## Running Locally

### Backend

Clone the official [HAPI FHIR JPA Server Starter](https://github.com/hapifhir/hapi-fhir-jpaserver-starter) into a directory named `fhir-server`.

Configure and run the starter with IntelliJ IDEA and Maven.

Default FHIR endpoint:

`http://localhost:8080/fhir`

### Frontend

Navigate to `ehr-client` and run:

```bash
npm install
ng serve
```

Open `http://localhost:4200`.

## Development Roadmap

- [x] Patient registration
- [x] Patient directory
- [x] Patient detail pages
- [x] Patient demographic updates
- [ ] Complete Clinical Problem List
- [ ] Allergy management
- [ ] Medication management
- [ ] Clinical encounters
- [ ] Clinical documentation
- [ ] Authentication and authorization
- [ ] Custom Spring Boot EHR API
- [ ] PostgreSQL deployment

## Disclaimer

This is an educational project intended for software development and healthcare interoperability practice. It uses synthetic patient information and is not intended for clinical use.