# net-background
![image](https://github.com/Saturn-VI/netbackground/assets/112597058/3117eb64-0f12-46bd-9618-cb9ebb1b6f8c)
it ~~mostly~~ just looks fancy
## features (there's like 3)
- it automatically styles and sets up a container if it has the id 'background-container'
- it treats your cursor as a point and makes it stronger (pretty much a given)
- particles spawn at the cursor when mouse is clicked
- number of points, maximum draw range, and speed scale (pretty well, at that: pointcount uses regressions and draw distance/speed scale with the canvas size anyways)

## todo
- at this point there isn't really anything left to do that's worth the time, so it could be considered done

## running
```
$ node server
```
## if you want to run it on an actual site
- add `<script src="netbackground.js" defer></script>` to `<head>`
- add `<container id="background-container"></container>` to the start of `<body>`
