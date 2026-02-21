
 



BETA TESTING GUIDE
Aviation MRO Management Platform
Complete Maintenance, Repair & Overhaul Management
FAA Compliance  |  Parts Traceability  |  Full Accounting Integration



Version 1.0 Beta  |  February 2026
aviation.adaptensor.io

 
Adaptensor, Inc.
Built with purpose. Built to last. Built to fly.
 
CONFIDENTIAL — BETA PROGRAM
This document is provided exclusively to authorized beta testers of the AdaptAero Aviation MRO platform. The contents, features, workflows, and screenshots described herein are proprietary to Adaptensor, Inc. and may not be shared, reproduced, or distributed without written authorization.
By participating in this beta program, you agree to Adaptensor's Beta Testing Agreement.

TABLE OF CONTENTS
1. Welcome to the AdaptAero Beta	1
1.1 What You Are Testing	1
Platform Access	1
1.2 Beta Tester Roles	1
1.3 How to Report Issues	1
2. System Architecture & Module Overview	1
2.1 Module Map	1
3. Getting Started — First Login & Shop Setup	1
3.1 Account Activation & First Login	1
3.2 Demo Data	1
4. Module 1 — Aircraft & Asset Registry	1
4.1 Adding a New Aircraft	1
4.2 Engine & Propeller Tracking	1
4.3 Component & Life-Limited Parts Tracking	1
4.4 Aircraft Document Vault	1
5. Module 2 — Aviation Work Orders	1
5.1 Work Order Types	1
5.2 Work Order Lifecycle Testing	1
5.3 Logbook Entry Generation	1
6. Module 3 — FAA Compliance Engine	1
6.1 Airworthiness Directive (AD) Tracking	1
6.2 Inspection Scheduling	1
7. Module 4 — Parts Management & Traceability	1
7.1 Condition Codes	1
7.2 Receiving & 8130-3 Verification	1
7.3 Suspected Unapproved Parts (SUP)	1
8. Cross-Module Workflow: MRO → Avionics → IA Coordination	1
8.1 Scenario: Annual Inspection with Avionics Upgrade	1
Phase 1: Annual Inspection Initiation (MRO Shop)	1
Phase 2: Avionics RFQ & Assignment (MRO → Avionics)	1
Phase 3: Parallel Work Execution	1
Phase 4: IA Inspection & Return to Service	1
Phase 5: Billing & Financial Close-Out	1
9. Module 5 — FAA Form Generation	1
9.1 Form 337 Testing	1
9.2 Form 8130-3 Testing	1
10. Module 6 — Personnel & Tool Calibration	1
10.1 Mechanic Certification Tracking	1
10.2 Tool Calibration	1
11. Module 7 — Aviation Accounting	1
11.1 Chart of Accounts	1
11.2 Job Costing	1
12. Module 8 — Reporting & AdaptGent AI	1
12.1 Operational Reports	1
12.2 AdaptGent Aviation Queries	1
13. Bug Reporting & Feedback Protocol	1
13.1 How to Write a Great Bug Report	1
13.2 Beta Program Timeline	1
14. Master Beta Testing Sign-Off Checklist	1

 1. Welcome to the AdaptAero Beta
Thank you for joining the AdaptAero beta program. You are among the first aviation professionals to test what we believe is a transformative platform for the MRO industry — the first modern, affordable, web-based aircraft maintenance management system with fully integrated double-entry accounting, FAA compliance automation, and AI-powered intelligence.
This guide will walk you through every module, every workflow, and every FAA-critical process in the system. Aviation maintenance is not an industry where “close enough” works. Records must be precise. Compliance must be verifiable. Traceability must be unbroken. That is the standard we hold ourselves to, and it is the standard we ask you to test against.
1.1 What You Are Testing
AdaptAero is the aviation MRO module built on top of the AdaptBooks business management platform. It is not a bolt-on. It is a deeply integrated system where your work orders, parts inventory, compliance tracking, labor management, FAA form generation, and financial accounting all live in a single, unified application.
Platform Access
URL: aviation.adaptensor.io
Supported Browsers: Chrome (recommended), Firefox, Safari, Edge — latest versions
Mobile: Full PWA support — install from your browser for offline-capable mobile access
Offline Mode: Core work order entry and time logging available offline; syncs when connectivity returns
1.2 Beta Tester Roles
Your beta account has been configured with one or more of the following roles. Each role corresponds to a real-world position in an MRO operation and determines what you can access, approve, and sign off on:
Role	Real-World Equivalent	Key Capabilities
Shop Owner / Admin	Repair Station Manager, Owner-Operator	Full system access. Configure shop settings, pricing, user roles, and accounting. View all reports and financials.
A&P Mechanic	Airframe & Powerplant Certificated Mechanic	Create and work on work orders. Log labor time. Pull and install parts. Sign off routine maintenance per 14 CFR 43.3(a).
IA Inspector	Inspection Authorization Holder	All A&P capabilities plus: approve annual inspections, sign off major repairs and alterations, approve Form 337s, issue return-to-service statements under 14 CFR 43.7.
Avionics Tech	Avionics Specialist / Repair Station Tech	Specialized avionics work orders. STC installation documentation. Wiring and equipment list management. 337 generation for avionics alterations.
Parts Manager	Parts Department / Receiving	Manage inventory. Receive parts with 8130-3 verification. Issue parts to work orders. Generate 8130-3 tags for outgoing parts. Manage core returns.
Service Writer	Front Counter / Customer Relations	Create work order estimates. Communicate with aircraft owners. Schedule work. Process invoices and payments.
Aircraft Owner	Customer / Fleet Operator	View their own aircraft records, compliance status, work order history, and invoices. Request maintenance. Approve estimates.

