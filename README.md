# EHR System

### Full-Stack Electronic Health Record Application

A modular electronic health record (EHR) application built with **Angular, TypeScript, Java, Spring Boot, and HAPI FHIR**.

This project explores healthcare software architecture, clinical workflows, interoperability standards, and full-stack application development.

The interface and workflows are inspired by established EHR platforms, particularly eClinicalWorks, with an emphasis on modular design, standardized clinical data, and practical healthcare functionality.

**Project Status:** Active Development

---

## Technology Stack

| Category | Technologies |
|---|---|
| Frontend | Angular, TypeScript, HTML, SCSS |
| Backend Infrastructure | Java, Spring Boot, HAPI FHIR JPA Server |
| Healthcare Interoperability | HL7 FHIR R4 |
| API Communication | REST, JSON, Angular HttpClient, RxJS |
| State Management | Angular Signals, Dependency Injection |
| Clinical Terminology | ICD-10-CM, LOINC, UCUM |
| Build Tools | Angular CLI, npm, Maven |
| Version Control | Git, GitHub |
| Development Environment | IntelliJ IDEA |

### Architecture

The current application uses Angular to communicate directly with a local HAPI FHIR server through a development proxy.

```text
Angular Frontend
       |
       | HTTP / REST
       v
Angular Development Proxy
       |
       v
HAPI FHIR JPA Server
(Java / Spring Boot)
       |
       v
FHIR Persistence Layer
```

HAPI FHIR provides standardized resource persistence, search, versioning, and REST operations.

The frontend is organized into reusable components, feature-specific services, nested clinical workspaces, and reactive context services.

**Planned architecture:** Introduce a custom Spring Boot application layer for business logic, clinical workflow orchestration, validation, authorization, and integration services.

---

## Implemented Modules

### 1. Patient Management

Provides foundational patient registration and chart management.

- Register synthetic patients using FHIR Patient resources
- Search and display patient records
- Open individual patient charts
- Edit demographic information
- Maintain patient-specific clinical navigation
- Share patient state through `PatientContextService`

**FHIR Resource:** `Patient`

### 2. Clinical Problem List

Supports structured documentation of patient diagnoses.

- Create clinical conditions
- Associate diagnoses with individual patients
- Record ICD-10-CM codes
- Manage clinical status and onset dates
- Update existing conditions
- Display diagnoses in the patient chart overview

**FHIR Resource:** `Condition`

### 3. Encounter Management

Provides visit-based clinical workflows.

- Retrieve patient encounter history
- Create office and telehealth encounters
- Record visit dates and encounter statuses
- Open individual encounters
- Navigate encounter-specific clinical modules
- Share selected encounter state through `EncounterContextService`

**FHIR Resource:** `Encounter`

### 4. Vital Signs

Supports encounter-specific clinical measurements.

- Record blood pressure, heart rate, respiratory rate, temperature, oxygen saturation, height, and weight
- Associate observations with both patients and encounters
- Use standardized LOINC codes and UCUM units
- Represent blood pressure using FHIR Observation components
- Display recorded observations in the Vitals module
- Display vital-sign summaries in the Encounter Overview

**FHIR Resource:** `Observation`

### 5. Clinical Documentation

Provides a basic encounter-specific SOAP note editor.

- Structured Subjective, Objective, Assessment, and Plan fields
- Create preliminary clinical notes
- Store note content in Base64-encoded FHIR attachments
- Retrieve saved drafts
- Populate the editor from existing documentation
- Update existing DocumentReference resources
- Preserve resource version history through FHIR updates

**FHIR Resource:** `DocumentReference`

The note editor is a prototype. It does not yet support authenticated authorship, electronic signatures, finalized note workflows, or concurrent editing protection.

---

## Application Structure

