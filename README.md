# net-background
![image](https://github.com/Saturn-VI/netbackground/assets/112597058/ffb4d0a9-8486-4789-9b8a-7370c98114fa)
it ~~mostly~~ just looks fancy
## features (there's like 3)
- it automatically styles and sets up a container if it has the id 'background-container'
- it treats your cursor as a point and makes it stronger (pretty much a given)
- particles spawn at the cursor when mouse is clicked
- number of points (using regressions lmao), maximum draw range (using canvas size), and speed (also using canvas size) scale
- respects prefers-reduced-motion

## todo
- nothing! unless you want to make an issue

## running the example site
```
$ node server
```

## if you want to run it your own website
- add `<script src="netbackground.js" defer></script>` to `<head>`
- add `<container id="background-container"></container>` to the start of `<body>`
