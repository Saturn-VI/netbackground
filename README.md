# net-background
![image](https://github.com/Saturn-VI/netbackground/assets/112597058/3117eb64-0f12-46bd-9618-cb9ebb1b6f8c)
it ~~mostly~~ just looks fancy
## features (there's like 3)
- it automatically styles and sets up a container with id 'background-container'
- it treats your cursor as a point and makes it stronger (pretty much a given)
- you can sort of change the variables at the start, but then the regressions need to be re-calculated
- particles spawn at the cursor when mouse is clicked
- number of points, maximum draw range, and (kind of) speed

## todo
- make alpha curve reverse logarithmic
- fix the lines and circles so they aren't so blurry (top priority)

## running
```
$ node server
```
## if you want to run it on an actual site
- add `<script src="netbackground.js" defer></script>` to `<head>`
- add `<container id="background-container"></container>` to the start of `<body>`