```text
ehr-project/
├── ehr-client/
│   └── src/app/
│       ├── layouts/
│       │   ├── patient-workspace/
│       │   └── encounter-workspace/
│       │
│       ├── pages/
│       │   ├── patients/
│       │   ├── patient-create/
│       │   ├── patient-detail/
│       │   ├── patient-edit/
│       │   ├── patient-conditions/
│       │   ├── condition-create/
│       │   ├── condition-edit/
│       │   ├── patient-encounters/
│       │   ├── encounter-create/
│       │   ├── encounter-detail/
│       │   ├── encounter-vitals/
│       │   ├── vitals-create/
│       │   └── encounter-notes/
│       │
│       └── services/
│           ├── patient.ts
│           ├── patient-context.ts
│           ├── condition.ts
│           ├── encounter.ts
│           ├── encounter-context.ts
│           ├── observation.ts
│           └── clinical-note.ts
│
└── README.md
```

The HAPI FHIR starter is maintained as a separate upstream repository and is not included in this project's Git history.

---

## Running Locally

### Prerequisites

- Node.js and npm
- Angular CLI
- Java JDK compatible with the selected HAPI FHIR starter
- Maven (or IntelliJ IDEA's bundled Maven)
- Git

### 1. Clone the EHR application

```bash
git clone https://github.com/YOUR-USERNAME/ehr-system.git
cd ehr-system
```

Replace `YOUR-USERNAME` with your GitHub username.

### 2. Set up HAPI FHIR

Clone the official [HAPI FHIR JPA Server Starter](https://github.com/hapifhir/hapi-fhir-jpaserver-starter).

Run the starter using its documented Maven or IntelliJ configuration.

The local FHIR endpoint is expected at:

```text
http://localhost:8080/fhir
```

Verify the server using:

```text
http://localhost:8080/fhir/metadata
```

The development environment currently uses the starter's local database configuration. Production database deployment has not been implemented.

### 3. Start Angular

From the EHR repository:

```bash
cd ehr-client
npm install
npx ng serve --proxy-config src/proxy.conf.json
```

Open:

```text
http://localhost:4200
```

The development proxy forwards `/fhir` requests to the local HAPI server.

---

## Development Roadmap

### Completed or Implemented

- [x] Angular application setup
- [x] HAPI FHIR integration
- [x] Patient registration and demographic editing
- [x] Patient chart workspace
- [x] Clinical Problem List
- [x] Encounter creation and history
- [x] Encounter workspace
- [x] Vital-sign entry and display
- [x] SOAP note creation
- [x] SOAP draft retrieval and updates
- [x] Reactive patient and encounter context management

### Planned Improvements

- [ ] Extract shared clinical formatting utilities
- [ ] Add robust FHIR pagination
- [ ] Implement structured SOAP note storage
- [ ] Add note signing and amendment workflows
- [ ] Improve terminology validation
- [ ] Add comprehensive automated tests
- [ ] Implement clinical audit logging

### Future Modules

- [ ] Allergy Management
- [ ] Medication Reconciliation
- [ ] Medication Ordering
- [ ] Laboratory Orders and Results
- [ ] Clinical Diagnoses Within Encounters
- [ ] Appointment Scheduling
- [ ] Provider and Practitioner Management
- [ ] Clinical Inbox and Tasks
- [ ] Reporting and Analytics
- [ ] User Authentication and Role-Based Access Control
- [ ] Custom Spring Boot EHR API
- [ ] PostgreSQL Deployment

---

## Engineering Objectives

This project is designed to develop practical experience with:

- Full-stack application architecture
- Java and Spring Boot backend development
- Angular component-based architecture
- RESTful API integration
- Healthcare interoperability standards
- Asynchronous programming with RxJS
- Reactive state management using Angular Signals
- Domain modeling for clinical resources
- Software modularity and separation of concerns
- Clinical workflow design
- Git-based iterative development

## Important Limitations

This project is an educational prototype and is not intended for real clinical use.

It uses synthetic patient data and does not currently implement the security, access controls, auditability, regulatory safeguards, or validated clinical workflows required for a production EHR.

The application is not affiliated with or endorsed by eClinicalWorks.

## License

No license has been selected for the original application code. The HAPI FHIR server is a separately maintained open-source project subject to its own license.