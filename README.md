# King J's Taxi Service and Tours Grenada — website

Static site. No build step. Open `index.html` to preview, or drag the folder onto Netlify
Drop / Cloudflare Pages / GitHub Pages to publish.

```
index.html      Overview — opens on the About Us screen, then stats, quick book,
                filterable grid, island map, taxi, drivers, photos, reviews, booking
about.html      Our story, mission, the Royalty Experience, why choose us, what we offer
tours.html      The four tours in full
contact.html    Booking form + FAQ
assets/css/style.css
assets/js/main.js
assets/img/     Logo files + placeholder imagery
assets/video/   hero.mp4, hero-mobile.mp4 (header) + welcome.mp4 (pop-up)
assets/css/welcome-popup.css, assets/js/welcome-popup.js
```

Colours are sampled from the logo: cyan `#0FC1DD` → teal `#50C9B8` → green `#86CE9E`
→ lime `#B4D481` → yellow `#FBDF5A`, on black. Backgrounds stay white.

---

## 1. Media — what's real, what's stock, what's still placeholder

### The hero video — King J's own footage

Drone footage of a Grenada waterfall (IMG_4968), 19 seconds, muted, looping behind the
About Us intro. The Pexels stock clip and the generated fallback loop are gone.

- `hero.mp4` — 1920×1080 cut for laptops and tablets (8.5 MB)
- `hero-mobile.mp4` — full portrait frame, loaded automatically on phones (4.5 MB)
- `hero-poster.jpg` / `hero-poster-mobile.jpg` — first frame, shown while the video loads

### Welcome pop-up video

A second drone shot (IMG_4954, 9 seconds) plays in a pop-up card over the home page
(`welcome.mp4`, 3.9 MB, poster `welcome-poster.jpg`).

- Appears 1.2 seconds after the home page opens, once per visit (shows again on a new visit).
- Closes with the ×, "Explore the site", a click outside the card, or Esc.
- "Book on WhatsApp" opens wa.me/14734198788.
- Text lives at the bottom of index.html (search for `kj-welcome`).
- Home page only. To show it on other pages, copy the welcome-popup.css link from the
  `<head>` and the `kj-welcome` block + script from the bottom of index.html.

### Photos — all from King J's own library

Every image is one of the photographs supplied. No stock anywhere on the site.

The six tiles under "Everything we run":

| Tile | Photo |
|---|---|
| Rum, chocolate and waterfall | Cocoa rum liqueurs and fresh cocoa pods at the tasting |
| The full island day | St. George's and the Carenage from the air at sunset |
| Waterfalls and rainforest | Annandale Falls |
| Airport transfers | Maurice Bishop International from the hillside |
| A driver for your whole stay | The four drivers in King J's polos above Grand Anse |
| Spice Mas, cricket and groups | An ole mas band on the road |

Elsewhere: Clarke's Court and House of Chocolate on the Tours page, the mona monkey on
the island tour, four guests at Annandale on the waterfalls tour, river tubing on
build-your-own-day, the driver in the green shirt with two guests on the About page, and
the six-square "Lately, on the road" grid.


**Faces.** A lot of identifiable guests appear, including children in the Clarke's Court
group shot. Worth confirming people are happy to be on a public website before launch —
especially that one.

### The drivers section

Two people now, each with a portrait: **Joel Francis** (owner) and **Carlos** (driver and
guide). The photos sit in 4:5 frames so heads and shoulders fill the space without
cropping. If a third driver joins, copy one of the two blocks in `index.html` and add a
`driver-<name>.jpg` at roughly 1000×1250.

### Navigation

Overview, About, Tours, Taxi, Drivers, Reviews, Book. The Photos link is gone; the
"Lately, on the road" grid is still on the Overview page, just no longer in the menu.

## 2. The About Us screen

The site now opens on About Us: the first hero screen carries the short intro paragraph
with a **Read more about us** button leading to `about.html`, which holds the full text —
Our Story, Our Mission, Discover Grenada With Us, The Royalty Experience, Why Choose
King J's, What We Offer, and Our Promise. "About" is in the main nav and the footer.

The rainforest video plays behind this screen too, so the intro sits over moving footage
rather than a flat panel. The two slides after it (the 4.9-star pitch, then the rainforest
tours) rotate on the same background.

One wording note: the copy says "countless five-star reviews on Tripadvisor and Google",
while the stats strip just below says 4.9 from 65 reviews. Both are true and they read
fine together, but if you would rather they matched exactly, the stats strip is the easier
one to soften.

## 3. Contact details

Phone from the logo is live everywhere: **+1 (473) 419 8788**, and `14734198788` for the
WhatsApp handoff. **Still placeholder:** `bookings@example.com`, marked `<!-- TODO -->` in
the contact panel and footer. Swap it or delete those lines.

## 4. The map

The outline is Grenada's actual coastline (Natural Earth 1:10m geometry), stroked with the
logo gradient. Nine stops plotted at true coordinates.

## 5. Content sources and things to check

From the public Tripadvisor listing and the GetYourGuide supplier page. Before launch:

- "4.9 from 65 travellers" and "#4 of 57" are hard-coded and will drift.
- Only the rum/chocolate/waterfall tour has a published price.
- Review quotes are short attributed excerpts.
- Deshon and Jahvon are named publicly based on reviews. They should agree, and confirm
  spellings.

## 6. Before launch

- [ ] Rights confirmed for the GTA-looking photos; Kyle Wicomb credited if required
- [ ] A chocolate/distillery photo for `card-chocolate.jpg`; van and driver photos
- [ ] Six Instagram photos saved as `ig-1.jpg` … `ig-6.jpg`
- [ ] Real email in place
- [ ] Prices confirmed; driver names approved
- [ ] Domain, hosting, Google Business Profile