1.3 How to Report Issues
When you find a bug, encounter unexpected behavior, or have a suggestion, report it through any of these channels:
In-App Feedback: Click the feedback icon in the bottom-right corner of any screen. This automatically captures your current page, browser info, and account context.
Email: beta@adaptensor.io — Include your beta tester ID, the module you were using, and steps to reproduce the issue.
Severity Levels: Critical (data loss, compliance error, incorrect FAA form output), High (workflow blocked, feature broken), Medium (cosmetic issue, slow performance), Low (suggestion, nice-to-have).
FAA COMPLIANCE NOTICE: Compliance Bugs Are Always Critical
If you discover any scenario where the system produces incorrect compliance data, generates a malformed FAA form, allows a non-authorized user to sign off work, or fails to enforce a life limit, report it immediately as Critical severity. These are not normal bugs. In aviation, software errors can ground aircraft or compromise safety.
 2. System Architecture & Module Overview
AdaptAero is organized into eight integrated modules. Each module is designed to function independently for focused testing, but the real power emerges when they work together. A single work order touches the Aircraft Registry (which aircraft), Work Order Management (what work), Parts Traceability (which parts), Labor Management (who did the work), the Compliance Engine (what regulations apply), Form Generation (what paperwork is produced), Accounting (what financial entries are created), and Reporting (what the owner sees on the dashboard).
2.1 Module Map
#	Module	Description
1	Aircraft & Asset Registry	Master aircraft records, engine/propeller tracking, component lifecycle, document vault, time and cycle logging.
2	Aviation Work Orders	Full work order lifecycle from estimate through return-to-service. Squawk management, labor and parts tracking, inspection checklists, logbook entry generation.
3	FAA Compliance Engine	Airworthiness Directive tracking, Service Bulletin management, inspection scheduling, automated alerting, compliance matrix generation.
4	Parts Management & Traceability	Serialized and batch parts inventory, condition codes, 8130-3 tag management, receiving inspection, issuance tracking, suspected unapproved parts workflow.
5	FAA Form Generation	Form 337 (Major Repair/Alteration), Form 8130-3 (Airworthiness Approval Tag), logbook entry formatting per 14 CFR 43.9/43.11, Form 8610-2 support.
6	Labor & Personnel Management	Mechanic certification tracking, IA authorization monitoring, training records, authorization matrix, tool calibration, time clock integration.
7	Aviation Accounting	Aviation-specific chart of accounts, job costing, progress billing, warranty accounting, hangar and storage billing, departmental P&L.
8	Reporting & AdaptGent AI	Operational dashboards, compliance reports, financial analytics, AI-powered compliance queries, document intelligence, regulatory assistant.
 3. Getting Started — First Login & Shop Setup
Before you can test any aviation features, you need to set up your shop environment. This mirrors what a real customer would do on day one. The onboarding wizard guides you through the essential configuration.
3.1 Account Activation & First Login
Step	Action	Details & Expected Result
1	Open Browser	Navigate to aviation.adaptensor.io. You should see the AdaptAero landing page with login and signup options.
2	Log In	Use the credentials provided in your beta invitation email. SSO is managed through Clerk. You may be prompted for multi-factor authentication.
3	Select Business Type	On first login, the onboarding wizard asks you to select your business type. Choose one of: General Aviation MRO, Avionics Shop, Powerplant/Engine Overhaul, Paint & Interior, or Independent A&P. This selection seeds your chart of accounts, work order types, and default configurations.
4	Shop Profile	Enter your repair station certificate number (if Part 145), physical address, FAA region/FSDO, phone, and business hours. This information appears on generated forms and correspondence.
5	Pricing Setup	Set your standard labor rates by category: Airframe, Powerplant, Avionics, Inspection. Set your default parts markup percentage. These can be overridden per work order.

3.2 Demo Data
Your beta account comes preloaded with demo data appropriate to your selected business type. This includes sample aircraft, open work orders, parts inventory, compliance items, and customer records. Demo data is clearly marked and can be cleared at any time from Settings. We encourage you to work with the demo data first to understand the system flow, then add your own real aircraft and scenarios.
Demo Seeder Profiles
General MRO: 12 aircraft (mix of Cessna, Piper, Beechcraft), 3 open work orders, full parts inventory, AD compliance data. Avionics Shop: 8 aircraft with pending avionics installs, STC documentation, 337 drafts. Paint & Interior: 4 aircraft with long-duration WOs, progress billing milestones. IA Inspector: Access to all demo aircraft with upcoming annual inspections requiring sign-off.
 4. Module 1 — Aircraft & Asset Registry
The Aircraft Registry is the foundation of every other module. If the aircraft record is wrong, everything downstream is wrong: compliance tracking, work orders, parts installation records, and logbook entries. Test this module thoroughly.
4.1 Adding a New Aircraft
Step	Action	Details & Expected Result
1	Navigate	Go to Aircraft > Add Aircraft from the main navigation. The aircraft entry form should appear with all required fields visible.
2	Enter Registration	Enter an N-number (e.g., N12345). The system should validate the format: 1–5 characters after the N prefix, alphanumeric, no special characters. Test with invalid formats to verify rejection.
3	Enter Identity	Serial number, manufacturer, model/series, year of manufacture. Verify that the system accepts standard formats for common aircraft (Cessna 172, Piper PA-28, Beechcraft A36, etc.).
4	Set Configuration	Category (Normal, Utility, Acrobatic, Limited, Experimental), class (SEL, MEL, SES, MES, Rotorcraft), number of engines, engine model(s), propeller model(s). Each field should have appropriate dropdowns or validated text entry.
5	Enter Time/Cycles	Total Time Airframe (TTAF) in tenths of hours (e.g., 3456.7), total cycles (whole numbers), Hobbs reading, Tach reading. Each requires an “as-of” date. Verify that the system rejects negative values and non-numeric input.
6	Link Customer	Associate the aircraft with an existing customer record or create a new one. Verify that owner vs. operator can be different entities (e.g., leased aircraft).
7	Set Status	Active, Grounded (Maintenance), Grounded (AD), Annual Due, Storage, Deregistered. Verify that grounded statuses display visual warnings on all dashboards.
8	Save	Save the aircraft record. Verify it appears in the aircraft list, search works by N-number and by customer name, and the detail page shows all entered data correctly.

