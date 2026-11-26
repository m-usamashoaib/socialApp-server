# Auctioneer's Hub · API server

Backend for **Auctioneer's Hub**, a social network for digital artists combined with an NFT marketplace. Creators post their work, build a following, and sell it as NFTs at a fixed price, by auction or through open offers.

Final-year project, BS Computer Science, GC University Lahore (2023).

| Part | Repository |
|---|---|
| **API server** (this repo) | Node.js · Express · MongoDB |
| Social app | [socialApp-client](https://github.com/m-usamashoaib/socialApp-client) |
| NFT marketplace | [nft-marketplace](https://github.com/m-usamashoaib/nft-marketplace) |

**👤 Built by** [Muhammad Usama Shoaib](https://m-usamashoaib.github.io) (most of the API and both front-ends) in a two-person team. The MetaMask wallet flow was built by my teammate and is not part of these repositories.

## Features

**Social**
- Register and log in with **JWT stored in an HTTP-only cookie**; passwords hashed
- Profiles with avatar and cover photo, follow / unfollow, user discovery
- Posts with images: **timeline**, likes, comments and shares
- **Stories** that expire automatically after 24 hours
- Notifications (single or to all followers), with seen / unseen state

**Marketplace**
- Create NFTs with **royalties** and **limited editions** (total / available / sold copies), grouped into collections
- Three ways to sell: **fixed price**, **timed auction** and **open offers**
- Bids with history; save / unsave NFTs; top collectors
- **Auctions close automatically**: a scheduled job transfers each finished auction to its highest bidder

## How it works

```
 Social app (React, :3000) ──┐                        ┌── MongoDB
                             ├── /api/v1  Express ────┤   users · posts · stories · notifications
 NFT marketplace (:3001) ────┘   (port 4000)          │   nfts · collections
                                      │               └── public/upload  (images)
                                      └── node-cron job (every few seconds)
                                            • delete expired stories and their images
                                            • close finished auctions → highest bidder becomes owner
```

### API (prefix `/api/v1`)

| Area | Endpoints |
|---|---|
| Users | `POST /user/register` · `POST /user/login` · `GET /user/logout` · `GET /user/profile/me` · `GET /user/profile/:id` · `PUT /user/follow/:id` · `PUT /user/update/profile` · `PUT /user/update/cover` · `PUT /user/update/password` · `GET /user/all` · `GET /user/landers` |
| Posts | `POST /post/create` · `GET /post/timeline` · `PUT /post/like/:id` · `POST /post/comment` · `POST /post/share` · `GET /post/:id` · `DELETE /post/:id` |
| Stories | `POST /story/create` · `GET /story/all` · `GET /story/users` |
| Notifications | `POST /notification/single` · `POST /notification/all` · `GET /notification/user` · `GET /notification/seen` |
| NFTs | `POST /nft/create` · `GET /nft/all` · `GET /nft/active` · `GET /nft/:id` · `GET /nft/user/:id` · `GET /nft/owned/:id` · `GET /nft/saved` · `PUT /nft/save/:id` |
| Buying | `POST /nft/fixed/:id` · `POST /nft/auction/:id` (place bid) · `POST /nft/open/:id` (open offer) |
| Collections | `GET /nft/collections` · `GET /nft/collectors` · `GET /nft/collection/my/:id` · `GET /nft/collection/:uid/:cid` |

Routes that change data require the auth cookie.

## Tech stack

Node.js · Express · MongoDB / Mongoose · JWT · bcrypt · express-fileupload · node-cron · Winston

## Run locally

```bash
npm install
cp config/.env.example config/.env   # then fill in the values
npm run dev                           # http://localhost:4000
```

In `config/.env`, set at least `PORT=4000` (both front-ends proxy to this port), `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN` and `COOKIE_EXPIRE`.

Then start the [social app](https://github.com/m-usamashoaib/socialApp-client) on port 3000 and the [marketplace](https://github.com/m-usamashoaib/nft-marketplace) on port 3001.

## What I'd improve today

- **Payments and ownership on-chain:** purchases and bids are recorded in MongoDB; settling them through the wallet would make ownership verifiable.
- **Database transactions** around buying, so two buyers can't take the last copy at the same time.
- **Event-driven auction closing** (or a delayed job per auction) instead of polling every few seconds.
- **Cloud storage** (e.g. S3 or Cloudinary) for uploads instead of the local `public/` folder.
- Input validation, rate limiting and tests; finish the email helper (Nodemailer isn't installed yet).

## License

MIT
