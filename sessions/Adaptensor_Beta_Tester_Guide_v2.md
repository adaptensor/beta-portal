
Adaptensor
BETA TESTING PROGRAM


Setup & User Guide
For Beta Testers of the Adaptensor Platform

beta.adaptensor.io
February 2026  |  Version 1.0

Adaptensor, Inc.  |  Confidential
 
Table of Contents
1. Welcome to the Beta Program
2. What You Are Testing
3. Getting Started (Step-by-Step)
4. Navigating the Beta Portal
5. Submitting a Bug Report
6. Submitting a Feature Request
7. Using the Issue Tracker
8. Severity & Status Reference
9. Platform URLs & Access Points
10. FAQ
11. Contact & Support
 1. Welcome to the Beta Program
Thank you for joining the Adaptensor Beta Testing Program. You are among the first people in aviation maintenance to test a platform that combines FAA-compliant MRO tracking with full double-entry accounting in a single modern web application. Your feedback directly shapes what we build and ship.
This guide covers everything you need to get started, navigate the beta portal, submit bug reports and feature requests, and understand how the program works. Please read through it before you begin testing.
What Beta Testers Get
Full platform access with demo data pre-loaded, direct input on the product roadmap, founding member pricing locked in at GA launch, and your name in the launch credits as a founding beta tester.
The beta covers three Adaptensor products:
•	AdaptAero — Aviation MRO maintenance tracking, compliance, parts traceability, FAA forms
•	AdaptBooks — Point of sale, inventory, full general ledger accounting, AP/AR, financial reporting
•	AdaptVault — Secure document storage with AI analysis, auto-trigger release, retention compliance
All three products share one authentication system, so you sign in once and can access everything your beta access covers.

2. What You Are Testing
The platform is in active beta with 12 modules at varying stages of readiness. Here is the current status of each module:
Module	Product	Status	Progress
Aircraft Registry	AdaptAero	LIVE	100%
Work Order Engine	AdaptAero	LIVE	100%
Compliance Engine (AD/SB)	AdaptAero	LIVE	100%
Parts Traceability & 8130-3	AdaptAero	LIVE	100%
FAA Form Generation (337)	AdaptAero	LIVE	100%
Personnel & Calibration	AdaptAero	LIVE	100%
Reporting & Analytics	AdaptAero	BETA	90%
AdaptGent Aviation AI	AdaptAero	BETA	85%
Customer Portal (Owner)	AdaptAero	BETA	80%
POS / Register	AdaptBooks	LIVE	100%
Inventory Management	AdaptBooks	LIVE	100%
Accounting / General Ledger	AdaptBooks	LIVE	100%
AP / AR / Statements	AdaptBooks	LIVE	100%
Financial Reporting	AdaptBooks	LIVE	100%
Customer Management	AdaptBooks	LIVE	100%
Onboarding Wizard	AdaptBooks	BETA	70%
Document Vault	AdaptVault	BETA	75%
AI Document Analysis	AdaptVault	DEV	50%
Data Migration Wizard	AdaptAero	DEV	60%
LIVE modules are fully functional and ready for thorough testing. BETA modules are functional but may have rough edges. DEV modules are partially built and available for early feedback on the direction.
Important: This Is Beta Software
Do not use this platform for production maintenance records until we announce the v1.0 GA release. Demo data is pre-loaded for testing. Your test data may be reset during the beta period. All FAA regulatory features should be verified against current FARs before relying on them operationally.

3. Getting Started (Step-by-Step)
Follow these steps to get up and running. The entire process takes about 5 minutes.
Step 1: Register for Beta Access
1.	Go to beta.adaptensor.io/register
2.	Fill out the registration form with your name, email, company name, your role (A&P Mechanic, IA Inspector, Shop Owner, etc.), and the aircraft types you work on.
3.	Select what MRO software you currently use (Corridor, CAMP, paper/spreadsheets, etc.) so we understand where you are coming from.
4.	Check which products you are most interested in testing: AdaptBooks, AdaptAero, AdaptVault, or All of the Above.
5.	Check the beta agreement box confirming you understand this is beta software.
6.	Click Register for Beta Access.
You will see a confirmation screen. Your application will be reviewed, and most testers are approved within 24 hours.
Step 2: Check Your Email
Once approved, you will receive an email at the address you registered with. The email contains a confirmation of your beta access and a link to the portal.
Step 3: Sign In to the Portal
1.	Go to beta.adaptensor.io and click Login in the top navigation.
2.	Sign in with the email you registered with. You can use email/password or Google sign-in.
3.	You will land on your Portal Dashboard with stats, quick actions, and recent activity.
Step 4: Access the Products
The beta portal is your command center for reporting and tracking. To actually test the products, use these URLs:
Product	URL	What It Does
AdaptAero	aviation.adaptensor.io	Aviation MRO platform
AdaptBooks	books.adaptensor.io	POS + Accounting
AdaptVault	vault.adaptensor.io	Secure document vault
Beta Portal	beta.adaptensor.io	Bug reports & feedback
All products use the same sign-in. Once you authenticate at any adaptensor.io subdomain, you are signed in across all of them.
Step 5: Explore the Demo Data
Each product comes pre-loaded with realistic demo data so you can see how everything works without entering your own data first. AdaptAero includes sample aircraft (Cessna 172, Piper Cherokee, Beechcraft Bonanza), sample work orders at various statuses, sample ADs, parts with 8130-3 tags, and mechanic profiles. Explore freely and try every feature you can find.