4.2 Engine & Propeller Tracking
Every engine and propeller installed on an aircraft must be tracked independently. Engines accumulate their own time and cycles separate from the airframe. This is critical for TBO (Time Between Overhaul) tracking and life-limited parts management.
Step	Action	Details & Expected Result
1	Add Engine	From the aircraft detail page, go to Engines tab. Add engine with: position (Left/Right/1/2/Center), model, serial number, TSN, TSO, TBO interval, cycles since new, cycles since overhaul. Verify multi-engine aircraft allow multiple entries.
2	Add Propeller	From the Propellers tab: model, serial number, hub serial number, TSN, TSO, TBO, individual blade serial numbers. Verify that changes to propeller data log correctly in the component history.
3	Time Logging	Enter a flight time log: date, Hobbs start/end, Tach start/end, cycles (landings), flight hours. Verify that airframe TTAF, engine TSN/TSO, and propeller TSN/TSO all update correctly based on the entry. Test the math: if you enter 1.5 hours, TTAF should increase by exactly 1.5.
4	TBO Alerting	Set a TBO of 2000 hours on an engine with 1920 TSO. The system should show a yellow “coming due” alert. Set TSO to 2001 and verify the system shows a red “overdue” alert.

4.3 Component & Life-Limited Parts Tracking
FAA COMPLIANCE NOTICE: Life-Limited Parts (LLP)
Parts with mandatory retirement lives are the highest-priority compliance items in aviation. If a life-limited part exceeds its limit, the aircraft is legally unairworthy. The system must flag overdue LLPs immediately and prevent return-to-service sign-off on any aircraft with an exceeded life limit.

Step	Action	Details & Expected Result
1	Add Component	From aircraft detail > Components tab: part number, serial number, position/location, date installed, TSN at install, TSO at install. For life-limited parts: set life limit in hours, cycles, and/or calendar months.
2	Verify Alerts	Add an LLP with a 5,000-hour life limit and current TSN of 4,850. Verify the system shows 150 hours remaining. Set a threshold of 200 hours in settings and verify the yellow alert appears. Change TSN to 5,001 and verify the aircraft status automatically changes to Grounded and a red critical alert appears.
3	Component History	Remove a component and install a replacement. Verify that the removal is logged with: date, reason, disposition (scrap/overhaul/core return), and the new component installation is logged with full traceability. The old component should appear in inventory with AR (As-Removed) condition code.

4.4 Aircraft Document Vault
Step	Action	Details & Expected Result
1	Upload Documents	Upload sample documents: airworthiness certificate, registration certificate, weight & balance, POH supplement, insurance certificate. Verify each document type can be categorized correctly.
2	Set Expirations	For documents with expiration dates (insurance, registration), set the dates and verify the system alerts before expiration.
3	Search	Verify that uploaded documents are searchable by title and content (via AdaptGent text extraction for PDFs).
Aircraft Registry Testing Checklist
Pass	Test Item	Notes
☐	Aircraft CRUD (Create, Read, Update, Delete) works correctly	
☐	N-number validation enforces proper format	
☐	Time/cycle entries reject invalid input (negative, non-numeric)	
☐	Engine and propeller tracking updates independently from airframe	
☐	Time logging correctly increments TTAF, TSN, TSO	
☐	TBO alerts trigger at correct thresholds (yellow) and overdue (red)	
☐	Life-limited parts tracking shows remaining life accurately	
☐	LLP exceedance automatically grounds aircraft and blocks return-to-service	
☐	Component installation/removal history is complete and traceable	
☐	Document vault upload, categorization, and search work correctly	
☐	Aircraft status changes display on all relevant dashboards	
☐	Multi-engine aircraft support multiple engine/propeller records	
 5. Module 2 — Aviation Work Orders
Aviation work orders are legal documents. When a mechanic signs a return-to-service statement, they are certifying under federal regulation that the aircraft is airworthy. The work order module must enforce proper workflows, capture complete data, and generate records that meet FAA documentation requirements under 14 CFR 43.9 and 43.11.
5.1 Work Order Types
Test each of the following work order types. Each has specific regulatory requirements and workflow differences:
Work Order Type	Regulatory Basis	Key Requirement
Annual Inspection	14 CFR 91.409	Must be performed/supervised by IA holder. System must verify IA authorization before allowing sign-off.
100-Hour Inspection	14 CFR 91.409(b)	Required for hire aircraft. Any A&P can perform. Cannot substitute for annual. System must track the 10-hour overfly allowance.
Progressive Inspection	14 CFR 91.409(d)	FAA-approved program. Each segment tracked independently with own due dates.
Routine Maintenance	14 CFR 43.3(a)	A&P privileges. Oil changes, tire replacement, brake service, spark plugs. A&P sign-off is sufficient.
Major Repair	14 CFR 43 Appendix A	Requires Form 337. If performed by individual A&P, must have IA approval for return to service.
Major Alteration	14 CFR 43 Appendix A	Requires Form 337. STC data package must be linked. Weight & balance update may be required.
Avionics Installation	Specialized	STC documentation, wiring diagrams, equipment list changes, antenna placement, ground/flight test procedures.
Engine Overhaul	Manufacturer specs	Complete disassembly, inspection against limits, LLP replacement. Generates new TSO baseline.
Condition Inspection	14 CFR 91.319	For experimental/amateur-built. Similar to annual but different regulatory basis.
Service Bulletin	Manufacturer/AD	May be mandatory (if AD-referenced) or voluntary. Track compliance record.

