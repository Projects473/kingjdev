# Editing the website — setup and day-to-day use

The site is still a plain static site on GitHub Pages. What changed is where the
words and photos live: they are now in four files in the `content` folder, and
the pages read them when they load.

    content/site.json      phone, WhatsApp, email, address, hours, welcome pop-up
    content/tours.json     the four tours, their stops, prices, photos, Spice Mas
    content/drivers.json   Joel, Carlos, Deshon
    content/gallery.json   the gallery video and the photo albums

Nobody has to edit those files by hand. Pages CMS gives the client a login and a
set of forms that write to them.

---

## One-time setup (Greg)

1. Push this site to the GitHub repository as usual, including the hidden
   `.pages.yml` file at the top level and the `content` folder.
2. Go to **app.pagescms.org** and sign in with GitHub.
3. Install the Pages CMS GitHub App on the account that owns the repository,
   and give it access to this repository only.
4. Open the repository in Pages CMS. It reads `.pages.yml` and shows four
   sections in the sidebar: Contact details & pop-up, Tours, Drivers, Gallery.
5. Invite the client: **Settings → Collaborators → invite by email**. They get
   an email invitation and sign in with that email. They do not need a GitHub
   account.

That is the whole setup. There is nothing to pay for and no server to run.

## What happens when the client saves

Pages CMS commits the change to the repository. GitHub Pages rebuilds and the
live site shows the change, usually within a minute or two. Every change is a
commit, so anything can be undone from the repository history.

---

## What the client can change

- **Contact details & pop-up** — phone number, WhatsApp number, email,
  Instagram username, address, opening hours. The whole site updates, including
  every WhatsApp button. Also the pop-up heading, text, video and link, and a
  switch to turn the pop-up off.
- **Tours** — tour names, durations, the stops and their bullet points, what's
  included, the route, prices, the main photo, and the photo strip under each
  tour. Also the wording on the home page cards, and the Spice Mas section.
- **Drivers** — names, roles, write-ups, photos. Adding a driver adds a card.
  The "featured" switch is what puts Joel at the top with a photo carousel.
- **Gallery** — albums, their names and photos, and the video at the top.

Photos are uploaded inside the same forms; they land in `assets/img`.
Videos land in `assets/video`.

## What stays with you

Layout, colours, fonts, the menu, the map, page structure, and anything new
(extra pages, new kinds of sections). The client can't break the design from
the CMS.

---

## Two things worth knowing

**Prices.** Every tour currently says "Price on request". The client can type a
real price into the Price field and it appears on the tours page; the home page
card has its own shorter price field.

**Replacing a video.** Browsers hold on to a file with the same name for a long
time. When swapping a video, upload it under a new filename rather than
overwriting the old one, then pick the new file in the form.

## If the content files can't be read

The pages still contain a copy of the current content, so if a file is deleted
or has a syntax error, the site falls back to what was there when it was built.
It won't show a broken page.
