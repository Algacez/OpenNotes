---
slug: docusauruscomment
title: Docusaurus配置twikoo评论
authors: [rock]
tags: [tutorial]
---

## twikoo

<!-- truncate -->

```
version: '3'
services:
  twikoo:
    image: imaegoo/twikoo
    container_name: twikoo
    restart: unless-stopped
    ports:
      - 8080:8080
    environment:
      TWIKOO_THROTTLE: 1000
    volumes:
      - ./data:/app/data
```