5.2 Work Order Lifecycle Testing
Every work order transitions through a strict status workflow. Test each transition and verify that the audit trail captures who changed the status, when, and why.
Step	Action	Details & Expected Result
1	Create Draft	Create a new work order. Select aircraft, customer, WO type, and assign a mechanic. Status should be Draft. No labor or parts should be committable yet.
2	Generate Estimate	Add estimated labor hours and parts. Generate a PDF estimate. Verify that the estimate includes aircraft details, labor breakdown, parts with pricing, and total cost. Email the estimate to a test email address.
3	Customer Approval	Simulate customer approval (in-app approval button, email link, or manual approval entry). Status should change to Approved. Verify that parts can now be pulled from inventory.
4	Begin Work	A mechanic starts work. Status changes to In Progress. Verify that the time clock activates and labor can be logged against the WO.
5	Log Squawks	During an inspection, add discrepancy items (squawks). Each squawk should have: item number, ATA chapter code, description, corrective action, and status (Open, Approved, Completed, Deferred). Test adding 5+ squawks and verify they number sequentially.
6	Await Parts	Change status to Awaiting Parts for a squawk that needs an ordered part. Link to a purchase order. Verify the WO shows which parts are pending and from which vendor.
7	Inspection Hold	For annual inspections: move to Inspection Hold. Only users with IA authorization should be able to sign off. Test that an A&P without IA gets blocked from approving.
8	Complete Work	All squawks resolved. Mechanic signs off work performed. IA signs off inspection (if applicable). Logbook entries generated. Return-to-service statement generated. Aircraft status returns to Active.
9	Invoice	Generate invoice from WO. Verify labor and parts totals match WO records. Journal entries created: Debit AR, Credit Revenue (by department: Airframe, Powerplant, Avionics). Parts: Debit COGS, Credit Inventory.
10	Payment	Record payment. AR clears. WO status changes to Paid and is archived. Verify all financial entries balance.

5.3 Logbook Entry Generation
FAA COMPLIANCE NOTICE: 14 CFR 43.9 & 43.11 Compliance
Every maintenance action requires a logbook entry. The system auto-generates entries formatted per these regulations. The entry must include: description of work performed, date of completion, mechanic name, certificate number, and signature. For inspections (43.11): type of inspection, scope, aircraft total time, and the approval for return to service statement. Verify that every generated logbook entry contains all required elements.

Test logbook generation for each work order type. Print the entries and compare against the regulatory requirements. The entries should be formatted for inclusion in physical logbooks or stored as permanent digital records.
Work Order Testing Checklist
Pass	Test Item	Notes
☐	All 10 work order types can be created with correct fields	
☐	Status transitions follow the prescribed workflow exactly	
☐	Audit trail captures every status change with user, timestamp, and reason	
☐	Squawk items number sequentially and track through completion	
☐	Customer estimate PDF generates correctly and can be emailed	
☐	Customer approval workflow functions (in-app, email link, manual)	
☐	Parts pulled from inventory link to specific WO and squawk line	
☐	Removed parts return to inventory with AR condition code	
☐	Labor time clock starts/stops correctly per mechanic	
☐	Logbook entries include all 14 CFR 43.9 required elements	
☐	Inspection entries include all 14 CFR 43.11 required elements	
☐	Return-to-service statement generates with correct mechanic/IA data	
☐	IA sign-off is blocked for users without IA authorization	
☐	Invoice generation matches WO labor and parts totals	
☐	Journal entries create correct debits and credits	
☐	Work order photos attach to specific squawk items with timestamps	
 6. Module 3 — FAA Compliance Engine
This is the module that makes AdaptAero worth its weight in gold. Compliance tracking is the most time-consuming, error-prone, and legally consequential aspect of aircraft maintenance management. An AD compliance error can ground an aircraft, cost thousands in unscheduled downtime, or result in FAA enforcement action. Test every edge case.
6.1 Airworthiness Directive (AD) Tracking
Step	Action	Details & Expected Result
1	AD Database	Verify the system has a current AD database. Navigate to Compliance > AD Database. Search for ADs by aircraft type, engine type, or keyword. Results should include AD number, title, effective date, and applicability.
2	Auto-Matching	Add an aircraft to the registry (e.g., 1975 Cessna 172M with O-300-D engine). Navigate to that aircraft's AD tab. The system should auto-match applicable ADs based on type certificate, engine type, and configuration. Verify that engine-specific ADs appear separately from airframe ADs.
3	Compliance Status	For each applicable AD, set status: Applicable (action needed), Complied (with date, time, and method), Not Applicable (with documented reason), or Terminated (superseded). Verify that each status change is logged.
4	Recurring ADs	Find a recurring AD (e.g., repetitive inspection every 500 hours). Set compliance with current aircraft time. Verify the system calculates the next-due date/hours correctly. Test the alert thresholds: green (not due), yellow (approaching), red (overdue).
5	New AD Alert	Simulate a new AD being published that affects an aircraft in your registry. The system should generate a notification. Verify the AD appears in the aircraft's compliance list with Applicable status.
6	AD Status Report	Generate the AD Compliance Matrix report for an aircraft. This is the first document an IA reviews during an annual. Verify it lists all applicable ADs with compliance status, dates, and references. Print it and verify it is formatted for professional review.

6.2 Inspection Scheduling
Test each inspection type to verify the system correctly calculates due dates and generates timely alerts:
Step	Action	Details & Expected Result
1	Annual Inspection	Set last annual date to 11 months ago. System should show 1 month remaining. Set to 13 months ago and verify the system flags the aircraft as overdue and unairworthy.
2	100-Hour	Set current time at 95 hours since last 100-hour. System should show 5 hours remaining. Verify the 10-hour overfly allowance: at 105 hours, the aircraft can still fly to reach maintenance, but the NEXT 100-hour is due at 100 hours from the original due point, not from when actually performed.
3	Transponder/Pitot-Static	14 CFR 91.411/413 require testing every 24 calendar months. Set last test date and verify the system tracks these independently from the annual inspection.
4	ELT Battery	Track ELT battery replacement per manufacturer specs. Set expiration and verify alerts generate at 90, 60, and 30 days before due.
Compliance Engine Testing Checklist
Pass	Test Item	Notes
☐	AD database contains current ADs searchable by type, engine, and keyword	
☐	Auto-matching correctly identifies applicable ADs for each aircraft configuration	
☐	Compliance status changes are logged with full audit trail	
☐	Recurring AD next-due calculations are mathematically correct	
☐	Alert color coding: green (current), yellow (approaching), red (overdue)	
☐	AD Status Report is complete, accurate, and professionally formatted	
☐	Annual inspection due date calculates correctly (12 calendar months)	
☐	100-hour inspection tracks correctly with 10-hour overfly allowance	
☐	Transponder and pitot-static tests track independently (24-month cycle)	
☐	ELT battery expiration alerts generate at configured thresholds	
☐	Overdue AD or inspection automatically flags aircraft as unairworthy	
☐	Service Bulletin tracking distinguishes mandatory (AD-linked) from voluntary	
 7. Module 4 — Parts Management & Traceability
