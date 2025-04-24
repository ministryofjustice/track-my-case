# Component Reference: UI Macros

This file documents the reusable Nunjucks macro components in this project.

---

## 🧩 `actionCard`

A reusable card-style block used to highlight a call to action on pages such as the citizen dashboard.

### Macro Signature

```nunjucks
{% macro actionCard(title, description, href, linkText, variant='default', count=null) %}
```

### Parameters

| Parameter     | Type     | Required | Description                                                       | Example                             |
| ------------- | -------- | -------- | ----------------------------------------------------------------- | ----------------------------------- |
| `title`       | `string` | ✅       | The heading text for the card (bold)                              | `"Manage documents"`                |
| `description` | `string` | ✅       | Supporting body text                                              | `"View documents for this case..."` |
| `href`        | `string` | ✅       | The destination link URL                                          | `"/documents"`                      |
| `linkText`    | `string` | ✅       | The visible link or button label                                  | `"Manage documents"`                |
| `variant`     | `string` | ❌       | Optional variant: `"default"` or `"emphasised"` (for a blue card) | `"emphasised"`                      |
| `count`       | `number` | ❌       | Optional number shown in a badge next to the link                 | `1`                                 |

### Examples

#### Default

```nunjucks
{{ actionCard(
  "View updates on your case",
  "Get updates from case workers and view case details, including bail conditions.",
  "/updates",
  "View updates",
  "default",
  1
) }}
```

#### Emphasised

```nunjucks
{{ actionCard(
  "The Victims Code",
  "Learn about your rights as a crime victim, including available support.",
  "/victims-code",
  "Read about the Victims Code",
  "emphasised"
) }}
```

---

## promoPanel

The `promoPanel` component is used to display highlighted informational or promotional content, optionally with an image and call-to-action link.

### Macro signature

```nunjucks
{% macro promoPanel(title, description, href = null, linkText = null, image = null, variant = 'default') %}
```

### Parameters

| Name          | Type     | Required | Description                                                                               |
| ------------- | -------- | -------- | ----------------------------------------------------------------------------------------- |
| `title`       | `string` | ✅       | Title of the panel                                                                        |
| `description` | `string` | ✅       | Descriptive text inside the panel                                                         |
| `href`        | `string` | ❌       | Optional link URL                                                                         |
| `linkText`    | `string` | ❌       | Optional link label                                                                       |
| `image`       | `string` | ❌       | Optional image path. If provided, image appears beside the content in a two-column layout |
| `variant`     | `string` | ❌       | Can be `"default"` or `"highlight"`. Adds a visual emphasis if set to `"highlight"`       |

### Behaviour

- If an image is provided, the layout will be split into two columns using GOV.UK grid classes (`.govuk-grid-column-one-half`).
- If no image is provided, content will span the full width.
- The `"highlight"` variant applies a different background and style, and positions the title in the body section.

### Example usage

```nunjucks
{{ promoPanel(
  "Need help understanding the process?",
  "Learn what to expect after a hearing or decision and what your next steps might be.",
  "/support-guidance",
  "View guidance",
  "/assets/images/<image-name>",
  "highlight"
) }}
```

---

## 🧩 `supportBox`

A reusable visual container used to display contextual support messages, typically at the bottom of a content-heavy page.

### Macro Signature

```nunjucks
{% macro supportBox(title, description, linkHref, linkText) %}
```

### Parameters

| Parameter     | Type     | Required | Description                   | Example                           |
| ------------- | -------- | -------- | ----------------------------- | --------------------------------- |
| `title`       | `string` | ✅       | Main heading shown in the box | `"Need more help?"`               |
| `description` | `string` | ✅       | Supporting body text          | `"You can request a callback..."` |
| `linkHref`    | `string` | ✅       | The link URL                  | `"/support-request"`              |
| `linkText`    | `string` | ✅       | Text for the link or button   | `"Request support"`               |

### Example

```nunjucks
{{ supportBox(
  "Need more help?",
  "To request a callback or additional support, click the button below.",
  "/support-request",
  "Request support"
) }}
```