4. Navigating the Beta Portal
After signing in, you will see the portal layout with a sidebar on the left and your content area on the right. Here is what each section does:
Sidebar Link	What It Does
Dashboard	Your home base. Shows your report count, open issues across all testers, recently fixed bugs, and your vote count. Also shows quick action buttons and latest announcements.
Report Bug	Opens the bug report form. Use this when you find something broken, wrong, or confusing.
Request Feature	Opens the feature request form. Use this when you want something that does not exist yet.
Tracker	The full issue tracker. See every bug and feature request from all beta testers, with filters for status, severity, category, and search.
My Reports	Your personal submissions. See only the bugs and features you have submitted, with their current status.
Announcements	Changelog and news feed. New releases, breaking changes, and maintenance notices appear here.

5. Submitting a Bug Report
Bug reports are the most valuable feedback you can give us. A good bug report saves hours of debugging time. Here is how to submit one and what makes a great report.
When to Submit a Bug Report
•	Something is broken (error message, crash, blank page, 500 error)
•	Something does not work as described (button does nothing, calculation is wrong)
•	Data is lost, corrupted, or displayed incorrectly
•	The interface is confusing or misleading (you expected one thing but got another)
•	Performance is unacceptable (page takes 10+ seconds to load, form freezes)
How to Submit
1.	Click Report Bug in the sidebar, or use the quick action on your dashboard.
2.	Bug Title: Write a short, specific title. Good: "AD compliance date off by one day in timezone UTC-6." Bad: "Dates are wrong."
3.	Module: Select the module where you found the bug (Aircraft Registry, Work Orders, Compliance, etc.).
4.	Severity: Choose how bad it is (see severity guide in Section 9).
5.	Steps to Reproduce: List the exact steps someone else would follow to see the same bug. Be specific with what you clicked, what you typed, and what page you were on.
6.	Expected vs. Actual: Tell us what should have happened and what actually happened instead.
7.	Screenshots: Upload screenshots showing the problem. A picture of an error message is worth a thousand words. You can upload multiple images (PNG, JPG, GIF, up to 10MB each).
8.	Console Errors: If you see errors in your browser console (press F12 to open it), paste them into the console errors field. This is optional but extremely helpful.
9.	Click Submit Bug Report.
Pro Tip: How to Get Console Errors
Press F12 (or right-click the page and select Inspect), then click the Console tab. If there are red error messages, right-click the error and choose Copy Message, then paste it into the Console Errors field of your bug report. This gives our developers the exact error stack trace they need to fix the issue quickly.

6. Submitting a Feature Request
Feature requests tell us what you wish the platform could do. They directly shape our development roadmap. The most-voted features get built first.
When to Submit a Feature Request
•	A workflow you do daily is not supported yet
•	You want a report, view, or export that does not exist
•	A competitor product has a capability you rely on that we are missing
•	You have an idea that would save you time or reduce errors
How to Submit
1.	Click Request Feature in the sidebar.
2.	Feature Title: Short and descriptive. Good: "Bulk import ADs from CSV for fleet operators." Bad: "Better AD stuff."
3.	Module and Priority: Select which module it belongs to and how important it is to your operations.
4.	Description: Describe what the feature should do in detail. The more specific you are, the better we can build it.
5.	Use Case: Explain how you would use this in your daily operations. Real-world scenarios help us prioritize and design the feature correctly.
Voting on Features
Every feature request has a vote button. When you see a feature that someone else submitted and you also want it, click the vote button to add your support. Features with more votes get prioritized higher on our roadmap. You can vote on as many features as you want, but only once per feature.