Every part on a certificated aircraft must have documented traceability back to its origin. This module enforces that chain of custody from receiving through installation, removal, and final disposition. An unbroken paper trail is not optional in aviation — it is the law.
7.1 Condition Codes
Verify that the system enforces the following condition codes and prevents parts with certain codes from being issued to work orders:
Code	Condition	Description	Installable?
NE	New	Purchased new from OEM or PMA manufacturer with 8130-3 certification	Yes
OH	Overhauled	Fully disassembled, inspected, repaired, reassembled, tested. TSO resets to zero.	Yes
SV	Serviceable	Inspected/tested within limits. TSO does NOT reset.	Yes
AR	As-Removed	Removed from aircraft, condition unknown. Cannot install until inspected.	NO
RP	Repaired	Specific defect repaired and tested. Retains existing time/cycles.	Yes
IN	Inspected/Tested	Found within serviceable limits per maintenance manual.	Yes
SC	Scrap	Condemned. Must be mutilated to prevent installation.	NO
QR	Quarantine	Segregated pending investigation. Cannot be used.	NO

7.2 Receiving & 8130-3 Verification
Step	Action	Details & Expected Result
1	Receive New Part	Create a purchase order receipt. Enter part number, serial number (if serialized), condition code, and 8130-3 tag reference. Upload a scan of the 8130-3 tag. Verify the system validates that NE/OH/SV parts have an 8130-3 reference.
2	Missing 8130-3	Try to receive a serialized part without an 8130-3 reference. The system should automatically assign QR (Quarantine) status and generate a discrepancy notice.
3	Shelf Life	Enter a part with a shelf life expiration date (e.g., sealant, adhesive). Verify the system tracks expiration and prevents issuance of expired items.
4	Issue to Work Order	Pull a part from stock for a work order. Verify: inventory decrements, 8130-3 reference transfers to WO record, COGS journal entry generates, and the customer invoice includes the part.
7.3 Suspected Unapproved Parts (SUP)
FAA COMPLIANCE NOTICE: FAA Advisory Circular AC 21-29
Suspected unapproved parts are a serious safety concern. The FAA requires that any part suspected of being unapproved be quarantined immediately, investigated, and reported to the local FSDO if confirmed. The system must support this complete workflow without exception.

Step	Action	Details & Expected Result
1	Flag SUP	Flag any part as suspected unapproved with a documented reason. Verify the part immediately moves to QR status and becomes non-issuable.
2	Investigation	Open a SUP investigation record. Document findings. If confirmed unapproved, verify the system generates an FAA SUP report and flags all aircraft that may have had the suspect part installed.
3	Resolution	Resolve the investigation with disposition: confirmed unapproved (scrap + report), cleared (return to service), or inconclusive (retain in quarantine). Verify audit trail.
 8. Cross-Module Workflow: MRO → Avionics → IA Coordination
 
This is the most complex and most FAA-critical workflow in the entire system. It simulates a real-world scenario where a general aviation aircraft comes in for an annual inspection, the MRO shop discovers that avionics work is needed, the shop coordinates with an avionics specialist, and an IA inspector oversees the entire process to final return-to-service. All three parties must work within the system in a coordinated, FAA-compliant manner.
FAA COMPLIANCE NOTICE: 14 CFR Regulatory Framework
This workflow involves multiple regulatory sections: Part 43.3 (A&P privileges), Part 43.7 (IA approval authority), Part 43.9 (maintenance records), Part 43.11 (inspection records), Part 43 Appendix A (major repair/alteration classification), and Part 91.409 (inspection requirements). Every handoff between MRO, Avionics, and IA must comply with these regulations and produce auditable documentation.

8.1 Scenario: Annual Inspection with Avionics Upgrade
Aircraft: Cessna 182T Skylane, N5678A, owned by a local flight school. The aircraft is due for its annual inspection. During the inspection, the IA identifies that the existing KX-155 nav/com is failing intermittently and the transponder is due for its 24-month check. The owner approves an avionics upgrade to a Garmin GTN 650Xi and GTX 345 ADS-B transponder. This requires coordination between the MRO shop (airframe work), an avionics technician (avionics installation), and the IA (inspection oversight and final approval).

Phase 1: Annual Inspection Initiation (MRO Shop)
The MRO shop creates the annual inspection work order and performs the initial inspection.
Step	Action	Details & Expected Result
1	Create Annual WO	Shop Owner or Service Writer creates a new work order: Type = Annual Inspection, Aircraft = N5678A, Customer = Flight School account. Assign lead mechanic. The system should auto-load the manufacturer’s inspection checklist for Cessna 182T.
2	Begin Inspection	Lead A&P mechanic starts the inspection. Works through the checklist item by item. Each checklist item is marked Pass, Fail, or N/A with inspector initials. Failed items automatically generate squawk entries.
3	Document Squawks	During inspection, the mechanic finds: (1) Nav/Com intermittent failure, (2) Transponder 24-month check overdue, (3) Nose gear shimmy damper worn, (4) Left brake disc below minimums. Each squawk is entered with ATA chapter code, description, and photos.
4	Scope Change	The owner is notified of findings. Original estimate was $2,500 for annual. New estimate with brake/shimmy repair is $3,800. Avionics upgrade is separate. Owner approves all work. The system should track the scope change with customer approval timestamp.

