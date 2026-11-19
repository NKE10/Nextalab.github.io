# NEXTA LAB Storefront

A responsive React + Vite storefront for NEXTA LAB.

## Run locally

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

## Configuration

Create a `.env` file if you want Telegram links to open your store chat directly:

```env
VITE_TELEGRAM_USERNAME=your_telegram_username
```

Do not include the @ symbol. If this is left unset, the site uses Telegram's share flow.

## Features

- Responsive home, shop and about pages
- Product filtering, search and sorting
- Product detail dialog and colour preference
- Shopping bag with quantity controls and local persistence
- Custom keyboard builder with live estimated pricing
- Order request that opens Telegram with a prepared message
- No payment is collected by the site

## Before launch

- Verify all product prices, product specifications and availability.
- Replace sample/illustrative product photography with your own product photos.
- Set `VITE_TELEGRAM_USERNAME` to the correct store username.
- Confirm shipping, preorder timelines, warranty and return terms.
- Connect a backend if you need order records, inventory or online payments.

Product prices and specifications in this starter are editable examples and must be verified before accepting orders.