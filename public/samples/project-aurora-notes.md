# Project Aurora: meeting notes

Aurora is Northwind Labs' new self-serve forecasting dashboard for store managers. It replaces the weekly PDF forecasts that Customer Success currently emails to each store.

- **Sponsor:** Hana Okafor (CEO)
- **Product lead:** Priya Sandhu
- **Engineering lead:** Tomás Reyes
- **Design:** Ellie Marsh
- **Customer Success:** Kwame Boateng
- **Total budget:** £62,000 (agreed at kickoff), held by Priya

---

## Kickoff (8 September 2026)

**Attendees:** Hana, Priya, Tomás, Ellie, Kwame

### Discussion

- Store managers at our two largest customers, FreshWay and Daly's Market, say the weekly PDF arrives too late to change their Monday orders. They want to see Sunday's forecast by Saturday evening.
- Tomás proposed building Aurora on the existing forecasting API rather than a new service. Agreed: it keeps the first version small.
- Ellie wants at least one round of in-person user testing with store managers before the beta.

### Decisions

- The first release covers fresh produce and bakery only. Chilled and frozen come later.
- Forecasts in Aurora refresh every 6 hours, not in real time.
- The budget is **£62,000**: £48,000 for engineering contractors, £9,000 for design and user research, and £5,000 contingency.

### Actions

- Priya: write the one-page product brief by 12 September.
- Tomás: estimate the engineering work and flag anything over 3 weeks.
- Ellie: plan the user-testing round and cost the travel.

---

## Design review (29 September 2026)

**Attendees:** Priya, Tomás, Ellie

### Discussion

- Ellie showed three dashboard layouts. Store managers in the remote interviews preferred layout B, which leads with "what to order tomorrow" instead of charts.
- Tomás said layout B needs a new endpoint that returns order suggestions, about 4 extra days of work.
- Daly's Market has stores in Portugal, so user testing will include their Lisbon store.

### Decisions

- Go with layout B.
- User testing will run in **Lisbon from 20 to 23 October** with four people: Ellie, Priya, Kwame and one engineer (Anika Shah).

### Travel plan for Lisbon (from Ellie)

| Item | Cost |
|---|---|
| Return flights Manchester to Lisbon, economy (2h 45m each way), 4 people | £1,160 |
| Hotel, 3 nights, 4 rooms at €165 a night | £1,710 (about €1,980) |
| Meals, £45 a day for 4 people for 4 days | £720 |
| Taxis and local transport | £210 |
| Thank-you vouchers for store staff | £400 |
| **Total** | **£4,200** |

### Actions

- Priya: get Finance sign-off for the Lisbon trip, because it is over the £1,500 limit, before anyone books.
- Ellie: book through TravelDesk once Finance has approved.

---

## Weekly check-in (13 October 2026)

**Attendees:** Priya, Tomás, Kwame

### Discussion

- Finance approved the Lisbon trip on 9 October. Bookings are done.
- The order-suggestions endpoint is finished and in review.
- Kwame raised that FreshWay's IT team requires single sign-on (SSO) through their Okta account before any of their staff can use a new tool. This was not in the original scope.

### Decisions

- SSO with Okta becomes part of the beta scope. Tomás estimates 6 days of work.

### Actions

- Tomás: start the Okta integration this week.
- Kwame: get FreshWay's security questionnaire filled in early so it doesn't block the beta.

---

## Post-testing review (27 October 2026)

**Attendees:** Hana, Priya, Tomás, Ellie, Kwame, Anika

### What we learned in Lisbon

- All six store managers could find tomorrow's order suggestions in under 30 seconds.
- Four of six asked to see last week's actual sales next to the forecast. Ellie will add a "last week" column.
- Nobody used the date picker. It will be hidden behind a "more" menu.

### Beta date

The beta was planned for **3 November**. It has been **moved to 17 November** because FreshWay's security review of the Okta SSO integration failed on 24 October: the session timeout was set to 24 hours, and their policy requires 8 hours or less. Tomás needs a week to fix it and FreshWay needs a week to re-review.

Hana asked whether we could launch without FreshWay. We decided not to: FreshWay is half of the beta's stores, and launching without them would not tell us much.

### Budget update (from Priya)

- Spent so far: £31,400, including the Lisbon trip, which came in at £4,050, £150 under its plan.
- The SSO work and the two-week delay are expected to use about £3,500 of the £5,000 contingency.

### Actions

- Tomás: fix the Okta session timeout by 3 November.
- Kwame: book FreshWay's re-review for the week of 3 November.
- **Tomás owns the launch checklist and must have it complete by 13 November**, so there is a full working day to fix anything before the beta.
- Ellie: ship the "last week" column and hide the date picker by 10 November.