Phase 2: Avionics RFQ & Assignment (MRO → Avionics)
The MRO shop needs to bring in an avionics specialist. This is where the cross-shop coordination workflow is critical. The MRO must issue a request, the avionics tech must accept and perform the work under proper authorization, and all documentation must flow back to the parent work order.
Step	Action	Details & Expected Result
1	Create Avionics Sub-WO	From the parent Annual WO, the MRO creates a linked Avionics Installation sub-work order for the GTN 650Xi and GTX 345 installation. The sub-WO inherits the aircraft record, customer, and parent WO reference.
2	Issue RFQ	The MRO shop generates a Request for Quote (RFQ) from the sub-WO. The RFQ includes: aircraft details, requested work scope (remove KX-155 and KT-76A, install GTN 650Xi and GTX 345 per STC), and timeline requirements (must coordinate with annual completion). The RFQ is sent to the avionics tech through the system.
3	Avionics Tech Reviews	The avionics tech receives the RFQ in their queue. They can see the aircraft details, required STCs (Garmin STC SA02510WI for GTN 650Xi, STC SA02467WI for GTX 345), and the MRO’s timeline. The tech prepares a quote with labor hours, parts (STC kits, wiring harnesses, antennas), and estimated completion time.
4	Quote Approval	The avionics tech submits their quote back through the system. The MRO shop reviews and approves (or negotiates). Once approved, the quote becomes a committed work authorization linked to the sub-WO.
5	Authorization Check	CRITICAL: The system verifies that the avionics tech holds appropriate authorization: either an A&P certificate with avionics experience, or is operating under a Part 145 repair station certificate with avionics rating. This is logged in the work order record.

Phase 3: Parallel Work Execution
Now both the MRO mechanic and the avionics tech are working on the same aircraft simultaneously. The system must coordinate their activities, track their independent labor and parts, and maintain a unified record.
Step	Action	Details & Expected Result
1	MRO Work	The A&P mechanic performs: nose gear shimmy damper replacement, left brake disc replacement, remainder of annual inspection checklist items. Each task logs labor, parts used (with 8130-3 references), and completion sign-off.
2	Avionics Work	The avionics tech performs: remove old KX-155 and KT-76A (both logged as removed with serial numbers and disposition), install GTN 650Xi per STC SA02510WI (logged with serial number, 8130-3 tag, STC reference), install GTX 345 per STC SA02467WI, complete wiring per STC wiring diagram, update equipment list, perform ground functional test.
3	Weight & Balance	The avionics installation changes the aircraft weight and balance. The avionics tech enters the weight change data. The system recalculates W&B or flags that a new W&B report is required.
4	Form 337 Draft	The avionics installation is a Major Alteration (changing the aircraft from its type-certificated avionics configuration). The system auto-generates a draft Form 337 with: aircraft data (auto-filled), description of alteration, STC references, weight change data, and approval basis (STC). This Form 337 must be reviewed and signed by the performing mechanic and approved by the IA.
5	Photo Documentation	Both the MRO mechanic and avionics tech upload photos: before/after avionics panel, removed components, installed components with serial number placards visible, wiring routing, antenna placement. All photos are linked to their respective squawk items and sub-WO.

Phase 4: IA Inspection & Return to Service
This is the final phase where the Inspection Authorization holder reviews all work, inspects the aircraft, and makes the determination that it is safe to return to service. The IA’s role is distinct from the performing mechanics and carries unique regulatory responsibility.
FAA COMPLIANCE NOTICE: IA Responsibility Under 14 CFR 43.7
The IA holder is personally responsible for determining that the aircraft meets all applicable airworthiness requirements. The IA reviews all work performed by both the MRO mechanic and the avionics technician. The IA can reject work, require rework, or refuse return-to-service if any deficiency is found. The system must support the IA’s independent authority and not allow return-to-service without their explicit approval.

Step	Action	Details & Expected Result
1	IA Reviews Parent WO	The IA logs into AdaptAero and sees the Annual Inspection WO in their Inspection Hold queue. The WO shows: completed checklist (all items pass), resolved squawks (shimmy damper, brakes), and linked avionics sub-WO.
2	IA Reviews Avionics Sub-WO	The IA opens the linked avionics sub-WO. Reviews: STC documentation (SA02510WI and SA02467WI), parts installed with 8130-3 references, wiring documentation, equipment list update, weight & balance change, ground test results, and draft Form 337.
3	IA Physical Inspection	The IA performs a physical inspection of the aircraft. In the system, the IA checks off each inspection area on the annual checklist with their IA credentials. They inspect the avionics installation for workmanship, proper mounting, and conformity with STC instructions.
4	IA Approves Form 337	The IA reviews the draft Form 337 for the avionics alteration. If satisfactory, the IA digitally signs Block 7 (Approval for Return to Service). The system generates both the original and duplicate. The duplicate is flagged for FAA filing.
5	AD Compliance Review	The IA reviews the AD Compliance Matrix generated by the system. Verifies that all applicable ADs are complied with or that compliance is current. This is a critical step — the system should present this report automatically during annual IA review.
6	Return to Service	The IA signs the maintenance release: “I certify that this aircraft has been inspected in accordance with [annual] inspection and a [list of discrepancies and unairworthy items] were found. The aircraft is [approved/disapproved] for return to service.” The IA enters their name, certificate number, IA number, and date. The system records the digital signature.
7	Logbook Entries	The system generates final logbook entries: (1) Airframe log: annual inspection completed, AD compliance listed, squawks and corrective actions, return-to-service with IA signature. (2) Engine log: if engine work was performed. (3) Avionics alteration logbook entry per 14 CFR 43.9 with STC references and Form 337 number.
8	Aircraft Status Update	Upon IA sign-off, the aircraft status automatically changes from Grounded (Maintenance) to Active. The next annual due date resets to 12 calendar months from today. All compliance items update accordingly.

