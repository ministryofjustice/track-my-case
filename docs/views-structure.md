# View Layout Structure

Nunjucks templates live under `server/views/` and follow GOV.UK layout patterns.

```text
views/
├── layout/
│   ├── public.njk
│   ├── citizen-authenticated.njk        # place holder for OneLogin style layour
│   └── staff-authenticated.njk          # proposed - just a placeholder
│
├── partials/
│   ├── header.njk
│   ├── phase-banner.njk
│   └── footer.njk
│
├── components/
│   └── (planned) case-summary-card/
│
├── pages/
│   ├── index.njk
│   ├── victims-support.njk
│   └── case/
│       ├── select.njk
│       └── dashboard.njk
```

Each layout is extended using:

```nunjucks
{% extends "layout/public.njk" %}
```

Or, for authenticationed users, layout is extended using:

```nunjucks
{% extends "layout/citizen-authenticated.njk" %}
```

Component macros are imported only where needed — layouts remain clean and generic.

## TODO

- [ ] citizen-authenticated.njk` is to be updated to use GDS OneLogin header
- [ ] For content heavy pages consider adding `content-section` component that leverages `markdown`