7. Using the Issue Tracker
The Tracker page shows every bug report and feature request from all beta testers in one combined view. You can use it to see what others have found, avoid submitting duplicates, and follow the status of issues you care about.
Filtering and Sorting
•	Tab toggle: Switch between All, Bugs only, or Features only.
•	Status chips: Click status badges to filter (e.g., show only Fixed items).
•	Severity filter: Filter by Critical, High, Medium, or Low.
•	Category dropdown: Filter by module (Aircraft Registry, Compliance, etc.).
•	Sort options: Newest first, Oldest first, Most Voted, or by Severity.
•	Search: Type keywords to search issue titles.
Click any row to open the full detail page where you can read the full report, see screenshots, read comments, and add your own comments.
Comments and Discussion
Every bug report and feature request has a comment thread at the bottom. Use comments to add additional context, confirm you see the same bug, suggest workarounds, or ask questions. Admin responses (from the development team) are highlighted with a gold border and ADMIN badge so you can easily spot official updates.

8. Severity & Status Reference
Severity Levels (for bug reports)
When you submit a bug, choose the severity that best matches the impact:
Severity	When to Use	Example
Critical	Data loss, security issue, or system crash. The platform is unusable.	Work order data disappears after saving. Cannot sign in at all.
High	Major feature is broken. Workaround exists but it is painful.	Cannot add parts to a work order. Annual inspection checklist does not save.
Medium	Feature works but has a noticeable problem.	AD date calculation off by one day. PDF form has wrong field alignment.
Low	Cosmetic issue or minor inconvenience.	Typo in a label. Button color is slightly off. Tooltip is missing.
Bug Report Statuses
Status	What It Means
Submitted	Your report has been received. It is in the queue for review.
Confirmed	We have reproduced the bug and confirmed it is a real issue.
Investigating	A developer is actively looking into the root cause.
In Progress	A fix is being coded and tested.
Fixed	The fix has been deployed. Please verify it works for you.
Closed	Verified fixed and closed, or determined to be working as intended.
Duplicate	This issue was already reported by another tester.
Feature Request Statuses
Status	What It Means
Submitted	Your request has been received and is in the review queue.
Under Review	The team is evaluating the request for feasibility and priority.
Planned	Approved and added to the development roadmap.
In Progress	Currently being built.
Shipped	The feature is live. Check the latest release.
Declined	Not something we plan to build. An explanation will be provided.

9. Platform URLs & Access Points
URL	Description
beta.adaptensor.io	Beta Testing Portal — bug reports, features, tracker, prompts
beta.adaptensor.io/register	Register for the beta program
beta.adaptensor.io/status	Public module status board
aviation.adaptensor.io	AdaptAero — Aviation MRO platform
books.adaptensor.io	AdaptBooks — POS + Accounting platform
vault.adaptensor.io	AdaptVault — Secure document vault
adaptensor.io	Adaptensor corporate site
adaptbooks.io	AdaptBooks marketing site

10. FAQ
Q: Can I use this for real maintenance records during beta?
No. Beta data may be reset at any time. Do not enter production maintenance records, real customer data, or FAA compliance documentation until the v1.0 GA release. Use the pre-loaded demo data for all testing.
Q: How often do you release updates?
We deploy updates multiple times per week during beta. Check the Announcements page for release notes. Major changes are communicated via email.
Q: I found a bug but someone else already reported it. Should I still submit?
Check the Tracker first. If you see the same bug, add a comment to the existing report with any additional details (especially different steps to reproduce or different browsers). If you are not sure it is the same bug, go ahead and submit. We can mark it as a duplicate.
Q: What happens to my feedback after beta?
Every bug report and feature request stays in our system permanently. Your contributions during beta directly influenced what shipped in v1.0. Beta testers get founding member pricing and recognition at launch.
Q: Can I invite someone from my shop to join the beta?
Yes. Have them go to beta.adaptensor.io/register and fill out the form. Mention your shop name so we can associate your accounts. Multiple testers from the same shop are very valuable because you catch different things based on your role.
Q: What browsers are supported?
Chrome, Firefox, Safari, and Edge (latest versions). Mobile browsers work as well. If you find a browser-specific issue, please note the browser and version in your bug report.
Q: Is my data secure during beta?
Yes. The platform uses Clerk for authentication (enterprise-grade SSO), Neon PostgreSQL with row-level security for data isolation, and all connections are encrypted with TLS. Your test data is isolated from other beta testers. No tester can see another tester's data.

11. Contact & Support
If you need help, have questions about the beta program, or encounter something urgent:
•	Email: jamie@adaptensor.com
•	In-portal: Submit a bug report with the category set to Other
•	Comments: Add a comment on any issue in the Tracker and an admin will respond
For critical bugs that prevent you from using the platform at all, email directly with the subject line BETA CRITICAL and include what you were doing when the issue occurred.

Thank You
Your time and feedback are invaluable. You are helping build the platform that will change how thousands of aviation maintenance shops manage their operations. We do not take that lightly. Every bug report, every feature request, every comment makes the product better for everyone.

Adaptensor, Inc.
Built with purpose. Built to last. Built to fly.