Phase 5: Billing & Financial Close-Out
Step	Action	Details & Expected Result
1	Invoice Generation	The MRO shop generates a consolidated invoice covering: annual inspection labor, brake and shimmy damper repairs (parts + labor), and the avionics sub-WO charges. The avionics tech’s charges flow through the MRO’s invoice to the customer.
2	Revenue Allocation	The system allocates revenue to the correct accounts: Labor Revenue – Airframe (annual/repairs), Labor Revenue – Avionics (GTN/GTX installation), Parts Revenue (brake disc, shimmy damper, avionics units), and Inspection Fees.
3	Subcontractor Payment	If the avionics tech is a subcontractor (not an employee), the system generates an AP entry for the avionics tech’s charges. The MRO pays the avionics tech and bills the customer for the full amount including markup.
4	Job Cost Report	Generate the job cost report for this WO. It should show: estimated vs. actual hours, parts cost vs. billed, subcontractor cost vs. billed, gross margin, and margin percentage for the entire job and by category.
Cross-Module Workflow Checklist
Pass	Test Item	Notes
☐	Parent WO and sub-WO link correctly and share aircraft/customer data	
☐	RFQ generates with complete aircraft and scope information	
☐	Avionics tech receives and can respond to RFQ within the system	
☐	Authorization verification confirms avionics tech credentials before work	
☐	Both MRO and avionics labor/parts track independently but roll up to parent	
☐	Form 337 auto-generates with correct aircraft data and STC references	
☐	IA can access and review both parent WO and all linked sub-WOs	
☐	IA sign-off is blocked until all squawks are resolved and inspections complete	
☐	AD Compliance Matrix presents automatically during IA review	
☐	Return-to-service statement includes IA name, cert number, IA number, date	
☐	Logbook entries generate for airframe, engine, and avionics per regulations	
☐	Aircraft status changes from Grounded to Active upon IA approval	
☐	Next annual due date resets correctly to 12 months from sign-off date	
☐	Consolidated invoice correctly includes MRO and subcontractor charges	
☐	Revenue allocates to correct departmental accounts (Airframe, Avionics, etc.)	
☐	Job cost report shows accurate margin analysis for the complete job	
 9. Module 5 — FAA Form Generation
The accuracy of generated FAA forms is non-negotiable. A malformed 337, an incomplete 8130-3, or a missing logbook entry element is not just a software bug — it is a compliance violation that can result in enforcement action against the mechanic, the repair station, and the aircraft owner.
9.1 Form 337 Testing
Step	Action	Details & Expected Result
1	Generate 337	Create a major repair or alteration work order. Complete the work. Generate the Form 337. Verify every field: aircraft registration, serial, make/model, owner info, description of work, approval basis (STC, DER, repair station authority), mechanic cert number, IA signature block.
2	STC Reference	For STC-based alterations, verify the 337 correctly references the STC number, revision, and approval date. The STC data must be linked in the system and accessible from the 337 record.
3	Dual Copy	Verify the system generates both the original (filed in aircraft records) and duplicate (filed with FAA). The duplicate should be flagged for FAA submission tracking.
4	FAA Acknowledgment	After “filing” the duplicate, the system should track whether FAA acknowledgment has been received. If no acknowledgment within 30 days, generate an alert.
9.2 Form 8130-3 Testing
Step	Action	Details & Expected Result
1	Generate 8130-3	For a part repaired or overhauled by the repair station, generate an 8130-3 tag. Verify: part number, serial number, description, status/work (New, Overhauled, Repaired, Inspected, Tested), batch number, TSN/TSO, conformity statement, authorized signature.
2	Tracking Number	Each 8130-3 gets a unique tracking number. Verify that when this part is later installed on an aircraft, the 8130-3 reference links the part record to the tag record for full traceability.
3	Print Format	Print the 8130-3 and verify it matches the FAA standard format. The tag must be legible and contain all required blocks.
 10. Module 6 — Personnel & Tool Calibration
10.1 Mechanic Certification Tracking
Step	Action	Details & Expected Result
1	Add Mechanic	Create a mechanic profile with: A&P certificate number, date issued, IA number and expiration (if applicable), repair station authorizations, and hire date. Upload certificate images.
2	IA Expiration Alert	Set an IA expiration date 45 days from now. Verify alerts generate at 90, 60, and 30 days. When the IA expires, verify the system prevents that user from signing off annual inspections or approving 337s.
3	Authorization Matrix	For Part 145 shops: configure the authorization matrix specifying what each mechanic can perform and approve. Test that the system enforces these boundaries during work order sign-off.
10.2 Tool Calibration
Step	Action	Details & Expected Result
1	Add Tool	Add a torque wrench with: description, serial number, calibration interval (12 months), last calibration date, calibration vendor. Upload calibration certificate.
2	Overdue Alert	Set last calibration to 13 months ago. Verify the system flags the tool as overdue and non-usable. The tool should appear on the Calibration Due List report highlighted in red.

11. Module 7 — Aviation Accounting
11.1 Chart of Accounts
Verify that the aviation-specific chart of accounts is properly seeded when a new tenant selects an aviation business type. Check that revenue accounts are broken out by department (Airframe, Powerplant, Avionics, Paint/Interior, Inspection, Parts Counter, Hangar) and that COGS and expense accounts reflect aviation-specific categories (tool calibration, FAA fees, insurance types, hazmat compliance, technical publications).
11.2 Job Costing
Step	Action	Details & Expected Result
1	Complete a WO	Work through a complete work order with labor (multiple mechanics, multiple rates), parts (serialized and consumable), and subcontract charges. Verify the job cost report shows: actual cost vs. billed amount at the line-item level, labor margin, parts margin, subcontract margin, and overall gross margin.
2	Progress Billing	For a long-duration WO (engine overhaul): set up milestone billing with initial deposit (30%), teardown inspection milestone, parts ordered milestone, and final completion. Verify each progress billing generates correct journal entries: Debit AR, Credit Unearned Revenue initially, then recognize as Revenue upon milestone completion.
3	Warranty	Create a warranty claim work order linked to an original WO. Verify labor and parts are expensed to Warranty Expense, not billed to customer. If the part has a manufacturer warranty, verify the vendor warranty claim generates correctly.
 12. Module 8 — Reporting & AdaptGent AI
