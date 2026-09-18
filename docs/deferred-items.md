# Deferred items register

Recorded so that setting something aside stays a decision rather than an
oversight. **Nothing here blocks launch**, but some of it should not stay
deferred for long.

## Deferred by the product owner

- Automated testing
- Penetration testing and security review
- Load testing and scalability work
- Performance targets and uptime monitoring

## Deferred with the BRD

The BRD (`prereq/`) and its 56-item gap analysis were set aside, so the intent
files won every conflict. These BRD requirements are therefore **not built**:

| Item | BRD reference |
| --- | --- |
| CIKA AI chatbot, including conversation logs | FR-006 – FR-010 |
| Jobstreet integration and job synchronisation | FR-038 – FR-040 |
| FAQ module | FR-031 |
| Member directory with filter and search | FR-016 |
| Management team section | Data Requirements |
| News category and year filters | FR-026 |
| Complaint Resolution as a submittable form | FR-034 |
| Auto-reply confirmation email | FR-036 |
| Scheduled publishing and content preview | FR-030 |
| One-click rollback in the admin interface | FR-044 |
| Brochure downloads and per-product CTAs | FR-020 |
| Per-solution PIC email routing | FR-022, FR-033 |
| GA4, Search Console and GEO dashboards | FR-046 – FR-049 |
| CAPTCHA on forms | NFR Security |

**hreflang tags were originally on this list and have since been built** — they
are a small piece of work that materially helps a bilingual site rank, so they
were pulled back in during Phase 6.

## Owned by CLIK, not by engineering

- Replacing placeholder text, images and sample content
- Legal review of the four policy and how-to pages
- Verifying the external URLs
- Deciding the fate of the 10 management profiles and the CEO letter, which
  exist on the old site but have no equivalent on the new one

## Worth revisiting soon

**Basic analytics.** Without it there is no way to tell whether the new site
performs better than the one it replaced — and the comparison is only possible
if measurement starts at launch, not months later.

**Uptime monitoring.** Nobody is currently alerted if the site goes down.

**Device testing.** The responsive behaviour is implemented and reasoned about,
but has not been opened on a real phone.