12.1 Operational Reports
Test each of the following reports for accuracy and completeness:
Step	Action	Details & Expected Result
1	Open Work Orders	All active WOs with status, age, mechanic, estimated completion, and revenue. Verify sort and filter options work correctly.
2	Aircraft Status Board	Every aircraft in the shop with status, WO number, bay assignment, and holds. This replaces the physical whiteboard. Verify real-time updates as WO statuses change.
3	Mechanic Utilization	Billed hours vs. available hours per mechanic. Revenue per mechanic hour. Verify the math is correct by comparing to individual time entries.
4	Parts on Order	All outstanding POs with delivery dates and which WOs are waiting. Verify links between POs and WOs are accurate.
12.2 AdaptGent Aviation Queries
Test the AI assistant with aviation-specific queries. AdaptGent should answer based on actual data in your shop’s database:
Step	Action	Details & Expected Result
1	Compliance Query	Ask: “Is N5678A current on all ADs?” AdaptGent should query the compliance engine and return a definitive answer with any discrepancies highlighted.
2	Business Query	Ask: “What was our parts margin last month?” AdaptGent should calculate from actual transaction data and return the correct figure.
3	Regulatory Query	Ask: “Can an A&P perform a major repair without IA approval?” AdaptGent should explain Part 43 privileges with the required disclaimer.
4	Document Analysis	Upload a sample AD and ask: “Which aircraft in our shop does this AD affect?” AdaptGent should parse the AD’s applicability section and match against your aircraft registry.
AdaptGent Disclaimer
Every regulatory response from AdaptGent displays: “AdaptGent provides regulatory guidance for informational purposes only. Always verify requirements with the current edition of applicable Federal Aviation Regulations and consult your local FSDO for interpretation questions.” Verify this disclaimer appears consistently.
 13. Bug Reporting & Feedback Protocol
13.1 How to Write a Great Bug Report
The quality of your bug reports directly impacts how quickly we can fix issues. Please include the following in every report:
Summary	One-sentence description of the problem.
Severity	Critical (compliance/data), High (workflow blocked), Medium (cosmetic), Low (suggestion).
Steps to Reproduce	Numbered steps starting from a known state. Be specific: “Click the blue Submit button on the Work Order page” not “submit the form.”
Expected Result	What should have happened.
Actual Result	What actually happened. Include error messages verbatim.
Screenshots/Video	Attach screenshots or a screen recording if possible.
Browser & Device	Chrome 120 on Windows 11, Safari on iPad, etc.
Account Context	Your beta tester role and which demo data set you are using.

13.2 Beta Program Timeline
Phase	Dates	Focus
Phase 1: Core	Weeks 1–2	Aircraft Registry, Work Orders, and Parts. Get comfortable with the basics.
Phase 2: Compliance	Weeks 3–4	Compliance Engine, Form Generation, and cross-module workflows. This is where the real value is.
Phase 3: Integration	Weeks 5–6	Full end-to-end workflows, accounting integration, reporting, and AdaptGent AI testing.
Phase 4: Stress Test	Weeks 7–8	Load testing with realistic data volumes, concurrent users, and edge cases. Try to break it.
 14. Master Beta Testing Sign-Off Checklist
Use this checklist to track your testing progress across all modules. When you have completed testing a section, mark it as passed and note any outstanding issues. Submit your completed checklist to beta@adaptensor.io at the end of each testing phase.

Module 1: Aircraft & Asset Registry
Pass	Test Item	Notes
☐	Aircraft CRUD operations function correctly	
☐	Engine and propeller tracking is accurate and independent	
☐	Life-limited parts alert at correct thresholds and ground aircraft when exceeded	
☐	Component history maintains complete installation/removal chain	
☐	Document vault upload, categorize, and search all work	

Module 2: Aviation Work Orders
Pass	Test Item	Notes
☐	All work order types can be created with proper fields	
☐	Status workflow transitions enforce correct sequence	
☐	Squawk management tracks from discovery through resolution	
☐	Logbook entries comply with 14 CFR 43.9 and 43.11	
☐	Return-to-service statement generates with required elements	

Module 3: FAA Compliance Engine
Pass	Test Item	Notes
☐	AD tracking auto-matches and calculates next-due correctly	
☐	Inspection scheduling handles annual, 100-hour, and special inspections	
☐	Alerts generate at correct thresholds with proper color coding	
☐	AD Compliance Matrix report is complete and printable	

Module 4: Parts Management & Traceability
Pass	Test Item	Notes
☐	Condition codes enforced — AR/SC/QR parts cannot be installed	
☐	8130-3 verification required on receiving for certificated parts	
☐	Parts issuance links to WO with full traceability chain	
☐	Suspected unapproved parts workflow functions completely	

Module 5: FAA Form Generation
Pass	Test Item	Notes
☐	Form 337 generates correctly with all required fields	
☐	Form 8130-3 generates with proper format and tracking number	
☐	Logbook entry formatting meets regulatory requirements	

Module 6: Personnel & Tools
Pass	Test Item	Notes
☐	Mechanic certifications track and alert before expiration	
☐	IA authorization enforced for annual sign-off and 337 approval	
☐	Tool calibration tracking alerts on overdue items	

Module 7: Aviation Accounting
Pass	Test Item	Notes
☐	Chart of accounts properly seeded for aviation business types	
☐	Job costing accurately tracks margin by labor, parts, and subcontract	
☐	Progress billing generates correct journal entries at each milestone	

Module 8: Reporting & AdaptGent
Pass	Test Item	Notes
☐	Operational reports show accurate, real-time data	
☐	AdaptGent answers compliance and business queries from live data	
☐	Regulatory disclaimer displays on every regulatory response	

Cross-Module: MRO → Avionics → IA Workflow
Pass	Test Item	Notes
☐	Parent/sub work order linking functions correctly	
☐	RFQ and quote workflow between MRO and avionics tech works	
☐	IA can review all linked work and sign off independently	
☐	Form 337 generates for avionics alteration with STC references	
☐	Consolidated billing rolls up correctly across all parties	
☐	Full audit trail exists from estimate through payment	
 
 



Thank you for being a beta tester.
Your feedback is shaping the future of aviation maintenance management.

aviation.adaptensor.io
beta@adaptensor.io

 
Adaptensor, Inc.
Built with purpose. Built to last. Built to fly.
© 2026 Adaptensor, Inc. All rights reserved.
